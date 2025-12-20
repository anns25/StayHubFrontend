'use client';

import HotelOwnerLayout from '@/components/shared/HotelOwnerLayout';
import { useState, useEffect } from 'react';
import { getMyHotels, deleteHotel } from '@/lib/api';
import { Building2, Plus, Edit, Trash2, MapPin, CheckCircle, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import HotelForm from '@/components/hotel-owner/HotelForm';

interface Hotel {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  images: Array<{ url: string }>;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await getMyHotels();
      setHotels(response.data || []);
    } catch (error: any) {
      console.error('Error fetching hotels:', error);
      alert(error.message || 'Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingHotelId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (hotelId: string) => {
    setEditingHotelId(hotelId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHotelId(null);
  };

  const handleFormSuccess = () => {
    fetchHotels(); // Refresh the list
    handleCloseModal();
  };

  const handleDelete = async (hotelId: string) => {
    if (!confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(hotelId);
      await deleteHotel(hotelId);
      setHotels(hotels.filter(h => h._id !== hotelId));
      alert('Hotel deleted successfully');
    } catch (error: any) {
      console.error('Error deleting hotel:', error);
      alert(error.message || 'Failed to delete hotel');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <HotelOwnerLayout activeSidebarItem="Hotels">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-charcoal mb-2">My Hotels</h1>
            <p className="text-charcoal-light">Manage your hotel listings</p>
          </div>
          <Button
            onClick={handleOpenCreate}
            variant="primary"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add Hotel</span>
          </Button>
        </div>

        {/* Hotels List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald mx-auto mb-4"></div>
            <p className="text-charcoal-light">Loading hotels...</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-12 bg-ivory-light rounded-xl">
            <Building2 className="w-16 h-16 text-charcoal-light mx-auto mb-4 opacity-50" />
            <p className="text-charcoal-light text-lg mb-2">No hotels yet</p>
            <p className="text-charcoal-light text-sm mb-4">Get started by adding your first hotel</p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald text-white rounded-lg hover:bg-emerald-dark shadow-md hover:shadow-lg transition-all duration-200 font-medium text-sm group"
            >
              <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
              <span>Add Your First Hotel</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
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
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {hotel.isApproved ? (
                      <span className="px-2 py-1 bg-emerald text-white rounded-full text-xs font-medium flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approved
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-warning text-white rounded-full text-xs font-medium flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Hotel Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-charcoal mb-2">{hotel.name}</h3>
                  <div className="flex items-center text-sm text-charcoal-light mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{hotel.location.city}, {hotel.location.state}</span>
                  </div>
                  <p className="text-sm text-charcoal-light mb-4 line-clamp-2">
                    {hotel.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-charcoal-light mb-4">
                    <span className="capitalize">{hotel.category}</span>
                    <span>Created: {formatDate(hotel.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 w-full pt-4">
                    <button
                      onClick={() => handleOpenEdit(hotel._id)}
                      className="flex items-center justify-center px-4 py-2 bg-emerald/10 text-emerald border border-emerald/20 rounded-lg hover:bg-emerald/20 hover:border-emerald/40 transition-all duration-200 group flex-1"
                      title="Edit hotel"
                    >
                      <Edit className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(hotel._id)}
                      disabled={deleting === hotel._id}
                      className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group flex-1"
                      title="Delete hotel"
                    >
                      {deleting === hotel._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium">Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hotel Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingHotelId ? 'Edit Hotel' : 'Create New Hotel'}
        size="xl"
      >
        <HotelForm
          hotelId={editingHotelId || undefined}
          onSuccess={handleFormSuccess}
          onCancel={handleCloseModal}
        />
      </Modal>
    </HotelOwnerLayout>
  );
}