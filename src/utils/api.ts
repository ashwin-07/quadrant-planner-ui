// API utility functions for Quadrant Planner

import type { ApiError, ApiResponse } from '@/types';

// Base API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 10000; // 10 seconds

// HTTP Methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Request configuration
interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  requiresAuth?: boolean;
}

// Custom error class for API errors
export class ApiCallError extends Error {
  public code: string;
  public status?: number;
  public details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    status?: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiCallError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// Auth token management
let authToken: string | null = null;

export function setAuthToken(token: string): void {
  authToken = token;
}

export function clearAuthToken(): void {
  authToken = null;
}

export function getAuthToken(): string | null {
  return authToken;
}

// Base API call function
export async function apiCall<T>(
  endpoint: string,
  config: RequestConfig = { method: 'GET' }
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = API_TIMEOUT,
    requiresAuth = true,
  } = config;

  // Set up headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add auth token if required and available
  if (requiresAuth && authToken) {
    requestHeaders.Authorization = `Bearer ${authToken}`;
  }

  // Create abort controller for timeout
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: abortController.signal,
    });

    clearTimeout(timeoutId);

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: 'Network error occurred',
        code: 'NETWORK_ERROR',
        timestamp: new Date().toISOString(),
      }));

      throw new ApiCallError(
        errorData.message || 'Request failed',
        errorData.code || 'REQUEST_FAILED',
        response.status,
        errorData.details
      );
    }

    // Parse successful response
    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new ApiCallError(
        data.message || 'Request failed',
        'REQUEST_FAILED'
      );
    }

    return data.data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiCallError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiCallError('Request timed out', 'TIMEOUT');
    }

    // Network or other errors
    throw new ApiCallError('Network error occurred', 'NETWORK_ERROR');
  }
}

// Convenience methods for different HTTP verbs
export async function get<T>(
  endpoint: string,
  requiresAuth = true
): Promise<T> {
  return apiCall<T>(endpoint, { method: 'GET', requiresAuth });
}

export async function post<T>(
  endpoint: string,
  body: unknown,
  requiresAuth = true
): Promise<T> {
  return apiCall<T>(endpoint, {
    method: 'POST',
    body,
    requiresAuth,
  });
}

export async function put<T>(
  endpoint: string,
  body: unknown,
  requiresAuth = true
): Promise<T> {
  return apiCall<T>(endpoint, {
    method: 'PUT',
    body,
    requiresAuth,
  });
}

export async function patch<T>(
  endpoint: string,
  body: unknown,
  requiresAuth = true
): Promise<T> {
  return apiCall<T>(endpoint, {
    method: 'PATCH',
    body,
    requiresAuth,
  });
}

export async function del<T>(
  endpoint: string,
  requiresAuth = true
): Promise<T> {
  return apiCall<T>(endpoint, { method: 'DELETE', requiresAuth });
}

// File upload utility
export async function uploadFile(
  endpoint: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    // Track upload progress
    xhr.upload.addEventListener('progress', event => {
      if (event.lengthComputable && onProgress) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.data.url);
        } catch {
          reject(
            new ApiCallError('Invalid response format', 'INVALID_RESPONSE')
          );
        }
      } else {
        reject(new ApiCallError('Upload failed', 'UPLOAD_FAILED', xhr.status));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new ApiCallError('Upload failed', 'UPLOAD_FAILED'));
    });

    xhr.addEventListener('timeout', () => {
      reject(new ApiCallError('Upload timed out', 'TIMEOUT'));
    });

    xhr.open('POST', `${API_BASE_URL}${endpoint}`);
    xhr.timeout = API_TIMEOUT;

    if (authToken) {
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
    }

    xhr.send(formData);
  });
}

// Retry utility for failed requests
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on auth errors or client errors (4xx)
      if (error instanceof ApiCallError && error.status && error.status < 500) {
        throw error;
      }

      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
}

// Batch request utility
export async function batchRequests<T>(
  requests: Array<() => Promise<T>>,
  concurrency = 5
): Promise<Array<T | Error>> {
  const results: Array<T | Error> = [];

  for (let i = 0; i < requests.length; i += concurrency) {
    const batch = requests.slice(i, i + concurrency);
    const batchPromises = batch.map(request =>
      request().catch((error: unknown) => error as Error)
    );

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
}

// Request cancellation utility
export class CancellableRequest<T> {
  private abortController = new AbortController();
  private promise: Promise<T>;

  constructor(
    endpoint: string,
    config: RequestConfig & { signal?: AbortSignal } = { method: 'GET' }
  ) {
    // Combine signals if both provided
    let signal = this.abortController.signal;
    if (config.signal) {
      signal = combineAbortSignals(signal, config.signal);
    }

    this.promise = apiCall<T>(endpoint, {
      ...config,
      signal,
    } as RequestConfig & { signal: AbortSignal });
  }

  cancel(): void {
    this.abortController.abort();
  }

  async execute(): Promise<T> {
    return this.promise;
  }
}

// Utility to combine abort signals
function combineAbortSignals(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();

  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort();
      break;
    }

    signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  return controller.signal;
}

// Cache utility for GET requests
const cache = new Map<
  string,
  { data: unknown; timestamp: number; ttl: number }
>();

export async function getCached<T>(
  endpoint: string,
  ttlMs = 5 * 60 * 1000, // 5 minutes default
  requiresAuth = true
): Promise<T> {
  const cacheKey = `${endpoint}:${requiresAuth}:${authToken || 'anonymous'}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }

  const data = await get<T>(endpoint, requiresAuth);
  cache.set(cacheKey, { data, timestamp: Date.now(), ttl: ttlMs });

  return data as T;
}

export function clearCache(pattern?: string): void {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}

// Health check utility
export async function healthCheck(): Promise<boolean> {
  try {
    await get('/health', false);
    return true;
  } catch {
    return false;
  }
}
