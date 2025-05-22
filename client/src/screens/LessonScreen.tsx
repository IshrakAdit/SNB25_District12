import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { DiscoveryService, ServerInfo } from '../services/DiscoveryService';
import { LessonSyncService, Lesson } from '../services/LessonSyncService';

interface LessonScreenProps {
  isServer: boolean;
  serverInfo: ServerInfo | null;
  username: string;
  discoveryService: DiscoveryService;
  lessons: Lesson[];
  topicPreferences: string[];
  onLessonsUpdated: (newLessons: Lesson[]) => void;
}

export function LessonScreen({
  isServer,
  serverInfo,
  username,
  discoveryService,
  lessons: initialLessons,
  topicPreferences,
  onLessonsUpdated,
}: LessonScreenProps) {
  const [syncedLessons, setSyncedLessons] = useState<Lesson[]>(initialLessons);
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncService] = useState(() => new LessonSyncService());
  const [newLessonsCount, setNewLessonsCount] = useState(0);

  const handleNewLessons = useCallback((newLessons: Lesson[]) => {
    setSyncedLessons(prev => {
      // Filter out duplicates based on topicId and id
      const uniqueNewLessons = newLessons.filter(newLesson => 
        !prev.some(existingLesson => 
          existingLesson.topicId === newLesson.topicId && 
          existingLesson.id === newLesson.id
        )
      );
      setNewLessonsCount(prev => prev + uniqueNewLessons.length);
      return [...prev, ...uniqueNewLessons];
    });
    onLessonsUpdated(newLessons);
  }, [onLessonsUpdated]);

  useEffect(() => {
    syncService.onNewLessons(handleNewLessons);

    const port = 8080;
    if (isServer) {
      syncService.startServer(port, initialLessons, topicPreferences, username);
    } else if (serverInfo) {
      syncService.connectToServer(serverInfo.host, serverInfo.port, initialLessons, topicPreferences, username);
    }

    // Give some time for initial sync
    setTimeout(() => setIsSyncing(false), 2000);

    return () => {
      syncService.stop();
    };
  }, [isServer, serverInfo, initialLessons, topicPreferences, handleNewLessons, username]);

  const renderLesson = ({ item }: { item: Lesson }) => (
    <View style={[
      styles.lessonItem,
      item.source && styles.receivedLessonItem
    ]}>
      <Text style={styles.lessonTitle}>{item.title}</Text>
      <Text style={styles.lessonInfo}>Topic {item.topicId} • Lesson {item.id}</Text>
      {item.source && (
        <Text style={styles.sourceInfo}>
          Received from {item.source}
          {item.receivedAt && ` • ${new Date(item.receivedAt).toLocaleTimeString()}`}
        </Text>
      )}
    </View>
  );

  if (isSyncing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#075E54" />
        <Text style={styles.loadingText}>Establishing connection...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Lessons</Text>
        <Text style={styles.subTitle}>
          {isServer ? 'Running as Server' : `Connected to ${serverInfo?.name}'s Server`}
        </Text>
        {newLessonsCount > 0 && (
          <Text style={styles.syncStatus}>
            Received {newLessonsCount} new lesson{newLessonsCount === 1 ? '' : 's'}
          </Text>
        )}
      </View>

      <View style={styles.preferencesContainer}>
        <Text style={styles.preferencesTitle}>Your Topic Preferences:</Text>
        <View style={styles.preferencesRow}>
          {topicPreferences.map((topicId) => (
            <View key={topicId} style={styles.topicBadge}>
              <Text style={styles.topicBadgeText}>Topic {topicId}</Text>
            </View>
          ))}
        </View>
      </View>

      <FlatList
        data={syncedLessons}
        renderItem={renderLesson}
        keyExtractor={(item) => `${item.topicId}-${item.id}`}
        style={styles.lessonList}
        contentContainerStyle={styles.lessonListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#075E54',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: '#B4DCD8',
  },
  preferencesContainer: {
    padding: 15,
    backgroundColor: '#E0F2F1',
  },
  preferencesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075E54',
    marginBottom: 8,
  },
  preferencesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicBadge: {
    backgroundColor: '#075E54',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  topicBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  lessonList: {
    flex: 1,
  },
  lessonListContent: {
    padding: 15,
  },
  lessonItem: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#075E54',
  },
  receivedLessonItem: {
    backgroundColor: '#E8F5E9',
    borderLeftColor: '#4CAF50',
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  lessonInfo: {
    fontSize: 14,
    color: '#666666',
  },
  sourceInfo: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#075E54',
  },
  syncStatus: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
}); 