// Centralized configuration for the application
const config = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
};

export const getImageUrl = (url) => {
    if (!url) return '';
    // Agar URL pehle se hi http se shuru ho raha hai (Full URL), to mazeed base URL mat lagao
    if (url.startsWith('http')) return url;
    return `${config.apiBaseUrl}${url}`;
};

export default config;
