@echo off
chcp 65001 >nul
title لوحة التحكم - المسبحة الإلكترونية
color 0B

echo.
echo ========================================
echo      لوحة التحكم - المسبحة الإلكترونية
echo ========================================
echo.
echo 🛠️ جاري فتح لوحة التحكم...
echo.
echo 🔐 بيانات تسجيل الدخول:
echo    👤 المدير: admin / 123456
echo    👤 المستخدم: user / 123456
echo.

start "" "admin.html"

echo ✅ تم فتح لوحة التحكم في المتصفح!
echo.
echo 📝 الروابط المتاحة:
echo    🏠 التطبيق الرئيسي: index.html
echo    ⚙️ لوحة التحكم: admin.html
echo    🧪 صفحة الاختبار: اختبار_شامل.html
echo.
echo 🔄 اضغط أي مفتاح للخروج...
pause >nul