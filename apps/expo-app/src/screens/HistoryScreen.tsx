import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { usePuttHistory } from '../contexts/SessionContext';

export default function HistoryScreen() {
  const { puttHistory } = usePuttHistory();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>History</Text>
      {puttHistory.map((p) => (
        <View style={styles.card} key={p.id}>
          <Text style={styles.label}>{p.label}</Text>
          <Text style={styles.meta}>Score: {(p.confidence * 100).toFixed(1)}%</Text>
          <Text style={styles.meta}>{new Date(p.timestamp).toLocaleString()}</Text>
        </View>
      ))}
      {puttHistory.length === 0 && (
        <Text style={styles.empty}>No history yet</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1220' },
  content: { padding: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: '#111827', padding: 12, borderRadius: 10, marginBottom: 8 },
  label: { color: '#60a5fa', fontSize: 16, fontWeight: '600' },
  meta: { color: '#cbd5e1', fontSize: 12 },
  empty: { color: '#94a3b8' },
});
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSession } from '../contexts/SessionContext';
import { LinearGradient } from 'expo-linear-gradient';

const HistoryScreen: React.FC = () => {
  const { sessions, deleteSession, getSessionStats } = useSession();

  const handleDeleteSession = (sessionId: string, sessionName: string) => {
    Alert.alert(
      'Delete Session',
      `Are you sure you want to delete "${sessionName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteSession(sessionId) },
      ]
    );
  };

  const formatDuration = (startTime: number, endTime?: number) => {
    if (!endTime) return 'In Progress';
    const duration = (endTime - startTime) / 1000 / 60; // in minutes
    return `${Math.floor(duration)} min`;
  };

  const getClassificationSummary = (classifications: Record<string, number>) => {
    const entries = Object.entries(classifications);
    if (entries.length === 0) return 'No data';
    
    const topClassification = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    return `${topClassification[0].replace(/_/g, ' ')} (${topClassification[1]})`;
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#2563eb', '#1d4ed8']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Session History</Text>
        <Text style={styles.headerSubtitle}>
          {sessions.length} total sessions
        </Text>
      </LinearGradient>

      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Sessions Yet</Text>
          <Text style={styles.emptyStateText}>
            Start your first putting session to see your progress here.
          </Text>
        </View>
      ) : (
        <View style={styles.sessionsContainer}>
          {sessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionName}>{session.name}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteSession(session.id, session.name)}
                >
                  <Text style={styles.deleteButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sessionMeta}>
                <Text style={styles.sessionDate}>
                  {new Date(session.startTime).toLocaleDateString()}
                </Text>
                <Text style={styles.sessionTime}>
                  {new Date(session.startTime).toLocaleTimeString()}
                </Text>
              </View>

              <View style={styles.sessionStats}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Duration:</Text>
                  <Text style={styles.statValue}>
                    {formatDuration(session.startTime, session.endTime)}
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Strokes:</Text>
                  <Text style={styles.statValue}>{session.totalStrokes}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Avg Confidence:</Text>
                  <Text style={styles.statValue}>
                    {(session.averageConfidence * 100).toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Top Classification:</Text>
                  <Text style={styles.statValue}>
                    {getClassificationSummary(session.classifications)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
  },
  sessionsContainer: {
    padding: 20,
  },
  sessionCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteButtonText: {
    fontSize: 20,
    color: '#dc2626',
    fontWeight: 'bold',
  },
  sessionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sessionDate: {
    fontSize: 14,
    color: '#64748b',
  },
  sessionTime: {
    fontSize: 14,
    color: '#64748b',
  },
  sessionStats: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
});

export default HistoryScreen;
