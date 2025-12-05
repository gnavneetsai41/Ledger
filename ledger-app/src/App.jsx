
// import React, { useState, useEffect } from 'react';
// import './App.css';

// const API_BASE_URL = "http://localhost:5000/api/transactions";

// // Simple SVG Icons
// const PlusIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <line x1="12" y1="5" x2="12" y2="19"></line>
//     <line x1="5" y1="12" x2="19" y2="12"></line>
//   </svg>
// );

// const XIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <line x1="18" y1="6" x2="6" y2="18"></line>
//     <line x1="6" y1="6" x2="18" y2="18"></line>
//   </svg>
// );

// // Main App Component
// export default function App() {
//   const [transactions, setTransactions] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Fetch transactions
//   const fetchTransactions = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(API_BASE_URL);
//       const data = await response.json();
//       setTransactions(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   // Calculate summary
//   const summary = transactions.reduce((acc, t) => {
//     const amount = t.totalAmount;
//     if (t.type === 'customer') {
//       acc.totalReceivable += amount;
//       if (t.status === 'paid') acc.paidIn += amount;
//     } else {
//       acc.totalPayable += amount;
//       if (t.status === 'paid') acc.paidOut += amount;
//     }
//     return acc;
//   }, { totalReceivable: 0, totalPayable: 0, paidIn: 0, paidOut: 0 });

//   const profit = summary.paidIn - summary.paidOut;
//   const pendingReceivable = summary.totalReceivable - summary.paidIn;
//   const pendingPayable = summary.totalPayable - summary.paidOut;

//   // Update transaction status
//   const updateStatus = async (id, currentStatus) => {
//     try {
//       const endpoint = currentStatus === 'pending' ? 'paid' : 'undo';
//       const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
//         method: 'PUT',
//       });
//       const updated = await response.json();
//       setTransactions(prev => 
//         prev.map(t => t._id === updated._id ? updated : t)
//       );
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const pendingTransactions = transactions.filter(t => t.status === 'pending');
//   const paidTransactions = transactions.filter(t => t.status === 'paid');

//   return (
//     <div className="app">
//       {/* Header */}
//       <header className="header">
//         <div className="container">
//           <h1>Ledger</h1>
//           <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
//             <PlusIcon />
//             <span className="btn-text">Add Transaction</span>
//             <span className="btn-text-mobile">Add</span>
//           </button>
//         </div>
//       </header>

//       <main className="main">
//         {/* Summary Cards */}
//         <div className="summary-grid">
//           <Card title="Profit" amount={profit} icon="💰" color="blue" />
//           <Card title="Pending Receivable" amount={pendingReceivable} icon="📈" color="green" />
//           <Card title="Pending Payable" amount={pendingPayable} icon="📉" color="red" />
//         </div>

//         {loading ? (
//           <div className="loading">Loading...</div>
//         ) : (
//           <>
//             {/* Pending Transactions */}
//             <section className="section">
//               <h2>Pending</h2>
//               <div className="table-grid">
//                 <TransactionList
//                   title="Customers"
//                   transactions={pendingTransactions.filter(t => t.type === 'customer')}
//                   type="customer"
//                   onUpdate={updateStatus}
//                 />
//                 <TransactionList
//                   title="Suppliers"
//                   transactions={pendingTransactions.filter(t => t.type === 'supplier')}
//                   type="supplier"
//                   onUpdate={updateStatus}
//                 />
//               </div>
//             </section>

//             {/* Paid Transactions */}
//             <section className="section">
//               <h2>Completed</h2>
//               <div className="table-grid">
//                 <TransactionList
//                   title="Customers"
//                   transactions={paidTransactions.filter(t => t.type === 'customer')}
//                   type="customer"
//                   onUpdate={updateStatus}
//                 />
//                 <TransactionList
//                   title="Suppliers"
//                   transactions={paidTransactions.filter(t => t.type === 'supplier')}
//                   type="supplier"
//                   onUpdate={updateStatus}
//                 />
//               </div>
//             </section>
//           </>
//         )}
//       </main>

//       {/* Modal */}
//       {isModalOpen && (
//         <TransactionModal
//           onClose={() => setIsModalOpen(false)}
//           onSuccess={fetchTransactions}
//         />
//       )}
//     </div>
//   );
// }

// // Card Component
// function Card({ title, amount, icon, color }) {
//   return (
//     <div className={`card card-${color}`}>
//       <div className="card-header">
//         <div className="card-icon">{icon}</div>
//         <span className="card-title">{title}</span>
//       </div>
//       <p className="card-amount">${amount.toFixed(2)}</p>
//     </div>
//   );
// }

// // Transaction List Component
// function TransactionList({ title, transactions, type, onUpdate }) {
//   return (
//     <div className="transaction-list">
//       <div className="list-header">
//         <h3>{title}</h3>
//       </div>
//       <div className="list-body">
//         {transactions.length === 0 ? (
//           <div className="empty-state">No transactions</div>
//         ) : (
//           transactions.map(t => (
//             <div key={t._id} className="transaction-item">
//               <div className="transaction-info">
//                 <p className="transaction-name">{t.name}</p>
//                 <p className="transaction-details">
//                   {t.quantity} × ${t.pricePerUnit.toFixed(2)}
//                 </p>
//               </div>
//               <div className="transaction-actions">
//                 <span className="transaction-amount">${t.totalAmount.toFixed(2)}</span>
//                 <button
//                   onClick={() => onUpdate(t._id, t.status)}
//                   className={`btn-action ${t.status === 'pending' ? 'btn-primary-small' : 'btn-secondary-small'}`}
//                 >
//                   {t.status === 'pending' ? 'Mark Paid' : 'Undo'}
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// // Transaction Modal Component
// function TransactionModal({ onClose, onSuccess }) {
//   const [formData, setFormData] = useState({
//     type: 'customer',
//     name: '',
//     quantity: 1,
//     pricePerUnit: 0
//   });

//   const handleSubmit = async () => {
//     if (!formData.name || formData.quantity < 1 || formData.pricePerUnit < 0) {
//       return;
//     }
//     try {
//       const response = await fetch(API_BASE_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...formData,
//           quantity: parseFloat(formData.quantity),
//           pricePerUnit: parseFloat(formData.pricePerUnit),
//           totalAmount: parseFloat(formData.quantity) * parseFloat(formData.pricePerUnit)
//         })
//       });
      
//       if (response.ok) {
//         onSuccess();
//         onClose();
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const total = (formData.quantity * formData.pricePerUnit).toFixed(2);

//   return (
//     <div className="modal-overlay">
//       <div className="modal">
//         <div className="modal-header">
//           <h2>New Transaction</h2>
//           <button onClick={onClose} className="btn-close">
//             <XIcon />
//           </button>
//         </div>
        
//         <div className="modal-body">
//           <div className="form-group">
//             <label>Type</label>
//             <select
//               value={formData.type}
//               onChange={(e) => setFormData({ ...formData, type: e.target.value })}
//             >
//               <option value="customer">Customer (Sale)</option>
//               <option value="supplier">Supplier (Purchase)</option>
//             </select>
//           </div>

//           <div className="form-group">
//             <label>Name</label>
//             <input
//               type="text"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               placeholder="Enter name"
//             />
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label>Quantity</label>
//               <input
//                 type="number"
//                 value={formData.quantity}
//                 onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
//                 min="1"
//               />
//             </div>
//             <div className="form-group">
//               <label>Price/Unit</label>
//               <input
//                 type="number"
//                 value={formData.pricePerUnit}
//                 onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
//                 step="0.01"
//                 min="0"
//               />
//             </div>
//           </div>

//           <div className="modal-total">
//             <span>Total Amount</span>
//             <span className="total-value">${total}</span>
//           </div>
          
//           <div className="modal-actions">
//             <button onClick={onClose} className="btn-secondary">Cancel</button>
//             <button onClick={handleSubmit} className="btn-primary">Add</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';

const API_BASE_URL = "http://localhost:5000/api";

// Icons
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const DollarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

export default function App() {
  const [persons, setPersons] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [paymentModal, setPaymentModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPersons = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/person`);
      const data = await response.json();
      setPersons(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchPersons(), fetchTransactions()]).then(() => setLoading(false));
  }, []);

  const customers = persons.filter(p => p.type === 'customer');
  const suppliers = persons.filter(p => p.type === 'supplier');

  const totalReceivable = customers.reduce((sum, c) => sum + c.balance, 0);
  const totalPayable = suppliers.reduce((sum, s) => sum + s.balance, 0);

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.container}>
          <h1 style={styles.logo}>💼 Ledger</h1>
          <div style={styles.headerButtons}>
            <button style={styles.btnPrimary} onClick={() => setIsPersonModalOpen(true)}>
              <PlusIcon /> Add Person
            </button>
            <button style={styles.btnSecondary} onClick={() => setIsTransactionModalOpen(true)}>
              <PlusIcon /> Add Transaction
            </button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.summaryGrid}>
          <div style={{...styles.card, ...styles.cardBlue}}>
            <div style={styles.cardIcon}>📊</div>
            <div>
              <div style={styles.cardLabel}>Net Position</div>
              <div style={styles.cardValue}>${(totalReceivable - totalPayable).toFixed(2)}</div>
            </div>
          </div>
          <div style={{...styles.card, ...styles.cardGreen}}>
            <div style={styles.cardIcon}>📈</div>
            <div>
              <div style={styles.cardLabel}>Total Receivable</div>
              <div style={styles.cardValue}>${totalReceivable.toFixed(2)}</div>
            </div>
          </div>
          <div style={{...styles.card, ...styles.cardRed}}>
            <div style={styles.cardIcon}>📉</div>
            <div>
              <div style={styles.cardLabel}>Total Payable</div>
              <div style={styles.cardValue}>${totalPayable.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          <div style={styles.mainGrid}>
            <PersonList
              title="Customers (Receivables)"
              persons={customers}
              transactions={transactions}
              onSelectPerson={setSelectedPerson}
              onRefresh={() => { fetchPersons(); fetchTransactions(); }}
            />
            <PersonList
              title="Suppliers (Payables)"
              persons={suppliers}
              transactions={transactions}
              onSelectPerson={setSelectedPerson}
              onRefresh={() => { fetchPersons(); fetchTransactions(); }}
            />
          </div>
        )}
      </main>

      {isPersonModalOpen && (
        <PersonModal
          onClose={() => setIsPersonModalOpen(false)}
          onSuccess={() => { fetchPersons(); setIsPersonModalOpen(false); }}
        />
      )}

      {isTransactionModalOpen && (
        <TransactionModal
          persons={persons}
          onClose={() => setIsTransactionModalOpen(false)}
          onSuccess={() => { fetchPersons(); fetchTransactions(); setIsTransactionModalOpen(false); }}
        />
      )}

      {selectedPerson && (
        <PersonDetailModal
          person={selectedPerson}
          transactions={transactions.filter(t => t.personId && t.personId._id === selectedPerson._id)}
          onClose={() => setSelectedPerson(null)}
          onPayment={(transaction) => setPaymentModal(transaction)}
          onRefresh={() => { fetchPersons(); fetchTransactions(); }}
        />
      )}

      {paymentModal && (
        <PaymentModal
          transaction={paymentModal}
          onClose={() => setPaymentModal(null)}
          onSuccess={() => {
            fetchPersons();
            fetchTransactions();
            setPaymentModal(null);
          }}
        />
      )}
    </div>
  );
}

function PersonList({ title, persons, transactions, onSelectPerson, onRefresh }) {
  const deletePerson = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this person?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/person/${id}`, { method: 'DELETE' });
      if (response.ok) {
        onRefresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete');
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={styles.personList}>
      <h2 style={styles.listTitle}>{title}</h2>
      <div style={styles.listBody}>
        {persons.length === 0 ? (
          <div style={styles.emptyState}>No persons added</div>
        ) : (
          persons.map(person => (
            <div
              key={person._id}
              style={styles.personItem}
              onClick={() => onSelectPerson(person)}
            >
              <div>
                <div style={styles.personName}>{person.name}</div>
                <div style={styles.personStats}>
                  Total: ${person.totalAmount?.toFixed(2) || '0.00'} | 
                  Paid: ${person.totalPaid?.toFixed(2) || '0.00'}
                </div>
              </div>
              <div style={styles.personActions}>
                <div style={person.balance > 0 ? styles.balancePositive : styles.balancePaid}>
                  ${person.balance?.toFixed(2) || '0.00'}
                </div>
                <button
                  style={styles.btnDelete}
                  onClick={(e) => deletePerson(person._id, e)}
                  title="Delete"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function PersonModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({ type: 'customer', name: '' });

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/person`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Add Person</h2>
          <button onClick={onClose} style={styles.btnClose}><XIcon /></button>
        </div>
        
        <div style={styles.modalBody}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <select
              style={styles.input}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="customer">Customer</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              style={styles.input}
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
            />
          </div>
          
          <div style={styles.modalActions}>
            <button onClick={onClose} style={styles.btnSecondary}>Cancel</button>
            <button onClick={handleSubmit} style={styles.btnPrimary}>Add Person</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TransactionModal({ persons, onClose, onSuccess }) {
  const [formData, setFormData] = useState({ type: 'customer', personId: '', amount: '' });

  const filteredPersons = persons.filter(p => p.type === formData.type);

  const handleSubmit = async () => {
    if (!formData.personId || !formData.amount || parseFloat(formData.amount) <= 0) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });
      
      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Add Transaction</h2>
          <button onClick={onClose} style={styles.btnClose}><XIcon /></button>
        </div>
        
        <div style={styles.modalBody}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <select
              style={styles.input}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value, personId: '' })}
            >
              <option value="customer">Customer (Sale)</option>
              <option value="supplier">Supplier (Purchase)</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select {formData.type === 'customer' ? 'Customer' : 'Supplier'}</label>
            <select
              style={styles.input}
              value={formData.personId}
              onChange={(e) => setFormData({ ...formData, personId: e.target.value })}
            >
              <option value="">Choose...</option>
              {filteredPersons.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Amount ($)</label>
            <input
              style={styles.input}
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          
          <div style={styles.modalActions}>
            <button onClick={onClose} style={styles.btnSecondary}>Cancel</button>
            <button onClick={handleSubmit} style={styles.btnPrimary}>Add Transaction</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonDetailModal({ person, transactions, onClose, onPayment, onRefresh }) {
  const deleteTransaction = async (id) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, { method: 'DELETE' });
      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{...styles.modal, maxWidth: '700px'}} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div>
            <h2 style={styles.modalTitle}>{person.name}</h2>
            <div style={styles.personType}>
              {person.type === 'customer' ? '👤 Customer' : '🏢 Supplier'}
            </div>
          </div>
          <button onClick={onClose} style={styles.btnClose}><XIcon /></button>
        </div>
        
        <div style={styles.modalBody}>
          <div style={styles.summaryRow}>
            <div style={styles.summaryItem}>
              <div style={styles.summaryLabel}>Total Amount</div>
              <div style={styles.summaryValue}>${person.totalAmount?.toFixed(2) || '0.00'}</div>
            </div>
            <div style={styles.summaryItem}>
              <div style={styles.summaryLabel}>Total Paid</div>
              <div style={styles.summaryValue}>${person.totalPaid?.toFixed(2) || '0.00'}</div>
            </div>
            <div style={styles.summaryItem}>
              <div style={styles.summaryLabel}>Balance</div>
              <div style={{...styles.summaryValue, color: person.balance > 0 ? '#e74c3c' : '#27ae60'}}>
                ${person.balance?.toFixed(2) || '0.00'}
              </div>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>Transactions</h3>
          <div style={styles.transactionsList}>
            {transactions.length === 0 ? (
              <div style={styles.emptyState}>No transactions</div>
            ) : (
              transactions.map(t => {
                const remaining = t.amount - t.paid;
                return (
                  <div key={t._id} style={styles.transactionCard}>
                    <div style={styles.transactionHeader}>
                      <div style={styles.transactionDate}>
                        {new Date(t.date).toLocaleDateString()}
                      </div>
                      <button
                        style={styles.btnDeleteSmall}
                        onClick={() => deleteTransaction(t._id)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                    <div style={styles.transactionDetails}>
                      <div>Amount: ${t.amount.toFixed(2)}</div>
                      <div>Paid: ${t.paid.toFixed(2)}</div>
                      <div style={{color: remaining > 0 ? '#e74c3c' : '#27ae60', fontWeight: 'bold'}}>
                        Remaining: ${remaining.toFixed(2)}
                      </div>
                    </div>
                    {remaining > 0 && (
                      <button
                        style={styles.btnPayment}
                        onClick={() => onPayment(t)}
                      >
                        <DollarIcon /> Add Payment
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ transaction, onClose, onSuccess }) {
  const remaining = transaction.amount - transaction.paid;
  const [amount, setAmount] = useState('');

  const handleSubmit = async () => {
    const payAmount = parseFloat(amount);
    if (!payAmount || payAmount <= 0 || payAmount > remaining) {
      alert(`Please enter a valid amount (max: $${remaining.toFixed(2)})`);
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/pay/${transaction._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payAmount })
      });
      
      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error || 'Payment failed');
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{...styles.modal, maxWidth: '400px'}} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Add Payment</h2>
          <button onClick={onClose} style={styles.btnClose}><XIcon /></button>
        </div>
        
        <div style={styles.modalBody}>
          <div style={styles.paymentInfo}>
            <div>Transaction Amount: ${transaction.amount.toFixed(2)}</div>
            <div>Already Paid: ${transaction.paid.toFixed(2)}</div>
            <div style={{fontWeight: 'bold', color: '#e74c3c'}}>
              Remaining: ${remaining.toFixed(2)}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Payment Amount ($)</label>
            <input
              style={styles.input}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              max={remaining}
            />
          </div>

          <div style={styles.quickButtons}>
            <button
              style={styles.btnQuick}
              onClick={() => setAmount((remaining / 2).toFixed(2))}
            >
              50%
            </button>
            <button
              style={styles.btnQuick}
              onClick={() => setAmount(remaining.toFixed(2))}
            >
              Full
            </button>
          </div>
          
          <div style={styles.modalActions}>
            <button onClick={onClose} style={styles.btnSecondary}>Cancel</button>
            <button onClick={handleSubmit} style={styles.btnPrimary}>Confirm Payment</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '1rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  headerButtons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1rem',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  card: {
    padding: '1rem',
    borderRadius: '12px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  cardBlue: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  cardGreen: {
    background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
  },
  cardRed: {
    background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
  },
  cardIcon: {
    fontSize: '2rem',
  },
  cardLabel: {
    fontSize: '0.8rem',
    opacity: 0.9,
    marginBottom: '0.25rem',
  },
  cardValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  personList: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  listTitle: {
    padding: '1rem',
    margin: 0,
    backgroundColor: '#34495e',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
  },
  listBody: {
    padding: '0.75rem',
  },
  personItem: {
    padding: '0.75rem',
    marginBottom: '0.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid transparent',
  },
  personName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '0.25rem',
  },
  personStats: {
    fontSize: '0.75rem',
    color: '#7f8c8d',
  },
  personActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  balancePositive: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#e74c3c',
    minWidth: '70px',
    textAlign: 'right',
  },
  balancePaid: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#27ae60',
    minWidth: '70px',
    textAlign: 'right',
  },
  btnPrimary: {
    padding: '0.6rem 1rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s',
    fontSize: '0.9rem',
  },
  btnSecondary: {
    padding: '0.6rem 1rem',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s',
    fontSize: '0.9rem',
  },
  btnDelete: {
    padding: '0.5rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  btnDeleteSmall: {
    padding: '0.4rem',
    backgroundColor: 'transparent',
    color: '#e74c3c',
    border: '1px solid #e74c3c',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '95%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    padding: '1rem',
    borderBottom: '1px solid #ecf0f1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.3rem',
    color: '#2c3e50',
  },
  modalBody: {
    padding: '1rem',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#2c3e50',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #ecf0f1',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  modalActions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  btnClose: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#7f8c8d',
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#7f8c8d',
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#95a5a6',
    fontSize: '0.95rem',
  },
  personType: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
    marginTop: '0.25rem',
  },
  summaryRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
    gap: '0.75rem',
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  summaryItem: {
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: '0.75rem',
    color: '#7f8c8d',
    marginBottom: '0.25rem',
  },
  summaryValue: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '0.75rem',
  },
  transactionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  transactionCard: {
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #ecf0f1',
  },
  transactionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  transactionDate: {
    fontSize: '0.8rem',
    color: '#7f8c8d',
    fontWeight: '600',
  },
  transactionDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    fontSize: '0.85rem',
    color: '#2c3e50',
    marginBottom: '0.5rem',
  },
  btnPayment: {
    width: '100%',
    padding: '0.6rem',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s',
    fontSize: '0.9rem',
  },
  paymentInfo: {
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.85rem',
    color: '#2c3e50',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  quickButtons: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.75rem',
  },
  btnQuick: {
    flex: 1,
    padding: '0.6rem',
    backgroundColor: '#ecf0f1',
    color: '#2c3e50',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s',
    fontSize: '0.9rem',
  },
};