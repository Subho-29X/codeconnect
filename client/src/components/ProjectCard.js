// ProjectCard Component
function ProjectCard({ project, onView, onDownloadFile, onViewFiles, index = 0 }) {
    return React.createElement('div', {
        key: project._id,
        className: 'bg-white rounded-2xl shadow-xl p-6 card-hover border border-gray-100 animate-slide-up',
        style: { animationDelay: `${index * 0.1}s` }
    }, [
        React.createElement('div', {
            key: 'header',
            className: 'flex justify-between items-start mb-4'
        }, [
            React.createElement('h3', {
                key: 'title',
                onClick: () => onView(project),
                className: 'text-xl font-bold text-gray-900 line-clamp-2 cursor-pointer hover:text-primary transition-colors'
            }, project.title),
            React.createElement('div', {
                key: 'actions',
                className: 'flex items-center space-x-3'
            }, [
                React.createElement('span', {
                    key: 'likes',
                    className: 'text-red-500 flex items-center'
                }, [
                    React.createElement('i', {
                        key: 'heart-icon',
                        className: 'fas fa-heart mr-1'
                    }),
                    ` ${project.likes?.length || 0}`
                ]),
                React.createElement('button', {
                    key: 'like-btn',
                    className: 'text-gray-400 hover:text-red-500 transition-colors'
                },
                    React.createElement('i', {
                        key: 'heart-outline',
                        className: 'far fa-heart'
                    })
                )
            ])
        ]),
        
        React.createElement('p', {
            key: 'description',
            className: 'text-gray-600 mb-4 line-clamp-3'
        }, project.description),
        
        React.createElement('div', {
            key: 'technologies',
            className: 'flex flex-wrap gap-2 mb-6'
        }, [
            ...(project.technologies?.slice(0, 3).map((tech, techIndex) =>
                React.createElement('span', {
                    key: techIndex,
                    className: 'bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20'
                }, tech)
            ) || []),
            project.technologies?.length > 3 && React.createElement('span', {
                key: 'more-tech',
                className: 'text-gray-500 text-sm'
            }, `+${project.technologies.length - 3} more`)
        ]),
        
        // Project Files Section
        project.files && project.files.length > 0 && React.createElement('div', {
            key: 'files-section',
            className: 'mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200'
        }, [
            React.createElement('h4', {
                key: 'files-title',
                className: 'text-sm font-semibold text-gray-700 mb-2 flex items-center'
            }, [
                React.createElement('i', {
                    key: 'folder-icon',
                    className: 'fas fa-folder mr-2 text-primary'
                }),
                `Project Files (${project.files.length})`
            ]),
            React.createElement('div', {
                key: 'files-list',
                className: 'flex flex-wrap gap-2'
            }, [
                ...project.files.slice(0, 4).map((file, fileIndex) =>
                    React.createElement('button', {
                        key: fileIndex,
                        onClick: () => onDownloadFile(project._id, file.filename),
                        className: 'flex items-center space-x-1 bg-white px-2 py-1 rounded text-xs hover:bg-gray-100 transition-colors border border-gray-200',
                        title: `Download ${file.filename}`
                    }, [
                        React.createElement('span', {
                            key: 'file-icon'
                        }, file.filename.endsWith('.html') ? '🌐' : 
                             file.filename.endsWith('.css') ? '🎨' : 
                             file.filename.endsWith('.js') ? '⚡' : 
                             file.mimetype?.includes('image') ? '🖼️' : '📄'),
                        React.createElement('span', {
                            key: 'file-name',
                            className: 'max-w-16 truncate'
                        }, file.filename),
                        React.createElement('i', {
                            key: 'download-icon',
                            className: 'fas fa-download text-primary'
                        })
                    ])
                ),
                project.files.length > 4 && React.createElement('span', {
                    key: 'more-files',
                    className: 'text-gray-500 text-xs flex items-center'
                }, `+${project.files.length - 4} more`)
            ])
        ]),
        
        React.createElement('div', {
            key: 'footer',
            className: 'flex justify-between items-center'
        }, [
            React.createElement('div', {
                key: 'owner',
                className: 'flex items-center space-x-2'
            }, [
                React.createElement('div', {
                    key: 'avatar',
                    className: 'w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full'
                }),
                React.createElement('span', {
                    key: 'username',
                    className: 'text-sm text-gray-600'
                }, project.owner?.username)
            ]),
            React.createElement('div', {
                key: 'action-buttons',
                className: 'flex space-x-2'
            }, [
                project.files && project.files.length > 0 && React.createElement('button', {
                    key: 'files-btn',
                    onClick: () => onViewFiles(project),
                    className: 'bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-all font-medium text-sm',
                    title: 'View all files'
                }, [
                    React.createElement('i', {
                        key: 'folder-open-icon',
                        className: 'fas fa-folder-open mr-1'
                    }),
                    'Files'
                ]),
                React.createElement('button', {
                    key: 'view-btn',
                    onClick: () => onView(project),
                    className: 'bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all font-medium'
                }, [
                    React.createElement('i', {
                        key: 'eye-icon',
                        className: 'fas fa-eye mr-2'
                    }),
                    'View'
                ])
            ])
        ])
    ]);
}

window.ProjectCard = ProjectCard;
