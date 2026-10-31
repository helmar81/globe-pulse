export interface CityConfig {
  id: string;
  name: string;
  timezone: string;
  imageKeyword: string;
  lat?: number;       // Optional latitude
  lon?: number;       // Optional longitude
  imageUrl?: string;  // Optional custom image path
}

export interface TimeData {
  hours: string;
  minutes: string;
  seconds: string;
  period: string; 
  dayOfWeek: string;
  date: string;
  isDaytime: boolean;
}

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy';

export interface WeatherDay {
  dayName: string;
  condition: WeatherCondition;
  high: number;
  low: number;
}