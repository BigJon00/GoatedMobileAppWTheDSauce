import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 



const _layout = () => {
  
    return (
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#bfa87c', 
            tabBarInactiveTintColor: '#FFFFFF', 
            tabBarStyle: {
              backgroundColor: '#660000' // Tab bar background color
            },
            headerShown: false, // Hide header for all screens in tabs
           
          }}
        >

          <Tabs.Screen
            name="(home)"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? 'home' : 'home-outline'}
                  size={24}
                  color={color}
                />
              ),
            }}
          />
    
         
          <Tabs.Screen
            name="search"
            options={{
              title: 'Search',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? 'earth' : 'earth-outline'}
                  size={24}
                  color={color}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="(profile)"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? 'person' : 'person-outline'}
                  size={24}
                  color={color}
                />
              ),

            }}
          />
    

        </Tabs>
      );
    }


export default _layout

const styles = StyleSheet.create({})