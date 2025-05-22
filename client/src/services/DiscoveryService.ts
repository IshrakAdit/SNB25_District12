import Zeroconf from 'react-native-zeroconf';

interface ZeroconfService {
  name: string;
  host: string;
  port: number;
  [key: string]: any;
}

export interface ServerInfo {
  host: string;
  port: number;
  name: string;
}

type DiscoveryCallback = (servers: ServerInfo[]) => void;

export class DiscoveryService {
  private zeroconf: Zeroconf;
  private discoveredServers: Map<string, ServerInfo>;
  private onServersUpdated: DiscoveryCallback | null;

  constructor() {
    this.zeroconf = new Zeroconf();
    this.discoveredServers = new Map();
    this.onServersUpdated = null;

    this.zeroconf.on('resolved', (service: ZeroconfService) => {
      if (service.name.startsWith('lessonsync_')) {
        const serverInfo: ServerInfo = {
          host: service.host,
          port: service.port,
          name: service.name.replace('lessonsync_', '')
        };
        this.discoveredServers.set(service.name, serverInfo);
        this.notifyUpdate();
      }
    });

    this.zeroconf.on('removed', (service: ZeroconfService) => {
      if (this.discoveredServers.has(service.name)) {
        this.discoveredServers.delete(service.name);
        this.notifyUpdate();
      }
    });
  }

  private notifyUpdate() {
    if (this.onServersUpdated) {
      this.onServersUpdated(Array.from(this.discoveredServers.values()));
    }
  }

  startAdvertising(deviceName: string, port: number) {
    this.zeroconf.publishService('lessonsync', 'tcp', 'local.', `lessonsync_${deviceName}`, port);
  }

  stopAdvertising() {
    this.zeroconf.unpublishService('lessonsync');
  }

  startDiscovery(callback: DiscoveryCallback) {
    this.onServersUpdated = callback;
    this.discoveredServers.clear();
    this.zeroconf.scan('lessonsync', 'tcp', 'local.');
  }

  stopDiscovery() {
    this.zeroconf.stop();
    this.discoveredServers.clear();
    this.onServersUpdated = null;
  }
} 