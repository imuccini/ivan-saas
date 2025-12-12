export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
  accountExpiration: string; // ISO Date
}

export interface Device {
  id: string;
  name: string;
  type: 'MacBook' | 'iPhone' | 'iPad' | 'Android' | 'Windows' | 'ChromeOS';
  lastSeen: string;
  status: 'Connected' | 'Offline';
  network: 'Secure' | 'IoT';
  trafficUsage?: string;
  trafficHistory?: { time: string; value: number }[];
}

export interface WifiCredential {
  ssid: string;
  username?: string;
  password?: string;
  securityType: 'WPA2/WPA3 Enterprise' | 'WPA2 Personal';
}

export enum AppRoute {
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  ONBOARDING = 'onboarding',
  WIFI_DETAILS = 'wifi-details',
  DEVICES = 'devices',
  ACCOUNT = 'account',
  HELP = 'help',
  DEVICE_DETAIL = 'device-detail',
  GUIDES = 'guides'
}