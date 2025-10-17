# IMU Putting Analysis PCB - Manufacturing Package
**UW Golf Engineering | Jensen Kalal**

## 📋 **Project Overview**
This PCB is designed for a compact putting analyzer that uses IMU data to analyze golf putting strokes. The device connects via Bluetooth Low Energy and provides real-time biomechanical feedback.

## 🏭 **Manufacturing Specifications**

### **Board Dimensions:**
- **Size:** 22mm x 22mm
- **Thickness:** 1.6mm (standard)
- **Layers:** 2-layer (Top + Bottom Copper)
- **Surface Finish:** HASL (Hot Air Solder Leveling)
- **Solder Mask:** Green (standard)
- **Silkscreen:** White

### **Component Count:**
- **Total Components:** 16
- **Active Components:** 3 (nRF52820, LSM6DS3, LDO)
- **Passive Components:** 13 (Capacitors, Resistors, Crystal)

## 📁 **File Descriptions**

### **Gerber Files:**
- **F_Cu.gbr:** Front copper layer (top side)
- **B_Cu.gbr:** Back copper layer (bottom side)
- **F_Silkscreen.gbr:** Front silkscreen (component labels)
- **B_Silkscreen.gbr:** Back silkscreen (assembly notes)
- **Edge_Cuts.gbr:** Board outline and cutouts
- **F_Mask.gbr:** Front solder mask
- **B_Mask.gbr:** Back solder mask
- **F_Paste.gbr:** Front solder paste stencil
- **B_Paste.gbr:** Back solder paste stencil

### **Drill Files:**
- **PTH.drl:** Plated through holes
- **NPTH.drl:** Non-plated through holes
- **Units:** Millimeters
- **Format:** Standard Excellon

### **Position Files:**
- **top-pos.csv:** Component placement coordinates (top side)
- **bottom-pos.csv:** Component placement coordinates (bottom side)

### **BOM (Bill of Materials):**
- **bill_of_materials_v0.csv:** Complete component list with reference designators, quantities, and part numbers

## 🔧 **Assembly Instructions**

### **Component Placement:**
1. **Solder** all surface mount components first
2. **Start** with smallest components (resistors, capacitors)
3. **Place** ICs last (nRF52820, LSM6DS3, LDO)
4. **Verify** orientation of polarized components

### **Critical Components:**
- **nRF52820 (U1):** Main microcontroller - ensure proper orientation
- **LSM6DS3 (U2):** IMU sensor - handle with ESD precautions
- **LD040LPU33R (U3):** LDO regulator - check input/output voltage

### **Power Requirements:**
- **Input:** 3.7V LiPo battery
- **Output:** 3.3V regulated (for nRF52820 and LSM6DS3)
- **Current:** ~50mA typical operation