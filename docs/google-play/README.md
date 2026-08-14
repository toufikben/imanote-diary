# حزمة نشر Imanote على Google Play

هذه الملفات تجهّز المعلومات التي يمكن إدخالها في **Google Play Console** قبل إرسال إصدار Android. التطبيق المنشور يحمل الاسم الظاهر **Private Diary**، ومعرّف الحزمة الدائم هو `com.app.imanotediary`.

> لا تتضمن هذه الحزمة أي مزامنة سحابية أو حسابات أو نسخ صوتي إلى نص أو موقع جغرافي أو معالجة خارجية. يظل المحتوى داخل الجهاز، ولا تتغير إجابة سلامة البيانات إلا بعد مراجعة التطبيق النهائي ومكتباته.

| الملف | الغرض |
|---|---|
| `listing-ar.md` | نصوص قائمة المتجر العربية. |
| `listing-en.md` | نصوص القائمة الإنجليزية. |
| `listing-fr.md` | نصوص القائمة الفرنسية. |
| `privacy-policy.md` | نص سياسة خصوصية جاهز للاستضافة على رابط HTTPS عام وإتاحته من داخل التطبيق. |
| `data-safety.md` | ورقة إجابات أولية لنموذج سلامة البيانات في Play Console. |
| `release-checklist.md` | قائمة التنفيذ قبل الرفع ثم المراجعة والنشر. |
| `assets.md` | قائمة الأصول المرئية المطلوبة وبدائلها المتاحة. |

## ما يلزم من مالك الحساب قبل الإرسال

أضف بريد دعم يعمل، واستضف `privacy-policy.md` على رابط HTTPS عام ثابت، ثم ضع الرابط نفسه في إعدادات التطبيق وقائمة المتجر. لا تستخدم مستودع GitHub خاصاً كرابط للسياسة لأنه لا يكون متاحاً لمستخدم المتجر. تحقّق أيضاً من أن نسخة AAB النهائية لا تضيف مكتبة تحليل أو إعلان أو شبكة غير موثقة؛ هذه المراجعة ضرورية لأن Google يحمل المطوّر مسؤولية دقة الإفصاح [1].

## المراجع الرسمية

[1] [Google Play: إعداد تطبيق وإدارة حزم Android](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en)

[2] [Google Play: قسم سلامة البيانات](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en-GB)

[3] [Google Play: أصول المعاينة ومتطلبات قائمة المتجر](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)

[4] [Google Play: أفضل ممارسات قائمة المتجر](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en-GB)
