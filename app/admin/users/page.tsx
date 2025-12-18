'use client';

import AdminLayout from '@/components/shared/AdminLayout';
import { useState, useEffect } from 'react';
import { getPendingApprovals, approveUser } from '@/lib/api';
import { CheckCircle, XCircle, Mail, User, Clock, Building2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PendingOwner {
    _id: string;
    name: string;
    email: string;
    role: string;
    isApproved: boolean;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [pendingOwners, setPendingOwners] = useState<PendingOwner[]>([]);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingOwners();
    }, []);

    const fetchPendingOwners = async () => {
        try {
            setLoading(true);
            const response = await getPendingApprovals();
            setPendingOwners(response.data?.owners || []);
        } catch (error: any) {
            console.error('Error fetching pending owners:', error);
            alert(error.message || 'Failed to fetch pending owners');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId: string) => {
        if (!confirm('Are you sure you want to approve this hotel owner?')) {
            return;
        }

        try {
            setApproving(userId);
            await approveUser(userId);
            // Remove from list after approval
            setPendingOwners(pendingOwners.filter(owner => owner._id !== userId));
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

    return (
        <AdminLayout activeSidebarItem="Users">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-charcoal mb-2">User Management</h1>
                        <p className="text-charcoal-light">Approve hotel owner registrations</p>
                    </div>
                    <Button onClick={fetchPendingOwners} variant="outline">
                        Refresh
                    </Button>
                </div>

                {/* Pending Owners Section */}
                <div className="bg-ivory-light rounded-xl shadow-card p-6">
                    <div className="flex items-center space-x-2 mb-6">
                        <Clock className="w-5 h-5 text-warning" />
                        <h2 className="text-xl font-semibold text-charcoal">
                            Pending Hotel Owner Approvals ({pendingOwners.length})
                        </h2>
                    </div>

                    {loading ? (
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
                                            {/* Avatar */}
                                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-dark to-emerald rounded-full flex items-center justify-center flex-shrink-0">
                                                <Building2 className="w-6 h-6 text-white" />
                                            </div>

                                            {/* Owner Info */}
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

                                        {/* Actions */}
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
            </div>
        </AdminLayout>
    );
}