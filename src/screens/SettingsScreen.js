

import React, { useContext } from "react";
import { View, Text, Switch } from "react-native";
import { ThemeContext } from "../ThemeContext";
import { getStyles } from "../styles";

const SettingsScreen = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
    <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Light Mode</Text>
            <Switch value={theme === "dark"} onValueChange={toggleTheme} />
            <Text style={styles.toggleLabel}>Dark Mode</Text>
          </View>
        </View>
  );
};

export default SettingsScreen;
