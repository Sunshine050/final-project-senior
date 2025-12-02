# คำสั่ง Build APK เร็วๆ

## วิธีที่ 1: EAS Build (แนะนำ - Cloud Build)

เปิด terminal ในโฟลเดอร์ `emergency-app` แล้วรัน:

```bash
cd emergency-app
eas build --platform android --profile preview
```

**เมื่อถูกถาม:**
- เลือก "Generate a new Android Keystore" (สำหรับครั้งแรก)
- รอให้ build เสร็จ (ประมาณ 10-20 นาที)

**ดูสถานะ build:**
```bash
eas build:list
```

**ดาวน์โหลด APK:**
```bash
eas build:download [BUILD_ID]
```

---

## วิธีที่ 2: Local Build (ต้องมี Android Studio)

```bash
cd emergency-app
npm install
npx expo prebuild
cd android
./gradlew assembleRelease
```

APK จะอยู่ที่: `android/app/build/outputs/apk/release/app-release.apk`

---

## หมายเหตุ:
- EAS Build ต้อง login ก่อน: `eas login`
- Build แบบ cloud จะใช้เวลาประมาณ 10-20 นาที
- APK ที่ได้จะสามารถติดตั้งได้บน Android device

