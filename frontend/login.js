function validateEmail() {
    const emailInput = document.getElementById("email").value;
    const errorMessage = document.getElementById("error-message");

    if (!emailInput.endsWith("@ucdavis.edu")) {
        errorMessage.textContent = "Only UC Davis emails are allowed!";
    } else {
        errorMessage.textContent = "";
        alert("Login successful!");
        // Send email to packend
        // fetch('/login', { method: 'POST', body: JSON.stringify({ email: emailInput }), headers: { 'Content-Type': 'application/json' }})
    }
}