import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  //   Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

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

  const signin = async () => {
    // if (!email || !password) {
    //   Alert.alert('Error', 'Please fill in all fields.');
    //   return;
    // }
    try {
      const response = await auth().signInWithEmailAndPassword(email, password);
      console.log('User account logged in: ', response);
    } catch (error) {
      console.error(error);
    }
    onLogin(); // call App's onLogin
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
      />

      <TextInput
        style={[styles.input, {marginTop: 16}]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={signin}>
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.signupLink}>Sign up</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginScreen;

// Styles remain the same
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
