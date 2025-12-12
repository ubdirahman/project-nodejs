import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Layout from '../../components/Layout';

const Debt = () => {
    const [debts, setDebts] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({ customer: '', product: '', quantity: '', price: '', status: 'unpaid' });
    const [editId, setEditId] = useState(null);

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
        if (editId) {
            await api.put(`/debts/${editId}`, formData);
            setEditId(null);
        } else {
            await api.post('/debts', formData);
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
        if (window.confirm('Delete this debt record?')) {
            await api.delete(`/debts/${id}`);
            fetchData();
        }
    };

    const updateStatus = async (id, status) => {
        await api.put(`/debts/${id}`, { status });
        fetchData();
    };

    return (
        <Layout>
            <h1>Debt Management</h1>
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3>{editId ? 'Edit Debt Record' : 'Record Debt'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    <select required value={formData.customer} onChange={e => setFormData({ ...formData, customer: e.target.value })}>
                        <option value="">Select Customer</option>
                        {customers.map(c => <option key={c._id} value={c._id}>{c.customer_name}</option>)}
                    </select>
                    <select required value={formData.product} onChange={handleProductChange}>
                        <option value="">Select Product</option>
                        {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                    <input type="number" placeholder="Qty" required value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                    <input type="number" placeholder="Price" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                    </select>
                    <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Add Record'}</button>
                    {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setFormData({ customer: '', product: '', quantity: '', price: '', status: 'unpaid' }); }}>Cancel</button>}
                </form>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem' }}>Customer</th>
                            <th style={{ padding: '1rem' }}>Product</th>
                            <th style={{ padding: '1rem' }}>Qty</th>
                            <th style={{ padding: '1rem' }}>Amount</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {debts.map(d => (
                            <tr key={d._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem' }}>{d.customer?.customer_name}</td>
                                <td style={{ padding: '1rem' }}>{d.product?.name}</td>
                                <td style={{ padding: '1rem' }}>{d.quantity}</td>
                                <td style={{ padding: '1rem' }}>${d.quantity * d.price}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        color: d.status === 'paid' ? '#10b981' : '#ef4444',
                                        fontWeight: 'bold',
                                        textTransform: 'capitalize'
                                    }}>
                                        {d.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {d.status === 'unpaid' && (
                                        <button className="btn btn-secondary" style={{ marginRight: '0.5rem', fontSize: '0.8rem' }} onClick={() => updateStatus(d._id, 'paid')}>Mark Paid</button>
                                    )}
                                    <button className="btn btn-secondary" style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleEdit(d)}>Edit</button>
                                    <button className="btn btn-primary" style={{ background: '#ef4444', padding: '0.4rem 0.8rem', fontSize: '0.8rem', boxShadow: 'none' }} onClick={() => handleDelete(d._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Debt;
