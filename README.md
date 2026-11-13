# NAVySHOP — Next.js Edition

ระบบร้านค้า / เติมแต้ม / แลกรางวัล ย้ายจาก PHP เดิมมาเป็น **Next.js 16 + Prisma + Auth.js**

พร้อม Deploy บน **Vercel**

---

## ฟีเจอร์

### ผู้ใช้
- สมัคร / เข้าสู่ระบบ (Auth.js Credentials + bcrypt)
- หน้าหลัก (กิจกรรม + อัปเดต)
- ร้านค้า (ซื้อด้วยแต้ม)
- แลกรางวัล
- ใช้โค้ดรับแต้ม
- หน้าเติมเงิน (UI)

### แอดมิน (`role = actor`)
- Dashboard
- จัดการสินค้า (เพิ่ม / ลบ)
- โครงสร้างรองรับ รางวัล, โค้ด, ผู้ใช้, ตั้งค่า (ขยายต่อได้)

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | Tailwind CSS 4 + lucide-react |
| Auth | Auth.js (next-auth v5) |
| ORM | Prisma |
| DB | PostgreSQL (แนะนำ Neon / Vercel Postgres) |
| Deploy | Vercel |

---

## เริ่มต้นใช้งาน

### 1. ติดตั้ง

```bash
cd navy-shop
npm install --legacy-peer-deps
```

### 2. ตั้งค่า Environment

คัดลอก `.env.example` เป็น `.env` แล้วใส่ค่า:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="สุ่มด้วย openssl rand -base64 32"
```

### 3. สร้างฐานข้อมูล

```bash
npx prisma db push
npm run db:seed
```

### 4. รัน dev

```bash
npm run dev
```

เปิด http://localhost:3000

---

## บัญชีทดสอบ (หลัง seed)

| Username | Password | Role |
|----------|----------|------|
| navydesign | navydesignpage | แอดมิน (actor) |
| navy12 | navy12 | ผู้ใช้ทั่วไป |

โค้ดทดสอบ: `WELCOME100` (100 แต้ม), `NAVY500` (500 แต้ม)

---

## Deploy บน Vercel

1. Push โปรเจกต์ขึ้น GitHub
2. Import โปรเจกต์ใน [vercel.com](https://vercel.com)
3. เพิ่ม Environment Variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
4. เชื่อม Neon / Vercel Postgres แล้วรัน `prisma db push` + seed (ผ่าน Vercel CLI หรือ Prisma Data Platform)
5. Deploy

**หมายเหตุ:** ใช้ `--legacy-peer-deps` เพราะ next-auth beta ยังไม่ประกาศรองรับ Next 16 อย่างเป็นทางการ (ใช้งานได้ปกติ)

---

## โครงสร้างหลัก

```
src/
├── app/
│   ├── login, register
│   ├── home, shop, trade, usecode, pay
│   ├── admin/ (+ products)
│   └── api/ (auth, buy, redeem, admin, register)
├── components/ (Navbar, ProductCard, RewardCard, Providers)
└── lib/ (auth, prisma, utils)
prisma/
├── schema.prisma
└── seed.ts
```

---

ต้นฉบับแนวคิดจาก **NAVyDESIGn** (PHP)  
พัฒนาใหม่ด้วย Next.js โดย Grok
