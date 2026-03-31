from flask import Flask, render_template, request, jsonify
from model import predict_student, get_dashboard_data

app = Flask(__name__)


@app.route('/')
def home():
    return render_template("index.html")


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    prob, reasons = predict_student(data)

    if prob > 0.7:
        risk = "High Risk"
        action = "Immediate counseling"
    elif prob > 0.4:
        risk = "Medium Risk"
        action = "Assign mentor"
    else:
        risk = "Low Risk"
        action = "Normal tracking"

    return jsonify({
        "probability": round(prob * 100, 2),
        "risk": risk,
        "reasons": reasons,
        "action": action
    })


@app.route('/dashboard')
def dashboard():
    data = get_dashboard_data()
    return render_template("dashboard.html", students=data)


@app.route('/student/<int:student_id>')
def get_student(student_id):
    data = get_dashboard_data()

    for s in data:
        if s['student_id'] == student_id:
            return jsonify(s)

    return jsonify({"error": "Student not found"})


if __name__ == '__main__':
    app.run(debug=True)