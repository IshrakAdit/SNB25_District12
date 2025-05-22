import {Share, Platform} from 'react-native';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_DIR =
  Platform.OS === 'ios'
    ? RNFS.DocumentDirectoryPath
    : RNFS.ExternalDirectoryPath;
const EXPORT_DIR = `${BASE_DIR}/exports`;
const TEMP_DIR = `${EXPORT_DIR}/temp`;
const STORAGE_KEYS = {
  COURSES: 'courses',
  PROJECTS: 'projects',
  USER_PREFERENCES: 'userPreferences',
  IMAGES: 'cached_images',
};

export const exportData = async () => {
  try {
    console.log('Starting export process...');
    console.log('Creating directories...');

    // Ensure base directory exists
    await RNFS.mkdir(BASE_DIR).catch(err =>
      console.log('Base dir exists or error:', err),
    );

    // Ensure export directory exists
    await RNFS.mkdir(EXPORT_DIR).catch(err =>
      console.log('Export dir exists or error:', err),
    );

    // Create temp directory (or clear it if it exists)
    if (await RNFS.exists(TEMP_DIR)) {
      await RNFS.unlink(TEMP_DIR);
    }
    await RNFS.mkdir(TEMP_DIR);

    console.log('Directories created successfully');

    // Get all stored data
    console.log('Fetching stored data...');
    const [courses, projects, preferences, imageCache] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.COURSES),
      AsyncStorage.getItem(STORAGE_KEYS.PROJECTS),
      AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES),
      AsyncStorage.getItem(STORAGE_KEYS.IMAGES),
    ]);

    console.log('Data fetched:', {
      hasCourses: !!courses,
      hasProjects: !!projects,
      hasPreferences: !!preferences,
      hasImageCache: !!imageCache,
    });

    // Save JSON data to files
    console.log('Writing JSON files...');
    await Promise.all([
      RNFS.writeFile(`${TEMP_DIR}/courses.json`, courses || '[]'),
      RNFS.writeFile(`${TEMP_DIR}/projects.json`, projects || '[]'),
      RNFS.writeFile(`${TEMP_DIR}/preferences.json`, preferences || '[]'),
      RNFS.writeFile(`${TEMP_DIR}/imageCache.json`, imageCache || '[]'),
    ]);

    // Copy all cached images to temp directory
    if (imageCache) {
      console.log('Copying cached images...');
      const cachedImages = JSON.parse(imageCache);
      for (const image of cachedImages) {
        // Clean up the file paths by removing query parameters
        const sourceFileName = image.localUri.split('?')[0].split('/').pop();
        if (sourceFileName) {
          const sourcePath = `${BASE_DIR}/cached_images/${sourceFileName}`;
          const targetPath = `${TEMP_DIR}/${sourceFileName}`;
          console.log('Copying image from:', sourcePath, 'to:', targetPath);
          if (await RNFS.exists(sourcePath)) {
            await RNFS.copyFile(sourcePath, targetPath);
            console.log('Copied image:', sourceFileName);
          } else {
            console.log('Source image not found:', sourcePath);
          }
        }
      }
    }

    // List files to share
    const files = await RNFS.readDir(TEMP_DIR);
    console.log(
      'Files to share:',
      files.map(f => f.name),
    );

    const fileDetails = await Promise.all(
      files.map(async file => {
        const content = await RNFS.readFile(file.path, 'utf8'); // or 'base64' for binary
        return {
          name: file.name,
          path: file.path,
          content: content,
        };
      }),
    );

    console.log('Files with contents:', fileDetails);

    // Share the directory contents
    await Share.share({
      title: 'Learning App Data',
      message: 'Here is my learning app data',
      url: `file://${TEMP_DIR}`,
    });

    console.log('Share sheet opened successfully');
    return true;
  } catch (error) {
    console.error('Error in export process:', error);
    throw error;
  }
};

export const importData = async (zipFilePath: string) => {
  try {
    // Create temp directory
    await RNFS.mkdir(TEMP_DIR);

    // Unzip the file
    await RNFS.unzip(zipFilePath, TEMP_DIR);

    // Read JSON files
    const [courses, projects, preferences, imageCache] = await Promise.all([
      RNFS.readFile(`${TEMP_DIR}/courses.json`),
      RNFS.readFile(`${TEMP_DIR}/projects.json`),
      RNFS.readFile(`${TEMP_DIR}/preferences.json`),
      RNFS.readFile(`${TEMP_DIR}/imageCache.json`),
    ]);

    // Parse image cache to get file names
    const cachedImages = JSON.parse(imageCache);

    // Create images directory if it doesn't exist
    const imagesDir = `${
      Platform.OS === 'ios'
        ? RNFS.DocumentDirectoryPath
        : RNFS.ExternalDirectoryPath
    }/cached_images`;
    await RNFS.mkdir(imagesDir);

    // Copy images to app's storage
    for (const image of cachedImages) {
      const fileName = image.localUri.split('/').pop();
      if (fileName) {
        const sourcePath = `${TEMP_DIR}/${fileName}`;
        const targetPath = `${imagesDir}/${fileName}`;
        if (await RNFS.exists(sourcePath)) {
          await RNFS.copyFile(sourcePath, targetPath);
          // Update the localUri in cached images to match new path
          image.localUri = targetPath;
        }
      }
    }

    // Save all data to AsyncStorage
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.COURSES, courses),
      AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, projects),
      AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences),
      AsyncStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(cachedImages)),
    ]);

    // Clean up temp directory
    await RNFS.unlink(TEMP_DIR);

    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};
