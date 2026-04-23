# 도면 데이터 자동 라벨링 및 YOLOv8 학습 스크립트
# 이 파일은 Google Colab 환경에서 실행하도록 설계되었습니다.

import os
import shutil
import zipfile
from google.colab import files

def setup_environment():
    print("--- 필수 패키지 설치 중 ---")
    # GroundingDINO 및 YOLOv8 학습을 위한 패키지 설치
    !pip install -q ultralytics autodistill autodistill-grounding-dino roboflow

def extract_dataset(zip_path='dataset.zip'):
    print(f"--- {zip_path} 압축 해제 중 ---")
    if not os.path.exists(zip_path):
        print(f"오류: {zip_path} 파일이 없습니다. 웹에서 다운로드한 dataset.zip을 업로드해 주세요.")
        return False
    
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall('./raw_data')
    
    # images 폴더 경로 설정 (zip 내부 구조에 따라 다를 수 있음)
    image_dir = './raw_data/images'
    if not os.path.exists(image_dir):
        image_dir = './raw_data'
    
    print(f"압축 해제 완료. 이미지 경로: {image_dir}")
    return image_dir

def auto_labeling(image_dir):
    print("--- Auto-Labeling 시작 (GroundingDINO) ---")
    from autodistill_grounding_dino import GroundingDINO
    from autodistill.detection import CaptionOntology
    from autodistill.utils import split_dataset

    # 탐지할 객체 정의 (Ontology)
    # 건축 도면 특화: 문(door), 창문(window)
    ontology = CaptionOntology({
        "architectural door": "door",
        "window": "window"
    })

    base_model = GroundingDINO(ontology=ontology)
    
    # 자동 라벨링 및 YOLO 데이터셋 생성
    dataset = base_model.label(
        input_folder=image_dir,
        extension=".jpg", # 또는 .png
        output_folder="./yolo_dataset"
    )
    
    print("라벨링 완료. 데이터셋이 ./yolo_dataset에 저장되었습니다.")
    return "./yolo_dataset"

def train_yolo(dataset_path):
    print("--- YOLOv8 커스텀 학습 시작 ---")
    from ultralytics import YOLO

    # data.yaml 파일 자동 생성 (autodistill이 생성해 주지만, 경로 확인 필요)
    yaml_path = os.path.join(dataset_path, "data.yaml")
    
    # 모델 로드 (YOLOv8 Nano 모델 사용)
    model = YOLO('yolov8n.pt')

    # 학습 진행
    results = model.train(
        data=yaml_path,
        epochs=50,
        imgsz=640,
        plots=True
    )
    
    print("학습이 완료되었습니다.")
    return model

def download_best_model():
    print("--- 최적 모델(best.pt) 다운로드 중 ---")
    best_model_path = 'runs/detect/train/weights/best.pt'
    if os.path.exists(best_model_path):
        files.download(best_model_path)
    else:
        # 혹시 train 폴더 뒤에 숫자가 붙었을 경우 대비
        import glob
        paths = glob.glob('runs/detect/train*/weights/best.pt')
        if paths:
            files.download(paths[-1])
        else:
            print("best.pt 파일을 찾을 수 없습니다.")

if __name__ == "__main__":
    # 1. 환경 설정
    setup_environment()
    
    # 2. 데이터셋 압축 해제 (사용자가 dataset.zip을 업로드해야 함)
    # files.upload() # 코랩에서 직접 파일을 선택하고 싶을 경우 주석 해제
    img_dir = extract_dataset()
    
    if img_dir:
        # 3. 자동 라벨링
        yolo_data_path = auto_labeling(img_dir)
        
        # 4. YOLO 학습
        train_yolo(yolo_data_path)
        
        # 5. 결과 다운로드
        download_best_model()
