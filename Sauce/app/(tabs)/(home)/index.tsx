import { View, Text, Button, TouchableOpacity, StyleSheet} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function Home() {
  const router = useRouter()

  return (
    <View style={styles.container}>
    {/* Header Row */}
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

    <Text style={styles.locationText}> Restaurant Name </Text>

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

});