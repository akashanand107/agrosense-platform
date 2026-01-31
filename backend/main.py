import os
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Define local paths
BASE_MODEL_PATH = "/Users/vinayakprakash/Documents/agrosense-platform/backend/models"

ml_assets = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Initializing AgroSense Intelligence...")
    try:
        # 1. Load Crop Recommender Files
        crop_path = os.path.join(BASE_MODEL_PATH, "crop_recommender")
        ml_assets["crop_model"] = joblib.load(os.path.join(crop_path, "crop_recommender.pkl"))
        ml_assets["scaler"] = joblib.load(os.path.join(crop_path, "scaler.pkl"))
        ml_assets["label_encoder"] = joblib.load(os.path.join(crop_path, "label_encoder.pkl"))
        
        # 2. Load Micronutrient Models
        nutrients = ['S', 'Cu', 'Fe', 'Mn', 'Zn', 'B']
        ml_assets["micro_models"] = {
            n: joblib.load(os.path.join(BASE_MODEL_PATH, f"crop_micronutrient_model_{n}.pkl")) 
            for n in nutrients
        }
        print("✅ Backend ready: All assets loaded.")
    except Exception as e:
        print(f"❌ Initialization Failed: {e}")
    yield
    ml_assets.clear()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SCHEMAS ---

class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float

class MicroInput(BaseModel):
    N: float
    P: float
    K: float
    ph: float
    EC: float
    crop_label: str  # Matches 'crop_label' to be clear

# --- ENDPOINTS ---

@app.post("/predict/crop")
async def predict_crop(data: CropInput):
    try:
        input_df = pd.DataFrame([data.dict()])
        scaled_data = ml_assets["scaler"].transform(input_df)
        prediction_encoded = ml_assets["crop_model"].predict(scaled_data)
        crop_name = ml_assets["label_encoder"].inverse_transform(prediction_encoded)[0]
        return {"recommendation": str(crop_name)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Crop Prediction Error: {str(e)}")

@app.post("/predict/micronutrients")
async def predict_micro(data: MicroInput):
    try:
        # 1. Base Data
        feat = data.dict()
        
        # 2. Replicate One-Hot Encoding (Fixed variable name from 'crop_name' to 'crop_label')
        crops = ['grapes', 'mango', 'mulberry', 'pomegranate', 'potato', 'ragi']
        target_crop = data.crop_label.lower()
        
        for crop in crops:
            feat[f'label_{crop}'] = 1 if crop == target_crop else 0

        # 3. Replicate Feature Engineering Math
        feat['P_K_ratio'] = feat['P'] / (feat['K'] + 1e-5)
        feat['N_P_ratio'] = feat['N'] / (feat['P'] + 1e-5)
        feat['N_K_ratio'] = feat['N'] / (feat['K'] + 1e-5)
        feat['NPK_sum'] = feat['N'] + feat['P'] + feat['K']
        feat['ph_EC_interaction'] = feat['ph'] * feat['EC']

        # 4. Force exact Column Order as per training script
        cols_order = [
            'N', 'P', 'K', 'ph', 'EC', 
            'label_grapes', 'label_mango', 'label_mulberry', 
            'label_pomegranate', 'label_potato', 'label_ragi',
            'P_K_ratio', 'N_P_ratio', 'N_K_ratio', 'NPK_sum', 'ph_EC_interaction'
        ]
        
        # Remove the 'crop_label' string before making the DF
        del feat['crop_label']
        df_input = pd.DataFrame([feat])[cols_order]

        # 5. Predict per nutrient
        results = {}
        log_targets = ['Cu', 'Zn', 'Fe']
        for n, model in ml_assets["micro_models"].items():
            pred = model.predict(df_input)[0]
            if n in log_targets:
                pred = np.expm1(pred)
            results[n] = round(float(pred), 4)

        return results
    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=f"Micro Prediction Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)