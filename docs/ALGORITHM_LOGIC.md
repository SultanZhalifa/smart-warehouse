# Technical Documentation: Detection Algorithms & Data Management

This document outlines the technical implementation of the object detection logic and the data management architecture for the Smart Warehouse system.

## 1. Object Detection Simulation Logic
As a prototype, the system implements a **Probabilistic Heuristic Engine** to simulate real-time AI inference from a YOLOv8 (You Only Look Once) model.

### Detection Pipeline:
1.  **Frame Acquisition**: The simulation engine triggers a frame analysis every **2000ms** to mimic asynchronous processing.
2.  **Stochastic Object Generation**: Objects are generated with randomized spatial coordinates within the HTML5 Canvas coordinate system.
3.  **Inference Simulation**:
    * **Confidence Scoring**: Each detected object is assigned a confidence score using a normalized distribution.
    * **Threshold Filtering**: A strict **0.75 Confidence Threshold** is applied. Objects falling below this value are discarded to minimize "False Positives".
4.  **Classification Logic**:
    * `Animal Class`: Identified as a high-risk anomaly. Triggers an immediate `CRITICAL` alert state and logs the entry into the Alert Center.
    * `Authorized Personnel`: Identified as a standard operational entity. Logged as a routine activity in the Audit Trail.

## 2. Data Management Architecture
The system utilizes a **Centralized State Management** pattern to ensure data integrity across all 8 modules.

### State Orchestration:
* **WarehouseContext**: Acts as the "Single Source of Truth," managing global states for Inventory, Alerts, and Zones using the `useReducer` hook for predictable state transitions.
* **Mock Data Layer**: Static entities are defined in `mockData.js`, serving as the initial schema for system hydration.

### Data Schema Specifications:
* **Inventory Entity**: `id (string), name (string), category (enum), stock (int), unit (string), zone (string), status (string)`.
* **Detection Log Entity**: `id (uuid), timestamp (iso8601), type (string), confidence (float), zone (string), image_snapshot (blob/url)`.

## 3. Intelligent Alerting Protocol
The backend logic determines alert severity based on a **Spatial Risk Matrix**:
* **High-Security Zones (e.g., Zone A - Main Storage)**: Detection of unauthorized classes (Animals) triggers a `CRITICAL` severity status.
* **Operational Zones (e.g., Zone B - Loading Dock)**: Detection of similar anomalies triggers a `WARNING` severity status to allow for human verification.