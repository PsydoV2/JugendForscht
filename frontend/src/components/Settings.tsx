import { RiSettingsFill } from "react-icons/ri";
import { Button, Input, Switch } from "@nextui-org/react";
import { FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
// import { IoMdClose } from "react-icons/io";
import { useState } from "react";

type Sensor = {
  Name: string;
  Status: number;
};

interface PropsSettings {
  refreshSensors: () => void;
}

export const Settings = (props: PropsSettings) => {
  const [isVisible, setIsVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [loginPageVisible, setLoginPageVisible] = useState(true);

  const [sensorNames, setSensorNames] = useState<string[]>([]);
  const [sensorStatus, setSensorStatus] = useState<number[]>([]);

  const [passwordInput, setPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  function handelSubmit() {
    if (passwordInput == "a1rs3ns3!") {
      setLoginPageVisible(false);
      setPasswordInput("");
    } else {
      alert("Incorrect password");
    }
  }

  function getSensorNamesStatus() {
    fetch("http://10.5.0.92:3000/api/getSensors")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the JSON from the response
      })
      .then((data: Sensor[]) => {
        const names = data.map((sensor) => sensor.Name);
        const statuses = data.map((sensor) => sensor.Status);

        setSensorNames(names);
        setSensorStatus(statuses);
      })
      .catch((error) => {
        console.error("Error fetching sensor data:", error);
      });
  }

  function changeStatus(index: number) {
    fetch("http://10.5.0.92:3000/api/changeStatus", {
      method: "POST", // or "PUT" depending on your API
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: sensorNames[index],
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else {
          // console.log("Success:");
          const newStatus = [...sensorStatus];
          newStatus[index] = newStatus[index] === 1 ? 0 : 1;
          setSensorStatus(newStatus);

          props.refreshSensors();
        }
      })
      .catch((error) => {
        console.error("Error updating sensor status:", error);
      });
  }

  function handelAdd() {
    if (nameInput in sensorNames) {
      window.alert("Bereits vorhanden!");
      return;
    }
    if (nameInput !== "") {
      fetch("http://10.5.0.92:3000/api/addSensor", {
        method: "POST", // or "PUT" depending on your API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: nameInput,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          } else {
            getSensorNamesStatus();

            props.refreshSensors();
          }
        })
        .catch((error) => {
          console.error("Error updating sensor status:", error);
        });
      // setNameInput(""); // Clear the input after adding
    }
  }

  function handelDeleteSensor(index: number) {
    const confirm = window.confirm(
      "Sicher " + sensorNames[index] + " löschen?"
    );
    if (confirm) {
      // console.log(sensorNames[index], " löschen");

      fetch("http://10.5.0.92:3000/api/deleteSensor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: sensorNames[index],
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          } else {
            console.log("Success:");
            const newStatus = [...sensorStatus];
            newStatus.splice(index, 1);
            setSensorStatus(newStatus);

            const newNames = [...sensorNames];
            newNames.splice(index, 1);
            setSensorNames(newNames);

            props.refreshSensors();
          }
        })
        .catch((error) => {
          console.error("Error updating sensor status:", error);
        });
    }
  }

  return (
    <>
      {/* Settings Button */}
      <div className="flex gap-4 items-center settingsButton">
        <Button
          isIconOnly
          aria-label="Like"
          onClick={() => {
            console.log("Button clicked");
            setPageVisible(!pageVisible);
            getSensorNamesStatus();
          }}
        >
          <RiSettingsFill />
        </Button>
      </div>

      {/* Actual Settings Page */}
      <div
        className="settingsContainer"
        style={{ display: pageVisible ? "block" : "none" }}
      >
        <div className="settingsPage">
          {/* Close Button */}
          {/* <div
            className="closeButton"
            onClick={() => {
              setPageVisible(false);
            }}
          >
            <IoMdClose />
          </div> */}

          {/* Login Page */}
          <div
            className="loginPage"
            style={{ display: loginPageVisible ? "grid" : "none" }}
          >
            <div className="loginPageContent">
              <h1>Verify Authority</h1>
              <Input
                variant="bordered"
                required
                placeholder="Password"
                startContent={<FaKey />}
                className="inputPassword"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <FaEye className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              <Button
                color="primary"
                variant="ghost"
                onClick={() => handelSubmit()}
              >
                Verify
              </Button>
            </div>
          </div>

          <div className="sensorControlContainer">
            <ul>
              {sensorStatus.map((status, index) => (
                <li key={index} className="list-group-item">
                  <Button
                    variant="solid"
                    className="deleteButton"
                    size="sm"
                    color="danger"
                    onClick={() => handelDeleteSensor(index)}
                  >
                    <MdDelete />
                  </Button>
                  {sensorNames[index]}
                  <Switch
                    isSelected={status === 1 ? true : false}
                    onValueChange={() => {
                      changeStatus(index);
                    }}
                  ></Switch>
                </li>
              ))}
            </ul>
          </div>
          <div className="sensorAddContainer">
            <Input
              type="text"
              label="Name z.B. a208"
              labelPlacement="inside"
              className="sensorNameInput"
              defaultValue={nameInput}
              onChange={(e) => {
                //   console.log(e.target.value);
                setNameInput(e.target.value);
              }}
            />
            <Button
              color="primary"
              variant="solid"
              className="sensorAddButton"
              onClick={handelAdd}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
