function signup() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (name == "" || email == "" || password == "") {
    alert("Please fill all fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let already = users.find(u => u.email == email);
  if (already) {
    alert("This email is already registered. Please Login.");
    window.location.href = "login.html";
    return;
  }

  users.push({ name: name, email: email, password: password });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created successfully! Please Login now.");
  window.location.href = "login.html";
}