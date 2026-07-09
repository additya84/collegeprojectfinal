const apiBaseUrl = "https://collegeprojectfinal-1.onrender.com/api";

const forgotForm = document.getElementById("forgotForm");
const forgotMessage = document.getElementById("forgotMessage");

function showMessage(msg, isError) {
  forgotMessage.textContent = msg;
  forgotMessage.style.color = isError ? "#dc2626" : "#16a34a";
}

forgotForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("forgotEmail").value.trim();

  if (!email) {
    showMessage("Please enter your email", true);
    return;
  }

  try {
    showMessage("Sending reset link...");

    const res = await fetch(`${apiBaseUrl}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    showMessage("Reset link sent! Check your email.");
    document.getElementById("forgotEmail").value = "";
  } catch (err) {
    showMessage(err.message, true);
  }
});
