import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import type {Project} from '../../../constants/jsonFile';

type Props = {
  project: Project;
  onPress: () => void;
  onDelete: () => void;
};

const ProjectCard = ({project, onPress, onDelete}: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cardContent} onPress={onPress}>
        <Image
          source={{uri: project.images[0]}}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{project.title}</Text>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{project.difficulty}</Text>
            </View>
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {project.description}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.category}>{project.category}</Text>
            <Text style={styles.time}>{project.estimatedTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    width: 280,
    elevation: 2,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  cardContent: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
    marginRight: 8,
  },
  difficultyBadge: {
    backgroundColor: '#F0EBF8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#6b41a5',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: '#6b41a5',
    fontWeight: '500',
  },
  time: {
    fontSize: 12,
    color: '#757575',
  },
});

export default ProjectCard;
