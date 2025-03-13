import { View, Text, StyleSheet, Button, ImageBackground, TouchableOpacity, Image} from "react-native";
import { useRouter } from "expo-router";

function MainScreen() {
  const router = useRouter();
  const { location, error, updateLocation, setError } = useContext(GeoContext);

  useEffect(() => {
    (async () => {
      try {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied.");
          return;
        }

        
        let currentLocation = await Location.getCurrentPositionAsync({});
        updateLocation(currentLocation.coords);
      } catch (err) {
        setError("An error occurred while fetching location.");
      }
    })();
  }, []);


  function navToMap() {
    router.push("/mapScreen");
  }

  function navToPhoto() {
    router.push("/photoScreen");
  }

  return (
    <ImageBackground
      source={require("../assets/images/background-image.webp")}
      style={styles.container}
    >
      
      <Text style={styles.title}>BotanInsight</Text>
      <Image 
        source={require("../assets/images/logo3.png")} 
        style={styles.logo}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={navToMap}>
          <Text style={styles.buttonText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navToPhoto}>
          <Text style={styles.buttonText}>Photo</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',  
    alignItems: 'center',
    padding: 10,  
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fffg',
    marginTop: 10, 
    marginBottom:50, 
  },
  logo: {
    width: 120,  
    height: 120, 
    borderRadius: 60, 
    marginBottom: 50,
    marginTop: 50, 
  },
  buttonContainer: {
    width: '80%',  
    marginBottom: 50,
    justifyContent: 'space-evenly',  
    height: '25%'  
  },
  button: {
    backgroundColor: '#4FA3D1',  
    borderRadius: 10,  
    paddingVertical: 15,  
    paddingHorizontal: 30, 
    alignItems: 'center',  
    marginVertical: 10,  
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, 
  },
  buttonText: {
    fontSize: 18, 
    color: '#fff',  
    fontWeight: 'bold',
  }  
  
});
