
import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { ThemeContext } from "../ThemeContext";
import { getStyles } from "../styles";

const BACKEND_URL = "http://REPLACE_WITH_BACKEND_IP:PORT/run-command"; // Correct IP

const ShellScreen = ({ route, navigation }) => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const { targetIP = null, targetPort = null, selectedExploit = "" } = route.params || {};

  const [isSessionValid, setIsSessionValid] = useState(!!targetIP && !!targetPort);
  const [command, setCommand] = useState(
    isSessionValid
      ? `use ${selectedExploit}; set RHOST ${targetIP}; set RPORT ${targetPort};`
      : ""
  );

  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!targetIP || !targetPort || !selectedExploit) {
      setIsSessionValid(false);
    }
  }, [targetIP, targetPort, selectedExploit]);

  const runCommand = async () => {
    if (!isSessionValid) {
      setOutput("No active exploitation session. Scan or trigger MSF first.");
      return;
    }

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });

      const data = await response.json();
      if (data.result && data.result.includes("Session created")) {
        setIsSessionValid(true);
        setOutput(data.result);
      } else {
        setOutput(data.result || "No response from server.");
      }
    } catch (error) {
      console.error(error);
      setOutput("Error: Unable to contact backend.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Metasploit Shell</Text>

      {!isSessionValid && (
        <Text style={styles.errorText}>
          No active exploitation session. Scan or trigger MSF first.
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter MSF/Custom Command if Valid Session"
        value={command}
        editable={isSessionValid}
        onChangeText={(text) => setCommand(text)}
      />
      <TouchableOpacity
        style={[
          styles.buttonContainer,
          !isSessionValid && { backgroundColor: "#888" },
        ]}
        onPress={runCommand}
        disabled={!isSessionValid}
      >
        <Text style={styles.buttonText}>
          {isSessionValid ? "Run Command" : "Session Required"}
        </Text>
      </TouchableOpacity>

      <ScrollView style={styles.outputContainer}>
        <Text style={styles.outputText}>{output}</Text>
      </ScrollView>
    </View>
  );
};

export default ShellScreen;
