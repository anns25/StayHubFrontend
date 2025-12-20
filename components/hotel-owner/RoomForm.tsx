'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { createRoom, updateRoom, getRoom, getMyHotels } from '@/lib/api';
import { Plus, Upload, X } from 'lucide-react';

interface RoomFormData {
  hotel: string;
  name: string;
  description: string;
  type: 'single' | 'double' | 'twin' | 'suite' | 'deluxe' | 'presidential';
  price: {
    base: number;
    currency: string;
  };
  capacity: {
    adults: number;
    children: number;
  };
  size: {
    value: number;
    unit: 'sqft' | 'sqm';
  };
  bedType: 'single' | 'double' | 'queen' | 'king' | 'bunk';
  quantity: number;
  available: number;
  amenities: string[];
}

interface RoomFormProps {
  roomId?: string;
  hotelId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface Hotel {
  _id: string;
  name: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export default function RoomForm({ roomId, hotelId, onSuccess, onCancel }: RoomFormProps) {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [formData, setFormData] = useState<RoomFormData>({
    hotel: hotelId || '',
    name: '',
    description: '',
    type: 'double',
    price: {
      base: 0,
      currency: 'USD',
    },
    capacity: {
      adults: 2,
      children: 0,
    },
    size: {
      value: 0,
      unit: 'sqft',
    },
    bedType: 'queen',
    quantity: 1,
    available: 1,
    amenities: [],
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState('');

  useEffect(() => {
    fetchHotels();
    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

  const fetchHotels = async () => {
    try {
      const response = await getMyHotels();
      setHotels(response.data || []);
      if (hotelId && !formData.hotel) {
        setFormData(prev => ({ ...prev, hotel: hotelId }));
      }
    } catch (error: any) {
      console.error('Error fetching hotels:', error);
    }
  };

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const response = await getRoom(roomId!);
      const room = response.data;
      
      setFormData({
        hotel: room.hotel._id || room.hotel,
        name: room.name || '',
        description: room.description || '',
        type: room.type || 'double',
        price: {
          base: room.price?.base || 0,
          currency: room.price?.currency || 'USD',
        },
        capacity: {
          adults: room.capacity?.adults || 2,
          children: room.capacity?.children || 0,
        },
        size: {
          value: room.size?.value || 0,
          unit: room.size?.unit || 'sqft',
        },
        bedType: room.bedType || 'queen',
        quantity: room.quantity || 1,
        available: room.available || room.quantity || 1,
        amenities: room.amenities || [],
      });

      if (room.images && room.images.length > 0) {
        setImagePreviews(room.images.map((img: any) => img.url));
      }
    } catch (error: any) {
      console.error('Error fetching room:', error);
      alert(error.message || 'Failed to fetch room');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('price.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        price: {
          ...prev.price,
          [field]: field === 'base' ? parseFloat(value) || 0 : value,
        },
      }));
    } else if (name.startsWith('capacity.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        capacity: {
          ...prev.capacity,
          [field]: parseInt(value) || 0,
        },
      }));
    } else if (name.startsWith('size.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        size: {
          ...prev.size,
          [field]: field === 'value' ? parseFloat(value) || 0 : value,
        },
      }));
    } else if (name === 'quantity' || name === 'available') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const errors: string[] = [];

      if (images.length + files.length > MAX_FILES) {
        errors.push(`Maximum ${MAX_FILES} images allowed.`);
      }

      files.forEach((file) => {
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          errors.push(`${file.name}: Only JPEG, PNG, GIF, and WebP images are allowed.`);
          return;
        }
        if (file.size > MAX_FILE_SIZE) {
          errors.push(`${file.name}: File size exceeds ${formatFileSize(MAX_FILE_SIZE)}.`);
        }
      });

      if (errors.length > 0) {
        alert('Upload Errors:\n' + errors.join('\n'));
        e.target.value = '';
        return;
      }

      const newImages = [...images, ...files];
      setImages(newImages);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formDataToSend = new FormData();

      formDataToSend.append('hotel', formData.hotel);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('price[base]', formData.price.base.toString());
      formDataToSend.append('price[currency]', formData.price.currency);
      formDataToSend.append('capacity[adults]', formData.capacity.adults.toString());
      formDataToSend.append('capacity[children]', formData.capacity.children.toString());
      formDataToSend.append('size[value]', formData.size.value.toString());
      formDataToSend.append('size[unit]', formData.size.unit);
      formDataToSend.append('bedType', formData.bedType);
      formDataToSend.append('quantity', formData.quantity.toString());
      formDataToSend.append('available', formData.available.toString());

      formData.amenities.forEach((amenity, index) => {
        formDataToSend.append(`amenities[${index}]`, amenity);
      });

      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      if (roomId) {
        await updateRoom(roomId, formDataToSend);
        alert('Room updated successfully!');
      } else {
        await createRoom(formDataToSend);
        alert('Room created successfully!');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error saving room:', error);
      alert(error.message || 'Failed to save room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hotel Selection */}
      <div className="bg-ivory-light rounded-xl shadow-card p-6">
        <h2 className="text-xl font-semibold text-charcoal mb-4">Hotel Selection</h2>
        <Select
          label="Hotel"
          name="hotel"
          value={formData.hotel}
          onChange={handleInputChange}
          options={hotels.map(h => ({ value: h._id, label: h.name }))}
          required
          disabled={!!hotelId || !!roomId}
        />
      </div>

      {/* Basic Information */}
      <div className="bg-ivory-light rounded-xl shadow-card p-6">
        <h2 className="text-xl font-semibold text-charcoal mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Room Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <Select
            label="Room Type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            options={[
              { value: 'single', label: 'Single' },
              { value: 'double', label: 'Double' },
              { value: 'twin', label: 'Twin' },
              { value: 'suite', label: 'Suite' },
              { value: 'deluxe', label: 'Deluxe' },
              { value: 'presidential', label: 'Presidential' },
            ]}
            required
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 bg-ivory-light border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none transition-colors"
            required
          />
        </div>
      </div>

      {/* Pricing & Capacity */}
      <div className="bg-ivory-light rounded-xl shadow-card p-6">
        <h2 className="text-xl font-semibold text-charcoal mb-4">Pricing & Capacity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Base Price"
            name="price.base"
            type="number"
            step="0.01"
            min="0"
            value={formData.price.base}
            onChange={handleInputChange}
            required
          />
          <Select
            label="Currency"
            name="price.currency"
            value={formData.price.currency}
            onChange={handleInputChange}
            options={[
              { value: 'USD', label: 'USD' },
              { value: 'EUR', label: 'EUR' },
              { value: 'GBP', label: 'GBP' },
            ]}
          />
          <Input
            label="Adults Capacity"
            name="capacity.adults"
            type="number"
            min="1"
            value={formData.capacity.adults}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Children Capacity"
            name="capacity.children"
            type="number"
            min="0"
            value={formData.capacity.children}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Room Details */}
      <div className="bg-ivory-light rounded-xl shadow-card p-6">
        <h2 className="text-xl font-semibold text-charcoal mb-4">Room Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Room Size"
            name="size.value"
            type="number"
            step="0.01"
            min="0"
            value={formData.size.value}
            onChange={handleInputChange}
          />
          <Select
            label="Size Unit"
            name="size.unit"
            value={formData.size.unit}
            onChange={handleInputChange}
            options={[
              { value: 'sqft', label: 'Square Feet' },
              { value: 'sqm', label: 'Square Meters' },
            ]}
          />
          <Select
            label="Bed Type"
            name="bedType"
            value={formData.bedType}
            onChange={handleInputChange}
            options={[
              { value: 'single', label: 'Single' },
              { value: 'double', label: 'Double' },
              { value: 'queen', label: 'Queen' },
              { value: 'king', label: 'King' },
              { value: 'bunk', label: 'Bunk' },
            ]}
          />
          <Input
            label="Total Quantity"
            name="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Available Rooms"
            name="available"
            type="number"
            min="0"
            value={formData.available}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Images */}
      <div className="bg-ivory-light rounded-xl shadow-card p-6">
        <h2 className="text-xl font-semibold text-charcoal mb-4">Images</h2>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>File Requirements:</strong> Maximum {MAX_FILES} images, {formatFileSize(MAX_FILE_SIZE)} per file.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <label className={`flex items-center justify-center w-full px-4 py-3 bg-white border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          images.length >= MAX_FILES 
            ? 'border-gray-300 opacity-50 cursor-not-allowed' 
            : 'border-gray-300 hover:border-emerald'
        }`}>
          <Upload className="w-5 h-5 mr-2 text-charcoal-light" />
          <span className="text-sm text-charcoal-light">
            {images.length >= MAX_FILES 
              ? `Maximum ${MAX_FILES} images reached`
              : `Upload Images (${images.length}/${MAX_FILES})`
            }
          </span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
            disabled={images.length >= MAX_FILES}
            className="hidden"
          />
        </label>
      </div>

      {/* Amenities */}
      <div className="bg-ivory-light rounded-xl shadow-card p-6">
        <h2 className="text-xl font-semibold text-charcoal mb-4">Amenities</h2>
        <div className="flex gap-2 mb-4 items-end">
          <div className="flex-1">
            <Input
              label=""
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              placeholder="Add amenity (e.g., WiFi, TV, Mini Bar)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addAmenity();
                }
              }}
            />
          </div>
          <Button
            type="button"
            onClick={addAmenity}
            className="flex items-center justify-center px-4 py-2.5 bg-emerald text-white rounded-lg hover:bg-emerald-dark shadow-sm hover:shadow-md transition-all duration-200 group whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-1.5 group-hover:rotate-90 transition-transform duration-200" />
            <span className="text-sm font-medium">Add</span>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.amenities.map((amenity, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-emerald text-white rounded-full text-sm flex items-center"
            >
              {amenity}
              <button
                type="button"
                onClick={() => removeAmenity(index)}
                className="ml-2 hover:text-red-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel || (() => {})}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : roomId ? 'Update Room' : 'Create Room'}
        </Button>
      </div>
    </form>
  );
}