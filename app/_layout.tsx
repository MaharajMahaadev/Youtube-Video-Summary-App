import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { NhostProvider, NhostSession, SignedIn, SignedOut } from '@nhost/react';
import { NhostApolloProvider } from '@nhost/react-apollo';
import { nhost } from '@/src/root';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  const [session, setSession] = useState<undefined | NhostSession | null>(null);

  useEffect(() => {
    setSession(nhost.auth.getSession())

    nhost.auth.onAuthStateChanged((_, session) => {
      setSession(session)
    })
  }, []);
  useEffect(() => {
    if (Platform.OS === 'web') {
      window.frameworkReady?.();
    }
  }, []);

  return (
    <NhostApolloProvider nhost={nhost}>
    <NhostProvider nhost={nhost}>
      <StatusBar style="light" />
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' }
      }}>
        {session ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
      </Stack>
    </NhostProvider>
    </NhostApolloProvider>
  );
}