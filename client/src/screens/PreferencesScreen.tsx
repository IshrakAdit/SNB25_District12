import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';

type RootStackParamList = {
  Preferences: undefined;
  Home: undefined;
};

type PreferencesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Preferences'
>;

type Props = {
  navigation: PreferencesScreenNavigationProp;
};

const topics = [
  {id: '1', name: 'Web Development'},
  {id: '2', name: 'Mobile Development'},
  {id: '3', name: 'Data Science'},
  {id: '4', name: 'Machine Learning'},
  {id: '5', name: 'Cloud Computing'},
  {id: '6', name: 'DevOps'},
  {id: '7', name: 'Cybersecurity'},
  {id: '8', name: 'Blockchain'},
  {id: '9', name: 'UI/UX Design'},
  {id: '10', name: 'Game Development'},
];

const PreferencesScreen = ({navigation}: Props) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId],
    );
  };

  const handleSubmit = async () => {
    if (selectedTopics.length === 0) {
      Alert.alert('Error', 'Please select at least one topic');
      return;
    }

    try {
      // Save user preferences
      await AsyncStorage.setItem(
        'userPreferences',
        JSON.stringify(selectedTopics),
      );
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Interests</Text>
      <Text style={styles.subtitle}>
        Select topics you'd like to learn about
      </Text>

      <ScrollView style={styles.topicsContainer}>
        {topics.map(topic => (
          <TouchableOpacity
            key={topic.id}
            style={styles.topicItem}
            onPress={() => toggleTopic(topic.id)}>
            <CheckBox
              value={selectedTopics.includes(topic.id)}
              onValueChange={() => toggleTopic(topic.id)}
              tintColors={{true: '#6b41a5', false: '#757575'}}
            />
            <Text style={styles.topicText}>{topic.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 30,
  },
  topicsContainer: {
    flex: 1,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  topicText: {
    fontSize: 16,
    color: '#212121',
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#6b41a5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PreferencesScreen;
