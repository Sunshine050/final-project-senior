# คำแนะนำการรัน Frontend Dashboard

## ขั้นตอนการรัน

### 1. ติดตั้ง Dependencies

```bash
cd frontend
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์ `frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

**หมายเหตุ:** 
- ถ้า backend รันที่พอร์ตอื่น ให้เปลี่ยนพอร์ตตาม
- ถ้า backend รันบน server อื่น ให้เปลี่ยน URL เป็น IP หรือ domain ของ server

### 3. รัน Backend ก่อน (จำเป็น)

เปิด terminal ใหม่และรัน backend:

```bash
cd backend
npm install
npm run start:dev
```

Backend จะรันที่ `http://localhost:3000`

### 4. รัน Frontend

```bash
cd frontend
npm run dev
```

Frontend จะรันที่ `http://localhost:3001` (หรือพอร์ตถัดไปถ้า 3001 ถูกใช้)

### 5. เข้าถึง Dashboard

เปิด browser ไปที่: **http://localhost:3001**

## การ Login

1. ไปที่หน้า `/login`
2. ใช้ credentials ที่มีในระบบ
3. หลังจาก login สำเร็จ จะเข้าสู่หน้า dashboard

## ฟีเจอร์หลัก

- **Dashboard**: รับ SOS requests จากแอปมือถือแบบ real-time
- **WebSocket**: เชื่อมต่ออัตโนมัติสำหรับ real-time updates
- **Notifications**: แจ้งเตือนเมื่อมี SOS ใหม่
- **Emergency Management**: ดูรายละเอียดและมอบหมายงาน

## Troubleshooting

### Frontend ไม่เชื่อมต่อกับ Backend
- ตรวจสอบว่า backend รันอยู่ที่ `http://localhost:3000`
- ตรวจสอบไฟล์ `.env.local` ว่าตั้งค่าถูกต้อง
- ตรวจสอบ console ใน browser สำหรับ error messages

### WebSocket ไม่เชื่อมต่อ
- ตรวจสอบว่า backend รองรับ WebSocket
- ตรวจสอบ `NEXT_PUBLIC_WS_URL` ใน `.env.local`
- ตรวจสอบว่า token authentication ถูกต้อง

### Port ถูกใช้แล้ว
- Next.js จะใช้พอร์ตถัดไปอัตโนมัติ
- ดู terminal สำหรับพอร์ตที่ใช้จริง

## Build สำหรับ Production

```bash
npm run build
npm start
```

