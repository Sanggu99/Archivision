import os
from PIL import Image, ImageDraw, ImageFont

def draw_yolo_labels(image_path, label_path, output_path):
    if not os.path.exists(image_path) or not os.path.exists(label_path):
        print(f"Error: Files not found {image_path}, {label_path}")
        return

    img = Image.open(image_path).convert("RGB")
    draw = ImageDraw.Draw(img)
    width, height = img.size

    with open(label_path, "r") as f:
        lines = f.readlines()

    for line in lines:
        parts = line.strip().split()
        if len(parts) < 5: continue
        
        class_id, x_center, y_center, w, h = map(float, parts)
        
        # Denormalize
        x1 = (x_center - w/2) * width
        y1 = (y_center - h/2) * height
        x2 = (x_center + w/2) * width
        y2 = (y_center + h/2) * height
        
        color = "#3b82f6" if class_id == 0 else "#10b981" # Blue for Door, Green for Window
        label_text = "DOOR" if class_id == 0 else "WINDOW"
        
        # Draw rectangle
        draw.rectangle([x1, y1, x2, y2], outline=color, width=3)
        
        # Draw label
        try:
            font = ImageFont.load_default()
            draw.text((x1, y1 - 15), label_text, fill=color, font=font)
        except:
            draw.text((x1, y1 - 15), label_text, fill=color)

    img.save(output_path)
    print(f"Preview saved to {output_path}")

# 도면 7번을 예시로 생성
draw_yolo_labels(
    "dataset/images/drawing_7_plan_detailed_1776916411349.png",
    "dataset/labels/drawing_7_plan_detailed_1776916411349.txt",
    "dataset/debug_preview_drawing_7.png"
)
