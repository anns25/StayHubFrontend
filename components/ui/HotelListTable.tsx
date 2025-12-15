'use client';

import { Building2, Edit, Eye, Trash2 } from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  location: string;
  status: 'Active' | 'Maintenance' | 'Inactive';
  rooms: number;
  revenue: string;
}

interface HotelListTableProps {
  hotels: Hotel[];
  onEdit?: (hotel: Hotel) => void;
  onView?: (hotel: Hotel) => void;
  onDelete?: (hotel: Hotel) => void;
}

export default function HotelListTable({
  hotels,
  onEdit,
  onView,
  onDelete,
}: HotelListTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-ivory-light rounded-xl shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-charcoal">Hotel List</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hotel Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rooms
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hotels.map((hotel) => (
              <tr key={hotel.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-charcoal">{hotel.name}</div>
                    <div className="text-sm text-charcoal-lighter">{hotel.location}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      hotel.status
                    )}`}
                  >
                    {hotel.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                  {hotel.rooms}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-charcoal">
                  {hotel.revenue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-3">
              <button
                onClick={() => onEdit?.(hotel)}
                className="text-emerald hover:text-emerald-dark transition-colors"
                aria-label="Edit hotel"
              >
                      <Edit className="w-4 h-4" />
                    </button>
              <button
                onClick={() => onView?.(hotel)}
                className="text-charcoal-lighter hover:text-charcoal transition-colors"
                aria-label="View hotel"
              >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete?.(hotel)}
                      className="text-danger hover:text-danger/80 transition-colors"
                      aria-label="Delete hotel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

