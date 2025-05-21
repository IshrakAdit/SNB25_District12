import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import TopBar from './TopBar';

// Content Screen shown when a course is selected
const ContentScreen = ({route, navigation}) => {
  const {course} = route.params;
  const [activeTab, setActiveTab] = useState('Content');

  // Dummy content data
  const contentSections = [
    {
      id: '1',
      title: course.title,
      content: course.description,
    },
    {
      id: '2',
      title: 'Statistical Analysis',
      content:
        'Statistical analysis is a component of data analytics. In the context of business intelligence, statistical analysis involves collecting and scrutinizing every data sample in a set of items from which samples can be drawn.',
    },
  ];

  // Dummy quiz data
  const quizQuestions = [
    {
      id: '1',
      question: 'What is the primary goal of data science?',
      options: [
        'To create visually appealing charts',
        'To extract knowledge and insights from data',
        'To program computers',
        'To develop mobile applications',
      ],
      correctAnswer: 1,
    },
    {
      id: '2',
      question:
        'Which of the following is NOT a common component of data science?',
      options: [
        'Statistical analysis',
        'Machine learning',
        'Web development',
        'Data visualization',
      ],
      correctAnswer: 2,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <TopBar title="LearnHub" level={5} points={840} />

      {/* Course Title */}
      <Text style={styles.courseTitle}>{course.title}</Text>

      {/* Content/Quiz Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Content' && styles.activeTab]}
          onPress={() => setActiveTab('Content')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Content' && styles.activeTabText,
            ]}>
            Content
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Quiz' && styles.activeTab]}
          onPress={() => setActiveTab('Quiz')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Quiz' && styles.activeTabText,
            ]}>
            Quiz
          </Text>
        </TouchableOpacity>
      </View>

      {/* Play Audio Button */}
      <TouchableOpacity style={styles.audioButton}>
        <Image
          source={require('../../../assets/icons/play.png')}
          style={styles.audioIcon}
          resizeMode="contain"
        />
        <Text style={styles.audioText}>Play Audio</Text>
      </TouchableOpacity>

      {/* Content Display */}
      {activeTab === 'Content' ? (
        <ScrollView style={styles.contentContainer}>
          {contentSections.map(section => (
            <View key={section.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView style={styles.quizContainer}>
          {quizQuestions.map(question => (
            <View key={question.id} style={styles.questionCard}>
              <Text style={styles.questionText}>{question.question}</Text>
              {question.options.map((option, index) => (
                <TouchableOpacity key={index} style={styles.optionButton}>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Audio Player Controls */}
      <View style={styles.audioPlayerContainer}>
        <TouchableOpacity style={styles.playButton}>
          <Image
            source={require('../../../assets/icons/play.png')}
            style={styles.playIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressIndicator} />
          </View>
          <Text style={styles.timeText}>0:00</Text>
        </View>
        <TouchableOpacity style={styles.volumeButton}>
          <Image
            source={require('../../../assets/icons/arrow.png')}
            style={styles.volumeIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  courseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 15,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#F0EBF8',
  },
  tabText: {
    fontSize: 16,
    color: '#757575',
  },
  activeTabText: {
    color: '#6b41a5',
    fontWeight: '500',
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 12,
  },
  audioIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  audioText: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 15,
    color: '#212121',
    lineHeight: 22,
  },
  quizContainer: {
    flex: 1,
    padding: 15,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 14,
    color: '#212121',
  },
  audioPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6b41a5',
    padding: 15,
  },
  playButton: {
    padding: 5,
  },
  playIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginRight: 10,
  },
  progressIndicator: {
    width: '0%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
  },
  volumeButton: {
    padding: 5,
  },
  volumeIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});

export default ContentScreen;
