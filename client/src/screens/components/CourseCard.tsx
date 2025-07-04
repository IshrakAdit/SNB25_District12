import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

type Props = {
  course: {
    id: string;
    title: string;
    description: string;
    questionCount: number;
    mediaType: string;
    category: string;
    images: string[];
  };
  onPress: () => void;
  onDelete: () => void;
};

const CourseCard = ({course, onPress, onDelete}: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cardContent} onPress={onPress}>
        <Image
          source={{uri: course.images[0]}}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{course.title}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{course.mediaType}</Text>
            </View>
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {course.description}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.category}>{course.category}</Text>
            <Text style={styles.questionCount}>
              {course.questionCount} Questions
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    width: 280,
    elevation: 2,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  cardContent: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#F0EBF8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#6b41a5',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: '#6b41a5',
    fontWeight: '500',
  },
  questionCount: {
    fontSize: 12,
    color: '#757575',
  },
});

export default CourseCard;
