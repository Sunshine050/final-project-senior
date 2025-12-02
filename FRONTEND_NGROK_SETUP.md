# 🔧 ตั้งค่า Frontend ให้ใช้ Ngrok

## ✅ สิ่งที่ทำแล้ว
- สร้างไฟล์ `.env.local` ในโฟลเดอร์ `frontend`
- ตั้งค่า `NEXT_PUBLIC_API_URL` เป็น ngrok URL

## 📝 ไฟล์ `.env.local`
```
NEXT_PUBLIC_API_URL=https://8684c2291549.ngrok-free.app
NEXT_PUBLIC_WS_URL=https://8684c2291549.ngrok-free.app
```

## 🚀 ขั้นตอนต่อไป

### 1. Restart Frontend
```bash
# กด Ctrl+C เพื่อหยุด frontend
# แล้วรันใหม่:
cd frontend
npm run dev
```

### 2. ตรวจสอบว่าใช้ API URL ถูกต้อง
- ดู console log ว่า API calls ไปที่ ngrok URL
- ทดสอบ login ว่าทำงานได้

## ⚠️ หมายเหตุ

### ถ้า Ngrok URL เปลี่ยน:
1. รัน `ngrok http 3000` ใหม่
2. คัดลอก URL ใหม่
3. อัปเดต `.env.local`:
   ```bash
   cd frontend
   echo "NEXT_PUBLIC_API_URL=https://NEW_URL.ngrok-free.app" > .env.local
   echo "NEXT_PUBLIC_WS_URL=https://NEW_URL.ngrok-free.app" >> .env.local
   ```
4. Restart frontend: `npm run dev`

## 🔍 ตรวจสอบ

### ตรวจสอบว่า Backend ทำงานอยู่:
```bash
cd backend
npm run start:dev
```

### ตรวจสอบว่า Ngrok ทำงานอยู่:
```bash
ngrok http 3000
```

### ทดสอบ API:
เปิด browser ไปที่: `https://8684c2291549.ngrok-free.app`

