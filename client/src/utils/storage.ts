import AsyncStorage from '@react-native-async-storage/async-storage';
import {CourseContent, Project} from '../../constants/jsonFile';

// Storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'userPreferences',
  COURSES: 'courses',
  PROJECTS: 'projects',
  IMAGES: 'cached_images',
};

// Type for cached image data
type CachedImage = {
  url: string;
  localUri: string;
};

export const saveUserPreferences = async (preferences: string[]) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PREFERENCES,
      JSON.stringify(preferences),
    );
  } catch (error) {
    console.error('Error saving user preferences:', error);
    throw error;
  }
};

export const getUserPreferences = async (): Promise<string[]> => {
  try {
    const preferences = await AsyncStorage.getItem(
      STORAGE_KEYS.USER_PREFERENCES,
    );
    return preferences ? JSON.parse(preferences) : [];
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return [];
  }
};

export const saveCourses = async (courses: CourseContent[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  } catch (error) {
    console.error('Error saving courses:', error);
    throw error;
  }
};

export const getCourses = async (): Promise<CourseContent[]> => {
  try {
    const courses = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
    return courses ? JSON.parse(courses) : [];
  } catch (error) {
    console.error('Error getting courses:', error);
    return [];
  }
};

export const saveProjects = async (projects: Project[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects:', error);
    throw error;
  }
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const projects = await AsyncStorage.getItem(STORAGE_KEYS.PROJECTS);
    return projects ? JSON.parse(projects) : [];
  } catch (error) {
    console.error('Error getting projects:', error);
    return [];
  }
};

export const cacheImage = async (imageUrl: string, localUri: string) => {
  try {
    const existingImages = await AsyncStorage.getItem(STORAGE_KEYS.IMAGES);
    const cachedImages: CachedImage[] = existingImages
      ? JSON.parse(existingImages)
      : [];

    // Add new image to cache if it doesn't exist
    if (!cachedImages.some(img => img.url === imageUrl)) {
      cachedImages.push({url: imageUrl, localUri});
      await AsyncStorage.setItem(
        STORAGE_KEYS.IMAGES,
        JSON.stringify(cachedImages),
      );
    }
  } catch (error) {
    console.error('Error caching image:', error);
    throw error;
  }
};

export const getCachedImageUri = async (
  imageUrl: string,
): Promise<string | null> => {
  try {
    const existingImages = await AsyncStorage.getItem(STORAGE_KEYS.IMAGES);
    if (!existingImages) return null;

    const cachedImages: CachedImage[] = JSON.parse(existingImages);
    const cachedImage = cachedImages.find(img => img.url === imageUrl);
    return cachedImage ? cachedImage.localUri : null;
  } catch (error) {
    console.error('Error getting cached image:', error);
    return null;
  }
};
