// CreateProject Component
function CreateProject({ user, onNavigate }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedFiles, setSelectedFiles] = React.useState([]);
    const [isDragOver, setIsDragOver] = React.useState(false);
    
    // Using refs for uncontrolled components
    const titleRef = React.useRef();
    const descriptionRef = React.useRef();
    const fileInputRef = React.useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const title = titleRef.current.value;
        const description = descriptionRef.current.value;

        if (!title.trim()) {
            alert('Please enter a project title');
            setIsLoading(false);
            return;
        }

        if (selectedFiles.length === 0) {
            alert('Please select at least one file');
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('author', user._id);

            selectedFiles.forEach(file => {
                formData.append('files', file);
            });

            const response = await window.api.uploadProject(formData);

            if (response.success) {
                alert('Project uploaded successfully!');
                // Reset form
                titleRef.current.value = '';
                descriptionRef.current.value = '';
                setSelectedFiles([]);
                if (fileInputRef.current) fileInputRef.current.value = '';
                onNavigate('dashboard');
            } else {
                alert(response.message || 'Failed to upload project');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload project');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        setSelectedFiles(files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const getFileIcon = (filename) => {
        if (filename.endsWith('.html')) return '🌐';
        if (filename.endsWith('.css')) return '🎨';
        if (filename.endsWith('.js')) return '⚡';
        if (filename.includes('image')) return '🖼️';
        return '📄';
    };

    return React.createElement('div', {
        className: 'max-w-4xl mx-auto space-y-8'
    }, [
        // Header
        React.createElement('div', {
            key: 'header',
            className: 'glass rounded-3xl p-8'
        }, [
            React.createElement('div', {
                key: 'header-content',
                className: 'text-center'
            }, [
                React.createElement('div', {
                    key: 'icon',
                    className: 'inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4'
                },
                    React.createElement('i', {
                        className: 'fas fa-plus text-2xl text-primary'
                    })
                ),
                React.createElement('h1', {
                    key: 'title',
                    className: 'text-3xl font-bold text-gray-900 mb-2'
                }, 'Create New Project'),
                React.createElement('p', {
                    key: 'subtitle',
                    className: 'text-gray-600'
                }, 'Share your code with the community')
            ])
        ]),

        // Form
        React.createElement('div', {
            key: 'form-section',
            className: 'glass rounded-3xl p-8'
        },
            React.createElement('form', {
                onSubmit: handleSubmit,
                className: 'space-y-8'
            }, [
                // Project Details
                React.createElement('div', {
                    key: 'details',
                    className: 'space-y-6'
                }, [
                    React.createElement('h2', {
                        key: 'details-title',
                        className: 'text-xl font-bold text-gray-900 mb-4'
                    }, 'Project Details'),
                    
                    React.createElement('div', {
                        key: 'title-field'
                    }, [
                        React.createElement('label', {
                            key: 'title-label',
                            className: 'block text-gray-700 font-medium mb-2'
                        }, 'Project Title *'),
                        React.createElement('input', {
                            key: 'title-input',
                            ref: titleRef,
                            type: 'text',
                            placeholder: 'Enter your project title...',
                            className: 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all'
                        })
                    ]),
                    
                    React.createElement('div', {
                        key: 'description-field'
                    }, [
                        React.createElement('label', {
                            key: 'description-label',
                            className: 'block text-gray-700 font-medium mb-2'
                        }, 'Description'),
                        React.createElement('textarea', {
                            key: 'description-input',
                            ref: descriptionRef,
                            rows: 4,
                            placeholder: 'Describe your project...',
                            className: 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none'
                        })
                    ])
                ]),

                // File Upload
                React.createElement('div', {
                    key: 'upload',
                    className: 'space-y-6'
                }, [
                    React.createElement('h2', {
                        key: 'upload-title',
                        className: 'text-xl font-bold text-gray-900'
                    }, 'Upload Files *'),
                    
                    // Drag & Drop Area
                    React.createElement('div', {
                        key: 'drop-zone',
                        className: `border-2 border-dashed ${isDragOver ? 'border-primary bg-primary/5' : 'border-gray-300'} rounded-2xl p-8 text-center transition-all`,
                        onDrop: handleDrop,
                        onDragOver: handleDragOver,
                        onDragLeave: handleDragLeave
                    }, [
                        React.createElement('div', {
                            key: 'drop-content',
                            className: 'space-y-4'
                        }, [
                            React.createElement('i', {
                                key: 'upload-icon',
                                className: 'fas fa-cloud-upload-alt text-4xl text-gray-400'
                            }),
                            React.createElement('div', {
                                key: 'upload-text'
                            }, [
                                React.createElement('p', {
                                    key: 'upload-main',
                                    className: 'text-lg font-medium text-gray-700'
                                }, 'Drag & drop your files here'),
                                React.createElement('p', {
                                    key: 'upload-sub',
                                    className: 'text-gray-500'
                                }, 'or click to browse files')
                            ]),
                            React.createElement('input', {
                                key: 'file-input',
                                ref: fileInputRef,
                                type: 'file',
                                multiple: true,
                                onChange: handleFileSelect,
                                className: 'hidden',
                                accept: '.html,.css,.js,.jpg,.jpeg,.png,.gif,.pdf,.txt,.md'
                            }),
                            React.createElement('button', {
                                key: 'browse-btn',
                                type: 'button',
                                onClick: () => fileInputRef.current?.click(),
                                className: 'bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-all font-medium'
                            }, 'Browse Files')
                        ])
                    ]),
                    
                    React.createElement('div', {
                        key: 'file-info',
                        className: 'text-sm text-gray-600 bg-gray-50 p-4 rounded-xl'
                    }, [
                        React.createElement('p', {
                            key: 'file-types',
                            className: 'mb-2'
                        }, 'Supported file types: HTML, CSS, JS, Images (JPG, PNG, GIF), PDF, TXT, MD'),
                        React.createElement('p', {
                            key: 'file-limits'
                        }, 'Maximum 20 files, 50MB total size')
                    ])
                ]),

                // Selected Files
                selectedFiles.length > 0 && React.createElement('div', {
                    key: 'selected-files',
                    className: 'space-y-4'
                }, [
                    React.createElement('h3', {
                        key: 'selected-title',
                        className: 'text-lg font-semibold text-gray-900'
                    }, `Selected Files (${selectedFiles.length})`),
                    
                    React.createElement('div', {
                        key: 'files-grid',
                        className: 'grid gap-3'
                    }, selectedFiles.map((file, index) =>
                        React.createElement('div', {
                            key: index,
                            className: 'flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200'
                        }, [
                            React.createElement('div', {
                                key: 'file-info',
                                className: 'flex items-center space-x-3'
                            }, [
                                React.createElement('span', {
                                    key: 'file-icon',
                                    className: 'text-2xl'
                                }, getFileIcon(file.name)),
                                React.createElement('div', {
                                    key: 'file-details'
                                }, [
                                    React.createElement('p', {
                                        key: 'file-name',
                                        className: 'font-medium text-gray-900'
                                    }, file.name),
                                    React.createElement('p', {
                                        key: 'file-size',
                                        className: 'text-sm text-gray-500'
                                    }, `${(file.size / 1024).toFixed(1)} KB`)
                                ])
                            ]),
                            React.createElement('button', {
                                key: 'remove-btn',
                                type: 'button',
                                onClick: () => removeFile(index),
                                className: 'text-red-500 hover:text-red-700 transition-colors'
                            }, React.createElement('i', {
                                className: 'fas fa-times'
                            }))
                        ])
                    ))
                ]),

                // Submit Button
                React.createElement('div', {
                    key: 'submit-section',
                    className: 'flex items-center justify-between pt-6 border-t border-gray-200'
                }, [
                    React.createElement('button', {
                        key: 'back-btn',
                        type: 'button',
                        onClick: () => onNavigate('dashboard'),
                        className: 'text-gray-600 hover:text-gray-800 transition-colors font-medium'
                    }, [
                        React.createElement('i', {
                            key: 'back-icon',
                            className: 'fas fa-arrow-left mr-2'
                        }),
                        'Back to Dashboard'
                    ]),
                    React.createElement('button', {
                        key: 'submit-btn',
                        type: 'submit',
                        disabled: isLoading,
                        className: 'bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2'
                    }, [
                        isLoading && React.createElement('div', {
                            key: 'loading-spinner',
                            className: 'animate-spin rounded-full h-5 w-5 border-b-2 border-white'
                        }),
                        React.createElement('span', {
                            key: 'submit-text'
                        }, isLoading ? 'Uploading...' : 'Create Project')
                    ])
                ])
            ])
        )
    ]);
}

window.CreateProject = CreateProject;
