import { useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
          relative w-14 h-8 rounded-full transition-colors duration-300 ease-in-out
          ${isDark ? "bg-gray-700" : "bg-accent"}
        `}
      aria-label="Toggle theme"
    >
      {/* Toggle Circle */}
      <div
        className={`
            absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md
            flex items-center justify-center
            transform transition-transform duration-300 ease-in-out
            ${isDark ? "translate-x-6" : "translate-x-0"}
          `}
      >
        {isDark ? (
          <Moon size={18} className="text-gray-700" />
        ) : (
          <Sun size={18} className="" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
