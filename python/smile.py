import cv2
import mediapipe as mp
import collections

# MediaPipe FaceMesh 초기화
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# DrawingSpec 설정
drawing_spec = mp.solutions.drawing_utils.DrawingSpec(thickness=1, circle_radius=1)

# 웹캠에서 비디오를 가져오기
cap = cv2.VideoCapture(0)

# 프레임레이트를 확인
fps = cap.get(cv2.CAP_PROP_FPS)
if fps < 1:
    # 대체 프레임레이트 설정
    fps = 30

# 이전 입 너비와 입꼬리 상대 y좌표를 저장할 버퍼 (1초분량)
prev_mouth_widths = collections.deque(maxlen=int(fps))
prev_mouth_corners_relative_y = collections.deque(maxlen=int(fps) * 2)  # 양쪽 입꼬리 * 2

# 웃음 감지를 위한 임계값 설정
mouth_width_increase_threshold = 0.02  # 입 너비 증가 임계값
mouth_corner_lift_threshold = 0.008  # 입꼬리 상대적 상승 임계값

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # RGB로 변환
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)

    if results.multi_face_landmarks:
        for landmarks in results.multi_face_landmarks:
            # 입꼬리 랜드마크 인덱스: 61, 291
            # 상, 하 입술의 중앙 랜드마크 인덱스: 0, 17 (대략적인 중앙점 참고)
            left_mouth_corner = landmarks.landmark[61]
            right_mouth_corner = landmarks.landmark[291]
            upper_lip_center = landmarks.landmark[0]
            lower_lip_center = landmarks.landmark[17]

            # 입의 중앙점 계산
            mouth_center_y = (upper_lip_center.y + lower_lip_center.y) / 2

            # 현재 프레임의 입꼬리 상대 y좌표와 너비 계산
            current_mouth_width = abs(right_mouth_corner.x - left_mouth_corner.x)
            current_left_corner_relative_y = left_mouth_corner.y - mouth_center_y
            current_right_corner_relative_y = right_mouth_corner.y - mouth_center_y

            # 1초 전의 프레임과 입꼬리 상대 위치 및 너비 비교
            if len(prev_mouth_widths) >= 1 and len(prev_mouth_corners_relative_y) >= 2:
                # 1초 전 프레임의 데이터 가져오기
                one_second_ago_width = prev_mouth_widths[0]
                one_second_ago_left_corner_relative_y = prev_mouth_corners_relative_y[0]
                one_second_ago_right_corner_relative_y = prev_mouth_corners_relative_y[1]

                # 입 너비가 넓어졌는지 및 입꼬리가 상대적으로 올라갔는지 확인
                mouth_width_change = current_mouth_width - one_second_ago_width
                mouth_corners_lift = (one_second_ago_left_corner_relative_y - current_left_corner_relative_y +
                                      one_second_ago_right_corner_relative_y - current_right_corner_relative_y) / 2

                if mouth_width_change > mouth_width_increase_threshold and mouth_corners_lift > mouth_corner_lift_threshold:
                    cv2.putText(frame, "Smiling", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

            # 현재 프레임의 데이터를 저장
            prev_mouth_widths.append(current_mouth_width)
            prev_mouth_corners_relative_y.append(current_left_corner_relative_y)
            prev_mouth_corners_relative_y.append(current_right_corner_relative_y)

            # 얼굴 랜드마크 그리기 (기본 DrawingSpec 사용)
            mp.solutions.drawing_utils.draw_landmarks(
            frame, landmarks, mp_face_mesh.FACEMESH_CONTOURS, drawing_spec, drawing_spec)

    # 화면에 결과 표시
    cv2.imshow("Face Landmarks", frame)

    # 'q' 키를 누르면 반복문 종료
    if cv2.waitKey(5) & 0xFF == ord('q'):
        break

# 자원 해제
cap.release()
cv2.destroyAllWindows()
