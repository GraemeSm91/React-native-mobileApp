import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { db } from "./firebaseConfig";
import { getDocs, collection, getDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";

function MapScreen() {
  const [coordinates, setCoordinates] = useState([]);
  const [showPins, setShowPins] = useState(false);

 


  const fetchCoordinates = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "coords")); 
      console.log("Query snapshot size:", querySnapshot.size);
      const fetchedCoordinates = querySnapshot.docs.map((doc) => {
        const data = doc.data(); 
        return {
          id: doc.id, 
          latitude: data.latitude, 
          longitude: data.longitude,
        };
      });
  

      console.log("Fetched coordinates:", fetchedCoordinates); 
      setCoordinates(fetchedCoordinates);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  }; 

  /*const exampleCoordinates = [
    { id: '1', latitude: 56.39544115526302, longitude: -3.4312443748595127 },
    { id: '2', latitude: 56.39415826814717, longitude: -5.842856162767132 },
    { id: '3', latitude: 52.39751389393976, longitude: -3.265807656375911 },
    { id: '4', latitude: 51.17053082592372, longitude: 0.8449096526271801 },
  ]; */


  useEffect(() => {
    if (showPins) {
      fetchCoordinates(); 
    }
  }, [showPins]);

  const togglePins = () => {
    setShowPins(!showPins);
  };

  return (
    <ImageBackground
    source={require("../assets/images/background-image.webp")}
    style={styles.main}
    ><View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 54.526,
          longitude: -2.255,
          latitudeDelta: 10.5,
          longitudeDelta: 8,
        }}
      >
        {showPins &&
          coordinates.map((coord) => (
            <Marker
              key={coord.id} // Use a unique key for each marker
              coordinate={{
                latitude: coord.latitude,
                longitude: coord.longitude,
              }}
              
            />
          ))}
      </MapView>
      </View>
      <TouchableOpacity style={styles.button} onPress={togglePins}>
        <Text style={styles.buttonText}>
          {showPins ? "Hide Plants" : "Show Plants"}
        </Text>
      </TouchableOpacity>
      
    </ImageBackground>
  );
}

export default MapScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapContainer: {
    width: '80%', 
    height: '80%', 
    borderWidth: 2, 
    borderColor: 'black', 
    borderRadius: 5, 
    overflow: 'hidden', 
  },
  map: {
    flex:1,
  },
  button: {
    marginTop: 20, 
    backgroundColor: "#007BFF", 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 5, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3, 
  },
  buttonText: {
    color: "#FFFFFF", 
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
