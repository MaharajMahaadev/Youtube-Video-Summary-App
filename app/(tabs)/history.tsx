import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Modal, SafeAreaView, ScrollView } from 'react-native';
import { Clock, ExternalLink, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { fetchUserHistory } from '../../utils/api';

// Define the history item type
type HistoryItem = {
  url: string;
  summary: string;
  timestamp: string;
};

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      if (user?.id) {
        const result = await fetchUserHistory(user.id);
        if (result.success) {
          setHistory(result.data);
        } else {
          setError(result.message || 'Failed to load history');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const truncateSummary = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleItemPress = (item: HistoryItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity style={styles.historyItem} onPress={() => handleItemPress(item)}>
      <View style={styles.historyHeader}>
        <Text style={styles.videoTitle}>{item.url}</Text>
        <TouchableOpacity>
          <ExternalLink size={18} color="#666" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.summaryPreview}>{truncateSummary(item.summary)}</Text>
      
      <View style={styles.historyFooter}>
        <View style={styles.timestampContainer}>
          <Clock size={14} color="#666" />
          <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadHistory}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Clock size={60} color="#EEEEEE" />
        <Text style={styles.emptyText}>No history yet</Text>
        <Text style={styles.emptySubtext}>
          Summaries you generate will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.url}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.backButton}>
              <ArrowLeft size={24} color="#282828" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Summary Details</Text>
          </View>

          {selectedItem && (
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalVideoTitle}>{selectedItem.url}</Text>
              
              <View style={styles.modalTimestampContainer}>
                <Clock size={14} color="#666" />
                <Text style={styles.modalTimestamp}>{formatDate(selectedItem.timestamp)}</Text>
              </View>
              
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>{selectedItem.summary}</Text>
              </View>
              
              <TouchableOpacity style={styles.videoLinkButton}>
                <ExternalLink size={18} color="#FFFFFF" />
                <Text style={styles.videoLinkText}>Open Video</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
  },
  historyItem: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#282828',
    flex: 1,
    marginRight: 10,
  },
  summaryPreview: {
    fontSize: 14,
    color: '#282828',
    lineHeight: 20,
    marginBottom: 10,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF0000',
    borderRadius: 8,
    padding: 12,
    paddingHorizontal: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#282828',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    marginRight: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#282828',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalVideoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#282828',
    marginBottom: 10,
  },
  modalTimestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTimestamp: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  summaryContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#282828',
  },
  videoLinkButton: {
    backgroundColor: '#FF0000',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  videoLinkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});