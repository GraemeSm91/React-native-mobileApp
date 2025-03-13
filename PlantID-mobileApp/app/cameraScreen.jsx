import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Button,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { db } from "./firebaseConfig";
import { collection, addDoc, setDoc, doc } from 'firebase/firestore'; 



function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo.uri); 
      setIsModalVisible(true); 

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission not granted');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords; 

      

      setCurrentLocation({ latitude, longitude });
      console.log(currentLocation)
    }
  };

  const handleIdentify = async () => {
    if (capturedPhoto) {
      try {
        setIsIdentifying(true);

        const startTime = Date.now();

        
        const base64Image = await FileSystem.readAsStringAsync(capturedPhoto, {
          encoding: FileSystem.EncodingType.Base64,
        });

        
        const response = await fetch(
          "",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: base64Image }),
          }
        );

        const endTime = Date.now();

      
      const latency = endTime - startTime;
      console.log(`Request Latency: ${latency} ms`);

        
        if (!response.ok) {
          console.error("Error in response:", response.statusText);
          return;
        }

        
        const rawText = await response.text();
        //console.log("Raw Response:", rawText);

        const result = JSON.parse(rawText);

        
        const predictions = result.prediction[0]; 

        
        const classNames = [
          "Aloevera",
          "Banana",
          "Bilimbi",
          "Cantaloupe",
          "Cassava",
          "Coconut",
          "Corn",
          "Cucumber",
          "Curcuma",
          "Eggplant",
          "Galangal",
          "Ginger",
          "Guava",
          "Kale",
          "Longbeans",
          "Mango",
          "Orange",
          "Paddy",
          "Papaya",
          "Pepper chili",
          "Pineapple",
          "Pomelo",
          "Shallot",
          "Soybeans",
          "Spinach",
          "Sweet potatoes",
          "Tobacco",
          "Waterapple",
          "Watermelon",
        ];

        
        const predictionsWithClassNames = predictions.map(
          (probability, index) => ({
            className: classNames[index],
            probability: probability,
          })
        );

        
        const sortedPredictions = predictionsWithClassNames.sort(
          (a, b) => b.probability - a.probability
        );

        
        const highestPrediction = sortedPredictions[0];

        
        const formattedProbability = !isNaN(highestPrediction.probability)
          ? (highestPrediction.probability * 100).toFixed(2) 
          : 0;

        setPredictionResult({
          className: highestPrediction.className,
          probability: formattedProbability,
          imageUri: capturedPhoto,
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("An error occurred while uploading the image.");
      } finally {
        setIsIdentifying(false); 
      }
    }

    setIsModalVisible(false); 
    setCapturedPhoto(null); 
  };

  const handleClosePredictionModal = () => {
    setPredictionResult(null); 
  };

  const handleDelete = () => {
    setIsModalVisible(false); 
    setCapturedPhoto(null); 
  };

  const handleSave = async () => {
    if (currentLocation) {
      try {
        const locationData = {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        };
  
        
        const docRef = await addDoc(collection(db, "coords"), locationData);

        
        console.log('Location saved to Firebase with ID:', docRef.id);
      } catch (error) {
        console.error('Error saving location to Firebase:', error.message);
      }
    } else {
      console.log('No location data available to save');
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
           <FontAwesome name="camera" size={40} color="#fff" />
          </TouchableOpacity>
        </View>
      </CameraView>

      
      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={handleIdentify}>
              <Text style={styles.modalButtonText}>Identify</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={isIdentifying} transparent={true}>
        <View style={styles.identifyingModalContainer}>
          <Text style={styles.identifyingText}>Identifying...</Text>
          <Text style={styles.identifyingText}>This may take a moment</Text>
        </View>
      </Modal>
      <Modal visible={!!predictionResult} transparent={true}>
        <View style={styles.resultModalContainer}>
          {predictionResult && (
            <>
              <Image
                source={{ uri: predictionResult.imageUri }}
                style={styles.resultImage}
              />
              <Text style={styles.resultTitle}>Prediction Result</Text>
              <Text style={styles.predictionText}>
                <Text style={styles.classNameText}>
                  {predictionResult.className}:{" "}
                </Text>
                <Text style={styles.probabilityText}>
                  {predictionResult.probability}%
                </Text>
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton}>
                  <Text style={styles.modalButtonText} onPress={handleSave} >Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleClosePredictionModal}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)", 
  },
  previewImage: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    width: "80%",
  },

  modalButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 3,
    marginHorizontal: 10,
  },

  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  resultModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
  },
  resultTitle: {
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#ffffff", 
    marginBottom: 15, 
    textAlign: "center", 
  },

  predictionText: {
    fontSize: 22, 
    color: "#ffffff", 
    textAlign: "center", 
    marginBottom: 10, 
  },

  classNameText: {
    fontWeight: "bold", 
    color: "#2196F3", 
  },

  probabilityText: {
    fontWeight: "bold", 
    color: "#ffeb3b", 
  },
  resultImage: {
    width: "50%",
    height: "50%", 
    resizeMode: "contain",
    marginBottom: 20,
  },
  identifyingModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)", 
    padding: 40, 
  },
  identifyingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10, 
  },
});
