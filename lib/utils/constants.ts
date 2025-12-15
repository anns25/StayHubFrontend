export const HOTEL_CATEGORIES = [
  { value: 'budget', label: 'Budget' },
  { value: 'mid-range', label: 'Mid-Range' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'boutique', label: 'Boutique' },
  { value: 'resort', label: 'Resort' },
] as const;

export const ROOM_TYPES = [
  { value: 'single', label: 'Single' },
  { value: 'double', label: 'Double' },
  { value: 'twin', label: 'Twin' },
  { value: 'suite', label: 'Suite' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'presidential', label: 'Presidential' },
] as const;

export const BED_TYPES = [
  { value: 'single', label: 'Single' },
  { value: 'double', label: 'Double' },
  { value: 'queen', label: 'Queen' },
  { value: 'king', label: 'King' },
  { value: 'bunk', label: 'Bunk' },
] as const;

export const BOOKING_STATUS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  checked_out: 'Checked Out',
  cancelled: 'Cancelled',
} as const;

export const PAYMENT_STATUS = {
  pending: 'Pending',
  paid: 'Paid',
  refunded: 'Refunded',
  failed: 'Failed',
} as const;

