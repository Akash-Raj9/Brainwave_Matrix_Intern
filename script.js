const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const list = document.getElementById("transaction-list");
const form = document.getElementById("transaction-form");
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");

const authSection = document.getElementById("auth-section");
const trackerSection = document.getElementById("tracker-section");
const loginBtn = document.getElementById("login-btn");
const usernameInput = document.getElementById("username");

let currentUser = localStorage.getItem("currentUser") || null;
let transactions = [];


const ctx = document.getElementById('expenseChart').getContext('2d');
let expenseChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Income', 'Expense'],
    datasets: [{
      label: 'Amount (₹)',
      data: [0, 0],
      backgroundColor: ['#28a745', '#dc3545'],
      borderRadius: 5,
      maxBarThickness: 50,
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }
});

function saveCurrentUser(user) {
  localStorage.setItem("currentUser", user);
}

function getUserTransactions(user) {
  const stored = localStorage.getItem(`transactions_${user}`);
  return stored ? JSON.parse(stored) : [];
}

function saveUserTransactions(user, transactions) {
  localStorage.setItem(`transactions_${user}`, JSON.stringify(transactions));
}

function updateTotals() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((a, b) => a + b, 0).toFixed(2);
  const income = amounts.filter(x => x > 0).reduce((a, b) => a + b, 0).toFixed(2);
  const expense = (amounts.filter(x => x < 0).reduce((a, b) => a + b, 0) * -1).toFixed(2);

  balanceEl.textContent = total;
  incomeEl.textContent = income;
  expenseEl.textContent = expense;

  
  expenseChart.data.datasets[0].data = [income, expense];
  expenseChart.update();
}

function renderTransactions() {
  list.innerHTML = "";
  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.classList.add(t.amount < 0 ? "expense" : "income");

    li.innerHTML = `
      <div class="details">
        ${t.description} (${t.category})
      </div>
      <div class="actions">
        <span>₹${t.amount.toFixed(2)}</span>
        <button class="edit-btn" onclick="editTransaction(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteTransaction(${index})">×</button>
      </div>
    `;
    list.appendChild(li);
  });
  updateTotals();
  saveUserTransactions(currentUser, transactions);
}

function deleteTransaction(index) {
  if(confirm("Are you sure you want to delete this transaction?")){
    transactions.splice(index, 1);
    renderTransactions();
  }
}

function editTransaction(index) {
  const t = transactions[index];
  const li = list.children[index];
  li.innerHTML = `
    <input type="text" id="edit-desc-${index}" value="${t.description}" />
    <input type="number" id="edit-amount-${index}" value="${t.amount}" />
    <select id="edit-category-${index}">
      <option value="General" ${t.category === "General" ? "selected" : ""}>General</option>
      <option value="Food" ${t.category === "Food" ? "selected" : ""}>Food</option>
      <option value="Travel" ${t.category === "Travel" ? "selected" : ""}>Travel</option>
      <option value="Shopping" ${t.category === "Shopping" ? "selected" : ""}>Shopping</option>
      <option value="Bills" ${t.category === "Bills" ? "selected" : ""}>Bills</option>
    </select>
    <button onclick="saveEdit(${index})">Save</button>
    <button onclick="cancelEdit()">Cancel</button>
  `;
}

function saveEdit(index) {
  const descEl = document.getElementById(`edit-desc-${index}`);
  const amountEl = document.getElementById(`edit-amount-${index}`);
  const categoryEl = document.getElementById(`edit-category-${index}`);

  const newDesc = descEl.value.trim();
  const newAmount = parseFloat(amountEl.value);
  const newCategory = categoryEl.value;

  if(newDesc === "" || isNaN(newAmount)) {
    alert("Please enter valid description and amount.");
    return;
  }

  transactions[index] = {
    description: newDesc,
    amount: newAmount,
    category: newCategory
  };

  renderTransactions();
}

function cancelEdit() {
  renderTransactions();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;

  if (desc === "" || isNaN(amount)) return alert("Please enter valid description and amount.");

  transactions.push({ description: desc, amount, category });
  descInput.value = "";
  amountInput.value = "";
  renderTransactions();
});

loginBtn.addEventListener("click", () => {
  const user = usernameInput.value.trim();
  if(user === "") return alert("Please enter a username");
  currentUser = user;
  saveCurrentUser(user);
  usernameInput.value = "";
  authSection.style.display = "none";
  trackerSection.classList.remove("hidden");
  transactions = getUserTransactions(currentUser);
  renderTransactions();
});

if(currentUser){
  authSection.style.display = "none";
  trackerSection.classList.remove("hidden");
  transactions = getUserTransactions(currentUser);
  renderTransactions();
} else {
  authSection.style.display = "flex";
  trackerSection.classList.add("hidden");
}

window.editTransaction = editTransaction;
window.saveEdit = saveEdit;
window.cancelEdit = cancelEdit;
window.deleteTransaction = deleteTransaction;

