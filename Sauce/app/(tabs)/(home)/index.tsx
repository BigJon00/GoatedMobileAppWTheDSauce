import { View, Text, Button } from 'react-native'
import { useRouter } from 'expo-router'

export default function Home() {
  const router = useRouter()

  return (
    <View>
      <Text>Home Screen</Text>

      <Button
        title="Go to settings"
        onPress={() => router.push('../(home)/settings')}
      />

    </View>
  )
}