import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Linking,
} from 'react-native';
import TopBar from './TopBar';
import Markdown from 'react-native-markdown-display';
import type {CourseContent} from '../../../constants/jsonFile';
import Sound from 'react-native-sound';

type Props = {
  route: {
    params: {
      course: CourseContent;
    };
  };
};

const ContentScreen = ({route}: Props) => {
  const {course} = route.params;
  const [activeTab, setActiveTab] = useState('Content');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentQuestion = course.quiz[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === currentQuestion.answer) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < course.quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectAnswers(0);
    setQuizCompleted(false);
  };

  const handleAudioPlayback = (audioUrl: string) => {
    if (currentAudio) {
      currentAudio.stop();
      currentAudio.release();
      setCurrentAudio(null);
      setIsPlaying(false);
      return;
    }

    const audio = new Sound(audioUrl, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Failed to load audio:', error);
        return;
      }

      setCurrentAudio(audio);
      audio.play(success => {
        if (success) {
          console.log('Audio played successfully');
          setIsPlaying(false);
          setCurrentAudio(null);
        } else {
          console.log('Audio playback failed');
        }
      });
      setIsPlaying(true);
    });
  };

  const processMarkdown = (content: string) => {
    let processedContent = content;

    // Replace image placeholders with actual image URLs
    course.images.forEach((imageUrl, index) => {
      processedContent = processedContent.replace(
        `![](image:${index})`,
        `![](${imageUrl})`,
      );
    });

    // Replace video placeholders with custom video links
    course.videos.forEach((videoUrl, index) => {
      processedContent = processedContent.replace(
        `[Watch Video](video:${index})`,
        `[Watch Video](${videoUrl})`,
      );
    });

    // Replace audio placeholders with custom audio links
    // course.audio.forEach((audioUrl, index) => {
    //   processedContent = processedContent.replace(
    //     `[Listen](audio:${index})`,
    //     `[🎧 ${
    //       isPlaying && currentAudio ? 'Stop' : 'Play'
    //     } Audio](audio:${audioUrl})`,
    //   );
    // });

    return processedContent;
  };

  const markdownContent = processMarkdown(course.article);

  const handleMarkdownLinkPress = (url: string) => {
    if (url.startsWith('audio:')) {
      const audioUrl = url.replace('audio:', '');
      handleAudioPlayback(audioUrl);
      return false;
    }
    Linking.openURL(url);
    return false;
  };

  const renderQuizContent = () => {
    if (quizCompleted) {
      const score = (correctAnswers / course.quiz.length) * 100;
      return (
        <View style={styles.quizResultsContainer}>
          <Text style={styles.quizCompleteText}>Quiz Completed! 🎉</Text>
          <Text style={styles.scoreText}>Your Score:</Text>
          <Text style={styles.scoreNumber}>{score.toFixed(0)}%</Text>
          <Text style={styles.correctAnswersText}>
            {correctAnswers} out of {course.quiz.length} correct
          </Text>
          <TouchableOpacity style={styles.restartButton} onPress={restartQuiz}>
            <Text style={styles.restartButtonText}>Restart Quiz</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>
          Question {currentQuestionIndex + 1} of {course.quiz.length}
        </Text>
        <Text style={styles.questionTitle}>{currentQuestion.question}</Text>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === option &&
                (showResult
                  ? option === currentQuestion.answer
                    ? styles.correctOption
                    : styles.wrongOption
                  : styles.selectedOption),
            ]}
            onPress={() => handleAnswerSelect(option)}
            disabled={showResult}>
            <Text
              style={[
                styles.optionText,
                selectedAnswer === option &&
                  (showResult
                    ? option === currentQuestion.answer
                      ? styles.correctOptionText
                      : styles.wrongOptionText
                    : styles.selectedOptionText),
              ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
        {showResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              {selectedAnswer === currentQuestion.answer
                ? 'Correct! 🎉'
                : 'Incorrect. Try again!'}
            </Text>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextQuestion}>
              <Text style={styles.nextButtonText}>
                {currentQuestionIndex < course.quiz.length - 1
                  ? 'Next Question'
                  : 'Show Results'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TopBar title={course.title} level={1} points={0} />

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

      {activeTab === 'Content' ? (
        <ScrollView style={styles.contentContainer}>
          <Markdown
            style={{
              body: styles.markdownBody,
              heading1: styles.heading1,
              heading2: styles.heading2,
              paragraph: styles.paragraph,
              link: styles.link,
              image: styles.image,
            }}
            onLinkPress={handleMarkdownLinkPress}>
            {markdownContent}
          </Markdown>
        </ScrollView>
      ) : (
        <ScrollView style={styles.quizContainer}>
          {renderQuizContent()}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
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
  contentContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 8,
  },
  markdownBody: {
    color: '#212121',
    fontSize: 16,
    lineHeight: 24,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
    marginTop: 8,
  },
  heading2: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
    marginTop: 24,
  },
  paragraph: {
    marginBottom: 16,
    lineHeight: 24,
  },
  link: {
    color: '#6b41a5',
    textDecorationLine: 'underline',
  },
  image: {
    width: Dimensions.get('window').width - 60,
    height: 200,
    borderRadius: 8,
    marginVertical: 16,
  },
  quizContainer: {
    flex: 1,
    padding: 15,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
  },
  questionText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 10,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#6b41a5',
  },
  correctOption: {
    backgroundColor: '#4CAF50',
  },
  wrongOption: {
    backgroundColor: '#F44336',
  },
  optionText: {
    fontSize: 16,
    color: '#212121',
  },
  selectedOptionText: {
    color: 'white',
  },
  correctOptionText: {
    color: 'white',
  },
  wrongOptionText: {
    color: 'white',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  nextButton: {
    backgroundColor: '#6b41a5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  quizResultsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  quizCompleteText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 18,
    color: '#757575',
    marginBottom: 10,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6b41a5',
    marginBottom: 10,
  },
  correctAnswersText: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 30,
  },
  restartButton: {
    backgroundColor: '#6b41a5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  restartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ContentScreen;
