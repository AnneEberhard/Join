let currentUser;

function init() {
  loadUsers();
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
  } else {
    alert(`Wrong Email or Password. Please check your Credentials.`);
  }
}

function guestUser() {
  currentUser = "Guest";
  window.location.href = "summary.html";
}
