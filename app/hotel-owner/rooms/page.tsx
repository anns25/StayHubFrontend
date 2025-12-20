'use client';

import HotelOwnerLayout from '@/components/shared/HotelOwnerLayout';
import { useState, useEffect } from 'react';
import { getMyHotels, getRoomsByHotel, deleteRoom } from '@/lib/api';
import { Bed, Plus, Edit, Trash2, Building2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import RoomForm from '@/components/hotel-owner/RoomForm';

interface Room {
  _id: string;
  name: string;
  description: string;
  type: string;
  price: {
    base: number;
    currency: string;
  };
  capacity: {
    adults: number;
    children: number;
  };
  quantity: number;
  available: number;
  images: Array<{ url: string }>;
  hotel: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface Hotel {
  _id: string;
  name: string;
}

export default function RoomsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedHotel) {
      fetchRooms();
    } else {
      setRooms([]);
    }
  }, [selectedHotel]);

  const fetchHotels = async () => {
    try {
      const response = await getMyHotels();
      const hotelList = response.data || [];
      setHotels(hotelList);
      if (hotelList.length > 0 && !selectedHotel) {
        setSelectedHotel(hotelList[0]._id);
      }
    } catch (error: any) {
      console.error('Error fetching hotels:', error);
      alert(error.message || 'Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    if (!selectedHotel) return;
    try {
      setLoading(true);
      const response = await getRoomsByHotel(selectedHotel);
      setRooms(response.data || []);
    } catch (error: any) {
      console.error('Error fetching rooms:', error);
      alert(error.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingRoomId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (roomId: string) => {
    setEditingRoomId(roomId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoomId(null);
  };

  const handleFormSuccess = () => {
    fetchRooms();
    handleCloseModal();
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(roomId);
      await deleteRoom(roomId);
      setRooms(rooms.filter(r => r._id !== roomId));
      alert('Room deleted successfully');
    } catch (error: any) {
      console.error('Error deleting room:', error);
      alert(error.message || 'Failed to delete room');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <HotelOwnerLayout activeSidebarItem="Rooms">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-charcoal mb-2">Rooms</h1>
            <p className="text-charcoal-light">Manage room listings for your hotels</p>
          </div>
          <Button
            onClick={handleOpenCreate}
            variant="primary"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors"
            disabled={!selectedHotel || hotels.length === 0}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add Room</span>
          </Button>
        </div>

        {/* Hotel Selector */}
        {hotels.length > 0 && (
          <div className="bg-white rounded-xl shadow-card p-6">
            <label className="block text-sm font-medium text-charcoal mb-2">
              Select Hotel
            </label>
            <select
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
              className="w-full px-4 py-3 bg-ivory-light border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none"
            >
              {hotels.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Rooms List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald mx-auto mb-4"></div>
            <p className="text-charcoal-light">Loading rooms...</p>
          </div>
        ) : !selectedHotel ? (
          <div className="text-center py-12 bg-ivory-light rounded-xl">
            <Building2 className="w-16 h-16 text-charcoal-light mx-auto mb-4 opacity-50" />
            <p className="text-charcoal-light text-lg mb-2">No hotels available</p>
            <p className="text-charcoal-light text-sm">Create a hotel first to add rooms</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12 bg-ivory-light rounded-xl">
            <Bed className="w-16 h-16 text-charcoal-light mx-auto mb-4 opacity-50" />
            <p className="text-charcoal-light text-lg mb-2">No rooms yet</p>
            <p className="text-charcoal-light text-sm mb-4">Get started by adding your first room</p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald text-white rounded-lg hover:bg-emerald-dark shadow-md hover:shadow-lg transition-all duration-200 font-medium text-sm group"
            >
              <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
              <span>Add Your First Room</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
              >
                {/* Room Image */}
                <div className="relative h-48 bg-gradient-to-r from-emerald-dark to-emerald">
                  {room.images && room.images.length > 0 ? (
                    <img
                      src={room.images[0].url}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Bed className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                </div>

                {/* Room Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-charcoal mb-2">{room.name}</h3>
                  <div className="flex items-center text-sm text-charcoal-light mb-2">
                    <Building2 className="w-4 h-4 mr-1" />
                    <span>{room.hotel.name}</span>
                  </div>
                  <p className="text-sm text-charcoal-light mb-4 line-clamp-2">
                    {room.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs text-charcoal-light">
                      <span>Type:</span>
                      <span className="capitalize font-medium">{room.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-charcoal-light">
                      <span>Price:</span>
                      <span className="font-medium">{room.price.currency} {room.price.base}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-charcoal-light">
                      <span>Capacity:</span>
                      <span className="font-medium">{room.capacity.adults} Adults, {room.capacity.children} Children</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-charcoal-light">
                      <span>Available:</span>
                      <span className="font-medium">{room.available} / {room.quantity}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 w-full">
                    <button
                      onClick={() => handleOpenEdit(room._id)}
                      className="flex items-center justify-center px-4 py-2 bg-emerald/10 text-emerald border border-emerald/20 rounded-lg hover:bg-emerald/20 hover:border-emerald/40 transition-all duration-200 group flex-1"
                      title="Edit room"
                    >
                      <Edit className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(room._id)}
                      disabled={deleting === room._id}
                      className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group flex-1"
                      title="Delete room"
                    >
                      {deleting === room._id ? (
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

      {/* Room Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRoomId ? 'Edit Room' : 'Create New Room'}
        size="xl"
      >
        <RoomForm
          roomId={editingRoomId || undefined}
          hotelId={selectedHotel || undefined}
          onSuccess={handleFormSuccess}
          onCancel={handleCloseModal}
        />
      </Modal>
    </HotelOwnerLayout>
  );
}
