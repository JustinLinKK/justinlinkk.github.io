---
title: "Image Demosaicing with Linear Regression and Malvar-He-Cutler"
date: 2023-04-09
excerpt: "Reconstructed Bayer-pattern sensor data using a MATLAB linear-regression baseline and a Python/PyTorch Malvar-He-Cutler implementation with CPU/CUDA support.<br/><img src='/images/projects/demosaicing/python-demosaic-sample1.png'>"
collection: projects
---

# Project Title: Image Demosaicing with Linear Regression and Malvar-He-Cutler

## Project Overview
This project explores **image demosaicing**, the process of reconstructing a full RGB image from a single-channel Bayer-pattern sensor sample. Since each sensor location only records one color component, the missing red, green, or blue values must be inferred from nearby pixels.

I implemented and compared two approaches:

- **MATLAB linear regression:** a trained baseline that predicts missing channels from local 5x5 Bayer patches.
- **Python Malvar-He-Cutler:** a convolution-kernel demosaicing pipeline implemented with PyTorch, with support for CUDA acceleration when a GPU is available.

The goal was to understand both a data-fit approach and a more image-processing-driven algorithm, then compare their reconstruction quality on the same Bayer inputs.

## Technical Approach

### MATLAB Linear Regression Baseline
The MATLAB workflow builds a training dataset by converting RGB images into Bayer mosaics, then extracting 5x5 patches around each pixel. Because a Bayer pattern has multiple center-pixel cases, the implementation trains eight separate linear models to predict the missing color channels for red, blue, and the two green positions.

The pipeline is organized as:

1. Generate Bayer-pattern training images from RGB PNG files.
2. Extract 5x5 local patches and corresponding ground-truth channel values.
3. Solve for regression coefficients and save them as model parameters.
4. Apply the learned coefficients to reconstruct RGB images from Bayer inputs.

This provided a useful baseline, but the small patch size and limited training set made the model sensitive to darker regions and high-frequency color transitions.

### Python / PyTorch Malvar-He-Cutler Implementation
The second implementation uses the **Malvar-He-Cutler** demosaicing method, which reconstructs missing channels through fixed 5x5 convolution kernels designed around Bayer image statistics. The PyTorch implementation pads the Bayer input, applies the reconstruction filters, maps each pixel location back to the correct output channel, and clips the reconstructed RGB values into range.

Because the core operation is convolution, the same code can run on CPU or move the tensor pipeline to CUDA when a compatible GPU is available.

## Results
The Malvar-He-Cutler implementation produced cleaner reconstructions and visually matched MATLAB's default demosaicing behavior much more closely than the regression baseline. The learned linear model could recover broad color structure, but it introduced visible artifacts in challenging regions, especially around darker content and saturated color transitions.

The comparison below starts from the same Bayer-pattern input. The input appears mostly grayscale because every pixel carries only one sampled color channel before demosaicing reconstructs the missing RGB values.

<div class="project-image-grid">
  <figure>
    <img class="project-image-grid__contain" src="/images/projects/demosaicing/bayer-input-sample1.png" alt="Bayer-pattern input image for sample one" />
    <figcaption>Bayer-pattern input.</figcaption>
  </figure>
  <figure>
    <img class="project-image-grid__contain" src="/images/projects/demosaicing/ground-truth-sample1.png" alt="Ground truth RGB image for sample one" />
    <figcaption>Ground truth RGB sample.</figcaption>
  </figure>
  <figure>
    <img class="project-image-grid__contain" src="/images/projects/demosaicing/matlab-regression-sample1.png" alt="MATLAB linear regression demosaicing result for sample one" />
    <figcaption>MATLAB regression reconstruction.</figcaption>
  </figure>
  <figure>
    <img class="project-image-grid__contain" src="/images/projects/demosaicing/python-demosaic-sample1.png" alt="Python Malvar-He-Cutler demosaicing result for sample one" />
    <figcaption>Python Malvar-He-Cutler reconstruction.</figcaption>
  </figure>
</div>

The image below shows the kind of artifact that motivated the comparison: the regression output can exaggerate color patterns and produce unnatural transitions where the fixed-filter method stays cleaner.

<div class="project-image-grid">
  <figure>
    <img class="project-image-grid__contain" src="/images/projects/demosaicing/matlab-regression-sample2.png" alt="MATLAB regression result showing visible color artifacts" />
    <figcaption>Regression output with visible color artifacts.</figcaption>
  </figure>
  <figure>
    <img class="project-image-grid__contain" src="/images/projects/demosaicing/python-demosaic-sample2.png" alt="Python Malvar-He-Cutler result with cleaner reconstruction" />
    <figcaption>Malvar-He-Cutler output on the same sample.</figcaption>
  </figure>
</div>

## Lessons Learned
- **Local context matters:** a 5x5 patch is enough to learn a simple baseline, but it is not always enough to preserve natural color transitions.
- **Training data limits show up quickly:** the regression model was constrained by dataset size and scene diversity.
- **Algorithmic priors are powerful:** the Malvar-He-Cutler filters encode useful assumptions about Bayer sampling and produced stronger results without model training.
- **Implementation details matter:** edge padding, even image dimensions, channel indexing, and Bayer layout handling all directly affect reconstruction quality.

## Outcome
This project became a practical study in computational photography, numerical modeling, and GPU-friendly image processing. The final Python implementation delivered the strongest reconstruction quality, while the MATLAB model served as a useful baseline for understanding why demosaicing benefits from carefully designed spatial filters.
