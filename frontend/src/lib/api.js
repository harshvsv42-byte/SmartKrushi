import { Platform } from 'react-native';

const defaultBaseUrl = Platform.OS === 'android'
  ? 'http://10.0.2.2:8000/api/v1'
  : 'http://127.0.0.1:8000/api/v1';

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL || defaultBaseUrl
).replace(/\/+$/, '');

function buildUrl(path, params = {}) {
  const url = new URL(`${API_BASE_URL}/${path.replace(/^\/+/, '')}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function readResponse(response) {
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message = typeof data === 'string'
      ? data
      : data?.detail || data?.error || data?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export async function getJson(path, params = {}) {
  let response;
  try {
    response = await fetch(buildUrl(path, params), {
      headers: { Accept: 'application/json' },
    });
  } catch (error) {
    throw new Error(`Cannot reach the API at ${API_BASE_URL}. Check the backend and phone network settings.`);
  }

  return readResponse(response);
}

export async function postForm(path, fields) {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(key, value);
    }
  });

  let response;
  try {
    response = await fetch(buildUrl(path), {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: form,
    });
  } catch {
    throw new Error(`Cannot reach the API at ${API_BASE_URL}. Check the backend and phone network settings.`);
  }

  return readResponse(response);
}

export function getApiErrorMessage(error) {
  return error instanceof Error ? error.message : 'An unexpected API error occurred.';
}
