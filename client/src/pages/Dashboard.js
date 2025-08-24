// Dashboard Component
function Dashboard({ user, onNavigate }) {
    const { projects, isLoading, fetchProjects, deleteProject } = window.useProjects();
    const [showFilesModal, setShowFilesModal] = React.useState(false);
    const [selectedProject, setSelectedProject] = React.useState(null);

    React.useEffect(() => {
        fetchProjects(user._id);
    }, [user._id]);

    const handleViewFiles = (project) => {
        setSelectedProject(project);
        setShowFilesModal(true);
    };

    const handleDownloadFile = async (projectId, filename) => {
        try {
            const response = await window.api.downloadFile(projectId, filename);
            if (response.success) {
                // Create download link
                const url = window.URL.createObjectURL(response.blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                alert('Failed to download file');
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download file');
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            const success = await deleteProject(projectId);
            if (success) {
                fetchProjects(user._id);
            }
        }
    };

    return React.createElement('div', {
        className: 'space-y-8'
    }, [
        // Welcome Section
        React.createElement('div', {
            key: 'welcome',
            className: 'glass rounded-3xl p-8'
        }, [
            React.createElement('div', {
                key: 'welcome-content',
                className: 'flex items-center justify-between'
            }, [
                React.createElement('div', {
                    key: 'welcome-text'
                }, [
                    React.createElement('h1', {
                        key: 'welcome-title',
                        className: 'text-3xl font-bold text-gray-900 mb-2'
                    }, `Welcome back, ${user.username}! 👋`),
                    React.createElement('p', {
                        key: 'welcome-subtitle',
                        className: 'text-gray-600'
                    }, 'Manage your projects and explore what others have built')
                ]),
                React.createElement('div', {
                    key: 'quick-actions',
                    className: 'flex space-x-4'
                }, [
                    React.createElement('button', {
                        key: 'create-btn',
                        onClick: () => onNavigate('create'),
                        className: 'bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-all font-medium flex items-center space-x-2'
                    }, [
                        React.createElement('i', {
                            key: 'create-icon',
                            className: 'fas fa-plus'
                        }),
                        React.createElement('span', {
                            key: 'create-text'
                        }, 'New Project')
                    ]),
                    React.createElement('button', {
                        key: 'explore-btn',
                        onClick: () => onNavigate('all'),
                        className: 'bg-white border-2 border-primary text-primary px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-all font-medium flex items-center space-x-2'
                    }, [
                        React.createElement('i', {
                            key: 'explore-icon',
                            className: 'fas fa-compass'
                        }),
                        React.createElement('span', {
                            key: 'explore-text'
                        }, 'Explore')
                    ])
                ])
            ])
        ]),

        // Stats Section
        React.createElement('div', {
            key: 'stats',
            className: 'grid grid-cols-1 md:grid-cols-3 gap-6'
        }, [
            React.createElement('div', {
                key: 'projects-stat',
                className: 'glass rounded-2xl p-6 text-center'
            }, [
                React.createElement('div', {
                    key: 'projects-icon',
                    className: 'inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4'
                },
                    React.createElement('i', {
                        className: 'fas fa-folder text-xl text-blue-600'
                    })
                ),
                React.createElement('h3', {
                    key: 'projects-count',
                    className: 'text-2xl font-bold text-gray-900'
                }, projects.length),
                React.createElement('p', {
                    key: 'projects-label',
                    className: 'text-gray-600'
                }, 'Your Projects')
            ]),
            React.createElement('div', {
                key: 'files-stat',
                className: 'glass rounded-2xl p-6 text-center'
            }, [
                React.createElement('div', {
                    key: 'files-icon',
                    className: 'inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4'
                },
                    React.createElement('i', {
                        className: 'fas fa-file-code text-xl text-green-600'
                    })
                ),
                React.createElement('h3', {
                    key: 'files-count',
                    className: 'text-2xl font-bold text-gray-900'
                }, projects.reduce((total, project) => total + project.files.length, 0)),
                React.createElement('p', {
                    key: 'files-label',
                    className: 'text-gray-600'
                }, 'Total Files')
            ]),
            React.createElement('div', {
                key: 'recent-stat',
                className: 'glass rounded-2xl p-6 text-center'
            }, [
                React.createElement('div', {
                    key: 'recent-icon',
                    className: 'inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4'
                },
                    React.createElement('i', {
                        className: 'fas fa-clock text-xl text-purple-600'
                    })
                ),
                React.createElement('h3', {
                    key: 'recent-count',
                    className: 'text-2xl font-bold text-gray-900'
                }, projects.filter(p => new Date(p.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length),
                React.createElement('p', {
                    key: 'recent-label',
                    className: 'text-gray-600'
                }, 'This Week')
            ])
        ]),

        // Projects Section
        React.createElement('div', {
            key: 'projects-section',
            className: 'glass rounded-3xl p-8'
        }, [
            React.createElement('div', {
                key: 'projects-header',
                className: 'flex items-center justify-between mb-6'
            }, [
                React.createElement('h2', {
                    key: 'projects-title',
                    className: 'text-2xl font-bold text-gray-900'
                }, 'Your Projects'),
                React.createElement('button', {
                    key: 'refresh-btn',
                    onClick: () => fetchProjects(user._id),
                    disabled: isLoading,
                    className: 'text-primary hover:text-primary/80 transition-colors'
                }, [
                    React.createElement('i', {
                        key: 'refresh-icon',
                        className: `fas fa-sync-alt ${isLoading ? 'animate-spin' : ''}`
                    }),
                    React.createElement('span', {
                        key: 'refresh-text',
                        className: 'ml-2'
                    }, 'Refresh')
                ])
            ]),

            isLoading ? React.createElement('div', {
                key: 'loading',
                className: 'flex items-center justify-center py-12'
            },
                React.createElement('div', {
                    className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-primary'
                })
            ) : projects.length === 0 ? React.createElement('div', {
                key: 'empty',
                className: 'text-center py-12'
            }, [
                React.createElement('i', {
                    key: 'empty-icon',
                    className: 'fas fa-folder-open text-6xl text-gray-300 mb-4'
                }),
                React.createElement('h3', {
                    key: 'empty-title',
                    className: 'text-xl font-semibold text-gray-600 mb-2'
                }, 'No projects yet'),
                React.createElement('p', {
                    key: 'empty-text',
                    className: 'text-gray-500 mb-6'
                }, 'Create your first project to get started'),
                React.createElement('button', {
                    key: 'empty-btn',
                    onClick: () => onNavigate('create'),
                    className: 'bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-all font-medium'
                }, 'Create Project')
            ]) : React.createElement('div', {
                key: 'projects-grid',
                className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            }, projects.map(project =>
                React.createElement(window.ProjectCard, {
                    key: project._id,
                    project: project,
                    onViewFiles: handleViewFiles,
                    onDelete: handleDeleteProject,
                    showActions: true
                })
            ))
        ]),

        // Files Modal
        showFilesModal && React.createElement(window.FilesModal, {
            key: 'files-modal',
            project: selectedProject,
            onClose: () => setShowFilesModal(false),
            onDownloadFile: handleDownloadFile
        })
    ]);
}

window.Dashboard = Dashboard;
