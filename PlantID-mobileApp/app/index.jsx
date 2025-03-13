import { useState } from "react";
import React from 'react';
import { TextInput, Button, View, Text, StyleSheet, KeyboardAvoidingView, Alert, ImageBackground, TouchableOpacity } from "react-native";  
import {auth} from './firebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, } from "firebase/auth";
import { useRouter } from "expo-router";

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const signUp = ()=> {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        
        const user = userCredential.user;
        //console.log('User signed up:', user);
        Alert.alert("Account successfully created");
        router.push('/mainScreen'); 
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error during sign up:', errorCode, errorMessage);
        Alert.alert("That email is already in use", /*errorMessage*/ ); 
      })
      
  };

  const signIn = () => {
    //console.log('Email:', email, 'Password:', password); 
    //console.log('Attempting to sign in...');
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Signed in successfully', /*userCredential*/);
        const user = userCredential.user;
       // console.log('User Info:', user);
       router.push('/mainScreen'); 
      })
      .catch((error) => {
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
      });
  };



  return (
    <ImageBackground source={require('../assets/images/background-image2.webp')} style={styles.container}>
    <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary} onPress={signUp}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  </ImageBackground>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover", 
  },
  formContainer: {
    width: '80%', 
    padding: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: "#000", 
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, 
    minHeight: 300,
  },
  input: {
    width: '100%',
    height: 50,
    marginBottom: 20,
    paddingLeft: 15,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50', 
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    
  },
  buttonSecondary: {
    backgroundColor: '#2196F3', 
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
