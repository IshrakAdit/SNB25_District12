import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';
import {saveCourses, saveProjects} from '../utils/storage';
import {downloadAndCacheAllImages} from '../utils/imageCache';
import {courseContents, projects} from '../../constants/jsonFile';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../constants/types';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Registration'
>;

type Props = {
  onLogin: () => void;
};

const LoginScreen = ({onLogin}: Props) => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const saveInitialData = async () => {
    try {
      console.log('Starting to save initial data on login...');
      console.log('Courses to save:', courseContents);
      console.log('Projects to save:', projects);

      // Save courses and projects
      await saveCourses(courseContents);
      console.log('Courses saved successfully');

      await saveProjects(projects);
      console.log('Projects saved successfully');

      // Extract all image URLs
      const courseImages = courseContents.flatMap(
        course => course.images || [],
      );
      const projectImages = projects.flatMap(project => project.images || []);
      const allImages = [...courseImages, ...projectImages];
      console.log('Images to cache:', allImages);

      // Create necessary directories
      const baseDir =
        Platform.OS === 'ios'
          ? RNFS.DocumentDirectoryPath
          : RNFS.ExternalDirectoryPath;
      const cacheDir = `${baseDir}/cached_images`;
      const exportDir = `${baseDir}/exports`;

      await RNFS.mkdir(cacheDir).catch(err =>
        console.log('Cache dir exists or error:', err),
      );
      await RNFS.mkdir(exportDir).catch(err =>
        console.log('Export dir exists or error:', err),
      );

      console.log('Directories: ', cacheDir, exportDir);

      // Download and cache all images
      if (allImages.length > 0) {
        await downloadAndCacheAllImages(allImages);
        console.log('Images cached successfully');
      } else {
        console.log('No images to cache');
      }

      console.log('Initial data saved successfully on login');
    } catch (error) {
      console.error('Error saving initial data:', error);
      Alert.alert('Error', 'Failed to save initial data');
    }
  };

  const signin = async () => {
    // if (!email || !password) {
    //   Alert.alert('Error', 'Please fill in all fields.');
    //   return;
    // }

    setIsLoading(true);
    try {
      // const response = await auth().signInWithEmailAndPassword(email, password);
      // console.log('User logged in:', response);

      // Save initial data after successful login
      await saveInitialData();

      onLogin();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in to account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />

      <TextInput
        style={[styles.input, {marginTop: 16}]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <Pressable
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={signin}
        disabled={isLoading}>
        <Text style={styles.buttonText}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Text>
      </Pressable>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <Pressable
          onPress={() => navigation.navigate('Registration')}
          disabled={isLoading}>
          <Text style={styles.signupLink}>Sign up</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    color: '#0d8eb5',
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    width: 288,
    height: 48,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#374151',
  },
  button: {
    width: 288,
    height: 48,
    backgroundColor: '#1387ab',
    marginTop: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  signupText: {
    color: '#1387ab',
  },
  signupLink: {
    color: '#1387ab',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
