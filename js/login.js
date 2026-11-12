function login(){
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let found = users.find(u => u.email == email && u.password == password);
  if(!found){
    alert("Wrong email or password");
    return;
  }
  localStorage.setItem("currentUser", JSON.stringify(found));
  alert("Welcome " + found.name + "!");
  window.location.href = "index.html";
}