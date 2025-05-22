/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Lesson } from '../services/LessonSyncService';
import { LessonServerScreen } from './LessonServerScreen';
import { initialLessons, topicIdPreferences, USERNAME } from '../../constants/serverSync';

function LessonServerScreenWrapper(): React.JSX.Element {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);

  const handleLessonsUpdated = (newLessons: Lesson[]) => {
    setLessons(prev => {
      // Add only lessons that don't already exist
      const uniqueNewLessons = newLessons.filter(newLesson => 
        !prev.some(existingLesson => 
          existingLesson.topicId === newLesson.topicId && 
          existingLesson.id === newLesson.id
        )
      );
      return [...prev, ...uniqueNewLessons];
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LessonServerScreen
        username={USERNAME}
        lessons={lessons}
        topicPreferences={topicIdPreferences}
        onLessonsUpdated={handleLessonsUpdated}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default LessonServerScreenWrapper;

