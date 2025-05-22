interface ImageInfo {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

/**
 * Parses markdown content, extracts image information, and replaces image tags with placeholders.
 * @param markdown The markdown content to parse
 * @returns An object containing the parsed markdown with image placeholders and an array of image information
 */
export function parseMarkdownImages(markdown: string): { 
  parsedMarkdown: string; 
  images: ImageInfo[] 
} {
  const images: ImageInfo[] = [];
  
  // Regular expression to match markdown image tags with optional width and height attributes
  // Format: ![alt text](url =WIDTHxHEIGHT)
  // or: ![alt text](url width=WIDTH height=HEIGHT)
  const imageRegex = /!\[(.*?)\]\((.*?)(?:\s+=(\d+)x(\d+)|(?:\s+width=(\d+)\s+height=(\d+)))?\)/g;
  
  let match;
  let parsedMarkdown = markdown;
  
  while ((match = imageRegex.exec(markdown)) !== null) {
    const fullMatch = match[0];
    const alt = match[1] || '';
    const src = match[2];
    
    // Check for different width/height formats
    const width = match[3] || match[5] || undefined;
    const height = match[4] || match[6] || undefined;
    
    const imageInfo: ImageInfo = {
      src,
      alt: alt || undefined
    };
    
    if (width) imageInfo.width = parseInt(width, 10);
    if (height) imageInfo.height = parseInt(height, 10);
    
    const imageIndex = images.length;
    images.push(imageInfo);
    
    // Replace the image tag with a placeholder
    parsedMarkdown = parsedMarkdown.replace(fullMatch, `(image ${imageIndex})`);
  }
  
  return {
    parsedMarkdown,
    images
  };
}

/**
 * Restores image tags in parsed markdown by replacing placeholders with original image tags
 * @param parsedMarkdown The markdown with image placeholders
 * @param images Array of image information
 * @returns The markdown with restored image tags
 */
export function restoreMarkdownImages(parsedMarkdown: string, images: ImageInfo[]): string {
  let restoredMarkdown = parsedMarkdown;
  
  // Replace each placeholder with its corresponding image tag
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    let imageTag = `![${image.alt || ''}](${image.src}`;
    
    // Add width and height if they exist
    if (image.width && image.height) {
      imageTag += ` =${image.width}x${image.height}`;
    } else if (image.width) {
      imageTag += ` width=${image.width}`;
      if (image.height) imageTag += ` height=${image.height}`;
    }
    
    imageTag += ')';
    
    restoredMarkdown = restoredMarkdown.replace(`(image ${i})`, imageTag);
  }
  
  return restoredMarkdown;
}
