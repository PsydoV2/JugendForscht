import { Sensor } from "./Sensor";
import { useEffect, useState } from "react";
import { Callout } from "@tremor/react";
// import { chartData } from "./Sensor";

interface PropsSensoren {
  refreshSensor: boolean;
}

export const Sensoren = (props: PropsSensoren) => {
  const [namesABau, setNamesABau] = useState<string[]>([]);
  const [namesBBau, setNamesBBau] = useState<string[]>([]);
  const [valuesABau, setValuesABau] = useState<string[]>([]);
  const [valuesBBau, setValuesBBau] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const ipbackend = "http://10.5.0.92";
  const portbackend = "3000";

  const ipAValues = ipbackend + ":" + portbackend + "/api/data/a";
  const ipBValues = ipbackend + ":" + portbackend + "/api/data/b";
  // const ipHistory = ipbackend + ":" + portbackend + "/api/history";
  // const ipHistoryGraph = ipbackend + ":" + portbackend + "/api/historygraph";
  // const ipTest = ipbackend + ":" + portbackend + "/api";

  // Function to refresh the Sensors

  if (props.refreshSensor) {
    // console.log("Got Message to refresh");
    const fetchDataA = () => {
      fetch(ipAValues)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setNamesABau(data.dataNames);
          setValuesABau(data.dataValues);
        })
        .catch((error) => {
          setError(error.message);
        });
    };

    const fetchDataB = () => {
      fetch(ipBValues)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setNamesBBau(data.dataNames);
          setValuesBBau(data.dataValues);
        })
        .catch((error) => {
          setError(error.message);
        });
    };

    fetchDataA();
    fetchDataB();
  }

  // Get Values for A Rooms
  useEffect(() => {
    const fetchData = () => {
      fetch(ipAValues)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setNamesABau(data.dataNames);
          setValuesABau(data.dataValues);
        })
        .catch((error) => {
          setError(error.message);
        });
    };

    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 300000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // Get Values for B Rooms
  useEffect(() => {
    const fetchData = () => {
      fetch(ipBValues)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setNamesBBau(data.dataNames);
          setValuesBBau(data.dataValues);
        })
        .catch((error) => {
          setError(error.message);
        });
    };

    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 300000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  if (error) {
    console.error(error);
    return (
      <div className="sensorCon" id="live">
        <Callout title="Error" color="red">
          {" "}
          Live Values currently not available because of an failure in our
          backend.{" "}
        </Callout>
      </div>
    );
  }

  if (
    namesABau == undefined ||
    namesBBau == undefined ||
    valuesABau == undefined ||
    valuesBBau == undefined
  ) {
    return (
      <div className="sensorCon" id="live">
        <Callout title="Error" color="red">
          {" "}
          Live Values currently not available because of an failure in our
          backend.{" "}
        </Callout>
      </div>
    );
  }

  return (
    <div className="sensorCon" id="live">
      <div className="aBau">
        <h2>A-Bau</h2>
        {namesABau != undefined ? (
          namesABau.map((roomName, index) => (
            <Sensor
              roomName={roomName != null ? roomName : "Offline"}
              coValue={
                valuesABau[index * 2] != null
                  ? valuesABau[index * 2]
                  : "Offline"
              }
              tempValue={
                valuesABau[index * 2 + 1] != null
                  ? valuesABau[index * 2 + 1]
                  : "Offline"
              }
              key={index}
            />
          ))
        ) : (
          <Callout title="Error" color="red">
            {" "}
            Live Values for A Rooms currently not available because of an
            failure in our backend.{" "}
          </Callout>
        )}
      </div>
      <div className="bBau">
        <h2>B-Bau</h2>
        {namesBBau != undefined ? (
          namesBBau.map((roomName, index) => (
            <Sensor
              roomName={roomName != null ? roomName : "Offline"}
              coValue={
                valuesBBau[index * 2] != null
                  ? valuesBBau[index * 2]
                  : "Offline"
              }
              tempValue={
                valuesBBau[index * 2 + 1] != null
                  ? valuesBBau[index * 2 + 1]
                  : "Offline"
              }
              key={index}
            />
          ))
        ) : (
          <Callout title="Error" color="red">
            {" "}
            Live Values for B Rooms currently not available because of an
            failure in our backend.{" "}
          </Callout>
        )}
      </div>
    </div>
  );
};
