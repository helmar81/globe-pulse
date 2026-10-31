import { CityConfig } from './types';

export const GEMINI_MODEL = "gemini-3.8-flash";

export const CITIES: CityConfig[] = [
  {
    id: 'berlin',
    name: 'Berlin',
    timezone: 'Europe/Berlin',
    imageKeyword: 'Berlin',
    lat: 52.5200,
    lon: 13.4050,
    imageUrl: "/b.webp"  // Make sure b.webp is in the 'public' folder
  },
  {
    id: 'new_york',
    name: 'New York',
    timezone: 'America/New_York',
    imageKeyword: 'New York City',
    lat: 40.7128,
    lon: -74.0060,
    imageUrl: "/n.webp"  // Make sure n.webp is in the 'public' folder
  },
  {
    id: 'manila',
    name: 'Manila',
    timezone: 'Asia/Manila',
    imageKeyword: 'Manila City',
    lat: 14.5995,
    lon: 120.9842,
    imageUrl: "/m.webp"  // Make sure m.webp is in the 'public' folder
  }
];