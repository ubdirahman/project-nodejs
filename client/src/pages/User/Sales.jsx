import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Layout from '../../components/Layout';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ product: '', quantity: '', price: '' });
    const [editId, setEditId] = useState(null);

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
            if (editId) {
                await api.put(`/sales/${editId}`, formData);
                setEditId(null);
            } else {
                await api.post('/sales', formData);
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
        if (window.confirm('Delete this sale? Stock will be restored.')) {
            await api.delete(`/sales/${id}`);
            fetchSales();
            fetchProducts();
        }
    };

    return (
        <Layout>
            <h1>Sales</h1>
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3>{editId ? 'Edit Sale' : 'New Sale'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <select required value={formData.product} onChange={handleProductChange} disabled={!!editId}>
                        <option value="">Select Product {editId && '(Cannot change)'}</option>
                        {products.map(p => (
                            <option key={p._id} value={p._id}>{p.name} (Stock: {p.stock})</option>
                        ))}
                    </select>
                    <input type="number" placeholder="Quantity" required value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} disabled={!!editId} />
                    {editId && <span style={{ fontSize: '0.8rem', color: 'orange' }}>Note: Only Price is editable. To change Qty, delete and re-add.</span>}
                    <input type="number" placeholder="Price (Auto)" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                    <button type="submit" className="btn btn-primary">{editId ? 'Update Sale' : 'Record Sale'}</button>
                    {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setFormData({ product: '', quantity: '', price: '' }); }}>Cancel</button>}
                </form>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem' }}>Product</th>
                            <th style={{ padding: '1rem' }}>Quantity</th>
                            <th style={{ padding: '1rem' }}>Price</th>
                            <th style={{ padding: '1rem' }}>Total</th>
                            <th style={{ padding: '1rem' }}>Date</th>
                            <th style={{ padding: '1rem' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map(s => (
                            <tr key={s._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem' }}>{s.product?.name || 'Unknown'}</td>
                                <td style={{ padding: '1rem' }}>{s.quantity}</td>
                                <td style={{ padding: '1rem' }}>${s.price}</td>
                                <td style={{ padding: '1rem' }}>${s.total}</td>
                                <td style={{ padding: '1rem' }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button className="btn btn-secondary" style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleEdit(s)}>Edit</button>
                                    <button className="btn btn-primary" style={{ background: '#ef4444', padding: '0.4rem 0.8rem', fontSize: '0.8rem', boxShadow: 'none' }} onClick={() => handleDelete(s._id)}>Delete</button>
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
