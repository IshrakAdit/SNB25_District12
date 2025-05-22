declare module 'react-native-zeroconf' {
  interface ZeroconfService {
    name: string;
    host: string;
    port: number;
    [key: string]: any;
  }

  type ServiceEvent = 'resolved' | 'removed' | 'error' | 'start' | 'stop' | 'published' | 'unpublished';

  class Zeroconf {
    on(event: ServiceEvent, callback: (service: ZeroconfService) => void): void;
    scan(type: string, protocol: string, domain: string): void;
    publishService(type: string, protocol: string, domain: string, name: string, port: number): void;
    unpublishService(type: string): void;
    stop(): void;
  }

  export default Zeroconf;
} 