
import { useState, useEffect } from "react";
import AdminLayout from "@/admin/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { adminDrivers } from "@/services/adminApi";

const AdminDriverWalletManagement = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    loadDrivers();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredDrivers(drivers);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      setFilteredDrivers(
        drivers.filter(
          (d) =>
            d.firstName.toLowerCase().includes(lowerSearch) ||
            d.lastName.toLowerCase().includes(lowerSearch) ||
            d.phone.includes(searchTerm) ||
            d.email.toLowerCase().includes(lowerSearch)
        )
      );
    }
  }, [searchTerm, drivers]);

  const loadDrivers = async () => {
    setIsLoading(true);
    try {
      // Fetch all drivers
      // We assume getAll returns drivers with earnings/wallet populated
      const response = await adminDrivers.getAll({ limit: 1000 }); // Fetch enough to show meaningful list
      if (response.success) {
        setDrivers(response.data.docs || []);
        setFilteredDrivers(response.data.docs || []);
      }
    } catch (error) {
      console.error("Error loading drivers:", error);
      toast({
        title: "Error",
        description: "Failed to load driver wallet data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowTransactions = (driver: any) => {
    setSelectedDriver(driver);
    setShowTransactions(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Driver Wallet Management
            </h1>
            <p className="text-gray-600">
              Monitor driver earnings, wallet balances, and transactions
            </p>
          </div>
          <Button onClick={loadDrivers} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>

        {/* Stats Cards (Aggregated) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Wallet Balance (All Drivers)
                  </p>
                  <h3 className="text-2xl font-bold">
                    {formatCurrency(
                      drivers.reduce(
                        (sum, d) => sum + (d.earnings?.wallet?.balance || 0),
                        0
                      )
                    )}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                  <ArrowDownLeft className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Driver Income
                  </p>
                  <h3 className="text-2xl font-bold">
                    {/* Calculate strictly from what we have, might differ from real totals if paginated */}
                    {formatCurrency(
                        drivers.reduce((sum, d) => {
                             const txs = d.earnings?.wallet?.transactions || [];
                             return sum + txs.filter((t:any) => t.type === 'credit').reduce((a:number, b:any) => a + b.amount, 0);
                        }, 0)
                    )}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-full">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Deductions/Withdrawals
                  </p>
                  <h3 className="text-2xl font-bold">
                     {formatCurrency(
                        drivers.reduce((sum, d) => {
                             const txs = d.earnings?.wallet?.transactions || [];
                             return sum + txs.filter((t:any) => t.type === 'debit').reduce((a:number, b:any) => a + b.amount, 0);
                        }, 0)
                    )}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Drivers List</CardTitle>
            <div className="relative max-w-sm mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Wallet Balance</TableHead>
                    <TableHead>Total Earnings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredDrivers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No drivers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDrivers.map((driver) => (
                      <TableRow key={driver._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={driver.profilePicture} />
                              <AvatarFallback>
                                {driver.firstName[0]}
                                {driver.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {driver.firstName} {driver.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: {driver._id.slice(-6)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{driver.phone}</p>
                            <p className="text-gray-500">{driver.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="text-lg font-bold bg-green-50 text-green-700"
                          >
                            {formatCurrency(
                              driver.earnings?.wallet?.balance || 0
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(driver.totalEarnings || 0)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              driver.isActive ? "default" : "destructive"
                            }
                          >
                            {driver.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShowTransactions(driver)}
                          >
                            View Transactions
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Modal */}
      <Dialog open={showTransactions} onOpenChange={setShowTransactions}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Wallet Transactions - {selectedDriver?.firstName}{" "}
              {selectedDriver?.lastName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
             <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                     <p className="text-sm text-gray-500">Current Balance</p>
                     <p className="text-2xl font-bold text-[#29354c]">{formatCurrency(selectedDriver?.earnings?.wallet?.balance || 0)}</p>
                </div>
                {/* Could add manual adjustment button here if backend supported it */}
             </div>

             <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {selectedDriver?.earnings?.wallet?.transactions?.length > 0 ? (
                            [...selectedDriver.earnings.wallet.transactions].reverse().map((tx: any, i: number) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <Badge className={tx.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                            {tx.type === 'credit' ? 'Credit' : 'Debit'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className={tx.type === 'credit' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                        {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                                    </TableCell>
                                    <TableCell>{tx.description}</TableCell>
                                    <TableCell className="text-sm text-gray-500">{formatDate(tx.date)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-gray-500">No transactions found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDriverWalletManagement;
