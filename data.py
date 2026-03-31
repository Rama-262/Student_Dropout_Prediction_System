import pandas as pd
import numpy as np

np.random.seed(42)
n = 2000

data = pd.DataFrame({
    "student_id": range(1, n+1),
    "attendance": np.random.randint(40, 100, n),
    "marks": np.random.randint(35, 100, n),
    "assignments": np.random.randint(30, 100, n),
    "library_usage": np.random.randint(0, 25, n),
    "financial_aid": np.random.randint(0, 2, n),
    "prev_marks": np.random.randint(35, 100, n),
    "attendance_trend": np.random.randint(-10, 11, n)
})

# Dropout logic
prob = (
    (100 - data["attendance"]) * 0.25 +
    (100 - data["marks"]) * 0.25 +
    (100 - data["assignments"]) * 0.15 +
    (1 - data["library_usage"]/25) * 10 +
    data["financial_aid"] * 10 +
    (data["prev_marks"] < 50) * 10 +
    (data["attendance_trend"] < 0) * 10
) / 100

data["dropout"] = (np.random.rand(n) < prob).astype(int)

data.to_csv("students_2000_advanced.csv", index=False)

print("Dataset created successfully!")