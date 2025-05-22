// Types for the course content
export interface Quiz {
  question: string;
  options: string[];
  answer: string;
}

export interface DataCollectionQuestion {
  question: string;
  type: 'text' | 'number' | 'multipleChoice' | 'checkbox';
  options?: string[];
  required: boolean;
}

export interface CourseContent {
  id: string;
  topicId: string;
  title: string;
  article: string;
  images: string[];
  videos: string[];
  audio: string[];
  quiz: Quiz[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  questions: DataCollectionQuestion[];
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
}

// Sample URLs for media content (replace these with your actual hosted files)
const MEDIA_BASE_URL = 'https://storage.googleapis.com/your-bucket';

// Dummy course data
export const courseContents: CourseContent[] = [
  {
    id: '1',
    topicId: '2',
    title: 'Introduction to Web Development',
    article: `# Introduction to Web Development

Web development is a dynamic and ever-evolving field that encompasses the creation and maintenance of websites and web applications. Let's dive deep into the core technologies that power the modern web.

## HTML - The Building Blocks

![](image:0)

HTML (HyperText Markup Language) is the backbone of every webpage. It provides the fundamental structure that defines how content is organized and presented. Think of it as the skeleton of a website, where each element has a specific purpose and meaning.

### Key HTML Concepts:
- **Semantic Structure**: Using appropriate tags like \`<header>\`, \`<nav>\`, \`<main>\`, and \`<footer>\` to give meaning to content
- **Accessibility**: Ensuring your content is accessible to all users, including those using screen readers
- **Forms and Input**: Creating interactive elements to collect user data
- **Tables and Lists**: Organizing data in a structured format
- **Meta Information**: Providing data about your webpage for search engines and browsers

## CSS - The Stylist

![](image:1)

Cascading Style Sheets (CSS) transform plain HTML into visually appealing websites. It's the technology responsible for colors, layouts, animations, and responsive design.

### Modern CSS Features:
1. **Flexbox and Grid**
   - Creating complex layouts with minimal code
   - Building responsive designs that work across devices
   - Implementing dynamic sizing and spacing

2. **Custom Properties**
   - Defining reusable values
   - Creating themeable components
   - Maintaining consistent styling

3. **Animations and Transitions**
   - Adding smooth state changes
   - Creating engaging user experiences
   - Implementing loading states and feedback

![](image:2)

## JavaScript - The Brain

JavaScript brings interactivity and dynamic behavior to web pages. It's a versatile language that can run both in the browser and on servers.

### Essential JavaScript Topics:
1. **DOM Manipulation**
   - Selecting and modifying elements
   - Handling user events
   - Creating dynamic content

2. **Asynchronous Programming**
   - Promises and async/await
   - Fetching data from APIs
   - Managing application state

3. **Modern JavaScript Features**
   - ES6+ syntax and features
   - Modules and imports
   - Object-oriented programming concepts

### Best Practices for Web Development

1. **Performance Optimization**
   - Minimizing file sizes
   - Optimizing images and assets
   - Implementing caching strategies
   - Using lazy loading for better initial load times

2. **Cross-Browser Compatibility**
   - Testing across different browsers
   - Using feature detection
   - Implementing graceful degradation

3. **Security Considerations**
   - Preventing XSS attacks
   - Securing user data
   - Implementing HTTPS
   - Managing cookies and local storage

4. **Version Control**
   - Using Git for code management
   - Creating meaningful commits
   - Collaborating with other developers

5. **Responsive Design**
   - Mobile-first approach
   - Breakpoint strategies
   - Fluid typography
   - Flexible images

![](image:3)

## Development Tools

Modern web development relies heavily on various tools and technologies:

1. **Code Editors**
   - Visual Studio Code
   - Sublime Text
   - WebStorm

2. **Browser Developer Tools**
   - Element inspector
   - Console debugging
   - Network monitoring
   - Performance profiling

3. **Build Tools**
   - Webpack
   - Babel
   - npm/yarn
   - Task runners

4. **Testing Tools**
   - Jest
   - Cypress
   - Selenium
   - Testing libraries

Let's test your knowledge!`,
    images: [
      'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2074&auto=format&fit=crop',
    ],
    videos: [
      `${MEDIA_BASE_URL}/css-demo.mp4`, // ~30 second demo
      `${MEDIA_BASE_URL}/js-intro.mp4`, // ~30 second intro
    ],
    audio: [
      `${MEDIA_BASE_URL}/html-basics.mp3`,
      `${MEDIA_BASE_URL}/css-selectors.mp3`,
      `${MEDIA_BASE_URL}/js-fundamentals.mp3`,
    ],
    quiz: [
      {
        question: 'What is HTML primarily used for?',
        options: [
          'Styling web pages',
          'Adding interactivity',
          'Structuring web content',
          'Database management',
        ],
        answer: 'Structuring web content',
      },
      {
        question: 'Which technology is responsible for styling web pages?',
        options: ['HTML', 'CSS', 'JavaScript', 'Python'],
        answer: 'CSS',
      },
      {
        question:
          'What is the primary purpose of JavaScript in web development?',
        options: [
          'To structure content',
          'To style pages',
          'To add interactivity',
          'To manage servers',
        ],
        answer: 'To add interactivity',
      },
    ],
  },
  {
    id: '2',
    topicId: '2',
    title: 'Mobile App Development with React Native',
    article: `# Mobile App Development with React Native

React Native has revolutionized mobile app development by enabling developers to build native mobile applications using JavaScript and React. Let's explore this powerful framework in detail.

## Getting Started with React Native

![](image:0)

React Native combines the best parts of native development with React, a best-in-class JavaScript library for building user interfaces. Understanding its core principles is essential for building successful mobile applications.

### Core Concepts:
1. **Virtual DOM**
   - How React Native bridges to native components
   - Efficient rendering and updates
   - Platform-specific implementations

2. **Component-Based Architecture**
   - Reusable building blocks
   - Props and state management
   - Lifecycle methods
   - Functional components and hooks

3. **Native Modules**
   - Accessing platform-specific features
   - Building custom native modules
   - Integrating third-party native libraries

## Components and Styling

![](image:1)

React Native provides a rich set of built-in components that map directly to native UI elements. Understanding how to style and customize these components is crucial for creating polished applications.

### Essential Components:
1. **View and Text**
   - Basic building blocks
   - Nested layouts
   - Text styling and formatting

2. **Lists and Scrolling**
   - FlatList optimization
   - ScrollView usage
   - Pull-to-refresh
   - Infinite scrolling

3. **User Input**
   - TextInput components
   - Keyboard handling
   - Form management
   - Input validation

### Styling in React Native:
1. **Flexbox Layout**
   - Main axis and cross axis
   - Flex properties
   - Alignment and justification
   - Responsive layouts

2. **Platform-Specific Styling**
   - Platform.select
   - Dynamic styles
   - Adaptive design

![](image:2)

## Navigation and State Management

Navigation is a fundamental aspect of mobile applications. React Native offers several approaches to implement navigation and manage application state.

### Navigation Patterns:
1. **Stack Navigation**
   - Push and pop screens
   - Navigation lifecycle
   - Screen transitions

2. **Tab Navigation**
   - Bottom tabs
   - Top tabs
   - Custom tab bars

3. **Drawer Navigation**
   - Side menu implementation
   - Nested navigation
   - Custom drawers

### State Management:
1. **Local State**
   - useState hook
   - Component state
   - Lifting state up

2. **Global State**
   - Context API
   - Redux integration
   - Async storage
   - State persistence

## Performance Optimization

![](image:3)

Optimizing React Native applications is crucial for providing a smooth user experience:

1. **Memory Management**
   - Avoiding memory leaks
   - Image optimization
   - List virtualization

2. **Render Optimization**
   - Pure components
   - Memoization
   - Avoiding unnecessary renders

3. **Network Performance**
   - Efficient API calls
   - Caching strategies
   - Offline support

## Testing and Debugging

1. **Testing Strategies**
   - Unit testing with Jest
   - Integration testing
   - E2E testing with Detox
   - Component testing

2. **Debugging Tools**
   - React Native Debugger
   - Chrome Developer Tools
   - Performance monitoring
   - Error handling

3. **Deployment**
   - App signing
   - Build configuration
   - App store submission
   - CI/CD setup

Time to test your React Native knowledge!`,
    images: [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=2074&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop',
    ],
    videos: [
      `${MEDIA_BASE_URL}/rn-components.mp4`,
      `${MEDIA_BASE_URL}/rn-navigation.mp4`,
    ],
    audio: [
      `${MEDIA_BASE_URL}/rn-intro.mp3`,
      `${MEDIA_BASE_URL}/rn-components.mp3`,
      `${MEDIA_BASE_URL}/rn-state.mp3`,
    ],
    quiz: [
      {
        question:
          'What language is primarily used in React Native development?',
        options: ['Java', 'Swift', 'JavaScript', 'Python'],
        answer: 'JavaScript',
      },
      {
        question: 'What is a key advantage of React Native?',
        options: [
          'Native performance',
          'Write once, run anywhere',
          'Direct hardware access',
          'Small app size',
        ],
        answer: 'Write once, run anywhere',
      },
      {
        question: 'Which company developed React Native?',
        options: ['Google', 'Apple', 'Microsoft', 'Facebook'],
        answer: 'Facebook',
      },
    ],
  },
  {
    id: '3',
    topicId: '2',
    title: 'Data Science Fundamentals',
    article: `# Data Science Fundamentals

Data Science combines statistics, programming, and domain expertise to extract meaningful insights from data. Let's explore the fundamental concepts and tools that make up this exciting field.

## Understanding Data

![](image:0)

Data is the foundation of data science. Understanding different types of data and how to work with them is crucial for any data scientist.

### Types of Data:
1. **Structured Data**
   - Relational databases
   - CSV files
   - Time series data
   - Tabular formats

2. **Unstructured Data**
   - Text documents
   - Images
   - Audio files
   - Social media content

3. **Semi-structured Data**
   - JSON
   - XML
   - Log files
   - Email messages

## Data Analysis with Python

![](image:1)

Python has become the de facto language for data science due to its rich ecosystem of libraries and tools.

### Essential Python Libraries:
1. **NumPy**
   - Array operations
   - Mathematical functions
   - Linear algebra
   - Random number generation

2. **Pandas**
   - Data manipulation
   - Time series analysis
   - Data cleaning
   - Data transformation

3. **Scikit-learn**
   - Machine learning algorithms
   - Model selection
   - Preprocessing tools
   - Evaluation metrics

### Data Preprocessing:
1. **Data Cleaning**
   - Handling missing values
   - Removing duplicates
   - Fixing inconsistencies
   - Dealing with outliers

2. **Feature Engineering**
   - Creating new features
   - Encoding categorical variables
   - Scaling numerical features
   - Dimensionality reduction

![](image:2)

## Visualization Techniques

Data visualization is crucial for understanding patterns and communicating insights effectively.

### Visualization Libraries:
1. **Matplotlib**
   - Basic plotting
   - Customization options
   - Multiple plot types
   - Saving visualizations

2. **Seaborn**
   - Statistical visualizations
   - Beautiful defaults
   - Complex plot types
   - Color palettes

3. **Plotly**
   - Interactive plots
   - Web-based visualization
   - Real-time updates
   - Dashboard creation

### Types of Visualizations:
1. **Statistical Plots**
   - Histograms
   - Box plots
   - Scatter plots
   - Violin plots

2. **Time Series Visualization**
   - Line plots
   - Area charts
   - Seasonal decomposition
   - Moving averages

3. **Geographic Visualization**
   - Choropleth maps
   - Point maps
   - Heat maps
   - Interactive maps

![](image:3)

## Statistical Analysis

Understanding statistics is fundamental to data science:

1. **Descriptive Statistics**
   - Measures of central tendency
   - Measures of dispersion
   - Distribution analysis
   - Correlation analysis

2. **Inferential Statistics**
   - Hypothesis testing
   - Confidence intervals
   - Regression analysis
   - ANOVA

3. **Probability**
   - Basic probability concepts
   - Probability distributions
   - Bayes' theorem
   - Random variables

## Machine Learning Basics

1. **Supervised Learning**
   - Classification
   - Regression
   - Model evaluation
   - Cross-validation

2. **Unsupervised Learning**
   - Clustering
   - Dimensionality reduction
   - Anomaly detection
   - Association rules

3. **Model Selection**
   - Bias-variance tradeoff
   - Overfitting and underfitting
   - Hyperparameter tuning
   - Ensemble methods

Ready to test your data science knowledge?`,
    images: [
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=2074&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop',
    ],
    videos: [
      `${MEDIA_BASE_URL}/python-analysis.mp4`,
      `${MEDIA_BASE_URL}/data-viz.mp4`,
    ],
    audio: [
      `${MEDIA_BASE_URL}/ds-intro.mp3`,
      `${MEDIA_BASE_URL}/python-data.mp3`,
      `${MEDIA_BASE_URL}/data-viz.mp3`,
    ],
    quiz: [
      {
        question: 'What is the first step in data science process?',
        options: [
          'Data Visualization',
          'Data Collection',
          'Data Analysis',
          'Machine Learning',
        ],
        answer: 'Data Collection',
      },
      {
        question: 'Which programming language is most popular in data science?',
        options: ['Java', 'C++', 'Python', 'JavaScript'],
        answer: 'Python',
      },
      {
        question: 'What is the purpose of data visualization?',
        options: [
          'To make data look pretty',
          'To communicate insights effectively',
          'To store data',
          'To clean data',
        ],
        answer: 'To communicate insights effectively',
      },
    ],
  },
];

// Dummy project data
export const projects: Project[] = [
  {
    id: '1',
    title: 'Personal Portfolio Website',
    description:
      'Create a responsive portfolio website to showcase your work and skills.',
    images: [
      'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    ],
    questions: [
      {
        question: 'What is your target audience for this portfolio?',
        type: 'text',
        required: true,
      },
      {
        question: 'Which sections will your portfolio include?',
        type: 'checkbox',
        options: [
          'About Me',
          'Projects',
          'Skills',
          'Contact',
          'Blog',
          'Testimonials',
        ],
        required: true,
      },
      {
        question: 'How many projects will you showcase?',
        type: 'number',
        required: true,
      },
      {
        question: 'What is your primary goal with this portfolio?',
        type: 'multipleChoice',
        options: [
          'Job hunting',
          'Freelance work',
          'Personal branding',
          'Networking',
        ],
        required: true,
      },
    ],
    category: 'Web Development',
    difficulty: 'Intermediate',
    estimatedTime: '2-3 days',
  },
  {
    id: '2',
    title: 'Weather Dashboard',
    description:
      'Build a weather dashboard that displays current weather and forecasts for multiple cities.',
    images: [
      'https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?q=80&w=1000&auto=format&fit=crop',
    ],
    questions: [
      {
        question: 'Which weather API will you use?',
        type: 'multipleChoice',
        options: ['OpenWeatherMap', 'WeatherAPI', 'AccuWeather', 'Dark Sky'],
        required: true,
      },
      {
        question: 'What weather metrics will you display?',
        type: 'checkbox',
        options: [
          'Temperature',
          'Humidity',
          'Wind Speed',
          'Precipitation',
          'UV Index',
          'Air Quality',
        ],
        required: true,
      },
      {
        question: 'How many days of forecast will you show?',
        type: 'number',
        required: true,
      },
    ],
    category: 'API Integration',
    difficulty: 'Beginner',
    estimatedTime: '1-2 days',
  },
];
