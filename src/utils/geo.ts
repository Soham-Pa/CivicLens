import { LocationInfo } from '../types';

export function getISTTimestamp(date = new Date()): string {
  // Format in Indian Standard Time (IST)
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date) + ' IST';
}

export function generateReportId(): string {
  const currentYear = new Date().getFullYear();
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `CL-${currentYear}-${randomPart}`;
}

// Reverse geocoding via OpenStreetMap Nominatim with graceful fallback
export async function reverseGeocode(lat: number, lng: number): Promise<Partial<LocationInfo>> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Geocoding request failed');
    const data = await response.json();

    const road = data.address?.road || data.address?.pedestrian || data.address?.suburb || '';
    const neighbourhood = data.address?.neighbourhood || data.address?.city_district || '';
    const city = data.address?.city || data.address?.town || data.address?.state_district || 'Kolkata';
    const postcode = data.address?.postcode ? ` - ${data.address.postcode}` : '';

    const readableAddress = [road, neighbourhood, city].filter(Boolean).join(', ') + postcode;

    return {
      address: readableAddress || `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E, Kolkata`,
      city: city || 'Kolkata',
      ward: data.address?.suburb ? `Ward Area: ${data.address.suburb}` : 'KMC Central Ward Jurisdiction',
    };
  } catch (err) {
    console.warn('Reverse geocoding fell back:', err);
    return {
      address: `Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}, Kolkata`,
      city: 'Kolkata',
      ward: 'Kolkata Municipal Corporation',
    };
  }
}
