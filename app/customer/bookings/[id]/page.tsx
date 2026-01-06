'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CustomerLayout from '@/components/shared/CustomerLayout';
import { getBooking, cancelBooking } from '@/lib/api';
import { Booking, BookingStatus } from '@/types/booking';
import {
    Calendar,
    MapPin,
    Users,
    DollarSign,
    Clock,
    CheckCircle,
    X,
    ArrowLeft,
    Download,
    Printer,
    AlertCircle,
    Shield,
    FileText,
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface BookingWithDetails extends Omit<Booking, 'hotel' | 'room'> {
    hotel?: {
        _id: string;
        name: string;
        location: {
            address?: string;
            city: string;
            state?: string;
            country: string;
        };
        images?: Array<{ url: string }>;
        phone?: string;
        email?: string;
    };
    room?: {
        _id: string;
        name: string;
        type: string;
        description?: string;
        price?: {
            base: number;
            currency: string;
        };
        capacity?: {
            adults: number;
            children: number;
        };
        images?: Array<{ url: string }>;
    };
}

// Status badge styling
const getStatusBadge = (status: BookingStatus) => {
    const statusConfig = {
        pending: { label: 'Booking Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        confirmed: { label: 'Confirmed', className: 'bg-emerald/10 text-emerald border-emerald/20' },
        checked_in: { label: 'Checked In', className: 'bg-blue-100 text-blue-800 border-blue-200' },
        checked_out: { label: 'Checked Out', className: 'bg-gray-100 text-gray-800 border-gray-200' },
        cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-200' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${config.className}`}>
            {config.label}
        </span>
    );
};

// Payment status badge
const getPaymentBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
        pending: { label: 'Payment Pending', className: 'bg-yellow-100 text-yellow-800' },
        paid: { label: 'Paid', className: 'bg-emerald/10 text-emerald' },
        refunded: { label: 'Refunded', className: 'bg-blue-100 text-blue-800' },
        failed: { label: 'Payment Failed', className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
            {config.label}
        </span>
    );
};

// Format date helper
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const formatDateShort = (dateString: string): string => {
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

export default function BookingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const bookingId = params.id as string;

    const [booking, setBooking] = useState<BookingWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelling, setCancelling] = useState(false);


    useEffect(() => {
        if (bookingId) {
            fetchBooking();
        }
    }, [bookingId]);

    const fetchBooking = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getBooking(bookingId);
            // Handle both direct booking object and nested response
            const bookingData = response.booking || response.data || response;
            setBooking(bookingData);
            console.log("Booking hotel data:", bookingData.hotel);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch booking details');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async () => {
        if (!booking) return;

        try {
            setCancelling(true);
            await cancelBooking(booking._id, cancelReason || undefined);
            setShowCancelModal(false);
            setCancelReason('');
            // Refresh booking data
            await fetchBooking();
        } catch (err: any) {
            alert(err.message || 'Failed to cancel booking');
        } finally {
            setCancelling(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // Create a printable version
        const printWindow = window.open('', '_blank');
        if (printWindow && booking) {
            const content = `
        <html>
          <head>
            <title>Booking Confirmation - ${booking._id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #10b981; }
              .section { margin-bottom: 20px; }
              .info-row { margin: 10px 0; }
            </style>
          </head>
          <body>
            <h1>Booking Confirmation</h1>
            <div class="section">
              <h2>Booking Details</h2>
              <p><strong>Booking ID:</strong> ${booking._id}</p>
              <p><strong>Status:</strong> ${booking.status}</p>
              <p><strong>Check-in:</strong> ${formatDate(booking.checkIn)}</p>
              <p><strong>Check-out:</strong> ${formatDate(booking.checkOut)}</p>
            </div>
            ${booking.hotel ? `
            <div class="section">
              <h2>Hotel Information</h2>
              <p><strong>Hotel:</strong> ${booking.hotel.name}</p>
              <p><strong>Location:</strong> ${booking.hotel.location.city}, ${booking.hotel.location.country}</p>
            </div>
            ` : ''}
            ${booking.room ? `
            <div class="section">
              <h2>Room Information</h2>
              <p><strong>Room:</strong> ${booking.room.name} - ${booking.room.type}</p>
            </div>
            ` : ''}
            <div class="section">
              <h2>Payment</h2>
              <p><strong>Total Amount:</strong> ${booking.currency} ${booking.totalAmount.toFixed(2)}</p>
              <p><strong>Payment Status:</strong> ${booking.paymentStatus}</p>
            </div>
          </body>
        </html>
      `;
            printWindow.document.write(content);
            printWindow.document.close();
            printWindow.print();
        }
    };

    if (loading) {
        return (
            <CustomerLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="text-charcoal-light">Loading booking details...</div>
                </div>
            </CustomerLayout>
        );
    }

    if (error || !booking) {
        return (
            <CustomerLayout>
                <div className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
                    <Button onClick={() => router.push('/customer/bookings')}>
                        Back to Bookings
                    </Button>
                </div>
            </CustomerLayout>
        );
    }

    const hotel = typeof booking.hotel === 'object' ? booking.hotel : null;
    const room = typeof booking.room === 'object' ? booking.room : null;
    const nights = calculateNights(booking.checkIn, booking.checkOut);

    const getPlaceholderImage = () => {
        return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';
    };

    const getHotelImage = () => {
        if (!hotel) return getPlaceholderImage();

        // Try different image structures
        if (hotel.images && Array.isArray(hotel.images) && hotel.images.length > 0) {
            const firstImage = hotel.images[0];
            // Handle both {url: string} and {url: string, publicId: string} structures
            if (typeof firstImage === 'string') {
                return firstImage;
            }
            if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
                return firstImage.url || getPlaceholderImage();
            }
        }


        return getPlaceholderImage();
    };

    const hotelImage = getHotelImage();

    const getRoomImage = () => {
        if (!room || !room.images || !Array.isArray(room.images) || room.images.length === 0) {
            return hotelImage;
        }

        const firstImage = room.images[0];
        if (typeof firstImage === 'string') {
            return firstImage;
        }
        if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
            return firstImage.url || hotelImage;
        }
        return hotelImage;
    };

    const roomImage = getRoomImage();

    const canCancel = booking.status !== 'cancelled' &&
        booking.status !== 'checked_out' &&
        booking.status !== 'checked_in';

    return (
        <CustomerLayout>
            <div className="max-w-5xl mx-auto space-y-6 print:space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 print:mb-4">
                    <button
                        onClick={() => router.push('/customer/bookings')}
                        className="flex items-center text-charcoal-light hover:text-charcoal transition-colors print:hidden"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Bookings
                    </button>
                    <div className="flex items-center gap-3 print:hidden">
                        <Button variant="outline" onClick={handlePrint} className="flex items-center">
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                        </Button>
                        <Button variant="outline" onClick={handleDownload} className="flex items-center">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </div>

                {/* Booking Status Banner */}
                <div className="bg-ivory-light rounded-xl p-6 shadow-card border-l-4 border-emerald">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-charcoal mb-2">Booking Confirmation</h1>
                            <p className="text-charcoal-light">Booking ID: <span className="font-mono text-sm">{booking._id}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                            {getStatusBadge(booking.status)}
                            {getPaymentBadge(booking.paymentStatus)}
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hotel & Room Info */}
                        <div className="bg-ivory-light rounded-xl p-6 shadow-card">
                            <h2 className="text-xl font-bold text-charcoal mb-4">Accommodation Details</h2>

                            {hotel && (
                                <div className="mb-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                                            <img
                                                src={hotelImage}
                                                alt={hotel.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    // Fallback if image fails to load
                                                    (e.target as HTMLImageElement).src = getPlaceholderImage();
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-charcoal mb-2">{hotel.name}</h3>
                                            <div className="flex items-center text-sm text-charcoal-light mb-2">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                <span>
                                                    {hotel.location.address && `${hotel.location.address}, `}
                                                    {hotel.location.city}
                                                    {hotel.location.state && `, ${hotel.location.state}`}
                                                    {`, ${hotel.location.country}`}
                                                </span>
                                            </div>
                                            {hotel.phone && (
                                                <p className="text-sm text-charcoal-light">Phone: {hotel.phone}</p>
                                            )}
                                            {hotel.email && (
                                                <p className="text-sm text-charcoal-light">Email: {hotel.email}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {room && (
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex items-start gap-4">
                                        {room.images && room.images.length > 0 && (
                                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={roomImage}
                                                    alt={room.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        // Fallback if image fails to load
                                                        (e.target as HTMLImageElement).src = getPlaceholderImage();
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-charcoal mb-1">{room.name}</h4>
                                            <p className="text-sm text-charcoal-light mb-2">{room.type}</p>
                                            {room.description && (
                                                <p className="text-sm text-charcoal-light">{room.description}</p>
                                            )}
                                            {room.capacity && (
                                                <p className="text-sm text-charcoal-light mt-2">
                                                    Capacity: {room.capacity.adults} Adult{room.capacity.adults !== 1 ? 's' : ''}
                                                    {room.capacity.children > 0 && `, ${room.capacity.children} Child${room.capacity.children !== 1 ? 'ren' : ''}`}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Dates & Guests */}
                        <div className="bg-ivory-light rounded-xl p-6 shadow-card">
                            <h2 className="text-xl font-bold text-charcoal mb-4">Stay Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-emerald/10 rounded-lg">
                                        <Calendar className="w-5 h-5 text-emerald" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-charcoal-light mb-1">Check-in</p>
                                        <p className="font-semibold text-charcoal">{formatDate(booking.checkIn)}</p>
                                        <p className="text-sm text-charcoal-light mt-1">After 3:00 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-emerald/10 rounded-lg">
                                        <Calendar className="w-5 h-5 text-emerald" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-charcoal-light mb-1">Check-out</p>
                                        <p className="font-semibold text-charcoal">{formatDate(booking.checkOut)}</p>
                                        <p className="text-sm text-charcoal-light mt-1">Before 11:00 AM</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-emerald/10 rounded-lg">
                                        <Clock className="w-5 h-5 text-emerald" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-charcoal-light mb-1">Duration</p>
                                        <p className="font-semibold text-charcoal">{nights} night{nights !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-emerald/10 rounded-lg">
                                        <Users className="w-5 h-5 text-emerald" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-charcoal-light mb-1">Guests</p>
                                        <p className="font-semibold text-charcoal">
                                            {booking.guests.adults} Adult{booking.guests.adults !== 1 ? 's' : ''}
                                            {booking.guests.children > 0 && `, ${booking.guests.children} Child${booking.guests.children !== 1 ? 'ren' : ''}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Special Requests */}
                        {booking.specialRequests && (
                            <div className="bg-ivory-light rounded-xl p-6 shadow-card">
                                <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center">
                                    <FileText className="w-5 h-5 mr-2 text-emerald" />
                                    Special Requests
                                </h2>
                                <p className="text-charcoal-light">{booking.specialRequests}</p>
                            </div>
                        )}

                        {/* Cancellation Info */}
                        {booking.cancellationReason && (
                            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                                <h2 className="text-xl font-bold text-red-800 mb-2 flex items-center">
                                    <X className="w-5 h-5 mr-2" />
                                    Cancellation Details
                                </h2>
                                <p className="text-red-700">{booking.cancellationReason}</p>
                                <p className="text-sm text-red-600 mt-2">
                                    Cancelled on {formatDateShort(booking.updatedAt)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Payment & Actions */}
                    <div className="space-y-6">
                        {/* Payment Summary */}
                        <div className="bg-ivory-light rounded-xl p-6 shadow-card">
                            <h2 className="text-xl font-bold text-charcoal mb-4">Payment Summary</h2>
                            <div className="space-y-3">
                                {room?.price && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-charcoal-light">Room Rate ({nights} nights)</span>
                                        <span className="text-charcoal font-medium">
                                            {booking.currency} {(room.price.base * nights).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="border-t border-gray-200 pt-3 flex justify-between">
                                    <span className="font-semibold text-charcoal">Total Amount</span>
                                    <span className="font-bold text-lg text-emerald">
                                        {booking.currency} {booking.totalAmount.toFixed(2)}
                                    </span>
                                </div>
                                {booking.paymentMethod && (
                                    <div className="text-sm text-charcoal-light">
                                        Payment Method: <span className="font-medium text-charcoal">{booking.paymentMethod}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-ivory-light rounded-xl p-6 shadow-card space-y-3">
                            <h2 className="text-xl font-bold text-charcoal mb-4">Actions</h2>
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={() => hotel && router.push(`/customer/hotels/${hotel._id}`)}
                            >
                                View Hotel
                            </Button>
                            {canCancel && (
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => setShowCancelModal(true)}
                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                >
                                    Cancel Booking
                                </Button>
                            )}
                        </div>

                        {/* Booking Info */}
                        <div className="bg-ivory-light rounded-xl p-6 shadow-card">
                            <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center">
                                <Shield className="w-5 h-5 mr-2 text-emerald" />
                                Booking Information
                            </h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-charcoal-light">Booking Date</span>
                                    <span className="text-charcoal font-medium">{formatDateShort(booking.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-charcoal-light">Last Updated</span>
                                    <span className="text-charcoal font-medium">{formatDateShort(booking.updatedAt)}</span>
                                </div>
                                {booking.aiSummary && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <p className="text-xs text-charcoal-light mb-1">AI Summary</p>
                                        <p className="text-sm text-charcoal">{booking.aiSummary}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cancel Booking Modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
                            <h3 className="text-xl font-bold text-charcoal mb-4">Cancel Booking</h3>
                            <p className="text-charcoal-light mb-4">
                                Are you sure you want to cancel your booking at{' '}
                                <span className="font-semibold text-charcoal">
                                    {hotel?.name || 'this hotel'}?
                                </span>
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-charcoal mb-2">
                                    Reason for cancellation (optional)
                                </label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="Please let us know why you're cancelling..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowCancelModal(false);
                                        setCancelReason('');
                                    }}
                                    className="flex-1"
                                >
                                    Keep Booking
                                </Button>
                                <Button
                                    onClick={handleCancelBooking}
                                    disabled={cancelling}
                                    className="flex-1 bg-red-600 hover:bg-red-700"
                                >
                                    {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}