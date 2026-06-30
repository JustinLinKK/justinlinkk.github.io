---
permalink: /
title: "Justin's Profolio"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

Hey, I am Justin. My interests span the full stack from hardware to software: embedded systems, AI deployment, LLM products, and the compute infrastructure that makes them efficient enough to use in practice.

On the software side, my interest started from small machine-learning experiments. In my [image demosaicing project](/projects/image-demosaicing-malvar-he-cutler), I began with a simple linear-regression model to reconstruct missing color channels from Bayer-pattern image data, then compared it with a more structured convolution-based method.

That interest grew into computer vision during RoboMaster, where I trained and deployed CNN models such as YOLO and VGG on a Jetson TX2 for object detection and tracking. Later, as an early LLM user, I spent time experimenting with APIs, tool use, structured outputs, and function-calling workflows before "agents" became a mainstream product term. One early example was my [Emergency Assistant voice workflow](/projects/emergency-assistant), which connected microphone recording, Whisper transcription, GPT-3.5 reasoning, fake-report filtering, address extraction, and Google Maps visualization into a single voice-to-action pipeline. Those experiments shaped how I thought about LLMs: not only as chat interfaces, but as systems that can call tools, retrieve context, follow workflows, and connect with real products.

After those early agent experiments, I co-founded MediumAI and first applied LLM integration to medical documentation. I led R&D from prototype to deployment, including RAG pipelines for multilingual medical transcription and documentation. During that work, I also explored voice-agent ideas before they became a public hotspot, and I became especially aware of how important hallucination reduction, citation grounding, and workflow guardrails are in serious production applications such as healthcare.

Now I am especially interested in LLM serving and multi-agent systems that can reduce per-token cost while maximizing hardware utilization. I think current inference cost is still too high, which is why I started the [ASTRA-sim LLM serving simulator](/projects/astra-sim-llm-serving): to study serving architectures such as colocated serving, chunked prefill, and prefill-decode disaggregation before spending on real hardware experiments.

I am also exploring the middle ground between pure "vibe coding" and fully manual coding. With [GraphCode](/projects/graph-code), I want to see whether a project can be understood and changed through a graph-native workspace: modules, functions, workflow blocks, dependencies, and AI proposals become visible objects instead of being buried in a complex file explorer. The goal is not to remove engineering judgment, but to make large codebases easier to inspect, scope, and review.

On the hardware side, my interest started in high school with small embedded experiments. I used Raspberry Pis and microcontroller boards to control simple circuits, starting from lighting up an LED and learning how software instructions become physical signals on GPIO pins. That interest later became more structured in my [TI MSP432 ToF 3D Space Scanner](/projects/ti-msp432-3d-space-scanner), where I used a TI MSP432E401Y to drive a stepper motor, read a time-of-flight sensor over I2C, stream measurements over UART, and reconstruct 3D point-cloud / wireframe outputs with Python and Open3D.

At McMaster, RoboMaster became the point where my hardware interest connected with AI. I became interested in neural networks and computer vision, then trained and deployed CNN models such as YOLO and VGG on a Jetson TX2 for object detection and tracking. That work is also documented in the [Tech Gallery](/tech-gallery/tech-gallery-1).

I am also interested in how neural network models move onto real hardware. That started with training and deploying models on GPUs, then moved into embedded inference on Jetson. More recently, I have been exploring custom accelerator design through ASIC-oriented projects such as my [2-D systolic array accelerator](/projects/2d-systolic-array-accelerator) and [quad-core attention accelerator](/projects/quad-core-attention-accelerator). In the future, I want to push more of this work onto FPGA platforms, including my [Kintex KU3P FPGA board](/tech-gallery/tech-gallery-6) and ZYNQ-7020 SoC, so I can prototype accelerator datapaths with real hardware constraints.

After that, I moved further into spatial sensing and robotics systems. In my [AEVCar autonomous vehicle project](/projects/aevcar-autonomous-vehicle), I built a ROS-based autonomy stack that connected RPLiDAR scans, Intel RealSense depth point clouds, BNO055 IMU feedback, VESC motor telemetry, Ackermann steering, odometry, SLAM, obstacle avoidance, and route planning. I used IMU-corrected odometry to reduce yaw drift, helped LiDAR scan matching align more consistently, fused depth-camera points with LiDAR observations for local planning, and implemented wall following, largest-gap planning, virtual-barrier avoidance, and PID / PD-style steering control. Together with my [wearable cave-mapping capstone](/projects/capstone-sandmaze), this helped me understand hardware as a full system problem: sensing, compute, power, mechanical packaging, and software all have to work together.

More recently, I built [Cube_Mini](/projects/projects-2), a self-balancing cube based on ESP32 controllers, IMU feedback, motor control, and wireless tuning. In my capstone project, I also started designing PCBs on my own in Altium, moving from system integration into schematic capture, board layout, and prototype bring-up.

For a fuller timeline, you can check the experience tab. I also keep notes on the site for topics I am exploring out of personal interest.

The common thread in my work is building systems where algorithms, software infrastructure, and physical compute constraints all matter. I am especially interested in teams working on LLM infrastructure, agent systems, efficient AI deployment, robotics, or accelerator-aware product design, where good engineering has to connect ideas across the whole stack.
