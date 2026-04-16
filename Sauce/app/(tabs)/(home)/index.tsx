import { View, Text, Button, TouchableOpacity, StyleSheet, Image} from 'react-native'
import { useRouter, useFocusEffect} from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

// Imported locations in order to display them on this page through [id]
import { defaultLocations } from '../search' 
import { useState } from 'react'



export default function Home() {
  const router = useRouter()

  // Needed for [ID] to display specific info
  const location = defaultLocations[0];
  
  // Holds the current featured location on the page
  const [featuredLocation, setFeaturedLocation] = useState(defaultLocations[0]);
  
  /* 
  Every time the user switches tab, the location changes
  Also using random as a way to change the location from the number of locations
   */
  useFocusEffect(() => {
    const randomIndex = Math.floor(Math.random() * defaultLocations.length);

    // State updated randomly selected location
    setFeaturedLocation(defaultLocations[randomIndex]);
  
    // cleanup
    return undefined;
  });

  return (
    <View style={styles.container}>
    <View style={styles.headerRow}>
      <Text style={styles.headText}>Welcome, User!</Text>

      <TouchableOpacity
        onPress={() => router.push("../(home)/settings")}
        style={styles.iconButton}
      >
        <Ionicons name="settings-sharp" size={32} color="black" />
      </TouchableOpacity>
    </View>

    <Text style={styles.introText}>
      Discover local restaurant's in the Charleston Area!
    </Text>

    <TouchableOpacity
        style={styles.searchButton}
        onPress={() => router.push("../search")}
      >
        <Text style={styles.searchText}>Search</Text>
      </TouchableOpacity>

    <Text style={styles.locationText}> Random Restaurant </Text>

    

    {featuredLocation && (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/details/[id]",
          params: {
            id: featuredLocation.id,
            name: featuredLocation.name,
            description: featuredLocation.description,
            latitude: featuredLocation.latitude.toString(),
            longitude: featuredLocation.longitude.toString(),
        },
      })
    }
  >
    <Text style={styles.cardTitle}>
      {featuredLocation.name}
    </Text>
  </TouchableOpacity>
)}

  </View>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  paddingTop: 20,
  paddingHorizontal: 15,
},
headerRow: {
  flexDirection: 'row', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  paddingBottom: 20,
},
headText: {
  fontSize: 40,
  fontStyle: 'italic',
},
iconButton: {
  padding: 5, 
},
introText: {
  fontSize: 20,
},
searchButton: {
  backgroundColor: '#660000', 
  borderRadius: 180,
  alignItems: 'center',
  justifyContent: 'center',
  width: 250,
  height: 250,
  marginTop: 30,
  alignSelf: 'center',
  borderColor: 'black',
  borderWidth: 4
 
},
searchText: {
  color: 'white',
  fontSize: 32,
  fontWeight: 'bold',
},

locationText:{
  fontSize:20,
  marginTop: 40,
},

card: {
  marginTop: 40,
  alignSelf: "center",
  width: "100%",
  backgroundColor: "#fff",
  borderRadius: 15,
  padding: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5,
},

cardTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 10,
  color: "#660000",
},

imageWrapper: {
  width: "100%",
  height: 180,
  borderRadius: 12,
  overflow: "hidden",
},

image: {
  width: "100%",
  height: "100%",
  resizeMode: "cover",
},

});