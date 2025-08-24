// useProjects hook for project management
function useProjects() {
    const [projects, setProjects] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState('');

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/projects', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (response.ok) {
                setProjects(data);
            } else {
                setMessage(`❌ ${data.message}`);
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
            setMessage('❌ Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    const createProject = async (projectData) => {
        setLoading(true);
        setMessage('');
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(projectData)
            });
            const data = await response.json();

            if (response.ok) {
                setMessage('✅ Project created successfully!');
                setProjects(prev => [...prev, data]);
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

    const uploadProjectWithFiles = async (formData) => {
        setLoading(true);
        setMessage('');
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/projects/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await response.json();

            if (response.ok) {
                setMessage('✅ Project created successfully!');
                setProjects(prev => [...prev, data]);
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

    const downloadFile = async (projectId, filename) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5001/api/projects/${projectId}/files/${filename}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error('Download failed:', err);
            setMessage('❌ Download failed');
        }
    };

    const clearMessage = () => {
        setMessage('');
    };

    return {
        projects,
        loading,
        message,
        fetchProjects,
        createProject,
        uploadProjectWithFiles,
        downloadFile,
        clearMessage
    };
}

window.useProjects = useProjects;
