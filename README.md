# 🏛️ Archivision AI: Architectural Intelligence Platform

> **Beyond Visualization: Transforming Blueprints into Quantitative Data Assets.**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)

**Archivision**은 단순한 도면 시각화 도구를 넘어, AI 기반의 공간 분석과 정밀 데이터 관리를 지원하는 **Architectural MLOps 플랫폼**입니다. 도면 내의 객체를 식별하고, 실제 치수를 기반으로 면적을 자동 산출하는 등 설계 데이터의 정량적 가치를 극대화합니다.

---

## 🔥 Key Technical Advancements

### 📐 1. Scale-based Area Analytics (실면적 자동 측정)
- **Pixel-to-Meter Mapping**: 도면 내의 치수선을 기준으로 이미지의 픽셀 단위를 실제 미터(m) 단위로 환산합니다.
- **Real-world Measurement**: 텍스트를 읽는 방식이 아닌, AI가 탐지한 바운딩 박스의 기하학적 데이터를 바탕으로 실별 면적(㎡)과 가로x세로 치수를 직접 산출합니다.

### 🧱 2. Advanced Wall Detection (벽체 분석 시스템)
- **Structural Boundary Analysis**: 외벽과 내벽(Wall)을 별도로 탐지하여 건축적 경계선을 정의합니다.
- **Net Area (전용면적) Calculation**: 벽체 정보를 기반으로 실질적인 내부 가용 면적을 정밀하게 집계합니다.

### 🗂️ 3. Layer-based Multi-Filter UI (레이어 기반 필터링)
- **Category Toggling**: ROOM, DOOR, WINDOW, FURNITURE, WALL 등 각 객체 레이어를 개별적으로 켜고 끌 수 있어, 복잡한 도면 내에서도 직관적인 검증이 가능합니다.
- **Color-Coded Semantics**: 건축적 의미론에 기반한 색상 시스템을 적용하여 객체 간 구분을 최적화했습니다.

### 💎 4. Source of Truth: JSON-Centric Data
- **Rich Metadata**: 단순 좌표를 넘어 라벨링, 카테고리, 스케일 정보가 포함된 확장형 JSON 스키마를 채택했습니다.
- **Automated YOLO Sync**: JSON 수정 시 학습용 YOLOv8 `.txt` 파일이 실시간으로 자동 동기화되어 MLOps 파이프라인의 효율을 극대화합니다.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19 (Vite 기반), Lucide Icons, Tailwind CSS (Modern Aesthetics)
- **Backend**: Node.js Express (Fast API Handling)
- **Data Model**: JSON-based Annotation System with YOLO Format Compatibility
- **Analytics Engine**: Computational geometry for area and scale calculation

---

## 🚀 Installation & Running

**1. Clone the Repository:**
```bash
git clone git@github.com:Sanggu99/Archivision.git
cd Archivision
```

**2. Setup Backend & Frontend:**
```bash
npm install
node server.js    # Running on Port 5001
npm run dev      # Running on Port 5173
```

---

## 📁 Data Structure Overview

```text
dataset/
├── images/       # Raw Architectural Plan Images
├── annotations/  # Advanced JSON Data (Scale, Objects, Meta)
└── labels/       # Auto-synced YOLOv8 Training Labels (.txt)
```

---

## 👤 Author
- **Sanggu99** - *Lead Developer & Visionary* - [GitHub Profile](https://github.com/Sanggu99)

---

© 2026 Archivision • Turning Visionary Designs into Actionable Data.