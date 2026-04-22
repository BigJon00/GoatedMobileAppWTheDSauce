import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState } from 'react'
import { useFocusEffect } from 'expo-router'

const settings = () => {
  const [theme, setTheme] = useState<string>("white");

  useFocusEffect(() => {
    const themeLoad = async () => {
      const themeSaved = await AsyncStorage.getItem("theme");
      if(themeSaved){
        setTheme(themeSaved)
      }
    };

    themeLoad();
  });

  const themeChange = async (color: string) => {
    setTheme(color);
    await AsyncStorage.setItem("theme", color);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme }]}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.label}>Choose Theme:</Text>

      {/* Theme buttons */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: "white" }]}
          onPress={() => themeChange("white")}
        />
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: "#660000" }]}
          onPress={() => themeChange("#660000")}
        />
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: "#222" }]}
          onPress={() => themeChange("#222")}
        />
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: "#000878" }]}
          onPress={() => themeChange("#000878")}
        />
       <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: "#f5ad05" }]}
          onPress={() => themeChange("#f5ad05")}
        />
        
      </View>

    </View>
  );
};


export default settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  label: {
    fontSize: 18,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },

  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "black",
  },


});