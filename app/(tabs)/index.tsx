import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Youtube, Link as LinkIcon } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { mockSummarizeVideo } from '../../utils/api';
import { useAccessToken } from '@nhost/react';

export default function SummarizeScreen() {
  const [videoUrl, setVideoUrl] = useState('');
  const [summary, setSummary] = useState<undefined | string>('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const accessToken = useAccessToken();

  const handleSummarize = async () => {
    setError('');
    
    // Basic validation
    if (!videoUrl) {
      setError('Please enter a YouTube video URL');
      return;
    }
    
    // Simple YouTube URL validation
    if (!videoUrl.includes('youtube.com/') && !videoUrl.includes('youtu.be/')) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the mock API function
      const result = await mockSummarizeVideo(videoUrl, accessToken || '');
      
      if (result?.success) {
        setSummary(result.result?.data?.actionName?.message);
      } else {
        setError(result?.message || 'Failed to summarize video');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.urlInputWrapper}>
            <LinkIcon size={20} color="#666" style={styles.urlIcon} />
            <TextInput
              style={styles.urlInput}
              placeholder="Paste YouTube video URL"
              placeholderTextColor="#999"
              value={videoUrl}
              onChangeText={setVideoUrl}
              autoCapitalize="none"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.summarizeButton} 
            onPress={handleSummarize}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Summarize</Text>
            )}
          </TouchableOpacity>
        </View>
        
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        
        {summary ? (
          <View style={styles.summaryContainer}>
            <View style={styles.summaryHeader}>
              <Youtube size={24} color="#FF0000" />
              <Text style={styles.summaryTitle}>Video Summary</Text>
            </View>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Youtube size={60} color="#EEEEEE" />
            <Text style={styles.placeholderText}>
              Enter a YouTube URL to get a summary
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  urlInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  urlIcon: {
    marginRight: 8,
  },
  urlInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#282828',
  },
  summarizeButton: {
    backgroundColor: '#FF0000',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 14,
  },
  summaryContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#282828',
    marginLeft: 10,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#282828',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  placeholderText: {
    marginTop: 20,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});