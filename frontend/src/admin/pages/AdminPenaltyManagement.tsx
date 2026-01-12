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
  const { admin } = useAdminAuth();

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

  // Fetch penalties
  const fetchPenalties = async () => {
    try {
      setLoading(true);
      const params: any = {};

      if (statusFilter !== "all") params.status = statusFilter;
      if (typeFilter !== "all") params.type = typeFilter;

      const response = await adminApi.getAllPenalties(params);
      setPenalties(response.data.docs);
    } catch (error) {
      console.error("Error fetching penalties:", error);
      toast({
        title: "Error",
        description: "Failed to load penalties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch penalty statistics
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await adminApi.getPenaltyStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching penalty stats:", error);
      toast({
        title: "Error",
        description: "Failed to load penalty statistics",
        variant: "destructive",
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Find driver by email
  const findDriverByEmail = async (email: string) => {
    try {
      const response = await adminDrivers.getAll({
        search: email,
        limit: 10
      });

      // Find exact email match
      const driver = response.data.docs.find((d: any) =>
        d.email?.toLowerCase() === email.toLowerCase()
      );

      return driver || null;
    } catch (error) {
      console.error("Error finding driver:", error);
      return null;
    }
  };

  // Apply penalty
  const handleApplyPenalty = async () => {
    try {
      // First find the driver by email
      const driver = await findDriverByEmail(applyForm.driverEmail);
      if (!driver) {
        toast({
          title: "Error",
          description: "Driver not found with this email address",
          variant: "destructive",
        });
        return;
      }

      await adminApi.applyPenalty(driver._id, {
        type: applyForm.type,
        amount: parseFloat(applyForm.amount),
        reason: applyForm.reason,
        bookingId: applyForm.bookingId || undefined
      });

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

  // Waive penalty
  const handleWaivePenalty = async () => {
    if (!selectedPenalty) return;

    try {
      await adminApi.waivePenalty(selectedPenalty._id, waiveReason);

      toast({
        title: "Success",
        description: "Penalty waived successfully",
      });

      setShowWaiveDialog(false);
      setSelectedPenalty(null);
      setWaiveReason("");

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
            <h1 className="text-2xl font-bold text-gray-900">Penalty Management</h1>
            <p className="text-gray-600">Manage SLA violations and penalties</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => fetchStats()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Stats
            </Button>
            <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
              <DialogTrigger asChild>
                <Button>
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
                      onChange={(e) => setApplyForm({...applyForm, driverEmail: e.target.value})}
                      placeholder="Enter driver email address"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Penalty Type</label>
                    <Select value={applyForm.type} onValueChange={(value) => setApplyForm({...applyForm, type: value})}>
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
                      onChange={(e) => setApplyForm({...applyForm, amount: e.target.value})}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Reason</label>
                    <Input
                      value={applyForm.reason}
                      onChange={(e) => setApplyForm({...applyForm, reason: e.target.value})}
                      placeholder="Enter reason"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Booking ID (Optional)</label>
                    <Input
                      value={applyForm.bookingId}
                      onChange={(e) => setApplyForm({...applyForm, bookingId: e.target.value})}
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
                          <div className="flex gap-2">
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
                          </div>
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
