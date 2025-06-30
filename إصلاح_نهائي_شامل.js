// إصلاح صوت التسبيح النهائي

// إنشاء الصوت فوراً
let tasbihSound;
try {
    tasbihSound = new Audio('sounds/click.mp3');
    tasbihSound.volume = 0.7;
    tasbihSound.preload = 'auto';
} catch (e) {}

// دالة تشغيل الصوت المحسنة
function playTasbihClick() {
    try {
        if (tasbihSound) {
            tasbihSound.currentTime = 0;
            tasbihSound.play().catch(() => {});
        }
    } catch (e) {}
}

// تطبيق الصوت على جميع الوظائف
document.addEventListener('DOMContentLoaded', function() {
    // إصلاح الصوت في العداد الرئيسي
    const originalIncrement = window.increment;
    if (originalIncrement) {
        window.increment = function() {
            originalIncrement();
            playTasbihClick();
        };
    }
    
    // إصلاح الصوت في وضع التركيز
    const originalFocusIncrement = window.focusIncrement;
    if (originalFocusIncrement) {
        window.focusIncrement = function() {
            originalFocusIncrement();
            playTasbihClick();
        };
    }
});

// تصدير الدالة للاستخدام العام
window.playTasbihClick = playTasbihClick;
window.tasbihSound = tasbihSound;

console.log('✅ تم إصلاح صوت التسبيح نهائياً');