import { View, Text, Button, TouchableOpacity, StyleSheet, Image} from 'react-native'
import { useRouter, useFocusEffect} from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Imported locations in order to display them on this page through [id]
import { defaultLocations } from '../search' 
import { useState } from 'react'



export default function Home() {
  const router = useRouter();

  // For style purposes
  const [theme, setTheme] = useState("white");
  const [textColor, setTextColor] = useState("black");
  const [subColor, setSubColor] = useState<string>("black");



  // Needed for [ID] to display specific info
  const location = defaultLocations[0];
  
  // Holds the current featured location on the page
  const [featuredLocation, setFeaturedLocation] = useState(defaultLocations[0]);
  
  /* 
  Every time the user switches tab, the location changes
  Also using random as a way to change the location from the number of locations
   */
  useFocusEffect(() => {
    const themeLoad = async () => {
      const themeSaved = await AsyncStorage.getItem("theme");
      const textSaved = await AsyncStorage.getItem("textColor");
      const subSaved = await AsyncStorage.getItem("subColor");
      if(themeSaved){
        setTheme(themeSaved)
      }

      if (textSaved) {
        setTextColor(textSaved);
      }

      if (subSaved){
        setSubColor(subSaved);
      }

    };

    themeLoad();
    const randomIndex = Math.floor(Math.random() * defaultLocations.length);

    // State updated randomly selected location
    setFeaturedLocation(defaultLocations[randomIndex]);
  
    // cleanup
    return undefined;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme }]}>
    <View style={styles.headerRow}>
      <Text style={[styles.headText,  { color: textColor }]}>Welcome, User!</Text>

      <TouchableOpacity
        onPress={() => router.push("../(home)/settings")}
        style={styles.iconButton}
      >
        <Ionicons name="settings-sharp" size={32} color="black" />
      </TouchableOpacity>
    </View>

    <Text style={[styles.introText,  { color: textColor }]}>
      Discover local restaurant's in the Charleston Area!
    </Text>

    <TouchableOpacity
        style={[styles.searchButton,  {backgroundColor: subColor}]}
        onPress={() => router.push("../search")}
      >
        <Text style={[styles.searchText,  { color: textColor }]}>Search</Text>
      </TouchableOpacity>

    <Text style={[styles.locationText,  { color: textColor }]}> Random Restaurant </Text>

    

    {featuredLocation && (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: subColor }]}
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
    <Text style={[styles.cardTitle,  { color: textColor }]}>
      {featuredLocation.name}
    </Text>
      <Text style={[styles.listDesc, { color: textColor }]} numberOfLines={2}>
            {featuredLocation.description}
      </Text>
    <Text style={[styles.listHint, {color: textColor}]}>Tap for details →</Text>
             
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

list: {
  position: "absolute",
  bottom: 20,
  width: "100%",
},

listContent: {
  paddingHorizontal: 10,
},

listItem: {
  backgroundColor: "white",
  padding: 15,
  marginHorizontal: 10,
  borderRadius: 15,
  width: 250,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},

listTitle: {
  fontWeight: "bold",
  fontSize: 16,
  marginBottom: 5,
  color: "#660000",
},

listDesc: {
  fontSize: 12,
  color: "#333",
},

listHint: {
  fontSize: 11,
  color: "#bfa87c",
  marginTop: 4,
  fontWeight: "600",
},

});