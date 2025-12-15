const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const endpoints = {
  // Auth
  auth: {
    register: `${API_BASE}/auth/register`,
    login: `${API_BASE}/auth/login`,
    me: `${API_BASE}/auth/me`,
    profile: `${API_BASE}/auth/profile`,
  },
  // Hotels
  hotels: {
    list: `${API_BASE}/hotels`,
    search: `${API_BASE}/hotels/search`,
    detail: (id: string) => `${API_BASE}/hotels/${id}`,
    create: `${API_BASE}/hotels`,
    update: (id: string) => `${API_BASE}/hotels/${id}`,
    delete: (id: string) => `${API_BASE}/hotels/${id}`,
  },
  // Rooms
  rooms: {
    list: `${API_BASE}/rooms`,
    detail: (id: string) => `${API_BASE}/rooms/${id}`,
    byHotel: (hotelId: string) => `${API_BASE}/rooms/hotel/${hotelId}`,
    create: `${API_BASE}/rooms`,
    update: (id: string) => `${API_BASE}/rooms/${id}`,
    delete: (id: string) => `${API_BASE}/rooms/${id}`,
  },
  // Bookings
  bookings: {
    list: `${API_BASE}/bookings`,
    myBookings: `${API_BASE}/bookings/my-bookings`,
    detail: (id: string) => `${API_BASE}/bookings/${id}`,
    create: `${API_BASE}/bookings`,
    update: (id: string) => `${API_BASE}/bookings/${id}`,
    cancel: (id: string) => `${API_BASE}/bookings/${id}/cancel`,
  },
  // Reviews
  reviews: {
    list: (hotelId: string) => `${API_BASE}/reviews/hotel/${hotelId}`,
    detail: (id: string) => `${API_BASE}/reviews/${id}`,
    create: `${API_BASE}/reviews`,
    update: (id: string) => `${API_BASE}/reviews/${id}`,
    respond: (id: string) => `${API_BASE}/reviews/${id}/respond`,
  },
  // Chat
  chat: {
    messages: (hotelId?: string) => `${API_BASE}/chat${hotelId ? `/${hotelId}` : ''}`,
    send: `${API_BASE}/chat`,
    summary: (bookingId: string) => `${API_BASE}/chat/summary/${bookingId}`,
  },
  // AI
  ai: {
    roomDescription: `${API_BASE}/ai/room-description`,
    reviewResponse: `${API_BASE}/ai/review-response`,
    pricingSuggestion: `${API_BASE}/ai/pricing-suggestion`,
    marketingContent: `${API_BASE}/ai/marketing-content`,
    smartReplies: `${API_BASE}/ai/smart-replies`,
    bookingSummary: `${API_BASE}/ai/booking-summary`,
    businessInsights: `${API_BASE}/ai/business-insights`,
  },
  // Admin
  admin: {
    pendingApprovals: `${API_BASE}/admin/pending-approvals`,
    approveHotel: (id: string) => `${API_BASE}/admin/hotels/${id}/approve`,
    approveUser: (id: string) => `${API_BASE}/admin/users/${id}/approve`,
    analytics: `${API_BASE}/admin/analytics`,
    generateDemoData: `${API_BASE}/admin/generate-demo-data`,
  },
};

