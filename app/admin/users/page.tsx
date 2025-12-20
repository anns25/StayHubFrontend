'use client';

import AdminLayout from '@/components/shared/AdminLayout';
import { useState, useEffect } from 'react';
import { getPendingApprovals, approveUser, getUserStatistics, getAllUsers } from '@/lib/api';
import { CheckCircle, XCircle, Mail, User, Clock, Building2, Shield, TrendingUp, Search, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';

interface PendingOwner {
    _id: string;
    name: string;
    email: string;
    role: string;
    isApproved: boolean;
    createdAt: string;
}

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: 'customer' | 'hotel_owner' | 'admin';
    isApproved: boolean;
    createdAt: string;
}

interface UserStatistics {
    totals: {
        all: number;
        customers: number;
        owners: number;
        admins: number;
    };
    approvals: {
        pending: number;
        approved: number;
    };
    registrations: {
        last7Days: number;
        last30Days: number;
    };
    verification: {
        verified: number;
        unverified: number;
    };
    authentication: {
        oauth: number;
        email: number;
    };
    trend: Array<{ _id: string; count: number }>;
}

type TabType = 'pending' | 'all' | 'statistics';

export default function AdminUsersPage() {
    const [activeTab, setActiveTab] = useState<TabType>('pending');

    // Pending Approvals State
    const [pendingOwners, setPendingOwners] = useState<PendingOwner[]>([]);
    const [pendingLoading, setPendingLoading] = useState(true);
    const [approving, setApproving] = useState<string | null>(null);

    // All Users State
    const [allUsers, setAllUsers] = useState<UserData[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 0,
        page: 1,
        limit: 20,
    });

    // Statistics State
    const [statistics, setStatistics] = useState<UserStatistics | null>(null);
    const [statsLoading, setStatsLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'pending') {
            fetchPendingOwners();
        } else if (activeTab === 'all') {
            fetchAllUsers();
        } else if (activeTab === 'statistics') {
            fetchStatistics();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'all') {
            // Debounce search
            const timer = setTimeout(() => {
                fetchAllUsers();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [roleFilter, statusFilter, searchQuery, currentPage]);

    const fetchPendingOwners = async () => {
        try {
            setPendingLoading(true);
            const response = await getPendingApprovals();
            setPendingOwners(response.data?.owners || []);
        } catch (error: any) {
            console.error('Error fetching pending owners:', error);
            alert(error.message || 'Failed to fetch pending owners');
        } finally {
            setPendingLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        try {
            setUsersLoading(true);
            const params: any = {
                page: currentPage,
                limit: 20,
            };
            if (roleFilter !== 'all') params.role = roleFilter;
            if (statusFilter !== 'all') params.status = statusFilter;
            if (searchQuery) params.search = searchQuery;

            const response = await getAllUsers(params);
            setAllUsers(response.data?.users || []);
            setPagination(response.data?.pagination || pagination);
        } catch (error: any) {
            console.error('Error fetching users:', error);
            alert(error.message || 'Failed to fetch users');
        } finally {
            setUsersLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            setStatsLoading(true);
            const response = await getUserStatistics();
            setStatistics(response.data);
        } catch (error: any) {
            console.error('Error fetching statistics:', error);
            alert(error.message || 'Failed to fetch statistics');
        } finally {
            setStatsLoading(false);
        }
    };

    const handleApprove = async (userId: string) => {
        if (!confirm('Are you sure you want to approve this hotel owner?')) {
            return;
        }

        try {
            setApproving(userId);
            await approveUser(userId);
            // Refresh both lists
            await fetchPendingOwners();
            if (activeTab === 'all') {
                await fetchAllUsers();
            }
            alert('Hotel owner approved successfully!');
        } catch (error: any) {
            console.error('Error approving user:', error);
            alert(error.message || 'Failed to approve user');
        } finally {
            setApproving(null);
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-700';
            case 'hotel_owner':
                return 'bg-blue-100 text-blue-700';
            case 'customer':
                return 'bg-emerald-100 text-emerald-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusBadge = (isApproved: boolean) => {
        if (isApproved) {
            return (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    Approved
                </span>
            );
        }
        return (
            <span className="px-2 py-1 bg-warning-light text-warning rounded-full text-xs font-medium">
                Pending
            </span>
        );
    };

    return (
        <AdminLayout activeSidebarItem="Users">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-charcoal mb-2">User Management</h1>
                        <p className="text-charcoal-light">Manage users, approvals, and view statistics</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'pending'
                                ? 'border-emerald text-emerald'
                                : 'border-transparent text-charcoal-light hover:text-charcoal hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>Pending Approvals</span>
                                {pendingOwners.length > 0 && (
                                    <span className="bg-warning text-white rounded-full px-2 py-0.5 text-xs">
                                        {pendingOwners.length}
                                    </span>
                                )}
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'all'
                                ? 'border-emerald text-emerald'
                                : 'border-transparent text-charcoal-light hover:text-charcoal hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>All Users</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('statistics')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'statistics'
                                ? 'border-emerald text-emerald'
                                : 'border-transparent text-charcoal-light hover:text-charcoal hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="w-4 h-4" />
                                <span>Statistics</span>
                            </div>
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'pending' && (
                    <div className="bg-ivory-light rounded-xl shadow-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-warning" />
                                <h2 className="text-xl font-semibold text-charcoal">
                                    Pending Hotel Owner Approvals ({pendingOwners.length})
                                </h2>
                            </div>
                            <Button onClick={fetchPendingOwners} variant="outline">
                                Refresh
                            </Button>
                        </div>

                        {pendingLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald mx-auto mb-4"></div>
                                <p className="text-charcoal-light">Loading pending owners...</p>
                            </div>
                        ) : pendingOwners.length === 0 ? (
                            <div className="text-center py-12">
                                <CheckCircle className="w-16 h-16 text-emerald mx-auto mb-4 opacity-50" />
                                <p className="text-charcoal-light text-lg">No pending approvals</p>
                                <p className="text-charcoal-light text-sm mt-2">All hotel owners have been approved</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingOwners.map((owner) => (
                                    <div
                                        key={owner._id}
                                        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex md:flex-row flex-col md:items-start items-start md:justify-between justify-between gap-4">
                                            <div className="flex items-start space-x-4 flex-1">
                                                <div className="w-12 h-12 bg-gradient-to-r from-emerald-dark to-emerald rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Building2 className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-charcoal">{owner.name}</h3>
                                                        <span className="px-2 py-1 bg-warning-light text-warning rounded-full text-xs font-medium">
                                                            Pending
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1 text-sm text-charcoal-light">
                                                        <div className="flex items-center space-x-2">
                                                            <Mail className="w-4 h-4" />
                                                            <span>{owner.email}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <User className="w-4 h-4" />
                                                            <span>Hotel Owner</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Clock className="w-4 h-4" />
                                                            <span>Registered: {formatDate(owner.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3 md:ml-4 mt-4 md:mt-0 w-full md:w-auto">
                                                <button
                                                    onClick={() => handleApprove(owner._id)}
                                                    disabled={approving === owner._id}
                                                    className={`
                                                        group relative flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold
                                                        transition-all duration-200 transform w-full md:w-auto
                                                        ${approving === owner._id
                                                            ? 'bg-emerald/70 cursor-not-allowed'
                                                            : 'bg-gradient-to-r from-emerald-dark to-emerald hover:from-emerald hover:to-emerald-dark shadow-md hover:shadow-lg hover:scale-105 active:scale-100'
                                                        }
                                                        text-white
                                                    `}
                                                >
                                                    {approving === owner._id ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                            <span>Approving...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                            <span>Approve Owner</span>
                                                            <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
                )}

                {activeTab === 'all' && (
                    <div className="bg-ivory-light rounded-xl shadow-card p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-charcoal mb-4">All Users</h2>

                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal-light z-10" />
                                        <Input
                                            label=""
                                            type="text"
                                            placeholder="Search by name or email..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Select
                                    label="Role"
                                    options={[
                                        { value: 'all', label: 'All Roles' },
                                        { value: 'customer', label: 'Customer' },
                                        { value: 'hotel_owner', label: 'Hotel Owner' },
                                        { value: 'admin', label: 'Admin' },
                                    ]}
                                    value={roleFilter}
                                    onChange={(e) => {
                                        setRoleFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                                <Select
                                    label="Status"
                                    options={[
                                        { value: 'all', label: 'All Status' },
                                        { value: 'approved', label: 'Approved' },
                                        { value: 'pending', label: 'Pending' },
                                    ]}
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </div>

                        {usersLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald mx-auto mb-4"></div>
                                <p className="text-charcoal-light">Loading users...</p>
                            </div>
                        ) : allUsers.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-charcoal-light mx-auto mb-4 opacity-50" />
                                <p className="text-charcoal-light text-lg">No users found</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Name</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Email</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Role</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Status</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Registered</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allUsers.map((user) => (
                                                <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-dark to-emerald rounded-full flex items-center justify-center flex-shrink-0">
                                                                <span className="text-white font-semibold text-sm">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <span className="font-medium text-charcoal">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-charcoal-light">{user.email}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                            {user.role === 'hotel_owner' ? 'Hotel Owner' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">{getStatusBadge(user.isApproved)}</td>
                                                    <td className="py-4 px-4 text-sm text-charcoal-light">{formatDate(user.createdAt)}</td>
                                                    <td className="py-4 px-4">
                                                        {!user.isApproved && user.role === 'hotel_owner' && (
                                                            <button
                                                                onClick={() => handleApprove(user._id)}
                                                                disabled={approving === user._id}
                                                                className="text-emerald hover:text-emerald-dark font-medium text-sm"
                                                            >
                                                                {approving === user._id ? 'Approving...' : 'Approve'}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {pagination.pages > 1 && (
                                    <div className="flex items-center justify-between mt-6">
                                        <p className="text-sm text-charcoal-light">
                                            Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} users
                                        </p>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                                                disabled={currentPage === pagination.pages}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'statistics' && (
                    <div className="bg-ivory-light rounded-xl shadow-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-charcoal">User Statistics</h2>
                            <Button onClick={fetchStatistics} variant="outline">
                                Refresh
                            </Button>
                        </div>

                        {statsLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald mx-auto mb-4"></div>
                                <p className="text-charcoal-light">Loading statistics...</p>
                            </div>
                        ) : statistics ? (
                            <div className="space-y-6">
                                {/* Total Users by Role */}
                                <div>
                                    <h3 className="text-lg font-semibold text-charcoal mb-4">Users by Role</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-charcoal-light">Total Users</p>
                                                    <p className="text-2xl font-bold text-charcoal mt-1">{statistics.totals.all}</p>
                                                </div>
                                                <Users className="w-8 h-8 text-emerald" />
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-charcoal-light">Customers</p>
                                                    <p className="text-2xl font-bold text-charcoal mt-1">{statistics.totals.customers}</p>
                                                </div>
                                                <User className="w-8 h-8 text-blue-500" />
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-charcoal-light">Hotel Owners</p>
                                                    <p className="text-2xl font-bold text-charcoal mt-1">{statistics.totals.owners}</p>
                                                </div>
                                                <Building2 className="w-8 h-8 text-purple-500" />
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-charcoal-light">Admins</p>
                                                    <p className="text-2xl font-bold text-charcoal mt-1">{statistics.totals.admins}</p>
                                                </div>
                                                <Shield className="w-8 h-8 text-orange-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Approval Status */}
                                <div>
                                    <h3 className="text-lg font-semibold text-charcoal mb-4">Approval Status</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-charcoal-light">Pending Approvals</p>
                                                    <p className="text-2xl font-bold text-warning mt-1">{statistics.approvals.pending}</p>
                                                </div>
                                                <Clock className="w-8 h-8 text-warning" />
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-charcoal-light">Approved Owners</p>
                                                    <p className="text-2xl font-bold text-emerald mt-1">{statistics.approvals.approved}</p>
                                                </div>
                                                <CheckCircle className="w-8 h-8 text-emerald" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Registrations */}
                                <div>
                                    <h3 className="text-lg font-semibold text-charcoal mb-4">Recent Registrations</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-charcoal-light">Last 7 Days</p>
                                                    <p className="text-2xl font-bold text-charcoal mt-1">{statistics.registrations.last7Days}</p>
                                                </div>
                                                <TrendingUp className="w-8 h-8 text-blue-500" />
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-charcoal-light">Last 30 Days</p>
                                                    <p className="text-2xl font-bold text-charcoal mt-1">{statistics.registrations.last30Days}</p>
                                                </div>
                                                <TrendingUp className="w-8 h-8 text-emerald" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Verification & Authentication */}
                                <div>
                                    <h3 className="text-lg font-semibold text-charcoal mb-4">Verification & Authentication</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-charcoal-light">Verified Users</p>
                                                    <p className="text-2xl font-bold text-emerald mt-1">{statistics.verification.verified}</p>
                                                </div>
                                                <CheckCircle className="w-8 h-8 text-emerald" />
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-charcoal-light">OAuth Users</p>
                                                    <p className="text-2xl font-bold text-charcoal mt-1">{statistics.authentication.oauth}</p>
                                                </div>
                                                <Shield className="w-8 h-8 text-purple-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-charcoal-light">No statistics available</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}