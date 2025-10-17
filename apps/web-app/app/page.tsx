'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Bluetooth, Activity, Clock, Target } from 'lucide-react';

interface ClassificationResult {
  label: string;
  confidence: number;
  timestamp: number;
}

interface Session {
  id: string;
  name: string;
  startTime: number;
  duration: number;
  strokes: ClassificationResult[];
}

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [recentClassifications, setRecentClassifications] = useState<ClassificationResult[]>([]);
  const [sessionDuration, setSessionDuration] = useState(30);

  // Mock data for demo
  useEffect(() => {
    setRecentClassifications([
      { label: 'Good', confidence: 0.92, timestamp: Date.now() - 5000 },
      { label: 'Excellent', confidence: 0.95, timestamp: Date.now() - 10000 },
      { label: 'Needs Work', confidence: 0.78, timestamp: Date.now() - 15000 },
    ]);
  }, []);

  const handleStartRecording = async () => {
    if (!isConnected) {
      alert('Please connect to a device first');
      return;
    }

    setIsRecording(true);
    setRecordingTime(5); // Start with 5 second countdown

    // Start countdown timer
    const interval = setInterval(() => {
      setRecordingTime(prev => {
        if (prev <= 1) {
          setIsRecording(false);
          setRecordingTime(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start session if not already active
    if (!currentSession) {
      setCurrentSession({
        id: Date.now().toString(),
        name: `Session ${new Date().toLocaleDateString()}`,
        startTime: Date.now(),
        duration: sessionDuration,
        strokes: [],
      });
    }

    // Simulate sending command to Arduino
    console.log('Sending START_RECORDING command to Arduino');
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setRecordingTime(0);

    // Simulate sending command to Arduino
    console.log('Sending STOP_RECORDING command to Arduino');

    // Add mock stroke data
    if (currentSession) {
      const newStroke: ClassificationResult = {
        label: 'Good',
        confidence: 0.85,
        timestamp: Date.now(),
      };
      setCurrentSession(prev => prev ? {
        ...prev,
        strokes: [...prev.strokes, newStroke]
      } : null);
      setRecentClassifications(prev => [newStroke, ...prev.slice(0, 4)]);
    }
  };

  const handleStartSession = () => {
    setCurrentSession({
      id: Date.now().toString(),
      name: `Session ${new Date().toLocaleDateString()}`,
      startTime: Date.now(),
      duration: sessionDuration,
      strokes: [],
    });
  };

  const handleStopSession = () => {
    setCurrentSession(null);
  };

  const getClassificationColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'needs work': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Putting Stroke Analyzer
          </h1>
          <p className="text-xl text-blue-100">
            Real-time analysis powered by Edge Impulse
          </p>
        </motion.div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bluetooth className={`w-6 h-6 ${isConnected ? 'text-green-400' : 'text-red-400'}`} />
              <span className="text-white font-medium">
                {isConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            <button
              onClick={() => setIsConnected(!isConnected)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isConnected
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recording Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-3" />
              Recording Controls
            </h2>

            {isRecording ? (
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-4">
                  Recording Active
                </div>
                <div className="text-5xl font-bold text-white mb-6">
                  Sampling ({recordingTime}s)
                </div>
                <button
                  onClick={handleStopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center mx-auto"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop Recording
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleStartRecording}
                  disabled={!isConnected}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center ${
                    isConnected
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Recording
                </button>
                {!isConnected && (
                  <p className="text-red-300 text-center text-sm">
                    Please connect to a device first
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Session Management */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-3" />
              Session Management
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Duration (minutes)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setSessionDuration(duration)}
                      className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                        sessionDuration === duration
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>

              {!currentSession ? (
                <button
                  onClick={handleStartSession}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-colors"
                >
                  Start Session
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="text-white text-sm">
                      <span className="font-medium">Duration:</span> {currentSession.duration} minutes
                    </p>
                    <p className="text-white text-sm">
                      <span className="font-medium">Strokes:</span> {currentSession.strokes.length}
                    </p>
                    <p className="text-white text-sm">
                      <span className="font-medium">Started:</span> {new Date(currentSession.startTime).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={handleStopSession}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors"
                  >
                    Stop Session
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Classifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mt-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Target className="w-6 h-6 mr-3" />
            Recent Classifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentClassifications.map((classification, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/20 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="font-bold text-lg"
                    style={{ color: getClassificationColor(classification.label) }}
                  >
                    {classification.label}
                  </span>
                  <span className="text-white font-medium">
                    {(classification.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${classification.confidence * 100}%`,
                      backgroundColor: getClassificationColor(classification.label),
                    }}
                  />
                </div>
                <p className="text-blue-100 text-sm">
                  {new Date(classification.timestamp).toLocaleTimeString()}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
