let users = [];
let username = document.getElementById("name");
let email = document.getElementById("email");
let confirm = document.getElementById("confirmpassword");
let password = document.getElementById("password");
let signup = document.getElementById("signup");

async function addUser() {
  signup.disabled = true;
  if (
    username.value.length >= 1 &&
    email.value.length >= 1 &&
    password.value.length >= 1
  ) {
    users.push({
      name: username.value,
      email: email.value,
      password: password.value,
    });
    await setItem("users", JSON.stringify(users));
    resetForm();
    window.location.href = "index.html";
  } else {
  }
}

function resetForm() {
  username.value = "";
  email.value = "";
  confirm.value = "";
  password.value = "";
  signup.disabled = false;
}
