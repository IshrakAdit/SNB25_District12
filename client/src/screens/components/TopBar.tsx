import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  LessonServerScreenWrapper: undefined;
  // ... other screens
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  title: string;
  level: number;
  points: number;
  onBack?: () => void;
};

const TopBar = ({title, level, points, onBack}: Props) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      )}
      <View style={styles.leftSection}>
        {/* <Image
          source={require('../../../assets/icons/play.png')}
          style={styles.icon}
          resizeMode="contain"
        /> */}
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>
          Lvl {level} • {points} pts
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.shareButton}
        onPress={() => navigation.navigate('LessonServerScreenWrapper')}>
        <Text style={styles.shareButtonText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#6b41a5',
    paddingVertical: 12,
    paddingHorizontal: 15,
    height: 60,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: 'white',
    marginRight: 10,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  levelText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  shareButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    bottom: 15,
    zIndex: 1,
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TopBar;
