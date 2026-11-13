import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("navydesignpage", 10);

  await prisma.user.upsert({
    where: { username: "navydesign" },
    update: {},
    create: {
      username: "navydesign",
      password,
      email: "navydesign@navydesign.com",
      role: "actor",
      payPoint: 6000,
      rewardPoint: 6000,
      level: 99,
      userExp: 89999,
      maxExp: 99999,
    },
  });

  await prisma.user.upsert({
    where: { username: "navy12" },
    update: {},
    create: {
      username: "navy12",
      password: await hash("navy12", 10),
      email: "navydesignuser@navydesign.com",
      role: "guest",
    },
  });

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    await prisma.product.create({
      data: {
        name: "NAVyDESIGN",
        type: "Super Rare",
        className: "Example",
        detail: "ตัวอย่างการแสดงผล NAVyDESIGN",
        price: 1,
        image: "unproduct.jpg",
        stock: 100,
      },
    });
  }

  const rewardCount = await prisma.reward.count();
  if (rewardCount === 0) {
    await prisma.reward.create({
      data: {
        name: "NAVyDESIGN Reward",
        type: "Super Rare",
        detail: "ตัวอย่างรางวัล NAVyDESIGN",
        price: 1,
        image: "unreward.jpg",
        stock: 100,
      },
    });
  }

  const codeCount = await prisma.redeemCode.count();
  if (codeCount === 0) {
    await prisma.redeemCode.create({
      data: { code: "WELCOME100", points: 100 },
    });
    await prisma.redeemCode.create({
      data: { code: "NAVY500", points: 500 },
    });
  }

  const eventCount = await prisma.eventPost.count();
  if (eventCount === 0) {
    await prisma.eventPost.create({
      data: {
        title: "ยินดีต้อนรับสู่ NAVySHOP",
        detail: "ระบบร้านค้าและแลกรางวัลเวอร์ชัน Next.js\nพัฒนาใหม่จากต้นฉบับ NAVyDESIGn",
        image: "unimg.jpg",
      },
    });
  }

  const updateCount = await prisma.updatePost.count();
  if (updateCount === 0) {
    await prisma.updatePost.create({
      data: {
        title: "อัปเดตระบบ",
        detail: "ย้ายจาก PHP มาเป็น Next.js + Prisma เรียบร้อย",
        image: "unimg.jpg",
      },
    });
  }

  const setting = await prisma.webSetting.findFirst();
  if (!setting) {
    await prisma.webSetting.create({
      data: {
        webName: "NAVySHOP",
        webStatus: "เปิดให้บริการ",
        version: "2.0.0 (Next.js)",
        ip: "127.0.0.1",
        fbPage: "nanydesignpage",
        textRun: "ยินดีต้อนรับสู่ NAVySHOP — ระบบใหม่บน Next.js",
        videoLink: "sbrAduXXiBE",
        webLogo: "logo.png",
        backgroundImg: "background.jpg",
        slide1: "slide1.jpg",
        slide2: "slide2.jpg",
        slide3: "slide3.jpg",
        installGameLink: "",
      },
    });
  }

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
