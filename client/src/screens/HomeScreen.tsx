import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';

// Components
import TopBar from './components/TopBar';
import ProgressBar from './components/ProgressBar';
import CourseCard from './components/CourseCard';

// import {useNavigation} from '@react-navigation/native';

// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {RootStackParamList} from '../../constants/types';

// type NavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   'ContentScreen'
// >;

// Dummy data
const userData = {
  name: 'Omar',
  level: 5,
  points: 840,
  rank: 5,
  weeklyPoints: 120,
  nextLevel: 6,
};

const courses = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description:
      'Web development is the work involved in developing a website for the Internet or an intranet.',
    questionCount: 2,
    mediaType: 'Audio',
    category: 'Web development',
  },
  {
    id: '2',
    title: 'Data Science Fundamentals',
    description:
      'Data science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from structured and unstructured data.',
    questionCount: 2,
    mediaType: 'Audio',
    category: 'Data Science',
  },
  {
    id: '3',
    title: 'Data Science Fundamentals',
    description:
      'Data science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from structured and unstructured data.',
    questionCount: 2,
    mediaType: 'Audio',
    category: 'Data Science',
  },
  {
    id: '4',
    title: 'Data Science Fundamentals',
    description:
      'Data science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from structured and unstructured data.',
    questionCount: 2,
    mediaType: 'Audio',
    category: 'Data Science',
  },
  {
    id: '5',
    title: 'Data Science Fundamentals',
    description:
      'Data science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from structured and unstructured data.',
    questionCount: 2,
    mediaType: 'Audio',
    category: 'Data Science',
  },
];

const HomeScreen = ({navigation}) => {
  const navigateToContent = course => {
    navigation.navigate('ContentScreen', {course});
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6b41a5" barStyle="light-content" />

      {/* Top Bar */}
      <TopBar
        title="LearnHub"
        level={userData.level}
        points={userData.points}
      />

      {/* User Welcome Section */}
      <View style={styles.welcomeCard}>
        <View style={styles.userInfoContainer}>
          {/* <Image
            source={require('./assets/profile.png')}
            style={styles.profileImage}
          /> */}
          <View style={styles.userTextContainer}>
            <Text style={styles.welcomeText}>Welcome, {userData.name}!</Text>
            <View style={styles.rankContainer}>
              {/* <Image
                source={require('./assets/trophy.png')}
                style={styles.trophyIcon}
              /> */}
              <Text style={styles.rankText}>
                Rank #{userData.rank} on leaderboard
              </Text>
            </View>
          </View>
        </View>

        {/* Level and Progress */}
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>
            Level {userData.level} • {userData.points} points
          </Text>
          <Text style={styles.nextLevelText}>
            Next level: {userData.nextLevel}
          </Text>
        </View>

        <ProgressBar progress={0.75} />

        <View style={styles.statsContainer}>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsText}>
              +{userData.weeklyPoints} points this week
            </Text>
            {/* <Image
              source={require('../../assets/icons/star.png')}
              style={styles.trendIcon}
              resizeMode="contain"
            /> */}
          </View>
          <TouchableOpacity style={styles.leaderboardButton}>
            <Image
              source={require('../../assets/icons/star.png')}
              style={styles.leaderboardIcon}
              resizeMode="contain"
            />
            <Text style={styles.leaderboardText}>View Leaderboard</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Learning Library */}
      <View style={styles.libraryContainer}>
        <View style={styles.libraryHeader}>
          <Text style={styles.libraryTitle}>Your Learning Library</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.coursesScrollView}>
          {courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={() => navigateToContent(course)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  welcomeCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 15,
    padding: 15,
    elevation: 2,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  trophyIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  rankText: {
    color: '#757575',
    fontSize: 14,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelText: {
    fontSize: 14,
    color: '#212121',
  },
  nextLevelText: {
    fontSize: 14,
    color: '#757575',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    color: '#4CAF50',
    fontWeight: '500',
    marginRight: 5,
  },
  trendIcon: {
    width: 16,
    height: 16,
    tintColor: '#4CAF50',
  },
  leaderboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  leaderboardIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  leaderboardText: {
    color: '#212121',
    fontWeight: '500',
    fontSize: 14,
  },
  libraryContainer: {
    marginTop: 10,
    flex: 1,
  },
  libraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  libraryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b41a5',
  },
  viewAllText: {
    color: '#2196F3',
    fontSize: 14,
  },
  coursesScrollView: {
    paddingLeft: 10,
  },
});

export default HomeScreen;
