import speech_recognition as sr


r = sr.Recognizer()

print(sr.Microphone.list_microphone_names())
mic = sr.Microphone()


with mic as source:
    print("speak!")
    r.adjust_for_ambient_noise(source)
    audio = r.listen(source, timeout=3, phrase_time_limit=3)


try:
    result = r.recognize_google(audio, language="ko-KR")
    print(result)
except speech_recognition.UnknownValueError:
    print("음성 인식 실패")
except speech_recognition.RequestError:
    print("HTTP Request Error 발생")
except speech_recognition.WaitTimeoutError:
    print("WaitTimeout Error 발생")
