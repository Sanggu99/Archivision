import fs from 'fs';
import path from 'path';

const IMAGES_DIR = "dataset/images";
const LABELS_DIR = "dataset/labels";
const ANNOTATIONS_DIR = "dataset/annotations";

if (!fs.existsSync(ANNOTATIONS_DIR)) fs.mkdirSync(ANNOTATIONS_DIR);

const CLASS_REVERSE_MAPPING = {
  0: "door",
  1: "window"
};

const txtFiles = fs.readdirSync(LABELS_DIR).filter(f => f.endsWith('.txt'));

txtFiles.forEach(file => {
  const baseName = path.parse(file).name;
  const txtContent = fs.readFileSync(path.join(LABELS_DIR, file), 'utf-8');
  
  const objects = txtContent.split('\n').filter(l => l.trim() !== '').map(line => {
    const [classId, x, y, w, h] = line.split(' ').map(Number);
    return {
      category: CLASS_REVERSE_MAPPING[classId] || "unknown",
      label: (CLASS_REVERSE_MAPPING[classId] || "unknown").toUpperCase(),
      bbox: [x, y, w, h]
    };
  });

  const annotation = {
    image_name: `${baseName}.png`, // 우선 png로 가정
    dimensions: { width: 1280, height: 768 },
    objects: objects
  };

  fs.writeFileSync(path.join(ANNOTATIONS_DIR, `${baseName}.json`), JSON.stringify(annotation, null, 2));
  console.log(`Migrated: ${baseName}.json`);
});
