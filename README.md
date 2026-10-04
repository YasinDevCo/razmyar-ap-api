# 🥋 رزمیار (Razmyar API Service)

> **سرویس بک‌اند و RESTful API پلتفرم مدیریت آکادمی‌ها و ورزش‌های رزمی**  
> توسعه‌یافته با **Node.js + Express + TypeScript + Prisma ORM**

---

## 📋 ویژگی‌های اصلی بک‌اند

- **معماری لایه‌ای استاندارد:** کنترلرها (Controllers)، سرویس‌ها (Services)، مخازن داده (Repositories) و میان‌افزارها (Middlewares).
- **احراز هویت و دسترسی سطحی (RBAC):** توکن امنیتی JWT، کوکی‌های محافظت‌شده و نقش‌های `SUPER_ADMIN`، `TEAM_ADMIN` و `USER`.
- **موتور هوش تحلیلی مربیگری (Coaching Intelligence):** الگوریتم تحلیل نقاط قوت، ضعف، اولویت‌های ۳ مرحله‌ای تمرین و درصد آمادگی آزمون کمربند.
- **مدیریت مسابقات و جداول حذفی (Bracket System):** ثبت شرکت‌کنندگان، ثبت نمرات راندها و صعود خودکار برنده به مسابقه بعدی.
- **سیستم ارتقای کمربند (Progression Roadmap):** الزامات فنی، حداقل نمرات و سوابق ترفیع کمربندها.
- **امنیت سخت‌گیرانه:** فیلتر CORS دامنه‌های مجاز، محافظت از هدرها، اعتبارسنجی ورودی‌ها با Zod و هش کلمات عبور با Bcrypt.

---

## ⚙️ متغیرهای محیطی (Environment Variables)

یک فایل به نام `.env` در ریشه این پوشه بسازید (می‌توانید از روی `.env.example` کپی کنید):

```env
PORT=5000
NODE_ENV=production

# آدرس دیتابیس ابری (مثلاً در Neon.tech یا Supabase):
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-xxxx.pooler.region.neon.tech/neondb?sslmode=require"

# کلید محرمانه JWT (در محیط پروداکشن حتماً رشته‌ای طولانی و امن قرار دهید):
JWT_SECRET="your_super_secret_jwt_key_here_change_in_production"
JWT_EXPIRES_IN="10m"

# دامنه‌های مجاز فرانت‌اند برای CORS (با کاما جدا کنید):
CORS_ORIGIN="https://your-frontend.vercel.app,http://localhost:3000"
```

---

## 🚀 راهنمای نصب و اجرای محلی (Local Development)

### ۱. نصب وابستگی‌ها
```bash
npm install
```

### ۲. ساخت جداول در دیتابیس
```bash
npx prisma generate
npx prisma db push
```

### ۳. تزریق داده‌های نمونه و شاگردان پیش‌فرض (Seed)
```bash
npm run prisma:seed
```

### ۴. اجرای سرور
```bash
# حالت توسعه با ریلود آنی
npm run dev

# یا ساخت بیلد پروداکشن و اجرا
npm run build
npm run start
```

### ۵. اجرای تست‌های خودکار
```bash
npm test
```

---

## 🌐 استقرار روی سرورهای ابری رایگان (Cloud Deployment - Render)

1. در [Render.com](https://render.com) یک **Web Service** بسازید و به این ریپازیتوری متصل کنید.
2. تنظیمات را به شکل زیر اعمال نمایید:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm run start`
3. متغیرهای محیطی (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`) را در داشبورد Render در بخش **Environment Variables** وارد کنید.
4. سرور به صورت خودکار بیلد شده و در چند دقیقه در دسترس قرار می‌گیرد.
