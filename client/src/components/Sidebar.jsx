import { Link, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBox, FaShoppingCart, FaMoneyBillWave, FaChartBar, FaCog, FaSignOutAlt, FaUserTie } from 'react-icons/fa';

const Sidebar = ({ role }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const linkStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        borderRadius: '8px',
        marginBottom: '0.5rem',
        transition: 'all 0.3s'
    };

    return (
        <div className="sidebar">
            <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>InventorySys</h2>
            </div>

            <nav style={{ flex: 1 }}>
                {role === 'admin' ? (
                    <>
                        <Link to="/admin" className="nav-link" style={linkStyle}><FaTachometerAlt style={{ marginRight: '10px' }} /> Dashboard</Link>
                        <Link to="/admin/users" className="nav-link" style={linkStyle}><FaUsers style={{ marginRight: '10px' }} /> User Management</Link>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard" className="nav-link" style={linkStyle}><FaTachometerAlt style={{ marginRight: '10px' }} /> Dashboard</Link>
                        <Link to="/customers" className="nav-link" style={linkStyle}><FaUserTie style={{ marginRight: '10px' }} /> Customers</Link>
                        <Link to="/products" className="nav-link" style={linkStyle}><FaBox style={{ marginRight: '10px' }} /> Products</Link>
                        <Link to="/sales" className="nav-link" style={linkStyle}><FaShoppingCart style={{ marginRight: '10px' }} /> Sales</Link>
                        <Link to="/debts" className="nav-link" style={linkStyle}><FaMoneyBillWave style={{ marginRight: '10px' }} /> Debt</Link>
                        <Link to="/reports" className="nav-link" style={linkStyle}><FaChartBar style={{ marginRight: '10px' }} /> Reports</Link>
                        <Link to="/settings" className="nav-link" style={linkStyle}><FaCog style={{ marginRight: '10px' }} /> Settings</Link>
                    </>
                )}
            </nav>

            <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'transparent', color: 'var(--secondary-color)' }}>
                <FaSignOutAlt style={{ marginRight: '10px' }} /> Logout
            </button>
        </div>
    );
};

export default Sidebar;
