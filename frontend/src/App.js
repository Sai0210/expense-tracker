import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [searchTerm, setSearchTerm] = useState('');

  const [total, setTotal] = useState(0);
  //update fetch transactions to also calculate total
const [editingId, setEditingId] = useState(null);
const [editFormData, setEditFormData] = useState({});

const startEdit = (transaction) => {
  setEditingId(transaction.id);
  setEditFormData(transaction);
};

const cancelEdit = () => {
  setEditingId(null);
};

const handleUpdate = async (id) => {
  try {
    await axios.put(`http://localhost:8080/api/transactions/${id}`, editFormData);
    setEditingId(null);
    fetchTransactions();
  } catch (error) {
    alert("Update failed!");
  }
};

  // 1. Fetch data when page loads
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/transactions');
      setTransactions(response.data);
      // We are connecting the API end point to fetch total amount
      const totalAmount = await axios.get('http://localhost:8080/api/transactions/total');
      setTotal(totalAmount.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const deleteTransaction = async (id) => {
  if (window.confirm("Are you sure you want to delete this expense?")) {
    try {
      await axios.delete(`http://localhost:8080/api/transactions/${id}`);
      fetchTransactions(); // This refreshes the list after the deletion
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Could not delete the item.");
    }
  }
};

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Fix: Ensure amount is a number
      const payload = { ...formData, amount: parseFloat(formData.amount) };
      await axios.post('http://localhost:8080/api/transactions', payload);
      setFormData({ description: '', amount: '', category: '', date: new Date().toISOString().split('T')[0] });
      fetchTransactions(); // 2. Refresh list after adding
    } catch (error) {
      alert("Error saving data");
    }

  };

  const handleSearch = async(e) => {
    const value = e.target.value;
    setSearchTerm(value);
if(value.length>1){
    const response = await axios.get(`http://localhost:8080/api/transactions?search=${value}`);
    setTransactions(response.data);
}
else{
    fetchTransactions();
}
  };

  const filterByTime = (period) => {
  const end = new Date().toISOString().split('T')[0];
  let start = new Date();

  if (period === 'week') {
    start.setDate(start.getDate() - 7);
  } else if (period === 'month') {
    start.setMonth(start.getMonth() - 1);
  } else {
    fetchTransactions(); // "All Time"
    return;
  }

  const startDateStr = start.toISOString().split('T')[0];
  // Re-use your Day 11 endpoint!
  axios.get(`http://localhost:8080/api/transactions/range?start=${startDateStr}&end=${end}`)
    .then(res => setTransactions(res.data));
};

const [file, setFile] = useState(null);

const handleFileUpload = async (e) => {
  e.preventDefault();
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    await axios.post('http://localhost:8080/api/transactions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert("Import Successful!");
    setFile(null);
    fetchTransactions(); // Refresh your table with the new data
  } catch (error) {
    alert("Import Failed: Check your CSV format (YYYY-MM-DD,Desc,Cat,Amount)");
  }
};
  return (
    <div className='container'>
      <h1>My Expense Tracker</h1>
      <div className="summary-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
  <div style={{
    backgroundColor: '#007bff',
    color: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }}>
    <h2 style={{ margin: 0, fontSize: '1.2rem', opacity: 0.9 }}>Total Spending</h2>
    <p style={{ margin: '10px 0 0', fontSize: '2.5rem', fontWeight: 'bold' }}>
      ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </p>
  </div>
</div>
      
      {/* ADD EXPENSE SECTION */}
      <div className='form-card'>
        <h3>Add New Expense</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required />
          <input name="amount" type="number" placeholder="Amount" value={formData.amount} onChange={handleInputChange} required />
          <input name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} />
          <input name="date" type="date" value={formData.date} onChange={handleInputChange} required />
          <button type="submit">Add Expense</button>
        </form>
      </div>
      <hr />
      <div className="form-card" style={{ marginTop: '20px' }}>
  <h3>Bulk Import (CSV)</h3>
  <form onSubmit={handleFileUpload}>
    <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".csv" />
    <button type="submit" className="add-btn" style={{ backgroundColor: '#6c757d' }}>Upload CSV</button>
  </form>
</div>
        {/* SEARCH SECTION */}
        <input 
  type="text" 
  placeholder="Search by description..." 
  value={searchTerm} 
  onChange={handleSearch} 
  style={{ width: '100%', marginBottom: '10px' }}
/>
<select onChange={(e) => filterByTime(e.target.value)} style={{ padding: '8px', borderRadius: '5px' }}>
  <option value="all">All Time</option>
  <option value="week">Last 7 Days</option>
  <option value="month">This Month</option>
</select>

      {/* EXPENSE LIST SECTION */}
      <h3>All Expenses</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#eee' }}>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  {transactions.map((t) => (
    <tr key={t.id}>
      {editingId === t.id ? (
        <>
          <td><input type="date" value={editFormData.date} onChange={(e) => setEditFormData({...editFormData, date: e.target.value})} /></td>
          <td><input type="text" value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} /></td>
          <td><input type="text" value={editFormData.category} onChange={(e) => setEditFormData({...editFormData, category: e.target.value})} /></td>
          <td><input type="number" value={editFormData.amount} onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})} /></td>
          <td>
            <button onClick={() => handleUpdate(t.id)}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </td>
        </>
      ) : (
        <>
          <td>{t.date}</td>
          <td>{t.description}</td>
          <td>{t.category}</td>
          <td>${t.amount.toFixed(2)}</td>
          <td>
            <button onClick={() => startEdit(t)} style={{marginRight: '5px', backgroundColor: '#ffc107', border: 'none', padding: '5px'}}>Edit</button>
            <button onClick={() => deleteTransaction(t.id)} style={{backgroundColor: '#ff4d4d', border: 'none', padding: '5px'}}>Delete</button>
          </td>
        </>
      )}
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
}

export default App;