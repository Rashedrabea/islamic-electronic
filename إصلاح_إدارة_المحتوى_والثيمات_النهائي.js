// إصلاح شامل لإدارة المحتوى والثيمات والإعدادات المتقدمة

// === إدارة المحتوى ===

// تحديث محتوى التطبيق
function updateAppContent() {
    try {
        const title = document.getElementById('appTitle')?.value?.trim();
        const description = document.getElementById('appDescription')?.value?.trim();
        const welcomeMessage = document.getElementById('welcomeMessage')?.value?.trim();

        // تحديث العنوان في البانر
        if (title) {
            const titleElement = document.querySelector('.banner h1');
            if (titleElement) {
                titleElement.textContent = title;
            }
            // تحديث عنوان الصفحة أيضاً
            document.title = title;
            localStorage.setItem('appTitle', title);
        }

        // تحديث الوصف
        if (description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', description);
            }
            // إضافة الوصف تحت العنوان إذا لم يكن موجوداً
            let descElement = document.querySelector('.banner .app-description');
            if (!descElement) {
                descElement = document.createElement('p');
                descElement.className = 'app-description';
                descElement.style.cssText = 'margin: 10px 0; opacity: 0.9; font-size: 1.1em;';
                document.querySelector('.banner').appendChild(descElement);
            }
            descElement.textContent = description;
            localStorage.setItem('appDescription', description);
        }

        // حفظ وعرض رسالة الترحيب
        if (welcomeMessage) {
            let welcomeElement = document.querySelector('.welcome-message');
            if (!welcomeElement) {
                welcomeElement = document.createElement('div');
                welcomeElement.className = 'welcome-message';
                welcomeElement.style.cssText = 'background: rgba(76,175,80,0.1); padding: 15px; border-radius: 10px; margin: 15px 0; text-align: center; border-right: 4px solid #4CAF50;';
                document.querySelector('.container').insertBefore(welcomeElement, document.querySelector('.section'));
            }
            welcomeElement.textContent = welcomeMessage;
            localStorage.setItem('welcomeMessage', welcomeMessage);
        }

        showSuccessMessage('✅ تم حفظ محتوى التطبيق بنجاح!');
        
    } catch (error) {
        console.error('خطأ في تحديث المحتوى:', error);
        alert('❌ حدث خطأ في تحديث المحتوى');
    }
}

// معاينة المحتوى
function previewContent() {
    try {
        const title = document.getElementById('appTitle')?.value?.trim() || 'المسبحة الإلكترونية';
        const description = document.getElementById('appDescription')?.value?.trim() || 'تطبيق إسلامي شامل';
        const welcomeMessage = document.getElementById('welcomeMessage')?.value?.trim() || 'بسم الله الرحمن الرحيم';

        const previewWindow = window.open('', '_blank', 'width=600,height=400');
        previewWindow.document.write(`
            <html dir="rtl">
            <head>
                <title>معاينة المحتوى</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
                    .preview-card { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                    h1 { color: #4CAF50; text-align: center; margin-bottom: 20px; }
                    .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 8px; }
                    .label { font-weight: bold; color: #333; margin-bottom: 10px; }
                    .content { color: #666; line-height: 1.6; }
                </style>
            </head>
            <body>
                <div class="preview-card">
                    <h1>📝 معاينة محتوى التطبيق</h1>
                    <div class="section">
                        <div class="label">🏷️ عنوان التطبيق:</div>
                        <div class="content">${title}</div>
                    </div>
                    <div class="section">
                        <div class="label">📄 وصف التطبيق:</div>
                        <div class="content">${description}</div>
                    </div>
                    <div class="section">
                        <div class="label">💬 رسالة الترحيب:</div>
                        <div class="content">${welcomeMessage}</div>
                    </div>
                    <div style="text-align: center; margin-top: 30px;">
                        <button onclick="window.close()" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">إغلاق المعاينة</button>
                    </div>
                </div>
            </body>
            </html>
        `);
        previewWindow.document.close();
        
    } catch (error) {
        console.error('خطأ في معاينة المحتوى:', error);
        alert('❌ حدث خطأ في معاينة المحتوى');
    }
}

// === إدارة الألوان والثيمات ===

// تطبيق إعدادات الثيم
function applyThemeSettings() {
    try {
        const primaryColor = document.getElementById('primaryColor')?.value || '#4CAF50';
        const backgroundColor = document.getElementById('backgroundColor')?.value || '#FFFFFF';
        const textColor = document.getElementById('textColor')?.value || '#333333';

        // تطبيق الألوان على CSS Variables
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--background-color', backgroundColor);
        document.documentElement.style.setProperty('--text-color', textColor);

        // تطبيق الألوان على العناصر المحددة
        applyColorsToElements(primaryColor, backgroundColor, textColor);

        // حفظ الثيم
        const themeData = {
            primary: primaryColor,
            background: backgroundColor,
            text: textColor,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('customTheme', JSON.stringify(themeData));

        showSuccessMessage('✨ تم تطبيق الألوان بنجاح!');
        
    } catch (error) {
        console.error('خطأ في تطبيق الثيم:', error);
        alert('❌ حدث خطأ في تطبيق الألوان');
    }
}

// تطبيق الألوان على العناصر
function applyColorsToElements(primary, background, text) {
    try {
        // تطبيق اللون الأساسي على الأزرار
        const buttons = document.querySelectorAll('.btn:not(.reset):not(.secondary)');
        buttons.forEach(btn => {
            btn.style.backgroundColor = primary;
        });

        // تطبيق لون الخلفية على الأقسام
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            if (!document.body.classList.contains('dark-mode')) {
                section.style.backgroundColor = background;
                section.style.color = text;
            }
        });

        // تطبيق لون النص
        document.body.style.color = text;

        // تطبيق الألوان على العدادات
        const counters = document.querySelectorAll('#counter, .stat-number');
        counters.forEach(counter => {
            counter.style.color = primary;
        });

    } catch (error) {
        console.error('خطأ في تطبيق الألوان على العناصر:', error);
    }
}

// إعادة تعيين الثيم
function resetThemeSettings() {
    try {
        // إعادة تعيين قيم الحقول
        if (document.getElementById('primaryColor')) {
            document.getElementById('primaryColor').value = '#4CAF50';
        }
        if (document.getElementById('backgroundColor')) {
            document.getElementById('backgroundColor').value = '#FFFFFF';
        }
        if (document.getElementById('textColor')) {
            document.getElementById('textColor').value = '#333333';
        }

        // إزالة CSS Variables المخصصة
        document.documentElement.style.removeProperty('--primary-color');
        document.documentElement.style.removeProperty('--background-color');
        document.documentElement.style.removeProperty('--text-color');

        // إزالة الأنماط المخصصة
        removeCustomStyles();

        // حذف الثيم المحفوظ
        localStorage.removeItem('customTheme');

        showSuccessMessage('🔄 تم استعادة الألوان الافتراضية!');
        
    } catch (error) {
        console.error('خطأ في إعادة تعيين الثيم:', error);
        alert('❌ حدث خطأ في إعادة تعيين الألوان');
    }
}

// إزالة الأنماط المخصصة
function removeCustomStyles() {
    try {
        // إزالة الأنماط من الأزرار
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.style.removeProperty('background-color');
        });

        // إزالة الأنماط من الأقسام
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.removeProperty('background-color');
            section.style.removeProperty('color');
        });

        // إزالة الأنماط من العدادات
        const counters = document.querySelectorAll('#counter, .stat-number');
        counters.forEach(counter => {
            counter.style.removeProperty('color');
        });

    } catch (error) {
        console.error('خطأ في إزالة الأنماط المخصصة:', error);
    }
}

// === الإعدادات المتقدمة ===

// حفظ الإعدادات المتقدمة
function saveAdvancedSettings() {
    try {
        const arabicFont = document.getElementById('arabicFont')?.value || 'cairo';
        const fontSize = document.getElementById('fontSize')?.value || '16';
        const animationStyle = document.getElementById('animationStyle')?.value || 'fade';

        // تطبيق الفونت
        applyArabicFont(arabicFont);

        // تطبيق حجم الخط
        applyFontSize(fontSize);

        // تطبيق نمط الحركة
        applyAnimationStyle(animationStyle);

        // حفظ الإعدادات
        const advancedSettings = {
            font: arabicFont,
            fontSize: fontSize,
            animation: animationStyle,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('advancedSettings', JSON.stringify(advancedSettings));

        // تحديث عرض حجم الخط
        updateFontSizeDisplay(fontSize);

        showSuccessMessage('⚙️ تم حفظ الإعدادات المتقدمة بنجاح!');
        
    } catch (error) {
        console.error('خطأ في حفظ الإعدادات المتقدمة:', error);
        alert('❌ حدث خطأ في حفظ الإعدادات المتقدمة');
    }
}

// تطبيق الفونت العربي
function applyArabicFont(fontName) {
    try {
        let fontFamily;
        switch(fontName) {
            case 'cairo':
                fontFamily = "'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
                break;
            case 'tajawal':
                fontFamily = "'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
                break;
            case 'amiri':
                fontFamily = "'Amiri', 'Times New Roman', serif";
                break;
            default:
                fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        }

        document.body.style.fontFamily = fontFamily;
        document.documentElement.style.setProperty('--font-family', fontFamily);

        // تحميل الفونت من Google Fonts إذا لم يكن محملاً
        loadGoogleFont(fontName);
        
    } catch (error) {
        console.error('خطأ في تطبيق الفونت:', error);
    }
}

// تحميل فونت من Google Fonts
function loadGoogleFont(fontName) {
    try {
        const existingLink = document.querySelector(`link[data-font="${fontName}"]`);
        if (existingLink) return; // الفونت محمل بالفعل

        let fontUrl;
        switch(fontName) {
            case 'cairo':
                fontUrl = 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap';
                break;
            case 'tajawal':
                fontUrl = 'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap';
                break;
            case 'amiri':
                fontUrl = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap';
                break;
        }

        if (fontUrl) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = fontUrl;
            link.setAttribute('data-font', fontName);
            document.head.appendChild(link);
        }
        
    } catch (error) {
        console.error('خطأ في تحميل الفونت:', error);
    }
}

// تطبيق حجم الخط
function applyFontSize(size) {
    try {
        const fontSize = parseInt(size) || 16;
        document.documentElement.style.setProperty('--font-size-base', fontSize + 'px');
        document.body.style.fontSize = fontSize + 'px';
        
    } catch (error) {
        console.error('خطأ في تطبيق حجم الخط:', error);
    }
}

// تطبيق نمط الحركة
function applyAnimationStyle(style) {
    try {
        // إزالة جميع فئات الحركة
        document.body.classList.remove('no-animations', 'fade-animations', 'slide-animations');

        switch(style) {
            case 'none':
                document.body.classList.add('no-animations');
                break;
            case 'fade':
                document.body.classList.add('fade-animations');
                break;
            case 'slide':
                document.body.classList.add('slide-animations');
                break;
        }
        
    } catch (error) {
        console.error('خطأ في تطبيق نمط الحركة:', error);
    }
}

// تحديث عرض حجم الخط
function updateFontSizeDisplay(size) {
    try {
        const display = document.getElementById('fontSizeValue');
        if (display) {
            display.textContent = size + 'px';
        }
    } catch (error) {
        console.error('خطأ في تحديث عرض حجم الخط:', error);
    }
}

// إعادة تعيين الإعدادات المتقدمة
function resetAdvancedSettings() {
    try {
        // إعادة تعيين قيم الحقول
        if (document.getElementById('arabicFont')) {
            document.getElementById('arabicFont').value = 'cairo';
        }
        if (document.getElementById('fontSize')) {
            document.getElementById('fontSize').value = '16';
        }
        if (document.getElementById('animationStyle')) {
            document.getElementById('animationStyle').value = 'fade';
        }

        // تطبيق الإعدادات الافتراضية
        applyArabicFont('cairo');
        applyFontSize('16');
        applyAnimationStyle('fade');
        updateFontSizeDisplay('16');

        // حذف الإعدادات المحفوظة
        localStorage.removeItem('advancedSettings');

        showSuccessMessage('🔄 تم إعادة تعيين الإعدادات المتقدمة!');
        
    } catch (error) {
        console.error('خطأ في إعادة تعيين الإعدادات المتقدمة:', error);
        alert('❌ حدث خطأ في إعادة تعيين الإعدادات المتقدمة');
    }
}

// === تحميل الإعدادات المحفوظة ===

// تحميل جميع الإعدادات المحفوظة
function loadAllSavedSettings() {
    try {
        loadSavedContent();
        loadSavedTheme();
        loadSavedAdvancedSettings();
        console.log('✅ تم تحميل جميع الإعدادات المحفوظة');
    } catch (error) {
        console.error('خطأ في تحميل الإعدادات:', error);
    }
}

// تحميل المحتوى المحفوظ
function loadSavedContent() {
    try {
        const savedTitle = localStorage.getItem('appTitle');
        const savedDesc = localStorage.getItem('appDescription');
        const savedWelcome = localStorage.getItem('welcomeMessage');

        // تحديث الحقول في لوحة التحكم
        if (savedTitle && document.getElementById('appTitle')) {
            document.getElementById('appTitle').value = savedTitle;
            // تطبيق العنوان على التطبيق
            const titleElement = document.querySelector('.banner h1');
            if (titleElement) {
                titleElement.textContent = savedTitle;
            }
        }

        if (savedDesc && document.getElementById('appDescription')) {
            document.getElementById('appDescription').value = savedDesc;
        }

        if (savedWelcome && document.getElementById('welcomeMessage')) {
            document.getElementById('welcomeMessage').value = savedWelcome;
        }
        
    } catch (error) {
        console.error('خطأ في تحميل المحتوى المحفوظ:', error);
    }
}

// تحميل الثيم المحفوظ
function loadSavedTheme() {
    try {
        const savedTheme = localStorage.getItem('customTheme');
        if (savedTheme) {
            const theme = JSON.parse(savedTheme);
            
            // تحديث الحقول
            if (document.getElementById('primaryColor')) {
                document.getElementById('primaryColor').value = theme.primary;
            }
            if (document.getElementById('backgroundColor')) {
                document.getElementById('backgroundColor').value = theme.background;
            }
            if (document.getElementById('textColor')) {
                document.getElementById('textColor').value = theme.text;
            }

            // تطبيق الثيم
            applyColorsToElements(theme.primary, theme.background, theme.text);
        }
        
    } catch (error) {
        console.error('خطأ في تحميل الثيم المحفوظ:', error);
    }
}

// تحميل الإعدادات المتقدمة المحفوظة
function loadSavedAdvancedSettings() {
    try {
        const savedSettings = localStorage.getItem('advancedSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // تحديث الحقول
            if (document.getElementById('arabicFont')) {
                document.getElementById('arabicFont').value = settings.font;
            }
            if (document.getElementById('fontSize')) {
                document.getElementById('fontSize').value = settings.fontSize;
                updateFontSizeDisplay(settings.fontSize);
            }
            if (document.getElementById('animationStyle')) {
                document.getElementById('animationStyle').value = settings.animation;
            }

            // تطبيق الإعدادات
            applyArabicFont(settings.font);
            applyFontSize(settings.fontSize);
            applyAnimationStyle(settings.animation);
        }
        
    } catch (error) {
        console.error('خطأ في تحميل الإعدادات المتقدمة المحفوظة:', error);
    }
}

// === وظائف مساعدة ===

// عرض رسالة نجاح
function showSuccessMessage(message) {
    try {
        // إنشاء عنصر الرسالة
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            z-index: 10000;
            font-weight: bold;
            animation: slideInRight 0.5s ease-out;
        `;

        // إضافة الرسالة للصفحة
        document.body.appendChild(messageDiv);

        // إزالة الرسالة بعد 3 ثوان
        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.5s ease-in';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 500);
        }, 3000);
        
    } catch (error) {
        console.error('خطأ في عرض رسالة النجاح:', error);
        // استخدام alert كبديل
        alert(message);
    }
}

// إضافة أنماط CSS للرسائل والحركات
function addCustomStyles() {
    try {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            .no-animations * {
                animation: none !important;
                transition: none !important;
            }

            .fade-animations * {
                transition: all 0.3s ease !important;
            }

            .slide-animations * {
                transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            }

            .success-message {
                font-family: inherit;
                direction: rtl;
            }
        `;
        document.head.appendChild(style);
        
    } catch (error) {
        console.error('خطأ في إضافة الأنماط المخصصة:', error);
    }
}

// === إضافة مستمعي الأحداث ===

// تحديث عرض حجم الخط عند التغيير
function initializeFontSizeSlider() {
    try {
        const fontSizeSlider = document.getElementById('fontSize');
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', function() {
                updateFontSizeDisplay(this.value);
            });
        }
    } catch (error) {
        console.error('خطأ في تهيئة شريط حجم الخط:', error);
    }
}

// === تهيئة النظام ===

// تهيئة إدارة المحتوى والثيمات
function initializeContentAndThemeManagement() {
    try {
        // إضافة الأنماط المخصصة
        addCustomStyles();
        
        // تهيئة شريط حجم الخط
        initializeFontSizeSlider();
        
        // تحميل الإعدادات المحفوظة
        loadAllSavedSettings();
        loadAnnouncementSettings();
        
        console.log('✅ تم تهيئة إدارة المحتوى والثيمات بنجاح');
        
    } catch (error) {
        console.error('خطأ في تهيئة النظام:', error);
    }
}

// === تصدير واستيراد الإعدادات ===

// تصدير إعدادات المحتوى والثيمات
function exportContentAndThemeSettings() {
    try {
        const settings = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            content: {
                title: localStorage.getItem('appTitle'),
                description: localStorage.getItem('appDescription'),
                welcomeMessage: localStorage.getItem('welcomeMessage')
            },
            theme: localStorage.getItem('customTheme'),
            advanced: localStorage.getItem('advancedSettings')
        };

        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `content-theme-settings-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(url);
        showSuccessMessage('📤 تم تصدير إعدادات المحتوى والثيمات بنجاح!');
        
    } catch (error) {
        console.error('خطأ في تصدير الإعدادات:', error);
        alert('❌ حدث خطأ في تصدير الإعدادات');
    }
}

// استيراد إعدادات المحتوى والثيمات
function importContentAndThemeSettings() {
    try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const settings = JSON.parse(e.target.result);
                        
                        // استيراد إعدادات المحتوى
                        if (settings.content) {
                            if (settings.content.title) {
                                localStorage.setItem('appTitle', settings.content.title);
                            }
                            if (settings.content.description) {
                                localStorage.setItem('appDescription', settings.content.description);
                            }
                            if (settings.content.welcomeMessage) {
                                localStorage.setItem('welcomeMessage', settings.content.welcomeMessage);
                            }
                        }
                        
                        // استيراد إعدادات الثيم
                        if (settings.theme) {
                            localStorage.setItem('customTheme', settings.theme);
                        }
                        
                        // استيراد الإعدادات المتقدمة
                        if (settings.advanced) {
                            localStorage.setItem('advancedSettings', settings.advanced);
                        }
                        
                        showSuccessMessage('📥 تم استيراد الإعدادات بنجاح! سيتم إعادة تحميل الصفحة.');
                        
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                        
                    } catch (error) {
                        console.error('خطأ في قراءة ملف الإعدادات:', error);
                        alert('❌ ملف الإعدادات غير صحيح');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
        
    } catch (error) {
        console.error('خطأ في استيراد الإعدادات:', error);
        alert('❌ حدث خطأ في استيراد الإعدادات');
    }
}

// === تشغيل التهيئة عند تحميل الصفحة ===

// تشغيل التهيئة عند تحميل DOM
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeContentAndThemeManagement();
    }, 1000);
});

// تشغيل التهيئة عند تحميل النافذة (احتياطي)
window.addEventListener('load', function() {
    setTimeout(() => {
        initializeContentAndThemeManagement();
    }, 1500);
});

// === إدارة الشريط الإعلاني ===

// متغيرات الإعلانات المتعددة
let announcements = [];
let currentAnnouncementIndex = 0;
let announcementInterval;

// تحديث الإعلانات المتعددة
function updateAnnouncement() {
    try {
        const newText = document.getElementById('announcementTextAdmin')?.value?.trim();
        const speed = document.getElementById('announcementSpeed')?.value || 40;
        
        if (newText) {
            // تقسيم النص إلى إعلانات منفصلة
            announcements = newText.split('\n').filter(line => line.trim());
            
            localStorage.setItem('announcementText', newText);
            localStorage.setItem('announcementSpeed', speed);
            
            // بدء دورة الإعلانات
            startAnnouncementCycle(speed);
            
            showSuccessMessage(`📢 تم تحديث ${announcements.length} إعلان بسرعة ${speed}ث!`);
        }
    } catch (error) {
        console.error('خطأ في تحديث الإعلان:', error);
    }
}

// بدء دورة الإعلانات
function startAnnouncementCycle(speed) {
    if (announcementInterval) clearInterval(announcementInterval);
    
    if (announcements.length === 0) return;
    
    const announcementElement = document.getElementById('announcementText');
    if (!announcementElement) return;
    
    // عرض الإعلان الأول
    announcementElement.textContent = announcements[0];
    announcementElement.style.animationDuration = speed + 's';
    currentAnnouncementIndex = 0;
    
    // إذا كان هناك أكثر من إعلان واحد
    if (announcements.length > 1) {
        announcementInterval = setInterval(() => {
            currentAnnouncementIndex = (currentAnnouncementIndex + 1) % announcements.length;
            announcementElement.textContent = announcements[currentAnnouncementIndex];
        }, parseInt(speed) * 1000);
    }
}

// تحديث عرض السرعة
function updateSpeedDisplay() {
    const speed = document.getElementById('announcementSpeed')?.value || 40;
    const display = document.getElementById('speedValue');
    if (display) {
        display.textContent = speed + 'ث';
    }
}

// إخفاء الشريط الإعلاني
function hideAnnouncementBar() {
    const bar = document.getElementById('announcementBar');
    if (bar) {
        bar.classList.add('hidden');
        document.body.classList.add('no-announcement');
        localStorage.setItem('announcementHidden', 'true');
    }
}

// تبديل إظهار/إخفاء الشريط
function toggleAnnouncementBar() {
    const bar = document.getElementById('announcementBar');
    if (bar) {
        const isHidden = bar.classList.contains('hidden');
        if (isHidden) {
            bar.classList.remove('hidden');
            document.body.classList.remove('no-announcement');
            localStorage.removeItem('announcementHidden');
            showSuccessMessage('🔄 تم إظهار الشريط الإعلاني');
        } else {
            hideAnnouncementBar();
            showSuccessMessage('🔄 تم إخفاء الشريط الإعلاني');
        }
    }
}

// تحميل إعدادات الشريط الإعلاني
function loadAnnouncementSettings() {
    try {
        const savedText = localStorage.getItem('announcementText');
        const isHidden = localStorage.getItem('announcementHidden');
        
        if (savedText) {
            const adminTextarea = document.getElementById('announcementTextAdmin');
            if (adminTextarea) adminTextarea.value = savedText;
            
            // تقسيم النص وبدء الدورة
            announcements = savedText.split('\n').filter(line => line.trim());
        }
        
        const savedSpeed = localStorage.getItem('announcementSpeed') || '40';
        const speedSlider = document.getElementById('announcementSpeed');
        const speedDisplay = document.getElementById('speedValue');
        if (speedSlider) {
            speedSlider.value = savedSpeed;
            speedSlider.addEventListener('input', updateSpeedDisplay);
        }
        if (speedDisplay) speedDisplay.textContent = savedSpeed + 'ث';
        
        // بدء دورة الإعلانات بالسرعة المحفوظة
        if (announcements.length > 0) {
            startAnnouncementCycle(savedSpeed);
        }
        
        if (isHidden === 'true') {
            const bar = document.getElementById('announcementBar');
            if (bar) {
                bar.classList.add('hidden');
                document.body.classList.add('no-announcement');
            }
        }
    } catch (error) {
        console.error('خطأ في تحميل إعدادات الشريط:', error);
    }
}

console.log('📝 تم تحميل إصلاح إدارة المحتوى والثيمات النهائي');