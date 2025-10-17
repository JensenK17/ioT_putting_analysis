# Putting Project - Stroke Analysis System

A professional putting stroke detection and analysis system with both a native mobile app (Expo) and a web application. The system receives real-time classifications from an Arduino board with IMU sensors and provides high-quality visualization and data storage for training sessions.

## 🏗️ Project Structure

```
Putting Project/
├── apps/
│   ├── expo-app/          # React Native Expo mobile app
│   └── web-app/           # Next.js web application
├── data/                  # Data storage (legacy)
├── data_creation_code/    # Legacy data collection scripts
└── README.md
```

## 📱 Expo Mobile App

A React Native application that can run on Expo Go, providing:
- Bluetooth connectivity to Arduino sensors
- Real-time stroke classification display
- Session management with user-defined durations
- Professional UI with smooth animations
- Data persistence and session history

### Features
- **Home Screen**: Overview dashboard with session statistics
- **Session Screen**: Real-time recording and classification display
- **History Screen**: Past session review and analysis
- **Settings Screen**: Bluetooth configuration and app preferences

### Setup
```bash
cd apps/expo-app
npm install
npm start
```

### Dependencies
- Expo SDK 50
- React Navigation
- Expo Bluetooth
- React Native Reanimated
- Linear Gradient

## 🌐 Web Application

A modern Next.js web app for desktop/laptop use:
- Responsive design with Tailwind CSS
- Real-time stroke classification updates
- Session control and management
- Professional dashboard interface
- Chart.js integration for data visualization

### Features
- **Dashboard**: Comprehensive overview with statistics
- **Session Control**: Start/stop sessions with custom durations
- **Real-time Updates**: Live classification display
- **Responsive Design**: Works on all device sizes

### Setup
```bash
cd apps/web-app
npm install
npm run dev
```

### Dependencies
- Next.js 14
- React 18
- Tailwind CSS
- Chart.js
- Framer Motion
- Lucide React Icons

## 🔌 Arduino Integration

The system is designed to receive classifications from an Arduino board equipped with:
- IMU sensors (accelerometer, gyroscope)
- Bluetooth Low Energy (BLE) connectivity
- Edge Impulse model integration for real-time classification

### Data Format
The Arduino sends classification results in the format:
```json
{
  "label": "stroke_classification",
  "confidence": 0.95,
  "timestamp": 1640995200000
}
```

### Supported Classifications
- `excellent_stroke`: High-quality putting stroke
- `good_stroke`: Good stroke with minor improvements needed
- `needs_work`: Stroke requires practice and refinement
- `poor_stroke`: Stroke needs significant improvement

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (for mobile development)
- Arduino IDE (for sensor programming)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "Putting Project"
```

2. **Install dependencies for all apps**
```bash
npm run install:all
```

3. **Start the web app**
```bash
npm run dev:web
```

4. **Start the Expo app**
```bash
npm run dev:expo
```

### Running on Expo Go

1. Install Expo Go on your mobile device
2. Scan the QR code from the Expo development server
3. The app will load and be ready for use

### Running the Web App

1. Navigate to `http://localhost:3000` in your browser
2. The dashboard will be available for use

## 📊 Data Management

### Session Storage
- Sessions are stored locally on the device
- User-defined session durations
- Automatic data persistence
- Export capabilities for data analysis

### Data Retention
- Configurable retention periods
- Automatic cleanup of old sessions
- Backup and restore functionality

## 🎯 Use Cases

- **Golf Training**: Improve putting technique through data-driven feedback
- **Coaching**: Coaches can analyze student performance over time
- **Performance Tracking**: Monitor progress and identify improvement areas
- **Research**: Collect data for sports science studies

## 🔧 Configuration

### Bluetooth Settings
- Automatic device discovery
- Connection management
- Signal strength monitoring
- Auto-reconnection support

### Session Preferences
- Default session duration
- Auto-save settings
- Data retention policies
- Export formats

## 🚧 Development Notes

### Current Implementation
- Mock data for demonstration purposes
- Bluetooth functionality simulated
- Real-time updates every 3 seconds

### Production Ready Features
- Replace mock Bluetooth with actual BLE implementation
- Integrate with Edge Impulse API for real classifications
- Implement secure data storage
- Add user authentication

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue in the repository or contact the development team.

---

**Note**: This system is designed to work with Edge Impulse models and Arduino hardware. Ensure your sensor setup is properly configured before use.
