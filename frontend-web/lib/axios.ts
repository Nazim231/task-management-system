import axios, { AxiosError, AxiosResponse } from 'axios';

type ApiResponse<T extends Record<string, any>> =
  | { success: true; message: string; data?: T }
  | { success: false; message: string; errors?: Record<string, any> };

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Helper function to get cookie value by name
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Adding the access token in the authorization header
axiosInstance.interceptors.request.use((config) => {
  const accessToken = getCookie('access-token');

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use((config) => {
  
  if (config.status == 401) {
    // The request was declined because of Token expiry
  }
  return config;
})

export async function get<T extends Record<string, any>>(
  url: string,
): Promise<ApiResponse<T>> {
  try {
    const result = await axiosInstance.get<any, AxiosResponse<ApiResponse<T>>>(
      url,
      {
        withCredentials: true,
      },
    );
    if (!result.data.success) throw result.data;

    return result.data;
  } catch (error: any) {
    if (error.isAxiosError) {
      return { success: false, message: (error as AxiosError).message };
    } else {
      return error;
    }
  }
}

export async function post<T extends Record<string, any>>(
  url: string,
  data: Record<string, any>,
): Promise<ApiResponse<T>> {
  try {
    const result = await axiosInstance.post<any, AxiosResponse<ApiResponse<T>>>(
      url,
      data,
      {
        withCredentials: true,
      },
    );

    return result.data;
  } catch (error: any) {
    if (error.isAxiosError && error.response) {
      return (error as AxiosError).response?.data as ApiResponse<any>;
    } else {
      return {success: false, message: error.message};
    }
  }
}
