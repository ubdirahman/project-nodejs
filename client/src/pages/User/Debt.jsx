import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Layout from '../../components/Layout';

const Debt = () => {
    const [debts, setDebts] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({ customer: '', product: '', quantity: '', price: '', status: 'unpaid' });
    const [editId, setEditId] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentData, setPaymentData] = useState({ id: null, total: 0, paid: 0, remaining: 0, amount: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState(null);

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchData = async () => {
        const [debtRes, prodRes, custRes] = await Promise.all([
            api.get('/debts'),
            api.get('/products'),
            api.get('/customers')
        ]);
        setDebts(debtRes.data);
        setProducts(prodRes.data);
        setCustomers(custRes.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleNumberKeyPress = (e) => {
        if (!/[0-9.]/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleProductChange = (e) => {
        const productId = e.target.value;
        const product = products.find(p => p._id === productId);
        setFormData({
            ...formData,
            product: productId,
            price: product ? product.price : ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const customer = customers.find(c => c._id === formData.customer);
        if (editId) {
            await api.put(`/debts/${editId}`, formData);
            showNotification(`Si guul leh ayaad u bedeshay deyta: ${customer?.customer_name}`);
            setEditId(null);
        } else {
            await api.post('/debts', formData);
            showNotification(`Si guul leh ayaad u diwaangelisay deyta: ${customer?.customer_name}`);
        }
        setFormData({ customer: '', product: '', quantity: '', price: '', status: 'unpaid' });
        fetchData();
    };

    const handleEdit = (debt) => {
        setFormData({
            customer: debt.customer?._id || '',
            product: debt.product?._id || '',
            quantity: debt.quantity,
            price: debt.price,
            status: debt.status
        });
        setEditId(debt._id);
    };

    const handleDelete = async (id) => {
        const debt = debts.find(d => d._id === id);
        if (window.confirm('Delete this debt record?')) {
            await api.delete(`/debts/${id}`);
            showNotification(`Si guul leh ayaad u tirtirtay deyta: ${debt.customer?.customer_name}`);
            fetchData();
        }
    };

    const handlePayment = (debt) => {
        const total = debt.quantity * debt.price;
        const paid = debt.paidAmount || 0;
        setPaymentData({
            id: debt._id,
            total: total,
            paid: paid,
            remaining: total - paid,
            amount: '',
            customer: debt.customer?.customer_name
        });
        setShowPaymentModal(true);
    };

    const confirmPayment = async () => {
        if (paymentData.amount) {
            const newStatus = (paymentData.remaining - paymentData.amount) <= 0 ? 'paid' : 'unpaid';
            await api.put(`/debts/${paymentData.id}`, { status: newStatus, amount: paymentData.amount });
            showNotification(`lacag bixin ayaa loo sameeyey: ${paymentData.customer}`);
            setShowPaymentModal(false);
            fetchData();
        }
    };

    const filteredDebts = debts.filter(d =>
        d.customer?.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalDue = filteredDebts.reduce((acc, d) => acc + ((d.quantity * d.price) - (d.paidAmount || 0)), 0);

    return (
        <Layout>
            <div style={{ marginBottom: '1.25rem' }}>
                <h1 style={{ marginBottom: '0.25rem' }}>Debt Ledger</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Track and finalize outstanding credit transactions.</p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.25rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{editId ? 'Modify Ledger Entry' : 'Record Credit Sale'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Customer</label>
                        <select required value={formData.customer} onChange={e => setFormData({ ...formData, customer: e.target.value })}>
                            <option value="">Select recipient...</option>
                            {customers.map(c => <option key={c._id} value={c._id}>{c.customer_name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Product</label>
                        <select required value={formData.product} onChange={handleProductChange}>
                            <option value="">Choose item...</option>
                            {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Qty</label>
                        <input type="number" placeholder="0" required value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} onKeyPress={handleNumberKeyPress} />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Price</label>
                        <input type="number" placeholder="0.00" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} onKeyPress={handleNumberKeyPress} />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Payment Status</label>
                        <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                            <option value="unpaid">Unpaid / Credit</option>
                            <option value="paid">Settled / Closed</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editId ? 'Save Edits' : 'Post to Ledger'}</button>
                        {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setFormData({ customer: '', product: '', quantity: '', price: '', status: 'unpaid' }); }}>Cancel</button>}
                    </div>
                </form>
            </div>

            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Filter by Client Name</label>
                    <input type="text" placeholder="Search accounts..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: '0.75rem', width: '100%', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }} />
                </div>
                <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Aggregate Exposure:</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444' }}>${totalDue}</span>
                </div>
            </div>

            {notification && (
                <div className="glass-panel animate-fade-in" style={{
                    padding: '1rem 1.5rem',
                    marginBottom: '1.5rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderColor: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                    {notification}
                </div>
            )}

            <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>DEBTOR RECORD</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>PRODUCT DETAILS</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>TOTAL VALUE</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>REMAINING OBLIGATION</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>STATUS</th>
                            <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDebts.map(d => {
                            const total = d.quantity * d.price;
                            const paid = d.paidAmount || 0;
                            const remaining = total - paid;
                            return (
                                <tr key={d._id} className="table-row-hover">
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{d.customer?.customer_name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(d.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ fontSize: '0.9rem' }}>{d.product?.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.quantity} unit{d.quantity > 1 ? 's' : ''}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', fontWeight: 500 }}>${total}</td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ color: remaining > 0 ? '#ef4444' : '#10b981', fontWeight: 700 }}>${remaining}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Settled: ${paid}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <span style={{
                                            padding: '0.3rem 0.75rem',
                                            borderRadius: '12px',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            background: d.status === 'paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: d.status === 'paid' ? '#10b981' : '#ef4444',
                                            textTransform: 'uppercase'
                                        }}>
                                            {d.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            {remaining > 0 && (
                                                <button className="logout-btn" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.2)' }} onClick={() => handlePayment(d)}>Settle</button>
                                            )}
                                            <button className="logout-btn" style={{ color: 'var(--primary)', borderColor: 'rgba(99, 102, 241, 0.2)' }} onClick={() => handleEdit(d)}>Edit</button>
                                            <button className="logout-btn" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(d._id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {showPaymentModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="glass-panel" style={{ padding: '2rem', width: '400px', maxWidth: '90%' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Process Payment</h3>
                        <p style={{ marginBottom: '1rem' }}>Total: ${paymentData.total} | Paid: ${paymentData.paid} | <strong>Due: ${paymentData.remaining}</strong></p>
                        <input type="number" placeholder="Enter Amount" value={paymentData.amount} onChange={e => setPaymentData({ ...paymentData, amount: e.target.value })} onKeyPress={handleNumberKeyPress} style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={confirmPayment}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Debt;
