// ProjectDetail Component
function ProjectDetail({ projectId, onNavigate }) {
    const [project, setProject] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [showFilesModal, setShowFilesModal] = React.useState(false);

    React.useEffect(() => {
        fetchProject();
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const response = await window.api.getProject(projectId);
            if (response.success) {
                setProject(response.project);
            } else {
                alert('Project not found');
                onNavigate('all');
            }
        } catch (error) {
            console.error('Error fetching project:', error);
            alert('Failed to load project');
            onNavigate('all');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadFile = async (filename) => {
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

    const getFileIcon = (filename) => {
        if (filename.endsWith('.html')) return '🌐';
        if (filename.endsWith('.css')) return '🎨';
        if (filename.endsWith('.js')) return '⚡';
        if (filename.includes('image')) return '🖼️';
        return '📄';
    };

    if (isLoading) {
        return React.createElement('div', {
            className: 'flex items-center justify-center min-h-screen'
        },
            React.createElement('div', {
                className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-primary'
            })
        );
    }

    if (!project) {
        return React.createElement('div', {
            className: 'text-center py-12'
        }, [
            React.createElement('h2', {
                key: 'error-title',
                className: 'text-2xl font-bold text-gray-900 mb-4'
            }, 'Project Not Found'),
            React.createElement('button', {
                key: 'back-btn',
                onClick: () => onNavigate('all'),
                className: 'bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-all'
            }, 'Back to Projects')
        ]);
    }

    return React.createElement('div', {
        className: 'max-w-6xl mx-auto space-y-8'
    }, [
        // Navigation
        React.createElement('div', {
            key: 'nav',
            className: 'flex items-center space-x-2 text-gray-600'
        }, [
            React.createElement('button', {
                key: 'all-projects-link',
                onClick: () => onNavigate('all'),
                className: 'hover:text-primary transition-colors'
            }, 'All Projects'),
            React.createElement('i', {
                key: 'separator',
                className: 'fas fa-chevron-right text-sm'
            }),
            React.createElement('span', {
                key: 'current',
                className: 'text-gray-900 font-medium'
            }, project.title)
        ]),

        // Project Header
        React.createElement('div', {
            key: 'header',
            className: 'glass rounded-3xl p-8'
        }, [
            React.createElement('div', {
                key: 'header-content',
                className: 'flex items-start justify-between'
            }, [
                React.createElement('div', {
                    key: 'project-info',
                    className: 'flex-1'
                }, [
                    React.createElement('h1', {
                        key: 'title',
                        className: 'text-4xl font-bold text-gray-900 mb-4'
                    }, project.title),
                    React.createElement('p', {
                        key: 'description',
                        className: 'text-xl text-gray-600 mb-6'
                    }, project.description || 'No description provided'),
                    React.createElement('div', {
                        key: 'meta',
                        className: 'flex items-center space-x-6 text-gray-500'
                    }, [
                        React.createElement('div', {
                            key: 'author',
                            className: 'flex items-center space-x-2'
                        }, [
                            React.createElement('i', {
                                key: 'author-icon',
                                className: 'fas fa-user'
                            }),
                            React.createElement('span', {
                                key: 'author-name'
                            }, `By ${project.author.username}`)
                        ]),
                        React.createElement('div', {
                            key: 'date',
                            className: 'flex items-center space-x-2'
                        }, [
                            React.createElement('i', {
                                key: 'date-icon',
                                className: 'fas fa-calendar'
                            }),
                            React.createElement('span', {
                                key: 'date-text'
                            }, new Date(project.createdAt).toLocaleDateString())
                        ]),
                        React.createElement('div', {
                            key: 'files-count',
                            className: 'flex items-center space-x-2'
                        }, [
                            React.createElement('i', {
                                key: 'files-icon',
                                className: 'fas fa-file'
                            }),
                            React.createElement('span', {
                                key: 'files-text'
                            }, `${project.files.length} files`)
                        ])
                    ])
                ]),
                React.createElement('div', {
                    key: 'actions',
                    className: 'flex space-x-4'
                }, [
                    React.createElement('button', {
                        key: 'view-files-btn',
                        onClick: () => setShowFilesModal(true),
                        className: 'bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-all font-medium flex items-center space-x-2'
                    }, [
                        React.createElement('i', {
                            key: 'view-icon',
                            className: 'fas fa-eye'
                        }),
                        React.createElement('span', {
                            key: 'view-text'
                        }, 'View Files')
                    ])
                ])
            ])
        ]),

        // Files Preview
        React.createElement('div', {
            key: 'files-section',
            className: 'glass rounded-3xl p-8'
        }, [
            React.createElement('h2', {
                key: 'files-title',
                className: 'text-2xl font-bold text-gray-900 mb-6'
            }, 'Project Files'),
            
            project.files.length === 0 ? React.createElement('div', {
                key: 'no-files',
                className: 'text-center py-8'
            }, [
                React.createElement('i', {
                    key: 'no-files-icon',
                    className: 'fas fa-folder-open text-4xl text-gray-300 mb-4'
                }),
                React.createElement('p', {
                    key: 'no-files-text',
                    className: 'text-gray-500'
                }, 'No files in this project')
            ]) : React.createElement('div', {
                key: 'files-grid',
                className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            }, project.files.map((file, index) =>
                React.createElement('div', {
                    key: index,
                    className: 'bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all'
                }, [
                    React.createElement('div', {
                        key: 'file-header',
                        className: 'flex items-center justify-between mb-4'
                    }, [
                        React.createElement('div', {
                            key: 'file-icon-section',
                            className: 'flex items-center space-x-3'
                        }, [
                            React.createElement('span', {
                                key: 'file-icon',
                                className: 'text-3xl'
                            }, getFileIcon(file.filename)),
                            React.createElement('div', {
                                key: 'file-info'
                            }, [
                                React.createElement('h3', {
                                    key: 'file-name',
                                    className: 'font-semibold text-gray-900 truncate'
                                }, file.filename),
                                React.createElement('p', {
                                    key: 'file-size',
                                    className: 'text-sm text-gray-500'
                                }, `${(file.size / 1024).toFixed(1)} KB`)
                            ])
                        ])
                    ]),
                    React.createElement('div', {
                        key: 'file-meta',
                        className: 'space-y-2 mb-4'
                    }, [
                        React.createElement('p', {
                            key: 'file-type',
                            className: 'text-sm text-gray-600'
                        }, `Type: ${file.mimetype || 'Unknown'}`),
                        React.createElement('p', {
                            key: 'file-upload-date',
                            className: 'text-sm text-gray-600'
                        }, `Uploaded: ${new Date(project.createdAt).toLocaleDateString()}`)
                    ]),
                    React.createElement('button', {
                        key: 'download-btn',
                        onClick: () => handleDownloadFile(file.filename),
                        className: 'w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-all font-medium flex items-center justify-center space-x-2'
                    }, [
                        React.createElement('i', {
                            key: 'download-icon',
                            className: 'fas fa-download'
                        }),
                        React.createElement('span', {
                            key: 'download-text'
                        }, 'Download')
                    ])
                ])
            ))
        ]),

        // Project Stats
        React.createElement('div', {
            key: 'stats',
            className: 'grid grid-cols-1 md:grid-cols-4 gap-6'
        }, [
            React.createElement('div', {
                key: 'total-size',
                className: 'glass rounded-2xl p-6 text-center'
            }, [
                React.createElement('div', {
                    key: 'size-icon',
                    className: 'inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4'
                },
                    React.createElement('i', {
                        className: 'fas fa-hdd text-xl text-blue-600'
                    })
                ),
                React.createElement('h3', {
                    key: 'size-value',
                    className: 'text-2xl font-bold text-gray-900'
                }, `${(project.files.reduce((total, file) => total + file.size, 0) / 1024).toFixed(1)} KB`),
                React.createElement('p', {
                    key: 'size-label',
                    className: 'text-gray-600'
                }, 'Total Size')
            ]),
            React.createElement('div', {
                key: 'file-types',
                className: 'glass rounded-2xl p-6 text-center'
            }, [
                React.createElement('div', {
                    key: 'types-icon',
                    className: 'inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4'
                },
                    React.createElement('i', {
                        className: 'fas fa-file-code text-xl text-green-600'
                    })
                ),
                React.createElement('h3', {
                    key: 'types-value',
                    className: 'text-2xl font-bold text-gray-900'
                }, new Set(project.files.map(f => f.filename.split('.').pop())).size),
                React.createElement('p', {
                    key: 'types-label',
                    className: 'text-gray-600'
                }, 'File Types')
            ]),
            React.createElement('div', {
                key: 'created-date',
                className: 'glass rounded-2xl p-6 text-center'
            }, [
                React.createElement('div', {
                    key: 'created-icon',
                    className: 'inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4'
                },
                    React.createElement('i', {
                        className: 'fas fa-calendar-plus text-xl text-purple-600'
                    })
                ),
                React.createElement('h3', {
                    key: 'created-value',
                    className: 'text-lg font-bold text-gray-900'
                }, new Date(project.createdAt).toLocaleDateString()),
                React.createElement('p', {
                    key: 'created-label',
                    className: 'text-gray-600'
                }, 'Created')
            ]),
            React.createElement('div', {
                key: 'author-info',
                className: 'glass rounded-2xl p-6 text-center'
            }, [
                React.createElement('div', {
                    key: 'author-avatar',
                    className: 'inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4'
                },
                    React.createElement('i', {
                        className: 'fas fa-user text-xl text-orange-600'
                    })
                ),
                React.createElement('h3', {
                    key: 'author-name',
                    className: 'text-lg font-bold text-gray-900'
                }, project.author.username),
                React.createElement('p', {
                    key: 'author-label',
                    className: 'text-gray-600'
                }, 'Author')
            ])
        ]),

        // Files Modal
        showFilesModal && React.createElement(window.FilesModal, {
            key: 'files-modal',
            project: project,
            onClose: () => setShowFilesModal(false),
            onDownloadFile: (projectId, filename) => handleDownloadFile(filename)
        })
    ]);
}

window.ProjectDetail = ProjectDetail;
