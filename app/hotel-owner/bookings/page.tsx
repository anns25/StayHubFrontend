'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HotelOwnerLayout from '@/components/shared/HotelOwnerLayout';
import { getHotelOwnerBookings, getMyHotels, updateBookingStatus } from '@/lib/api';
import { Booking, BookingStatus } from '@/types/booking';
import {
    Calendar,
    MapPin,
    Users,
    DollarSign,
    Eye,
    CheckCircle,
    XCircle,
    Filter,
    Search,
    Building2,
    ChevronDown,
    Loader2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Status badge styling
const getStatusBadge = (status: BookingStatus) => {
    const statusConfig = {
        pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        confirmed: { label: 'Confirmed', className: 'bg-emerald/10 text-emerald border-emerald/20' },
        checked_in: { label: 'Checked In', className: 'bg-blue-100 text-blue-800 border-blue-200' },
        checked_out: { label: 'Checked Out', className: 'bg-gray-100 text-gray-800 border-gray-200' },
        cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-200' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.className}`}>
            {config.label}
        </span>
    );
};

// Format date helper
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

// Calculate nights
const calculateNights = (checkIn: string, checkOut: string): number => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

interface BookingWithDetails extends Omit<Booking, 'hotel' | 'room' | 'customer'> {
    hotel?: {
        _id: string;
        name: string;
        location: {
            city: string;
            state?: string;
            country: string;
        };
    };
    room?: {
        _id: string;
        name: string;
        type: string;
    };
    customer?: {
        _id: string;
        name: string;
        email: string;
    };
}

interface Hotel {
    _id: string;
    name: string;
}

export default function HotelOwnerBookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
    const [selectedHotel, setSelectedHotel] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);

    useEffect(() => {
        fetchHotels();
        fetchBookings();
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [filter, selectedHotel]);

    const fetchHotels = async () => {
        try {
            const response = await getMyHotels();
            const hotelList = response.data || [];
            setHotels(hotelList);
        } catch (err: any) {
            console.error('Error fetching hotels:', err);
        }
    };

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const params: any = {};
            if (filter !== 'all') {
                params.status = filter;
            }
            if (selectedHotel !== 'all') {
                params.hotel = selectedHotel;
            }
            const response = await getHotelOwnerBookings(params);
            console.log("Bookings response:", response);
            const bookingsData = response.data || response.bookings || [];
            setBookings(bookingsData);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleViewBooking = (bookingId: string) => {
        router.push(`/hotel-owner/bookings/${bookingId}`);
    };

    const filteredBookings = bookings.filter((booking) => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const customerName = typeof booking.customer === 'object' ? booking.customer.name : '';
            const hotelName = typeof booking.hotel === 'object' ? booking.hotel.name : '';
            const roomName = typeof booking.room === 'object' ? booking.room.name : '';

            return (
                customerName.toLowerCase().includes(query) ||
                hotelName.toLowerCase().includes(query) ||
                roomName.toLowerCase().includes(query) ||
                booking._id.toLowerCase().includes(query)
            );
        }
        return true;
    });

    const handleUpdateStatus = async (bookingId: string, newStatus: BookingStatus) => {
        try {
            setUpdatingStatus(bookingId);
            setStatusDropdownOpen(null);
            await updateBookingStatus(bookingId, newStatus);
            // Refresh bookings
            await fetchBookings();
        } catch (err: any) {
            alert(err.message || 'Failed to update booking status');
        } finally {
            setUpdatingStatus(null);
        }
    };

    // Get available status transitions based on current status
    const getAvailableStatuses = (currentStatus: BookingStatus): BookingStatus[] => {
        const statusFlow: Record<BookingStatus, BookingStatus[]> = {
            pending: ['confirmed', 'cancelled'],
            confirmed: ['checked_in', 'cancelled'],
            checked_in: ['checked_out'],
            checked_out: [],
            cancelled: [],
        };
        return statusFlow[currentStatus] || [];
    };

    const statusCounts = {
        all: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        checked_in: bookings.filter(b => b.status === 'checked_in').length,
        checked_out: bookings.filter(b => b.status === 'checked_out').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };

    if (loading && bookings.length === 0) {
        return (
            <HotelOwnerLayout activeSidebarItem="Bookings">
                <div className="flex items-center justify-center py-12">
                    <div className="text-charcoal-light">Loading bookings...</div>
                </div>
            </HotelOwnerLayout>
        );
    }

    if (error) {
        return (
            <HotelOwnerLayout activeSidebarItem="Bookings">
                <div className="flex flex-col items-center justify-center py-12">
                    <XCircle className="w-12 h-12 text-red-500 mb-4" />
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchBookings}>Try Again</Button>
                </div>
            </HotelOwnerLayout>
        );
    }

    return (
        <HotelOwnerLayout activeSidebarItem="Bookings">
            <div className="space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-charcoal mb-2">Bookings Management</h1>
                    <p className="text-charcoal-light">Manage all bookings for your hotels</p>
                </div>

                {/* Filters and Search */}
                <div className="bg-ivory-light rounded-xl p-6 shadow-card space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search by customer name, hotel, room, or booking ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-charcoal-light" />
                            <span className="text-sm font-medium text-charcoal">Filters:</span>
                        </div>

                        {/* Hotel Filter */}
                        <select
                            value={selectedHotel}
                            onChange={(e) => setSelectedHotel(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none text-sm"
                        >
                            <option value="all">All Hotels</option>
                            {hotels.map((hotel) => (
                                <option key={hotel._id} value={hotel._id}>
                                    {hotel.name}
                                </option>
                            ))}
                        </select>

                        {/* Status Filter Tabs */}
                        <div className="flex flex-wrap gap-2">
                            {(['all', 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${filter === status
                                        ? 'bg-emerald text-white'
                                        : 'bg-white text-charcoal hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    {statusCounts[status] > 0 && (
                                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === status ? 'bg-white/20' : 'bg-emerald/10 text-emerald'
                                            }`}>
                                            {statusCounts[status]}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <div className="bg-ivory-light rounded-xl p-12 text-center shadow-card">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-charcoal mb-2">No bookings found</h3>
                        <p className="text-charcoal-light">
                            {searchQuery
                                ? 'No bookings match your search criteria.'
                                : filter !== 'all'
                                    ? `No ${filter.replace('_', ' ')} bookings found.`
                                    : 'You don\'t have any bookings yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => {
                            const hotel = typeof booking.hotel === 'object' ? booking.hotel : null;
                            const room = typeof booking.room === 'object' ? booking.room : null;
                            const customer = typeof booking.customer === 'object' ? booking.customer : null;
                            const nights = calculateNights(booking.checkIn, booking.checkOut);
                            const availableStatuses = getAvailableStatuses(booking.status);
                            const isUpdating = updatingStatus === booking._id;
                            const isDropdownOpen = statusDropdownOpen === booking._id;

                            return (
                                <div
                                    key={booking._id}
                                    className="bg-ivory-light rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Booking Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-charcoal mb-1">
                                                        Booking #{booking._id.slice(-8).toUpperCase()}
                                                    </h3>
                                                    {customer && (
                                                        <p className="text-sm text-charcoal-light mb-2">
                                                            Customer: <span className="font-medium text-charcoal">{customer.name}</span>
                                                            <span className="mx-2">•</span>
                                                            <span className="text-emerald">{customer.email}</span>
                                                        </p>
                                                    )}
                                                </div>
                                                {getStatusBadge(booking.status)}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                                <div className="flex items-center text-sm">
                                                    <Building2 className="w-4 h-4 mr-2 text-emerald" />
                                                    <div>
                                                        <p className="text-charcoal-light">Hotel</p>
                                                        <p className="font-semibold text-charcoal">{hotel?.name || 'N/A'}</p>
                                                        {hotel?.location && (
                                                            <p className="text-xs text-charcoal-light">
                                                                {hotel.location.city}
                                                                {hotel.location.state && `, ${hotel.location.state}`}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                {room && (
                                                    <div className="flex items-center text-sm">
                                                        <div className="w-4 h-4 mr-2" />
                                                        <div>
                                                            <p className="text-charcoal-light">Room</p>
                                                            <p className="font-semibold text-charcoal">{room.name} - {room.type}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="flex items-center text-sm">
                                                    <Calendar className="w-4 h-4 mr-2 text-emerald" />
                                                    <div>
                                                        <p className="text-charcoal-light">Check-in</p>
                                                        <p className="font-semibold text-charcoal">{formatDate(booking.checkIn)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <Calendar className="w-4 h-4 mr-2 text-emerald" />
                                                    <div>
                                                        <p className="text-charcoal-light">Check-out</p>
                                                        <p className="font-semibold text-charcoal">{formatDate(booking.checkOut)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 text-sm text-charcoal-light">
                                                <div className="flex items-center">
                                                    <Users className="w-4 h-4 mr-1" />
                                                    <span>
                                                        {booking.guests.adults} Adult{booking.guests.adults !== 1 ? 's' : ''}
                                                        {booking.guests.children > 0 && `, ${booking.guests.children} Child${booking.guests.children !== 1 ? 'ren' : ''}`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="mr-1">•</span>
                                                    <span>{nights} night{nights !== 1 ? 's' : ''}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <DollarSign className="w-4 h-4 mr-1" />
                                                    <span className="font-semibold text-charcoal">
                                                        {booking.currency} {booking.totalAmount.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="mr-1">•</span>
                                                    <span>Booked on {formatDate(booking.createdAt)}</span>
                                                </div>
                                            </div>

                                            {booking.specialRequests && (
                                                <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                                                    <p className="text-xs text-charcoal-light mb-1">Special Requests:</p>
                                                    <p className="text-sm text-charcoal">{booking.specialRequests}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2 justify-start">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleViewBooking(booking._id)}
                                                className="flex items-center justify-center"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </Button>
                                            {/* Status Update Dropdown */}
                                            {availableStatuses.length > 0 && (
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setStatusDropdownOpen(
                                                            isDropdownOpen ? null : booking._id
                                                        )}
                                                        disabled={isUpdating}
                                                        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border-2 border-emerald text-emerald font-medium transition-colors ${isUpdating
                                                                ? 'opacity-50 cursor-not-allowed'
                                                                : 'hover:bg-emerald/10'
                                                            }`}
                                                    >
                                                        {isUpdating ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                <span>Updating...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>Update Status</span>
                                                                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''
                                                                    }`} />
                                                            </>
                                                        )}
                                                    </button>

                                                    {isDropdownOpen && !isUpdating && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-10"
                                                                onClick={() => setStatusDropdownOpen(null)}
                                                            />
                                                            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                                                {availableStatuses.map((status) => {
                                                                    const statusLabels: Record<BookingStatus, string> = {
                                                                        confirmed: 'Confirm Booking',
                                                                        checked_in: 'Check In',
                                                                        checked_out: 'Check Out',
                                                                        cancelled: 'Cancel Booking',
                                                                        pending: 'Mark as Pending',
                                                                    };

                                                                    return (
                                                                        <button
                                                                            key={status}
                                                                            onClick={() => handleUpdateStatus(booking._id, status)}
                                                                            className="w-full px-4 py-2 text-left hover:bg-emerald/10 transition-colors text-sm text-charcoal"
                                                                        >
                                                                            {statusLabels[status]}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            {/* Quick Action Buttons for Common Status Changes */}
                                            {booking.status === 'pending' && (
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                                                    disabled={isUpdating}
                                                    className="flex items-center justify-center"
                                                >
                                                    {isUpdating ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                    )}
                                                    Confirm Booking
                                                </Button>
                                            )}

                                            {booking.status === 'confirmed' && (
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleUpdateStatus(booking._id, 'checked_in')}
                                                    disabled={isUpdating}
                                                    className="flex items-center justify-center"
                                                >
                                                    {isUpdating ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                    )}
                                                    Check In
                                                </Button>
                                            )}

                                            {booking.status === 'checked_in' && (
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleUpdateStatus(booking._id, 'checked_out')}
                                                    disabled={isUpdating}
                                                    className="flex items-center justify-center"
                                                >
                                                    {isUpdating ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                    )}
                                                    Check Out
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </HotelOwnerLayout>
    );
}