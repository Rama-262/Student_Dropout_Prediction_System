function predict() {

    const data = {
        attendance: parseFloat(document.getElementById("attendance").value),
        marks: parseFloat(document.getElementById("marks").value),
        assignments: parseFloat(document.getElementById("assignments").value),
        library_usage: parseFloat(document.getElementById("library").value),
        financial_aid: parseInt(document.getElementById("aid").value),
        prev_marks: parseFloat(document.getElementById("prev_marks").value),
        attendance_trend: parseFloat(document.getElementById("trend").value)
    };

    fetch("/predict", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("result").innerHTML = `
            <h2>${data.risk}</h2>
            <p>${data.probability}%</p>
            <p>${data.reasons.join(", ")}</p>
        `;
    });
}


function searchStudent() {

    const id = parseInt(document.getElementById("search_id").value);

    // ❗ Invalid ID check
    if (isNaN(id) || id < 1 || id > 2000) {
        document.getElementById("student_result").innerHTML = `
            <h2 style="color:red;">❌ Invalid Student ID</h2>
            <p>Please enter ID between 1 and 2000</p>
        `;
        return;
    }

    fetch(`/student/${id}`)
    .then(res => res.json())
    .then(data => {

        // 🟢 Safe student
        if (data.error) {
            document.getElementById("student_result").innerHTML = `
                <h2 style="color: green;">✅ Student is Safe (Low Risk)</h2>
                <p>This student is not in high-risk category.</p>
            `;

            if (window.myChart) window.myChart.destroy();

            // 👇 MOVE BUTTON BELOW CHART
            const btn = document.getElementById("dashboard-btn-container");
            const bottom = document.getElementById("dashboard-bottom");
            if (btn && bottom) bottom.appendChild(btn);

            return;
        }

        // ✅ Show student details
        document.getElementById("student_result").innerHTML = `
            <h2>Student ID: ${data.student_id}</h2>
            <p><b>Attendance:</b> ${data.attendance}</p>
            <p><b>Marks:</b> ${data.marks}</p>
            <p><b>Assignments:</b> ${data.assignments}</p>
            <p><b>Risk:</b> ${(data.risk * 100).toFixed(2)}%</p>
            <p><b>Reasons:</b> ${data.reasons}</p>
        `;

        // 📊 Chart
        if (window.myChart) window.myChart.destroy();

        const ctx = document.getElementById("chart").getContext("2d");

        window.myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ["Attendance", "Marks", "Assignments"],
                datasets: [{
                    data: [
                        data.attendance,
                        data.marks,
                        data.assignments
                    ],
                    backgroundColor: [
                        "#007bff",
                        "#28a745",
                        "#ffc107"
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { size: 14 },
                            padding: 20
                        }
                    }
                }
            }
        });

        // 👇 MOVE BUTTON BELOW CHART
        const btn = document.getElementById("dashboard-btn-container");
        const bottom = document.getElementById("dashboard-bottom");

        if (btn && bottom) {
            bottom.appendChild(btn);
        }

    });
}function searchStudent() {

    const id = parseInt(document.getElementById("search_id").value);

    // ❗ Invalid ID
    if (isNaN(id) || id < 1 || id > 2000) {
        document.getElementById("student_result").innerHTML = `
            <h2 style="color:red;">❌ Invalid Student ID</h2>
            <p>Please enter ID between 1 and 2000</p>
        `;
        return;
    }

    fetch(`/student/${id}`)
    .then(res => res.json())
    .then(data => {

        const btn = document.getElementById("dashboard-btn-container");
        const bottom = document.getElementById("dashboard-bottom");
        const resultDiv = document.getElementById("student_result");

        // 🟢 SAFE STUDENT
        if (data.error) {
            resultDiv.innerHTML = `
                <h2 style="color: green;">✅ Student is Safe (Low Risk)</h2>
                <p>This student is not in high-risk category.</p>
            `;

            if (window.myChart) window.myChart.destroy();

            // 👇 MOVE BUTTON BELOW MESSAGE
            if (btn && resultDiv) {
                resultDiv.appendChild(btn);
            }

            return;
        }

        // 🔵 HIGH RISK STUDENT
        resultDiv.innerHTML = `
            <h2>Student ID: ${data.student_id}</h2>
            <p><b>Attendance:</b> ${data.attendance}</p>
            <p><b>Marks:</b> ${data.marks}</p>
            <p><b>Assignments:</b> ${data.assignments}</p>
            <p><b>Risk:</b> ${(data.risk * 100).toFixed(2)}%</p>
            <p><b>Reasons:</b> ${data.reasons}</p>
        `;

        // 📊 Chart
        if (window.myChart) window.myChart.destroy();

        const ctx = document.getElementById("chart").getContext("2d");

        window.myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ["Attendance", "Marks", "Assignments"],
                datasets: [{
                    data: [
                        data.attendance,
                        data.marks,
                        data.assignments
                    ],
                    backgroundColor: [
                        "#007bff",
                        "#28a745",
                        "#ffc107"
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { size: 14 },
                            padding: 20
                        }
                    }
                }
            }
        });

        // 👇 MOVE BUTTON BELOW CHART
        if (btn && bottom) {
            bottom.appendChild(btn);
        }

    });
}