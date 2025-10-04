import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

export const ThemeButton = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Setze das data-theme Attribut auf dem document.documentElement entsprechend dem aktuellen theme Wert
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]); // Führe diese Funktion aus, wenn der theme Wert aktualisiert wird

  const toggleTheme = () => {
    // Ändere das theme von light zu dark und umgekehrt
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex gap-4 items-center themeButton">
      <Button isIconOnly aria-label="Like" onClick={toggleTheme}>
        {theme === "light" ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
      </Button>
    </div>
  );
};
