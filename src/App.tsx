import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ADMIN_FRONT_PREFIX } from "./api/axios";
import { Suspense, lazy } from "react";
import "./App.css";
import Loader from "./components/Spinner.tsx";
import ScrollToTop from "./components/ScrollToTop";
import LangLayout from "./components/LangLayout";

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

const AdminsGestion = lazy(() => import("./pages/admin/AdminsGestion.tsx"));

function App() {
  return (
    <Router>
      <div className="w-full">
        <ScrollToTop />
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slugOrId" element={<NewsDetail />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
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
                <Route path="tests" element={<Tests />} />
                <Route path="reports" element={<Reports />} />
                <Route path="news" element={<AdminNews />} />
                <Route path="partenaires" element={<Partenaires />} />

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
  );
}

export default App;
