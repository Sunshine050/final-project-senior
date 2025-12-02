# ข้อมูลฐานข้อมูลและวิธีการรันระบบ

## ฐานข้อมูลที่ใช้

**MongoDB Version 7.0**

- **ประเภท**: NoSQL Document Database
- **เวอร์ชัน**: MongoDB 7.0
- **การจัดการ**: ใช้ Docker Container
- **Port**: 27017
- **Database Name**: emergency-care

## สถาปัตยกรรมระบบ

```
┌─────────────────┐
│   Frontend      │  Next.js (Port 3001)
│   (Web Dashboard)│
└────────┬────────┘
         │ HTTP/WebSocket
         │
┌────────▼────────┐
│   Backend API   │  NestJS (Port 3000)
│   (REST + WS)   │
└────────┬────────┘
         │ MongoDB Connection
         │
┌────────▼────────┐
│    MongoDB      │  Docker Container (Port 27017)
│   (Database)    │
└─────────────────┘
```

## Collections ในฐานข้อมูล

1. **users** - ข้อมูลผู้ใช้ (User accounts)
2. **organizations** - ข้อมูลองค์กร (Hospitals, Rescue Teams)
3. **emergency-requests** - คำขอความช่วยเหลือ (SOS requests)
4. **emergency-responses** - การตอบสนองต่อเหตุฉุกเฉิน
5. **notifications** - การแจ้งเตือน

## วิธีการรันระบบ

### วิธีที่ 1: รันด้วย Docker (แนะนำสำหรับ Demo)

#### ขั้นตอนที่ 1: รัน MongoDB ด้วย Docker

```bash
cd backend
docker-compose -f docker-compose.dev.yml up -d
```

ตรวจสอบว่า MongoDB รันอยู่:
```bash
docker ps
```

ควรเห็น container ชื่อ `emergency-mongodb-dev` รันอยู่

#### ขั้นตอนที่ 2: ตั้งค่า Backend

```bash
cd backend
npm install
```

สร้างไฟล์ `.env` ในโฟลเดอร์ `backend`:
```env
MONGODB_URI=mongodb://localhost:27017/emergency-care
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

#### ขั้นตอนที่ 3: รัน Backend

```bash
npm run start:dev
```

Backend จะรันที่ `http://localhost:3000`

#### ขั้นตอนที่ 4: รัน Frontend

เปิด Terminal ใหม่:
```bash
cd frontend
npm install
npm run dev
```

Frontend จะรันที่ `http://localhost:3001`

### วิธีที่ 2: รันทั้งหมดด้วย Docker (Production-like)

```bash
cd backend
docker-compose up -d
```

ระบบจะรัน:
- MongoDB: `localhost:27017`
- Backend API: `http://localhost:3000`

จากนั้นรัน Frontend แยก:
```bash
cd frontend
npm run dev
```

## การตรวจสอบฐานข้อมูล

### ดูข้อมูลใน MongoDB

#### วิธีที่ 1: ใช้ MongoDB Compass (GUI)
1. ดาวน์โหลด MongoDB Compass จาก https://www.mongodb.com/try/download/compass
2. เชื่อมต่อที่: `mongodb://localhost:27017`
3. เลือก database: `emergency-care`

#### วิธีที่ 2: ใช้ Docker Exec
```bash
docker exec -it emergency-mongodb-dev mongosh
```

จากนั้น:
```javascript
use emergency-care
show collections
db.users.find()
db['emergency-requests'].find()
```

#### วิธีที่ 3: ใช้ MongoDB Shell (mongosh)
```bash
mongosh mongodb://localhost:27017/emergency-care
```

## การ Seed ข้อมูลเริ่มต้น (ถ้ามี)

```bash
cd backend
npm run seed
```

## การหยุดระบบ

### หยุด MongoDB Container
```bash
docker-compose -f docker-compose.dev.yml down
```

### หยุดทั้งหมด (ถ้ารันด้วย docker-compose)
```bash
docker-compose down
```

## ข้อมูลสำหรับอาจารย์

### คำตอบสำหรับคำถาม "ใช้อะไรเป็นฐานข้อมูล?"

**คำตอบ:**
- ใช้ **MongoDB Version 7.0** เป็นฐานข้อมูล
- เป็น NoSQL Document Database ที่เหมาะกับข้อมูลแบบ unstructured และ real-time applications
- ใช้ Docker Container เพื่อความสะดวกในการ deploy และจัดการ

### จุดเด่นของการใช้ MongoDB

1. **Schema-less**: ยืดหยุ่นในการเก็บข้อมูล
2. **Real-time**: รองรับ WebSocket และ real-time updates ได้ดี
3. **Scalability**: ขยายตัวได้ง่าย
4. **Geospatial**: รองรับการค้นหาตามตำแหน่ง (location-based queries)

### วิธีการ Demo ให้อาจารย์ดู

1. **แสดง MongoDB Container**
   ```bash
   docker ps
   ```

2. **แสดงข้อมูลในฐานข้อมูล**
   - ใช้ MongoDB Compass หรือ mongosh
   - แสดง collections และ documents

3. **แสดงการทำงานของระบบ**
   - ส่ง SOS จากแอปมือถือ
   - ดูข้อมูลใน Dashboard
   - แสดงว่า data ถูกบันทึกใน MongoDB

4. **แสดง API Documentation**
   - เปิด `http://localhost:3000/api` (Swagger UI)

## Troubleshooting

### MongoDB ไม่เชื่อมต่อ
```bash
# ตรวจสอบว่า container รันอยู่
docker ps

# ตรวจสอบ logs
docker logs emergency-mongodb-dev

# รันใหม่
docker-compose -f docker-compose.dev.yml restart
```

### Port 27017 ถูกใช้แล้ว
แก้ไขใน `docker-compose.dev.yml`:
```yaml
ports:
  - "27018:27017"  # เปลี่ยนเป็น 27018
```

และแก้ไข `MONGODB_URI` ใน `.env`:
```env
MONGODB_URI=mongodb://localhost:27018/emergency-care
```

