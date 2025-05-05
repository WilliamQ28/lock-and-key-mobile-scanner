
import React, { useEffect, useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "./src/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { ThemeProvider, ThemeContext } from "./src/ThemeContext";
import { getStyles } from "./src/styles";

// Import Screens
import SignInScreen from "./src/screens/SignInScreen";
import ScanningScreen from "./src/screens/ScanningScreen";
import MapScreen from "./src/screens/MapScreen";
import LogsScreen from "./src/screens/LogsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import ShellScreen from "./src/screens/ShellScreen";

// Navigation components
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AuthProvider />
      </NavigationContainer>
    </ThemeProvider>
  );
}

// **Authentication State Provider**
const AuthProvider = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  return user ? <AppDrawer /> : <AuthStack />;
};

// **Drawer Navigation (Visible After Login)**
const AppDrawer = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <Drawer.Navigator
      screenOptions={{
        //headerStyle: { backgroundColor: theme === "dark" ? "#333" : "#007BFF" },
        //headerTintColor: theme === "dark" ? "#FFF" : "#000",
        headerStyle: { backgroundColor: theme === "dark" ? "#000000" : "#48E5C2" },
        headerTintColor: theme === "dark" ? "#FFF" : "#000",
        drawerStyle: {
          backgroundColor: theme === "dark" ? "#5e5e5e" : "#FFFFFF",
          
        },
        drawerLabelStyle: {
          color: theme === "dark" ? "#FFFFFF" : "#000000",

        },
      }}
    >
      <Drawer.Screen name="Scanner" component={ScanningScreen} />
      <Drawer.Screen name="Logs" component={LogsScreen} />
      <Drawer.Screen name="Map" component={MapScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Shell" component={ShellScreen} />
      <Drawer.Screen name="Logout" component={LogoutScreen} />
      
    </Drawer.Navigator>
  );
};

// **Authentication Stack (Only for Login)**
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
    </Stack.Navigator>
  );
};

// **Logout Screen (Handles Sign-Out)**
const LogoutScreen = ({ navigation }) => {
  useEffect(() => {
    signOut(auth).then(() => {
      navigation.replace("SignIn"); // Navigate back to login after logout
    });
  }, []);

  return (
    <View style={styles.centered}>
      <Text style={styles.loadingText}>Logging out...</Text>
      <ActivityIndicator size="large" color="red" />
    </View>
  );
};

// **Basic Styles**
const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 18, marginTop: 10 },
});


