import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user ? user.role : 'user';

    return (
        <div className="dashboard-layout">
            <Sidebar role={role} />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
