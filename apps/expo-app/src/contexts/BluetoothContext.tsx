import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { BleManager, Device, Characteristic } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';
import base64 from 'base-64';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export interface BluetoothDevice {
  id: string;
  name: string;
  isConnected: boolean;
  rssi?: number | null;
}

export interface ClassificationResult {
  prediction: string;
  overall_score?: number;
  timestamp?: number;
  features?: Record<string, { value: number; score: number; description: string }>;
}

interface BluetoothContextType {
  devices: BluetoothDevice[];
  isScanning: boolean;
  isConnected: boolean;
  isRecording: boolean;
  recordingTime: number;
  currentDevice: BluetoothDevice | null;
  scanForDevices: () => void;
  connectToDevice: (deviceId: string) => Promise<void>;
  disconnectFromDevice: () => void;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  sendCommand: (command: string) => Promise<void>;
  lastResult?: ClassificationResult | null;
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);

export const useBluetooth = () => {
  const context = useContext(BluetoothContext);
  if (!context) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
};

export const BluetoothProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const managerRef = useRef(new BleManager());
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentDevice, setCurrentDevice] = useState<BluetoothDevice | null>(null);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  const [lastResult, setLastResult] = useState<ClassificationResult | null>(null);

  const SERVICE_UUID = '19B10000-E8F2-537E-4F6C-D104768A1214';
  const CONTROL_UUID = '19B10001-E8F2-537E-4F6C-D104768A1214';
  const DATA_UUID = '19B10002-E8F2-537E-4F6C-D104768A1214';

  useEffect(() => {
    return () => {
      managerRef.current.destroy();
    };
  }, []);

  const ensurePermissions = useCallback(async () => {
    if (Platform.OS === 'android') {
      // Android 12+ specific Bluetooth permissions
      const btScan = await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
      const btConnect = await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
      const fine = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      const coarse = await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
      if (
        btScan !== RESULTS.GRANTED ||
        btConnect !== RESULTS.GRANTED ||
        (fine !== RESULTS.GRANTED && coarse !== RESULTS.GRANTED)
      ) {
        throw new Error('Bluetooth permissions not granted');
      }
    }
  }, []);

  const scanForDevices = useCallback(async () => {
    await ensurePermissions();
    setIsScanning(true);
    setDevices([]);
    managerRef.current.startDeviceScan([SERVICE_UUID], null, (error, device) => {
      if (error) {
        setIsScanning(false);
        return;
      }
      if (!device) return;
      const name = device.name || device.localName || 'Unknown Device';
      if (!devices.find(d => d.id === device.id)) {
        setDevices(prev => [...prev, { id: device.id, name, isConnected: false, rssi: device.rssi ?? null }]);
      }
    });
    // Stop scan after 10s
    setTimeout(() => {
      managerRef.current.stopDeviceScan();
      setIsScanning(false);
    }, 10000);
  }, [devices, ensurePermissions]);

  const connectToDevice = useCallback(async (deviceId: string) => {
    await ensurePermissions();
    const device = await managerRef.current.connectToDevice(deviceId, { timeout: 10000 });
    await device.discoverAllServicesAndCharacteristics();

    // Set notifications for data characteristic
    await managerRef.current.monitorCharacteristicForDevice(
      deviceId,
      SERVICE_UUID,
      DATA_UUID,
      (error, characteristic) => {
        if (error || !characteristic?.value) return;
        try {
          const json = base64.decode(characteristic.value);
          const parsed = JSON.parse(json);
          // Accept both status updates and final results
          if (parsed.status === 'complete' || parsed.prediction) {
            setLastResult(parsed);
          }
        } catch (_) {}
      }
    );

    const name = device.name || device.localName || 'Unknown Device';
    setIsConnected(true);
    setCurrentDevice({ id: device.id, name, isConnected: true });
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, isConnected: true } : d));
  }, [ensurePermissions]);

  const disconnectFromDevice = useCallback(() => {
    if (currentDevice) {
      managerRef.current.cancelDeviceConnection(currentDevice.id).catch(() => {});
    }
    setIsConnected(false);
    setIsRecording(false);
    setRecordingTime(0);
    if (recordingInterval) {
      clearInterval(recordingInterval);
      setRecordingInterval(null);
    }
    setCurrentDevice(null);
    setDevices(prev => prev.map(d => ({ ...d, isConnected: false })));
  }, [recordingInterval, currentDevice]);

  const startRecording = useCallback(async () => {
    if (!isConnected || !currentDevice) return;
    setIsRecording(true);
    setRecordingTime(0);
    await sendCommand('START');
  }, [isConnected, currentDevice, sendCommand]);

  const stopRecording = useCallback(async () => {
    if (!isConnected || !currentDevice) return;
    setIsRecording(false);
    setRecordingTime(0);
    await sendCommand('STOP');
    if (recordingInterval) {
      clearInterval(recordingInterval);
      setRecordingInterval(null);
    }
  }, [isConnected, currentDevice, recordingInterval, sendCommand]);

  const sendCommand = useCallback(async (command: string) => {
    if (!isConnected || !currentDevice) return;
    const value = base64.encode(command);
    await managerRef.current.writeCharacteristicWithResponseForDevice(
      currentDevice.id,
      SERVICE_UUID,
      CONTROL_UUID,
      value
    );
  }, [isConnected, currentDevice]);

  const value: BluetoothContextType = {
    devices,
    isScanning,
    isConnected,
    isRecording,
    recordingTime,
    currentDevice,
    scanForDevices,
    connectToDevice,
    disconnectFromDevice,
    startRecording,
    stopRecording,
    sendCommand,
    lastResult,
  };

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
};
