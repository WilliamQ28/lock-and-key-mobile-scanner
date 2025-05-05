
import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { db, auth } from "../firebaseConfig";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { ThemeContext } from "../ThemeContext";
import { getStyles } from "../styles";

const LogsScreen = () => {
  const [logs, setLogs] = useState([]);
  const [expandedLogIndex, setExpandedLogIndex] = useState(null);
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme); // Apply dynamic styles based on theme

  useEffect(() => {
    const fetchLogs = async () => {
      if (auth.currentUser) {
        const user = auth.currentUser;
        const logsRef = collection(db, "scanLogs");

        const q = query(
          logsRef,
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(q);
        const logsData = querySnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        setLogs(logsData);
      }
    };

    fetchLogs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Logs</Text>

      {/* Collapsible Logs List */}
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.logItem}>
            <TouchableOpacity onPress={() => setExpandedLogIndex(expandedLogIndex === index ? null : index)}>
              <Text style={styles.logHeader}>
                {new Date(item.timestamp?.toDate()).toLocaleString()} - Tap to {expandedLogIndex === index ? "collapse" : "expand"}
              </Text>
            </TouchableOpacity>

            {expandedLogIndex === index && (
              <View style={styles.details}>
                <Text style={styles.scanType}>Scan Type: {item.advanced ? "Advanced" : "Quick"}</Text>

                {item.publicGeolocation && (
                  <View style={styles.geoContainer}>
                    <Text style={styles.geoTitle}>Public Geolocation</Text>
                    <Text style={styles.geoText}>{item.publicGeolocation.city}, {item.publicGeolocation.region}, {item.publicGeolocation.country}</Text>
                    <Text style={styles.geoText}>{item.publicGeolocation.timezone}</Text>
                    <Text style={styles.geoText}>ISP: {item.publicGeolocation.isp}</Text>
                    <Text style={styles.geoText}>Proxy: {item.publicGeolocation.proxy ? "Yes" : "No"}</Text>
                    <Text style={styles.geoText}>Hosting: {item.publicGeolocation.hosting ? "Yes" : "No"}</Text>
                  </View>
                )}

                {item.results.map((device, idx) => (
                  <View key={idx} style={styles.deviceContainer}>
                    <Text style={styles.geoTitle}>{device.ip} - {device.mac || "No MAC"}</Text>

                    {device.services.map((service, svcIdx) => (
                      <View key={svcIdx} style={styles.serviceContainer}>
                        <Text style={styles.serviceText}>Port: {service.port} | Service: {service.service} | Version: {service.version}</Text>

                        {service.cves.length > 0 ? (
                          <View style={styles.cveContainer}>
                            <Text style={styles.cveTitle}>⚠️ CVEs Detected:</Text>
                            {service.cves.map((cve, cveIdx) => (
                              <Text key={cveIdx} style={styles.cveText}>
                                {cve.cve?.id || "Unknown CVE"} - {cve.cve?.descriptions?.[0]?.value || "No description available"}
                              </Text>
                            ))}
                          </View>
                        ) : (
                          <Text style={styles.noCveText}>No known vulnerabilities</Text>
                        )}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default LogsScreen;

