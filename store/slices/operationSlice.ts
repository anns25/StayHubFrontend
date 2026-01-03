import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking } from '@/types/booking';

interface DateRange {
  checkIn: string;
  checkOut: string;
}

interface OperationsState {
  // Booking workflow state
  selectedDateRange: DateRange | null;
  selectedRooms: string[]; // Array of room IDs
  selectedGuests: {
    adults: number;
    children: number;
  } | null;
  currentBooking: Booking | null; // Booking being created/edited
  pendingCheckIns: Booking[];
  pendingCheckOuts: Booking[];
  
  // UI state for booking flow
  isBookingModalOpen: boolean;
  bookingStep: 'dates' | 'rooms' | 'guests' | 'review' | 'confirmation';
}

const initialState: OperationsState = {
  selectedDateRange: null,
  selectedRooms: [],
  selectedGuests: null,
  currentBooking: null,
  pendingCheckIns: [],
  pendingCheckOuts: [],
  isBookingModalOpen: false,
  bookingStep: 'dates',
};

const operationsSlice = createSlice({
  name: 'operations',
  initialState,
  reducers: {
    // Date range actions
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.selectedDateRange = action.payload;
    },
    clearDateRange: (state) => {
      state.selectedDateRange = null;
    },

    // Room selection actions
    addSelectedRoom: (state, action: PayloadAction<string>) => {
      if (!state.selectedRooms.includes(action.payload)) {
        state.selectedRooms.push(action.payload);
      }
    },
    removeSelectedRoom: (state, action: PayloadAction<string>) => {
      state.selectedRooms = state.selectedRooms.filter(
        (id) => id !== action.payload
      );
    },
    setSelectedRooms: (state, action: PayloadAction<string[]>) => {
      state.selectedRooms = action.payload;
    },
    clearSelectedRooms: (state) => {
      state.selectedRooms = [];
    },

    // Guests selection actions
    setSelectedGuests: (
      state,
      action: PayloadAction<{ adults: number; children: number }>
    ) => {
      state.selectedGuests = action.payload;
    },
    clearSelectedGuests: (state) => {
      state.selectedGuests = null;
    },

    // Current booking actions
    setCurrentBooking: (state, action: PayloadAction<Booking | null>) => {
      state.currentBooking = action.payload;
    },
    updateCurrentBooking: (
      state,
      action: PayloadAction<Partial<Booking>>
    ) => {
      if (state.currentBooking) {
        state.currentBooking = {
          ...state.currentBooking,
          ...action.payload,
        };
      }
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },

    // Pending operations actions
    setPendingCheckIns: (state, action: PayloadAction<Booking[]>) => {
      state.pendingCheckIns = action.payload;
    },
    addPendingCheckIn: (state, action: PayloadAction<Booking>) => {
      if (
        !state.pendingCheckIns.find(
          (booking) => booking._id === action.payload._id
        )
      ) {
        state.pendingCheckIns.push(action.payload);
      }
    },
    removePendingCheckIn: (state, action: PayloadAction<string>) => {
      state.pendingCheckIns = state.pendingCheckIns.filter(
        (booking) => booking._id !== action.payload
      );
    },
    setPendingCheckOuts: (state, action: PayloadAction<Booking[]>) => {
      state.pendingCheckOuts = action.payload;
    },
    addPendingCheckOut: (state, action: PayloadAction<Booking>) => {
      if (
        !state.pendingCheckOuts.find(
          (booking) => booking._id === action.payload._id
        )
      ) {
        state.pendingCheckOuts.push(action.payload);
      }
    },
    removePendingCheckOut: (state, action: PayloadAction<string>) => {
      state.pendingCheckOuts = state.pendingCheckOuts.filter(
        (booking) => booking._id !== action.payload
      );
    },

    // Booking modal actions
    openBookingModal: (state) => {
      state.isBookingModalOpen = true;
    },
    closeBookingModal: (state) => {
      state.isBookingModalOpen = false;
      // Reset booking step when closing
      state.bookingStep = 'dates';
    },

    // Booking step navigation
    setBookingStep: (
      state,
      action: PayloadAction<
        'dates' | 'rooms' | 'guests' | 'review' | 'confirmation'
      >
    ) => {
      state.bookingStep = action.payload;
    },
    nextBookingStep: (state) => {
      const steps: OperationsState['bookingStep'][] = [
        'dates',
        'rooms',
        'guests',
        'review',
        'confirmation',
      ];
      const currentIndex = steps.indexOf(state.bookingStep);
      if (currentIndex < steps.length - 1) {
        state.bookingStep = steps[currentIndex + 1];
      }
    },
    previousBookingStep: (state) => {
      const steps: OperationsState['bookingStep'][] = [
        'dates',
        'rooms',
        'guests',
        'review',
        'confirmation',
      ];
      const currentIndex = steps.indexOf(state.bookingStep);
      if (currentIndex > 0) {
        state.bookingStep = steps[currentIndex - 1];
      }
    },

    // Reset all operations state
    resetOperations: (state) => {
      return initialState;
    },
  },
});

export const {
  setDateRange,
  clearDateRange,
  addSelectedRoom,
  removeSelectedRoom,
  setSelectedRooms,
  clearSelectedRooms,
  setSelectedGuests,
  clearSelectedGuests,
  setCurrentBooking,
  updateCurrentBooking,
  clearCurrentBooking,
  setPendingCheckIns,
  addPendingCheckIn,
  removePendingCheckIn,
  setPendingCheckOuts,
  addPendingCheckOut,
  removePendingCheckOut,
  openBookingModal,
  closeBookingModal,
  setBookingStep,
  nextBookingStep,
  previousBookingStep,
  resetOperations,
} = operationsSlice.actions;

export default operationsSlice.reducer;