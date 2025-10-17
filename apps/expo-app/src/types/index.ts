export const BLE = {
  SERVICE: '19B10000-E8F2-537E-4F6C-D104768A1214',
  CONTROL: '19B10001-E8F2-537E-4F6C-D104768A1214',
  DATA: '19B10002-E8F2-537E-4F6C-D104768A1214',
} as const;

export type PuttResult = {
  prediction: string;
  overall_score?: number;
  timestamp?: number;
};
export interface StrokeData {
  id: string;
  timestamp: number;
  classification: string;
  confidence: number;
  accelerometer: {
    x: number;
    y: number;
    z: number;
  };
  gyroscope: {
    x: number;
    y: number;
    z: number;
  };
  duration: number;
}

export interface Session {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  duration: number; // in minutes
  strokes: StrokeData[];
  totalStrokes: number;
  averageConfidence: number;
  classifications: Record<string, number>; // classification -> count
}

export interface BluetoothDevice {
  id: string;
  name: string;
  address?: string;
  isConnected: boolean;
  rssi?: number;
}

export interface ClassificationResult {
  label: string;
  confidence: number;
  timestamp: number;
}

export interface AppSettings {
  sessionDuration: number; // default session duration in minutes
  autoSave: boolean;
  bluetoothAutoConnect: boolean;
  dataRetentionDays: number;
  theme: 'light' | 'dark' | 'auto';
}
