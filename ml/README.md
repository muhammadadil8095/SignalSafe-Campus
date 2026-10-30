# ML — Machine Learning Module

This directory contains all machine learning assets for SignalSafe Campus, including datasets, training scripts, notebooks, and evaluation reports.

## Directory Structure

```
ml/
├── datasets/         # Training and evaluation datasets
├── notebooks/        # Jupyter notebooks for exploration and prototyping
├── training/         # Model training scripts and saved model artifacts
├── evaluation/       # Evaluation metrics, reports, and visualizations
└── README.md         # This file
```

## Subdirectories

### `datasets/`

Raw and processed datasets used for training and evaluating detection models. Include a README or data card describing each dataset's source, format, and license.

> [!CAUTION]
> Do not commit large dataset files directly to Git. Use Git LFS or document download instructions instead.

### `notebooks/`

Jupyter notebooks for exploratory data analysis, feature engineering experiments, and model prototyping. Name notebooks descriptively:

```
01_dataset_exploration.ipynb
02_url_feature_extraction.ipynb
03_model_training_comparison.ipynb
```

### `training/`

Production training scripts and saved model artifacts (`.pkl`, `.joblib`, `.onnx`). Include versioning in file names:

```
url_classifier_v1.pkl
text_classifier_v1.pkl
```

### `evaluation/`

Model evaluation results including metrics, confusion matrices, and comparison reports.

## Owner

This module is owned by **Member A** (Detection & ML). See [docs/TEAM_ASSIGNMENTS.md](../docs/TEAM_ASSIGNMENTS.md) for details.
