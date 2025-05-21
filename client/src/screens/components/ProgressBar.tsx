import React from 'react';
import {View, StyleSheet} from 'react-native';

type Props = {
  progress: number;
};

const ProgressBar = ({progress}: Props) => {
  return (
    <View style={styles.container}>
      <View style={[styles.progressFill, {width: `${progress * 100}%`}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2962FF',
    borderRadius: 4,
  },
});

export default ProgressBar;
