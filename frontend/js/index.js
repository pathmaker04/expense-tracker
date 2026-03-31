async function loadDashboard() {
  const res = await fetch('/api/dashboard', {
    credentials: 'same-origin'
  });
  const data = await res.json();

  document.getElementById('income').innerText = `฿ ${data.totalIncome}`;
  document.getElementById('expense').innerText = `฿ ${data.totalExpense}`;
  document.getElementById('balance').innerText = `฿ ${data.totalBalance}`;
  document.getElementById('monthlyIncome').innerText =
  `เดือนนี้: ฿ ${data.monthlyIncome}`;
  document.getElementById('monthlyExpense').innerText =
  `เดือนนี้: ฿ ${data.monthlyExpense}`;
  document.getElementById('savingsRate').innerText = `อัตราการออม: ${data.savingsRate}%`;

  renderChart(data.monthly);

  renderPieChart(data.categories);

}

function renderChart(monthly) {
  const labels = monthly.map(m => m.month);
  const incomeData = monthly.map(m => Number(m.income));
  const expenseData = monthly.map(m => Number(m.expense));

  const ctx = document.getElementById('barChart');


  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'รายรับ',
          data: incomeData,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'รายจ่าย',
          data: expenseData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    }
  });
}

function renderPieChart(categories) {
  const labels = categories.map(c => c.category);
  const data = categories.map(c => Number(c.total));

  const ctx = document.getElementById('pieChart');

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 205, 86, 0.5)',
            'rgba(153, 102, 255, 0.5)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
          
        }
      ]
    },
    
  });
}

async function loadHistory() {
  const res = await fetch('/api/history')
  const data = await res.json();

  document.getElementById('income').innerText = `฿ ${data.totalIncome}`;
  document.getElementById('expense').innerText = `฿ ${data.totalExpense}`;

}

async function fetchData() {
  const type = document.getElementById('type').value;

  const res = await fetch(`/api/history?type=${type}`);
  const data = await res.json();

  renderTable(data);
}

function renderTable(data) {
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = '';
  const totalCount = document.getElementById('totalCount');

  data.rows.forEach(item => {
    tbody.innerHTML += `

      <tr>
        <td>${formatDate(item.date)}</td>
        <td style="color:${item.type === 'income' ? 'green' : 'red'}">
          ${item.type}
        </td>
        <td>${item.category_name}</td>
        <td>${item.note}</td>
        <td style="color:${item.type === 'income' ? 'green' : 'red'}">${item.type === 'income' ? '+' + item.amount : '-' + item.amount }</td>
        <td>
          <button style="background:#f7776e" onclick="deleteItem(${item.id})">Delete</button>
        </td>

      </tr>
    `;
  });
  
  totalCount.innerText = `${data.rows.length} รายการ`;
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}


async function deleteItem(id) {
  if (!confirm('ลบรายการนี้ใช่ไหม?')) return;

  await fetch(`/api/history/${id}`, {
    method: 'DELETE'
  });

  fetchData();
}
////////////////

// document.getElementById('addForm').addEventListener('submit', async (e) => {
//   e.preventDefault(); 

//   const amount = document.getElementById('amount').value;
//   const category = document.getElementById('category').value;

//   const res = await fetch('https://expense-tracker-production-e297.up.railway.app', {
//     method: 'POST',
//     credentials: 'include', 
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       amount,
//       category
//     })
//   });

//   const text = await res.text();
//   console.log(text);

  
//   window.location.href = '/pages/dashboard.html';
// });




