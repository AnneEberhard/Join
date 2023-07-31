let currentUser;

function init() {
  loadUsers();
  loadCache();
}

async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

function loginUser() {
  loadUsers();
  if (users[0].email == email.value && users[0].password == password.value) {
    window.location.href = "summary.html";
    currentUser = users[0].name;
    cacheData();
  } else {
    alert(`Wrong Email or Password. Please check your Credentials.`);
  }
}

function guestUser() {
  currentUser = "Guest";
  window.location.href = "summary.html";
}

function cacheData() {
  let check = document.getElementById("remember");
  if (check.checked == true) {
    localStorage.setItem("email", `${email.value}`);
    localStorage.setItem(`password`, `${password.value}`);
  }
}

function loadCache() {
  let email = localStorage.getItem("email");
  let password = localStorage.getItem("password");
  document.getElementById("email").value = email;
  document.getElementById("password").value = password;
}

async function resetPassword() {
  let password = document.getElementById("password");
  let confirmedPass = document.getElementById("confirmpassword");
  if (confirmedPass.value == password.value) {
    users[0].password = password.value;
    await setItem("users", JSON.stringify(users));
    window.location.href = "index.html";
  } else {
    alert(
      "Your passwords are not matching. Please check that you typed your new password correctly"
    );
  }
}
