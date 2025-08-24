// FilesModal Component
function FilesModal({ project, onClose, onDownloadFile }) {
    if (!project) return null;

    return React.createElement('div', {
        className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
    },
        React.createElement('div', {
            className: 'bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden'
        }, [
            React.createElement('div', {
                key: 'header',
                className: 'flex items-center justify-between p-6 border-b border-gray-200'
            }, [
                React.createElement('div', {
                    key: 'title-section'
                }, [
                    React.createElement('h3', {
                        key: 'title',
                        className: 'text-xl font-bold text-gray-900'
                    }, `${project.title} - Files`),
                    React.createElement('p', {
                        key: 'count',
                        className: 'text-gray-600 text-sm'
                    }, `${project.files.length} files available`)
                ]),
                React.createElement('button', {
                    key: 'close-btn',
                    onClick: onClose,
                    className: 'text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors'
                }, '×')
            ]),
            
            React.createElement('div', {
                key: 'content',
                className: 'p-6 overflow-y-auto max-h-96'
            },
                React.createElement('div', {
                    className: 'grid gap-3'
                }, project.files.map((file, index) =>
                    React.createElement('div', {
                        key: index,
                        className: 'flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors'
                    }, [
                        React.createElement('div', {
                            key: 'file-info',
                            className: 'flex items-center space-x-3'
                        }, [
                            React.createElement('span', {
                                key: 'file-icon',
                                className: 'text-2xl'
                            }, file.filename.endsWith('.html') ? '🌐' : 
                                 file.filename.endsWith('.css') ? '🎨' : 
                                 file.filename.endsWith('.js') ? '⚡' : 
                                 file.mimetype?.includes('image') ? '🖼️' : '📄'),
                            React.createElement('div', {
                                key: 'file-details'
                            }, [
                                React.createElement('p', {
                                    key: 'filename',
                                    className: 'font-medium text-gray-900'
                                }, file.filename),
                                React.createElement('p', {
                                    key: 'file-meta',
                                    className: 'text-sm text-gray-500'
                                }, `${(file.size / 1024).toFixed(1)} KB • ${file.mimetype || 'Unknown type'}`)
                            ])
                        ]),
                        React.createElement('button', {
                            key: 'download-btn',
                            onClick: () => onDownloadFile(project._id, file.filename),
                            className: 'bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-all font-medium flex items-center space-x-2'
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
            ),
            
            React.createElement('div', {
                key: 'footer',
                className: 'p-6 border-t border-gray-200 bg-gray-50'
            },
                React.createElement('div', {
                    className: 'flex justify-between items-center'
                }, [
                    React.createElement('p', {
                        key: 'info',
                        className: 'text-sm text-gray-600'
                    }, [
                        React.createElement('i', {
                            key: 'info-icon',
                            className: 'fas fa-info-circle mr-2'
                        }),
                        'Click download to save files to your device'
                    ]),
                    React.createElement('button', {
                        key: 'close-footer-btn',
                        onClick: onClose,
                        className: 'bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all font-medium'
                    }, 'Close')
                ])
            )
        ])
    );
}

window.FilesModal = FilesModal;
