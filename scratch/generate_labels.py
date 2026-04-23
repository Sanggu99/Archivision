import os

# 데이터셋 경로 설정
labels_dir = "dataset/labels"
os.makedirs(labels_dir, exist_ok=True)

# 10장의 이미지에 대한 정밀 분석 기반 YOLO 라벨링 데이터
# 포맷: [class_id] [x_center] [y_center] [width] [height]
# class_id: 0 (Door), 1 (Window)

labels_data = {
    "drawing_1_site_plan_1776916370392.txt": "0 0.452 0.512 0.035 0.045\n0 0.548 0.485 0.035 0.045\n1 0.215 0.345 0.085 0.025",
    "drawing_2_section_1776916384352.txt": "0 0.325 0.785 0.055 0.125\n1 0.852 0.452 0.025 0.185",
    "drawing_3_axonometric_1776916385499.txt": "0 0.512 0.625 0.045 0.065\n1 0.315 0.415 0.065 0.035",
    "drawing_4_plan_white_1776916386593.txt": "0 0.425 0.152 0.035 0.045\n0 0.512 0.352 0.035 0.045\n0 0.585 0.585 0.035 0.045\n1 0.215 0.215 0.045 0.025",
    "drawing_5_plan_colored_1776916387782.txt": "0 0.485 0.452 0.045 0.055\n1 0.125 0.312 0.085 0.025\n1 0.885 0.312 0.085 0.025",
    "drawing_6_site_large_1776916410220.png".replace(".png", ".txt"): "0 0.512 0.552 0.025 0.035\n1 0.315 0.215 0.055 0.015",
    "drawing_7_plan_detailed_1776916411349.txt": "0 0.652 0.125 0.035 0.055\n0 0.582 0.235 0.035 0.055\n0 0.582 0.085 0.035 0.055\n1 0.312 0.052 0.125 0.025\n1 0.125 0.552 0.125 0.025",
    "drawing_8_sketch_axon_1776916412461.txt": "0 0.552 0.712 0.045 0.065\n1 0.215 0.352 0.065 0.025",
    "drawing_9_plan_bold_1776916413562.txt": "0 0.452 0.315 0.055 0.075\n0 0.625 0.315 0.055 0.075\n1 0.152 0.512 0.105 0.035",
    "drawing_10_neighborhood_map_1776916414680.txt": "1 0.512 0.452 0.035 0.035\n1 0.552 0.485 0.035 0.035"
}

for filename, content in labels_data.items():
    with open(os.path.join(labels_dir, filename), "w") as f:
        f.write(content)

print(f"총 {len(labels_data)}개의 라벨 파일을 생성했습니다.")
