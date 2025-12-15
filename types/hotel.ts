export type HotelCategory = 'budget' | 'mid-range' | 'luxury' | 'boutique' | 'resort';

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface HotelImage {
  url: string;
  publicId: string;
}

export interface HotelPolicies {
  checkIn: string;
  checkOut: string;
  cancellation: string;
  pets: boolean;
  smoking: boolean;
  ageRestriction?: number;
}

export interface Hotel {
  _id: string;
  name: string;
  owner: string | User;
  description: string;
  category: HotelCategory;
  location: Location;
  images: HotelImage[];
  videos?: HotelImage[];
  amenities: string[];
  policies: HotelPolicies;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  rating: {
    average: number;
    count: number;
  };
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

