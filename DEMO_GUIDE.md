# คู่มือการ Demo ระบบให้อาจารย์ดู

## สิ่งที่ต้องเตรียม

1. ✅ Docker Desktop ติดตั้งและรันอยู่
2. ✅ Node.js และ npm ติดตั้งแล้ว
3. ✅ โปรเจกต์พร้อมใช้งาน

## ขั้นตอนการ Demo (5 นาที)

### 1. เริ่มต้นระบบ (1 นาที)

เปิด Terminal/PowerShell:

```bash
# ขั้นตอนที่ 1: รัน MongoDB
cd backend
docker-compose -f docker-compose.dev.yml up -d

# ขั้นตอนที่ 2: รัน Backend (Terminal 1)
cd backend
npm run start:dev

# ขั้นตอนที่ 3: รัน Frontend (Terminal 2 - เปิดใหม่)
cd frontend
npm run dev
```

### 2. แสดงฐานข้อมูล (1 นาที)

**คำถามที่อาจารย์อาจถาม: "ใช้อะไรเป็นฐานข้อมูล?"**

**คำตอบ:**
> "ใช้ **MongoDB Version 7.0** เป็นฐานข้อมูล NoSQL ครับ/ค่ะ รันใน Docker Container เพื่อความสะดวกในการจัดการ"

**แสดงให้ดู:**
```bash
# แสดง Docker containers
docker ps

# ควรเห็น emergency-mongodb-dev รันอยู่
```

**อธิบายเพิ่มเติม:**
- ใช้ MongoDB เพราะเหมาะกับ real-time applications
- รองรับ geospatial queries สำหรับค้นหาโรงพยาบาลใกล้เคียง
- Schema-less ทำให้ยืดหยุ่นในการเก็บข้อมูล

### 3. แสดงการทำงานของระบบ (2 นาที)

#### 3.1 แสดง Dashboard
- เปิด browser: `http://localhost:3001`
- Login เข้าระบบ
- แสดงหน้า Dashboard ที่รับ SOS requests

#### 3.2 ส่ง SOS จากแอปมือถือ
- เปิดแอปมือถือ
- ส่ง SOS request
- **แสดงให้เห็นว่า:**
  - SOS ปรากฏใน Dashboard ทันที (real-time)
  - ข้อมูลถูกบันทึกในฐานข้อมูล

#### 3.3 แสดงข้อมูลในฐานข้อมูล
**วิธีที่ 1: ใช้ MongoDB Compass**
- เปิด MongoDB Compass
- เชื่อมต่อ: `mongodb://localhost:27017`
- แสดง database `emergency-care`
- แสดง collections และ documents

**วิธีที่ 2: ใช้ Terminal**
```bash
docker exec -it emergency-mongodb-dev mongosh emergency-care

# แสดง collections
show collections

# แสดงข้อมูล emergency requests
db['emergency-requests'].find().pretty()

# แสดงข้อมูล users
db.users.find().pretty()
```

### 4. แสดง API Documentation (1 นาที)

เปิด browser: `http://localhost:3000/api`

**อธิบาย:**
- Swagger UI แสดง API endpoints ทั้งหมด
- สามารถทดสอบ API ได้จากที่นี่
- แสดง authentication และ request/response formats

## คำตอบสำหรับคำถามที่อาจถาม

### Q: ทำไมใช้ MongoDB แทน MySQL/PostgreSQL?

**A:** 
- MongoDB เหมาะกับ real-time applications ที่ต้องการความยืดหยุ่น
- รองรับ geospatial queries สำหรับค้นหาตำแหน่ง
- Schema-less ทำให้ปรับโครงสร้างข้อมูลได้ง่าย
- รองรับ WebSocket และ real-time updates ได้ดี

### Q: ข้อมูลเก็บอะไรบ้าง?

**A:**
- **users**: ข้อมูลผู้ใช้ (email, password, role)
- **organizations**: ข้อมูลโรงพยาบาลและหน่วยกู้ภัย
- **emergency-requests**: คำขอความช่วยเหลือ SOS
- **emergency-responses**: การตอบสนองต่อเหตุฉุกเฉิน
- **notifications**: การแจ้งเตือน

### Q: ระบบทำงานยังไง?

**A:**
1. ผู้ใช้ส่ง SOS จากแอปมือถือ
2. Backend รับ request และบันทึกใน MongoDB
3. WebSocket ส่งข้อมูล real-time ไปยัง Dashboard
4. Dispatcher ดูข้อมูลและมอบหมายงาน
5. หน่วยกู้ภัย/โรงพยาบาลรับงานและอัพเดทสถานะ

### Q: ทำไมใช้ Docker?

**A:**
- สะดวกในการ deploy และจัดการ
- แยก environment ชัดเจน
- รันได้ทุกที่ที่มี Docker
- ง่ายต่อการ backup และ restore

## Checklist ก่อน Demo

- [ ] Docker Desktop รันอยู่
- [ ] MongoDB container รันอยู่ (`docker ps`)
- [ ] Backend รันอยู่ที่ `http://localhost:3000`
- [ ] Frontend รันอยู่ที่ `http://localhost:3001`
- [ ] มี account สำหรับ login
- [ ] แอปมือถือพร้อมใช้งาน (ถ้ามี)
- [ ] MongoDB Compass หรือ mongosh พร้อมใช้งาน

## สคริปต์สั้นๆ สำหรับ Demo

```
"สวัสดีครับ/ค่ะ วันนี้จะ demo ระบบ Emergency SOS Management System ครับ/ค่ะ

ระบบนี้ประกอบด้วย 3 ส่วนหลัก:
1. Mobile App - สำหรับผู้ใช้ส่ง SOS
2. Web Dashboard - สำหรับ dispatcher จัดการ SOS
3. Backend API - เชื่อมต่อกับฐานข้อมูล MongoDB

ฐานข้อมูลที่ใช้คือ MongoDB Version 7.0 รันใน Docker Container
ซึ่งเหมาะกับ real-time applications และรองรับ geospatial queries

ให้ผม/ดิฉันแสดงการทำงานของระบบให้ดูนะครับ/ค่ะ..."
```

## Tips สำหรับ Demo

1. **เตรียมข้อมูลตัวอย่างไว้ล่วงหน้า** - สร้าง SOS requests ไว้ก่อน
2. **ทดสอบก่อน** - ตรวจสอบว่าระบบทำงานได้ก่อน demo
3. **เตรียมคำตอบ** - อ่านคำถามที่อาจถามไว้ก่อน
4. **แสดงความมั่นใจ** - แสดงว่ารู้ระบบดี
5. **มี backup plan** - ถ้ามีปัญหา ให้อธิบาย architecture แทน

