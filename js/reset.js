const form = document.getElementById("forgot-form");
const button = document.querySelector(".fly-in-button");
const overlay = document.querySelector(".overlay");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const passwordMatching = await resetPassword();
  if (passwordMatching) {
    document.body.classList.add("clicked");
    button.classList.add("clicked");
    await delay(1000);
    form.submit();
    window.location.href = "index.html";
  }
});

async function resetPassword() {
  let password = document.getElementById("password");
  let confirmedPass = document.getElementById("confirmpassword");
  let error = document.getElementById("error");
  confirmedPass.classList.remove("border-red");
  error.style = "display:none;";
  if (confirmedPass.value == password.value) {
    users[0].password = password.value;
    await setItem("users", JSON.stringify(users));
    return true;
  } else {
    confirmedPass.classList.add("border-red");
    confirmedPass.value = "";
    error.style = "display:flex;";
    return false;
  }
}
