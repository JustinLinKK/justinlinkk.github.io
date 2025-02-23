---
title: "Raspberry Pi Cluster v1"
excerpt: "A Pi Cluster running microk8s kubernete and slurm control system<br/><img src='/images/projects/piclusterv1/1.jpg'>"
collection: projects
---

# Project Title: Raspberry Pi Cluster v1 (2024 - Present)

## Project Overview
The Raspberry Pi Cluster v1 is a custom-built, seven-node computing cluster designed to explore distributed computing, parallel processing, and web hosting capabilities. This project integrates various Raspberry Pi models into a cohesive system, utilizing SLURM and Kubernetes for efficient resource management and task scheduling.

## Objectives
- **Distributed Computing:** Leverage SLURM and OpenMPI to enable parallel processing across multiple nodes, facilitating the execution of computational tasks that benefit from distributed architectures.
- **Web Hosting:** Deploy Kubernetes to manage containerized applications, specifically hosting the IEEE McMaster Student Branch website, ensuring scalability and reliability.
- **Educational Exploration:** Provide a hands-on platform for learning about cluster computing, network configuration, and system administration.

## Hardware Components
- **Master Node:** 1 x Raspberry Pi 4 Model B with 4GB RAM.
- **Compute Nodes:** 6 x Raspberry Pi 3 Model B with 1GB RAM each.
- **Networking:** A managed Ethernet switch to facilitate high-speed communication between nodes.
- **Power Supply:** Centralized power distribution system ensuring consistent and reliable power to all nodes.
- **Enclosure:** Custom CAD-designed shells for housing the Raspberry Pi units, optimizing space and airflow.

## Software Configuration
- **Operating System:** Each node runs a Linux-based OS optimized for ARM architecture.
- **Cluster Management:**
  - *SLURM:* Implemented for job scheduling and workload management, enabling efficient distribution of computational tasks across the cluster.
  - *OpenMPI:* Installed to support the development and execution of parallel applications using the Message Passing Interface (MPI) standard.
- **Container Orchestration:**
  - *Kubernetes:* Deployed to manage containerized applications, providing automated deployment, scaling, and operation of application containers.
- **Networking Services:**
  - *DHCP Server:* Configured on the master node to assign IP addresses to compute nodes, ensuring seamless network integration.

## Implementation Details
1. **Hardware Assembly:**
   - Designed and 3D-printed custom enclosures for each Raspberry Pi to ensure secure mounting and adequate cooling.
   - Connected all nodes to a central managed Ethernet switch to facilitate efficient inter-node communication.
   - Established a centralized power supply system capable of delivering consistent power to all nodes, considering the specific power requirements of Raspberry Pi devices.

2. **Operating System Installation:**
   - Installed a lightweight Linux distribution on each Raspberry Pi, optimizing system performance and resource utilization.
   - Configured SSH access for remote management and streamlined administrative tasks.

3. **Network Configuration:**
   - Set up a DHCP server on the master node to dynamically assign IP addresses to each compute node, simplifying network management.
   - Ensured all nodes are on the same subnet to promote efficient communication and data transfer.

4. **Cluster Software Deployment:**
   - Installed and configured SLURM on all nodes to manage job scheduling and resource allocation effectively.
   - Deployed the OpenMPI library to support the development and execution of parallel applications across the cluster.

5. **Container Orchestration Setup:**
   - Installed Kubernetes on the cluster to orchestrate containerized applications, providing a robust platform for deploying and managing services.
   - Deployed the IEEE McMaster Student Branch website within the Kubernetes environment, ensuring high availability and scalability.

## Challenges and Resolutions
- **Hardware Compatibility:** Addressed differences between Raspberry Pi 4 and Raspberry Pi 3 models by ensuring uniform operating system configurations and compatible software versions across all nodes.
- **Dependency Management:** Resolved issues with missing packages and version conflicts by meticulously managing source code dependencies and utilizing virtual environments where necessary.
- **Network Stability:** Ensured reliable network performance by configuring quality of service (QoS) settings on the managed switch and monitoring network traffic to prevent bottlenecks.

## Outcomes
- **Enhanced Computational Capability:** Successfully established a functional Raspberry Pi cluster capable of handling parallel processing tasks, thereby increasing computational efficiency.
- **Reliable Web Hosting Platform:** Deployed the IEEE McMaster Student Branch website on the cluster, demonstrating the system's capability to manage real-world web applications.
- **Educational Advancement:** Gained practical experience in cluster assembly, network configuration, and the deployment of distributed computing frameworks, contributing to a deeper understanding of scalable computing solutions.

## Future Plans
- **Performance Optimization:** Analyze the cluster's performance metrics to identify and address potential bottlenecks, aiming to enhance processing speed and efficiency.
- **Scalability Testing:** Explore the feasibility of expanding the cluster by adding more nodes and evaluating the impact on performance and resource management.
- **Diverse Workload Integration:** Experiment with running a variety of workloads, including data analysis, machine learning tasks, and additional web services, to assess the cluster's versatility and robustness.

This project serves as a foundational platform for ongoing exploration and development in the fields of distributed computing and system administration.
