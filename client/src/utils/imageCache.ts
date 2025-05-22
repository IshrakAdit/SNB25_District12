import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import {cacheImage, getCachedImageUri} from './storage';

const getImageFileName = (url: string): string => {
  // Remove query parameters and get the last part of the path
  const cleanFileName = url.split('?')[0].split('/').pop();
  return cleanFileName || `image-${Date.now()}.jpg`;
};

const getLocalPath = (fileName: string): string => {
  // Remove query parameters from the filename
  const cleanFileName = fileName.split('?')[0].split('/').pop();

  const directory =
    Platform.OS === 'ios'
      ? RNFS.DocumentDirectoryPath
      : RNFS.ExternalDirectoryPath;
  return `${directory}/cached_images/${cleanFileName}`;
};

export const downloadAndCacheImage = async (
  imageUrl: string,
): Promise<string> => {
  try {
    // Check if image is already cached
    const cachedUri = await getCachedImageUri(imageUrl);
    if (cachedUri) {
      // Verify if the file still exists
      const exists = await RNFS.exists(cachedUri);
      if (exists) {
        return cachedUri;
      }
    }

    // Create cache directory if it doesn't exist
    const cacheDir =
      Platform.OS === 'ios'
        ? `${RNFS.DocumentDirectoryPath}/cached_images`
        : `${RNFS.ExternalDirectoryPath}/cached_images`;
    await RNFS.mkdir(cacheDir);

    // Download and save the image
    const fileName = getImageFileName(imageUrl);
    const localPath = getLocalPath(fileName);

    await RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: localPath,
    }).promise;

    // Cache the image location
    await cacheImage(imageUrl, localPath);

    return localPath;
  } catch (error) {
    console.error('Error downloading and caching image:', error);
    throw error;
  }
};

export const downloadAndCacheAllImages = async (
  urls: string[],
): Promise<void> => {
  try {
    await Promise.all(urls.map(url => downloadAndCacheImage(url)));
  } catch (error) {
    console.error('Error downloading multiple images:', error);
    throw error;
  }
};
