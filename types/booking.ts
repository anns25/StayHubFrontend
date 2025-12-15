export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface Guests {
  adults: number;
  children: number;
}

export interface Booking {
  _id: string;
  customer: string | User;
  hotel: string | Hotel;
  room: string | Room;
  checkIn: string;
  checkOut: string;
  guests: Guests;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  specialRequests?: string;
  cancellationReason?: string;
  aiSummary?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Hotel {
  _id: string;
  name: string;
  location: {
    city: string;
    country: string;
  };
  images?: Array<{ url: string }>;
}

interface Room {
  _id: string;
  name: string;
  type: string;
}

