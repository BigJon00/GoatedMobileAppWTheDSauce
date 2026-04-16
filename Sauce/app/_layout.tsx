import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { requestNotificationPermissions, scheduleDailyDinnerNotification } from '../utils/notifications';

export default function Layout() {

  // request user for notifications and schedule daily dinner notification
  useEffect(() => {
    async function setupNotifications() {
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await scheduleDailyDinnerNotification();
      }
    }
    setupNotifications();
  }, []);

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