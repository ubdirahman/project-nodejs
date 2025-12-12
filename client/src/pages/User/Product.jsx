import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Layout from '../../components/Layout';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ name: '', category: '', stock: '', price: '' });
    const [editId, setEditId] = useState(null);

    const fetchProducts = async () => {
        const { data } = await api.get('/products');
        setProducts(data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await api.put(`/products/${editId}`, formData);
            setEditId(null);
        } else {
            await api.post('/products', formData);
        }
        setFormData({ name: '', category: '', stock: '', price: '' });
        fetchProducts();
    };

    const handleEdit = (product) => {
        setFormData({ name: product.name, category: product.category, stock: product.stock, price: product.price });
        setEditId(product._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this product?')) {
            await api.delete(`/products/${id}`);
            fetchProducts();
        }
    };

    return (
        <Layout>
            <h1>Products</h1>
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3>{editId ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <input type="text" placeholder="Product Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <input type="text" placeholder="Category" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                    <input type="number" placeholder="Stock" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                    <input type="number" placeholder="Price" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                    <button type="submit" className="btn btn-primary">{editId ? 'Update Product' : 'Add Product'}</button>
                    {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setFormData({ name: '', category: '', stock: '', price: '' }); }}>Cancel</button>}
                </form>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Category</th>
                            <th style={{ padding: '1rem' }}>Stock</th>
                            <th style={{ padding: '1rem' }}>Price</th>
                            <th style={{ padding: '1rem' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem' }}>{p.name}</td>
                                <td style={{ padding: '1rem' }}>{p.category}</td>
                                <td style={{ padding: '1rem' }}>{p.stock}</td>
                                <td style={{ padding: '1rem' }}>${p.price}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button className="btn btn-secondary" style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleEdit(p)}>Edit</button>
                                    <button className="btn btn-primary" style={{ background: '#ef4444', padding: '0.4rem 0.8rem', fontSize: '0.8rem', boxShadow: 'none' }} onClick={() => handleDelete(p._id)}>Delete</button>
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
