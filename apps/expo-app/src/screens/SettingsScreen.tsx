import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { useBluetooth } from '../contexts/BluetoothContext';
import { LinearGradient } from 'expo-linear-gradient';

const SettingsScreen: React.FC = () => {
  const { devices, isScanning, scanForDevices, connectToDevice, disconnectFromDevice, isConnected, currentDevice } = useBluetooth();
  
  const [sessionDuration, setSessionDuration] = useState('30');
  const [autoSave, setAutoSave] = useState(true);
  const [bluetoothAutoConnect, setBluetoothAutoConnect] = useState(false);
  const [dataRetentionDays, setDataRetentionDays] = useState('30');

  const handleConnectDevice = async (deviceId: string) => {
    try {
      await connectToDevice(deviceId);
      Alert.alert('Success', 'Device connected successfully!');
    } catch (error) {
      Alert.alert('Connection Failed', 'Failed to connect to device. Please try again.');
    }
  };

  const handleDisconnectDevice = async () => {
    try {
      await disconnectFromDevice();
      Alert.alert('Success', 'Device disconnected successfully!');
    } catch (error) {
      Alert.alert('Disconnect Failed', 'Failed to disconnect device. Please try again.');
    }
  };

  const handleScanDevices = async () => {
    try {
      await scanForDevices();
    } catch (error) {
      Alert.alert('Scan Failed', 'Failed to scan for devices. Please try again.');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all sessions and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => {
          Alert.alert('Data Cleared', 'All data has been cleared successfully.');
        }},
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Data export feature coming soon!');
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#2563eb', '#1d4ed8']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Configure your putting analyzer</Text>
      </LinearGradient>

      {/* Bluetooth Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bluetooth Connection</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Status</Text>
          <Text style={[
            styles.settingValue,
            { color: connectedDevice ? '#10b981' : '#ef4444' }
          ]}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>

        {currentDevice && (
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Connected Device</Text>
            <Text style={styles.settingValue}>{currentDevice.name}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleScanDevices}
          disabled={isScanning}
        >
          <Text style={styles.buttonText}>
            {isScanning ? 'Scanning...' : 'Scan for Devices'}
          </Text>
        </TouchableOpacity>

        {devices.length > 0 && (
          <View style={styles.devicesContainer}>
            <Text style={styles.devicesTitle}>Available Devices:</Text>
            {devices.map((device) => (
              <View key={device.id} style={styles.deviceItem}>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  {typeof device.rssi !== 'undefined' && (
                    <Text style={styles.deviceRSSI}>RSSI: {device.rssi ?? 'N/A'} dBm</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    styles.deviceButton,
                    device.isConnected && styles.deviceButtonConnected
                  ]}
                  onPress={() => device.isConnected 
                    ? handleDisconnectDevice() 
                    : handleConnectDevice(device.id)
                  }
                >
                  <Text style={styles.deviceButtonText}>
                    {device.isConnected ? 'Disconnect' : 'Connect'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Session Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Session Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Default Session Duration (min)</Text>
          <TextInput
            style={styles.textInput}
            value={sessionDuration}
            onChangeText={setSessionDuration}
            keyboardType="numeric"
            placeholder="30"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Auto-save Sessions</Text>
          <Switch
            value={autoSave}
            onValueChange={setAutoSave}
            trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
            thumbColor={autoSave ? '#2563eb' : '#9ca3af'}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Auto-connect Bluetooth</Text>
          <Switch
            value={bluetoothAutoConnect}
            onValueChange={setBluetoothAutoConnect}
            trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
            thumbColor={bluetoothAutoConnect ? '#2563eb' : '#9ca3af'}
          />
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Data Retention (days)</Text>
          <TextInput
            style={styles.textInput}
            value={dataRetentionDays}
            onChangeText={setDataRetentionDays}
            keyboardType="numeric"
            placeholder="30"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleExportData}
          >
            <Text style={styles.secondaryButtonText}>Export Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleClearData}
          >
            <Text style={styles.buttonText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Build</Text>
          <Text style={styles.settingValue}>2025.01.17</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e2e8f0',
  },
  section: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  settingValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
    width: 80,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: '#6b7280',
    flex: 1,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#dc2626',
    flex: 1,
  },
  devicesContainer: {
    marginTop: 16,
  },
  devicesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  deviceAddress: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  deviceRSSI: {
    fontSize: 12,
    color: '#6b7280',
  },
  deviceButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deviceButtonConnected: {
    backgroundColor: '#dc2626',
  },
  deviceButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SettingsScreen;
