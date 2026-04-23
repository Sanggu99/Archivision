import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// 경로 설정
const IMAGES_DIR = path.join(__dirname, 'dataset/images');
const ANNOTATIONS_DIR = path.join(__dirname, 'dataset/annotations');
const LABELS_DIR = path.join(__dirname, 'dataset/labels'); // 학습용 임시 저장

// 디렉토리 생성
[IMAGES_DIR, ANNOTATIONS_DIR, LABELS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.use('/images', express.static(IMAGES_DIR));

// 클래스 정의 (Ontology)
const CLASS_MAPPING = {
  "door": 0,
  "window": 1,
  "room": 2,
  "wall": 3,
  "furniture": 4,
  "equipment": 5
};

// 1. 전체 데이터 로드 (JSON 기반)
app.get('/api/data', (req, res) => {
  try {
    const images = fs.readdirSync(IMAGES_DIR).filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
    
    const data = images.map(img => {
      const baseName = path.parse(img).name;
      const jsonPath = path.join(ANNOTATIONS_DIR, `${baseName}.json`);
      
      let annotation = {
        image_name: img,
        dimensions: { width: 0, height: 0 },
        objects: []
      };

      if (fs.existsSync(jsonPath)) {
        annotation = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      }

      return {
        id: baseName,
        name: img,
        url: `http://localhost:5001/images/${img}`,
        annotation: annotation
      };
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. JSON 데이터 저장 및 YOLO용 .txt 자동 생성
app.post('/api/save-annotation', (req, res) => {
  const { baseName, annotation } = req.body;
  const jsonPath = path.join(ANNOTATIONS_DIR, `${baseName}.json`);
  const txtPath = path.join(LABELS_DIR, `${baseName}.txt`);

  try {
    // JSON 저장
    fs.writeFileSync(jsonPath, JSON.stringify(annotation, null, 2));

    // YOLO .txt로 변환 (학습용)
    const yoloLines = annotation.objects.map(obj => {
      const classId = CLASS_MAPPING[obj.category] ?? 0;
      return `${classId} ${obj.bbox.join(' ')}`;
    });
    fs.writeFileSync(txtPath, yoloLines.join('\n'));

    res.json({ message: 'JSON 및 YOLO 데이터 저장 완료' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. 파일 업로드
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMAGES_DIR),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

app.post('/api/upload', upload.array('files'), (req, res) => {
  res.json({ message: '이미지 업로드 완료' });
});

app.listen(PORT, () => {
  console.log(`JSON-based MLOps Server running at http://localhost:5001`);
});
