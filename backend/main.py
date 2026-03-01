from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict

app = FastAPI(title="DollCraft API", description="Backend service for DollCraft Customization App")

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the DollCraft API"}

@app.get("/api/ping")
def ping():
    return {"status": "ok", "service": "DollCraft Backend"}

# Example Endpoint: Mock Data for Customization Steps
@app.get("/api/makers", response_model=List[Dict])
def get_makers():
    """Returns a list of customized makers for Face-ups and Outfits"""
    return [
        {"id": "f1", "name": "Kiki", "role": "Face-up Artist", "rating": 4.9, "jobs": 120},
        {"id": "o1", "name": "Lumina", "role": "Tailor (娃衣)", "rating": 5.0, "jobs": 84},
        {"id": "c1", "name": "Clay Dreams", "role": "Clay Sculptor", "rating": 4.8, "jobs": 45}
    ]

# Example Endpoint: Create an order
@app.post("/api/orders")
def create_order(order: dict):
    # Process order details (Base Body -> Faceup -> Hair -> Outfit)
    # Placeholder for database saving
    return {"message": "Order successfully created!", "orderId": "TRK-9824X", "data": order}
