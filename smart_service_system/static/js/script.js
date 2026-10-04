// Smart Service Management System Client Script

document.addEventListener('DOMContentLoaded', function () {
    // Auto-dismiss alerts after 4 seconds
    const alerts = document.querySelectorAll('.alert-dismissible');
    alerts.forEach(function (alert) {
        setTimeout(function () {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 4000);
    });

    // Automatically set default date input to today if empty
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(function (input) {
        if (!input.value) {
            input.value = today;
        }
    });

    // Auto set time input to nearest half hour if empty
    const timeInputs = document.querySelectorAll('input[type="time"]');
    timeInputs.forEach(function (input) {
        if (!input.value) {
            input.value = "10:00";
        }
    });
});
