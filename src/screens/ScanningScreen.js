import React, { useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  Switch,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import { ThemeContext } from "../ThemeContext";
import { getStyles } from "../styles";

const BASE_URLTEST =
  "https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=10&startIndex=0&keywordSearch=";

const ScanningScreen = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [scanResults, setScanResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedIP, setExpandedIP] = useState(null);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [exploitResults, setExploitResults] = useState([]);
  const [selectedIP, setSelectedIP] = useState("");

  // Scan Handler
  const handleScan = async () => {
    setLoading(true);
    setScanResults([]);
    setExploitResults([]);

    try {
      const response = await fetch(
        `"http://REPLACE_WITH_BACKEND_IP:PORT/scan?advanced=${isAdvanced}`
      );
      const data = await response.json();

      // Parse Nmap output and fetch CVEs for detected services
      const parsedResults = parseNmapOutput(data.output, isAdvanced);
      const resultsWithCVE = await fetchCVEsForServices(parsedResults);
      setScanResults(resultsWithCVE);

      console.log("Scan completed successfully.");
    } catch (error) {
      console.error("Error:", error);
      setScanResults([{ ip: "Error", mac: "Failed to scan", services: [] }]);
    }
    setLoading(false);
  };

  // Run Exploit with Better Payload Search
  const runExploit = async (ip, service, version) => {
    console.log(`Searching for exploits for ${service} or ${version} on ${ip}`);
    setLoading(true);
    setExploitResults([]);
    setSelectedIP(ip);

    try {
      // Select the longer string to search Metasploit
      const searchTerm =
        version && version.trim().length > service.trim().length
          ? version.trim()
          : service.trim();

      const response = await fetch("http://10.84.109.235:5000/scan-payloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceName: service,
          serviceVersion: version,
          targetIP: ip,
        }),
      });

      const data = await response.json();

      if (data.error || !data.exploits || data.exploits.length === 0) {
        setExploitResults([
          { name: "No Exploit Found", description: "No matching exploits available" },
        ]);
        setLoading(false);
        return;
      }

      // Auto-run single exploit if only one result is found
      if (data.exploits.length === 1) {
        await runSelectedExploit(ip, data.exploits[0].name);
      } else {
        setExploitResults(data.exploits);
      }
    } catch (error) {
      console.error("Error fetching exploits:", error);
      Alert.alert("Error", "Failed to retrieve available exploits.");
    } finally {
      setLoading(false);
    }
  };

  // Run the Selected Exploit on the Target IP
  const runSelectedExploit = async (ip, exploitName) => {
    Alert.alert(
      "Confirm Exploit",
      `Run ${exploitName} against ${ip}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Run",
          onPress: async () => {
            console.log(`Running exploit: ${exploitName} on ${ip}`);
            setLoading(true);
  
            try {
              // Navigate to ShellScreen with the selected exploit
              navigation.navigate("ShellScreen", {
                targetIP: ip,
                targetPort: "445", // Change if dynamic port detection is needed
                selectedExploit: exploitName, // Pass the selected exploit dynamically
              });
            } catch (error) {
              console.error("Error executing exploit:", error);
              Alert.alert("Error", "Failed to execute exploit.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };  

  // Parse Nmap Output
  const parseNmapOutput = (output, advanced) => {
    if (!output || typeof output !== "string") {
      console.error("parseNmapOutput received invalid output:", output);
      return [];
    }

    const lines = output.split("\n");
    const results = [];
    let currentEntry = { ip: "", mac: "", services: [], os: "", traceroute: [] };

    lines.forEach((line) => {
      if (line.startsWith("Nmap scan report for")) {
        if (currentEntry.ip) results.push(currentEntry);
        currentEntry = {
          ip: line.split(" ")[4],
          mac: "",
          services: [],
          os: "",
          traceroute: [],
        };
      } else if (line.includes("MAC Address:")) {
        const parts = line.split("MAC Address: ")[1].split(" ");
        currentEntry.mac = parts[0];
      } else if (/^\d+\/tcp\s+open/.test(line)) {
        const parts = line.trim().split(/\s+/);
        const port = parts[0];
        const service = parts[2];
        const version = parts.slice(3).join(" ") || "Unknown";
        currentEntry.services.push({ port, service, version });
      }
    });

    if (currentEntry.ip) results.push(currentEntry);
    return results;
  };

  // Fetch CVEs for Detected Services
  const fetchCVEsForServices = async (scanData) => {
    const updatedResults = await Promise.all(
      scanData.map(async (device) => {
        const updatedServices = await Promise.all(
          device.services.map(async (service) => {
            try {
              let searchTerm = service.service;
              searchTerm = encodeURIComponent(searchTerm);
              const response = await axios.get(BASE_URLTEST + searchTerm);
              const cveData = response.data.vulnerabilities || [];
              return { ...service, cves: cveData };
            } catch (error) {
              return { ...service, cves: [] };
            }
          })
        );
        return { ...device, services: updatedServices };
      })
    );
    return updatedResults;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Scanner</Text>

      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Quick Scan</Text>
        <Switch value={isAdvanced} onValueChange={setIsAdvanced} />
        <Text style={styles.toggleLabel}>Advanced Scan</Text>
      </View>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleScan}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Scanning..." : "Start Scan"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={scanResults}
        keyExtractor={(item, index) => item.ip + index}
        renderItem={({ item }) => (
          <View style={styles.resultContainer}>
            <Text style={styles.deviceText}>
              {item.ip} - {item.mac || "No MAC"}
            </Text>

            <FlatList
              data={item.services}
              keyExtractor={(service, idx) => service.port + idx}
              renderItem={({ item: service }) => (
                <View style={styles.serviceContainer}>
                  <Text style={styles.serviceText}>
                    Port: {service.port} | Service: {service.service} | Version:{" "}
                    {service.version || "Unknown"}
                  </Text>
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => runExploit(item.ip, service.service, service.version)}
                  >
                    <Text style={styles.buttonText}>Run Exploit on {item.ip}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
      />

      {exploitResults.length > 0 && (
        <ScrollView style={styles.resultContainer}>
          <Text style={styles.title}>
            {exploitResults[0].name === "No Exploit Found"
              ? "No Exploits Found for this Service"
              : "Available Exploits:"}
          </Text>

          {exploitResults.map((exploit, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.buttonContainer,
                exploit.name === "No Exploit Found" ? styles.disabledButton : {},
              ]}
              onPress={() =>
                exploit.name !== "No Exploit Found" &&
                runSelectedExploit(selectedIP, exploit.name)
              }
              disabled={exploit.name === "No Exploit Found"}
            >
              <Text style={styles.buttonText}>
                {exploit.name === "No Exploit Found" ? "No Exploit Available" : exploit.name}
              </Text>
              <Text style={styles.exploitDescription}>{exploit.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {loading && <ActivityIndicator size="large" color="#007AFF" />}
    </View>
  );
};

export default ScanningScreen;
