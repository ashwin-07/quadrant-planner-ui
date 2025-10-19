// API configuration and base setup
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// API response wrapper type (for future use)
// interface ApiResponse<T> {
//   success: boolean;
//   data: T;
//   message?: string;
//   timestamp: string;
// }

// interface ApiError {
//   success: false;
//   error: {
//     message: string;
//     code: string;
//     details?: Record<string, unknown>;
//   };
//   timestamp: string;
// }

// HTTP client wrapper with error handling
class ApiClient {
  private baseURL: string;
  private getAuthToken: (() => string | null) | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Set the function to get the auth token
  setAuthTokenProvider(getToken: () => string | null) {
    this.getAuthToken = getToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if token is available
    if (this.getAuthToken) {
      const token = this.getAuthToken();
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      console.log(`Making API request to: ${url}`, config);
      const response = await fetch(url, config);

      console.log(`API response status: ${response.status}`, response);

      if (!response.ok) {
        // Handle 401 Unauthorized - token expired
        if (response.status === 401) {
          console.log('Received 401 Unauthorized - token may be expired');
          // Clear auth data and redirect to login
          localStorage.removeItem('user');
          localStorage.removeItem('jwt_token');
          // Trigger a page reload to redirect to login
          window.location.href = '/login';
          throw new Error('Session expired. Please sign in again.');
        }

        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.error?.message || errorData.message || errorMessage;
        } catch {
          // If we can't parse the error response, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Handle different response formats
      if (data.success && data.data) {
        return data.data;
      } else if (data.goals) {
        // Direct response format
        return data;
      } else {
        return data;
      }
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);

      // Handle specific error types
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          'Network error: Unable to connect to the API server. Please check if the backend is running.'
        );
      }

      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const searchParams = params ? new URLSearchParams(params).toString() : '';
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;

    return this.request<T>(url, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T> {
    const searchParams = params ? new URLSearchParams(params).toString() : '';
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;

    return this.request<T>(url, {
      method: 'DELETE',
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Set up JWT token provider from localStorage
// This will be updated to use AuthContext in a real implementation
apiClient.setAuthTokenProvider(() => {
  // Get the JWT token from localStorage (set by AuthContext)
  const token = localStorage.getItem('jwt_token');
  const user = localStorage.getItem('user');
  console.log(
    'Token provider called, user authenticated:',
    !!user,
    'token from localStorage:',
    token ? 'Token found' : 'No token'
  );
  return token;
});
