// إصلاح الصوت النهائي - مفعل افتراضياً

// متغير الصوت العام - مفعل
window.soundEnabled = true;
let mainClickSound;

// إنشاء الصوت فور التحميل
function initSound() {
    try {
        mainClickSound = new Audio('sounds/click.mp3');
        mainClickSound.volume = 1.0;
        mainClickSound.preload = 'auto';
        window.mainClickSound = mainClickSound;
    } catch (e) {
        console.log('لا يمكن تحميل الصوت');
    }
}

// دالة تشغيل الصوت الموحدة - مفعلة دائماً
function playSound() {
    try {
        if (mainClickSound) {
            mainClickSound.currentTime = 0;
            mainClickSound.play().catch(() => {});
        }
    } catch (e) {}
}

// تفعيل/إيقاف الصوت
function toggleSound() {
    window.soundEnabled = !window.soundEnabled;
    const btn = document.getElementById('soundToggle');
    if (btn) {
        btn.textContent = window.soundEnabled ? '🔊' : '🔇';
        btn.title = window.soundEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت';
    }
    
    // تشغيل صوت تجريبي عند التفعيل
    if (window.soundEnabled) {
        playSound();
    }
}

// تشغيل فوري للصوت
initSound();

// ربط الصوت بجميع الوظائف
document.addEventListener('DOMContentLoaded', function() {
    // إضافة زر الصوت
    setTimeout(() => {
        if (!document.getElementById('soundToggle')) {
            const controls = document.querySelector('.controls');
            if (controls) {
                const soundBtn = document.createElement('button');
                soundBtn.id = 'soundToggle';
                soundBtn.className = 'control-btn';
                soundBtn.textContent = '🔊';
                soundBtn.title = 'إيقاف الصوت';
                soundBtn.onclick = toggleSound;
                controls.appendChild(soundBtn);
            }
        }
    }, 500);
    
    // ربط الصوت بالعداد الرئيسي
    setTimeout(() => {
        const originalIncrement = window.increment;
        if (originalIncrement) {
            window.increment = function() {
                playSound();
                originalIncrement();
            };
        }
        
        // ربط الصوت بوضع التركيز
        const originalFocusIncrement = window.focusIncrement;
        if (originalFocusIncrement) {
            window.focusIncrement = function() {
                playSound();
                originalFocusIncrement();
            };
        }
    }, 1000);
});

// تصدير الدوال للاستخدام العام
window.playSound = playSound;
window.toggleSound = toggleSound;

console.log('✅ تم تحميل نظام الصوت النهائي - مفعل');