---
title: "Sandmaze HAT PCB"
date: 2025-01-20
excerpt: "Custom HAT PCB from the capstone Sandmaze project. This was my first time designing a PCB for a hardware integration system that brought multiple sensing and compute components together.<br/><img src='/images/tech-gallery/sandmaze_hat.jpg'>"
collection: tech-gallery
---

# SandMaze: Embedded Sensing & Navigation System

A mobile embedded system that integrates ROS-based sensing, SLAM, and hardware design into a robust real-world navigation platform under noisy and constrained conditions.

---

## System Overview

SandMaze is a fully integrated hardware-software system designed to navigate a physical maze using real-time sensing and SLAM-based localization. The system combines onboard computation (Raspberry Pi 5), sensor fusion, and mechanical design into a closed-loop pipeline operating under environmental uncertainty.

**Key subsystems:**
- ROS-based sensing and SLAM pipeline  
- Custom PCB for power and sensor integration  
- Embedded user interface for control and diagnostics  
- 3D-printed enclosure for environmental robustness  

---

## System Architecture

The system follows a real-time feedback loop:
IMU + Sensors → ROS Processing → SLAM / Localization → Decision Logic → Actuation → Feedback

![3D simulation of the Sandmaze head shell used during hardware packaging](/images/projects/sandmaze/sm1.png)

This architecture ensures continuous adaptation to noisy sensor input and dynamic environmental conditions.

---

## Deep Dive: Sensor Integration with ROS + SLAM

The primary challenge in this system was integrating heterogeneous sensors into a stable ROS pipeline for SLAM.

### Challenges
- Sensor data arriving at different rates and latencies  
- IMU noise and drift affecting pose estimation  
- Synchronization issues between sensing and SLAM updates  

### Approach
- Used ROS message pipelines to standardize sensor data flow  
- Tuned SLAM parameters to balance responsiveness vs stability  
- Applied filtering and rate control to prevent unstable pose updates  

### Key Insight
Small inconsistencies in sensor timing or noise can destabilize SLAM output, leading to compounding localization errors. Stabilizing input signals was more critical than increasing raw sensor precision.

---

## Hardware Design: PCB + System Integration

A custom PCB was designed to support both sensing and system usability.

After that, the process continued with PCB printout, component placement, and soldering for prototype assembly. The board was then prepared for bring-up and system testing inside the full Sandmaze hardware stack.

At this stage, the board was ready to solder using this digital reflow oven as part of the assembly workflow for the prototype.

![Digital reflow oven used for soldering the Sandmaze HAT PCB](/images/tech-gallery/digital_reflow_oven.jpg)

### Power System
- Designed for Raspberry Pi 5 (25W load requirement)  
- Stable power delivery for compute + sensors under dynamic load  

### Sensor Interface
- I2C connector for IMU integration  
- Clean routing to reduce signal interference  

### User Interface (Ease-of-Use Feature)
- Status LEDs for real-time system state visibility  
- Dedicated push-button commands for quick control  
- Integrated power switch for safe and convenient operation  

This significantly improved usability during debugging and field testing.

---

## Mechanical Integration & Environmental Robustness

The system is housed in a custom 3D-printed enclosure designed for:

- Secure sensor mounting (reducing vibration-induced noise)  
- Water-spill resistance for real-world operation  
- Compact integration of electronics and mobility platform  

Mechanical stability directly improved sensing consistency and overall system reliability.

---

## Reliability Under Real-World Conditions

The system was tested in non-ideal environments where:

- Sensor readings were noisy or inconsistent  
- Mechanical disturbances affected measurements  
- Environmental exposure (e.g., water spills) could disrupt operation  

Design choices that improved robustness:
- Stable sensor mounting to reduce noise  
- Conservative SLAM tuning to avoid divergence  
- Hardware-level power stability to prevent system resets  

---

## Results

- Successfully integrated ROS + SLAM with real-time navigation  
- Achieved stable operation under noisy sensing conditions  
- ~3 hours battery life under full system load  
- Maintained functionality under minor water exposure  

---

## Full Project Details

👉 https://justinlinkk.github.io/projects/capstone-sandmaze/


