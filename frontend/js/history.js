async function loadHistory() {
  const API = "expense-tracker-production-e297.up.railway.app";

  const res = await fetch(`${API}/api/history`, {
    credentials: 'include'
  });
  const data = await res.json();

  document.getElementById('income').innerText = `฿ ${data.totalIncome}`;
  document.getElementById('expense').innerText = `฿ ${data.totalExpense}`;

}

async function fetchData() {
  const type = document.getElementById('type').value;

  const res = await fetch(`${API}/api/history?type=${type}`, {
    credentials: 'include'
  });
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

  await fetch(`${API}/api/history/${id}`, {
    method: 'DELETE',
    credentials: 'include'
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




