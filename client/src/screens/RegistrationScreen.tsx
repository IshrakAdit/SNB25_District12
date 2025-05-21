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

  const register = () => {
    // if (!email || !password) {
    //   Alert.alert('Error', 'Please fill in all fields.');
    //   return;
    // }
    onRegister(); // call App's setIsLoggedIn(true)
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
      />

      <TextInput
        style={[styles.input, {marginTop: 16}]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={register}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Already have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signupLink}>Sign in</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default RegistrationScreen;

// Same styles as LoginScreen
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
