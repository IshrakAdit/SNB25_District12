import TcpSocket from 'react-native-tcp-socket';

export interface Lesson {
  title: string;
  topicId: string;
  id: string;
  source?: string;  // The username of who shared this lesson
  receivedAt?: number;  // Timestamp when the lesson was received
}

interface LessonMetadata {
  topicId: string;
  id: string;
}

type SyncMessageType = 
  | 'METADATA' 
  | 'LESSON_REQUEST' 
  | 'LESSON_DATA' 
  | 'PREFERENCES'
  | 'USERNAME';

interface SyncMessage {
  type: SyncMessageType;
  data: LessonMetadata[] | number[] | Lesson[] | LessonMetadata | string;
}

export class LessonSyncService {
  private server: any;
  private client: any;
  private onNewLessonsCallback: ((lessons: Lesson[]) => void) | null = null;
  private localLessons: Map<string, Lesson>;
  private remoteMetadata: Set<string>;
  private socket: any;
  private remoteUsername: string = '';
  private localUsername: string = '';

  constructor() {
    this.localLessons = new Map();
    this.remoteMetadata = new Set();
  }

  private getMetadataKey(metadata: LessonMetadata): string {
    return `${metadata.topicId}-${metadata.id}`;
  }

  private setupSocket(socket: any, lessons: Lesson[], preferences: string[], username: string) {
    this.socket = socket;
    this.remoteUsername = username;
    this.localUsername = username;
    
    // Store local lessons in map for quick access
    lessons.forEach(lesson => {
      this.localLessons.set(
        this.getMetadataKey({ topicId: lesson.topicId, id: lesson.id }), 
        lesson
      );
    });

    // Send our username first
    socket.write(JSON.stringify({
      type: 'USERNAME',
      data: username
    }) + '\n');

    // Send metadata next
    const metadata: LessonMetadata[] = lessons.map(({ topicId, id }) => ({
      topicId,
      id
    }));
    
    socket.write(JSON.stringify({
      type: 'METADATA',
      data: metadata
    }) + '\n');

    // Send preferences last
    socket.write(JSON.stringify({
      type: 'PREFERENCES',
      data: preferences
    }) + '\n');

    // Handle incoming data
    let buffer = '';
    socket.on('data', (data: Buffer) => {
      buffer += data.toString();
      const messages = buffer.split('\n');
      buffer = messages.pop() || '';

      messages.forEach(msg => {
        if (msg) {
          try {
            const parsed: SyncMessage = JSON.parse(msg);
            this.handleIncomingMessage(parsed, preferences);
          } catch (e) {
            console.error('Error parsing message:', e);
          }
        }
      });
    });
  }

  startServer(port: number, lessons: Lesson[], preferences: string[], username: string) {
    this.localUsername = username;
    this.server = TcpSocket.createServer((socket: any) => {
      console.log('Client connected');
      this.setupSocket(socket, lessons, preferences, username);
    }).listen(port);
  }

  connectToServer(host: string, port: number, lessons: Lesson[], preferences: string[], username: string) {
    this.localUsername = username;
    this.client = TcpSocket.createConnection({
      host,
      port,
    }, () => {
      console.log('Connected to server');
      this.setupSocket(this.client, lessons, preferences, username);
    });
  }

  private handleIncomingMessage(message: SyncMessage, preferences: string[]) {
    switch (message.type) {
      case 'USERNAME': {
        this.remoteUsername = message.data as string;
        break;
      }

      case 'METADATA': {
        const metadata = message.data as LessonMetadata[];
        // Filter metadata based on preferences and what we don't have
        const neededLessons = metadata.filter(meta => {
          const key = this.getMetadataKey(meta);
          return (
            preferences.includes(meta.topicId) && 
            !this.localLessons.has(key) &&
            !this.remoteMetadata.has(key)
          );
        });

        // Store remote metadata
        metadata.forEach(meta => {
          this.remoteMetadata.add(this.getMetadataKey(meta));
        });

        // Request needed lessons
        neededLessons.forEach(meta => {
          this.socket.write(JSON.stringify({
            type: 'LESSON_REQUEST',
            data: meta
          }) + '\n');
        });
        break;
      }

      case 'LESSON_REQUEST': {
        const requested = message.data as LessonMetadata;
        const key = this.getMetadataKey(requested);
        const lesson = this.localLessons.get(key);
        if (lesson) {
          this.socket.write(JSON.stringify({
            type: 'LESSON_DATA',
            data: [{
              ...lesson,
              source: this.localUsername,
              receivedAt: Date.now()
            }]
          }) + '\n');
        }
        break;
      }

      case 'LESSON_DATA': {
        const lessons = (message.data as Lesson[]).map(lesson => ({
          ...lesson,
          source: this.remoteUsername || 'Unknown',
          receivedAt: Date.now()
        }));
        if (this.onNewLessonsCallback) {
          this.onNewLessonsCallback(lessons);
        }
        break;
      }
    }
  }

  onNewLessons(callback: (lessons: Lesson[]) => void) {
    this.onNewLessonsCallback = callback;
  }

  stop() {
    if (this.server) {
      this.server.close();
    }
    if (this.client) {
      this.client.destroy();
    }
    this.localLessons.clear();
    this.remoteMetadata.clear();
  }
} 