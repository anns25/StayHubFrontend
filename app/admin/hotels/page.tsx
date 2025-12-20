'use client';

import AdminLayout from '@/components/shared/AdminLayout';
import { useState, useEffect } from 'react';
import { getPendingHotels, approveHotel } from '@/lib/api';
import { Building2, CheckCircle, Clock, MapPin, User, Mail, Calendar, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PendingHotel {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
  };
  images: Array<{ url: string; publicId?: string }>;
  amenities: string[];
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  isApproved: boolean;
}

export default function AdminHotelsPage() {
  const [pendingHotels, setPendingHotels] = useState<PendingHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<PendingHotel | null>(null);

  useEffect(() => {
    fetchPendingHotels();
  }, []);

  const fetchPendingHotels = async () => {
    try {
      setLoading(true);
      const response = await getPendingHotels();
      setPendingHotels(response.data?.hotels || []);
    } catch (error: any) {
      console.error('Error fetching pending hotels:', error);
      alert(error.message || 'Failed to fetch pending hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (hotelId: string) => {
    if (!confirm('Are you sure you want to approve this hotel? It will become visible to customers.')) {
      return;
    }

    try {
      setApproving(hotelId);
      await approveHotel(hotelId);
      setPendingHotels(pendingHotels.filter(h => h._id !== hotelId));
      if (selectedHotel?._id === hotelId) {
        setSelectedHotel(null);
      }
      alert('Hotel approved successfully');
    } catch (error: any) {
      console.error('Error approving hotel:', error);
      alert(error.message || 'Failed to approve hotel');
    } finally {
      setApproving(null);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout activeSidebarItem="Hotels">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-charcoal mb-2">Hotel Approvals</h1>
          <p className="text-charcoal-light">Review and approve hotel listings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-charcoal-light mb-1">Pending Hotels</p>
                <p className="text-2xl font-bold text-charcoal">{pendingHotels.length}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Hotels List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald mx-auto mb-4"></div>
            <p className="text-charcoal-light">Loading pending hotels...</p>
          </div>
        ) : pendingHotels.length === 0 ? (
          <div className="text-center py-12 bg-ivory-light rounded-xl">
            <CheckCircle className="w-16 h-16 text-emerald mx-auto mb-4 opacity-50" />
            <p className="text-charcoal-light text-lg mb-2">No pending hotels</p>
            <p className="text-charcoal-light text-sm">All hotels have been reviewed</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingHotels.map((hotel) => (
              <div
                key={hotel._id}
                className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
              >
                {/* Hotel Image */}
                <div className="relative h-48 bg-gradient-to-r from-emerald-dark to-emerald">
                  {hotel.images && hotel.images.length > 0 ? (
                    <img
                      src={hotel.images[0].url}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-warning text-white rounded-full text-xs font-medium flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Approval
                    </span>
                  </div>
                </div>

                {/* Hotel Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-charcoal mb-2">{hotel.name}</h3>
                  <div className="flex items-center text-sm text-charcoal-light mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      {hotel.location.address}, {hotel.location.city}, {hotel.location.state}, {hotel.location.country}
                    </span>
                  </div>
                  <p className="text-sm text-charcoal-light mb-4 line-clamp-2">
                    {hotel.description}
                  </p>

                  {/* Owner Info */}
                  <div className="bg-ivory-light rounded-lg p-3 mb-4">
                    <p className="text-xs font-medium text-charcoal-light mb-2">Owner Information</p>
                    <div className="flex items-center text-sm text-charcoal mb-1">
                      <User className="w-4 h-4 mr-2" />
                      <span>{hotel.owner.name}</span>
                    </div>
                    <div className="flex items-center text-sm text-charcoal-light">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{hotel.owner.email}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs text-charcoal-light">
                      <span>Category:</span>
                      <span className="capitalize font-medium">{hotel.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-charcoal-light">
                      <span>Submitted:</span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(hotel.createdAt)}
                      </span>
                    </div>
                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="text-xs text-charcoal-light">
                        <span className="font-medium">Amenities: </span>
                        <span>{hotel.amenities.slice(0, 3).join(', ')}{hotel.amenities.length > 3 ? '...' : ''}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full pt-4">
                    <button
                      onClick={() => setSelectedHotel(hotel)}
                      className="flex items-center justify-center px-4 py-2.5 bg-white text-charcoal border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-emerald transition-all duration-200 group font-medium text-sm sm:flex-1"
                    >
                      <span className="group-hover:scale-105 transition-transform">View Details</span>
                    </button>
                    <button
                      onClick={() => handleApprove(hotel._id)}
                      disabled={approving === hotel._id}
                      className="flex items-center justify-center px-4 py-2.5 bg-emerald text-white rounded-lg hover:bg-emerald-dark shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group font-medium text-sm sm:flex-1"
                    >
                      {approving === hotel._id ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          <span>Approving...</span>
                        </div>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" />
                          <span>Approve</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hotel Detail Modal */}
        {selectedHotel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-charcoal">{selectedHotel.name}</h2>
                <button
                  onClick={() => setSelectedHotel(null)}
                  className="text-charcoal-light hover:text-charcoal"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Images */}
                {selectedHotel.images && selectedHotel.images.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal mb-3">Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedHotel.images.map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={`${selectedHotel.name} ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">Description</h3>
                  <p className="text-charcoal-light">{selectedHotel.description}</p>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">Location</h3>
                  <div className="bg-ivory-light rounded-lg p-4">
                    <p className="text-charcoal">{selectedHotel.location.address}</p>
                    <p className="text-charcoal-light">
                      {selectedHotel.location.city}, {selectedHotel.location.state}, {selectedHotel.location.country}
                      {selectedHotel.location.zipCode && ` ${selectedHotel.location.zipCode}`}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                {selectedHotel.contact && (
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal mb-2">Contact Information</h3>
                    <div className="bg-ivory-light rounded-lg p-4 space-y-2">
                      {selectedHotel.contact.phone && (
                        <p className="text-charcoal">Phone: {selectedHotel.contact.phone}</p>
                      )}
                      {selectedHotel.contact.email && (
                        <p className="text-charcoal">Email: {selectedHotel.contact.email}</p>
                      )}
                      {selectedHotel.contact.website && (
                        <p className="text-charcoal">Website: {selectedHotel.contact.website}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {selectedHotel.amenities && selectedHotel.amenities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedHotel.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-emerald/10 text-emerald rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Owner Info */}
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">Owner Information</h3>
                  <div className="bg-ivory-light rounded-lg p-4">
                    <p className="text-charcoal font-medium">{selectedHotel.owner.name}</p>
                    <p className="text-charcoal-light">{selectedHotel.owner.email}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedHotel(null)}
                    className="flex items-center justify-center px-5 py-2.5 bg-white text-charcoal border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-emerald transition-all duration-200 font-medium text-sm"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedHotel._id);
                      setSelectedHotel(null);
                    }}
                    disabled={approving === selectedHotel._id}
                    className="flex items-center justify-center px-5 py-2.5 bg-emerald text-white rounded-lg hover:bg-emerald-dark shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                  >
                    {approving === selectedHotel._id ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        <span>Approving...</span>
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                        <span>Approve Hotel</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
