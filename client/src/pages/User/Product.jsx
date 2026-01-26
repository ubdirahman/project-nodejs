import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Layout from '../../components/Layout';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ name: '', category: '', stock: '', price: '' });
    const [editId, setEditId] = useState(null);
    const [notification, setNotification] = useState(null);

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchProducts = async () => {
        const { data } = await api.get('/products');
        setProducts(data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Strict Validation: Text fields must be letters and spaces only
        const textRegex = /^[a-zA-Z\s]+$/;
        if (!textRegex.test(formData.name)) {
            alert('Fadlan Product Name-ka ku qor xarfo kaliya (A-Z). Lambarada lama oggola.');
            return;
        }
        if (!textRegex.test(formData.category)) {
            alert('Fadlan Category-ka ku qor xarfo kaliya (A-Z). Lambarada lama oggola.');
            return;
        }

        if (editId) {
            await api.put(`/products/${editId}`, formData);
            showNotification(`Si guul leh ayaad u bedeshay: ${formData.name}`);
            setEditId(null);
        } else {
            await api.post('/products', formData);
            showNotification(`Si guul leh ayaad u diwaangelisay: ${formData.name}`);
        }
        setFormData({ name: '', category: '', stock: '', price: '' });
        fetchProducts();
    };

    const handleTextKeyPress = (e) => {
        if (/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleNumberKeyPress = (e) => {
        if (!/[0-9.]/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleEdit = (product) => {
        setFormData({ name: product.name, category: product.category, stock: product.stock, price: product.price });
        setEditId(product._id);
    };

    const handleDelete = async (id) => {
        const product = products.find(p => p._id === id);
        if (window.confirm('Delete this product?')) {
            await api.delete(`/products/${id}`);
            showNotification(`Si guul leh ayaad u tirtirtay: ${product?.name}`);
            fetchProducts();
        }
    };

    return (
        <Layout>
            <div style={{ marginBottom: '1.25rem' }}>
                <h1 style={{ marginBottom: '0.25rem' }}>Inventory</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage your products and stock levels.</p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.25rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{editId ? 'Modify Product' : 'Register New Item'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Product Name</label>
                        <input type="text" placeholder="e.g. Wireless Mouse" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} onKeyPress={handleTextKeyPress} />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Category</label>
                        <input type="text" placeholder="e.g. Electronics" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} onKeyPress={handleTextKeyPress} />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Stock Quantity</label>
                        <input type="number" placeholder="0" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} onKeyPress={handleNumberKeyPress} />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Unit Price ($)</label>
                        <input type="number" placeholder="0.00" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} onKeyPress={handleNumberKeyPress} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editId ? 'Save Changes' : 'Add to Inventory'}</button>
                        {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setFormData({ name: '', category: '', stock: '', price: '' }); }}>Cancel</button>}
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
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>PRODUCT DETAILS</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>CATEGORY</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>STOCK STATUS</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>PRICE</th>
                            <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p._id} className="table-row-hover">
                                <td style={{ padding: '1.25rem 1rem', fontWeight: 600 }}>{p.name}</td>
                                <td style={{ padding: '1.25rem 1rem' }}>
                                    <span style={{ padding: '0.3rem 0.75rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.08)', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 500 }}>
                                        {p.category}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem 1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.stock > 10 ? '#10b981' : '#f59e0b' }}></div>
                                        {p.stock} units
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1rem', fontWeight: 700 }}>${p.price}</td>
                                <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                                    <button className="logout-btn" style={{ marginRight: '0.5rem', color: 'var(--primary)', borderColor: 'rgba(99, 102, 241, 0.2)' }} onClick={() => handleEdit(p)}>Edit</button>
                                    <button className="logout-btn" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(p._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Product;
