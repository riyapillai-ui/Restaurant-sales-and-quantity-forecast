# Restaurant Sales & Quantity Forecasting using Linear Regression and XGBoost

Production-grade forecasting web application and machine learning pipeline for multi-unit restaurants. Preserves the dataset's original seasons, eliminates duplicate features, compares baseline **Linear Regression** against advanced **XGBoost (with log1p transformation and outlier capping)** on identical test dates, and executes realistic **30-day recursive forecasts** without future leakage.

---

## 🌟 Key Improvements & Architectural Highlights

1. **Original Season Labels Preserved**:
   - The original dataset categories (`Summer`, `Rainy`, `Winter`, `Autumn`) are kept intact without overriding.
2. **Redundant Feature Removal**:
   - `restaurant_name` and `restaurant_locality` are excluded from model training to prevent multi-collinearity since `restaurant_id` (`R1`, `R2`, `R3`) uniquely identifies them.
3. **Advanced Feature Engineering**:
   - **Dish-level Sales Lags**: 1-day, 7-day, and 14-day lags for both revenue and units sold.
   - **Past-Only Rolling Averages**: 7-day moving averages calculated strictly on historical periods with zero forward window.
   - **Historical Price Comparisons**: `price_vs_usual` comparing daily unit price to the pre-dated expanding median price.
   - **Calendar Dynamics**: `is_friday`, `is_weekend`, `is_month_start`, and `is_month_end` indicators.
   - **Festival Proximity**: `days_before_festival` and `days_after_festival` calculated from real festival dates in the dataset and capped at 7 days.
   - **Weather/Climate**: Uses real climate records only (`Hot`, `Rainy`, `Cloudy`, `Humid`, `Cold`, `Cool`), interaction terms (`climate_item_type`), and never fabricates weather.
4. **Log Transformation & Outlier Handling**:
   - Target training variables are log-transformed via `log1p(y)` to temper heavy right-tail skewness.
   - Training targets are capped at their 99.5th percentile ($62,267.40 for revenue, 579 units for quantity).
   - Predictions are inverted with `expm1(y)` and non-negative bounded (`clip(lower=0)`).
5. **Strict Chronological Split (Zero Leakage)**:
   - **Training Set (80%)**: 2023-01-01 to 2024-08-06 (119,825 records).
   - **Testing Set (20%)**: 2024-08-07 to 2024-12-30 (29,959 records).
   - Both Linear Regression and XGBoost are evaluated on **identical test dates**.
6. **Realistic 30-Day Recursive Rollout**:
   - Iterative multi-step forecasting from `2024-12-31` to `2025-01-29`.
   - Each forecasted day feeds its predicted revenue and quantity into subsequent lag buffers, preventing future leakage.

---

## 📊 Model Evaluation Results (Identical Test Dates)

| Target | Model | MAE | RMSE | R² Score | R² Improvement | MAE Reduction |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Revenue ($)** | **Linear Regression (Baseline)** | $4,820.45 | $13,840.12 | 0.1412 | — | — |
| **Revenue ($)** | **XGBoost (Log-Target + Capping)** | **$3,224.05** | **$10,520.27** | **0.3583** | **+153.7%** | **-33.1%** |
| **Quantity (Units)** | **Linear Regression (Baseline)** | 38.65 | 124.78 | 0.1764 | — | — |
| **Quantity (Units)** | **XGBoost (Log-Target + Capping)** | **24.18** | **91.80** | **0.3789** | **+114.8%** | **-37.4%** |

---

## 🚀 Deployment Instructions

### 1. Render Deployment (Blueprint or Web Service)

#### Option A: Using `render.yaml` (Recommended)
1. Fork or push this repository to GitHub/GitLab.
2. In your [Render Dashboard](https://dashboard.render.com), click **New +** -> **Blueprint**.
3. Select your repository. Render automatically reads `render.yaml` and sets up:
   - FastAPI Backend service (`uvicorn backend.main:app`)
   - React SPA Frontend service (`npm run build && npm run start`)
   - Managed PostgreSQL database (`restaurant-sales-postgres`)
4. Click **Apply**. Render will deploy both services with connected environment variables.

#### Option B: Manual Web Service Setup on Render
1. **Backend Web Service**:
   - Environment: `Python`
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - Environment Variables:
     - `PYTHON_VERSION`: `3.10.12`
     - `DATABASE_URL`: Your Supabase or PostgreSQL connection string
2. **Frontend Web Service**:
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Environment Variables:
     - `NODE_VERSION`: `20.11.0`
     - `VITE_API_URL`: URL of your deployed backend service

---

### 2. Supabase / PostgreSQL Configuration

1. Create a free database at [Supabase.com](https://supabase.com).
2. Go to **Project Settings** -> **Database** and copy the **Connection string** (URI).
3. Set the following environment variable in your `.env` or Render settings:
   ```bash
   DATABASE_URL="postgres://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
   ```
4. In the applet UI, navigate to the **Database & Deploy** tab to test your live connection and sync transaction tables.

---

### 3. Local Development

```bash
# Install dependencies
npm install

# Run full-stack dev server (port 3000)
npm run dev

# Run FastAPI backend standalone (optional)
pip install -r backend/requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```
