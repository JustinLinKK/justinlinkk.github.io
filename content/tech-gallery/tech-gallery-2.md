---
title: "Raspberry Pi Cluster v2"
date: 2025-08-01
excerpt: "Portable Raspberry Pi cluster built around Cluster HAT with a lightweight SLURM + OpenMPI stack for compact parallel computing and distributed systems experiments.<br/><img src='/images/projects/piclusterv2/1.jpg'>"
collection: tech-gallery
---

Raspberry Pi Cluster v2 is a smaller, more portable rebuild of my original Raspberry Pi cluster. It keeps the same distributed-computing workflow while reducing the overall footprint and setup overhead.

The system uses a Raspberry Pi control node with Raspberry Pi Zero 2 compute nodes connected through the Cluster HAT. On the software side, it runs a lightweight Linux environment with SLURM for scheduling and OpenMPI for parallel workloads.

This version was designed to be easier to carry, quicker to deploy, and simpler to monitor during use, while still being capable of running meaningful engineering and scientific-computing experiments.
