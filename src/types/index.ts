// Travelo - Travel Booking Platform Types

export type BookingType = 'hotel' | 'flight' | 'train' | 'vehicle';
export type BookingStatus = 'pending' | 'paid' | 'cancelled';
export type VehicleType = 'car' | 'bike' | 'scooter' | 'van' | 'luxury';
export type TransmissionType = 'automatic' | 'manual';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  preferences: UserPreferences;
  createdAt: Date;
}

export interface UserPreferences {
  currency: string;
  language: string;
  notifications: boolean;
  darkMode: boolean;
  interests: string[];
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  location: Location;
  images: string[];
  rating: number;
  reviewsCount: number;
  stars: number;
  amenities: string[];
  rooms: Room[];
  pricePerNight: number;
  currency: string;
  checkInTime: string;
  checkOutTime: string;
  freeCancellation: boolean;
  instantBooking: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Location {
  city: string;
  country: string;
  address: string;
  distanceFromCenter?: number;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  maxGuests: number;
  bedType: string;
  size?: number;
  amenities: string[];
  pricePerNight: number;
  images: string[];
  available: boolean;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: AirportInfo;
  arrival: AirportInfo;
  duration: number;
  stops: number;
  stopoverCities?: string[];
  price: number;
  currency: string;
  class: 'economy' | 'business' | 'first';
  baggage: BaggageInfo;
  amenities: string[];
  refundable: boolean;
}

export interface AirportInfo {
  airport: string;
  city: string;
  code: string;
  time: Date;
  terminal?: string;
  gate?: string;
}

export interface BaggageInfo {
  carryOn: boolean;
  checked: number;
  weightLimit: number;
}

export interface Train {
  id: string;
  operator: string;
  trainNumber: string;
  departure: StationInfo;
  arrival: StationInfo;
  duration: number;
  stops: number;
  price: number;
  currency: string;
  class: 'economy' | 'business' | 'first';
  amenities: string[];
  refundable: boolean;
  trainType: string;
}

export interface StationInfo {
  station: string;
  city: string;
  code: string;
  time: Date;
  platform?: string;
}

export interface Vehicle {
  id: string;
  provider: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  images: string[];
  pricePerDay: number;
  currency: string;
  transmission: TransmissionType;
  fuel: FuelType;
  seats: number;
  luggage: number;
  deposit: number;
  insurance: boolean;
  mileage: 'unlimited' | number;
  pickupLocation: Location;
  dropoffLocation: Location;
  minAge: number;
  features: string[];
}

export interface Booking {
  id: string;
  userId: string;
  type: BookingType;
  itemId: string;
  item: Hotel | Flight | Train | Vehicle;
  dates: {
    checkIn?: Date;
    checkOut?: Date;
    departure?: Date;
    return?: Date;
    pickup?: Date;
    dropoff?: Date;
  };
  guests?: {
    adults: number;
    children: number;
    infants?: number;
  };
  rooms?: number;
  totalPrice: number;
  fees: number;
  taxes: number;
  currency: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  paymentMethod?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  itemId: string;
  itemType: BookingType;
  rating: number;
  title: string;
  comment: string;
  date: Date;
  helpful: number;
  images?: string[];
}

export interface Favorite {
  id: string;
  userId: string;
  itemId: string;
  itemType: BookingType;
  item: Hotel | Flight | Train | Vehicle;
  addedAt: Date;
}

export interface SearchFilters {
  priceRange: [number, number];
  rating?: number;
  amenities?: string[];
  instantBooking?: boolean;
  freeCancellation?: boolean;
}

export interface HotelFilters extends SearchFilters {
  stars?: number[];
  roomTypes?: string[];
  distanceFromCenter?: number;
  maxGuests?: number;
}

export interface FlightFilters extends SearchFilters {
  airlines?: string[];
  stops?: number[];
  departureTime?: string[];
  arrivalTime?: string[];
  class?: string[];
  baggage?: boolean;
}

export interface VehicleFilters extends SearchFilters {
  vehicleTypes?: VehicleType[];
  transmission?: TransmissionType[];
  fuel?: FuelType[];
  seats?: number;
  deposit?: number;
  insurance?: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export interface Destination {
  id: string;
  city: string;
  country: string;
  image: string;
  description: string;
  averagePrice: number;
  currency: string;
  properties: number;
  rating: number;
  tags: string[];
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: number;
  code: string;
  validUntil: Date;
  applicableTypes: BookingType[];
}
