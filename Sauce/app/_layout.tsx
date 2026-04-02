import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#660000', 
        },
        headerTintColor: '#fff', 
        headerTitle: 'The Sauce',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        
      }}

    />

    
  );
}