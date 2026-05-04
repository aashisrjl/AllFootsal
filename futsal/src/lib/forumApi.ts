const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const getFutsalForums = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/forum/futsal`, {
      credentials: 'include',
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, data: data.data || [] };
    } else {
      return { success: false, message: data.message || 'Failed to fetch forums' };
    }
  } catch (error) {
    console.error('Error fetching forums:', error);
    return { success: false, message: 'Network error' };
  }
};