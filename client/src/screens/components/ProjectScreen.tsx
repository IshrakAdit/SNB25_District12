import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import TopBar from './TopBar';
import type {
  Project,
  DataCollectionQuestion,
} from '../../../constants/jsonFile';

type Props = {
  route: {
    params: {
      project: Project;
    };
  };
  navigation?: any;
};

const ProjectScreen = ({route, navigation}: Props) => {
  const {project} = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 means not started
  const [answers, setAnswers] = useState<{[key: string]: string | string[]}>(
    {},
  );
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = project.questions[currentQuestionIndex];

  const handleAnswer = (value: string | string[]) => {
    if (currentQuestion) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.question]: value,
      }));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < project.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleStartProject = () => {
    setCurrentQuestionIndex(0);
  };

  const renderQuestion = (question: DataCollectionQuestion) => {
    const answer = answers[question.question];

    switch (question.type) {
      case 'text':
        return (
          <TextInput
            style={styles.textInput}
            placeholder="Type your answer here..."
            value={answer as string}
            onChangeText={text => handleAnswer(text)}
            multiline
          />
        );

      case 'number':
        return (
          <TextInput
            style={styles.numberInput}
            placeholder="Enter a number"
            value={answer as string}
            onChangeText={text => handleAnswer(text)}
            keyboardType="numeric"
          />
        );

      case 'multipleChoice':
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  answer === option && styles.selectedOption,
                ]}
                onPress={() => handleAnswer(option)}>
                <Text
                  style={[
                    styles.optionText,
                    answer === option && styles.selectedOptionText,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'checkbox':
        const selectedOptions = (answer as string[]) || [];
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedOptions.includes(option) && styles.selectedOption,
                ]}
                onPress={() => {
                  const newSelected = selectedOptions.includes(option)
                    ? selectedOptions.filter(item => item !== option)
                    : [...selectedOptions, option];
                  handleAnswer(newSelected);
                }}>
                <Text
                  style={[
                    styles.optionText,
                    selectedOptions.includes(option) &&
                      styles.selectedOptionText,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  if (showResult) {
    return (
      <View style={styles.container}>
        <TopBar title={project.title} level={1} points={0} />
        <View style={styles.successContainer}>
          <View style={styles.successCard}>
            <Text style={styles.successTitle}>Project Setup Complete! 🎉</Text>
            <Text style={styles.successDescription}>
              You can now start working on your project. Good luck!
            </Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>Back to Projects</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (currentQuestionIndex === -1) {
    return (
      <View style={styles.container}>
        <TopBar title={project.title} level={1} points={0} />
        <ScrollView style={styles.scrollView}>
          {/* Project Header */}
          <View style={styles.header}>
            <Image
              source={{uri: project.images[0]}}
              style={styles.headerImage}
              resizeMode="cover"
            />
            <View style={styles.projectInfo}>
              <Text style={styles.title}>{project.title}</Text>
              <Text style={styles.description}>{project.description}</Text>
              <View style={styles.metaInfo}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{project.difficulty}</Text>
                </View>
                <Text style={styles.timeText}>{project.estimatedTime}</Text>
              </View>
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleStartProject}>
            <Text style={styles.submitButtonText}>Start Project</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title={project.title} level={1} points={0} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.questionCard}>
          <Text style={styles.questionProgress}>
            Question {currentQuestionIndex + 1} of {project.questions.length}
          </Text>
          <Text style={styles.questionText}>
            {currentQuestion.question}
            {currentQuestion.required && (
              <Text style={styles.required}> *</Text>
            )}
          </Text>
          {renderQuestion(currentQuestion)}
          <TouchableOpacity
            style={[
              styles.nextButton,
              !answers[currentQuestion.question] && styles.disabledButton,
            ]}
            onPress={handleNextQuestion}
            disabled={!answers[currentQuestion.question]}>
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex < project.questions.length - 1
                ? 'Next Question'
                : 'Complete Setup'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 15,
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  projectInfo: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#757575',
    lineHeight: 24,
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#F0EBF8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  badgeText: {
    color: '#6b41a5',
    fontSize: 14,
    fontWeight: '500',
  },
  timeText: {
    color: '#757575',
    fontSize: 14,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 15,
  },
  questionProgress: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 20,
  },
  required: {
    color: '#F44336',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212121',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212121',
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#6b41a5',
  },
  optionText: {
    fontSize: 16,
    color: '#212121',
  },
  selectedOptionText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#6b41a5',
    margin: 15,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#6b41a5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  successContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  successCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  successDescription: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: '#6b41a5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ProjectScreen;
