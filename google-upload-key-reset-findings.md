# Google Play upload-key reset findings

Source: https://support.google.com/googleplay/android-developer/answer/9842756?hl=en#zippy=%2Crequest-an-upload-key-reset

Google distinguishes the upload key (held by the developer, stored in a Java keystore) from the app signing key (held by Google Play when Play App Signing is enabled). If the upload key is lost or compromised, Google says the upload key can be reset without changing the app signing key.

Official steps shown on the page:
1. Create a new upload key in Android Studio.
2. Export the certificate to PEM format, using a command equivalent to: keytool -export -rfc -keystore upload-keystore.jks -alias upload -file upload_certificate.pem
3. Submit the reset request in Play Console.
4. Navigate to Protected with Play > Play Store protection > Manage Play app signing.
5. In Upload key certificate, select Request upload key reset.
6. Enter the reset reason.
7. Upload upload_certificate.pem and click Request.

The page states Play App Signing configuration requires the account owner. The new keystore must be kept secure; the upload key is separate from the Google-held app signing key.

Captured 2026-08-20.
وتطبيق Private Diary يجب أن يستخدم package com.app.imanotediary كما هو منشور، ولا ينبغي إنشاء تطبيق جديد أو تغيير app signing key.
