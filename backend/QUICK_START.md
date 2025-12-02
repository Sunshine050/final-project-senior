# Quick Start Guide - รันระบบอย่างรวดเร็ว

## สำหรับ Demo หรือ Presentation

### ขั้นตอนที่ 1: รัน MongoDB (30 วินาที)

```bash
cd backend
docker-compose -f docker-compose.dev.yml up -d
```

ตรวจสอบ:

```bash
docker ps
# ควรเห็น emergency-mongodb-dev
```

### ขั้นตอนที่ 2: ตั้งค่า Backend (ถ้ายังไม่มี .env)

สร้างไฟล์ `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/emergency-care
JWT_SECRET=demo-secret-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

### ขั้นตอนที่ 3: รัน Backend

```bash
cd backend
npm install  # ถ้ายังไม่ได้ติดตั้ง
npm run start:dev
```

รอจนเห็น: `Application is running on: http://localhost:3000`

### ขั้นตอนที่ 4: รัน Frontend (Terminal ใหม่)

```bash
cd frontend
npm install  # ถ้ายังไม่ได้ติดตั้ง
npm run dev
```

รอจนเห็น: `Ready - started server on 0.0.0.0:3001`

### ขั้นตอนที่ 5: เปิด Browser

- Frontend: http://localhost:3001
- Backend API Docs: http://localhost:3000/api

## ตรวจสอบฐานข้อมูล

### ดูข้อมูลใน MongoDB

```bash
docker exec -it emergency-mongodb-dev mongosh emergency-care

# แสดง collections
show collections

# แสดงข้อมูล
db['emergency-requests'].find().pretty()
db.users.find().pretty()
```

## หยุดระบบ

```bash
# หยุด MongoDB
docker-compose -f docker-compose.dev.yml down

# หยุด Backend/Frontend: กด Ctrl+C ใน terminal
```

## Troubleshooting

### MongoDB ไม่รัน

```bash
docker-compose -f docker-compose.dev.yml restart
```

### Port ถูกใช้

- Backend: เปลี่ยน PORT ใน .env
- MongoDB: เปลี่ยน port ใน docker-compose.dev.yml

### ต้องการลบข้อมูลทั้งหมด

```bash
docker-compose -f docker-compose.dev.yml down -v
```
