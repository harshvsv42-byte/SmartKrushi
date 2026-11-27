import farmerAvatar from '../assets/farmer_avatar.jpg';

/**
 * Returns absolute URL for a user's profile image, or fallback avatar.
 */
export const getProfileImageUrl = (user, fallback = farmerAvatar) => {
  if (!user) return fallback;
  const url = user.profile_image_url || user.profile_image;
  if (!url) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
  const origin = apiBase.replace(/\/api\/v1\/?$/, '');
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
};
