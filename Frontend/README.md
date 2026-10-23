# PashuPehchan

PashuPehchan is an AI-assisted cattle and buffalo breed identification and
milk-yield analysis application for Indian livestock. The project contains a
React/Vite frontend and a FastAPI backend that loads the trained breed
classifier and milk-yield regression model.

## Features

- Upload or drag-and-drop a JPG, JPEG, PNG, or WEBP image.
- Reject non-cattle images using MobileNetV2 ImageNet out-of-distribution
  validation.
- Classify the uploaded animal with the EfficientNetB0 breed classifier
  (currently configured with 18 cattle classes).
- Display confidence, prediction status, top-five predictions, and a Grad-CAM
  visualization returned by the backend.
- Run milk-yield prediction from animal, nutrition, environment, and
  lactation parameters.
- Download breed and milk-analysis summaries as PNG files.
- Browse local information for 12 Indian cattle and buffalo breeds in the UI.
- Responsive layout with keyboard focus states and mobile navigation.

## Supported breeds

| Cattle | Buffalo |
| --- | --- |
| Gir | Murrah |
| Sahiwal | Nili-Ravi |
| Tharparkar | Jaffarabadi |
| Red Sindhi | Surti |
| Kankrej | Bhadawari |
| Hariana | Pandharpuri |

## Project structure

```text
IPD!/
├── Backend/
│   ├── app1.py
│   ├── requirements.txt
│   ├── milk_yield_prediction_model.pkl
│   └── model/
│       ├── indian_cattle_breed_classifier.keras
│       ├── class_names.json
│       └── config.json
└── Frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── index.css
        ├── components/
        ├── data/breedData.js
        └── utils/downloadUtils.js
```

## Requirements

- Python 3.10 or newer
- Node.js 18 or newer
- npm 9 or newer

The backend loads TensorFlow and the model files during startup. Keep the
provided files under `Backend/model/` and
`Backend/milk_yield_prediction_model.pkl`; otherwise the API will not start or
the milk-analysis endpoint will be unavailable.

## Run locally

Open two terminals from the repository root.

### 1. Start the backend

```bash
cd Backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app1:app --reload --host 127.0.0.1 --port 8000
```

The API is available at `http://127.0.0.1:8000`. Interactive API
documentation is available at
`http://127.0.0.1:8000/docs`.

### 2. Start the frontend

```bash
cd Frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally
`http://localhost:5173`.

The frontend currently calls the backend directly at
`http://127.0.0.1:8000`. Start the backend on that address and port, or update
the two fetch URLs in
[`src/components/DetectionSection.jsx`](./src/components/DetectionSection.jsx)
when using a different deployment.

## Backend API

### `GET /health`

Returns a basic health response and the number of loaded breed classes.

### `POST /predict`

Accepts a multipart form upload with the field name `file`. Supported MIME
types are `image/jpeg`, `image/jpg`, `image/png`, and `image/webp`.

Successful responses include:

```json
{
  "success": true,
  "breed": "Gir",
  "confidence": 0.92,
  "confidence_percent": 92.0,
  "status": "Confident Prediction",
  "top5": [],
  "gradcam": "data:image/jpeg;base64,...",
  "model": "EfficientNetB0",
  "num_classes": 18
}
```

For an image that is not identified as cattle, the endpoint returns
`success: false`, `is_cattle: false`, and a user-facing message.

### `POST /api/milk-analysis`

Accepts JSON containing the 19 fields used by the trained model:
`Breed`, `Age_Months`, `Weight_kg`, `Parity`, `Lactation_Stage`,
`Days_in_Milk`, `Feed_Type`, `Feed_Quantity_kg`, `Water_Intake_L`,
`Grazing_Duration_hrs`, `Rumination_Time_hrs`, `Resting_Hours`,
`Ambient_Temperature_C`, `Humidity_percent`, `Season`, `Housing_Score`,
`Previous_Week_Avg_Yield`, `Body_Condition_Score`, and
`Milking_Interval_hrs`.

The response contains the model output in litres per day:

```json
{
  "success": true,
  "milk_yield_l": 8.42
}
```

Invalid values are reported as HTTP 422 responses. If the milk model cannot be
loaded, the endpoint reports HTTP 503 instead of returning a fabricated
result.

## Frontend commands

Run these commands from `Frontend/`:

```bash
npm run dev       # development server
npm run build     # production build
npm run preview   # preview the production build
npm run lint      # Oxlint checks
```

## Data and model notes

- Breed descriptions and displayed breed metrics are maintained in
  `src/data/breedData.js`.
- Breed image inference uses the EfficientNetB0 model and class metadata in
  `Backend/model/`.
- Milk prediction uses `Backend/milk_yield_prediction_model.pkl` with the
  schema validated in `Backend/app1.py`.
- Downloaded summaries are generated client-side with the HTML5 Canvas API.

## Academic project

This application was developed as an Industry Project (IPD), 2025–26, for
academic and demonstration use.
