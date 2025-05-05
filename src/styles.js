import { StyleSheet, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

const themes = {
  light: {
    background: "#FFFFFF",
    text: "#000000",
    inputText: "#000000",
    inputBack: "#F5F5F5",
    buttonColor: "#48E5C2",
    buttonText: "#FFFFFF",
    titleColor: "#48E5C2",
    geoBack: "#F9F9F9",
    geoText: "#333333",
    resultBack: "#F8F8F8",
  },
  dark: {
    background: "#212121",
    text: "#FFFFFF",
    inputText: "#FFFFFF",
    inputBack: "#333333",
    buttonColor: "#000000",
    buttonText: "#FFFFFF",
    titleColor: "#FFFFFF",
    geoBack: "#2C2C2C",
    geoText: "#FFFFFF",
    resultBack: "#2C2C2C",
  },
};

export const getStyles = (theme) => {
  const selectedTheme = themes[theme] || themes.light; // Default to light theme

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: selectedTheme.background,
      color: selectedTheme.text,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    settingsContainer: {
      flex: 1,
      backgroundColor: selectedTheme.background,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    setting: {
      backgroundColor: selectedTheme.geoBack,
      color: selectedTheme.text,
      padding: 15,
      borderRadius: 8,
      marginVertical: 10,
      width: width * 0.8, // Responsive width
    },
    text: {
      color: selectedTheme.text,
      fontSize: 18,
      marginBottom: 20,
      textAlign: "center",
    },
    buttonText: {
      color: selectedTheme.buttonText,
      fontSize: 18,
      textAlign: "center",
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    toggleContainer: {
      flexDirection: "row",
      alignItems: "center",
      color: selectedTheme.text,
    },
    switchLabel: {
      color: selectedTheme.text,
      margin: 10,
      fontSize: 18,
      fontWeight: '600',
    },
    toggleLabel: {
      color: selectedTheme.text,
      margin: 10,
      fontSize: 16,
      fontWeight: '600',
    },
    header: {
      color: selectedTheme.titleColor,
      fontSize: 36,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
    },
    subHeader: {
      color: selectedTheme.titleColor,
      fontSize: 28,
      marginBottom: 20,
      fontWeight: "600",
      textAlign: "center",
    },
    logo: {
      width: '80%',
      height: 150,
      resizeMode: "contain",
      marginBottom: 20,
    },
    inputText: {
      color: selectedTheme.inputText,
      backgroundColor: selectedTheme.inputBack,
      height: 45,
      width: '80%',
      borderColor: "#ccc",
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 12,
      borderRadius: 6,
      fontSize: 16,
    },
    buttonContainer: {
      paddingVertical: 15,
      backgroundColor: selectedTheme.buttonColor,
      width: '80%',
      borderRadius: 6,
      marginVertical: 12,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: selectedTheme.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
    },
    geoContainer: {
      padding: 15,
      backgroundColor: selectedTheme.geoBack,
      width: '80%',
      borderRadius: 6,
      marginVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    geoText: {
      fontSize: 14,
      color: selectedTheme.geoText,
    },
    footer: {
      color: "#888",
      marginTop: 30,
      textAlign: "center",
      fontSize: 12,
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      marginVertical: 20,
      textAlign: "center",
      color: selectedTheme.text,
    },
    logTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 20,
      textAlign: "center",
      color: selectedTheme.text,
    },
    logTimeStamp: {
      fontSize: 12,
      color: selectedTheme.geoText,
      marginVertical: 5,
    },
    logItem: {
      marginBottom: 15,
      padding: 12,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 6,
      color: selectedTheme.geoText,
      backgroundColor: selectedTheme.inputBack,
    },
    logHeader: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#007BFF",
    },
    details: {
      marginTop: 10,
    },
    scanType: {
      fontWeight: 'bold',
      color: selectedTheme.geoText,
      fontSize: 14,
    },
    geoTitle: {
      fontWeight: 'bold',
      color: selectedTheme.geoText,
      fontSize: 14,
    },
    deviceContainer: {
      marginBottom: 10,
    },
    deviceText: {
      fontSize: 16,
      fontWeight: "bold",
      color: selectedTheme.text,
    },
    logTimestamp: {
      fontSize: 14,
      fontWeight: "bold",
      color: selectedTheme.text,
    },
    serviceContainer: {
      marginLeft: 10,
      marginBottom: 15,
      padding: 12,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      backgroundColor: selectedTheme.resultBack,
    },
    serviceText: {
      fontSize: 14,
      color: selectedTheme.text,
    },
    cveText: {
      fontSize: 14,
      color: "red",
    },
    cveTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 20,
      textAlign: "center",
      color: selectedTheme.text,
    },
    cveCount: {
      fontSize: 22,
      fontWeight: 'bold',
      color: selectedTheme.text,
    },
    noCveText: {
      fontSize: 12,
      color: "green",
    },
    resultContainer: {
      marginBottom: 15,
      padding: 12,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      backgroundColor: selectedTheme.resultBack,
    },
    cveContainer: {
      marginBottom: 15,
      padding: 12,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      backgroundColor: selectedTheme.resultBack,
    },
    detailsContainer: {
      marginBottom: 15,
      padding: 12,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      backgroundColor: selectedTheme.resultBack,
    },
    advancedText: {
      fontSize: 14,
      color: selectedTheme.text,
    },
    errorText: {
      color: "red",
      fontSize: 16,
      marginVertical: 10,
      textAlign: "center",
      fontWeight: "bold",
    },
    
  });
};


