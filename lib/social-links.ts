export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/udawalawechaamsafariandtours',
  instagram: 'https://www.instagram.com/chaam_safari_and_tours',
  youtube: 'https://youtube.com/@udawalawesafari-srilanka',
  tripadvisor: 'https://www.tripadvisor.co.uk/Attraction_Review-g3577009-d20318661-Reviews-Udawalawe_Chaam_Safari_and_Tours-Udawalawa_Sabaragamuwa_Province.html',
  googleMaps: 'https://maps.app.goo.gl/44kmP9kVKYoMo2wq7',
} as const

export const BUSINESS_SOCIAL_LINKS = [
  SOCIAL_LINKS.facebook,
  SOCIAL_LINKS.instagram,
  SOCIAL_LINKS.youtube,
  SOCIAL_LINKS.tripadvisor,
] as const

export const GOOGLE_REVIEWS_URL = SOCIAL_LINKS.googleMaps
export const TRIPADVISOR_URL = SOCIAL_LINKS.tripadvisor
export const GOOGLE_MAPS_URL = SOCIAL_LINKS.googleMaps
