import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import TopBar from './TopBar';

type RootStackParamList = {
  Home: undefined;
  ContentScreen: {course: any};
  ProjectScreen: {project: any};
  LeaderboardScreen: undefined;
};

type LeaderboardScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LeaderboardScreen'
>;

type Props = {
  navigation: LeaderboardScreenNavigationProp;
};

type LeaderboardEntry = {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  weeklyGain: number;
  isCurrentUser?: boolean;
};

const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Sarah Chen',
    points: 212,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    weeklyGain: 62,
  },
  {
    rank: 2,
    name: 'Michael Kim',
    points: 204,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    weeklyGain: 22,
  },
  {
    rank: 3,
    name: 'Emily Rodriguez',
    points: 188,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    weeklyGain: 77,
  },
  {
    rank: 4,
    name: 'David Park',
    points: 150,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    weeklyGain: 45,
  },
  {
    rank: 5,
    name: 'Ishrak',
    points: 88,
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c',
    weeklyGain: 72,
    isCurrentUser: true,
  },
  // Add more entries as needed
];

const LeaderboardScreen = ({navigation}: Props) => {
  return (
    <View style={styles.container}>
      <TopBar
        title="Leaderboard"
        level={1}
        points={100}
        onBack={() => navigation.goBack()}
      />

      {/* Top 3 Podium */}
      <View style={styles.podiumContainer}>
        {leaderboardData.slice(0, 3).map((entry, index) => (
          <View
            key={entry.rank}
            style={[
              styles.podiumItem,
              index === 1 && styles.firstPlace,
              index === 0 && styles.secondPlace,
              index === 2 && styles.thirdPlace,
            ]}>
            <Image
              source={{uri: `${entry.avatar}?w=100`}}
              style={styles.podiumAvatar}
            />
            <Text style={styles.podiumName} numberOfLines={1}>
              {entry.name}
            </Text>
            <Text style={styles.podiumPoints}>{entry.points}</Text>
            <View style={styles.podiumRank}>
              <Text style={styles.podiumRankText}>#{entry.rank}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Leaderboard List */}
      <ScrollView style={styles.leaderboardList}>
        {leaderboardData.map(entry => (
          <View
            key={entry.rank}
            style={[
              styles.leaderboardItem,
              entry.isCurrentUser && styles.currentUserItem,
            ]}>
            <Text style={styles.rankText}>#{entry.rank}</Text>
            <Image
              source={{uri: `${entry.avatar}?w=50`}}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{entry.name}</Text>
              <Text style={styles.points}>{entry.points} points</Text>
            </View>
            <View style={styles.weeklyGain}>
              <Text style={styles.weeklyGainText}>+{entry.weeklyGain}</Text>
              <Text style={styles.weeklyLabel}>this week</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  podiumItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 100,
  },
  firstPlace: {
    marginBottom: -20,
  },
  secondPlace: {
    marginBottom: -10,
  },
  thirdPlace: {
    marginBottom: 0,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#6b41a5',
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginTop: 8,
    maxWidth: 90,
  },
  podiumPoints: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  podiumRank: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#6b41a5',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumRankText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  leaderboardList: {
    flex: 1,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 1,
  },
  currentUserItem: {
    backgroundColor: '#F0EBF8',
  },
  rankText: {
    width: 40,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  points: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  weeklyGain: {
    alignItems: 'flex-end',
  },
  weeklyGainText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  weeklyLabel: {
    fontSize: 12,
    color: '#757575',
  },
});

export default LeaderboardScreen;
