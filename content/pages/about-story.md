---
title: "About"
---

Hey, I am Justin. My work sits between software and hardware: embedded systems, AI deployment, LLM products, robotics, and the compute infrastructure that makes intelligent systems efficient enough to use in practice.

## Software and AI systems

My software interests started with small machine-learning experiments. In my [image demosaicing project](/projects/image-demosaicing-malvar-he-cutler), I used a linear-regression model to reconstruct missing color channels from Bayer-pattern image data, then compared it with a more structured convolution-based method.

That grew into computer vision during RoboMaster, where I trained and deployed CNN models such as YOLO and VGG on a Jetson TX2 for object detection and tracking. Later, as an early LLM user, I experimented with APIs, tool use, structured outputs, and function-calling workflows before "agents" became a mainstream product term. One early example was my [Emergency Assistant voice workflow](/projects/emergency-assistant), which connected microphone recording, Whisper transcription, GPT-3.5 reasoning, fake-report filtering, address extraction, and Google Maps visualization into a single voice-to-action pipeline.

Those experiments shaped how I think about LLMs: not only as chat interfaces, but as systems that can call tools, retrieve context, follow workflows, and connect with real products.

After those early agent experiments, I co-founded MediumAI and applied LLM integration to medical documentation. I led R&D from prototype to deployment, including RAG pipelines for multilingual medical transcription and documentation. That work made hallucination reduction, citation grounding, and workflow guardrails feel less like abstract research concerns and more like basic production requirements, especially in healthcare.

I am now especially interested in LLM serving and multi-agent systems that reduce per-token cost while improving hardware utilization. That is why I started the [ASTRA-sim LLM serving simulator](/projects/astra-sim-llm-serving): to study serving architectures such as colocated serving, chunked prefill, and prefill-decode disaggregation before spending on real hardware experiments.

I am also exploring the middle ground between pure "vibe coding" and fully manual coding. With [GraphCode](/projects/graph-code), I want to see whether a project can be understood and changed through a graph-native workspace where modules, functions, workflow blocks, dependencies, and AI proposals become visible objects instead of being buried in a complex file explorer. The goal is not to remove engineering judgment, but to make large codebases easier to inspect, scope, and review.

## Hardware and physical systems

My hardware interest started in high school with small embedded experiments. I used Raspberry Pis and microcontroller boards to control simple circuits, starting from lighting up an LED and learning how software instructions become physical signals on GPIO pins.

That interest became more structured in my [TI MSP432 ToF 3D Space Scanner](/projects/ti-msp432-3d-space-scanner), where I used a TI MSP432E401Y to drive a stepper motor, read a time-of-flight sensor over I2C, stream measurements over UART, and reconstruct 3D point-cloud and wireframe outputs with Python and Open3D.

At McMaster, RoboMaster became the point where my hardware interest connected with AI. I trained and deployed computer-vision models on Jetson hardware, which made the relationship between model design, embedded inference, and physical system constraints much more concrete.

I am also interested in how neural network models move onto real hardware. That started with training and deploying models on GPUs, then moved into embedded inference on Jetson. More recently, I have been exploring custom accelerator design through ASIC-oriented projects such as my [2-D systolic array accelerator](/projects/2d-systolic-array-accelerator) and [quad-core attention accelerator](/projects/quad-core-attention-accelerator). I also want to push more of this work onto FPGA platforms, including my [Kintex KU3P FPGA board](/tech-gallery/tech-gallery-6) and ZYNQ-7020 SoC, so I can prototype accelerator datapaths with real hardware constraints.

I later moved further into spatial sensing and robotics systems. In my [AEVCar autonomous vehicle project](/projects/aevcar-autonomous-vehicle), I built a ROS-based autonomy stack that connected RPLiDAR scans, Intel RealSense depth point clouds, BNO055 IMU feedback, VESC motor telemetry, Ackermann steering, odometry, SLAM, obstacle avoidance, and route planning. Together with my [wearable cave-mapping capstone](/projects/capstone-sandmaze), this helped me understand hardware as a full system problem: sensing, compute, power, mechanical packaging, and software all have to work together.

More recently, I built [Cube_Mini](/projects/projects-2), a self-balancing cube based on ESP32 controllers, IMU feedback, motor control, and wireless tuning. In my capstone project, I also started designing PCBs in Altium, moving from system integration into schematic capture, board layout, and prototype bring-up.

## Current direction

The common thread in my work is building systems where algorithms, software infrastructure, and physical compute constraints all matter. I am especially interested in teams working on LLM infrastructure, agent systems, efficient AI deployment, robotics, or accelerator-aware product design, where good engineering has to connect ideas across the whole stack.
