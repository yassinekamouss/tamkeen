import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ADMIN_FRONT_PREFIX } from "./api/axios";
import { Suspense, lazy } from "react";
import "./App.css";
import Loader from "./components/Spinner.tsx";
import ScrollToTop from "./components/ScrollToTop";
import LangLayout from "./components/LangLayout";
import DisponiblePrograms from "./pages/DisponibleProgrmas.tsx";
import PublicLayout from "./components/PublicLayout.tsx";

// Public pages (route-level code splitting)
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Privacy = lazy(() => import("./pages/Privacy"));
const News = lazy(() => import("./pages/News.tsx"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));

// Admin auth & layout
const Login = lazy(() => import("./pages/admin/Login"));
const PrivateRoute = lazy(() => import("./components/PrivateRoute"));
const LayoutAdmin = lazy(() => import("./pages/admin/LayoutAdmin"));
const AccessDenied = lazy(() => import("./components/AccessDenied"));
const RoleProtectedRoute = lazy(
  () => import("./components/RoleProtectedRoute")
);

// Admin nested routes
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Users = lazy(() => import("./pages/admin/Users"));
const Programs = lazy(() => import("./pages/admin/Programs"));
const UserDetails = lazy(() => import("./pages/admin/UserDetails"));
const Tests = lazy(() => import("./pages/admin/Tests"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const AdminNews = lazy(() => import("./pages/admin/News.tsx"));
const Partenaires = lazy(() => import("./pages/admin/Partenaires"));
const ProgramEditor = lazy(() => import("./pages/admin/ProgramEditor"));
const DossiersList = lazy(() => import("./pages/admin/DossiersList"));
const AdminsGestion = lazy(() => import("./pages/admin/AdminsGestion.tsx"));
const DossierReviewStudio = lazy(() => import("./pages/admin/DossierReviewStudio"));
const DocumentTypes = lazy(() => import("./pages/admin/DocumentTypes"));

// Client routes & protection
const SetupPassword = lazy(() => import("./pages/auth/SetupPassword"));
const ClientLogin = lazy(() => import("./pages/auth/Login"));
const ClientDashboard = lazy(() => import("./pages/client/ClientDashboard"));
const ClientTest = lazy(() => import("./pages/client/ClientTest"));
const ClientProfile = lazy(() => import("./pages/client/ClientProfile"));
const TestHistory = lazy(() => import("./pages/client/TestHistory"));
const ClientProtectedRoute = lazy(
  () => import("./components/ClientProtectedRoute")
);
import { ClientAuthProvider } from "./contexts/ClientAuthContext";

function App() {
  return (
    <ClientAuthProvider>
      <Router>
        <div className="w-full">
        <ScrollToTop />
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public routes */}
      <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />

        <Route
          path="/news"
          element={
            <PublicLayout>
              <News />
            </PublicLayout>
          }
        />

        <Route
          path="/news/:slugOrId"
          element={
            <PublicLayout>
              <NewsDetail />
            </PublicLayout>
          }
        />

        <Route
          path="/faq"
          element={
            <PublicLayout>
              <FAQ />
            </PublicLayout>
          }
        />

        <Route
          path="/privacy"
          element={
            <PublicLayout>
              <Privacy />
            </PublicLayout>
          }
        />

        <Route
          path="/programs"
          element={
            <PublicLayout>
              <DisponiblePrograms />
            </PublicLayout>
          }
        />

        <Route
          path="/setup-password"
          element={
            <SetupPassword />
          }
        />
        <Route
          path="/login"
          element={
            <ClientLogin />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ClientProtectedRoute>
              <ClientDashboard />
            </ClientProtectedRoute>
          }
        />
        <Route
          path="/client/dashboard"
          element={
            <ClientProtectedRoute>
              <ClientDashboard />
            </ClientProtectedRoute>
          }
        />
        <Route
          path="/client/test"
          element={
            <ClientProtectedRoute>
              <ClientTest />
            </ClientProtectedRoute>
          }
        />
        <Route
          path="/client/profile"
          element={
            <ClientProtectedRoute>
              <ClientProfile />
            </ClientProtectedRoute>
          }
        />
        <Route
          path="/client/historique"
          element={
            <ClientProtectedRoute>
              <TestHistory />
            </ClientProtectedRoute>
          }
        />

            <Route path={`${ADMIN_FRONT_PREFIX}/login`} element={<Login />} />

            {/* Localized routes with language prefix (fr/ar) */}
            <Route path=":lang(fr|ar)" element={<LangLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="news" element={<News />} />
              <Route path="news/:slugOrId" element={<NewsDetail />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="privacy" element={<Privacy />} />
            </Route>

            {/* Page d'accès refusé */}
            <Route
              path={`${ADMIN_FRONT_PREFIX}/access-denied`}
              element={<AccessDenied />}
            />

            {/* Protected admin routes */}
            <Route path={ADMIN_FRONT_PREFIX} element={<PrivateRoute />}>
              <Route element={<LayoutAdmin />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="user/details/:id" element={<UserDetails />} />
                <Route path="programs" element={<Programs />} />
                <Route path="programs/new" element={<ProgramEditor />} />
                <Route path="programs/:id/edit" element={<ProgramEditor />} />
                <Route path="dossiers" element={<DossiersList />} />
                <Route path="dossiers/:dossierId/studio" element={<DossierReviewStudio />} />
                <Route path="tests" element={<Tests />} />
                <Route path="reports" element={<Reports />} />
                <Route path="news" element={<AdminNews />} />
                <Route path="partenaires" element={<Partenaires />} />
                <Route path="document-types" element={<DocumentTypes />} />

                {/* ✅ Route protégée par rôle Administrateur */}
                <Route
                  path="app-users"
                  element={
                    <RoleProtectedRoute
                      requiredRole="Administrateur"
                      fallbackPath={`${ADMIN_FRONT_PREFIX}/access-denied`}>
                      <AdminsGestion />
                    </RoleProtectedRoute>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </div>
    </Router>
    </ClientAuthProvider>
  );
}

export default App;
