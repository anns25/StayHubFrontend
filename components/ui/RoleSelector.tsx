'use client';

import { Users, Building2 } from 'lucide-react';

interface RoleOption {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface RoleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function RoleSelector({ value, onChange, error }: RoleSelectorProps) {
  const roles: RoleOption[] = [
    {
      value: 'customer',
      label: 'Customer',
      description: 'Book hotels and manage reservations',
      icon: <Users className="w-6 h-6" />,
    },
    {
      value: 'hotel_owner',
      label: 'Hotel Owner',
      description: 'Manage your hotel properties',
      icon: <Building2 className="w-6 h-6" />,
    },
  ];

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        How will you use this platform?
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => onChange(role.value)}
            className={`relative p-4 rounded-lg border-2 transition-all text-left ${
              value === role.value
                ? 'border-emerald bg-emerald/5 shadow-md'
                : 'border-gray-300 bg-ivory-light hover:border-emerald/50 hover:bg-emerald/5'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  value === role.value
                    ? 'bg-emerald text-white'
                    : 'bg-gray-200 text-gray-600'
                } transition-colors`}
              >
                {role.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`font-semibold mb-1 ${
                    value === role.value ? 'text-emerald' : 'text-charcoal'
                  }`}
                >
                  {role.label}
                </div>
                <div className="text-sm text-gray-600">{role.description}</div>
              </div>
              {value === role.value && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 bg-emerald rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}

