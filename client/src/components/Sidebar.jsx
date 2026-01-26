import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBox, FaShoppingCart, FaMoneyBillWave, FaChartBar, FaCog, FaSignOutAlt, FaUserTie, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ role }) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const storedUser = JSON.parse(localStorage.getItem('user')) || { username: 'User' };

    const menuItems = role === 'admin' ? [
        { path: "/admin", label: "Dashboard", icon: <FaTachometerAlt /> },
        { path: "/admin/users", label: "Users", icon: <FaUsers /> },
    ] : [
        { path: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
        { path: "/customers", label: "Customers", icon: <FaUserTie /> },
        { path: "/products", label: "Products", icon: <FaBox /> },
        { path: "/sales", label: "Sales", icon: <FaShoppingCart /> },
        { path: "/debts", label: "Debt", icon: <FaMoneyBillWave /> },
        { path: "/reports", label: "Reports", icon: <FaChartBar /> },
        { path: "/settings", label: "Settings", icon: <FaCog /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span className="brand-dot"></span>
                IMS POS
            </div>

            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-text">{item.label}</span>
                        <div className="nav-glow"></div>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar">
                        {storedUser.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                        <span className="user-name">{storedUser.username}</span>
                        <button onClick={toggleTheme} className="theme-toggle-inline" title="Toggle Theme">
                            {theme === 'dark' ? <FaSun /> : <FaMoon />}
                        </button>
                    </div>
                </div>
                <button onClick={handleLogout} className="logout-btn" title="Logout">
                    <FaSignOutAlt />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
