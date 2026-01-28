import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/admin/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import adminApi, { adminDrivers } from "@/services/adminApi";
import { toast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  DollarSign,
  Users,
  Calendar,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw
} from "lucide-react";

interface Penalty {
  _id: string;
  driver: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  type: string;
  amount: number;
  reason: string;
  booking?: {
    _id: string;
    bookingNumber: string;
  };
  status: 'active' | 'waived' | 'paid';
  appliedAt: string;
  waivedAt?: string;
}

interface PenaltyStats {
  summary: {
    totalPenalties: number;
    totalAmount: number;
    activePenalties: number;
    paidPenalties: number;
    waivedPenalties: number;
  };
  byType: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
}

const AdminPenaltyManagement = () => {
  const navigate = useNavigate();
  // const { admin } = useAdminAuth(); // specific admin details not needed for this view

  // State management
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [stats, setStats] = useState<PenaltyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedPenalty, setSelectedPenalty] = useState<Penalty | null>(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [showWaiveDialog, setShowWaiveDialog] = useState(false);
  const [waiveReason, setWaiveReason] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Apply penalty form
  const [applyForm, setApplyForm] = useState({
    driverEmail: "",
    driverId: "",
    driverName: "",
    type: "",
    amount: "",
    reason: "",
    bookingId: ""
  });

  // Penalty types mapping
  const penaltyTypes = {
    'cancellation_12h_before': 'Cancellation 12h before',
    'cancellation_12h_within': 'Cancellation within 12h',
    'cancellation_3h_within': 'Cancellation within 3h',
    'cancellation_30min_after_acceptance': 'Cancellation within 30min',
    'wrong_car_assigned': 'Wrong car assigned',
    'wrong_driver_assigned': 'Wrong driver assigned',
    'cng_car_no_carrier': 'CNG car no carrier',
    'journey_not_completed_in_app': 'Journey not completed in app',
    'car_not_clean': 'Car not clean',
    'car_not_good_condition': 'Car in poor condition',
    'driver_misbehaved': 'Driver misbehaved'
  };

  // Mock Data
  const MOCK_STATS: PenaltyStats = {
    summary: {
      totalPenalties: 128,
      totalAmount: 45600,
      activePenalties: 12,
      paidPenalties: 98,
      waivedPenalties: 18
    },
    byType: [
      { _id: 'cancellation_12h_before', count: 45, totalAmount: 22500 },
      { _id: 'wrong_car_assigned', count: 12, totalAmount: 6000 }
    ]
  };

  const MOCK_PENALTIES: Penalty[] = [
    {
      _id: "p1",
      driver: {
        _id: "d1",
        firstName: "Rajesh",
        lastName: "Kumar",
        phone: "+91 98765 43210"
      },
      type: "cancellation_12h_within",
      amount: 500,
      reason: "Cancelled trip suddenly due to personal vehicle issue",
      booking: {
        _id: "b1",
        bookingNumber: "BK-2024-001"
      },
      status: 'active',
      appliedAt: "2024-03-10T14:30:00Z"
    },
    {
      _id: "p2",
      driver: {
        _id: "d2",
        firstName: "Suresh",
        lastName: "Singh",
        phone: "+91 98765 43211"
      },
      type: "car_not_clean",
      amount: 200,
      reason: "Customer reported dirty interiors",
      booking: {
        _id: "b2",
        bookingNumber: "BK-2024-045"
      },
      status: 'paid',
      appliedAt: "2024-03-08T09:15:00Z"
    },
    {
      _id: "p3",
      driver: {
        _id: "d3",
        firstName: "Amit",
        lastName: "Verma",
        phone: "+91 98765 43212"
      },
      type: "driver_misbehaved",
      amount: 1000,
      reason: "Rude behavior reported by passenger",
      status: 'active',
      appliedAt: "2024-03-12T16:45:00Z"
    },
    {
      _id: "p4",
      driver: {
        _id: "d4",
        firstName: "Vikram",
        lastName: "Malhotra",
        phone: "+91 98765 43213"
      },
      type: "wrong_car_assigned",
      amount: 500,
      reason: "Brought WagonR instead of Dzire",
      booking: {
        _id: "b4",
        bookingNumber: "BK-2024-089"
      },
      status: 'waived',
      appliedAt: "2024-03-05T11:20:00Z",
      waivedAt: "2024-03-06T10:00:00Z"
    },
    {
      _id: "p5",
      driver: {
        _id: "d5",
        firstName: "Rahul",
        lastName: "Sharma",
        phone: "+91 98765 43214"
      },
      type: "cancellation_30min_after_acceptance",
      amount: 300,
      reason: "Cancelled after accepting the ride",
      status: 'paid',
      appliedAt: "2024-03-11T08:30:00Z"
    }
  ];

  // Fetch penalties from backend
  const fetchPenalties = async () => {
    try {
      setLoading(true);

      const params: any = {
        page: 1,
        limit: 100
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (typeFilter !== "all") {
        params.type = typeFilter;
      }

      const response = await adminApi.get('/penalties', { params });

      if (response.data.success) {
        let filtered = response.data.data.docs || [];

        // Apply search filter on frontend
        if (searchTerm) {
          const lowerTerm = searchTerm.toLowerCase();
          filtered = filtered.filter((p: Penalty) =>
            p.driver.firstName.toLowerCase().includes(lowerTerm) ||
            p.driver.lastName.toLowerCase().includes(lowerTerm) ||
            p.reason.toLowerCase().includes(lowerTerm)
          );
        }

        setPenalties(filtered);
      }
    } catch (error: any) {
      console.error("Error fetching penalties:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch penalties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch penalty statistics from backend
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await adminApi.get('/penalties/stats');

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching penalty stats:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch statistics",
        variant: "destructive",
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Find driver by email using backend API
  const findDriverByEmail = async (email: string) => {
    try {
      const response = await adminDrivers.getAll({ search: email, limit: 1 });
      if (response.data.success && response.data.data.docs.length > 0) {
        return response.data.data.docs[0];
      }
      return null;
    } catch (error) {
      console.error("Error finding driver:", error);
      return null;
    }
  };

  // Apply penalty using backend API
  const handleApplyPenalty = async () => {
    try {
      if (!applyForm.driverEmail || !applyForm.type || !applyForm.amount) return;

      // Find driver by email first
      const driver = await findDriverByEmail(applyForm.driverEmail);
      if (!driver) {
        toast({
          title: "Error",
          description: "Driver not found with this email",
          variant: "destructive",
        });
        return;
      }

      const payload: any = {
        type: applyForm.type,
        amount: parseFloat(applyForm.amount),
        reason: applyForm.reason || `Penalty: ${penaltyTypes[applyForm.type as keyof typeof penaltyTypes]}`
      };

      if (applyForm.bookingId) {
        payload.bookingId = applyForm.bookingId;
      }

      await adminApi.post(`/drivers/${driver._id}/penalty`, payload);

      toast({
        title: "Success",
        description: `Penalty applied successfully to ${driver.firstName} ${driver.lastName}`,
      });

      setShowApplyDialog(false);
      setApplyForm({
        driverEmail: "",
        driverId: "",
        driverName: "",
        type: "",
        amount: "",
        reason: "",
        bookingId: ""
      });

      // Refresh list and stats
      fetchPenalties();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to apply penalty",
        variant: "destructive",
      });
    }
  };

  // Waive penalty using backend API
  const handleWaivePenalty = async () => {
    if (!selectedPenalty || !waiveReason.trim()) return;

    try {
      await adminApi.put(`/penalties/${selectedPenalty._id}/waive`, {
        reason: waiveReason
      });

      toast({
        title: "Success",
        description: "Penalty waived successfully",
      });

      setShowWaiveDialog(false);
      setSelectedPenalty(null);
      setWaiveReason("");

      // Refresh list and stats
      fetchPenalties();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to waive penalty",
        variant: "destructive",
      });
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchPenalties();
    fetchStats();
  }, []);

  // Reload data when filters change
  useEffect(() => {
    fetchPenalties();
  }, [statusFilter, typeFilter, searchTerm]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="destructive">Active</Badge>;
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>;
      case 'waived':
        return <Badge variant="secondary">Waived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#212c40]">Penalty Management</h1>
            <p className="text-gray-600">Manage SLA violations and penalties</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => fetchStats()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Stats
            </Button>
            <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#f48432] hover:bg-[#e07528] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Apply Penalty
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Apply Penalty</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Driver Email</label>
                    <Input
                      type="email"
                      value={applyForm.driverEmail}
                      onChange={(e) => setApplyForm({ ...applyForm, driverEmail: e.target.value })}
                      placeholder="Enter driver email address"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Penalty Type</label>
                    <Select value={applyForm.type} onValueChange={(value) => setApplyForm({ ...applyForm, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select penalty type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(penaltyTypes).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Amount (₹)</label>
                    <Input
                      type="number"
                      value={applyForm.amount}
                      onChange={(e) => setApplyForm({ ...applyForm, amount: e.target.value })}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Reason</label>
                    <Input
                      value={applyForm.reason}
                      onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
                      placeholder="Enter reason"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Booking ID (Optional)</label>
                    <Input
                      value={applyForm.bookingId}
                      onChange={(e) => setApplyForm({ ...applyForm, bookingId: e.target.value })}
                      placeholder="Enter booking ID"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleApplyPenalty} disabled={!applyForm.driverEmail || !applyForm.type || !applyForm.amount}>
                      Apply Penalty
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Penalties</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.summary.totalPenalties}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">₹{stats.summary.totalAmount.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Penalties</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.summary.activePenalties}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Paid Penalties</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.summary.paidPenalties}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by driver name or penalty reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="waived">Waived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(penaltyTypes).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Penalties Table */}
        <Card>
          <CardHeader>
            <CardTitle>Penalty Records</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : penalties.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No penalties found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {penalties.map((penalty) => (
                      <TableRow key={penalty._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{penalty.driver.firstName} {penalty.driver.lastName}</p>
                            <p className="text-sm text-gray-500">{penalty.driver.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{penaltyTypes[penalty.type as keyof typeof penaltyTypes] || penalty.type}</p>
                            <p className="text-sm text-gray-500">{penalty.reason}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-red-600">₹{penalty.amount}</span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(penalty.status)}
                        </TableCell>
                        <TableCell>
                          {formatDate(penalty.appliedAt)}
                        </TableCell>
                        <TableCell>
                          {penalty.status === 'active' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedPenalty(penalty);
                                setShowWaiveDialog(true);
                              }}
                            >
                              Waive
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Waive Penalty Dialog */}
        <Dialog open={showWaiveDialog} onOpenChange={setShowWaiveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Waive Penalty</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedPenalty && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">Driver: {selectedPenalty.driver.firstName} {selectedPenalty.driver.lastName}</p>
                  <p className="text-sm text-gray-600">Amount: ₹{selectedPenalty.amount}</p>
                  <p className="text-sm text-gray-600">Reason: {selectedPenalty.reason}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium">Waive Reason</label>
                <Input
                  value={waiveReason}
                  onChange={(e) => setWaiveReason(e.target.value)}
                  placeholder="Enter reason for waiving penalty"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowWaiveDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleWaivePenalty} disabled={!waiveReason.trim()}>
                  Waive Penalty
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPenaltyManagement;
