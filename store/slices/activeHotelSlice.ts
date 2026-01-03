import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HotelBasicInfo {
  _id: string;
  name: string;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  images?: Array<{ url: string; publicId: string }>;
}

interface ActiveHotelState {
  hotelId: string | null;
  hotel: HotelBasicInfo | null;
  timezone: string; // e.g., 'America/New_York'
  currency: string; // e.g., 'USD'
  settings: {
    checkInTime: string; // e.g., '15:00'
    checkOutTime: string; // e.g., '11:00'
    cancellationPolicy: string;
    [key: string]: any; // For additional settings
  };
  lastSwitchedAt: string | null; // ISO timestamp
}

const initialState: ActiveHotelState = {
  hotelId: null,
  hotel: null,
  timezone: 'UTC',
  currency: 'USD',
  settings: {
    checkInTime: '15:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'Standard 24-hour cancellation policy',
  },
  lastSwitchedAt: null,
};

const activeHotelSlice = createSlice({
  name: 'activeHotel',
  initialState,
  reducers: {
    // Set active hotel
    setActiveHotel: (
      state,
      action: PayloadAction<{
        hotelId: string;
        hotel?: HotelBasicInfo;
        timezone?: string;
        currency?: string;
        settings?: Partial<ActiveHotelState['settings']>;
      }>
    ) => {
      state.hotelId = action.payload.hotelId;
      if (action.payload.hotel) {
        state.hotel = action.payload.hotel;
      }
      if (action.payload.timezone) {
        state.timezone = action.payload.timezone;
      }
      if (action.payload.currency) {
        state.currency = action.payload.currency;
      }
      if (action.payload.settings) {
        state.settings = {
          ...state.settings,
          ...action.payload.settings,
        };
      }
      state.lastSwitchedAt = new Date().toISOString();
    },

    // Update hotel info (without changing hotelId)
    updateActiveHotelInfo: (
      state,
      action: PayloadAction<Partial<HotelBasicInfo>>
    ) => {
      if (state.hotel) {
        state.hotel = {
          ...state.hotel,
          ...action.payload,
        };
      }
    },

    // Update hotel settings
    updateHotelSettings: (
      state,
      action: PayloadAction<Partial<ActiveHotelState['settings']>>
    ) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    },

    // Update timezone
    setTimezone: (state, action: PayloadAction<string>) => {
      state.timezone = action.payload;
    },

    // Update currency
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },

    // Clear active hotel (when logging out or switching contexts)
    clearActiveHotel: (state) => {
      return initialState;
    },
  },
});

export const {
  setActiveHotel,
  updateActiveHotelInfo,
  updateHotelSettings,
  setTimezone,
  setCurrency,
  clearActiveHotel,
} = activeHotelSlice.actions;

export default activeHotelSlice.reducer;