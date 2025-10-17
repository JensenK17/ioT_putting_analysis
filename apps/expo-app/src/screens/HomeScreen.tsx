import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useBluetooth } from '../contexts/BluetoothContext';
import { usePuttHistory } from '../contexts/SessionContext';

export default function HomeScreen() {
  const { isConnected, currentDevice } = useBluetooth();
  const {
    totalPutts,
    averageConfidence,
    labelCounts,
    getRecentPutts,
    getLabelPercentage,
  } = usePuttHistory();

  const [recentPutts, setRecentPutts] = useState(getRecentPutts(3));

  useEffect(() => {
    setRecentPutts(getRecentPutts(3));
  }, [getRecentPutts]);

  const getLabelColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'needs work': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTopLabels = () => {
    if (Object.keys(labelCounts).length === 0) return [];
    return Object.entries(labelCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([label, count]) => ({ label, count }));
  };

  const getProgressMessage = () => {
    if (totalPutts === 0) return "Start practicing to see your progress!";
    if (averageConfidence > 0.8) return "Excellent form! Keep it up!";
    if (averageConfidence > 0.6) return "Good progress! Focus on consistency.";
    return "Keep practicing! Every putt makes you better.";
  };

  return (
    <LinearGradient
      colors={['#1e40af', '#3b82f6', '#60a5fa']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Putting Analyzer</Text>
          <Text style={styles.subtitle}>
            {isConnected ? `Connected to ${currentDevice?.name}` : 'No device connected'}
          </Text>
        </View>

        {/* Connection Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: isConnected ? '#10b981' : '#ef4444' }]} />
            <Text style={styles.statusText}>
              {isConnected ? 'Device Connected' : 'Device Disconnected'}
            </Text>
          </View>
        </View>

        {/* Overall Statistics */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Your Putting Stats</Text>
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
              <Text style={styles.statNumber}>{Object.keys(labelCounts).length}</Text>
              <Text style={styles.statLabel}>Categories</Text>
            </View>
          </View>
        </View>

        {/* Performance Breakdown */}
        {Object.keys(labelCounts).length > 0 && (
          <View style={styles.breakdownCard}>
            <Text style={styles.cardTitle}>Performance Breakdown</Text>
            {getTopLabels().map(({ label, count }) => (
              <View key={label} style={styles.breakdownRow}>
                <View style={styles.breakdownLabel}>
                  <View style={[styles.labelDot, { backgroundColor: getLabelColor(label) }]} />
                  <Text style={styles.breakdownText}>{label}</Text>
                </View>
                <View style={styles.breakdownStats}>
                  <Text style={styles.breakdownCount}>{count}</Text>
                  <Text style={styles.breakdownPercentage}>
                    {getLabelPercentage(label).toFixed(1)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Recent Performance */}
        {recentPutts.length > 0 && (
          <View style={styles.recentCard}>
            <Text style={styles.cardTitle}>Recent Putts</Text>
            {recentPutts.map((putt, index) => (
              <View key={putt.id} style={styles.recentItem}>
                <View style={styles.recentHeader}>
                  <Text style={[styles.recentLabel, { color: getLabelColor(putt.label) }]}>
                    {putt.label}
                  </Text>
                  <Text style={styles.recentConfidence}>
                    {(putt.confidence * 100).toFixed(1)}%
                  </Text>
                </View>
                <Text style={styles.recentTime}>
                  {new Date(putt.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Motivation Message */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>{getProgressMessage()}</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e5e7eb',
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    backdropFilter: 'blur(10px)',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    backdropFilter: 'blur(10px)',
  },
  cardTitle: {
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#e5e7eb',
    textAlign: 'center',
  },
  breakdownCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    backdropFilter: 'blur(10px)',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  breakdownLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  labelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  breakdownText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  breakdownStats: {
    alignItems: 'flex-end',
  },
  breakdownCount: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  breakdownPercentage: {
    fontSize: 12,
    color: '#9ca3af',
  },
  recentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    backdropFilter: 'blur(10px)',
  },
  recentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  recentLabel: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  recentConfidence: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  recentTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  motivationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    backdropFilter: 'blur(10px)',
    alignItems: 'center',
  },
  motivationText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
});
