import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Bookings from "./pages/Bookings";
import Help from "./pages/Help";
import Profile from "./pages/Profile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import VihicleSearch from "./pages/VihicleSearch";
import CancellationPolicy from "./pages/CancellationPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import AboutUs from "./pages/AboutUs";
import B2BPartner from "./pages/B2BPartner";
import ContactUs from "./pages/ContactUs";
import Career from "./pages/Career";
import SLAPage from "./pages/SLAPage";
import ArchiveStories from "./pages/ArchiveStories";
import CarDetails from "./pages/CarDetails";
import BookingSummary from "./pages/BookingSummary";
import PersonalInfo from "./pages/profile/PersonalInfo";
import Notifications from "./pages/profile/Notifications";
import PrivacySecurity from "./pages/profile/PrivacySecurity";
import Settings from "./pages/profile/Settings";

import FavoritesPage from "./pages/FavoritesPage";
import PaymentStatus from "./pages/PaymentStatus";
import NotFound from "./pages/NotFound";
import DriverAuth from "./driver/pages/DriverAuth";
import DriverHome from "./driver/pages/DriverHome";
import DriverRequests from "./driver/pages/DriverRequests";
import DriverMyVehicle from "./driver/pages/DriverMyVehicle";
import DriverProfile from "./driver/pages/DriverProfile";
import DriverEditProfile from "./driver/pages/DriverEditProfile";
import DriverWallet from "./driver/pages/DriverWallet";
import DriverLegalDocuments from "./driver/pages/DriverLegalDocuments";
import DriverTerms from "./driver/pages/DriverTerms";
import DriverLeaseAgreement from "./driver/pages/DriverLeaseAgreement";
import DriverSLA from "./driver/pages/DriverSLA";
import DriverCancelPenalty from "./driver/pages/DriverCancelPenalty";
import AdminAuth from "./admin/pages/AdminAuth";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminUserManagement from "./admin/pages/AdminUserManagement";
import AdminDriverManagement from "./admin/pages/AdminDriverManagement";
import AdminDriverWalletManagement from "./admin/pages/AdminDriverWalletManagement";
import AdminPriceManagement from "./admin/pages/AdminPriceManagement";
import AdminVehicleManagement from "./admin/pages/AdminVehicleManagement";

import AdminPaymentManagement from "./admin/pages/AdminPaymentManagement";

import AdminBookingManagement from "./admin/pages/AdminBookingManagement";
import AdminPenaltyManagement from "./admin/pages/AdminPenaltyManagement";
import AdminProfile from "./admin/pages/AdminProfile";

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedDriverRoute from "./components/ProtectedDriverRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
import MobileAuthWrapper from "./components/MobileAuthWrapper";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { DriverAuthProvider } from "./contexts/DriverAuthContext";
import { UserAuthProvider } from "./contexts/UserAuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Retry on rate limiting errors
        if (error?.message?.includes('429') || (error as any)?.status === 429) {
          return failureCount < 3;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Global error handler for rate limiting
const GlobalErrorHandler = () => {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      if (error?.message?.includes('429') || (error as any)?.status === 429) {
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, []);

  return null;
};

// Global Zoom Prevention Component
const ZoomPrevention = () => {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GlobalErrorHandler />
      <ZoomPrevention />
      <AdminAuthProvider>
        <DriverAuthProvider>
          <UserAuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<MobileAuthWrapper><Index /></MobileAuthWrapper>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/bookings" element={<ProtectedUserRoute><Bookings /></ProtectedUserRoute>} />
                <Route path="/help" element={<MobileAuthWrapper><Help /></MobileAuthWrapper>} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-conditions" element={<TermsConditions />} />
                <Route path="/cancellation-policy" element={<CancellationPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/b2b-partner" element={<B2BPartner />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/career" element={<Career />} />
                <Route path="/sla-agreement" element={<SLAPage />} />
                <Route path="/archives" element={<ArchiveStories />} />
                <Route path="/profile" element={<ProtectedUserRoute><Profile /></ProtectedUserRoute>} />
                <Route path="/vihicle-search" element={<MobileAuthWrapper><VihicleSearch /></MobileAuthWrapper>} />
                <Route path="/car-details/:id" element={<MobileAuthWrapper><CarDetails /></MobileAuthWrapper>} />
                <Route path="/booking-summary" element={<MobileAuthWrapper><BookingSummary /></MobileAuthWrapper>} />
                <Route path="/payment-status" element={<PaymentStatus />} />

                {/* Profile Sub-pages */}
                <Route path="/profile/personal-info" element={<ProtectedUserRoute><PersonalInfo /></ProtectedUserRoute>} />
                <Route path="/profile/notifications" element={<ProtectedUserRoute><Notifications /></ProtectedUserRoute>} />
                <Route path="/profile/privacy" element={<ProtectedUserRoute><PrivacySecurity /></ProtectedUserRoute>} />

                <Route path="/profile/settings" element={<ProtectedUserRoute><Settings /></ProtectedUserRoute>} />
                <Route path="/favorites" element={<ProtectedUserRoute><FavoritesPage /></ProtectedUserRoute>} />

                {/* Driver Module Routes */}
                <Route path="/driver-auth" element={<DriverAuth />} />
                <Route path="/driver" element={<ProtectedDriverRoute><DriverHome /></ProtectedDriverRoute>} />
                <Route path="/driver/requests" element={<ProtectedDriverRoute><DriverRequests /></ProtectedDriverRoute>} />
                <Route path="/driver/myvehicle" element={<ProtectedDriverRoute><DriverMyVehicle /></ProtectedDriverRoute>} />
                <Route path="/driver/profile" element={<ProtectedDriverRoute><DriverProfile /></ProtectedDriverRoute>} />
                <Route path="/driver/profile/edit" element={<ProtectedDriverRoute><DriverEditProfile /></ProtectedDriverRoute>} />
                <Route path="/driver/profile/legal" element={<ProtectedDriverRoute><DriverLegalDocuments /></ProtectedDriverRoute>} />
                <Route path="/driver/profile/legal/terms" element={<ProtectedDriverRoute><DriverTerms /></ProtectedDriverRoute>} />
                <Route path="/driver/profile/legal/lease" element={<ProtectedDriverRoute><DriverLeaseAgreement /></ProtectedDriverRoute>} />
                <Route path="/driver/profile/legal/sla" element={<ProtectedDriverRoute><DriverSLA /></ProtectedDriverRoute>} />
                <Route path="/driver/profile/legal/penalty" element={<ProtectedDriverRoute><DriverCancelPenalty /></ProtectedDriverRoute>} />
                <Route path="/driver/wallet" element={<ProtectedDriverRoute><DriverWallet /></ProtectedDriverRoute>} />

                {/* Admin Module Routes */}
                <Route path="/admin-auth" element={<AdminAuth />} />
                <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
                <Route path="/admin/users" element={<ProtectedAdminRoute><AdminUserManagement /></ProtectedAdminRoute>} />
                <Route path="/admin/drivers" element={<ProtectedAdminRoute><AdminDriverManagement /></ProtectedAdminRoute>} />
                <Route path="/admin/driver-wallets" element={<ProtectedAdminRoute><AdminDriverWalletManagement /></ProtectedAdminRoute>} />
                <Route path="/admin/vehicles" element={<ProtectedAdminRoute><AdminVehicleManagement /></ProtectedAdminRoute>} />
                <Route path="/admin/prices" element={<ProtectedAdminRoute><AdminPriceManagement /></ProtectedAdminRoute>} />

                <Route path="/admin/payments" element={<ProtectedAdminRoute><AdminPaymentManagement /></ProtectedAdminRoute>} />
                <Route path="/admin/penalties" element={<ProtectedAdminRoute><AdminPenaltyManagement /></ProtectedAdminRoute>} />

                <Route path="/admin/bookings" element={<ProtectedAdminRoute><AdminBookingManagement /></ProtectedAdminRoute>} />
                <Route path="/admin/bookings/active" element={<ProtectedAdminRoute><AdminBookingManagement /></ProtectedAdminRoute>} />
                <Route path="/admin/bookings/completed" element={<ProtectedAdminRoute><AdminBookingManagement /></ProtectedAdminRoute>} />
                <Route path="/admin/bookings/cancelled" element={<ProtectedAdminRoute><AdminBookingManagement /></ProtectedAdminRoute>} />
                <Route path="/admin/bookings/analytics" element={<ProtectedAdminRoute><AdminBookingManagement /></ProtectedAdminRoute>} />
                <Route path="/admin/profile" element={<ProtectedAdminRoute><AdminProfile /></ProtectedAdminRoute>} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </UserAuthProvider>
        </DriverAuthProvider>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
