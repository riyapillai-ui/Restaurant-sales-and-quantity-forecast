from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ModelMetricItem(BaseModel):
    target: str
    model: str
    mae: float
    rmse: float
    r2_score: float = Field(alias="r2Score")
    train_samples: int = Field(alias="trainSamples")
    test_samples: int = Field(alias="testSamples")
    test_start_date: str = Field(alias="testStartDate")
    test_end_date: str = Field(alias="testEndDate")

class PredictionRequest(BaseModel):
    food_name: str = "Chole Bhature"
    category: Optional[str] = "North Indian"
    restaurant_name: str = "Elite Feast"
    restaurant_id: Optional[str] = "R3"
    price_per_unit: float = 120.0
    usual_price: Optional[float] = 110.0
    dish_revenue_lag_1: Optional[float] = 4500.0
    dish_units_lag_1: Optional[float] = 38.0
    dish_revenue_lag_7: Optional[float] = 4200.0
    dish_units_lag_7: Optional[float] = 35.0
    dish_revenue_lag_14: Optional[float] = 4100.0
    dish_units_lag_14: Optional[float] = 34.0
    dish_revenue_rolling_7: Optional[float] = 4300.0
    dish_units_rolling_7: Optional[float] = 36.0
    weekday: int = 5
    is_friday: Optional[int] = 1
    is_weekend: Optional[int] = 0
    is_month_start: Optional[int] = 0
    is_month_end: Optional[int] = 0
    is_festival: Optional[int] = 0
    days_before_festival: Optional[int] = 7
    days_after_festival: Optional[int] = 7
    season: Optional[str] = "Summer"
    dish_popularity: Optional[int] = 7
    rating: Optional[float] = 4.6

class PredictionResponse(BaseModel):
    dish: str
    restaurant: str
    price: float
    xgboost: Dict[str, Any]
    linear_regression_baseline: Dict[str, Any]
    explanation: Dict[str, str]

class DatabaseTestRequest(BaseModel):
    database_url: str

class DatabaseTestResponse(BaseModel):
    success: bool
    status: str
    latency_ms: Optional[float] = None
    provider: str
    message: Optional[str] = None
