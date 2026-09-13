import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageLoader from "@/components/ui/PageLoader";
import PageTransition from "@/components/layout/PageTransition";
import AuthModal from "@/components/auth/AuthModal";
import LiquidGlassBottomNav from "@/components/layout/LiquidGlassBottomNav";
import ArenaBackground from "@/components/layout/ArenaBackground";
import { logUserActivity } from "@/lib/auditLogger";

// Eagerly import public pages to guarantee instant 1st visit rendering with zero blank screens
import HomePage from "@/pages/HomePage";
import TournamentsPage from "@/pages/TournamentsPage";
import TournamentDetailPage from "@/pages/TournamentDetailPage";
import RegisterPage from "@/pages/RegisterPage";
import PaymentStatusPage from "@/pages/PaymentStatusPage";
import TeamsPage from "@/pages/TeamsPage";
import ResultsPage from "@/pages/ResultsPage";
import GalleryPage from "@/pages/GalleryPage";
import FaqPage from "@/pages/FaqPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import RefundPolicyPage from "@/pages/RefundPolicyPage";
import RulesPage from "@/pages/RulesPage";
import NotFoundPage from "@/pages/NotFoundPage";

import AdminRequireAuth from "@/components/admin/AdminRequireAuth";

// Lazy load admin control panel components
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "control-panel-dev";
const AdminLoginPage = lazy(() => import("@/pages/admin/AdminLoginPage"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const AdminHeroBoxPage = lazy(() => import("@/pages/admin/AdminHeroBoxPage"));
const AdminTournamentsPage = lazy(() => import("@/pages/admin/AdminTournamentsPage"));
const AdminRegistrationsPage = lazy(() => import("@/pages/admin/AdminRegistrationsPage"));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminCouponsPage = lazy(() => import("@/pages/admin/AdminCouponsPage"));
const AdminNotifyUsersPage = lazy(() => import("@/pages/admin/AdminNotifyUsersPage"));
const AdminLeaderboardPage = lazy(() => import("@/pages/admin/AdminLeaderboardPage"));
const AdminReviewsPage = lazy(() => import("@/pages/admin/AdminReviewsPage"));
const AdminSettingsPage = lazy(() => import("@/pages/admin/AdminSettingsPage"));
const AdminAuditLogPage = lazy(() => import("@/pages/admin/AdminAuditLogPage"));

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith(`/${ADMIN_PATH}`);

  // Track 100% accurate A-to-Z user navigation journeys
  useEffect(() => {
    logUserActivity("page_navigation", "page.visit", `User navigated to ${location.pathname}`);
  }, [location.pathname]);

  return (
    <>
      {/* 120 FPS Hardware-Accelerated Dynamic Arena Background */}
      {!isAdminRoute && <ArenaBackground />}

      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <PageTransition key={isAdminRoute ? "admin-root" : location.pathname}>
            <Routes location={location}>
              {/* Public site */}
              <Route path="/" element={<HomePage />} />
              <Route path="/tournaments" element={<TournamentsPage />} />
              <Route path="/tournaments/:slug" element={<TournamentDetailPage />} />
              <Route path="/tournaments/:slug/register" element={<RegisterPage />} />
              <Route path="/payment/:orderId/status" element={<PaymentStatusPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/faq" element={<FaqPage />} />

              {/* Legal & Policy Routes */}
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/refund-policy" element={<RefundPolicyPage />} />
              <Route path="/rules" element={<RulesPage />} />

              {/* Admin Control Panel */}
              <Route path={`/${ADMIN_PATH}/login`} element={<AdminLoginPage />} />
              <Route
                path={`/${ADMIN_PATH}`}
                element={
                  <AdminRequireAuth>
                    <AdminLayout />
                  </AdminRequireAuth>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="hero-box" element={<AdminHeroBoxPage />} />
                <Route path="tournaments" element={<AdminTournamentsPage />} />
                <Route path="registrations" element={<AdminRegistrationsPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="coupons" element={<AdminCouponsPage />} />
                <Route path="notify-users" element={<AdminNotifyUsersPage />} />
                <Route path="leaderboard" element={<AdminLeaderboardPage />} />
                <Route path="reviews" element={<AdminReviewsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="audit-log" element={<AdminAuditLogPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </PageTransition>
        </AnimatePresence>
      </Suspense>

      {/* Floating Liquid Glass Bottom Navigation Bar */}
      {!isAdminRoute && <LiquidGlassBottomNav />}

      {/* Global Auth Modal */}
      <AuthModal />
    </>
  );
}
