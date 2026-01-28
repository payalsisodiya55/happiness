import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/admin/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import apiService from "@/services/api";
import { toast } from "@/hooks/use-toast";
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Filter,
    Eye,
    MessageSquare,
    Gavel,
    Loader2,
    XCircle
} from "lucide-react";

// Types
interface Complaint {
    _id: string;
    booking: {
        _id: string;
        bookingNumber: string;
        tripDetails?: {
            pickup?: { address: string };
            destination?: { address: string };
            date?: string;
        };
    };
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
    };
    driver: {
        _id: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
    };
    category: string;
    description: string;
    status: 'pending' | 'reviewed' | 'resolved';
    createdAt: string;
    resolution?: {
        actionTaken: string;
        penaltyAmount?: number;
        resolvedAt?: string;
    };
    adminNotes?: string;
}

const AdminComplaintManagement = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("pending");
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

    // Resolution Dialog State
    const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
    const [actionTaken, setActionTaken] = useState("none");
    const [penaltyAmount, setPenaltyAmount] = useState("");
    const [penaltyReason, setPenaltyReason] = useState("");
    const [adminNotes, setAdminNotes] = useState("");

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const response = await apiService.getAllComplaints({ status: statusFilter !== 'all' ? statusFilter : undefined });

            if (response.success) {
                // Handle paginated response structure
                const complaintsList = response.data?.docs || response.data || [];
                setComplaints(Array.isArray(complaintsList) ? complaintsList : []);
            }
        } catch (error: any) {
            console.error("Error fetching complaints:", error);
            toast({
                title: "Error",
                description: "Failed to fetch complaints",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [statusFilter]);

    const handleResolve = async () => {
        if (!selectedComplaint) return;

        try {
            const payload: any = {
                actionTaken,
                adminNotes
            };

            if (actionTaken === 'penalty') {
                if (!penaltyAmount) {
                    toast({
                        title: "Error",
                        description: "Please enter penalty amount",
                        variant: "destructive"
                    });
                    return;
                }
                payload.penaltyData = {
                    amount: parseFloat(penaltyAmount),
                    reason: penaltyReason || selectedComplaint.description.substring(0, 50)
                };
            }

            await apiService.resolveComplaint(selectedComplaint._id, payload);

            toast({
                title: "Success",
                description: "Complaint resolved successfully",
                className: "bg-green-500 text-white"
            });

            setIsResolveDialogOpen(false);
            fetchComplaints();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to resolve complaint",
                variant: "destructive"
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
            case 'reviewed':
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Reviewed</Badge>;
            case 'resolved':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-[#212c40]">User Reports & Complaints</h1>
                        <p className="text-gray-500">Manage reported issues from users</p>
                    </div>
                    <Button onClick={fetchComplaints} variant="outline" size="sm">
                        <Loader2 className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pending Reports</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {complaints.filter(c => c.status === 'pending').length}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Resolved This Week</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {complaints.filter(c => c.status === 'resolved').length}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Reports</p>
                                <p className="text-2xl font-bold text-[#29354c]">
                                    {complaints.length}
                                </p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-[#29354c] opacity-50" />
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="reviewed">Reviewed</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex-1">
                        {/* Search input could go here */}
                    </div>
                </div>

                {/* Complaints Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>Issue</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                                        </TableCell>
                                    </TableRow>
                                ) : complaints.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            No complaints found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    complaints.map((complaint) => (
                                        <TableRow key={complaint._id}>
                                            <TableCell className="whitespace-nowrap">
                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                                <div className="text-xs text-gray-500">
                                                    {new Date(complaint.createdAt).toLocaleTimeString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{complaint.user?.firstName} {complaint.user?.lastName}</div>
                                                <div className="text-xs text-gray-500">{complaint.user?.phone}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{complaint.driver?.firstName} {complaint.driver?.lastName}</div>
                                                <div className="text-xs text-gray-500">{complaint.booking?.bookingNumber}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="mb-1 capitalize">{complaint.category.replace(/_/g, ' ')}</Badge>
                                                <p className="text-sm text-gray-600 truncate max-w-[200px]" title={complaint.description}>
                                                    {complaint.description}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(complaint.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setSelectedComplaint(complaint);
                                                        setAdminNotes(complaint.adminNotes || "");
                                                        setActionTaken(complaint.resolution?.actionTaken || "none");
                                                        setIsResolveDialogOpen(true);
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4 text-blue-600" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Resolution Dialog */}
                <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Resolve Complaint</DialogTitle>
                        </DialogHeader>

                        {selectedComplaint && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Complaint Details</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
                                        <div>
                                            <span className="text-gray-500 block">Category</span>
                                            <span className="font-medium capitalize">{selectedComplaint.category.replace(/_/g, ' ')}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Description</span>
                                            <span className="text-gray-700">{selectedComplaint.description}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Booking ID</span>
                                            <span className="font-mono">{selectedComplaint.booking?.bookingNumber}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">Resolution Action</h3>

                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Action Taken</label>
                                        <Select value={actionTaken} onValueChange={setActionTaken} disabled={selectedComplaint.status === 'resolved'}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Action" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">No Action Required</SelectItem>
                                                <SelectItem value="warning">Send Warning</SelectItem>
                                                <SelectItem value="penalty">Apply Penalty</SelectItem>
                                                <SelectItem value="driver_suspended">Suspend Driver</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {actionTaken === 'penalty' && selectedComplaint.status !== 'resolved' && (
                                        <div className="space-y-3 bg-red-50 p-3 rounded-md border border-red-100 animate-in fade-in slide-in-from-top-2">
                                            <div>
                                                <label className="text-xs font-bold text-red-800 uppercase mb-1 block">Penalty Amount (₹)</label>
                                                <Input
                                                    type="number"
                                                    placeholder="Ex: 500"
                                                    value={penaltyAmount}
                                                    onChange={(e) => setPenaltyAmount(e.target.value)}
                                                    className="bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-red-800 uppercase mb-1 block">Reason for Driver</label>
                                                <Input
                                                    type="text"
                                                    placeholder="Ex: Rude behavior with customer"
                                                    value={penaltyReason}
                                                    onChange={(e) => setPenaltyReason(e.target.value)}
                                                    className="bg-white"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Admin Notes</label>
                                        <Textarea
                                            placeholder="Internal notes about this resolution..."
                                            value={adminNotes}
                                            onChange={(e) => setAdminNotes(e.target.value)}
                                            rows={3}
                                            disabled={selectedComplaint.status === 'resolved'}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="mt-6">
                            <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>Close</Button>
                            {selectedComplaint?.status !== 'resolved' && (
                                <Button onClick={handleResolve} className="bg-[#f48432] hover:bg-[#d9732a]">
                                    Resolve Complaint
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default AdminComplaintManagement;
