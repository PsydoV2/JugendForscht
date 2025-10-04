# 🌬️ AirSense

> **Ein Jugend-forscht-Projekt zur Messung und Visualisierung der Luftqualität in Klassenräumen**

<!-- ![AirSense Banner](./assets/banner.png)  -->

---

## 🧠 Projektidee

Klassenzimmer haben oft eine schlechte Luftqualität, was Konzentration und Wohlbefinden beeinträchtigt.  
**AirSense** misst in Echtzeit die Luftqualität über CO₂- und Temperatursensoren und zeigt die Werte live im Browser an.  
So kann einfach erkannt werden, wann gelüftet werden sollte – oder ob ein Raum dauerhaft schlecht belüftet ist.

---

## 🧩 Systemarchitektur

### 🔹 Sensor-Hardware

- Mehrere **ESP32/ESP8266**-Mikrocontroller mit CO₂- und Temperatur-/Feuchtigkeitssensoren
- Verbindung über **WLAN** mit einem zentralen **HomeAssistant (HA)**-Server
- Jeder Sensor überträgt Messwerte regelmäßig an HA über dessen API

### 🔹 Backend (Node.js + Express + MySQL)

Das Backend dient als Vermittler zwischen HomeAssistant und der Website:

- Ruft Live- und Verlaufsdaten von HomeAssistant über REST-API ab
- Speichert Sensorstatus und Namen in einer **MySQL-Datenbank**
- Bietet REST-Endpunkte an, z. B.:
  - `GET /api/data/a` & `GET /api/data/b` → Live-Daten der Schulgebäude A & B
  - `POST /api/history` → CO₂-Verlauf eines Raumes
  - `GET /api/getSensors`, `POST /api/addSensor`, `POST /api/changeStatus`, `POST /api/deleteSensor` → Verwaltung der Sensoren
- Authentifizierung über HA-API-Token

### 🔹 Frontend (React + TypeScript)

Die Website zeigt Messwerte und Diagramme übersichtlich an:

- **LandingPage:** Projektbeschreibung und Navigation:contentReference[oaicite:0]{index=0}
- **Live-Dashboard:** Aktuelle Messwerte, Diagramme, Offline-Status:contentReference[oaicite:1]{index=1}:contentReference[oaicite:2]{index=2}
- **Adminbereich:** Sensoren hinzufügen, löschen und aktivieren:contentReference[oaicite:3]{index=3}
- **Dark-/Light-Mode** mit modernem UI-Design:contentReference[oaicite:4]{index=4}

Das Frontend aktualisiert sich regelmäßig automatisch durch Anfragen an das Backend.

---

## 🧱 Verwendete Technologien

| Bereich           | Technologie                               |
| ----------------- | ----------------------------------------- |
| Hardware          | ESP8266 / ESP32, DHT22, MH-Z19            |
| Datenverarbeitung | HomeAssistant API                         |
| Backend           | Node.js, Express, MySQL                   |
| Frontend          | React + TypeScript, NextUI, Tremor Charts |
| Design            | Light/Dark Theme, Responsive Layout       |

---

## ⚙️ Funktionsweise

1. **Sensor misst** CO₂ und Temperatur.
2. **HomeAssistant** empfängt und speichert die Werte.
3. Das **Node.js-Backend** holt aktuelle Daten ab und bereitet sie auf.
4. Das **Frontend** zeigt die Werte live mit Diagrammen und Warnmeldungen.
5. Über das **Admin-Panel** können Sensoren verwaltet werden.

---

## 🚀 Installation

### Backend starten

```bash
cd server
npm install
node server.js
```

### Frontend starten

```bash
cd frontend
npm install
npm start
```

> Standardmäßig läuft das Backend auf Port **3000**
> Das Frontend greift über `http://localhost:3000` darauf zu.

---

## 🌍 Ziel & Nutzen

- Verbesserung der **Raumluftqualität** in Schulen
- Bewusstsein für **gesunde Lernumgebungen** schaffen
- Verbindung von **IoT, Software und Umwelttechnik**
- Basis für zukünftige Projekte (z. B. automatische Fenstersteuerung)

---

## 🖼️ Vorschau

![Screenshot der Oberfläche](./assets/screenshot.png) <!-- optional: Screenshot deiner Weboberfläche -->

---

## 📜 Lizenz

Dieses Projekt entstand im Rahmen von _Jugend forscht_ und steht zu Lern- und Demonstrationszwecken unter der **MIT-Lizenz**.

---

## 💡 Fazit

AirSense zeigt, wie sich mit Mikrocontrollern, etwas Code und Teamarbeit ein komplettes Echtzeit-Messsystem entwickeln lässt, das Daten aus der realen Welt erfasst, verarbeitet und visuell aufbereitet — ein gelungenes Beispiel für angewandte Informatik im Schulkontext.
