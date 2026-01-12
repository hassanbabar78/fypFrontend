import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Authenticate from "./components/Authenticate";
import DashboardPage from "./components/Dashboard/Dashboard";
import useTheme from "./store/ThemeSwitch";
import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

function App() {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
      <div className="fixed bottom-5 right-5 z-[10000]">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <div className="group peer ring-0 bg-gradient-to-r from-blue-400 to-blue-800 rounded-full outline-none duration-700 after:duration-300 w-24 h-12 shadow-md peer-checked:bg-gradient-to-r peer-checked:from-[#255314] peer-checked:to-[#00d95f] peer-focus:outline-none after:content-[''] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-10 after:w-10 after:top-1 after:left-1 peer-checked:after:translate-x-12 peer-hover:after:scale-90">
            <Sun className="group-hover:scale-75 duration-300 absolute top-1 left-1 stroke-gray-100 w-10 h-10" />
            <Moon className="group-hover:scale-75 duration-300 absolute top-1 left-12 stroke-gray-100 w-10 h-10" />
          </div>
        </label>
      </div>
    </>
  );
}

export default App;
