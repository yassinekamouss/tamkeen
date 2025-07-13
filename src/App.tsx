import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, About, FAQ, Privacy } from "./pages";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
