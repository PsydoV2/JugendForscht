const express = require("express");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { createPool } = require("mysql");
const moment = require("moment");
const bodyParser = require("body-parser");
const { error } = require("console");
const util = require("util");

// Datenbank verbindung
const pool = createPool({
  host: "localhost",
  user: "admin",
  password: "a1rs3ns3!",
  database: "Sensoren",
  connectionLimit: 2,
});

// API Authentication Token Homeassistent
const tokenschulalt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIxMjNhN2Q3YWI1Yjc0ZTM2YjRlNTA4ODk1YzZiZWYxMiIsImlhdCI6MTcxMDE2MTU0OCwiZXhwIjoyMDI1NTIxNTQ4fQ.QutepTG-7fjgu2nNvq_LN6b03_zGl01YU7x4aSwzfjk";
const tokenschul =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiZTU0OWJmNzkyMDE0MjhjODU5MmM3N2Q5ZjU2NGZhYSIsImlhdCI6MTcxNzE4MzE5NywiZXhwIjoyMDMyNTQzMTk3fQ.mOyBxuunWqUU4f4_srSVLkRyumZnezz84GPD0nhNE-U";
// const tokenschul = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiZTU0OWJmNzkyMDE0MjhjODU5MmM3N2Q5ZjU2NGZhYSIsImlhdCI6MTcxNzE4MzE5NywiZXhwIjoyMDMyNTQzMTk3fQ.mOyBxuunWqUU4f4_srSVLkRyumZnezz84GPD0nhNE-U"

const hoip = "10.5.0.91:8123";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cors deaktivieren
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allow specific methods
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow specific headers

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Zertifikat deaktivieren
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const query = util.promisify(pool.query).bind(pool);

async function getSensorNamesForURLs(bau) {
  try {
    const sqlQuery = `SELECT Name FROM SensorNamen WHERE Name LIKE '${bau}%' AND Status = 1;`;
    const result = await query(sqlQuery);

    const sensorNames = result.map((row) => row.Name);
    return sensorNames;
  } catch (e) {
    console.error(e);
    return []; // Return an empty array in case of error
  }
}

// Urls generieren
// var a_sensoren = ["a208a", "a208", "a209", "a011"];
// var b_sensoren = ["b330", "b132"];

async function generateUrls(bau) {
  let returnArr = [];

  let sensorNames = await getSensorNamesForURLs(bau);

  // console.log("Ich bin Bau: " + bau + " und bekomme: " + sensorNames);

  // Handle the case where sensorNames is undefined or empty
  if (sensorNames && sensorNames.length > 0) {
    sensorNames.forEach((name) => {
      returnArr.push(
        `https://${hoip}/api/states/sensor.${name}_airsense_co2_value_${name}`
      );
      returnArr.push(
        `https://${hoip}/api/states/sensor.${name}_airsense_temperatur_von_dht_${name}`
      );
    });
  } else {
    console.error("Keine Sensoren gefunden für den Bau:", bau);
  }

  return returnArr;
}

// Get Values from Homeassistent API

app.get("/api/data/a", async (req, res) => {
  try {
    let a_bau_data = [];

    let a_bau_urls = await generateUrls("a");

    const fetchPromises = a_bau_urls.map(async (url) => {
      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + tokenschul,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data;
    });

    a_bau_data = await Promise.all(fetchPromises);

    let dataNames = [];
    let dataValues = [];

    for (let index = 0; index < a_bau_data.length; index += 2) {
      if (
        a_bau_data[index] &&
        a_bau_data[index].attributes &&
        a_bau_data[index].attributes.friendly_name != undefined
      ) {
        dataNames.push(
          a_bau_data[index].attributes.friendly_name.split(" ")[0]
        );
        if (a_bau_data[index + 1]) {
          dataValues.push(a_bau_data[index].state);
          dataValues.push(a_bau_data[index + 1].state);
        }
      } else {
        dataNames.push(null);
        dataValues.push(null);
        dataValues.push(null);
      }
    }

    res.json({ dataNames, dataValues });
  } catch (e) {
    console.error("Error get HA Values for A-Bau: " + e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/data/b", async (req, res) => {
  try {
    let b_bau_data = [];

    b_bau_urls = await generateUrls("b");

    const fetchPromises = b_bau_urls.map(async (url) => {
      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + tokenschul,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data;
    });

    b_bau_data = await Promise.all(fetchPromises);
    // b_bau_data = JSON.stringify(b_bau_data);

    let dataNames = [];
    let dataValues = [];

    // for (let index = 0; index < b_bau_data.length; index += 2) {
    //   dataNames.push(b_bau_data[index].attributes.friendly_name.split(" ")[0]);
    //   dataValues.push(b_bau_data[index].state);
    //   dataValues.push(b_bau_data[index + 1].state);
    // }

    for (let index = 0; index < b_bau_data.length; index += 2) {
      if (
        b_bau_data[index] &&
        b_bau_data[index].attributes &&
        b_bau_data[index].attributes.friendly_name != undefined
      ) {
        dataNames.push(
          b_bau_data[index].attributes.friendly_name.split(" ")[0]
        );
        if (b_bau_data[index + 1]) {
          dataValues.push(b_bau_data[index].state);
          dataValues.push(b_bau_data[index + 1].state);
        }
      } else {
        dataNames.push(null);
        dataValues.push(null);
        dataValues.push(null);
      }
    }

    // console.log(
    //   "Filtered Values: " + JSON.stringify({ dataNames, dataValues })
    // );
    res.json({ dataNames, dataValues });
  } catch (e) {
    console.error("Error get HA Values for B-Bau: " + e);
  }
});

// Get History of specific room

app.post("/api/history", async (req, res) => {
  try {
    const room = req.body.room;
    const endTime = moment().toISOString();
    const startTime = moment().subtract(12, "hours").toISOString();
    // const url = `https://${hoip}/api/history/period/${startTime}?end_time=${endTime}&filter_entity_id=sensor.${room}_airsense_co2_value_${room},sensor.${room}_airsense_temperatur_von_dht_${room}&no_attributes`;

    const url = `https://${hoip}/api/history/period/${startTime}?end_time=${endTime}&filter_entity_id=sensor.${room}_airsense_co2_value_${room}&no_attributes`;

    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer " + tokenschul,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    const extractedData = [];

    data.forEach((dataSet) => {
      dataSet.forEach((entry) => {
        const { state, last_changed } = entry;

        // Convert last_changed to JavaScript Date object for easier manipulation (if needed)
        // const lastChangedDate = new Date(last_changed);
        const timestamp = last_changed;

        // Erstelle ein Date-Objekt aus dem Zeitstempel
        const dateObj = new Date(timestamp);

        // Extrahiere die Stunden, Minuten und Sekunden
        const hours = dateObj.getUTCHours();
        const minutes = dateObj.getUTCMinutes();
        const seconds = dateObj.getUTCSeconds();

        // Formatiere die Uhrzeit
        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        extractedData.push({
          time: formattedTime,
          Co2: state, // Convert to ISO string format
          // You can add more properties from entry if needed
        });
      });
    });

    // console.log(data);

    console.log(extractedData);

    res.json(extractedData);
  } catch (error) {
    console.error(error);
  }
});

// Get History for Graph

app.get("/api/historygraph", async (req, res) => {
  try {
    console.log("Got request");

    const endTime = moment().toISOString();
    const startTime = moment().subtract(1, "hours").toISOString();

    let urls = [];

    a_sensoren.forEach((room) => {
      urls.push(
        `https://${hoip}/api/history/period/${startTime}?end_time=${endTime}&filter_entity_id=sensor.${room}_airsense_co2_value_${room},sensor.${room}_airsense_temperatur_von_dht_${room}&no_attributes`
      );
    });

    b_sensoren.forEach((room) => {
      urls.push(
        `https://${hoip}/api/history/period/${startTime}?end_time=${endTime}&filter_entity_id=sensor.${room}_airsense_co2_value_${room},sensor.${room}_airsense_temperatur_von_dht_${room}&no_attributes`
      );
    });

    const fetchPromises = urls.map(async (url) => {
      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + tokenschul,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data;
    });

    let data = await Promise.all(fetchPromises);

    // let formattedData = data.flat(); // or use any other formatting logic

    // console.log(JSON.stringify(formattedData, null, 2)); // Better logging

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Get all Sensors from DB and their Status

app.get("/api/getSensors", async (req, res) => {
  try {
    let query = `SELECT * FROM SensorNamen ORDER BY Name`;

    pool.query(query, async (err, result) => {
      if (err) {
        console.error(err);
        res.redirect("/login");
        return;
      }

      // console.log("Result: ", result);
      res.json(result);
    });
  } catch (e) {
    console.error("Error getting Sensors and their Status: " + e);
  }
});

// Change Status of Sensor in DB

app.post("/api/changeStatus", async (req, res) => {
  try {
    const query = `UPDATE SensorNamen SET Status = CASE WHEN Status = 0 THEN 1 ELSE 0 END WHERE Name = '${req.body.Name}'`;
    // console.log("Got Request for", query);

    pool.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error updating sensor status");
        return;
      }
      res.status(200).json({ message: "Status updated successfully" }); // Send a JSON response
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Server error");
  }
});

// Delete Sensor from DB

app.post("/api/deleteSensor", async (req, res) => {
  try {
    const query = `DELETE FROM SensorNamen WHERE Name = '${req.body.Name}'`;
    // console.log("Got Request for", query);

    pool.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error updating sensor status");
        return;
      }
      res.status(200).json({ message: "Status updated successfully" }); // Send a JSON response
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Server error");
  }
});

// Add Sensor to DB

app.post("/api/addSensor", async (req, res) => {
  try {
    const query = `INSERT INTO SensorNamen (Name, Status) VALUES ('${req.body.Name}', 0);`;
    // console.log("Got Request for", query);

    pool.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error updating sensor status");
        return;
      }
      res.status(200).json({ message: "Status updated successfully" }); // Send a JSON response
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Server error");
  }
});

// Test connection to HA-API

app.get("/api", async (req, res) => {
  try {
    const response = await fetch("https://" + hoip + "/api/", {
      headers: {
        Authorization: "Bearer " + tokenschul,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);

    res.json(data);
  } catch (e) {
    console.error("Fehler Test: " + e);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server läuft unter http://10.5.0.92:${port}/`);
});
