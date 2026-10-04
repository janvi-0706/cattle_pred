# 🐄 PashuPehchan — AI Cattle & Buffalo Breed Identifier

> **IPD Project 2025–26**  
> AI-Based Image Recognition System for Accurate Breed Identification of Cattle and Buffaloes in India.

---

## 📌 Problem Statement

Develop an AI-driven system that identifies cattle and buffalo breeds using images, providing breed-specific milk production and quality estimates to support farmers, veterinarians, and researchers across India.

---

## 🚀 Features

- **Image-Based Breed Detection** — Upload a JPG/PNG photo of an animal; the AI model identifies the breed with a confidence score.
- **12 Breed Classes** — Covers major indigenous cattle and buffalo breeds of India (Gir, Sahiwal, Murrah, Nili-Ravi, and more).
- **Milk Production & Quality Analysis** — Auto-fetched from detected breed or manually entered via a parameter form.
- **Downloadable Summaries** — Export breed detection results and milk analysis reports as PNG images.
- **Professional UI** — Green & white color scheme, collapsible sidebar navigation, fully responsive layout.

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx          # Fixed side navigation
│   ├── Header.jsx           # Hero section
│   ├── AboutSection.jsx     # About, objectives, how-it-works, breed showcase
│   ├── DetectionSection.jsx # Input 1 (image upload) + Input 2 (manual form) + milk output
│   └── Footer.jsx           # Footer with project info
├── data/
│   └── breedData.js         # Breed database (12 breeds, mock detection pool)
├── utils/
│   └── downloadUtils.js     # Canvas-based PNG summary download functions
├── App.jsx                  # Root layout + IntersectionObserver for active nav
├── main.jsx
└── index.css                # Tailwind CSS v4 import + global styles
```

---

## 🛠️ Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 19, Vite 8, TailwindCSS v4        |
| Icons      | Lucide React                            |
| Export     | HTML5 Canvas API (PNG download)         |
| Backend    | Python — Flask / FastAPI *(teammate)*   |
| ML Model   | CNN / YOLOv8 *(teammate)*               |
| Database   | MongoDB *(planned)*                     |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# Clone the repo
git clone https://github.com/Manthan-2812/IPD.git
cd IPD

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## 🐄 Supported Breeds

| Animal  | Breeds                                              |
|---------|-----------------------------------------------------|
| Cattle  | Gir, Sahiwal, Tharparkar, Red Sindhi, Kankrej, Hariana |
| Buffalo | Murrah, Nili-Ravi, Jaffarabadi, Surti, Bhadawari, Pandharpuri |

---

## 🔗 Backend Integration

The backend (model inference) is developed separately by a teammate.  
To connect, replace the mock detection logic in `DetectionSection.jsx` with an API call:

```js
// Replace mock setTimeout with:
const response = await fetch('/api/detect', {
  method: 'POST',
  body: formData,   // FormData with the uploaded image
})
const result = await response.json()
// result: { breed, confidence, type, ... }
```

---

## 📊 Datasets Used

- [Cattle Breeds Image Dataset — Roboflow Universe](https://universe.roboflow.com/)
- [State-wise Milk Production Data — data.gov.in](https://data.gov.in/)
- [Breed Classifications — ICAR-NBAGR](https://nbagr.icar.gov.in/)

---

## 👨‍💻 Team

| Role              | Responsibility                       |
|-------------------|--------------------------------------|
| Frontend (You)    | React UI, breed showcase, milk analysis form, download feature |
| Backend (Teammate)| Model training (YOLOv8/CNN), Flask API, dataset preparation |

---

## 📄 License

This project is developed for academic purposes as part of an Industry Project (IPD) — 2025–26.
