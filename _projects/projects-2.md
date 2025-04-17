---
title: "Cube_mini"
date: 2025-02-24
excerpt: "A self-balancing cube based on angular momentum conservation<br/><img src='/images/projects/Cube_mini/cube_2.jpg'>"
collection: projects
---

# Project Title: Cube_Mini (2023 - Present)

## Project Overview
**Cube_Mini** is a compact self-balancing cube powered by two ESP32 microcontrollers and three brushless Permanent Magnet Synchronous Motors (PMSMs). Inspired by the CubeMini project on [GitHub](https://github.com/ZhaJiHu/Cubli_Mini) , this system combines advanced sensor feedback, precise PID control, and real-time wireless communication to dynamically maintain balance in three dimensions. The frame is built with lightweight carbon fiber and reinforced with custom 3D-printed corners for structural integrity.

## Objectives
- **Self-Balancing Control:** Implement real-time PID feedback loops using inertial measurements to actively stabilize the cube in three axes.
- **Modular Motor Control:** Use distributed microcontroller architecture where each ESP32 manages motor control independently and communicates over WiFi.
- **Wireless Parameter Tuning:** Enable remote control and dynamic tuning of PID parameters through a custom WiFi TCP protocol for real-time system adjustment and calibration.
- **Lightweight and Durable Design:** Utilize carbon fiber and 3D-printed components to minimize weight while maximizing mechanical stability.

## Hardware Components
- **Microcontrollers:**
  - 1 x ESP32 (controls 1 PMSM, acts as WiFi host)
  - 1 x ESP32 (controls 2 PMSMs, WiFi client)
- **Motors:** 3 x Brushless Permanent Magnet Synchronous Motors (PMSMs)
- **Sensors:** 1 x MPU6050 6-DOF IMU (accelerometer + gyroscope)
- **Structural Frame:**
  - Carbon fiber rods for the main structural frame
  - Custom 3D-printed corners for motor mounting and frame joints
- **Power Supply:** Li-Po battery pack and motor driver circuits designed for low-latency operation

## Software Configuration
- **Motor Control:**
  - PID loops implemented for real-time control of motor torque based on tilt angle and angular velocity feedback
  - Sensor fusion from the MPU6050 for stable gravity vector estimation
- **Communication:**
  - WiFi-based TCP socket communication between ESP32 nodes
  - Host ESP32 acts as control hub, accepting parameter updates via external interface
- **Sensor Integration:**
  - Real-time data acquisition from the MPU6050
  - Sensor calibration and filtering for noise reduction and accurate orientation data
- **Parameter Tuning Interface:**
  - Custom TCP protocol allows live PID gain tuning, data monitoring, and diagnostics over wireless connection

## Implementation Details
1. **Mechanical Design:**
   - Designed a minimalistic cube using carbon fiber tubes for weight efficiency and structural strength
   - Modeled and printed 3D-printed motor mounts and corners to support each motor at the cube’s edges

2. **Motor and Sensor Wiring:**
   - Routed power and control signals through hollow carbon fiber tubes
   - Integrated MPU6050 securely at the geometric center of the cube for optimal inertia measurement

3. **ESP32 Control Architecture:**
   - Programmed one ESP32 to handle a single-axis control and host TCP server for PID parameter input
   - Second ESP32 handles two axes, receiving instructions from the host node and executing synchronized motor commands

4. **Control System Development:**
   - Tuned PID loops for each motor based on real-time sensor feedback
   - Developed filtering algorithms to mitigate gyro drift and sensor noise

5. **Wireless Protocol Design:**
   - Implemented a low-latency TCP interface using ESP-IDF framework for robust two-way communication
   - Created Python-based ground station interface to send PID parameters and monitor system response

## Challenges and Resolutions
- **Sensor Drift and Noise:** Applied Kalman and complementary filters to stabilize accelerometer and gyroscope outputs.
- **Motor Sync Timing:** Resolved timing jitter between ESP32s by implementing soft time-synchronization protocol over TCP.
- **Wireless Latency:** Optimized TCP packet size and reduced unnecessary message overhead to ensure fast PID loop updates.
- **Frame Resonance:** Addressed mechanical resonance by reinforcing joints and tuning PID values to reduce oscillatory behavior.

## Outcomes
- **Functional Self-Balancing Cube:** Achieved dynamic equilibrium on all three axes using a distributed control system and feedback loops.
- **Live PID Tuning:** Enabled real-time parameter tuning via WiFi, drastically reducing iteration time during testing.
- **Modular Hardware Design:** Validated the modular architecture, allowing future replacement or scaling of motor/ESP components.
- **Educational Value:** Gained experience in closed-loop control systems, sensor integration, embedded communication, and system dynamics.

## Future Plans
- **Closed-Loop System Modeling:** Integrate real-time telemetry and Bode plot visualization to enhance control system analysis.
- **Mobile App Interface:** Develop a user-friendly app for Bluetooth or WiFi tuning without a PC interface.
- **Advanced Motion Behaviors:** Implement trajectory planning and dynamic rebalancing for hopping, reorientation, and controlled falling.
- **Sensor Redundancy:** Add magnetometer or secondary IMU for improved spatial awareness and fail-safe control.

This project showcases a high-performance, scalable platform for exploring embedded control systems and real-time dynamics in robotics.
