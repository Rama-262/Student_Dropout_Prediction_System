import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier

# Load data
data = pd.read_csv("students_2000.csv")
data['student_id'] = data['student_id'].astype(int)

features = [
    'attendance', 'marks', 'assignments',
    'library_usage', 'financial_aid',
    'prev_marks', 'attendance_trend'
]

X = data[features]
y = data['dropout']

model = GradientBoostingClassifier()
model.fit(X, y)


def predict_student(input_data):
    df = pd.DataFrame([input_data])
    prob = model.predict_proba(df)[0][1]

    reasons = []

    if input_data['attendance'] < 60:
        reasons.append("Low attendance")
    if input_data['marks'] < 50:
        reasons.append("Low marks")
    if input_data['assignments'] < 50:
        reasons.append("Low assignments")
    if input_data['attendance_trend'] < 0:
        reasons.append("Declining attendance")
    if input_data['financial_aid'] == 1:
        reasons.append("Financial pressure")

    return prob, reasons


def get_dashboard_data():
    data['risk'] = model.predict_proba(X)[:, 1]

    students = []

    for _, row in data.iterrows():
        reasons = []

        if row['attendance'] < 60:
            reasons.append("Low attendance")
        if row['marks'] < 50:
            reasons.append("Low marks")
        if row['assignments'] < 50:
            reasons.append("Low assignments")
        if row['attendance_trend'] < 0:
            reasons.append("Declining attendance")
        if row['financial_aid'] == 1:
            reasons.append("Financial pressure")

        students.append({
            "student_id": int(row['student_id']),
            "attendance": row['attendance'],
            "marks": row['marks'],
            "assignments": row['assignments'],
            "risk": row['risk'],
            "reasons": ", ".join(reasons) if reasons else "No major risk"
        })

    students = [s for s in students if s['risk'] > 0.4]
    students = sorted(students, key=lambda x: x['student_id'])

    return students