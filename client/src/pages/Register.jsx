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

        // Strict Validation: Text fields must be letters and spaces only
        const textRegex = /^[a-zA-Z\s]+$/;
        if (!textRegex.test(full_name)) {
            alert('Fadlan Hubi Magacaada (haku qorin lambar kaliya)');
            return;
        }
        if (!textRegex.test(username)) {
            alert('Fadlan Hubi Username-ka (haku qorin lambar kaliya)');
            return;
        }
        if (!/^\d+$/.test(phone)) {
            alert('Fadlan Phone-ka ku qor lambar kaliya');
            return;
        }

        try {
            await api.post('/auth/register', { full_name, phone, username, password });
            navigate('/login');
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Registration failed. Username might be taken.');
        }
    };

    const handleTextKeyPress = (e) => {
        if (/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handlePhoneKeyPress = (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div className="brand-dot"></div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>IMS POS</span>
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Join the Platform</h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Start managing your business with precision.</p>
                </div>

                {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '12px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Full Identity Name</label>
                        <input type="text" value={full_name} onChange={(e) => setFullName(e.target.value)} onKeyPress={handleTextKeyPress} required placeholder="e.g. Abdurahman Ali" />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Secure Contact (Phone)</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} onKeyPress={handlePhoneKeyPress} required placeholder="e.g. 61xxxxxxx" />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>System Alias (Username)</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} onKeyPress={handleTextKeyPress} required placeholder="e.g. abdi_pos" />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Access Key (Password)</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ height: '48px', marginTop: '1rem' }}>Initiate Registration</button>

                    <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Already part of the system? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Authenticate Here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
