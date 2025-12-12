import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Layout from '../../components/Layout';
import { FaBox, FaShoppingCart, FaUserTie, FaMoneyBillWave } from 'react-icons/fa';

const StatCard = ({ title, value, icon, color }) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>{value}</p>
        </div>
        <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: '#fff',
            opacity: 0.9
        }}>
            {icon}
        </div>
    </div>
);

const UserDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalSalesCount: 0,
        totalSalesAmount: 0,
        totalCustomers: 0,
        totalDebtCount: 0,
        totalDebtAmount: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/dashboard');
                setStats(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStats();
    }, []);

    return (
        <Layout>
            <h1>Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={<FaBox />}
                    color="linear-gradient(135deg, #3b82f6, #2563eb)"
                />
                <StatCard
                    title="Total Customers"
                    value={stats.totalCustomers}
                    icon={<FaUserTie />}
                    color="linear-gradient(135deg, #10b981, #059669)"
                />
                <StatCard
                    title="Total Sales"
                    value={`$${stats.totalSalesAmount}`}
                    icon={<FaShoppingCart />}
                    color="linear-gradient(135deg, #f59e0b, #d97706)"
                />
                <StatCard
                    title="Active Debts"
                    value={`$${stats.totalDebtAmount}`}
                    icon={<FaMoneyBillWave />}
                    color="linear-gradient(135deg, #ef4444, #dc2626)"
                />
            </div>

            <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem' }}>
                <h3>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <a href="/sales" className="btn btn-primary">New Sale</a>
                    <a href="/products" className="btn btn-secondary">Add Product</a>
                </div>
            </div>
        </Layout>
    );
};

export default UserDashboard;
