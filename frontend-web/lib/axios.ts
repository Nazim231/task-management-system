import { TokenPair, TokenType } from '@/types/auth';
import axios, { AxiosError, AxiosResponse } from 'axios';

type ApiResponse<T extends Record<string, any>> =
  | { success: true; message: string; data?: T }
  | { success: false; message: string; errors?: Record<string, any> };

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Adding the access token in the authorization header
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(TokenType.ACCESS_TOKEN);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(async (config) => {
  console.log('Response Received', config);
  if (config.status == 401) {
    // The request was declined because of Token expiry
    const refToken = localStorage.getItem(TokenType.REFRESH_TOKEN);
    const result = await post<TokenPair>('/auth/refresh', {
      refreshToken: refToken,
    });
    if (result.success && result.data) {
      localStorage.setItem(TokenType.ACCESS_TOKEN, result.data.accessToken);
      localStorage.setItem(TokenType.REFRESH_TOKEN, result.data.refreshToken);
    } else {
      removeDataAndRedirectToLogin();
    }
  }
  return config;
});

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
      const axiosError = error as AxiosError;
      if (axiosError.status == 401) {
        console.log('uNAuthorized acces');
        const tokenRefreshed = await refreshToken();
        if (tokenRefreshed) return get<T>(url);
      } else if (axiosError.status == 403) {
        // Failed to generate refresh token.
        removeDataAndRedirectToLogin();
      }

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
    if (error.isAxiosError) {
      const axiosError = error as AxiosError;
      if (axiosError.status == 401) {
        console.log('uNAuthorized acces');
        const tokensRefreshed = await refreshToken();
        if (tokensRefreshed) return post<T>(url, data);
      } else if (axiosError.status == 403) {
        // Failed to generate refresh token.
        removeDataAndRedirectToLogin();
      }

      return { success: false, message: (error as AxiosError).message };
    } else {
      return error;
    }
  }
}

async function refreshToken(): Promise<boolean> {
  const currRefreshToken = localStorage.getItem(TokenType.REFRESH_TOKEN);
  if (!currRefreshToken) {
    removeDataAndRedirectToLogin();
    return false;
  }

  console.log('Refreshing TOken');
  const result = await post<TokenPair>('/auth/refresh', {
    refreshToken: currRefreshToken,
  });
  console.log('Refresh TOken status: ', result);
  if (!result.success || !result.data) {
    removeDataAndRedirectToLogin();
    return false;
  }

  const { accessToken, refreshToken } = result.data;
  if (!accessToken || !refreshToken) {
    removeDataAndRedirectToLogin();
    return false;
  }

  localStorage.setItem(TokenType.ACCESS_TOKEN, accessToken);
  localStorage.setItem(TokenType.REFRESH_TOKEN, refreshToken);

  return true;
}

function removeDataAndRedirectToLogin() {
  localStorage.removeItem(TokenType.ACCESS_TOKEN);
  localStorage.removeItem(TokenType.REFRESH_TOKEN);
  localStorage.removeItem('auth-store');
  window.location.href = '/login';
}
