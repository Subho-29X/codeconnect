// API Service for CodeConnect
const API_BASE_URL = 'http://localhost:5001';

class ApiService {
    // Get auth token from localStorage
    getAuthToken() {
        return localStorage.getItem('token');
    }

    // Get auth headers
    getAuthHeaders() {
        const token = this.getAuthToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    // Auth endpoints
    async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return await response.json();
    }

    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    }

    // Project endpoints
    async getProjects() {
        const response = await fetch(`${API_BASE_URL}/api/projects`, {
            headers: this.getAuthHeaders()
        });
        return await response.json();
    }

    async createProject(projectData) {
        const response = await fetch(`${API_BASE_URL}/api/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders()
            },
            body: JSON.stringify(projectData)
        });
        return await response.json();
    }

    async uploadProjectWithFiles(formData) {
        const response = await fetch(`${API_BASE_URL}/api/projects/upload`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: formData
        });
        return await response.json();
    }

    async downloadFile(projectId, filename) {
        const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/files/${filename}`, {
            headers: this.getAuthHeaders()
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
    }
}

// Export singleton instance
window.apiService = new ApiService();
window.api = window.apiService; // Also export as window.api for compatibility
