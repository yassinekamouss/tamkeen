import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, About, FAQ, Privacy } from "./pages";
import Login from "./pages/admin/Login";
import LayoutAdmin from "./pages/admin/LayoutAdmin";
import PrivateRoute from "./components/PrivateRoute";

import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Programs from "./pages/admin/Programs";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="w-full">
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin/login" element={<Login />} />

          {/* Routes protégées (admin) */}
          <Route path="/admin" element={<PrivateRoute />}>
            <Route element={<LayoutAdmin />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="programs" element={<Programs />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
