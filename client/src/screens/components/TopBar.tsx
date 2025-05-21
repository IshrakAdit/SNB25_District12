import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

type Props = {
  title: string;
  level: number;
  points: number;
};

const TopBar = ({title, level, points}: Props) => {
  return (
    <View style={styles.container}>
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

      <TouchableOpacity style={styles.menuButton}>
        <Image
          source={require('../../../assets/icons/home.png')}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.levelText}>menu</Text>
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
  menuButton: {
    padding: 5,
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});

export default TopBar;
