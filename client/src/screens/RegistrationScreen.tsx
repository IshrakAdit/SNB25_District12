import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {saveCourses, saveProjects} from '../utils/storage';
import {downloadAndCacheAllImages} from '../utils/imageCache';
import {courseContents, projects} from '../../constants/jsonFile';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../constants/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  onRegister: () => void;
};

const RegistrationScreen = ({onRegister}: Props) => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const saveInitialData = async () => {
    try {
      // Save courses and projects
      await saveCourses(courseContents);
      await saveProjects(projects);

      // Extract all image URLs
      const courseImages = courseContents.flatMap(
        course => course.images || [],
      );
      const projectImages = projects.flatMap(project => project.images || []);
      const allImages = [...courseImages, ...projectImages];

      // Download and cache all images
      await downloadAndCacheAllImages(allImages);

      console.log('Initial data saved successfully');
    } catch (error) {
      console.error('Error saving initial data:', error);
      Alert.alert('Error', 'Failed to save initial data');
    }
  };

  const register = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      console.log('User account created & signed in: ', response);

      // Save initial data
      await saveInitialData();

      onRegister(); // This will trigger navigation to PreferencesScreen through App.tsx
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a new account</Text>

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
        onPress={register}
        disabled={isLoading}>
        <Text style={styles.buttonText}>
          {isLoading ? 'Creating Account...' : 'Register'}
        </Text>
      </Pressable>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Already have an account? </Text>
        <Pressable
          onPress={() => navigation.navigate('Login')}
          disabled={isLoading}>
          <Text style={styles.signupLink}>Sign in</Text>
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

export default RegistrationScreen;
