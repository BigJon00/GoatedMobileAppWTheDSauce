import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const profile = () => {
    const router = useRouter()
  
  return (
    <View>
          <Text>Profile</Text>
    
          <Button
            title="Go to settings"
            onPress={() => router.push('../(profile)/settings')}
          />
    
        </View>

    
  )
}

export default profile

const styles = StyleSheet.create({})