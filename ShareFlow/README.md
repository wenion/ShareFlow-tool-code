# ShareFlow

## Overview

The ShareFlow project is a full-stack solution that includes both frontend and backend components. The key source code for the project is organized as follows:

### Frontend

- **userTraceCapture.ts**: Defines the events and methods for capturing and tracking user interactions from the frontend.

### Backend

- **api.py**: Provides the API endpoints for the frontend to access and retrieve ShareFlow data.
- **data_model.py**: Contains the data models for user event tracking, including the definitions of two primary classes.
- **shareflow_process.py**: Implements the algorithms and logic to generate and process ShareFlows based on user event data.

### ShareFlow Pipeline

The ShareFlow generation process involves the serialization of user trace data, followed by action mapping, process labeling, and image generation, resulting in a structured representation of user interactions as a process flow.

#### 1. Serialization of User Trace Data
- **Function**: `process_serialize`
- **Input**: A list of dictionaries containing user trace events (`taskName`, `type`, `text`, `url`).
- **Process**: Iterates over events, assigning a sequence counter (`seq_counter`) based on changes in the `KM_Process` field to track action sequences.
- **Output**: Serialized user trace data, with each entry labeled by its sequence counter.

#### 2. Action Mapping
- **Function**: `action_mapper`
- **Input**: Serialized data from the previous step (user events with `taskName`, `type`, `text`).
- **Process**: Applies action mappings from the `action_mapping` dictionary, converting raw action types and descriptions into higher-level action categories.
- **Output**: A structured list of user events with mapped action types.

#### 3. Process Mapping
- **Function**: `process_labeller`
- **Input**: Action-mapped list of user events.
- **Process**: Matches action sequences against patterns in the `process_map` dictionary, labeling sequences with appropriate `KM_Process` tags (e.g., navigation, annotation).
- **Output**: Labeled user actions, with each sequence associated with a `KM_Process`.

#### 4. Image Generation
- **Input**: Labeled user actions, with each sequence tagged with a `KM_Process`.
- **Process**: Utilizes the OpenCV library to generate images, including action and text overlays, as well as including the screenshots of user interactions.
- **Output**: An updated list of user events, each associated with corresponding process images.

The final result is a ShareFlow document in nested JSON format, representing the structured sequence of user interactions during a session.


## Contact

For assistance or inquiries, please reach out to the support team via email.
