# ڈیٹا کا ڈھانچہ (Firestore)

## بنیادی اصول
- **پڑھنا** براؤزر سے ہو سکتا ہے؛ اصول `firestore.rules` میں ہیں۔
- **لکھنا** صرف سرور (Next.js API، Admin SDK) سے ہو گا۔ اس سے لائک وغیرہ کی گنتی محفوظ رہتی ہے، متن سرور پر صاف ہوتا ہے، اور مالک کی جانچ ایک ہی جگہ ہوتی ہے۔ Admin SDK ان اصولوں سے گزرتا ہی نہیں، اس لیے اصولوں میں ہر لکھائی بند ہے۔
- **تصاویر** اس سے الگ ہیں: وہ براؤزر سے براہِ راست Storage میں جاتی ہیں (`storage.rules`)۔
- ای میل، فون اور کوئی نجی معلومات `users` میں نہ رکھیں۔ وہ Firebase Auth میں رہتی ہیں، اور `users` سب کے پڑھنے کے لیے کھلی ہے۔
- گنتیاں (`likeCount` وغیرہ) سرور میں `FieldValue.increment` کے ساتھ، اسی ٹرانزیکشن میں بدلیں جس میں لائک/تبصرہ لکھا جائے۔

## کلیکشنز

### `users/{uid}`
| فیلڈ | قسم | تفصیل |
|---|---|---|
| displayName | string | ظاہر ہونے والا نام |
| username | string | چھوٹے حروف، یکتا (نیچے `usernames` دیکھیں) |
| bio | string | ایک سطر کا تعارف، زیادہ سے زیادہ ۱۶۰ حروف |
| photoURL | string / null | پروفائل تصویر |
| role | string | `user`، `editor` یا `admin`۔ اصل اختیار Auth کے custom claim میں ہے؛ یہ فیلڈ صرف دکھانے کے لیے ہے |
| followersCount، followingCount | number | گنتیاں |
| createdAt | timestamp | |

### `usernames/{username}`
صرف یکتائی کے لیے۔ فیلڈز: `uid`، `createdAt`۔ سرور یوزر نیم اور `users` کی تبدیلی ایک ٹرانزیکشن میں کرتا ہے۔ براؤزر کو رسائی نہیں۔

### `posts/{postId}`
| فیلڈ | قسم | تفصیل |
|---|---|---|
| authorId | string | مصنف کا uid |
| authorName، authorUsername، authorPhotoURL | string | فیڈ تیزی سے دکھانے کے لیے نقل |
| title | string | زیادہ سے زیادہ ۱۲۰ حروف |
| subtitle | string | اختیاری، زیادہ سے زیادہ ۱۶۰ |
| body | string | صاف کیا ہوا HTML (نیچے اجازت یافتہ ٹیگ دیکھیں) |
| excerpt | string | فیڈ کے لیے، ذیلی عنوان نہ ہو تو متن سے |
| coverUrl | string / null | کور تصویر |
| coverPath | string / null | Storage میں راستہ (حذف کے لیے) |
| coverCaption | string | تصویر کا عنوان یا ماخذ، اختیاری، زیادہ سے زیادہ ۲۰۰ |
| topic | string | `topics` کا slug |
| status | string | `draft`، `published` یا `removed` |
| readMinutes | number | مطالعے کا وقت |
| likeCount، commentCount | number | گنتیاں |
| featured | boolean | ادارتی انتخاب کے لیے محفوظ |
| createdAt، updatedAt | timestamp | |
| publishedAt | timestamp / null | ڈرافٹ میں `null` |

ڈرافٹ اسی کلیکشن میں `status: "draft"` کے ساتھ رہتے ہیں۔ اصول انہیں صرف مصنف کو دکھاتے ہیں۔

**اجازت یافتہ ٹیگ** (باقی سب سرور ہٹا دیتا ہے): `p`، `div` (صرف `class="sh"`)، `b`، `strong`، `u`، `i`، `em`، `h2`، `blockquote`، `ul`، `ol`، `li`، `br`۔

### `posts/{postId}/comments/{commentId}`
`authorId`، `authorName`، `authorPhotoURL`، `text` (زیادہ سے زیادہ ۱۰۰۰ حروف)، `status` (`visible` یا `removed`)، `createdAt`۔

### `posts/{postId}/likes/{uid}`
دستاویز کا نام ہی صارف کا uid ہے، اس لیے ایک صارف ایک ہی لائک کر سکتا ہے۔ فیلڈ: `createdAt`۔ صرف مالک پڑھ سکتا ہے۔

### `users/{uid}/bookmarks/{postId}`
فیلڈ: `createdAt`۔ صرف مالک پڑھ سکتا ہے۔

### `users/{uid}/following/{authorId}` اور `users/{authorId}/followers/{uid}`
دونوں ایک ساتھ لکھی جاتی ہیں۔ فیلڈ: `createdAt`۔ صرف مالک پڑھ سکتا ہے؛ عوامی طور پر صرف گنتی دکھتی ہے۔

### `topics/{slug}`
فیلڈز: `name`، `order`، `active`۔ سب پڑھ سکتے ہیں۔ ابتدائی فہرست (کنسول میں یا بعد میں سیڈ اسکرپٹ سے):

| slug | name |
|---|---|
| technology | ٹیکنالوجی |
| education | تعلیم |
| literature | ادب |
| society | سماج |

### `reports/{reportId}`
`reporterId`، `targetType` (`post` یا `comment`)، `targetId`، `postId`، `reason`، `note`، `status` (`open`، `reviewed`، `dismissed`)، `createdAt`۔ براؤزر کو کوئی رسائی نہیں؛ صرف سرور اور ایڈمن۔

## سوالات (queries) اور ان کے انڈیکس
| سوال | شرط اور ترتیب |
|---|---|
| ہوم فیڈ | `status == published`، `publishedAt` گھٹتا ہوا |
| موضوع کا فیڈ | `status == published` اور `topic == x`، `publishedAt` گھٹتا ہوا |
| مصنف کی شائع شدہ تحریریں | `authorId == uid` اور `status == published`، `publishedAt` گھٹتا ہوا |
| مصنف کے ڈرافٹ | `authorId == اپنا uid` اور `status == draft`، `updatedAt` گھٹتا ہوا |
| تبصرے | `createdAt` بڑھتا ہوا |

**ضروری:** `posts` کی ہر فہرست والی تلاش میں `status == published` یا `authorId == اپنا uid` کی شرط لازم ہے، ورنہ اصول اسے رد کر دیں گے۔

## ابھی شامل نہیں
- **متن کی تلاش:** Firestore میں بنی ہوئی نہیں۔ بعد میں الگ سروس (Algolia یا Typesense) جوڑی جائے گی۔
- **App Check:** تصویر اپ لوڈ کے غلط استعمال سے بچاؤ کے لیے بعد میں۔
