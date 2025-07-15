// إصلاح رفع الصور للشعار

// رفع صورة الشعار
function uploadLogo() {
    const fileInput = document.getElementById('logoFileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('⚠️ يرجى اختيار صورة أولاً');
        return;
    }
    
    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
        alert('❌ يرجى اختيار ملف صورة فقط');
        return;
    }
    
    // التحقق من حجم الملف (أقل من 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('❌ حجم الصورة كبير جداً. يرجى اختيار صورة أصغر من 2MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // تطبيق الصورة كشعار
        const bannerEmoji = document.querySelector('.banner-emoji');
        if (bannerEmoji) {
            // إنشاء عنصر صورة
            bannerEmoji.innerHTML = `<img src="${imageData}" style="width: 60px; height: 60px; border-radius: 10px; object-fit: cover;">`;
            
            // حفظ الصورة
            localStorage.setItem('customLogoImage', imageData);
            localStorage.setItem('logoType', 'image');
            
            // تحديث المعاينة
            updateLogoPreview();
            
            alert('✅ تم رفع وتطبيق الشعار بنجاح');
        }
    };
    
    reader.readAsDataURL(file);
}

// تحديث معاينة الشعار
function updateLogoPreview() {
    const logoPreview = document.querySelector('.logo-preview');
    if (logoPreview) {
        const logoType = localStorage.getItem('logoType');
        
        if (logoType === 'image') {
            const imageData = localStorage.getItem('customLogoImage');
            if (imageData) {
                logoPreview.innerHTML = `<img src="${imageData}" style="width: 80px; height: 80px; border-radius: 10px; object-fit: cover; border: 2px solid #ddd;">`;
            }
        } else {
            const textLogo = localStorage.getItem('customLogo') || '📿';
            logoPreview.innerHTML = `<span style="font-size: 60px;">${textLogo}</span>`;
        }
    }
}

// تطبيق الشعار النصي
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
            bannerEmoji.innerHTML = newLogo;
            localStorage.setItem('customLogo', newLogo);
            localStorage.setItem('logoType', 'text');
            
            updateLogoPreview();
            alert('✅ تم تغيير الشعار بنجاح');
        }
    } else {
        alert('⚠️ يرجى إدخال شعار جديد');
    }
}

// استعادة الشعار الافتراضي
function resetLogo() {
    const bannerEmoji = document.querySelector('.banner-emoji');
    if (bannerEmoji) {
        bannerEmoji.innerHTML = '📿';
        
        // مسح البيانات المحفوظة
        localStorage.removeItem('customLogo');
        localStorage.removeItem('customLogoImage');
        localStorage.removeItem('logoType');
        
        // تحديث الحقول
        const logoInput = document.getElementById('logoInput');
        if (logoInput) logoInput.value = '';
        
        const fileInput = document.getElementById('logoFileInput');
        if (fileInput) fileInput.value = '';
        
        updateLogoPreview();
        alert('✅ تم استعادة الشعار الافتراضي');
    }
}

// تحديث إضافة الحقول المفقودة
function addMissingFields() {
    const logoTab = document.getElementById('logo-tab');
    if (logoTab && !document.getElementById('logoInput')) {
        const logoSection = logoTab.querySelector('.control-section');
        if (logoSection) {
            logoSection.innerHTML = `
                <h3>🖼️ تغيير شعار التطبيق</h3>
                
                <div class="control-row">
                    <span class="control-label">الشعار الحالي</span>
                    <div class="logo-preview">
                        <span style="font-size: 60px;">📿</span>
                    </div>
                </div>
                
                <div class="control-row">
                    <span class="control-label">رفع صورة شعار</span>
                    <div class="control-input">
                        <input type="file" id="logoFileInput" accept="image/*" onchange="previewSelectedImage()">
                        <small style="color: #666; display: block; margin-top: 5px;">
                            اختر صورة (PNG, JPG, GIF) - أقل من 2MB
                        </small>
                    </div>
                </div>
                
                <div class="control-row">
                    <span class="control-label">أو شعار نصي/إيموجي</span>
                    <div class="control-input">
                        <input type="text" id="logoInput" placeholder="أدخل شعار جديد (مثل: 🕌)" value="">
                    </div>
                </div>
                
                <div class="control-row">
                    <span class="control-label">تغيير الخلفية</span>
                    <div class="control-input">
                        <input type="url" id="backgroundInput" placeholder="رابط صورة الخلفية" value="">
                    </div>
                </div>
                
                <div class="control-buttons">
                    <button class="control-btn" onclick="uploadLogo()">📤 رفع الصورة</button>
                    <button class="control-btn secondary" onclick="changeLogo()">✏️ تطبيق النص</button>
                    <button class="control-btn secondary" onclick="changeBackground()">🎨 تطبيق الخلفية</button>
                    <button class="control-btn danger" onclick="resetLogo()">🔄 استعادة الافتراضي</button>
                </div>
            `;
            
            // تحديث المعاينة والحقول
            setTimeout(() => {
                updateLogoPreview();
                loadSavedValues();
            }, 100);
        }
    }
}

// معاينة الصورة المختارة
function previewSelectedImage() {
    const fileInput = document.getElementById('logoFileInput');
    const file = fileInput.files[0];
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const logoPreview = document.querySelector('.logo-preview');
            if (logoPreview) {
                logoPreview.innerHTML = `
                    <img src="${e.target.result}" style="width: 80px; height: 80px; border-radius: 10px; object-fit: cover; border: 2px solid #4CAF50;">
                    <div style="font-size: 12px; color: #4CAF50; margin-top: 5px;">معاينة الصورة الجديدة</div>
                `;
            }
        };
        reader.readAsDataURL(file);
    }
}

// تحميل القيم المحفوظة
function loadSavedValues() {
    // تحميل الشعار النصي
    const savedLogo = localStorage.getItem('customLogo');
    const logoInput = document.getElementById('logoInput');
    if (savedLogo && logoInput) {
        logoInput.value = savedLogo;
    }
    
    // تحميل الخلفية
    const savedBg = localStorage.getItem('selectedBackground');
    const backgroundInput = document.getElementById('backgroundInput');
    if (savedBg && backgroundInput) {
        backgroundInput.value = savedBg;
    }
}

// تحميل الشعار المحفوظ عند بدء التطبيق
function loadSavedLogo() {
    const logoType = localStorage.getItem('logoType');
    const bannerEmoji = document.querySelector('.banner-emoji');
    
    if (bannerEmoji) {
        if (logoType === 'image') {
            const imageData = localStorage.getItem('customLogoImage');
            if (imageData) {
                bannerEmoji.innerHTML = `<img src="${imageData}" style="width: 60px; height: 60px; border-radius: 10px; object-fit: cover;">`;
            }
        } else if (logoType === 'text') {
            const textLogo = localStorage.getItem('customLogo');
            if (textLogo) {
                bannerEmoji.innerHTML = textLogo;
            }
        }
    }
}

// تهيئة النظام
function initializeLogoUpload() {
    console.log('📤 تهيئة نظام رفع الصور...');
    
    // تحميل الشعار المحفوظ
    loadSavedLogo();
    
    console.log('✅ تم تهيئة نظام رفع الصور');
}

// تشغيل التهيئة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLogoUpload);
} else {
    initializeLogoUpload();
}

console.log('📤 تم تحميل نظام رفع الصور');