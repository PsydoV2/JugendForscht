import { Sensoren } from "./components/Sensoren";
import { LandingScreen } from "./components/LandingScreen";
import { About } from "./components/About";
import { ThemeButton } from "./components/ThemeButton";
import { Settings } from "./components/Settings";
import { useState } from "react";

export const App = () => {
  const [refreshStatus, setRefreshStatus] = useState(false);
  return (
    <>
      <LandingScreen></LandingScreen>
      <ThemeButton></ThemeButton>
      <About></About>
      <Sensoren refreshSensor={refreshStatus}></Sensoren>
      {/* <Sensoren></Sensoren> */}
      <Settings
        refreshSensors={() => {
          setRefreshStatus(true);
          setTimeout(function () {
            setRefreshStatus(false);
          }, 10);
        }}
      ></Settings>
    </>
  );
};
