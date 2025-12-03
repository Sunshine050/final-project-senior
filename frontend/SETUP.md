# 🚀 Setup Instructions

## ขั้นตอนการติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
cd frontend
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` (ถ้ายังไม่มี):

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. รัน Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่: [http://localhost:3001](http://localhost:3001)

**หมายเหตุ:** Next.js จะรันที่ port 3001 โดยอัตโนมัติถ้า port 3000 ถูกใช้แล้ว (backend)

---

## 📋 สิ่งที่สร้างให้แล้ว

### ✅ โครงสร้างพื้นฐาน
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Authentication Context
- Protected Routes

### ✅ หน้า Login
- `/login` - หน้าเข้าสู่ระบบ
- Auto-redirect ตาม role หลัง login

### ✅ Dashboard ตาม Role
- `/dashboard/dispatcher` - สำหรับ Dispatcher (1669)
- `/dashboard/hospital` - สำหรับ Hospital Staff
- `/dashboard/rescue` - สำหรับ Rescue Team
- `/dashboard/admin` - สำหรับ Admin

### ✅ API Integration
- API Client (`lib/api.ts`) เชื่อมต่อกับ backend
- Auto JWT token handling
- Error handling (401 auto-logout)

### ✅ Components
- `ProtectedRoute` - ป้องกัน route ตาม role
- Dashboard Layout - Navigation bar พร้อม user info

---

## 🔧 การใช้งาน

### 1. Login
- เปิด `/login`
- ใช้ email/password ที่สร้างจาก backend (ผ่าน Postman/Swagger)
- ระบบจะ redirect ไป dashboard ตาม role อัตโนมัติ

### 2. Dashboard Features

#### Dispatcher Dashboard
- ดูรายการเคสฉุกเฉินทั้งหมด
- Filter ตาม status และ severity
- (ยังต้องเพิ่ม: Assign emergency, Update status)

#### Hospital Dashboard
- ดูเคสที่กำลังดำเนินการของโรงพยาบาล
- (ยังต้องเพิ่ม: Update bed availability, Case details)

#### Rescue Team Dashboard
- ดูเคสที่ได้รับมอบหมาย
- (ยังต้องเพิ่ม: Update status along mission)

#### Admin Dashboard
- ดูรายการองค์กรทั้งหมด
- (ยังต้องเพิ่ม: Create/Update/Delete organizations)

---

## 🎨 UI/UX

- ใช้ Tailwind CSS สำหรับ styling
- Responsive design (mobile-friendly)
- Color-coded status badges
- Loading states
- Error handling

---

## 📝 TODO / Features ที่ยังต้องเพิ่ม

### High Priority
1. **Emergency Detail View** - เปิดดูรายละเอียดเคส (modal/sidebar)
2. **Assign Emergency** - Dispatcher assign ไป hospital/rescue team
3. **Update Status** - อัปเดตสถานะเคส
4. **Notifications** - หน้า notifications และ real-time updates
5. **WebSocket Integration** - Real-time updates via Socket.IO

### Medium Priority
1. **Hospital Bed Management** - Update bed availability
2. **Organization CRUD** - Admin จัดการ organizations
3. **Search & Pagination** - สำหรับตารางข้อมูล
4. **Filters** - Filter แบบ advanced (date range, location, etc.)

### Low Priority
1. **Charts & Analytics** - Dashboard statistics
2. **Export Reports** - Export ข้อมูลเป็น PDF/Excel
3. **User Profile** - แก้ไข profile
4. **Settings** - ตั้งค่าระบบ

---

## 🐛 Troubleshooting

### ปัญหา: "Cannot connect to API"
- **แก้ไข:** ตรวจสอบว่า backend รันอยู่ที่ `http://localhost:3000`
- ตรวจสอบ `.env.local` ว่ามี `NEXT_PUBLIC_API_URL` ถูกต้อง

### ปัญหา: "401 Unauthorized"
- **แก้ไข:** Login ใหม่ (token อาจหมดอายุ)

### ปัญหา: "Port 3000 already in use"
- **แก้ไข:** Next.js จะใช้ port อื่นอัตโนมัติ (เช่น 3001) หรือแก้ใน `package.json`:
  ```json
  "dev": "next dev -p 3001"
  ```

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

**Happy Coding! 🎉**

