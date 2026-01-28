import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopNavigation from "@/components/TopNavigation";
import UserBottomNavigation from "@/components/UserBottomNavigation";
import { useUserAuth } from "@/contexts/UserAuthContext";
import apiService from "@/services/api";
import { formatDate } from "@/lib/utils";

const ComplaintHistory = () => {
    const { isAuthenticated } = useUserAuth();
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                setIsLoading(true);
                const response = await apiService.getMyComplaints();
                if (response.success) {
                    setComplaints(response.data || []);
                } else {
                    setError("Failed to fetch complaints");
                }
            } catch (err) {
                console.error("Error fetching complaints:", err);
                setError("An error occurred while fetching your reports.");
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchComplaints();
        }
    }, [isAuthenticated]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
            case 'reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'resolved': return <CheckCircle className="w-4 h-4" />;
            case 'reviewed': return <Clock className="w-4 h-4" />;
            default: return <AlertTriangle className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="hidden md:block">
                <TopNavigation />
            </div>

            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10 p-4 flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-gray-100 md:hidden"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-lg font-bold text-[#29354c]">My Reports</h1>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 pb-24 md:max-w-4xl md:mx-auto md:w-full">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-500">
                        {error}
                    </div>
                ) : complaints.length > 0 ? (
                    <div className="space-y-4">
                        {complaints.map((complaint) => (
                            <Card key={complaint._id} className="p-4 border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            #{complaint.booking?.bookingNumber}
                                        </span>
                                        <h3 className="font-semibold text-gray-900 mt-1 capitalize">
                                            {complaint.category.replace(/_/g, ' ')}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {formatDate(complaint.createdAt)}
                                        </p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border ${getStatusColor(complaint.status)}`}>
                                        {getStatusIcon(complaint.status)}
                                        <span className="capitalize">{complaint.status}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 mb-3">
                                    <span className="font-medium text-gray-900 block mb-1">Description:</span>
                                    {complaint.description}
                                </div>

                                {complaint.status === 'resolved' && complaint.resolution && (
                                    <div className="bg-green-50 p-3 rounded-lg text-sm text-green-800 border border-green-100">
                                        <span className="font-bold flex items-center gap-1.5 mb-1">
                                            <CheckCircle className="w-3.5 h-3.5" /> Resolution:
                                        </span>
                                        {complaint.adminNotes || "Issue has been resolved."}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No Reports Found</h3>
                        <p className="text-gray-500 text-sm">You haven't reported any issues with your trips.</p>
                    </div>
                )}
            </div>

            <UserBottomNavigation />
        </div>
    );
};

export default ComplaintHistory;
