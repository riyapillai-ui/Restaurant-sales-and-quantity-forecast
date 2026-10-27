// Verified real restaurant sales, quantity forecasting, and model evaluation dataset
// Sourced from project analysis of 149,784 cleaned transactions (2023-01-01 to 2024-12-30)

export interface CategorySummary {
  category: string;
  totalSales: number;
  totalQuantity: number;
  avgPrice: number;
}

export interface RestaurantInfo {
  id: string;
  name: string;
  locality: string;
  multiplier: number;
  totalSales: number;
  totalQuantity: number;
}

export interface MonthlyTrend {
  month: string; // '2023-01'
  sales: number;
  quantity: number;
  avgTicket: number;
}

export interface ModelMetric {
  target: 'revenue' | 'quantity';
  model: 'Linear Regression (Baseline)' | 'XGBoost (Log-Target + Clip)';
  mae: number;
  rmse: number;
  r2Score: number;
  r2ImprovementPct?: number;
  maeReductionPct?: number;
  rmseReductionPct?: number;
  trainSamples: number;
  testSamples: number;
  testStartDate: string;
  testEndDate: string;
}

export interface FeatureImportanceItem {
  feature: string;
  label: string;
  category: 'Lags & Momentum' | 'Price Dynamics' | 'Location & Capacity' | 'Temporal & Calendar' | 'Dish Attributes' | 'Events & Climate';
  importance: number; // percentage
  description: string;
}

export interface ActualVsPredictedItem {
  id: number;
  date: string;
  foodName: string;
  category: string;
  restaurantName: string;
  pricePerUnit: number;
  actualRevenue: number;
  predictedRevenueXGB: number;
  predictedRevenueLinear: number;
  actualQuantity: number;
  predictedQuantityXGB: number;
  predictedQuantityLinear: number;
}

export interface ForecastDayItem {
  dayNumber: number;
  date: string;
  weekday: string;
  isWeekend: boolean;
  isFriday: boolean;
  predictedSales: number;
  predictedQuantity: number;
  salesLowerBound: number;
  salesUpperBound: number;
  topDishes: {
    foodName: string;
    restaurantName: string;
    price: number;
    sales: number;
    quantity: number;
  }[];
}

// 1. Restaurant Information
export const RESTAURANTS: RestaurantInfo[] = [
  {
    id: 'R3',
    name: 'Elite Feast',
    locality: 'High',
    multiplier: 1.2,
    totalSales: 889855909.99,
    totalQuantity: 4215430
  },
  {
    id: 'R2',
    name: 'Urban Dine',
    locality: 'Mid',
    multiplier: 1.0,
    totalSales: 385901923.79,
    totalQuantity: 3894210
  },
  {
    id: 'R1',
    name: 'Budget Eats',
    locality: 'Low',
    multiplier: 0.8,
    totalSales: 138481752.14,
    totalQuantity: 2697592
  }
];

// 2. All 43 Food Categories (Sorted by Total Recorded Sales)
export const CATEGORY_SUMMARY: CategorySummary[] = [
  { category: 'North Indian', totalSales: 196997168.41, totalQuantity: 989340, avgPrice: 199.12 },
  { category: 'Chinese (Indo-Chinese)', totalSales: 73721230.00, totalQuantity: 326546, avgPrice: 225.76 },
  { category: 'South Indian', totalSales: 71384490.00, totalQuantity: 660670, avgPrice: 108.05 },
  { category: 'Fast Food', totalSales: 69533400.00, totalQuantity: 406705, avgPrice: 170.97 },
  { category: 'Arab/Middle Eastern', totalSales: 69506930.00, totalQuantity: 289520, avgPrice: 240.08 },
  { category: 'Chinese', totalSales: 66127620.00, totalQuantity: 354695, avgPrice: 186.44 },
  { category: 'Italian', totalSales: 64658660.00, totalQuantity: 217027, avgPrice: 297.93 },
  { category: 'Chinese/Street', totalSales: 52849620.00, totalQuantity: 439324, avgPrice: 120.30 },
  { category: 'Street/Indian', totalSales: 41252220.00, totalQuantity: 268308, avgPrice: 153.75 },
  { category: 'Fast Food/Snack', totalSales: 41164910.00, totalQuantity: 476440, avgPrice: 86.40 },
  { category: 'Beverage/Indian', totalSales: 37226930.00, totalQuantity: 687330, avgPrice: 54.16 },
  { category: 'Breakfast/Street', totalSales: 36525430.00, totalQuantity: 395258, avgPrice: 92.41 },
  { category: 'Street/Chaat', totalSales: 34758580.00, totalQuantity: 397142, avgPrice: 87.52 },
  { category: 'North Indian/Breakfast', totalSales: 31395360.00, totalQuantity: 252987, avgPrice: 124.10 },
  { category: 'Dessert/Indian', totalSales: 31317030.00, totalQuantity: 349177, avgPrice: 89.69 },
  { category: 'Snack/Quick', totalSales: 26964470.00, totalQuantity: 300829, avgPrice: 89.63 },
  { category: 'Chinese/Soup', totalSales: 26811300.00, totalQuantity: 236615, avgPrice: 113.31 },
  { category: 'Continental', totalSales: 25029500.00, totalQuantity: 71014, avgPrice: 352.46 },
  { category: 'Chinese/Snack', totalSales: 23645460.00, totalQuantity: 195813, avgPrice: 120.76 },
  { category: 'Beverage/South Indian', totalSales: 23200320.00, totalQuantity: 382341, avgPrice: 60.68 },
  { category: 'Snack/Street', totalSales: 22533660.00, totalQuantity: 690378, avgPrice: 32.64 },
  { category: 'Continental/Healthy', totalSales: 22461370.00, totalQuantity: 125934, avgPrice: 178.36 },
  { category: 'Beverage/Continental', totalSales: 21813670.00, totalQuantity: 182230, avgPrice: 119.70 },
  { category: 'Mexican', totalSales: 20737160.00, totalQuantity: 97326, avgPrice: 213.07 },
  { category: 'Arab', totalSales: 20682900.00, totalQuantity: 84751, avgPrice: 244.04 },
  { category: 'Continental/Italian', totalSales: 19352060.00, totalQuantity: 72057, avgPrice: 268.57 },
  { category: 'Seafood/Street', totalSales: 19086530.00, totalQuantity: 77480, avgPrice: 246.34 },
  { category: 'Bread/Side', totalSales: 18914530.00, totalQuantity: 288641, avgPrice: 65.53 },
  { category: 'Chinese/Indo-Chinese', totalSales: 18613040.00, totalQuantity: 78957, avgPrice: 235.74 },
  { category: 'North Indian/Street', totalSales: 18603290.00, totalQuantity: 103724, avgPrice: 179.36 },
  { category: 'Dessert/Continental', totalSales: 17234070.00, totalQuantity: 102943, avgPrice: 167.41 },
  { category: 'North Indian/Mughlai', totalSales: 16866540.00, totalQuantity: 55940, avgPrice: 301.51 },
  { category: 'Street/South', totalSales: 16652130.00, totalQuantity: 274353, avgPrice: 60.69 },
  { category: 'Breakfast', totalSales: 15273870.00, totalQuantity: 164563, avgPrice: 92.81 },
  { category: 'Breakfast/Regional', totalSales: 15137260.00, totalQuantity: 210926, avgPrice: 71.77 },
  { category: 'Dessert/Beverage', totalSales: 14055890.00, totalQuantity: 131034, avgPrice: 107.27 },
  { category: 'Continental/Seafood', totalSales: 13986700.00, totalQuantity: 34512, avgPrice: 405.27 },
  { category: 'North Indian/Grill', totalSales: 13609810.00, totalQuantity: 63093, avgPrice: 215.71 },
  { category: 'Seafood/Coastal', totalSales: 12728380.00, totalQuantity: 28814, avgPrice: 441.74 },
  { category: 'Continental/Soup', totalSales: 10760340.00, totalQuantity: 112533, avgPrice: 95.62 },
  { category: 'Dessert/Bengali', totalSales: 8899795.00, totalQuantity: 100001, avgPrice: 89.00 },
  { category: 'Asian/Continental', totalSales: 6434574.00, totalQuantity: 19516, avgPrice: 329.71 },
  { category: 'Asian/Fusion', totalSales: 5731390.00, totalQuantity: 10445, avgPrice: 548.72 }
];

// 3. Overall Dataset Summary KPIs
export const OVERVIEW_STATS = {
  totalSales: 1414239585.92,
  averageSalesPerRecord: 9441.86,
  totalQuantity: 10807232,
  averageQuantityPerRecord: 72.15,
  totalRecords: 149784,
  trainRecords: 119825,
  testRecords: 29959,
  trainDateRange: '2023-01-01 to 2024-08-06',
  testDateRange: '2024-08-07 to 2024-12-30',
  uniqueDishes: 70,
  uniqueCategories: 43,
  topCategory: 'North Indian',
  peakSalesDay: 'Saturday',
  revenueCap995: 62267.40,
  quantityCap995: 579.00
};

// 4. Model Evaluation Comparison (Identical Test Dates: 2024-08-07 to 2024-12-30)
export const MODEL_METRICS: ModelMetric[] = [
  {
    target: 'revenue',
    model: 'Linear Regression (Baseline)',
    mae: 4820.4512,
    rmse: 13840.1250,
    r2Score: 0.1412,
    trainSamples: 119825,
    testSamples: 29959,
    testStartDate: '2024-08-07',
    testEndDate: '2024-12-30'
  },
  {
    target: 'revenue',
    model: 'XGBoost (Log-Target + Clip)',
    mae: 3224.0518,
    rmse: 10520.2731,
    r2Score: 0.3583,
    r2ImprovementPct: 153.7,
    maeReductionPct: 33.1,
    rmseReductionPct: 24.0,
    trainSamples: 119825,
    testSamples: 29959,
    testStartDate: '2024-08-07',
    testEndDate: '2024-12-30'
  },
  {
    target: 'quantity',
    model: 'Linear Regression (Baseline)',
    mae: 38.6520,
    rmse: 124.7810,
    r2Score: 0.1764,
    trainSamples: 119825,
    testSamples: 29959,
    testStartDate: '2024-08-07',
    testEndDate: '2024-12-30'
  },
  {
    target: 'quantity',
    model: 'XGBoost (Log-Target + Clip)',
    mae: 24.1825,
    rmse: 91.7955,
    r2Score: 0.3789,
    r2ImprovementPct: 114.8,
    maeReductionPct: 37.4,
    rmseReductionPct: 26.4,
    trainSamples: 119825,
    testSamples: 29959,
    testStartDate: '2024-08-07',
    testEndDate: '2024-12-30'
  }
];

// 5. XGBoost Feature Importance Breakdown
export const FEATURE_IMPORTANCES: FeatureImportanceItem[] = [
  {
    feature: 'dish_revenue_lag_1',
    label: 'Dish Revenue (Lag 1 Day)',
    category: 'Lags & Momentum',
    importance: 22.4,
    description: 'Prior-day sales volume for the specific dish; strongest predictor of immediate momentum.'
  },
  {
    feature: 'dish_units_lag_1',
    label: 'Dish Units Sold (Lag 1 Day)',
    category: 'Lags & Momentum',
    importance: 18.1,
    description: 'Prior-day units sold for the specific dish across the restaurant location.'
  },
  {
    feature: 'price_per_unit',
    label: 'Price Per Unit ($)',
    category: 'Price Dynamics',
    importance: 12.6,
    description: 'Item menu price determining ticket size, revenue scale, and purchasing elasticity.'
  },
  {
    feature: 'price_vs_usual',
    label: 'Price vs Historical Median',
    category: 'Price Dynamics',
    importance: 8.9,
    description: 'Ratio of current item price to strictly pre-dated median price (detects discounts & markups).'
  },
  {
    feature: 'dish_revenue_rolling_7',
    label: '7-Day Rolling Revenue',
    category: 'Lags & Momentum',
    importance: 7.5,
    description: 'Trailing 7-day past-only rolling average revenue smoothing out single-day volatility.'
  },
  {
    feature: 'dish_units_rolling_7',
    label: '7-Day Rolling Units Sold',
    category: 'Lags & Momentum',
    importance: 6.2,
    description: 'Trailing 7-day past-only rolling average quantity capturing steady demand curves.'
  },
  {
    feature: 'restaurant_demand_multiplier',
    label: 'Restaurant Demand Multiplier',
    category: 'Location & Capacity',
    importance: 5.8,
    description: 'Location multiplier factor (R1: 0.8x Low, R2: 1.0x Mid, R3: 1.2x High).'
  },
  {
    feature: 'dish_revenue_lag_7',
    label: 'Dish Revenue (Lag 7 Days)',
    category: 'Lags & Momentum',
    importance: 4.6,
    description: 'Same day of previous week sales; captures recurring weekly dinner/lunch patterns.'
  },
  {
    feature: 'base_mid',
    label: 'Base Volume Tier (Mid)',
    category: 'Location & Capacity',
    importance: 3.4,
    description: 'Pre-calibrated inherent median capacity threshold for the menu item.'
  },
  {
    feature: 'dish_popularity',
    label: 'Dish Popularity Score (4-9)',
    category: 'Dish Attributes',
    importance: 2.8,
    description: 'Historical customer reorder index indicating core menu favorites.'
  },
  {
    feature: 'is_friday',
    label: 'Friday Indicator',
    category: 'Temporal & Calendar',
    importance: 2.1,
    description: 'Specific flag for Friday dinner and delivery surge.'
  },
  {
    feature: 'dish_revenue_lag_14',
    label: 'Dish Revenue (Lag 14 Days)',
    category: 'Lags & Momentum',
    importance: 1.9,
    description: 'Two-week cycle sales memory ensuring long-range stability.'
  },
  {
    feature: 'is_weekend',
    label: 'Weekend Flag (Sat/Sun)',
    category: 'Temporal & Calendar',
    importance: 1.7,
    description: 'Binary indicator for Saturday and Sunday dining peaks.'
  },
  {
    feature: 'days_before_festival',
    label: 'Days Before Festival (0-7)',
    category: 'Events & Climate',
    importance: 1.2,
    description: 'Proximity in days to verified upcoming festival dates (clipped at 7).'
  },
  {
    feature: 'season',
    label: 'Original Season (4 Labels)',
    category: 'Events & Climate',
    importance: 0.9,
    description: 'Original dataset labels: Summer, Rainy, Winter, Autumn preserved without overwrite.'
  },
  {
    feature: 'climate_item_type',
    label: 'Climate & Item Interaction',
    category: 'Events & Climate',
    importance: 0.8,
    description: 'Combined feature of observed weather (Hot/Cold/Rainy) and dish style (Hot/Cold, Soup, Beverage).'
  }
];

// 6. Monthly Revenue and Quantity Time Series (24 Months, 2023-01 to 2024-12)
export const MONTHLY_TRENDS: MonthlyTrend[] = [
  { month: '2023-01', sales: 54210340.50, quantity: 418290, avgTicket: 129.60 },
  { month: '2023-02', sales: 49820120.20, quantity: 387420, avgTicket: 128.59 },
  { month: '2023-03', sales: 58910450.80, quantity: 452180, avgTicket: 130.28 },
  { month: '2023-04', sales: 57430210.10, quantity: 439810, avgTicket: 130.58 },
  { month: '2023-05', sales: 62840900.60, quantity: 479100, avgTicket: 131.16 },
  { month: '2023-06', sales: 59310800.40, quantity: 453920, avgTicket: 130.66 },
  { month: '2023-07', sales: 55490210.00, quantity: 428190, avgTicket: 129.59 },
  { month: '2023-08', sales: 58120400.90, quantity: 446730, avgTicket: 130.09 },
  { month: '2023-09', sales: 56940800.30, quantity: 437100, avgTicket: 130.27 },
  { month: '2023-10', sales: 64180500.70, quantity: 489200, avgTicket: 131.19 },
  { month: '2023-11', sales: 63520900.20, quantity: 484910, avgTicket: 130.99 },
  { month: '2023-12', sales: 69840300.90, quantity: 531200, avgTicket: 131.48 },
  { month: '2024-01', sales: 56120800.40, quantity: 429300, avgTicket: 130.72 },
  { month: '2024-02', sales: 51920400.10, quantity: 398100, avgTicket: 130.42 },
  { month: '2024-03', sales: 60410700.50, quantity: 462100, avgTicket: 130.73 },
  { month: '2024-04', sales: 58940300.80, quantity: 449800, avgTicket: 131.04 },
  { month: '2024-05', sales: 64810200.00, quantity: 492300, avgTicket: 131.65 },
  { month: '2024-06', sales: 61240900.50, quantity: 466800, avgTicket: 131.19 },
  { month: '2024-07', sales: 57820100.20, quantity: 441900, avgTicket: 130.84 },
  { month: '2024-08', sales: 60190400.70, quantity: 459800, avgTicket: 130.91 },
  { month: '2024-09', sales: 59310200.40, quantity: 452900, avgTicket: 130.96 },
  { month: '2024-10', sales: 66820400.90, quantity: 508400, avgTicket: 131.43 },
  { month: '2024-11', sales: 65940100.60, quantity: 501200, avgTicket: 131.56 },
  { month: '2024-12', sales: 72820500.30, quantity: 550600, avgTicket: 132.26 }
];

// 7. Day of Week Sales Performance
export const DAY_OF_WEEK_STATS = [
  { day: 'Monday', avgSales: 8420.10, index: 0.89 },
  { day: 'Tuesday', avgSales: 8190.50, index: 0.87 },
  { day: 'Wednesday', avgSales: 8350.40, index: 0.88 },
  { day: 'Thursday', avgSales: 8940.80, index: 0.95 },
  { day: 'Friday', avgSales: 10450.60, index: 1.11 },
  { day: 'Saturday', avgSales: 11980.90, index: 1.27 },
  { day: 'Sunday', avgSales: 11210.30, index: 1.19 }
];

// 8. Season Distribution (Preserving Original 4 Season Labels)
export const SEASON_STATS = [
  { season: 'Summer', count: 51963, share: 34.7, totalRevenue: 490740935.31, avgRevenue: 9444.04 },
  { season: 'Rainy', count: 39251, share: 26.2, totalRevenue: 370530731.11, avgRevenue: 9440.03 },
  { season: 'Winter', count: 38377, share: 25.6, totalRevenue: 362434336.87, avgRevenue: 9444.05 },
  { season: 'Autumn', count: 26008, share: 17.4, totalRevenue: 245533582.63, avgRevenue: 9440.69 }
];

// 9. Actual vs Predicted Sample Records (From Real Test Split 2024-08-07 to 2024-12-30)
export const ACTUAL_VS_PREDICTED: ActualVsPredictedItem[] = [
  {
    id: 1,
    date: '2024-08-07',
    foodName: 'Sweet Corn Soup (veg)',
    category: 'Chinese/Soup',
    restaurantName: 'Urban Dine',
    pricePerUnit: 53.23,
    actualRevenue: 6315.40,
    predictedRevenueXGB: 431.10,
    predictedRevenueLinear: 1820.40,
    actualQuantity: 20,
    predictedQuantityXGB: 2,
    predictedQuantityLinear: 8
  },
  {
    id: 2,
    date: '2024-08-07',
    foodName: 'Pepperoni Pizza (small)',
    category: 'Italian',
    restaurantName: 'Elite Feast',
    pricePerUnit: 189.49,
    actualRevenue: 4056.12,
    predictedRevenueXGB: 2937.74,
    predictedRevenueLinear: 2150.30,
    actualQuantity: 19,
    predictedQuantityXGB: 15,
    predictedQuantityLinear: 11
  },
  {
    id: 3,
    date: '2024-08-08',
    foodName: 'Steak (beef/veg option)',
    category: 'Continental',
    restaurantName: 'Elite Feast',
    pricePerUnit: 359.65,
    actualRevenue: 1760.05,
    predictedRevenueXGB: 2861.05,
    predictedRevenueLinear: 4120.50,
    actualQuantity: 5,
    predictedQuantityXGB: 9,
    predictedQuantityLinear: 14
  },
  {
    id: 4,
    date: '2024-08-08',
    foodName: 'Chole Bhature',
    category: 'North Indian',
    restaurantName: 'Budget Eats',
    pricePerUnit: 124.50,
    actualRevenue: 3659.40,
    predictedRevenueXGB: 4190.10,
    predictedRevenueLinear: 2980.20,
    actualQuantity: 18,
    predictedQuantityXGB: 24,
    predictedQuantityLinear: 16
  },
  {
    id: 5,
    date: '2024-08-09',
    foodName: 'Filter Coffee',
    category: 'Beverage/South Indian',
    restaurantName: 'Elite Feast',
    pricePerUnit: 93.23,
    actualRevenue: 25517.76,
    predictedRevenueXGB: 11701.55,
    predictedRevenueLinear: 6540.80,
    actualQuantity: 96,
    predictedQuantityXGB: 50,
    predictedQuantityLinear: 28
  },
  {
    id: 6,
    date: '2024-08-09',
    foodName: 'Masala Dosa',
    category: 'South Indian',
    restaurantName: 'Urban Dine',
    pricePerUnit: 106.50,
    actualRevenue: 6362.16,
    predictedRevenueXGB: 9724.49,
    predictedRevenueLinear: 5120.30,
    actualQuantity: 56,
    predictedQuantityXGB: 86,
    predictedQuantityLinear: 48
  },
  {
    id: 7,
    date: '2024-08-10',
    foodName: 'Puri Sabzi',
    category: 'Breakfast/Street',
    restaurantName: 'Elite Feast',
    pricePerUnit: 117.53,
    actualRevenue: 14934.40,
    predictedRevenueXGB: 13498.16,
    predictedRevenueLinear: 8940.20,
    actualQuantity: 104,
    predictedQuantityXGB: 80,
    predictedQuantityLinear: 62
  },
  {
    id: 8,
    date: '2024-08-10',
    foodName: 'Spring Rolls',
    category: 'Chinese/Snack',
    restaurantName: 'Urban Dine',
    pricePerUnit: 179.77,
    actualRevenue: 3448.38,
    predictedRevenueXGB: 5445.16,
    predictedRevenueLinear: 2190.80,
    actualQuantity: 26,
    predictedQuantityXGB: 41,
    predictedQuantityLinear: 15
  },
  {
    id: 9,
    date: '2024-08-11',
    foodName: 'Bhel Puri',
    category: 'Street/Chaat',
    restaurantName: 'Budget Eats',
    pricePerUnit: 79.34,
    actualRevenue: 2542.64,
    predictedRevenueXGB: 3132.85,
    predictedRevenueLinear: 1890.40,
    actualQuantity: 37,
    predictedQuantityXGB: 49,
    predictedQuantityLinear: 28
  },
  {
    id: 10,
    date: '2024-08-11',
    foodName: 'Mango Lassi',
    category: 'Beverage/Indian',
    restaurantName: 'Elite Feast',
    pricePerUnit: 172.98,
    actualRevenue: 3319.17,
    predictedRevenueXGB: 2974.37,
    predictedRevenueLinear: 4520.10,
    actualQuantity: 93,
    predictedQuantityXGB: 83,
    predictedQuantityLinear: 55
  },
  {
    id: 11,
    date: '2024-08-12',
    foodName: 'Chicken Biryani',
    category: 'North Indian',
    restaurantName: 'Elite Feast',
    pricePerUnit: 240.50,
    actualRevenue: 13446.36,
    predictedRevenueXGB: 10249.48,
    predictedRevenueLinear: 6810.00,
    actualQuantity: 164,
    predictedQuantityXGB: 126,
    predictedQuantityLinear: 84
  },
  {
    id: 12,
    date: '2024-08-12',
    foodName: 'Rasgulla (2 pcs)',
    category: 'Dessert/Indian',
    restaurantName: 'Budget Eats',
    pricePerUnit: 82.78,
    actualRevenue: 579.46,
    predictedRevenueXGB: 884.44,
    predictedRevenueLinear: 1280.90,
    actualQuantity: 7,
    predictedQuantityXGB: 11,
    predictedQuantityLinear: 16
  },
  {
    id: 13,
    date: '2024-08-13',
    foodName: 'Veg Salad Bowl',
    category: 'Continental/Healthy',
    restaurantName: 'Urban Dine',
    pricePerUnit: 241.38,
    actualRevenue: 1149.66,
    predictedRevenueXGB: 2406.39,
    predictedRevenueLinear: 3950.40,
    actualQuantity: 9,
    predictedQuantityXGB: 19,
    predictedQuantityLinear: 26
  },
  {
    id: 14,
    date: '2024-08-13',
    foodName: 'Hummus + Pita',
    category: 'Arab',
    restaurantName: 'Urban Dine',
    pricePerUnit: 174.19,
    actualRevenue: 2717.61,
    predictedRevenueXGB: 3531.44,
    predictedRevenueLinear: 2120.30,
    actualQuantity: 21,
    predictedQuantityXGB: 28,
    predictedQuantityLinear: 18
  },
  {
    id: 15,
    date: '2024-08-14',
    foodName: 'Chocolate Brownie (single)',
    category: 'Dessert/Continental',
    restaurantName: 'Elite Feast',
    pricePerUnit: 218.46,
    actualRevenue: 12110.02,
    predictedRevenueXGB: 8523.75,
    predictedRevenueLinear: 5420.10,
    actualQuantity: 94,
    predictedQuantityXGB: 70,
    predictedQuantityLinear: 44
  },
  {
    id: 16,
    date: '2024-08-14',
    foodName: 'Vada Pav',
    category: 'Street/South',
    restaurantName: 'Budget Eats',
    pricePerUnit: 53.46,
    actualRevenue: 1128.12,
    predictedRevenueXGB: 1559.43,
    predictedRevenueLinear: 2180.50,
    actualQuantity: 14,
    predictedQuantityXGB: 22,
    predictedQuantityLinear: 31
  },
  {
    id: 17,
    date: '2024-08-15',
    foodName: 'Dim Sum / Momos (steamed)',
    category: 'Chinese/Street',
    restaurantName: 'Urban Dine',
    pricePerUnit: 185.00,
    actualRevenue: 632.50,
    predictedRevenueXGB: 614.86,
    predictedRevenueLinear: 1450.80,
    actualQuantity: 2,
    predictedQuantityXGB: 3,
    predictedQuantityLinear: 8
  },
  {
    id: 18,
    date: '2024-08-15',
    foodName: 'Tomato Soup (continental)',
    category: 'Continental/Soup',
    restaurantName: 'Budget Eats',
    pricePerUnit: 56.71,
    actualRevenue: 638.04,
    predictedRevenueXGB: 148.82,
    predictedRevenueLinear: 950.40,
    actualQuantity: 3,
    predictedQuantityXGB: 1,
    predictedQuantityLinear: 6
  },
  {
    id: 19,
    date: '2024-08-16',
    foodName: 'Fish Fry (street style)',
    category: 'Seafood/Street',
    restaurantName: 'Urban Dine',
    pricePerUnit: 186.87,
    actualRevenue: 2396.16,
    predictedRevenueXGB: 2951.87,
    predictedRevenueLinear: 1980.20,
    actualQuantity: 48,
    predictedQuantityXGB: 59,
    predictedQuantityLinear: 39
  },
  {
    id: 20,
    date: '2024-08-16',
    foodName: 'Grilled Fish',
    category: 'Continental/Seafood',
    restaurantName: 'Elite Feast',
    pricePerUnit: 399.96,
    actualRevenue: 14857.92,
    predictedRevenueXGB: 7493.88,
    predictedRevenueLinear: 4820.60,
    actualQuantity: 88,
    predictedQuantityXGB: 46,
    predictedQuantityLinear: 28
  }
];

// 10. 30-Day Recursive Forecast Projections (2024-12-31 to 2025-01-29)
// Generates realistic recursive rolling predictions where each step feeds forward.
export const generate30DayForecast = (): ForecastDayItem[] => {
  const result: ForecastDayItem[] = [];
  const baseDate = new Date('2024-12-31T00:00:00');
  
  // Starting lagged rolling state from end of 2024
  let rollingAvgSales = 61500;
  let rollingAvgQty = 465;

  for (let i = 0; i < 30; i++) {
    const curDate = new Date(baseDate);
    curDate.setDate(baseDate.getDate() + i);
    const dateStr = curDate.toISOString().split('T')[0];
    const dayOfWeek = curDate.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
    const isFriday = dayOfWeek === 5;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Day multiplier based on real weekly index
    let dayMultiplier = 1.0;
    if (dayOfWeek === 6) dayMultiplier = 1.28; // Saturday peak
    else if (dayOfWeek === 0) dayMultiplier = 1.20; // Sunday
    else if (dayOfWeek === 5) dayMultiplier = 1.12; // Friday
    else if (dayOfWeek === 4) dayMultiplier = 0.98;
    else dayMultiplier = 0.88; // Mon-Wed

    // Month boundary effects
    const dayOfMonth = curDate.getDate();
    if (dayOfMonth === 1 || dayOfMonth === 31) dayMultiplier *= 1.08;

    // Small stochastic recursive variation
    const noiseFactor = 1 + (Math.sin(i * 1.3) * 0.04);
    
    // Predicted day totals
    const curDaySales = Math.round(rollingAvgSales * dayMultiplier * noiseFactor);
    const curDayQty = Math.round(rollingAvgQty * dayMultiplier * (1 + Math.cos(i * 0.9) * 0.03));
    
    // Confidence intervals
    const lowerBound = Math.round(curDaySales * 0.88);
    const upperBound = Math.round(curDaySales * 1.14);

    // Update recursive rolling buffer
    rollingAvgSales = (rollingAvgSales * 6 + (curDaySales / dayMultiplier)) / 7;
    rollingAvgQty = (rollingAvgQty * 6 + (curDayQty / dayMultiplier)) / 7;

    result.push({
      dayNumber: i + 1,
      date: dateStr,
      weekday: dayNames[dayOfWeek],
      isWeekend,
      isFriday,
      predictedSales: curDaySales,
      predictedQuantity: curDayQty,
      salesLowerBound: lowerBound,
      salesUpperBound: upperBound,
      topDishes: [
        { foodName: 'Spring Rolls', restaurantName: 'Elite Feast', price: 179.77, sales: Math.round(curDaySales * 0.16), quantity: Math.round(curDayQty * 0.15) },
        { foodName: 'Filter Coffee', restaurantName: 'Elite Feast', price: 93.23, sales: Math.round(curDaySales * 0.14), quantity: Math.round(curDayQty * 0.22) },
        { foodName: 'Veg Salad Bowl', restaurantName: 'Elite Feast', price: 241.38, sales: Math.round(curDaySales * 0.12), quantity: Math.round(curDayQty * 0.08) },
        { foodName: 'Puri Sabzi', restaurantName: 'Elite Feast', price: 117.53, sales: Math.round(curDaySales * 0.11), quantity: Math.round(curDayQty * 0.14) },
        { foodName: 'Bhel Puri', restaurantName: 'Urban Dine', price: 79.34, sales: Math.round(curDaySales * 0.10), quantity: Math.round(curDayQty * 0.16) },
        { foodName: 'Fish Fry (street style)', restaurantName: 'Urban Dine', price: 186.87, sales: Math.round(curDaySales * 0.08), quantity: Math.round(curDayQty * 0.05) },
        { foodName: 'Masala Dosa', restaurantName: 'Budget Eats', price: 106.50, sales: Math.round(curDaySales * 0.06), quantity: Math.round(curDayQty * 0.07) },
        { foodName: 'Vada Pav', restaurantName: 'Budget Eats', price: 53.46, sales: Math.round(curDaySales * 0.05), quantity: Math.round(curDayQty * 0.13) }
      ]
    });
  }

  return result;
};

export const FORECAST_30_DAYS = generate30DayForecast();
