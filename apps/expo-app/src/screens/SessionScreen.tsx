import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useBluetooth } from '../contexts/BluetoothContext';
import { usePuttHistory } from '../contexts/SessionContext';

export default function SessionScreen() {
  const {
    isConnected,
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    currentDevice,
    lastResult,
  } = useBluetooth();
  
  const {
    addPutt,
    getRecentPutts,
    totalPutts,
    averageConfidence,
    labelCounts,
  } = usePuttHistory();

  const [recentPutts, setRecentPutts] = useState(getRecentPutts(5));

  // Update recent putts when history changes
  useEffect(() => {
    setRecentPutts(getRecentPutts(5));
  }, [getRecentPutts]);

  const handleStartRecording = async () => {
    if (!isConnected) {
      Alert.alert('Not Connected', 'Please connect to a device first.');
      return;
    }

    try {
      await startRecording();
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording.');
    }
  };

  const handleStopRecording = async () => {
    try {
      await stopRecording();
      // If we received a result from BLE, persist it
      if (lastResult && lastResult.prediction) {
        addPutt({
          label: lastResult.prediction,
          confidence: (lastResult.overall_score ?? 0) / 100,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording.');
    }
  };

  const getLabelColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'needs work': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTopLabel = () => {
    if (Object.keys(labelCounts).length === 0) return 'None';
    return Object.entries(labelCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };

  return (
    <LinearGradient
      colors={['#1e40af', '#3b82f6', '#60a5fa']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Connection Status */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Device Status</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Connected:</Text>
            <Text style={[styles.statusValue, { color: isConnected ? '#10b981' : '#ef4444' }]}>
              {isConnected ? 'Yes' : 'No'}
            </Text>
          </View>
          {currentDevice && (
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Device:</Text>
              <Text style={styles.statusValue}>{currentDevice.name}</Text>
            </View>
          )}
        </View>

        {/* Recording Controls */}
        <View style={styles.controlCard}>
          <Text style={styles.controlTitle}>Recording Controls</Text>
          
          {isRecording ? (
            <View style={styles.recordingActive}>
              <Text style={styles.recordingText}>Recording Active</Text>
              <Text style={styles.countdownText}>{recordingTime > 0 ? `Countdown (${recordingTime}s)` : 'Sampling...'}</Text>
              <TouchableOpacity
                style={[styles.button, styles.stopButton]}
                onPress={handleStopRecording}
              >
                <Text style={styles.buttonText}>Stop Recording</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.startButton, !isConnected && styles.disabledButton]}
              onPress={handleStartRecording}
              disabled={!isConnected}
            >
              <Text style={styles.buttonText}>Start Recording</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Statistics Overview */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Putting Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalPutts}</Text>
              <Text style={styles.statLabel}>Total Putts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{(averageConfidence * 100).toFixed(1)}%</Text>
              <Text style={styles.statLabel}>Avg Confidence</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{getTopLabel()}</Text>
              <Text style={styles.statLabel}>Most Common</Text>
            </View>
          </View>
        </View>

        {/* Recent Putts */}
        <View style={styles.recentCard}>
          <Text style={styles.recentTitle}>Recent Putts</Text>
          {recentPutts.map((putt, index) => (
            <View key={putt.id} style={styles.puttItem}>
              <View style={styles.puttHeader}>
                <Text style={[styles.puttLabel, { color: getLabelColor(putt.label) }]}>
                  {putt.label}
                </Text>
                <Text style={styles.puttConfidence}>
                  {(putt.confidence * 100).toFixed(1)}%
                </Text>
              </View>
              <Text style={styles.puttTime}>
                {new Date(putt.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))}
          {recentPutts.length === 0 && (
            <Text style={styles.noDataText}>No putts recorded yet</Text>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    backdropFilter: 'blur(10px)',
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 16,
    color: '#e5e7eb',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  controlCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    backdropFilter: 'blur(10px)',
  },
  controlTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  recordingActive: {
    alignItems: 'center',
  },
  recordingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 10,
  },
  countdownText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: '#10b981',
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  disabledButton: {
    backgroundColor: '#6b7280',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    backdropFilter: 'blur(10px)',
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#e5e7eb',
    textAlign: 'center',
  },
  recentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    backdropFilter: 'blur(10px)',
  },
  recentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  puttItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  puttHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  puttLabel: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  puttConfidence: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  puttTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  noDataText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
});

