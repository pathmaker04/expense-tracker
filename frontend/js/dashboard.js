async function loadDashboard() {
  const API = "expense-tracker-production-e297.up.railway.app";

  const res = await fetch(`${API}/api/dashboard`, {
    credentials: 'include'
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