import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Components
import TopBar from './components/TopBar';
import ProgressBar from './components/ProgressBar';
import CourseCard from './components/CourseCard';
import ProjectCard from './components/ProjectCard';

// Storage utilities
import {getCourses, getProjects} from '../utils/storage';
import {exportData} from '../utils/shareData';

// import {useNavigation} from '@react-navigation/native';

// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {RootStackParamList} from '../../constants/types';

// type NavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   'ContentScreen'
// >;

// Data
import {
  courseContents,
  CourseContent,
  Project,
  projects,
} from '../../constants/jsonFile';
import { USERNAME } from '../../constants/serverSync';

// Types
type RootStackParamList = {
  Home: undefined;
  ContentScreen: {course: CourseContent};
  ProjectScreen: {project: Project};
  LeaderboardScreen: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const userData = {
  name: USERNAME,
  level: 1,
  points: 88,
  rank: 5,
  nextLevel: 2,
  weeklyPoints: 72,
};

const HomeScreen = ({navigation}: Props) => {
  const [availableCourses, setAvailableCourses] =
    useState<CourseContent[]>(courseContents);
  const [availableProjects, setAvailableProjects] =
    useState<Project[]>(projects);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Try to load courses and projects from local storage
      const savedCourses = await getCourses();
      const savedProjects = await getProjects();

      // Log the data to see what we're getting
      console.log('Loaded courses:', savedCourses);
      console.log('Loaded projects:', savedProjects);

      // If we have saved data, use it
      if (savedCourses && savedCourses.length > 0) {
        setAvailableCourses(savedCourses);
        console.log('Using saved courses');
      } else {
        console.log('Using default courses');
      }

      if (savedProjects && savedProjects.length > 0) {
        setAvailableProjects(savedProjects);
        console.log('Using saved projects');
      } else {
        console.log('Using default projects');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert(
        'Notice',
        'Using default content as saved content could not be loaded.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    Alert.alert(
      'Delete Course',
      'Are you sure you want to remove this course?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAvailableCourses(prev =>
              prev.filter(course => course.id !== courseId),
            );
          },
        },
      ],
    );
  };

  const handleDeleteProject = (projectId: string) => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to remove this project?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAvailableProjects(prev =>
              prev.filter(project => project.id !== projectId),
            );
          },
        },
      ],
    );
  };

  const handleShare = async () => {
    try {
      console.log('Starting data export...');
      await exportData();
      console.log('Data exported successfully!');
    } catch (error) {
      console.error('Error sharing data:', error);
      Alert.alert('Error', 'Failed to share data');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading content...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.leaderboardButton}
              onPress={() => navigation.navigate('LeaderboardScreen')}>
              <Image
                source={require('../../assets/icons/star.png')}
                style={styles.leaderboardIcon}
                resizeMode="contain"
              />
              <Text style={styles.leaderboardText}>Leaderboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareButtonText}>Fetch Data</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Learning Library */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Learning Library</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {availableCourses.map(course => (
            <View key={course.id} style={styles.cardWrapper}>
              <CourseCard
                course={{
                  id: course.id,
                  title: course.title,
                  description: course.article.split('\n')[2],
                  questionCount: course.quiz.length,
                  mediaType: course.videos.length > 0 ? 'Video' : 'Text',
                  category: 'Web Development',
                  images: course.images,
                }}
                onPress={() => navigation.navigate('ContentScreen', {course})}
                onDelete={() => handleDeleteCourse(course.id)}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Projects Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Projects</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {availableProjects.map(project => (
            <View key={project.id} style={styles.cardWrapper}>
              <ProjectCard
                project={project}
                onPress={() => navigation.navigate('ProjectScreen', {project})}
                onDelete={() => handleDeleteProject(project.id)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
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
  sectionContainer: {
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    margin: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b41a5',
  },
  viewAllText: {
    color: '#6b41a5',
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 5,
  },
  cardWrapper: {
    width: 280,
    marginHorizontal: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default HomeScreen;
