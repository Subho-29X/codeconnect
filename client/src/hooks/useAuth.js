// useAuth hook for authentication logic
function useAuth() {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState('');

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
    }, []);

    const login = async (credentials) => {
        setLoading(true);
        setMessage('');
        
        try {
            const response = await fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();

            if (response.ok) {
                setMessage('✅ Welcome back!');
                localStorage.setItem('token', data.token);
                setUser({ token: data.token });
                return { success: true, data };
            } else {
                setMessage(`❌ ${data.message}`);
                return { success: false, message: data.message };
            }
        } catch (err) {
            setMessage('❌ Server error');
            return { success: false, message: 'Server error' };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setMessage('');
        
        try {
            const response = await fetch('http://localhost:5001/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await response.json();

            if (response.ok) {
                setMessage('✅ Account created successfully!');
                localStorage.setItem('token', data.token);
                setUser({ token: data.token });
                return { success: true, data };
            } else {
                setMessage(`❌ ${data.message}`);
                return { success: false, message: data.message };
            }
        } catch (err) {
            setMessage('❌ Server error');
            return { success: false, message: 'Server error' };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setMessage('');
    };

    const clearMessage = () => {
        setMessage('');
    };

    return {
        user,
        loading,
        message,
        login,
        register,
        logout,
        clearMessage,
        isAuthenticated: !!user
    };
}

window.useAuth = useAuth;
