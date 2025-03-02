import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Lock, ExternalLink } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSignOut } from '@nhost/react';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { signOut } = useSignOut();

  const handleLogout = () => {
    signOut();
    router.replace('/(auth)');
  };

  const handleChangePassword = () => {
    // Navigate to change password screen
    router.push('/change-password');
  };

  const openWebsite = () => {
    Linking.openURL('https://yt-summariser.netlify.app');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.email}>{user?.email}</Text>
      </View>


      <TouchableOpacity style={styles.menuItem} onPress={openWebsite}>
        <ExternalLink size={20} color="#282828" />
        <Text style={styles.menuItemText}>Visit Website</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <LogOut size={20} color="#FF0000" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  email: {
    fontSize: 16,
    color: '#282828',
    fontWeight: '500',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#282828',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    color: '#282828',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 20,
    borderWidth: 1,
    borderColor: '#FF0000',
    borderRadius: 8,
  },
  logoutText: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginBottom: 30,
  },
});