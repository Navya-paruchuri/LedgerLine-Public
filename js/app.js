let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
if(currentUser && document.getElementById("userName")){
  document.getElementById("userName").innerText = currentUser.name;
}
function save(){ localStorage.setItem("transactions", JSON.stringify(transactions)); }
function addTransaction(){
  let desc = document.getElementById("desc").value.trim();
  let amount = Number(document.getElementById("amount").value);
  let type = document.getElementById("type").value;
  if(!desc || !amount){ alert("Please fill title and amount"); return; }
  transactions.push({desc: desc, amount: amount, type: type});
  save();
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
  updateUI();
}
function deleteOne(index){
  transactions.splice(index, 1);
  save(); updateUI();
}
function clearAll(){
  if(!confirm("Delete all transactions?")) return;
  transactions = []; save(); updateUI();
}
function downloadCSV(){
  if(transactions.length==0){ alert("No data to download"); return; }
  let csv = "Title,Type,Amount\n";
  transactions.forEach(t=>{ csv += t.desc + "," + t.type + "," + t.amount + "\n"; });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], {type:"text/csv"}));
  a.download = "LedgerLine-Report.csv"; a.click();
}
function logout(){
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}
function drawPie(income, expense){
  let c = document.getElementById("pieChart");
  if(!c) return;
  let ctx = c.getContext("2d");
  ctx.clearRect(0,0,180,180);
  let total = income + expense;
  if(total==0){
    ctx.beginPath(); ctx.arc(90,90,70,0,Math.PI*2); ctx.fillStyle="#e2e8f0"; ctx.fill(); return;
  }
  let start = -Math.PI/2;
  let incAngle = (income/total)*Math.PI*2;
  ctx.beginPath(); ctx.moveTo(90,90); ctx.arc(90,90,70,start,start+incAngle); ctx.closePath(); ctx.fillStyle="#22c55e"; ctx.fill();
  ctx.beginPath(); ctx.moveTo(90,90); ctx.arc(90,90,70,start+incAngle,start+Math.PI*2); ctx.closePath(); ctx.fillStyle="#ef4444"; ctx.fill();
  ctx.beginPath(); ctx.arc(90,90,32,0,Math.PI*2); ctx.fillStyle="white"; ctx.fill();
}
function updateUI(){
  let search = document.getElementById("search") ? document.getElementById("search").value.toLowerCase() : "";
  let income = 0, expense = 0;
  transactions.forEach(t=>{ if(t.type=="income") income+=Number(t.amount); else expense+=Number(t.amount); });
  let balance = income - expense;
  document.getElementById("balance").innerText = balance.toLocaleString("en-IN");
  document.getElementById("totalIncome").innerText = income.toLocaleString("en-IN");
  document.getElementById("totalExpense").innerText = expense.toLocaleString("en-IN");
  let total = income + expense;
  let incPer = total ? Math.round(income/total*100) : 0;
  let expPer = total ? 100-incPer : 0;
  document.getElementById("incomeBar").style.width = incPer + "%";
  document.getElementById("expenseBar").style.width = expPer + "%";
  document.getElementById("chartText").innerText = "Income " + incPer + "% • Expense " + expPer + "%";
  drawPie(income, expense);
  let list = document.getElementById("list");
  list.innerHTML = "";
  let filtered = transactions.filter(t=> t.desc.toLowerCase().includes(search));
  filtered.forEach(t=>{
    let realIndex = transactions.indexOf(t);
    let li = document.createElement("li");
    let sign = t.type=="income" ? "+" : "-";
    let color = t.type=="income" ? "green" : "red";
    li.innerHTML = "<div><b>"+t.desc+"</b><br><small style='color:#94a3b8'>"+t.type+"</small></div><div><b style='color:"+color+"'>"+sign+" ₹"+Number(t.amount).toLocaleString("en-IN")+"</b> <button onclick='deleteOne("+realIndex+")'>🗑️</button></div>";
    list.appendChild(li);
  });
  document.getElementById("emptyHint").style.display = filtered.length==0 ? "block" : "none";
}
updateUI();