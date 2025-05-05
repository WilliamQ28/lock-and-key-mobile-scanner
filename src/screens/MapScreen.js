
import React, { useEffect, useState, useContext } from "react";
import { View, Text, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { db, auth } from "../firebaseConfig";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { ThemeContext } from "../ThemeContext";
import { getStyles } from "../styles";
import MapView, { Marker } from "react-native-maps";

const LogsMapScreen = () => {
  const [logs, setLogs] = useState([]);
  const [geoMarkers, setGeoMarkers] = useState([]); // Store markers for past scans
  const [selectedLog, setSelectedLog] = useState(null); // Store log for selected marker
  const [loading, setLoading] = useState(true); // Loading state
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  useEffect(() => {
    console.log("Fetching logs...");

    const fetchLogs = async () => {
      if (auth.currentUser) {
        const user = auth.currentUser;
        console.log("User authenticated:", user.uid);

        const logsRef = collection(db, "scanLogs");
        const q = query(logsRef, where("userId", "==", user.uid), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        const logsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched logs:", logsData);
        setLogs(logsData);

        // Extract geolocation markers from logs
        const markers = logsData
          .filter(log => log.publicGeolocation && log.publicGeolocation.lat && log.publicGeolocation.lng)
          .map(log => ({
            id: log.id,
            latitude: log.publicGeolocation.lat,
            longitude: log.publicGeolocation.lng,
            title: `Scan on ${new Date(log.timestamp?.toDate()).toLocaleString()}`,
            description: `${log.publicGeolocation.city}, ${log.publicGeolocation.region}, ${log.publicGeolocation.country}`,
            logData: log,
          }));

        console.log("Markers extracted for map:", markers);
        setGeoMarkers(markers);
      } else {
        console.log("User not authenticated.");
      }
      setLoading(false); // Stop loading when done
    };

    fetchLogs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Locations</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" style={{ marginVertical: 20 }} />
      ) : geoMarkers.length === 0 ? (
        <Text style={{ color: "red", textAlign: "center", marginVertical: 10 }}>
          No markers available. Check console logs.
        </Text>
      ) : (
        <Text style={{ color: "green", textAlign: "center", marginVertical: 10 }}>
          {geoMarkers.length} markers loaded.
        </Text>
      )}

      <View style={stylesm.mapContainer}>
        {geoMarkers.length > 0 ? (
          <MapView
            provider="google"
            apiKey="REPLACE_WITH_GOOGLE_MAPS_API_KEY" // Hardcoded API key for debugging
            style={stylesm.map}
            initialRegion={{
              latitude: geoMarkers[0]?.latitude || 49.2827,
              longitude: geoMarkers[0]?.longitude || -123.1207,
              latitudeDelta: 5,
              longitudeDelta: 5,
            }}
            onMapReady={() => console.log("Map is visibly rendering")}
            onRegionChangeComplete={(region) => console.log("Map moved to:", region)}
          >
            {geoMarkers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                title={marker.title}
                description={marker.description}
                onPress={() => {
                  console.log("Marker pressed:", marker);
                  setSelectedLog(marker.logData);
                }}
              />
            ))}
          </MapView>
        ) : (
          <Text style={{ color: "red", textAlign: "center", marginVertical: 20 }}>
            Map not displaying. Check API key or console logs.
          </Text>
        )}
      </View>

      {selectedLog && (
        <ScrollView style={styles.logContainer}>
          <Text style={styles.logTitle}>
            Scan Details for {selectedLog.publicGeolocation.city}, {selectedLog.publicGeolocation.region}
          </Text>
          <Text style={styles.logTimestamp}>
            📅 {new Date(selectedLog.timestamp?.toDate()).toLocaleString()}
          </Text>
          <Text style={styles.scanType}>
            🔍 Scan Type: {selectedLog.advanced ? "Advanced" : "Quick"}
          </Text>

          {selectedLog.results.map((device, idx) => (
            <View key={idx} style={styles.deviceContainer}>
              <Text style={styles.geoTitle}>
                🖥️ {device.ip} - {device.mac || "No MAC"}
              </Text>

              {device.services.map((service, svcIdx) => (
                <View key={svcIdx} style={styles.serviceContainer}>
                  <Text style={styles.serviceText}>
                    🔌 Port: {service.port} | ⚙️ Service: {service.service} | 🔍 Version: {service.version}
                  </Text>

                  {service.cves.length > 0 ? (
                    <View style={styles.cveContainer}>
                      <Text style={styles.cveTitle}>⚠️ CVEs Detected:</Text>
                      {service.cves.map((cve, cveIdx) => (
                        <Text key={cveIdx} style={styles.cveText}>
                          🛑 {cve.cve?.id || "Unknown CVE"} - {cve.cve?.descriptions?.[0]?.value || "No description available"}
                        </Text>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noCveText}>✅ No known vulnerabilities</Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

// Styles for Google Maps and Logs
const stylesm = {
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
    textAlign: "center",
  },
  mapContainer: {
    height: 400,
    width: Dimensions.get("window").width,
    marginBottom: -60,
  },
  map: {
    width: "100%",
    height: "80%",
  },
  logContainer: {
    padding: 10,
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 5,
  },
  logTimestamp: {
    color: "#BBB",
    fontSize: 14,
    marginBottom: 5,
  },
  scanType: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  deviceContainer: {
    backgroundColor: "#2E2E2E",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deviceTitle: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 14,
  },
};

export default LogsMapScreen;