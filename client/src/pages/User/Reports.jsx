import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Layout from '../../components/Layout';

const Reports = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            const { data } = await api.get('/dashboard');
            setStats(data);
        };
        fetchStats();
    }, []);

    if (!stats) return <Layout>Loading...</Layout>;

    return (
        <Layout>
            <h1>Reports & Analysis</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Sales Analysis</h3>
                    <div style={{ marginTop: '1rem' }}>
                        <p>Total Sales Count: <strong>{stats.totalSalesCount}</strong></p>
                        <p>Total Revenue: <strong style={{ color: '#10b981' }}>${stats.totalSalesAmount}</strong></p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Debt Analysis</h3>
                    <div style={{ marginTop: '1rem' }}>
                        <p>Total Debt Records: <strong>{stats.totalDebtCount}</strong></p>
                        <p>Total Unpaid Amount: <strong style={{ color: '#ef4444' }}>${stats.totalDebtAmount}</strong></p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Inventory Analysis</h3>
                    <div style={{ marginTop: '1rem' }}>
                        <p>Total Products in Stock: <strong>{stats.totalProducts}</strong></p>
                        <p>Total Customers: <strong>{stats.totalCustomers}</strong></p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Reports;
