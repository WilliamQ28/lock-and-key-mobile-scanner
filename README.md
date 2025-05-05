# Lock & Key: Red Team Mobile Network Scanner

A mobile-first offensive security companion app that bridges user-friendly scanning interfaces with backend nmap execution and live vulnerability cross-referencing.

This project simulates the behavior of a red team reconnaissance tool, optimized for stealth and LAN-local operation. Built with React Native, Firebase, and a custom SSH-enabled Node.js backend, it enables controlled `nmap` execution, scan replay, CVE lookup, and tactical logging — all from a mobile interface.

---

## Features

- Run quick or advanced `nmap` scans via backend shell bridge
- Cross-reference results with CVE database (proof of concept)
- Geolocate scanned hosts (Google Maps API)
- Execute backend Metasploit commands via mobile shell
- Store logs and JSON-formatted scan outputs (Firebase)
- Stealth mode UI with light/dark toggle and vibration alert
- React Native app using Firebase Auth (email only)

---

## System Architecture

- Frontend: React Native app with multiple screens (Shell, Scan, Map, Settings, Logs)
- Backend: Node.js server (with SSH connection to a Kali VM)
- Command Execution: Predefined or user-submitted nmap and Metasploit commands via secure bridge
- Storage: Firebase Realtime DB for storing scan logs
- Visualization: Google Maps API for locating IPs

---

## Setup and Configuration

### Firebase Configuration

Replace the values in `src/firebaseConfig.js`:

```js
const firebaseConfig = {
  apiKey: "REPLACE_WITH_API_KEY",
  authDomain: "REPLACE_WITH_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_PROJECT_ID",
  storageBucket: "REPLACE_WITH_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_SENDER_ID",
  appId: "REPLACE_WITH_APP_ID"
};
```

Create your Firebase project at: https://console.firebase.google.com

---

### Backend SSH Configuration

Rename `config.example.js` to `config.js` and provide:

```js
module.exports = {
  kaliIP: "REPLACE_WITH_KALI_IP",
  sshUser: "REPLACE_WITH_USERNAME",
  sshPassword: "REPLACE_WITH_PASSWORD",
  nmapQuickCommand: "nmap -T4 -F 192.168.1.0/24",
  nmapAdvancedCommand: "nmap -T4 -A -v 192.168.1.0/24"
};
```

---

### Google Maps API Key

In `MapScreen.js`, replace:

```js
key=REPLACE_WITH_GOOGLE_MAPS_API_KEY
```

Create key at: https://console.cloud.google.com

---

## Screens

| Home / Scan | Logs | Map |
|-------------|------|-----|
| *(Insert Screenshot)* | *(Insert Screenshot)* | *(Insert Screenshot)* |

---

## Limitations

- App is a controller, not a native scanner (Expo limitations)
- CVE lookup is basic; no caching or fingerprinting yet
- Backend must be hosted securely on the same network or tunneled
- Project was developed under React Native-only constraints as required by IAT 359 course guidelines

---

## Contributions

This project was completed as part of a 2-person team.

- Qian ZhongJun (WilliamQ28)  
  Lead developer. Responsible for:
  - Full system architecture
  - All backend code (Node.js server, SSH bridge)
  - Firebase integration and React Native screen logic
  - App deployment and testing

- Riely Schina  
  Contributed:
  - Graphical assets and design
  - CVE lookup parsing logic (proof of concept)

All system integration, live data flow, and core functionality were engineered by Qian ZhongJun.

---

## Author

Qian ZhongJun (GitHub: [WilliamQ28](https://github.com/WilliamQ28))  
Built as part of coursework for IAT 359 — Simon Fraser University

---

## Security Notice

Do not use this tool on networks you do not own or have explicit authorization to test. This project is for educational and portfolio demonstration purposes only.

---

## License

This project is licensed under the MIT License. See `LICENSE` for details.