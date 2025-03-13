import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";

function PhotoScreen() {
  const router = useRouter();

  function openCamera() {
    router.push("/cameraScreen");
  }

  return (
    <ImageBackground
      style={styles.main}
      source={require("../assets/images/background-image3.webp")}
    >
      <View style={styles.boxContainer}>
      <Text style={styles.titleText}>How to Identify a Plant</Text>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionItem}>
            1. Click the button below to open the camera.
          </Text>
          <Text style={styles.instructionItem}>
            2. Take a photograph of the plant you want to identify.
          </Text>
          <Text style={styles.instructionItem}>
            3. Click the "Identify" button.
          </Text>
          <Text style={styles.instructionItem}>
            4. Wait a few moments for the results to display.
          </Text>
        </View>
        <TouchableOpacity
          onPress={openCamera} 
          style={styles.openCameraButton}
        >
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

export default PhotoScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  boxContainer: {
    backgroundColor: "#f0f0f0", 
    borderRadius: 15, 
    padding: 25, 
    alignItems: "center", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, 
  },
  titleText: {
    fontSize: 22, 
    fontWeight: "600", 
    color: "#333", 
    textAlign: "center", 
    marginBottom: 15, 
  },
  openCameraButton: {
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    backgroundColor: "#007BFF", 
    borderRadius: 8, 
  },
  buttonText: {
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold", 
  },
  instructionsContainer: {
    alignSelf: 'flex-start', 
    marginBottom: 20, 
  },
  instructionItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10, 
  },
});
