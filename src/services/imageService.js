// Image service using Pexels API with fallback image generator
const PEXELS_BASE = 'https://api.pexels.com/v1';

const getPexelsKey = () => import.meta.env.VITE_PEXELS_API_KEY || '';

const cache = new Map();

// Fallback high quality photography images by destination ID / keyword
const FALLBACK_IMAGES = {
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  'new-york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  barcelona: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
  sydney: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
  santorini: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
  kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  maldives: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
  marrakech: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1200&q=80',
  prague: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80',
  'cape-town': 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&w=1200&q=80',
  istanbul: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
  amsterdam: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80',
  singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
  'machu-picchu': 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
  iceland: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
  rio: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
};

const fetchPexels = async (url) => {
  if (cache.has(url)) return cache.get(url);
  const pexelsKey = getPexelsKey();
  if (!pexelsKey) return null;

  try {
    const response = await fetch(url, {
      headers: { Authorization: pexelsKey },
    });
    if (!response.ok) return null;
    const data = await response.json();
    cache.set(url, data);
    return data;
  } catch {
    return null;
  }
};

export const searchDestinationImage = async (query, perPage = 1) => {
  const url = `${PEXELS_BASE}/search?query=${encodeURIComponent(query + ' travel landscape')}&per_page=${perPage}&orientation=landscape`;
  const data = await fetchPexels(url);
  if (data && data.photos && data.photos.length > 0) {
    return data.photos;
  }
  
  // Fallback if Pexels fails or key missing
  const cleanKey = query.split(' ')[0].toLowerCase().replace(/\s+/g, '-');
  const fallbackUrl = FALLBACK_IMAGES[cleanKey] || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80`;
  return [{ src: { large: fallbackUrl, large2x: fallbackUrl, medium: fallbackUrl }, alt: query }];
};

export const searchPlaceImages = async (query, perPage = 1) => {
  const url = `${PEXELS_BASE}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
  const data = await fetchPexels(url);
  if (data && data.photos && data.photos.length > 0) {
    return data.photos;
  }

  const fallbackUrl = `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80`;
  return [{ src: { large: fallbackUrl, large2x: fallbackUrl, medium: fallbackUrl }, alt: query }];
};

export const getImageSrc = (photo, size = 'large') => {
  if (!photo) return null;
  if (typeof photo === 'string') return photo;
  return photo.src?.[size] || photo.src?.large || photo.src?.medium;
};

export const getImageAlt = (photo) => photo?.alt || 'Travel destination';
