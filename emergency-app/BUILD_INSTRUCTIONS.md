# คำแนะนำการ Build APK

## วิธีที่ 1: Build ด้วย EAS (แนะนำ - Cloud Build)

### ขั้นตอน:
1. เปิด terminal ในโฟลเดอร์ `emergency-app`
2. รันคำสั่ง:
   ```bash
   eas build --platform android --profile preview
   ```
3. เมื่อถูกถามเกี่ยวกับ keystore:
   - เลือก "Generate a new Android Keystore" (สำหรับครั้งแรก)
   - หรือ "Use existing credentials" (ถ้ามีอยู่แล้ว)
4. รอให้ build เสร็จ (ประมาณ 10-20 นาที)
5. ดาวน์โหลด APK จากลิงก์ที่แสดง หรือรัน:
   ```bash
   eas build:list
   ```

### ดูสถานะ build:
```bash
eas build:list
```

### ดาวน์โหลด APK:
```bash
eas build:download [BUILD_ID]
```

---

## วิธีที่ 2: Build แบบ Local (ต้องมี Android Studio)

### ขั้นตอน:
1. ติดตั้ง dependencies:
   ```bash
   npm install
   ```

2. Prebuild native code:
   ```bash
   npx expo prebuild
   ```

3. Build APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

4. APK จะอยู่ที่: `android/app/build/outputs/apk/release/app-release.apk`

---

## หมายเหตุ:
- สำหรับ EAS Build ต้อง login ก่อน: `eas login`
- Build แบบ cloud จะใช้เวลาประมาณ 10-20 นาที
- APK ที่ได้จะสามารถติดตั้งได้บน Android device

