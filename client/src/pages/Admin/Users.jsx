import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Layout from '../../components/Layout';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/admin/users/${id}`);
                fetchUsers();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <Layout>
            <h1>User Management</h1>
            <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Username</th>
                            <th style={{ padding: '1rem' }}>Role</th>
                            <th style={{ padding: '1rem' }}>Joined</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem' }}>{user.full_name}</td>
                                <td style={{ padding: '1rem' }}>{user.username}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        background: user.role === 'admin' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(14, 165, 233, 0.2)',
                                        color: user.role === 'admin' ? 'var(--primary-color)' : 'var(--accent-color)'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => deleteUser(user._id)}
                                        style={{ color: 'var(--secondary-color)', padding: '0.5rem' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default AdminUsers;
