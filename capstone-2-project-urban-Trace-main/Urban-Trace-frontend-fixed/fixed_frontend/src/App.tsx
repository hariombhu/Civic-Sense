import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { CitizenPortal } from "./features/citizen/CitizenPortal";
import { AuthorityDashboard } from "./features/authority/AuthorityDashboard";
import { AuthorityLogin } from "./features/authority/AuthorityLogin";
import { PublicView } from "./features/public/PublicView";
import { LandingPage } from "./features/landing/LandingPage";
import { FleetTracker } from "./features/fleet/FleetTracker";
import { NGOsPage } from "./features/ngos/NGOsPage";
import { NGORegistration } from "./features/ngos/NGORegistration";
import { SupportPage } from "./features/support/SupportPage";
import { Dashboard } from "./features/dashboard/Dashboard";
import { ScanSegregate } from "./features/scan/ScanSegregate";
import { Rewards } from "./features/rewards/Rewards";
import { ACCESS_TOKEN_KEY } from "./service/api";

export function App(): JSX.Element {
  const [isAuthorityAuthenticated, setIsAuthorityAuthenticated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("urban-trace-authority-auth");
    setIsAuthorityAuthenticated(saved === "true");
  }, []);

  const handleAuthorityLogin = (): void => {
    localStorage.setItem("urban-trace-authority-auth", "true");
    setIsAuthorityAuthenticated(true);
  };

  const handleAuthorityLogout = (): void => {
    localStorage.removeItem("urban-trace-authority-auth");
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setIsAuthorityAuthenticated(false);
  };

  return (
    <AppLayout
      isAuthorityAuthenticated={isAuthorityAuthenticated}
      onAuthorityLogout={handleAuthorityLogout}
    >
      <Routes>
        <Route path="/"                element={<LandingPage />} />
        <Route path="/dashboard"       element={<Dashboard />} />
        <Route path="/scan"            element={<ScanSegregate />} />
        <Route path="/rewards"         element={<Rewards />} />
        <Route path="/citizen/*"       element={<CitizenPortal />} />
        <Route path="/fleet"           element={<FleetTracker />} />
        <Route path="/ngos"            element={<NGOsPage />} />
        <Route path="/ngos/register"   element={<NGORegistration />} />
        <Route path="/support"         element={<SupportPage />} />
        <Route
          path="/authority/login"
          element={
            isAuthorityAuthenticated ? (
              <Navigate to="/authority" replace />
            ) : (
              <AuthorityLogin onLogin={handleAuthorityLogin} />
            )
          }
        />
        <Route
          path="/authority/*"
          element={
            isAuthorityAuthenticated ? (
              <AuthorityDashboard />
            ) : (
              <Navigate to="/authority/login" replace />
            )
          }
        />
        <Route path="/public/*" element={<PublicView />} />
      </Routes>
    </AppLayout>
  );
}
