// Header Component
function Header({ currentView, setCurrentView, onLogout }) {
    return React.createElement('header', {
        className: 'bg-white shadow-lg border-b sticky top-0 z-50'
    }, 
        React.createElement('div', {
            className: 'max-w-7xl mx-auto px-4'
        },
            React.createElement('div', {
                className: 'flex justify-between items-center h-16'
            }, [
                React.createElement('div', {
                    key: 'left-section',
                    className: 'flex items-center space-x-8'
                }, [
                    React.createElement('div', {
                        key: 'logo',
                        className: 'flex items-center space-x-2'
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: 'w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center'
                        },
                            React.createElement('i', {
                                key: 'icon-fas',
                                className: 'fas fa-code text-white text-sm'
                            })
                        ),
                        React.createElement('h1', {
                            key: 'title',
                            className: 'text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'
                        }, 'CodeConnect')
                    ]),
                    React.createElement('nav', {
                        key: 'nav',
                        className: 'hidden md:flex space-x-1'
                    }, [
                        React.createElement('button', {
                            key: 'dashboard-btn',
                            onClick: () => setCurrentView('dashboard'),
                            className: `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                currentView === 'dashboard'
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }, [
                            React.createElement('i', {
                                key: 'home-icon',
                                className: 'fas fa-home mr-2'
                            }),
                            'Dashboard'
                        ]),
                        React.createElement('button', {
                            key: 'projects-btn',
                            onClick: () => setCurrentView('projects'),
                            className: `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                currentView === 'projects'
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }, [
                            React.createElement('i', {
                                key: 'folder-icon',
                                className: 'fas fa-folder mr-2'
                            }),
                            'All Projects'
                        ]),
                        React.createElement('button', {
                            key: 'create-btn',
                            onClick: () => setCurrentView('create'),
                            className: `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                currentView === 'create'
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }, [
                            React.createElement('i', {
                                key: 'plus-icon',
                                className: 'fas fa-plus mr-2'
                            }),
                            'Create'
                        ])
                    ])
                ]),
                React.createElement('div', {
                    key: 'right-section',
                    className: 'flex items-center space-x-4'
                }, [
                    React.createElement('button', {
                        key: 'notifications',
                        className: 'p-2 text-gray-500 hover:text-gray-700 transition-colors'
                    },
                        React.createElement('i', {
                            key: 'bell-icon',
                            className: 'fas fa-bell text-lg'
                        })
                    ),
                    React.createElement('button', {
                        key: 'logout-btn',
                        onClick: onLogout,
                        className: 'bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg'
                    }, [
                        React.createElement('i', {
                            key: 'logout-icon',
                            className: 'fas fa-sign-out-alt mr-2'
                        }),
                        'Logout'
                    ])
                ])
            ])
        )
    );
}

window.Header = Header;
