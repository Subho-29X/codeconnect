// AllProjects Component
function AllProjects() {
    const { projects, isLoading, fetchAllProjects } = window.useProjects();
    const [showFilesModal, setShowFilesModal] = React.useState(false);
    const [selectedProject, setSelectedProject] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        fetchAllProjects();
    }, []);

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

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.author.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return React.createElement('div', {
        className: 'space-y-8'
    }, [
        // Header Section
        React.createElement('div', {
            key: 'header',
            className: 'glass rounded-3xl p-8'
        }, [
            React.createElement('div', {
                key: 'header-content',
                className: 'text-center'
            }, [
                React.createElement('h1', {
                    key: 'title',
                    className: 'text-4xl font-bold text-gray-900 mb-4'
                }, 'Explore Projects 🚀'),
                React.createElement('p', {
                    key: 'subtitle',
                    className: 'text-xl text-gray-600 mb-8'
                }, 'Discover amazing projects from our community'),
                
                // Search Bar
                React.createElement('div', {
                    key: 'search',
                    className: 'max-w-2xl mx-auto relative'
                }, [
                    React.createElement('div', {
                        key: 'search-container',
                        className: 'relative'
                    }, [
                        React.createElement('i', {
                            key: 'search-icon',
                            className: 'fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'
                        }),
                        React.createElement('input', {
                            key: 'search-input',
                            type: 'text',
                            placeholder: 'Search projects, descriptions, or authors...',
                            value: searchTerm,
                            onChange: (e) => setSearchTerm(e.target.value),
                            className: 'w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-lg'
                        })
                    ])
                ])
            ])
        ]),

        // Stats Section
        React.createElement('div', {
            key: 'stats',
            className: 'grid grid-cols-1 md:grid-cols-4 gap-6'
        }, [
            React.createElement('div', {
                key: 'total-projects',
                className: 'glass rounded-2xl p-6 text-center'
            }, [
                React.createElement('div', {
                    key: 'total-icon',
                    className: 'inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4'
                },
                    React.createElement('i', {
                        className: 'fas fa-folder text-xl text-blue-600'
                    })
                ),
                React.createElement('h3', {
                    key: 'total-count',
                    className: 'text-2xl font-bold text-gray-900'
                }, projects.length),
                React.createElement('p', {
                    key: 'total-label',
                    className: 'text-gray-600'
                }, 'Total Projects')
            ]),
            React.createElement('div', {
                key: 'filtered-projects',
                className: 'glass rounded-2xl p-6 text-center'
            }, [
                React.createElement('div', {
                    key: 'filtered-icon',
                    className: 'inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4'
                },
                    React.createElement('i', {
                        className: 'fas fa-filter text-xl text-green-600'
                    })
                ),
                React.createElement('h3', {
                    key: 'filtered-count',
                    className: 'text-2xl font-bold text-gray-900'
                }, filteredProjects.length),
                React.createElement('p', {
                    key: 'filtered-label',
                    className: 'text-gray-600'
                }, 'Matching Results')
            ]),
            React.createElement('div', {
                key: 'total-files',
                className: 'glass rounded-2xl p-6 text-center'
            }, [
                React.createElement('div', {
                    key: 'files-icon',
                    className: 'inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4'
                },
                    React.createElement('i', {
                        className: 'fas fa-file-code text-xl text-purple-600'
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
                key: 'unique-authors',
                className: 'glass rounded-2xl p-6 text-center'
            }, [
                React.createElement('div', {
                    key: 'authors-icon',
                    className: 'inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4'
                },
                    React.createElement('i', {
                        className: 'fas fa-users text-xl text-orange-600'
                    })
                ),
                React.createElement('h3', {
                    key: 'authors-count',
                    className: 'text-2xl font-bold text-gray-900'
                }, new Set(projects.map(p => p.author._id)).size),
                React.createElement('p', {
                    key: 'authors-label',
                    className: 'text-gray-600'
                }, 'Contributors')
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
                }, searchTerm ? `Search Results (${filteredProjects.length})` : 'All Projects'),
                React.createElement('button', {
                    key: 'refresh-btn',
                    onClick: fetchAllProjects,
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
            ) : filteredProjects.length === 0 ? React.createElement('div', {
                key: 'empty',
                className: 'text-center py-12'
            }, [
                React.createElement('i', {
                    key: 'empty-icon',
                    className: 'fas fa-search text-6xl text-gray-300 mb-4'
                }),
                React.createElement('h3', {
                    key: 'empty-title',
                    className: 'text-xl font-semibold text-gray-600 mb-2'
                }, searchTerm ? 'No projects found' : 'No projects available'),
                React.createElement('p', {
                    key: 'empty-text',
                    className: 'text-gray-500'
                }, searchTerm ? 'Try adjusting your search terms' : 'Be the first to share a project!')
            ]) : React.createElement('div', {
                key: 'projects-grid',
                className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            }, filteredProjects.map(project =>
                React.createElement(window.ProjectCard, {
                    key: project._id,
                    project: project,
                    onViewFiles: handleViewFiles,
                    showActions: false
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

window.AllProjects = AllProjects;
