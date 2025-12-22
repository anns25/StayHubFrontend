'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { updateProfile, getCurrentUser } from '@/lib/api';
import { Upload, X, User } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

interface ProfileFormData {
  name: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function ProfileForm() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [currentProfileImage, setCurrentProfileImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setFetching(true);
      const response = await getCurrentUser();
      const user = response.user;
      
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || '',
        },
      });
      
      if (user.profileImage) {
        setCurrentProfileImage(user.profileImage);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      alert(error.message || 'Failed to fetch profile');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        profileImage: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)',
      }));
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        profileImage: 'Image size must be less than 2MB',
      }));
      return;
    }

    setProfileImage(file);
    setErrors((prev) => ({ ...prev, profileImage: '' }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.name.trim()) {
      setErrors((prev) => ({ ...prev, name: 'Name is required' }));
      return;
    }

    try {
      setLoading(true);

      const submitFormData = new FormData();
      submitFormData.append('name', formData.name.trim());
      
      if (formData.phone) {
        submitFormData.append('phone', formData.phone.trim());
      }

      // Append address as JSON string
      submitFormData.append('address', JSON.stringify(formData.address));

      // Append profile image if selected
      if (profileImage) {
        submitFormData.append('profileImage', profileImage);
      }

      const response = await updateProfile(submitFormData);

      // Update Redux store with new user data
      if (response.user) {
        dispatch(setUser(response.user));
      }

      alert('Profile updated successfully!');
      
      // Refresh profile data
      await fetchProfile();
      removeImage();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
        
        <div className="flex items-center space-x-6">
          {/* Current/Preview Image */}
          <div className="relative">
            {profileImagePreview ? (
              <div className="relative">
                <img
                  src={profileImagePreview}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-emerald"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : currentProfileImage ? (
              <img
                src={currentProfileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-emerald"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald to-emerald-dark flex items-center justify-center border-2 border-emerald">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex-1">
            <label className="inline-flex items-center px-4 py-2 bg-emerald text-white rounded-lg cursor-pointer hover:bg-emerald-dark transition-colors">
              <Upload className="w-5 h-5 mr-2" />
              <span>Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">
              JPG, PNG, GIF or WebP. Max size: 2MB
            </p>
            {errors.profileImage && (
              <p className="mt-1 text-sm text-red-500">{errors.profileImage}</p>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            error={errors.phone}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
        
        <div className="space-y-4">
          <Input
            label="Street Address"
            type="text"
            name="address.street"
            value={formData.address.street}
            onChange={handleInputChange}
            error={errors['address.street']}
            placeholder="123 Main Street"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleInputChange}
              error={errors['address.city']}
            />

            <Input
              label="State/Province"
              type="text"
              name="address.state"
              value={formData.address.state}
              onChange={handleInputChange}
              error={errors['address.state']}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="ZIP/Postal Code"
              type="text"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleInputChange}
              error={errors['address.zipCode']}
            />

            <Input
              label="Country"
              type="text"
              name="address.country"
              value={formData.address.country}
              onChange={handleInputChange}
              error={errors['address.country']}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
