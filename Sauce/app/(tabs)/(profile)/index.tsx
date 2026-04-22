import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { useFocusEffect } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'


const profile = () => {
    const router = useRouter()
    const [theme, setTheme] = useState("white");
    const [textColor, setTextColor] = useState("black");

    useFocusEffect(() => {
      const themeLoad = async () => {
        const themeSaved = await AsyncStorage.getItem("theme");
        const textSaved = await AsyncStorage.getItem("textColor");
        if(themeSaved){
          setTheme(themeSaved)
        }
        if(textSaved){
          setTextColor(textSaved)
        }
      };
  
      themeLoad();
    });
  
    
  
  return (
    <View style={[styles.container, { backgroundColor: theme }]}>
       
       <Text style={[styles.headText, { color: textColor }]}>
        Profile
      </Text>
    
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => router.push("../settings")}
          >
          <View style={styles.buttonContent}>
            <Ionicons name="settings-outline" size={24} color="white" />
            <Text style={[styles.searchText, { color: textColor }]}>Settings</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => router.push("../bookmark")}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="bookmark-outline" size={24} color="white" />
            <Text style={[styles.searchText, { color: textColor }]}>Bookmarks</Text>
          </View>
        </TouchableOpacity>
            
     
    </View>

    
  )
}

export default profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, 
  },
  headText: {
    fontSize: 40,
    fontStyle: 'italic',
    paddingLeft: 20,
    paddingTop: 20,
  },
  searchButton: {
    backgroundColor: '#660000', 
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    width: 350,
    height: 100,
    marginTop: 30,
    alignSelf: 'center',
    borderColor: 'black',
    borderWidth: 4
   
  },
  searchText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
 

})