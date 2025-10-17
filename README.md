# IoT Putting Analysis System

A comprehensive full-stack embedded edge AI putting stroke feedback system featuring real-time biomechanical analysis, custom PCB hardware, and multiple client applications.

## 🏗️ Project Structure

```
Putting Project/
├── apps/
│   ├── expo-app/          # React Native Expo mobile app
│   └── web-app/           # Next.js web application
├── Putting_Device/        # Custom PCB design and manufacturing files
├── docs/                  # Project documentation and visualizations
├── arduino_putting_analyzer_final/  # Arduino firmware
└── README.md
```

## 🎯 System Overview

This project implements a complete IoT ecosystem for putting stroke analysis:

- **Arduino Firmware**: Real-time IMU data processing and biomechanical feature extraction
- **Custom PCB**: Ultra-compact hardware with nRF52820 BLE microcontroller and LSM6DS3 IMU
- **Mobile App**: React Native/Expo application for data visualization and session management
- **Web App**: Next.js web application with Web Bluetooth API support
- **Manufacturing Files**: Complete PCB production files for JLCPCB assembly

## 🔧 Hardware Components

### Custom PCB Design
- **Microcontroller**: Nordic nRF52820-QDx (BLE + ARM Cortex-M4)
- **IMU**: STMicroelectronics LSM6DS3 (3-axis accelerometer + gyroscope)
- **Power**: 3.7V LiPo battery with LDO regulation
- **Connectivity**: Bluetooth Low Energy 5.0
- **Form Factor**: Ultra-compact 20mm x 15mm PCB

### Arduino Prototype
- **Board**: Arduino Nano 33 BLE Sense
- **IMU**: LSM9DS1 (9-axis motion sensor)
- **Connectivity**: Built-in BLE module
- **Power**: USB or external battery pack

## 📱 Software Applications

### Mobile App (Expo/React Native)
- Real-time BLE communication with Arduino
- Live stroke classification display
- Session management and history tracking
- Professional UI with smooth animations

### Web App (Next.js)
- Web Bluetooth API integration
- Responsive design with Tailwind CSS
- Real-time data visualization
- Cross-platform compatibility

## 🤖 AI/ML Features

### Biomechanical Analysis
- **14 Feature Extraction**: Comprehensive stroke analysis including:
  - Direction consistency (x, y, z axes)
  - Acceleration smoothness
  - Face angle stability
  - Path straightness
  - Rotational stability
  - Tempo consistency

### Classification System
- **Feature-based Classification**: Identifies specific stroke issues
- **Categories**: Good, Push, Pull, Overaccelerated, Decelerated
- **Scoring**: 0-100 scale with detailed feature breakdowns
- **Real-time Processing**: <4 second analysis time

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Arduino IDE
- KiCad (for PCB modifications)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/JensenK17/ioT_putting_analysis.git
cd ioT_putting_analysis
```

2. **Arduino Setup**
```bash
# Upload firmware to Arduino Nano 33 BLE Sense
# Open arduino_putting_analyzer_final/arduino_putting_analyzer_final.ino
# Install required libraries: ArduinoBLE, Arduino_LSM9DS1
```

3. **Web App**
```bash
cd apps/web-app
npm install
npm run dev
# Open http://localhost:3000
```

4. **Mobile App**
```bash
cd apps/expo-app
npm install
npm start
# Scan QR code with Expo Go app
```

## 📊 Data Format

### Compact Binary Transmission
- **10-byte payload**: Optimized for BLE transmission
- **Classification**: 1 byte (0-4 for stroke types)
- **Score**: 1 byte (0-100 overall rating)
- **Features**: 8 bytes (scaled biomechanical measurements)

### JSON Format (Legacy)
```json
{
  "classification": "good",
  "overall_score": 85.2,
  "features": {
    "x_direction": {"value": -0.12, "score": 95.0},
    "y_movement": {"value": 0.05, "score": 98.0}
  }
}
```

## 🏭 Manufacturing

### PCB Production
- **Manufacturer**: JLCPCB (recommended)
- **Assembly**: Full SMT assembly available
- **Files**: Complete Gerber, drill, and placement files included
- **Components**: BOM with DigiKey/Mouser part numbers

### Custom PCB Features
- **Ultra-compact**: 20mm x 15mm footprint
- **Magnetic mounting**: Designed for easy attachment
- **Battery powered**: 3.7V LiPo with 8+ hour runtime
- **Professional finish**: ENIG surface treatment

## 📈 Performance Metrics

- **Model Size**: ~2KB (quantized from 15KB)
- **Processing Time**: <4 seconds per putt
- **Battery Life**: 8+ hours continuous operation
- **BLE Range**: 10+ meters
- **Accuracy**: 85%+ classification accuracy

## 🔬 Technical Specifications

### Embedded System
- **MCU**: ARM Cortex-M4 @ 64MHz
- **Memory**: 256KB Flash, 32KB RAM
- **Sensors**: 6-axis IMU @ 100Hz sampling
- **Connectivity**: BLE 5.0 with custom service

### Software Stack
- **Firmware**: Arduino C++ with custom libraries
- **Mobile**: React Native with Expo
- **Web**: Next.js with Web Bluetooth API
- **PCB Design**: KiCad with professional manufacturing

## 📝 Documentation

- **`ARDUINO_DEPLOYMENT_README.md`**: Complete Arduino setup guide
- **`Putting_Device/Manufacturing/README.md`**: PCB manufacturing instructions
- **`docs/`**: Performance analysis and architecture diagrams

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue in the repository.

---

**Note**: This system represents a complete IoT solution from hardware design to mobile application, demonstrating full-stack embedded development capabilities.
