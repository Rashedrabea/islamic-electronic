// تهيئة التطبيق
function initApp() {
  loadData();
  loadCustomDhikrs();
  initAudio();
  requestNotificationPermission();
  updatePrayerTimes();

  updateDailyStats();

  // التأكد من تطبيق الوضع الليلي بشكل صحيح
  initDarkMode();

  // تحميل الخلفية المحفوظة
  loadSavedBackground();

  // تهيئة قسم الأذكار
  displayAzkar("morning");

  // تحديث مواقيت الصلاة كل دقيقة
  setInterval(updatePrayerTimes, 60000);

  // فحص مواقيت الصلاة للإشعارات كل دقيقة
  setInterval(checkPrayerTimes, 60000);

  // تحديث الإحصائيات كل ساعة
  setInterval(updateDailyStats, 3600000);
}