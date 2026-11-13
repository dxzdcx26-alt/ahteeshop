# Deploy NAVySHOP บน Vercel (Import ตรงๆ)

## ขั้นตอนสั้นๆ

### 1) สร้าง Database (ฟรี)

ไปที่ **https://neon.tech** → Sign up → Create Project → คัดลอก `DATABASE_URL`

หรือใช้ **Vercel Storage → Postgres** ตอนสร้างโปรเจกต์ใน Vercel ก็ได้

---

### 2) ขึ้น GitHub

```bash
cd navy-shop
git init
git add .
git commit -m "NAVySHOP Next.js ready for Vercel"
```

สร้าง repo ใหม่บน GitHub แล้ว:

```bash
git remote add origin https://github.com/USERNAME/navy-shop.git
git branch -M main
git push -u origin main
```

---

### 3) Import ใน Vercel

1. เปิด **https://vercel.com/new**
2. เลือก **Import** repo `navy-shop`
3. Framework Preset: **Next.js** (จับให้อัตโนมัติ)
4. ก่อน Deploy กด **Environment Variables** เพิ่ม:

| Name | Value |
|------|--------|
| `DATABASE_URL` | วางจาก Neon |
| `AUTH_SECRET` | สุ่มยาวๆ (ดูด้านล่าง) |
| `AUTH_URL` | ใส่หลังได้ deploy ครั้งแรก หรือใส่ `https://xxx.vercel.app` |

สร้าง `AUTH_SECRET`:
```bash
openssl rand -base64 32
```

5. กด **Deploy**

---

### 4) สร้างตาราง + ข้อมูลเริ่มต้น

หลัง Deploy สำเร็จ รันครั้งเดียว (เครื่องตัวเองหรือ Vercel CLI):

```bash
# ตั้ง DATABASE_URL ชั่วคราวในเครื่อง
export DATABASE_URL="postgresql://..."

npx prisma db push
npm run db:seed
```

หรือใช้ **Neon SQL Editor** / Prisma Data Platform ก็ได้

---

### 5) บัญชีทดสอบ

| Username | Password | บทบาท |
|----------|----------|--------|
| navydesign | navydesignpage | แอดมิน |
| navy12 | navy12 | ผู้ใช้ |

โค้ด: `WELCOME100` / `NAVY500`

---

## หมายเหตุ

- ใช้ `npm install --legacy-peer-deps` ถ้าติด peer dependency ของ next-auth
- หลังได้ URL จริง ใส่ `AUTH_URL=https://your-app.vercel.app` ใน Vercel Env แล้ว Redeploy
- หน้า `/admin` เข้าได้เฉพาะ role `actor`
