import os
from sqlalchemy import create_engine, Column, Integer, Float, String, Date, DateTime, Boolean, Text
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("SUPABASE_URL")

# Default fallback SQLite for local testing if no PostgreSQL credentials provided
if not DATABASE_URL or not DATABASE_URL.startswith(("postgres://", "postgresql://")):
    DATABASE_URL = "sqlite:///./restaurant_forecast.db"

# Handle Heroku/Render postgres:// vs postgresql:// compatibility
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class RestaurantTransaction(Base):
    __tablename__ = "restaurant_transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    date = Column(Date, index=True, nullable=False)
    year = Column(Integer, nullable=False)
    month = Column(Integer, nullable=False)
    day = Column(Integer, nullable=False)
    weekday = Column(Integer, nullable=False)
    is_weekend = Column(Integer, default=0)
    is_friday = Column(Integer, default=0)
    is_month_start = Column(Integer, default=0)
    is_month_end = Column(Integer, default=0)
    season = Column(String(50), nullable=False) # Summer, Rainy, Winter, Autumn
    climate = Column(String(50), nullable=True) # Hot, Cold, Rainy, etc. (real only)
    is_holiday = Column(Integer, default=0)
    is_festival = Column(Integer, default=0)
    restaurant_id = Column(String(10), index=True, nullable=False)
    restaurant_name = Column(String(100), nullable=False)
    restaurant_locality = Column(String(50), nullable=False)
    restaurant_demand_multiplier = Column(Float, default=1.0)
    food_name = Column(String(150), index=True, nullable=False)
    category = Column(String(100), index=True, nullable=False)
    price_per_unit = Column(Float, nullable=False)
    usual_price = Column(Float, nullable=True)
    price_vs_usual = Column(Float, default=1.0)
    dish_units_lag_1 = Column(Float, nullable=True)
    dish_units_lag_7 = Column(Float, nullable=True)
    dish_units_lag_14 = Column(Float, nullable=True)
    dish_units_rolling_7 = Column(Float, nullable=True)
    dish_revenue_lag_1 = Column(Float, nullable=True)
    dish_revenue_lag_7 = Column(Float, nullable=True)
    dish_revenue_lag_14 = Column(Float, nullable=True)
    dish_revenue_rolling_7 = Column(Float, nullable=True)
    units_sold = Column(Integer, nullable=False)
    revenue = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ModelMetricLog(Base):
    __tablename__ = "model_metrics_log"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), nullable=False)
    target = Column(String(50), nullable=False) # revenue or quantity
    mae = Column(Float, nullable=False)
    rmse = Column(Float, nullable=False)
    r2_score = Column(Float, nullable=False)
    split_type = Column(String(50), default="chronological_80_20")
    train_samples = Column(Integer, nullable=False)
    test_samples = Column(Integer, nullable=False)
    evaluation_date = Column(DateTime, default=datetime.utcnow)

class RecursiveForecastRecord(Base):
    __tablename__ = "forecasts_30day"

    id = Column(Integer, primary_key=True, index=True)
    day_number = Column(Integer, nullable=False)
    forecast_date = Column(Date, nullable=False, index=True)
    weekday_name = Column(String(20), nullable=False)
    is_weekend = Column(Boolean, default=False)
    is_friday = Column(Boolean, default=False)
    predicted_sales = Column(Float, nullable=False)
    predicted_quantity = Column(Integer, nullable=False)
    confidence_lower = Column(Float, nullable=False)
    confidence_upper = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
