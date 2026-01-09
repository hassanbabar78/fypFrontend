// lib/auth-fetch.ts - Improved version
export const authFetch = async (url: string, options: RequestInit = {}) => {
  let token = localStorage.getItem('token');
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  let response = await fetch(url, {
    ...options,
    headers,
  });
  
  // If token expired, try to refresh it
  if (response.status === 401) {
    console.log('Token expired, attempting refresh...');
    // Add your token refresh logic here if you have it
    // Or redirect to login
    window.location.href = '/login';
    return response;
  }
  
  return response;
};