import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { username, password });
            localStorage.setItem('user', JSON.stringify(data));
            if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
                {error && <div style={{ color: 'var(--secondary-color)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter your username"
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <Link to="/register" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>Don't have an account? Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
