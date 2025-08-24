// Main App Component
function App() {
    const { user, login, logout, checkAuth } = window.useAuth();
    const [currentPage, setCurrentPage] = React.useState('dashboard');
    const [selectedProjectId, setSelectedProjectId] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const initAuth = async () => {
            await checkAuth();
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const navigate = (page, projectId = null) => {
        setCurrentPage(page);
        if (projectId) {
            setSelectedProjectId(projectId);
        }
    };

    const handleLogout = () => {
        logout();
        setCurrentPage('dashboard');
    };

    if (isLoading) {
        return React.createElement('div', {
            className: 'min-h-screen flex items-center justify-center'
        },
            React.createElement('div', {
                className: 'text-center'
            }, [
                React.createElement('div', {
                    key: 'spinner',
                    className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'
                }),
                React.createElement('p', {
                    key: 'loading-text',
                    className: 'text-white text-lg'
                }, 'Loading CodeConnect...')
            ])
        );
    }

    if (!user) {
        return React.createElement(window.Auth, {
            onLogin: login
        });
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return React.createElement(window.Dashboard, {
                    user: user,
                    onNavigate: navigate
                });
            case 'all':
                return React.createElement(window.AllProjects);
            case 'create':
                return React.createElement(window.CreateProject, {
                    user: user,
                    onNavigate: navigate
                });
            case 'project':
                return React.createElement(window.ProjectDetail, {
                    projectId: selectedProjectId,
                    onNavigate: navigate
                });
            default:
                return React.createElement(window.Dashboard, {
                    user: user,
                    onNavigate: navigate
                });
        }
    };

    return React.createElement('div', {
        className: 'min-h-screen bg-gradient-to-br from-primary to-purple-700'
    }, [
        React.createElement(window.Header, {
            key: 'header',
            user: user,
            currentPage: currentPage,
            onNavigate: navigate,
            onLogout: handleLogout
        }),
        React.createElement('main', {
            key: 'main',
            className: 'container mx-auto px-4 py-8'
        },
            renderPage()
        )
    ]);
}

// Export to window (initialization handled in HTML)
window.App = App;
