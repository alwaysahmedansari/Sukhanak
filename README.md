# سُخنک

اردو تحریروں کا پلیٹ فارم (میڈیم طرز)۔

## اسٹیک
- Next.js (App Router) اور React
- Firebase: Authentication، Firestore، Storage
- ہوسٹنگ: Vercel

## ضروریات
- Node.js 22 یا اس سے نیا (Firebase Admin SDK کی شرط)

## چلانے کا طریقہ
```bash
npm install
cp .env.example .env.local   # پھر اپنی کیز بھریں
npm run dev
```
پھر کھولیں: http://localhost:3000

## فولڈر
- `prototype/` : ابتدائی ڈیمو (ایک فائل)، صرف حوالے کے لیے
- `app/` : صفحات اور لے آؤٹ
- آنے والی کھیپوں میں: `components/`، `lib/`، `firestore.rules` وغیرہ

## حفاظت
`.env.local` اور سروس اکاؤنٹ کی JSON فائل کبھی گٹ میں نہ ڈالیں۔ `.gitignore` انہیں روکتی ہے، مگر پھر بھی ہر کمٹ سے پہلے دیکھ لیں۔

## پیش رفت
- [x] کھیپ ۱: بنیاد
- [ ] کھیپ ۲: ڈیٹا اور اصول
- [ ] کھیپ ۳: کنکشن اور گارڈ
- [ ] کھیپ ۴: لاگ اِن
