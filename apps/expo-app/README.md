# Putting Analyzer Expo App

## Prereqs
- Node 18+
- Android device with Expo Go or Dev Client

## Install
```
npm install
```

## Run (Expo Go)
```
npm run android
```

## BLE Service/Characteristics
- Service: `19B10000-E8F2-537E-4F6C-D104768A1214`
- Control (Write): `19B10001-E8F2-537E-4F6C-D104768A1214` ("START", "STOP", "RESET")
- Data (Notify): `19B10002-E8F2-537E-4F6C-D104768A1214` (JSON updates)

## Permissions
Android 12+: BLUETOOTH_SCAN, BLUETOOTH_CONNECT, ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION
