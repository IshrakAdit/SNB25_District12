import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { DiscoveryService, ServerInfo } from '../services/DiscoveryService';
import { LessonScreen } from './LessonScreen';
import { Lesson } from '../services/LessonSyncService';

interface LessonServerScreenProps {
  username: string;
  lessons: Lesson[];
  topicPreferences: string[];
  onLessonsUpdated: (newLessons: Lesson[]) => void;
}

export function LessonServerScreen({
  username,
  lessons,
  topicPreferences,
  onLessonsUpdated,
}: LessonServerScreenProps) {
  const [mode, setMode] = useState<'none' | 'server' | 'client'>('none');
  const [isConnected, setIsConnected] = useState(false);
  const [discoveredServers, setDiscoveredServers] = useState<ServerInfo[]>([]);
  const [selectedServer, setSelectedServer] = useState<ServerInfo | null>(null);
  const [discoveryService] = useState(() => new DiscoveryService());

  useEffect(() => {
    if (mode === 'client') {
      discoveryService.startDiscovery((servers) => {
        setDiscoveredServers(servers);
      });
    } else if (mode === 'server') {
      discoveryService.startAdvertising(username, 8080);
    } else {
      discoveryService.stopDiscovery();
      discoveryService.stopAdvertising();
    }

    return () => {
      discoveryService.stopDiscovery();
      discoveryService.stopAdvertising();
    };
  }, [mode, username]);

  const startSync = () => {
    if (mode === 'client' && !selectedServer) {
      Alert.alert('Error', 'Please select a server to join');
      return;
    }
    
    setIsConnected(true);
  };

  const renderServerItem = ({ item }: { item: ServerInfo }) => (
    <TouchableOpacity
      style={[
        styles.serverItem,
        selectedServer?.host === item.host && styles.selectedServer
      ]}
      onPress={() => setSelectedServer(item)}
    >
      <Text style={styles.serverName}>{item.name}'s Server</Text>
    </TouchableOpacity>
  );

  if (isConnected && mode !== 'none') {
    return (
      <SafeAreaView style={styles.container}>
        <LessonScreen
          isServer={mode === 'server'}
          serverInfo={selectedServer}
          username={username}
          discoveryService={discoveryService}
          lessons={lessons}
          topicPreferences={topicPreferences}
          onLessonsUpdated={onLessonsUpdated}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Share Articles</Text>
        
        <Text style={styles.usernameDisplay}>Logged in as, {username}</Text>

        <View style={styles.modeContainer}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'server' && styles.selectedMode]}
            onPress={() => setMode('server')}
          >
            <Text style={[
              styles.modeButtonText,
              mode === 'server' && styles.selectedModeText
            ]}>Create Server</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeButton, mode === 'client' && styles.selectedMode]}
            onPress={() => setMode('client')}
          >
            <Text style={[
              styles.modeButtonText,
              mode === 'client' && styles.selectedModeText
            ]}>Join Server</Text>
          </TouchableOpacity>
        </View>

        {mode === 'client' && (
          <View style={styles.serverList}>
            <Text style={styles.serverListTitle}>Available Servers</Text>
            {discoveredServers.length === 0 ? (
              <View style={styles.noServers}>
                <ActivityIndicator size="large" color="#075E54" />
                <Text style={styles.noServersText}>Searching for servers...</Text>
              </View>
            ) : (
              <FlatList
                data={discoveredServers}
                renderItem={renderServerItem}
                keyExtractor={(item) => item.host}
                style={styles.serverListContent}
              />
            )}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.startButton,
            (!mode || mode === 'none' || (mode === 'client' && !selectedServer)) && styles.disabledButton
          ]}
          onPress={startSync}
          disabled={!mode || mode === 'none' || (mode === 'client' && !selectedServer)}
        >
          <Text style={styles.startButtonText}>Start Syncing</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#075E54',
  },
  usernameDisplay: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333333',
    backgroundColor: '#E0F2F1',
    padding: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedMode: {
    backgroundColor: '#075E54',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  selectedModeText: {
    color: '#FFFFFF',
  },
  serverList: {
    marginBottom: 20,
    maxHeight: 200,
  },
  serverListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  serverListContent: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    padding: 10,
  },
  serverItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginBottom: 8,
  },
  selectedServer: {
    backgroundColor: '#E0F2F1',
    borderColor: '#075E54',
    borderWidth: 1,
  },
  serverName: {
    fontSize: 16,
    color: '#333333',
  },
  noServers: {
    padding: 20,
    alignItems: 'center',
  },
  noServersText: {
    marginTop: 10,
    color: '#666666',
    fontSize: 14,
  },
  startButton: {
    backgroundColor: '#075E54',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 