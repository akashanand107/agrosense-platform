import os
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Base directory for all models
BASE_MODEL_PATH = "/Users/vinayakprakash/Documents/agrosense-platform/backend/models"

ml_assets = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Initializing AgroSense Intelligence...")
    try:
        # 1. Load Crop Recommender (Nested in its own folder)
        crop_path = os.path.join(BASE_MODEL_PATH, "crop_recommender")
        # Ensure directory exists or handle gracefully if user hasn't created structure exactly
        if not os.path.exists(crop_path):
             # Fallback to main dir if subfolder missing (dev flexibility)
             crop_path = BASE_MODEL_PATH
        
        ml_assets["crop_model"] = joblib.load(os.path.join(crop_path, "crop_recommender.pkl"))
        ml_assets["scaler"] = joblib.load(os.path.join(crop_path, "scaler.pkl"))
        ml_assets["label_encoder"] = joblib.load(os.path.join(crop_path, "label_encoder.pkl"))
        
        # 2. Load Micronutrient Models (Directly in /models)
        nutrients = ['S', 'Cu', 'Fe', 'Mn', 'Zn', 'B']
        ml_assets["micro_models"] = {
            n: joblib.load(os.path.join(BASE_MODEL_PATH, f"crop_micronutrient_model_{n}.pkl")) 
            for n in nutrients
        }
        print("✅ Backend ready: All assets loaded from local paths.")
    except Exception as e:
        print(f"❌ Initialization Failed: {e}")
    yield
    ml_assets.clear()

app = FastAPI(lifespan=lifespan)

# Enable CORS (Critical for Frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS & ENDPOINTS ---

class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float

@app.post("/predict/crop")
async def predict_crop(data: CropInput):
    try:
        if "crop_model" not in ml_assets:
            raise HTTPException(status_code=500, detail="Crop model not loaded.")

        # 1. Convert input to DataFrame with the EXACT names used in training
        # IMPORTANT: The order and names must match your CSV columns (minus label and rainfall)
        input_dict = data.dict()
        input_df = pd.DataFrame([input_dict])
        
        # 2. Scale the data
        scaled_data = ml_assets["scaler"].transform(input_df)
        
        # 3. Predict (Ensure we pass it as the scaled array)
        prediction_encoded = ml_assets["crop_model"].predict(scaled_data)
        
        # 4. Decode to Crop Name
        crop_name = ml_assets["label_encoder"].inverse_transform(prediction_encoded)[0]
        
        return {"recommendation": str(crop_name)}

    except Exception as e:
        # This will print the EXACT error in your MacBook terminal
        print(f"❌ Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class MicroInput(BaseModel):
    N: float
    P: float
    K: float
    ph: float
    EC: float
    crop_label: str # e.g., 'pomegranate'

@app.post("/predict/micronutrients")
async def predict_micro(data: MicroInput):
    # Feature Engineering logic from your training script
    feat = data.dict()
    
    # Feature Engineering
    feat['P_K_ratio'] = feat['P'] / (feat['K'] + 1e-5)
    feat['N_P_ratio'] = feat['N'] / (feat['P'] + 1e-5)
    feat['N_K_ratio'] = feat['N'] / (feat['K'] + 1e-5)
    feat['NPK_sum'] = feat['N'] + feat['P'] + feat['K']
    feat['ph_EC_interaction'] = feat['ph'] * feat['EC']
    
    # One-hot encoding logic placeholder - 
    # NOTE: In a real production environment, we should load a fitted OneHotEncoder 
    # or ColumnTransformer that was saved during training. 
    # Since we don't have it, we are passing the features as-is to the model (df).
    # If the model expects specific OHE columns, this might fail unless the model object IS a pipeline.
    
    # Convert to DataFrame for prediction
    df_feat = pd.DataFrame([feat])

    results = {}
    if "micro_models" in ml_assets:
        for n, model in ml_assets["micro_models"].items():
            try:
                # Predict
                res = model.predict(df_feat)[0]
                
                # Apply inverse log transform for specific nutrients
                if n in ['Cu', 'Zn', 'Fe']:
                    res = np.expm1(res)
                
                results[n] = round(float(res), 4)
            except Exception as e:
                print(f"Prediction error for {n}: {e}")
                results[n] = -1.0 # Error flag
    else:
        # Fallback if models failed to load
        return {"error": "Micronutrient models not available"}

    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)