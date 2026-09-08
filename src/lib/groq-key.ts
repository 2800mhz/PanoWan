export const GROQ_API_KEY_STORAGE_KEY = 'panowan.groq-api-key';

export function getStoredGroqApiKey(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(GROQ_API_KEY_STORAGE_KEY) ?? '';
}

export function setStoredGroqApiKey(apiKey: string): void {
  if (typeof window === 'undefined') return;
  const trimmed = apiKey.trim();
  if (trimmed) {
    window.localStorage.setItem(GROQ_API_KEY_STORAGE_KEY, trimmed);
  } else {
    window.localStorage.removeItem(GROQ_API_KEY_STORAGE_KEY);
  }
}

export function hasStoredGroqApiKey(): boolean {
  return Boolean(getStoredGroqApiKey());
}
