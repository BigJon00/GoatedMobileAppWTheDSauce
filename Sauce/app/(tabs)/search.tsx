import { StyleSheet, View } from 'react-native'
import React from 'react'
import MapView from 'react-native-maps'

const Search = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 32.7800,        // Charleston area
          longitude: -79.9300,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      />
    </View>
  )
}

export default Search

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
})