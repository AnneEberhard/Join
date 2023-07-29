let users = [];
let username = document.getElementById("name");
let email = document.getElementById("email");
let password = document.getElementById("password");

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
  } else {
  }
}

async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

function resetForm() {
  email.value = "";
  password.value = "";
  signup.disabled = false;
}
