// types.ts
import {CourseContent, Project} from './jsonFile';

export type RootStackParamList = {
  Login: undefined;
  Registration: undefined;
  Home: undefined;
  Preferences: undefined;
  ContentScreen: {course: CourseContent};
  ProjectScreen: {project: Project};
  LeaderboardScreen: undefined;
  LessonServerScreenWrapper: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Details: undefined;
};

export type TabParamList = {
  HomeStack: undefined;
  Daily: undefined;
};
