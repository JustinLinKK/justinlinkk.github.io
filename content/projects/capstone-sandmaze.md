---
title: "Wearable Cave Mapping System"
date: 2025-01-20
excerpt: "Affordable wearable 3D cave-mapping system integrating IMU, LiDAR, and depth sensing for localization, tracking, and real-time mapping.<br/><img src='/images/projects/sandmaze/sm1.png'>"
collection: projects
---

# Project Title: Wearable Cave Mapping System

## Project Overview
This capstone project builds an **affordable wearable 3D scanning system for cave mapping**. The goal was to create a field-ready platform that could be carried by a user while continuously collecting spatial data for localization, position tracking, and map generation in challenging underground environments.

- **GitHub Repository:** [JustinLinKK/capstone-sandmaze](https://github.com/JustinLinKK/capstone-sandmaze)

I led a **team of 5** and integrated multiple sensing and compute components into a single pipeline, including an **IMU**, **LiDAR**, **depth camera / ToF sensing**, and ROS 2-based localization nodes. The resulting system achieved about **3 hours of runtime** while updating the mapping pipeline at roughly **15 FPS**.

## Objectives
- **Affordable 3D Mapping:** Build a lower-cost alternative to heavier commercial cave-scanning setups.
- **Wearable Deployment:** Package the sensing stack into a portable system suitable for field use.
- **Multi-Sensor Localization:** Fuse IMU and ranging sensors for better motion tracking and pose estimation.
- **Real-Time Mapping:** Maintain interactive map updates fast enough for live operator feedback.
- **Capstone-Level Integration:** Combine hardware, ROS software, and mapping outputs into one demonstrable system.

## System Architecture
The repository shows a hybrid hardware-software stack organized around **ROS 2**:

- **IMU Integration:** `bno055` package support for inertial sensing
- **Depth / ToF Sensing:** `sipeed_tof_ms_a010` and `tof_odometry` packages for short-range ranging and odometry processing
- **Sensor Fusion:** `tof_imu_localization` launches `robot_localization` EKF for fused state estimation
- **Vertical LiDAR Mapping:** `vertical_lidar_node` converts sensor data into accumulated 3D point output
- **Third-Party Driver Integration:** includes `ydlidar_ros2_driver` as a submodule dependency

The repo also includes a sample point cloud output file, which shows the system was used to generate real spatial reconstruction artifacts rather than only sensor streams.

## Hardware Highlights
- **IMU:** orientation and motion estimation
- **LiDAR:** environment scanning and point acquisition
- **Depth / ToF Sensor:** short-range depth capture and odometry support
- **Custom Hardware Work:** BOM files and PCB files are included under `hardware/`, showing the project extended beyond software integration alone

This combination made the system suitable for cave-like environments where GPS is unavailable and the geometry is irregular.

## Software and Localization Pipeline
The source tree suggests a modular ROS 2 workflow:

1. Launch individual sensor drivers for ToF nodes and the BNO055 IMU
2. Run odometry processing on the ToF streams
3. Fuse motion and ranging signals with an **EKF** through `robot_localization`
4. Feed fused motion information into a LiDAR-based mapping node
5. Accumulate transformed 3D points into output files / point clouds

This is a strong systems integration project because it combines:
- low-level sensor interfacing
- ROS 2 node orchestration
- multi-sensor fusion
- real-time mapping output
- deployable hardware packaging

## Leadership and Team Contribution
This project also reflects a substantial coordination component:

- Led a **team of five**
- Integrated sensing, localization, and mapping subsystems into one wearable platform
- Drove the project from hardware bring-up through software pipeline integration and live demonstration

That leadership piece matters here because the hard part was not only writing code, but also getting several subsystems and contributors to converge into a working end-to-end system.

## Outcomes
- Built an **affordable wearable cave-mapping device**
- Integrated **IMU, LiDAR, and depth-camera / ToF sensing** for localization and 3D mapping
- Achieved around **15 FPS mapping updates**
- Reached about **3 hours of operating time**
- Produced recorded **3D point cloud outputs** from real runs
- Delivered a complete **capstone prototype** spanning hardware, embedded sensing, and robotics software

## Why It Matters
This project stands out because it treats mapping as a full deployment problem, not just an algorithm problem. It combines portability, sensor fusion, hardware design, and real-time robotics software into a system that could operate in spaces where conventional positioning infrastructure does not exist.

It is also a good example of practical robotics engineering: the value comes from making several imperfect sensors work together reliably enough to produce useful spatial data in the field.
