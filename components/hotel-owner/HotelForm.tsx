'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { createHotel, updateHotel, getHotel } from '@/lib/api';
import { Plus, Upload, X } from 'lucide-react';

interface HotelFormData {
    name: string;
    description: string;
    category: 'budget' | 'mid-range' | 'luxury' | 'boutique' | 'resort';
    location: {
        address: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    };
    amenities: string[];
    policies: {
        checkIn: string;
        checkOut: string;
        cancellation: string;
        pets: boolean;
        smoking: boolean;
        ageRestriction: number;
    };
    contact: {
        phone: string;
        email: string;
        website: string;
    };
}

interface HotelFormProps {
    hotelId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const MAX_FILES = 10;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export default function HotelForm({ hotelId, onSuccess, onCancel }: HotelFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<HotelFormData>({
        name: '',
        description: '',
        category: 'mid-range',
        location: {
            address: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
            coordinates: {
                latitude: 0,
                longitude: 0,
            },
        },
        amenities: [],
        policies: {
            checkIn: '15:00',
            checkOut: '11:00',
            cancellation: '',
            pets: false,
            smoking: false,
            ageRestriction: 0,
        },
        contact: {
            phone: '',
            email: '',
            website: '',
        },
    });
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [amenityInput, setAmenityInput] = useState('');

    useEffect(() => {
        if (hotelId) {
            fetchHotel();
        }
    }, [hotelId]);

    const fetchHotel = async () => {
        try {
            const response = await getHotel(hotelId!);
            const hotel = response.data;
            setFormData({
                name: hotel.name || '',
                description: hotel.description || '',
                category: hotel.category || 'mid-range',
                location: hotel.location || formData.location,
                amenities: hotel.amenities || [],
                policies: hotel.policies || formData.policies,
                contact: hotel.contact || formData.contact,
            });
            if (hotel.images) {
                setImagePreviews(hotel.images.map((img: any) => img.url));
            }
        } catch (error: any) {
            console.error('Error fetching hotel:', error);
            alert(error.message || 'Failed to fetch hotel');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('location.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    [field]: value,
                },
            }));
        } else if (name.startsWith('policies.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                policies: {
                    ...prev.policies,
                    [field]: field === 'pets' || field === 'smoking' ? (value === 'true') :
                        field === 'ageRestriction' ? parseInt(value) || 0 : value,
                },
            }));
        } else if (name.startsWith('contact.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                contact: {
                    ...prev.contact,
                    [field]: value,
                },
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

            // Check total file count
            if (images.length + files.length > MAX_FILES) {
                errors.push(`Maximum ${MAX_FILES} images allowed. You already have ${images.length} image(s).`);
            }

            // Validate each file
            files.forEach((file, index) => {
                // Check file type
                if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                    errors.push(`${file.name}: Only JPEG, PNG, GIF, and WebP images are allowed.`);
                    return;
                }

                // Check file size
                if (file.size > MAX_FILE_SIZE) {
                    errors.push(`${file.name}: File size (${formatFileSize(file.size)}) exceeds maximum allowed size of ${formatFileSize(MAX_FILE_SIZE)}.`);
                    return;
                }
            });

            // Show errors if any
            if (errors.length > 0) {
                alert('Upload Errors:\n' + errors.join('\n'));
                e.target.value = ''; // Clear the input
                return;
            }

            // If validation passes, add files
            const newImages = [...images, ...files];
            setImages(newImages);
            
            // Create previews for new files only
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews([...imagePreviews, ...newPreviews]);
        }
        
        // Clear the input so the same file can be selected again if needed
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

            // Add form fields
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('location[address]', formData.location.address);
            formDataToSend.append('location[city]', formData.location.city);
            formDataToSend.append('location[state]', formData.location.state);
            formDataToSend.append('location[country]', formData.location.country);
            formDataToSend.append('location[zipCode]', formData.location.zipCode);

            // Add amenities
            formData.amenities.forEach((amenity, index) => {
                formDataToSend.append(`amenities[${index}]`, amenity);
            });

            // Add policies
            formDataToSend.append('policies[checkIn]', formData.policies.checkIn);
            formDataToSend.append('policies[checkOut]', formData.policies.checkOut);
            formDataToSend.append('policies[cancellation]', formData.policies.cancellation);
            formDataToSend.append('policies[pets]', formData.policies.pets.toString());
            formDataToSend.append('policies[smoking]', formData.policies.smoking.toString());
            formDataToSend.append('policies[ageRestriction]', formData.policies.ageRestriction.toString());

            // Add contact
            formDataToSend.append('contact[phone]', formData.contact.phone);
            formDataToSend.append('contact[email]', formData.contact.email);
            formDataToSend.append('contact[website]', formData.contact.website);

            // Add images
            images.forEach((image) => {
                formDataToSend.append('images', image);
            });

            if (hotelId) {
                await updateHotel(hotelId, formDataToSend);
                alert('Hotel updated successfully!');
            } else {
                await createHotel(formDataToSend);
                alert('Hotel created successfully!');
            }

            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            console.error('Error saving hotel:', error);
            alert(error.message || 'Failed to save hotel');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-ivory-light rounded-xl shadow-card p-6">
                <h2 className="text-xl font-semibold text-charcoal mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Hotel Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                    <Select
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        options={[
                            { value: 'budget', label: 'Budget' },
                            { value: 'mid-range', label: 'Mid-Range' },
                            { value: 'luxury', label: 'Luxury' },
                            { value: 'boutique', label: 'Boutique' },
                            { value: 'resort', label: 'Resort' },
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

            {/* Location */}
            <div className="bg-ivory-light rounded-xl shadow-card p-6">
                <h2 className="text-xl font-semibold text-charcoal mb-4">Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Address"
                        name="location.address"
                        value={formData.location.address}
                        onChange={handleInputChange}
                        required
                    />
                    <Input
                        label="City"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleInputChange}
                        required
                    />
                    <Input
                        label="State"
                        name="location.state"
                        value={formData.location.state}
                        onChange={handleInputChange}
                        required
                    />
                    <Input
                        label="Country"
                        name="location.country"
                        value={formData.location.country}
                        onChange={handleInputChange}
                        required
                    />
                    <Input
                        label="Zip Code"
                        name="location.zipCode"
                        value={formData.location.zipCode}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Coordinates will be automatically calculated from the address information.
                    </p>
                </div>
            </div>

            {/* Images */}
            <div className="bg-ivory-light rounded-xl shadow-card p-6">
                <h2 className="text-xl font-semibold text-charcoal mb-4">Images</h2>
                
                {/* File size info */}
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>File Requirements:</strong> Maximum {MAX_FILES} images, {formatFileSize(MAX_FILE_SIZE)} per file. 
                        Supported formats: JPEG, PNG, GIF, WebP
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {imagePreviews.map((preview, index) => {
                        const file = images[index];
                        const fileSize = file ? formatFileSize(file.size) : '';
                        
                        return (
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
                                {file && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                                        {fileSize}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                
                {images.length >= MAX_FILES && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            Maximum number of images ({MAX_FILES}) reached. Remove an image to add more.
                        </p>
                    </div>
                )}
                
                <label className={`flex items-center justify-center w-full px-4 py-3 bg-white border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    images.length >= MAX_FILES 
                        ? 'border-gray-300 opacity-50 cursor-not-allowed' 
                        : 'border-gray-300 hover:border-emerald'
                }`}>
                    <Upload className="w-5 h-5 mr-2 text-charcoal-light" />
                    <span className="text-sm text-charcoal-light">
                        {images.length >= MAX_FILES 
                            ? `Maximum ${MAX_FILES} images reached`
                            : `Upload Images (${images.length}/${MAX_FILES}) - Max ${formatFileSize(MAX_FILE_SIZE)} each`
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
                            placeholder="Add amenity (e.g., WiFi, Pool, Gym)"
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

            {/* Policies */}
            <div className="bg-ivory-light rounded-xl shadow-card p-6">
                <h2 className="text-xl font-semibold text-charcoal mb-4">Policies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Check-in Time"
                        name="policies.checkIn"
                        value={formData.policies.checkIn}
                        onChange={handleInputChange}
                        placeholder="15:00"
                    />
                    <Input
                        label="Check-out Time"
                        name="policies.checkOut"
                        value={formData.policies.checkOut}
                        onChange={handleInputChange}
                        placeholder="11:00"
                    />
                    <Input
                        label="Cancellation Policy"
                        name="policies.cancellation"
                        value={formData.policies.cancellation}
                        onChange={handleInputChange}
                    />
                    <Input
                        label="Age Restriction"
                        name="policies.ageRestriction"
                        type="number"
                        value={formData.policies.ageRestriction}
                        onChange={handleInputChange}
                    />
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="policies.pets"
                                checked={formData.policies.pets}
                                onChange={(e) => handleInputChange({
                                    target: { name: 'policies.pets', value: e.target.checked.toString() }
                                } as any)}
                                className="mr-2"
                            />
                            <span className="text-sm text-charcoal">Pets Allowed</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="policies.smoking"
                                checked={formData.policies.smoking}
                                onChange={(e) => handleInputChange({
                                    target: { name: 'policies.smoking', value: e.target.checked.toString() }
                                } as any)}
                                className="mr-2"
                            />
                            <span className="text-sm text-charcoal">Smoking Allowed</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Contact */}
            <div className="bg-ivory-light rounded-xl shadow-card p-6">
                <h2 className="text-xl font-semibold text-charcoal mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        label="Phone"
                        name="contact.phone"
                        value={formData.contact.phone}
                        onChange={handleInputChange}
                    />
                    <Input
                        label="Email"
                        name="contact.email"
                        type="email"
                        value={formData.contact.email}
                        onChange={handleInputChange}
                    />
                    <Input
                        label="Website"
                        name="contact.website"
                        type="url"
                        value={formData.contact.website}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel || (() => { })}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : hotelId ? 'Update Hotel' : 'Create Hotel'}
                </Button>
            </div>
        </form>
    );
}