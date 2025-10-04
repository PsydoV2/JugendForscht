import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Button,
} from "@nextui-org/react";
import { AreaChart } from "@tremor/react";
import { useState } from "react";
import iconSensor from "../assets/iconSensor.jpg";
import { MdOutlineRoom, MdOutlineCo2 } from "react-icons/md";
import { CiTempHigh } from "react-icons/ci";
import { FaHistory } from "react-icons/fa";
import { IoCloudOffline } from "react-icons/io5";

export type ChartData = {
  time: string;
  Co2: string;
};

interface SensorProps {
  roomName: string;
  coValue: string;
  tempValue: string;
}

export const Sensor = (props: SensorProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [valuesChart, setValuesChart] = useState<ChartData[]>([
    { time: "0", Co2: "0" },
  ]);
  // const [windowStatus, setWindowStatus] = useState(false);

  const ipbackend = "http://10.5.0.92";
  const portbackend = "3000";
  const ipHistory = `${ipbackend}:${portbackend}/api/history`;
  // const ipWindow = "http://10.5.0.92:4000/windowStatus";

  const handleClick = async (roomName: string) => {
    setShowHistory(!showHistory);

    try {
      const response = await fetch(ipHistory, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ room: roomName }),
      });

      if (!response.ok) {
        throw new Error("Error retrieving history data");
      }

      const historyData: ChartData[] = await response.json();
      setValuesChart(historyData);
    } catch (error) {
      console.error("Error: " + error);
    }
  };

  // Get from the Alogrithmus if the Window is Open or Closed

  // useEffect(() => {
  //   const fetchWindowStatus = async () => {
  //     try {
  //       const response = await fetch(ipWindow, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ room: props.roomName }),
  //       });

  //       if (!response.ok) {
  //         throw new Error("Error retrieving window status");
  //       }

  //       const status = await response.json();
  //       setWindowStatus(status.open);
  //     } catch (error) {
  //       console.error("Error: " + error);
  //     }
  //   };

  //   fetchWindowStatus();
  // }, [props.roomName]);

  if (
    props.tempValue != "Offline" &&
    props.coValue != "Offline" &&
    props.roomName != "Offline"
  ) {
    return (
      <Card className="max-w-[400px] sensor">
        <CardHeader className="flex gap-3">
          <Image
            isBlurred
            isZoomed
            alt="nextui logo"
            height={40}
            radius="sm"
            src={iconSensor}
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">
              <b>{props.roomName + " "}</b>
              <MdOutlineRoom />
            </p>
            <p className="text-small text-default-500"></p>
          </div>
          {/* <div className="windowStatus">{windowStatus ? "Open" : "Closed"}</div> */}
        </CardHeader>
        <Divider />
        <CardBody className="sensorBody">
          <ul>
            <li>
              <MdOutlineCo2 />
              <b>{props.coValue}</b> ppm
            </li>
            <li>
              <CiTempHigh />
              <b>{props.tempValue}</b> °C
            </li>
          </ul>
        </CardBody>
        <Divider />
        <CardFooter>
          {!showHistory ? (
            <Button
              className="buttonOpenHis"
              color="primary"
              onClick={() => handleClick(props.roomName)}
            >
              Load History
              <FaHistory />
            </Button>
          ) : (
            <AreaChart
              className="h-40 valueChart"
              data={valuesChart}
              index="time"
              categories={["Co2"]}
              colors={["red"]}
              yAxisWidth={50}
              xAxisLabel="Time"
              yAxisLabel="Co²"
              autoMinValue
              showAnimation
              showGradient
            />
          )}
        </CardFooter>
      </Card>
    );
  } else {
    return (
      <Card className="max-w-[400px] sensor">
        <CardHeader className="flex gap-3">
          <Image
            isBlurred
            isZoomed
            alt="nextui logo"
            height={40}
            radius="sm"
            src={iconSensor}
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">
              <b>{props.roomName + " "}</b>
              <MdOutlineRoom />
            </p>
            <p className="text-small text-default-500"></p>
          </div>
          {/* <div className="windowStatus">{windowStatus ? "Open" : "Closed"}</div> */}
        </CardHeader>
        <Divider />
        <CardBody className="sensorBody">
          <IoCloudOffline className="offlineIcon" />
        </CardBody>
        <Divider />
        <CardFooter></CardFooter>
      </Card>
    );
  }
};
