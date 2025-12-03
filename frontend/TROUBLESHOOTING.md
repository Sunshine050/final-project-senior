# 🔧 Troubleshooting - Error 404 /dashboard/dispatcher

## ✅ ตรวจสอบว่า Frontend รันอยู่

1. ดูที่ Terminal ที่รัน `npm run dev`
2. ควรเห็น:
   ```
   ▲ Next.js 14.0.4
   - Local:        http://localhost:3001
   ✓ Ready in X.Xs
   ```

## 🔍 วิธีแก้ Error 404

### 1. Restart Next.js Dev Server

```bash
# หยุด server (Ctrl + C)
# แล้วรันใหม่
cd frontend
npm run dev
```

### 2. ลบ .next และ rebuild

```bash
cd frontend
rm -rf .next
npm run dev
```

### 3. ตรวจสอบว่าเข้าถึง URL ถูกต้อง

- ✅ ถูกต้อง: `http://localhost:3001/dashboard/dispatcher`
- ❌ ผิด: `http://localhost:3000/dashboard/dispatcher` (นี่คือ backend)

### 4. ตรวจสอบ Browser Console

เปิด Browser DevTools (F12) → Console tab
- ดูว่ามี error อะไรไหม
- ดู Network tab ว่า request ไปที่ URL ไหน

### 5. ตรวจสอบว่า Login สำเร็จ

1. ไปที่ `http://localhost:3001/login`
2. ล็อกอินด้วย:
   - Email: `dispatcher@example.com`
   - Password: `password123`
3. หลังจากล็อกอินสำเร็จ จะ redirect ไป `/dashboard/dispatcher` อัตโนมัติ

### 6. ตรวจสอบ localStorage

เปิด Browser DevTools → Application → Local Storage
- ดูว่ามี `access_token` หรือไม่
- ถ้าไม่มี = ยังไม่ได้ล็อกอิน

---

## 🐛 ปัญหาที่พบบ่อย

### ปัญหา: 404 Not Found

**สาเหตุ:**
- เข้าถึง URL ผิด (ไปที่ backend แทน frontend)
- Next.js ยังไม่ได้ compile route
- มี build error

**วิธีแก้:**
1. ตรวจสอบ URL: ต้องเป็น `http://localhost:3001` (ไม่ใช่ 3000)
2. Restart dev server
3. ลบ `.next` และ rebuild

### ปัญหา: Cannot GET /dashboard/dispatcher

**สาเหตุ:**
- Backend ไม่มี route นี้ (ถูกต้อง - route นี้เป็นของ frontend)
- เข้าถึง URL ผิด

**วิธีแก้:**
- ใช้ URL ของ frontend: `http://localhost:3001/dashboard/dispatcher`

---

## 📝 Checklist

- [ ] Backend รันอยู่ที่ port 3000
- [ ] Frontend รันอยู่ที่ port 3001 (หรือ port อื่น)
- [ ] เข้าถึง URL ถูกต้อง (`http://localhost:3001`)
- [ ] ล็อกอินสำเร็จแล้ว
- [ ] มี `access_token` ใน localStorage
- [ ] ไม่มี error ใน Browser Console
- [ ] ไม่มี error ใน Terminal ที่รัน frontend

---

**ถ้ายังไม่ได้ผล:** ลบ `.next` folder และ restart dev server

