import { router, Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Chrome as Home, History, User } from 'lucide-react-native';
import { useAccessToken } from '@nhost/react';

export default function TabLayout() {
  const accessToken = useAccessToken();

  if(!accessToken){
    router.replace('/(auth)')
  };

  // If user is not logged in, they shouldn't be able to access tabs

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF0000',
        tabBarInactiveTintColor: '#282828',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#E0E0E0',
        },
        headerTitleStyle: {
          color: '#282828',
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Summarize',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'YouTube Summarizer',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <History size={size} color={color} />,
          headerTitle: 'Your History',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'Your Profile',
        }}
      />
    </Tabs>
  );
}