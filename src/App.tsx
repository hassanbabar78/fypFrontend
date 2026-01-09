// App.tsx
import { Routes, Route } from "react-router-dom"; // Import routing components
import LandingPage from "./components/LandingPage";
import Authenticate from "./components/Authenticate"; // Import your new component
import DashboardPage from "./components/Dashboard/Dashboard";

function App() {
  return (
    <>
      <div>
        <Routes>
          {/* Define your routes here */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/authenticate" element={<Authenticate />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
