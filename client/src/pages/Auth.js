// Auth Component (Login/Register)
function Auth({ onLogin }) {
    const [isLogin, setIsLogin] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    
    // Using refs for uncontrolled components to avoid input issues
    const usernameRef = React.useRef();
    const passwordRef = React.useRef();
    const confirmPasswordRef = React.useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        
        if (!isLogin) {
            const confirmPassword = confirmPasswordRef.current.value;
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                setIsLoading(false);
                return;
            }
        }

        try {
            const response = await window.api.auth(username, password, isLogin ? 'login' : 'register');
            if (response.success) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                onLogin(response.user);
            } else {
                alert(response.message || 'Authentication failed');
            }
        } catch (error) {
            console.error('Auth error:', error);
            alert('Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        // Clear form when switching modes
        if (usernameRef.current) usernameRef.current.value = '';
        if (passwordRef.current) passwordRef.current.value = '';
        if (confirmPasswordRef.current) confirmPasswordRef.current.value = '';
    };

    return React.createElement('div', {
        className: 'min-h-screen bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center p-4'
    },
        React.createElement('div', {
            className: 'glass rounded-3xl p-8 w-full max-w-md shadow-2xl'
        }, [
            React.createElement('div', {
                key: 'header',
                className: 'text-center mb-8'
            }, [
                React.createElement('div', {
                    key: 'logo',
                    className: 'inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4'
                },
                    React.createElement('i', {
                        className: 'fas fa-code text-2xl text-white'
                    })
                ),
                React.createElement('h1', {
                    key: 'title',
                    className: 'text-3xl font-bold text-white mb-2'
                }, 'CodeConnect'),
                React.createElement('p', {
                    key: 'subtitle',
                    className: 'text-white/80'
                }, isLogin ? 'Welcome back!' : 'Join the community')
            ]),
            
            React.createElement('form', {
                key: 'form',
                onSubmit: handleSubmit,
                className: 'space-y-6'
            }, [
                React.createElement('div', {
                    key: 'username-field'
                }, [
                    React.createElement('label', {
                        key: 'username-label',
                        className: 'block text-white/90 font-medium mb-2'
                    }, 'Username'),
                    React.createElement('input', {
                        key: 'username-input',
                        ref: usernameRef,
                        type: 'text',
                        required: true,
                        className: 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all'
                    })
                ]),
                
                React.createElement('div', {
                    key: 'password-field'
                }, [
                    React.createElement('label', {
                        key: 'password-label',
                        className: 'block text-white/90 font-medium mb-2'
                    }, 'Password'),
                    React.createElement('input', {
                        key: 'password-input',
                        ref: passwordRef,
                        type: 'password',
                        required: true,
                        className: 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all'
                    })
                ]),
                
                !isLogin && React.createElement('div', {
                    key: 'confirm-password-field'
                }, [
                    React.createElement('label', {
                        key: 'confirm-password-label',
                        className: 'block text-white/90 font-medium mb-2'
                    }, 'Confirm Password'),
                    React.createElement('input', {
                        key: 'confirm-password-input',
                        ref: confirmPasswordRef,
                        type: 'password',
                        required: true,
                        className: 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all'
                    })
                ]),
                
                React.createElement('button', {
                    key: 'submit-btn',
                    type: 'submit',
                    disabled: isLoading,
                    className: 'w-full bg-white text-primary font-bold py-3 px-6 rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                }, isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')),
                
                React.createElement('div', {
                    key: 'toggle-section',
                    className: 'text-center'
                }, [
                    React.createElement('p', {
                        key: 'toggle-text',
                        className: 'text-white/80'
                    }, isLogin ? "Don't have an account?" : 'Already have an account?'),
                    React.createElement('button', {
                        key: 'toggle-btn',
                        type: 'button',
                        onClick: toggleMode,
                        className: 'text-white font-semibold hover:underline ml-1'
                    }, isLogin ? 'Sign up' : 'Sign in')
                ])
            ])
        ])
    );
}

window.Auth = Auth;
