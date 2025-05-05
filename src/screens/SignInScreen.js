
import React, { useState, useContext } from "react";
import { Button, StyleSheet,TouchableOpacity, Image, Text, TextInput, View } from "react-native";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ThemeContext } from "../ThemeContext";
import { getStyles } from "../styles";
//const imagePath = require("./assets/Lock&Key.png");

export default function SignInScreen() {
  // State variables to track email and password inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // our authentication, initialized in the beginning
  //const auth = firebase_auth;

  const handleSignUp = async () => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert("Sign up success. User: " + email + " signed up.");
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert("User: " + email + " signed in");
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>

      
      <Text style={styles.header}>Lock & Key</Text>
      <Text style={styles.subHeader}>Network Check</Text>

      <Image
        style={styles.logo}
        source={require(
          '../../assets/Lock&Key.png',
  )}
      />

      <TextInput
        style={styles.inputText}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.inputText}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleSignUp}>
          <Text style ={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSignIn}>
          <Text style ={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
    </View>
  );
}
