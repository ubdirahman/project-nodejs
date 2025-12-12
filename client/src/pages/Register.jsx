import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Register = () => {
    const [full_name, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { full_name, phone, username, password });
            navigate('/login');
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Registration failed. Username might be taken.');
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
                {error && <div style={{ color: 'var(--secondary-color)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
                        <input type="text" value={full_name} onChange={(e) => setFullName(e.target.value)} required placeholder="Enter full name" />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Enter phone number" />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Choose a username" />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Choose a password" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <Link to="/login" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>Already have an account? Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
