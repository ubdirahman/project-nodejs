import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Layout from '../../components/Layout';

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [debts, setDebts] = useState([]);
    const [formData, setFormData] = useState({ customer_name: '', phone: '', address: '' });
    const [editId, setEditId] = useState(null);
    const [notification, setNotification] = useState(null);

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchData = async () => {
        const [custRes, debtRes] = await Promise.all([
            api.get('/customers'),
            api.get('/debts')
        ]);
        setCustomers(custRes.data);
        setDebts(debtRes.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Strict Validation: Name must be letters and spaces only
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(formData.customer_name)) {
            alert('Fadlan Magaca Customer-ka ku qor xarfo kaliya. Lambarada lama oggola.');
            return;
        }

        // Phone must be numbers only
        if (!/^\d+$/.test(formData.phone)) {
            alert('Fadlan Phone-ka ku qor lambar kaliya.');
            return;
        }

        if (editId) {
            await api.put(`/customers/${editId}`, formData);
            showNotification(`Si guul leh ayaad u bedeshay: ${formData.customer_name}`);
            setEditId(null);
        } else {
            await api.post('/customers', formData);
            showNotification(`Si guul leh ayaad u diwaangelisay: ${formData.customer_name}`);
        }
        setFormData({ customer_name: '', phone: '', address: '' });
        fetchData();
    };

    const handleTextKeyPress = (e) => {
        if (/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handlePhoneKeyPress = (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleEdit = (customer) => {
        setFormData({ customer_name: customer.customer_name, phone: customer.phone, address: customer.address });
        setEditId(customer._id);
    };

    const handleDelete = async (id) => {
        const customer = customers.find(c => c._id === id);
        if (window.confirm('Delete this customer?')) {
            await api.delete(`/customers/${id}`);
            showNotification(`Si guul leh ayaad u tirtirtay: ${customer?.customer_name}`);
            fetchData();
        }
    };

    return (
        <Layout>
            <div style={{ marginBottom: '1.25rem' }}>
                <h1 style={{ marginBottom: '0.25rem' }}>Client Directory</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Establish and manage long-term customer relationships.</p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.25rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{editId ? 'Modify Client' : 'Register New Client'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Client Name</label>
                        <input
                            type="text" placeholder="e.g. Abdurahman Ali" required
                            value={formData.customer_name}
                            onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                            onKeyPress={handleTextKeyPress}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Phone Number</label>
                        <input
                            type="text" placeholder="e.g. 61xxxxxxx" required
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            onKeyPress={handlePhoneKeyPress}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Office/Home Address</label>
                        <input
                            type="text" placeholder="e.g. Mogadishu, Somalia" required
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editId ? 'Save Changes' : 'Register Client'}</button>
                        {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setFormData({ customer_name: '', phone: '', address: '' }); }}>Cancel</button>}
                    </div>
                </form>
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
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>CLIENT DETAILS</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>COMMUNICATION</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>FINANCIAL SUMMARY</th>
                            <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(c => {
                            const customerDebts = debts.filter(d => d.customer?._id === c._id);
                            const totalAmount = customerDebts.reduce((acc, d) => acc + (d.quantity * d.price), 0);
                            const totalDebt = customerDebts.reduce((acc, d) => {
                                if (d.status === 'paid') return acc;
                                return acc + ((d.quantity * d.price) - (d.paidAmount || 0));
                            }, 0);
                            const totalPaid = totalAmount - totalDebt;

                            return (
                                <tr key={c._id} className="table-row-hover">
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{c.customer_name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.address}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>{c.phone}</td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Total Trace: ${totalAmount}</div>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>Paid: ${totalPaid}</span>
                                            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '8px', background: totalDebt > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: totalDebt > 0 ? '#ef4444' : '#10b981' }}>{totalDebt > 0 ? `Due: $${totalDebt}` : 'Clear'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                                        <button className="logout-btn" style={{ marginRight: '0.5rem', color: 'var(--primary)', borderColor: 'rgba(99, 102, 241, 0.2)' }} onClick={() => handleEdit(c)}>Edit</button>
                                        <button className="logout-btn" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(c._id)}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Customer;
