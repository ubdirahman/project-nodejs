import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Layout from '../../components/Layout';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ product: '', quantity: '', price: '' });
    const [editId, setEditId] = useState(null);
    const [notification, setNotification] = useState(null);

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchSales = async () => {
        const { data } = await api.get('/sales');
        setSales(data);
    };

    const fetchProducts = async () => {
        const { data } = await api.get('/products');
        setProducts(data);
    };

    useEffect(() => {
        fetchSales();
        fetchProducts();
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
        try {
            const product = products.find(p => p._id === formData.product);
            if (editId) {
                await api.put(`/sales/${editId}`, formData);
                showNotification(`Si guul leh ayaad u bedeshay iibka: ${product?.name}`);
                setEditId(null);
            } else {
                await api.post('/sales', formData);
                showNotification(`Si guul leh ayaad u diwaangelisay iibka: ${product?.name}`);
            }
            setFormData({ product: '', quantity: '', price: '' });
            fetchSales();
            fetchProducts();
        } catch (error) {
            alert('Error processing sale (Check stock?)');
        }
    };

    const handleEdit = (sale) => {
        // Warning: Changing product/quantity logic is complex. 
        // For now, we populate and let backend handle simplistic updates (price/total).
        // If user changes product/quantity, it might not reflect stock changes ideally in this simple update implementation.
        setFormData({
            product: sale.product?._id || '',
            quantity: sale.quantity,
            price: sale.price
        });
        setEditId(sale._id);
    };

    const handleDelete = async (id) => {
        const sale = sales.find(s => s._id === id);
        if (window.confirm('Delete this sale? Stock will be restored.')) {
            await api.delete(`/sales/${id}`);
            showNotification(`Si guul leh ayaad u tirtirtay iibkii: ${sale.product?.name}`);
            fetchSales();
            fetchProducts();
        }
    };

    return (
        <Layout>
            <div style={{ marginBottom: '1.25rem' }}>
                <h1 style={{ marginBottom: '0.25rem' }}>Transaction History</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Review and manage point-of-sale transactions.</p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.25rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{editId ? 'Modify Transaction' : 'Record New Sale'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Selected Product</label>
                        <select required value={formData.product} onChange={handleProductChange} disabled={!!editId}>
                            <option value="">Choose item...</option>
                            {products.map(p => (
                                <option key={p._id} value={p._id}>{p.name} (Available: {p.stock})</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Sale Quantity</label>
                        <input type="number" placeholder="0" required value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} onKeyPress={handleNumberKeyPress} disabled={!!editId} />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Effective Price ($)</label>
                        <input type="number" placeholder="0.00" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} onKeyPress={handleNumberKeyPress} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editId ? 'Save Changes' : 'Confirm Sale'}</button>
                        {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setFormData({ product: '', quantity: '', price: '' }); }}>Cancel</button>}
                    </div>
                </form>
                {editId && <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#f59e0b', fontStyle: 'italic' }}>Note: Only price can be modified for existing sales.</div>}
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
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>PRODUCT</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>QTY / UNIT</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>TOTAL SETTLEMENT</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>DATE RECORDED</th>
                            <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map(s => (
                            <tr key={s._id} className="table-row-hover">
                                <td style={{ padding: '1.25rem 1rem', fontWeight: 600 }}>{s.product?.name || 'Archived Product'}</td>
                                <td style={{ padding: '1.25rem 1rem' }}>
                                    <span style={{ fontWeight: 500 }}>{s.quantity}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.25rem' }}>× ${s.price}</span>
                                </td>
                                <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>${s.total}</td>
                                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                                    <button className="logout-btn" style={{ marginRight: '0.5rem', color: 'var(--primary)', borderColor: 'rgba(99, 102, 241, 0.2)' }} onClick={() => handleEdit(s)}>Edit</button>
                                    <button className="logout-btn" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(s._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Sales;
