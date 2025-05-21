import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

type Props = {
  course: {
    id: string;
    title: string;
    description: string;
    questionCount: number;
    mediaType: string;
    category: string;
  };
  onPress: () => void;
};

const CourseCard = ({course, onPress}: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title} numberOfLines={2}>
        {course.title}
      </Text>

      <View style={styles.imageContainer}>
        {/* <Image
          source={require('../assets/course-placeholder.png')}
          style={styles.image}
        /> */}
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {course.description}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.questionCount}>
          {course.questionCount} questions
        </Text>
        <View style={styles.mediaType}>
          <Text style={styles.mediaTypeText}>{course.mediaType} available</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 10,
    padding: 15,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 10,
    height: 40,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 30,
    height: 30,
    tintColor: '#BDBDBD',
  },
  description: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 10,
    height: 50,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionCount: {
    fontSize: 12,
    color: '#212121',
  },
  mediaType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaTypeText: {
    fontSize: 12,
    color: '#757575',
  },
});

export default CourseCard;
