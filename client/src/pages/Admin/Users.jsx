import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Layout from '../../components/Layout';
import { FaUserShield, FaUserEdit, FaLock, FaTrashAlt, FaBan, FaCheckCircle, FaKey } from 'react-icons/fa';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        phone: '',
        password: '',
        role: 'user'
    });

    const [notification, setNotification] = useState(null);

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        const user = users.find(u => u._id === id);
        if (window.confirm('Are you sure you want to permanently remove this user?')) {
            try {
                await api.delete(`/admin/users/${id}`);
                showNotification(`Si guul leh ayaad u tirtirtay user-ka: ${user?.username}`);
                fetchUsers();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const toggleBlock = async (user) => {
        try {
            const { data } = await api.put(`/admin/users/${user._id}/block`);
            fetchUsers();
            const message = data.isBlocked
                ? `Waxaad block-gareysay ${user.username}`
                : `Waxaad unblock-gareysay ${user.username}`;
            showNotification(message);
        } catch (error) {
            console.error(error);
            alert('Cillad ayaa dhacday markii la isku dayay isbedelka.');
        }
    };

    const updatePassword = async (id) => {
        const user = users.find(u => u._id === id);
        const newPassword = window.prompt('Enter new password for this user:');
        if (newPassword) {
            try {
                await api.put(`/admin/users/${id}/password`, { password: newPassword });
                showNotification(`Password-ka si guul leh ayaa loogu bedelay user-ka: ${user?.username}`);
            } catch (error) {
                console.error(error);
                alert('Failed to update password');
            }
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/register', formData);
            showNotification(`User ${formData.username} si guul leh ayaa loo diwaangeliyay!`);
            setShowRegister(false);
            setFormData({ full_name: '', username: '', phone: '', password: '', role: 'user' });
            fetchUsers();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Waa la diiday diwaangelinta.');
        }
    };

    return (
        <Layout>
            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ marginBottom: '0.25rem' }}>User Control Center</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage system access and security credentials.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowRegister(!showRegister)}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}
                >
                    {showRegister ? 'Cancel' : 'Add New User'}
                </button>
            </div>

            {showRegister && (
                <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--primary-glow)' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Diwaangeli User Cusub</h3>
                    <form onSubmit={handleRegister} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>Magaca oo Buuxa</label>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="Username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Telefoonka</label>
                            <input
                                type="text"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)' }}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px' }}>Save User</button>
                        </div>
                    </form>
                </div>
            )}

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
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>USER IDENTITY</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>ROLE</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>STATUS</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>JOINED</th>
                            <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>SECURITY ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="table-row-hover">
                                <td style={{ padding: '1.25rem 1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div className="user-avatar" style={{ width: '45px', height: '45px' }}>
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user.full_name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>@{user.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1rem' }}>
                                    <span style={{
                                        padding: '0.3rem 0.75rem',
                                        borderRadius: '12px',
                                        fontSize: '0.85rem',
                                        fontWeight: 500,
                                        background: user.role === 'admin' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(6, 182, 212, 0.1)',
                                        color: user.role === 'admin' ? 'var(--primary)' : 'var(--accent)'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem 1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            background: user.isBlocked ? '#ef4444' : '#10b981',
                                            boxShadow: `0 0 10px ${user.isBlocked ? '#ef444466' : '#10b98166'}`
                                        }}></div>
                                        <span style={{ fontSize: '0.9rem', color: user.isBlocked ? '#ef4444' : '#10b981', fontWeight: 500 }}>
                                            {user.isBlocked ? 'Disabled' : 'Active'}
                                        </span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button
                                            className="logout-btn"
                                            title={user.isBlocked ? 'Enable access' : 'Disable access'}
                                            onClick={() => toggleBlock(user)}
                                            style={{ color: user.isBlocked ? '#10b981' : '#f59e0b', borderColor: user.isBlocked ? '#10b98133' : '#f59e0b33' }}
                                        >
                                            {user.isBlocked ? <FaCheckCircle /> : <FaBan />}
                                        </button>
                                        <button
                                            className="logout-btn"
                                            title="Reset Password"
                                            onClick={() => updatePassword(user._id)}
                                            style={{ color: 'var(--primary)', borderColor: 'var(--primary-glow)' }}
                                        >
                                            <FaKey />
                                        </button>
                                        <button
                                            className="logout-btn"
                                            title="Delete User"
                                            onClick={() => deleteUser(user._id)}
                                            style={{ color: '#ef4444', borderColor: '#ef444433' }}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && !loading && (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <FaUserShield style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }} />
                        <p>No system users found.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AdminUsers;
