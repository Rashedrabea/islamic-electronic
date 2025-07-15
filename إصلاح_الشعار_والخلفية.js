// إصلاح الشعار والخلفية

// إصلاح 1: تغيير الشعار
function changeLogo() {
    const logoInput = document.getElementById('logoInput');
    if (!logoInput) {
        alert('❌ حقل الشعار غير موجود');
        return;
    }
    
    const newLogo = logoInput.value.trim();
    if (newLogo) {
        const bannerEmoji = document.querySelector('.banner-emoji');
        if (bannerEmoji) {
            bannerEmoji.textContent = newLogo;
            localStorage.setItem('customLogo', newLogo);
            alert('✅ تم تغيير الشعار بنجاح');
            console.log('تم تغيير الشعار إلى:', newLogo);
        } else {
            alert('❌ عنصر الشعار غير موجود في الصفحة');
        }
    } else {
        alert('⚠️ يرجى إدخال شعار جديد');
    }
}

// إصلاح 2: تغيير الخلفية
function changeBackground() {
    const backgroundInput = document.getElementById('backgroundInput');
    if (!backgroundInput) {
        alert('❌ حقل الخلفية غير موجود');
        return;
    }
    
    const bgUrl = backgroundInput.value.trim();
    if (bgUrl) {
        // تطبيق الخلفية فوراً
        document.body.style.setProperty('background-image', `url('${bgUrl}')`, 'important');
        document.body.style.setProperty('background-size', 'cover', 'important');
        document.body.style.setProperty('background-position', 'center', 'important');
        document.body.style.setProperty('background-attachment', 'fixed', 'important');
        
        // حفظ الخلفية
        localStorage.setItem('selectedBackground', bgUrl);
        
        alert('✅ تم تغيير الخلفية بنجاح');
        console.log('تم تغيير الخلفية إلى:', bgUrl);
    } else {
        alert('⚠️ يرجى إدخال رابط الخلفية');
    }
}

// إصلاح 3: إضافة الحقول المفقودة في لوحة التحكم
function addMissingFields() {
    // البحث عن تبويب إدارة الشعار
    const logoTab = document.getElementById('logo-tab');
    if (logoTab && !document.getElementById('logoInput')) {
        // إضافة حقول الشعار والخلفية
        const logoSection = logoTab.querySelector('.control-section');
        if (logoSection) {
            logoSection.innerHTML = `
                <h3>🖼️ تغيير شعار التطبيق</h3>
                <div class="control-row">
                    <span class="control-label">الشعار الحالي</span>
                    <div class="logo-preview">
                        <span style="font-size: 60px;">${localStorage.getItem('customLogo') || '📿'}</span>
                    </div>
                </div>
                <div class="control-row">
                    <span class="control-label">شعار جديد</span>
                    <div class="control-input">
                        <input type="text" id="logoInput" placeholder="أدخل شعار جديد (مثل: 🕌)" value="${localStorage.getItem('customLogo') || ''}">
                    </div>
                </div>
                <div class="control-row">
                    <span class="control-label">تغيير الخلفية</span>
                    <div class="control-input">
                        <input type="url" id="backgroundInput" placeholder="رابط صورة الخلفية" value="${localStorage.getItem('selectedBackground') || ''}">
                    </div>
                </div>
                <div class="control-buttons">
                    <button class="control-btn" onclick="changeLogo()">✅ تطبيق الشعار</button>
                    <button class="control-btn secondary" onclick="changeBackground()">🎨 تطبيق الخلفية</button>
                    <button class="control-btn danger" onclick="resetLogo()">🔄 استعادة الافتراضي</button>
                </div>
            `;
        }
    }
}

// إصلاح 4: استعادة الشعار الافتراضي
function resetLogo() {
    const bannerEmoji = document.querySelector('.banner-emoji');
    if (bannerEmoji) {
        bannerEmoji.textContent = '📿';
        localStorage.removeItem('customLogo');
        
        // تحديث حقل الإدخال
        const logoInput = document.getElementById('logoInput');
        if (logoInput) logoInput.value = '';
        
        alert('✅ تم استعادة الشعار الافتراضي');
    }
}

// إصلاح 5: تحميل الشعار والخلفية المحفوظة عند بدء التطبيق
function loadSavedCustomizations() {
    // تحميل الشعار المحفوظ
    const savedLogo = localStorage.getItem('customLogo');
    if (savedLogo) {
        const bannerEmoji = document.querySelector('.banner-emoji');
        if (bannerEmoji) {
            bannerEmoji.textContent = savedLogo;
            console.log('تم تحميل الشعار المحفوظ:', savedLogo);
        }
    }
    
    // تحميل الخلفية المحفوظة
    const savedBg = localStorage.getItem('selectedBackground');
    if (savedBg) {
        document.body.style.setProperty('background-image', `url('${savedBg}')`, 'important');
        document.body.style.setProperty('background-size', 'cover', 'important');
        document.body.style.setProperty('background-position', 'center', 'important');
        document.body.style.setProperty('background-attachment', 'fixed', 'important');
        console.log('تم تحميل الخلفية المحفوظة:', savedBg);
    }
}

// إصلاح 6: تحديث openControlPanel لإضافة الحقول
function openControlPanel() {
    const overlay = document.getElementById('controlPanelOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        showAdminTab('azkar');
        
        // إضافة الحقول المفقودة
        setTimeout(() => {
            addMissingFields();
            loadCurrentPrayerTimes();
        }, 100);
    }
}

// إصلاح 7: تهيئة النظام
function initializeLogoAndBackground() {
    console.log('🎨 تهيئة نظام الشعار والخلفية...');
    
    // تحميل التخصيصات المحفوظة
    loadSavedCustomizations();
    
    console.log('✅ تم تهيئة نظام الشعار والخلفية');
}

// تشغيل التهيئة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLogoAndBackground);
} else {
    initializeLogoAndBackground();
}

console.log('🖼️ تم تحميل إصلاح الشعار والخلفية');