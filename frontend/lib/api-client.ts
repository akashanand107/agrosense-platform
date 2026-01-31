type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
    method?: RequestMethod;
    headers?: Record<string, string>;
    body?: any;
}

const API_BASE_URL = 'http://0.0.0.0:8000';

export const apiClient = {
    fetch: async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
        const { method = 'GET', headers = {}, body } = options;

        const config: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    },

    get: <T>(endpoint: string) => apiClient.fetch<T>(endpoint, { method: 'GET' }),

    post: <T>(endpoint: string, body: any) => apiClient.fetch<T>(endpoint, { method: 'POST', body }),

    put: <T>(endpoint: string, body: any) => apiClient.fetch<T>(endpoint, { method: 'PUT', body }),

    delete: <T>(endpoint: string) => apiClient.fetch<T>(endpoint, { method: 'DELETE' }),
};
