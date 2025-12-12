import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Layout from '../../components/Layout';

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({ customer_name: '', phone: '', address: '' });
    const [editId, setEditId] = useState(null);

    const fetchCustomers = async () => {
        const { data } = await api.get('/customers');
        setCustomers(data);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await api.put(`/customers/${editId}`, formData);
            setEditId(null);
        } else {
            await api.post('/customers', formData);
        }
        setFormData({ customer_name: '', phone: '', address: '' });
        fetchCustomers();
    };

    const handleEdit = (customer) => {
        setFormData({ customer_name: customer.customer_name, phone: customer.phone, address: customer.address });
        setEditId(customer._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this customer?')) {
            await api.delete(`/customers/${id}`);
            fetchCustomers();
        }
    };

    return (
        <Layout>
            <h1>Customers</h1>
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3>{editId ? 'Edit Customer' : 'Add New Customer'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <input
                        type="text" placeholder="Customer Name" required
                        value={formData.customer_name}
                        onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                    />
                    <input
                        type="text" placeholder="Phone" required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <input
                        type="text" placeholder="Address" required
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                    />
                    <button type="submit" className="btn btn-primary">{editId ? 'Update Customer' : 'Add Customer'}</button>
                    {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setFormData({ customer_name: '', phone: '', address: '' }); }}>Cancel</button>}
                </form>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Phone</th>
                            <th style={{ padding: '1rem' }}>Address</th>
                            <th style={{ padding: '1rem' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(c => (
                            <tr key={c._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem' }}>{c.customer_name}</td>
                                <td style={{ padding: '1rem' }}>{c.phone}</td>
                                <td style={{ padding: '1rem' }}>{c.address}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button className="btn btn-secondary" style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleEdit(c)}>Edit</button>
                                    <button className="btn btn-primary" style={{ background: '#ef4444', padding: '0.4rem 0.8rem', fontSize: '0.8rem', boxShadow: 'none' }} onClick={() => handleDelete(c._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Customer;
