import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";
import Loader from "./components/Spinner.tsx";

// Public pages (route-level code splitting)
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Privacy = lazy(() => import("./pages/Privacy"));
const News = lazy(() => import("./pages/News.tsx"));
// Admin auth & layout
const Login = lazy(() => import("./pages/admin/Login"));
const PrivateRoute = lazy(() => import("./components/PrivateRoute"));
const LayoutAdmin = lazy(() => import("./pages/admin/LayoutAdmin"));
// Admin nested routes
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Users = lazy(() => import("./pages/admin/Users"));
const Programs = lazy(() => import("./pages/admin/Programs"));
const UserDetails = lazy(() => import("./pages/admin/UserDetails"));
const Tests = lazy(() => import("./pages/admin/Tests"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const AdminNews = lazy(() => import("./pages/admin/News.tsx"));

const AdminsGestion = lazy(() => import("./pages/admin/AdminsGestion.tsx"));

function App() {
  return (
    <Router>
      <div className="w-full">
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/news" element={<News />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/admin/login" element={<Login />} />

            {/* Protected admin routes */}
            <Route path="/admin" element={<PrivateRoute />}>
              <Route element={<LayoutAdmin />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="user/details/:id" element={<UserDetails />} />
                <Route path="programs" element={<Programs />} />
                <Route path="tests" element={<Tests />} />
                <Route path="reports" element={<Reports />} />
                <Route path="news" element={<AdminNews />} />
                <Route path="app-users" element={<AdminsGestion />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
