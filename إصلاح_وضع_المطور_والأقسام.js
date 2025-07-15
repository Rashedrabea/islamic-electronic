// إصلاح وضع المطور وإدارة الأقسام

// === وضع المطور ===
let devModeEnabled = false;

function toggleDevMode() {
    devModeEnabled = !devModeEnabled;
    localStorage.setItem('devModeEnabled', devModeEnabled);
    
    const toggle = document.getElementById('devModeToggle');
    if (toggle) {
        if (devModeEnabled) {
            toggle.classList.add('active');
        } else {
            toggle.classList.remove('active');
        }
    }
    
    if (devModeEnabled) {
        enableDevMode();
        alert('🛠️ تم تفعيل وضع المطور');
    } else {
        disableDevMode();
        alert('✅ تم إيقاف وضع المطور');
    }
}

function enableDevMode() {
    // إضافة شريط أدوات المطور
    if (!document.getElementById('devToolbar')) {
        const toolbar = document.createElement('div');
        toolbar.id = 'devToolbar';
        toolbar.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 10px;
            font-size: 12px;
            z-index: 9999;
            display: flex;
            gap: 15px;
            align-items: center;
        `;
        
        toolbar.innerHTML = `
            <span>🛠️ وضع المطور</span>
            <button onclick="showConsole()" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">📊 وحدة التحكم</button>
            <button onclick="showStats()" style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">📈 الإحصائيات</button>
            <button onclick="exportLogs()" style="background: #FF9800; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">📤 تصدير السجلات</button>
            <button onclick="clearCache()" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">🗑️ مسح الذاكرة</button>
        `;
        
        document.body.appendChild(toolbar);
    }
    
    // تفعيل السجلات المفصلة
    window.devLog = function(message) {
        console.log(`[DEV] ${new Date().toLocaleTimeString()}: ${message}`);
    };
    
    console.log('🛠️ تم تفعيل وضع المطور');
}

function disableDevMode() {
    const toolbar = document.getElementById('devToolbar');
    if (toolbar) {
        toolbar.remove();
    }
    
    const console = document.getElementById('devConsole');
    if (console) {
        console.remove();
    }
    
    window.devLog = function() {}; // إيقاف السجلات
}

function showConsole() {
    if (document.getElementById('devConsole')) return;
    
    const consoleDiv = document.createElement('div');
    consoleDiv.id = 'devConsole';
    consoleDiv.style.cssText = `
        position: fixed;
        top: 50px;
        right: 20px;
        width: 400px;
        height: 300px;
        background: rgba(0,0,0,0.95);
        color: #00ff00;
        font-family: monospace;
        font-size: 11px;
        padding: 10px;
        border-radius: 5px;
        z-index: 10000;
        overflow-y: auto;
        border: 1px solid #333;
    `;
    
    consoleDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>📊 وحدة تحكم المطور</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: #f44336; color: white; border: none; padding: 2px 8px; border-radius: 3px; cursor: pointer;">✕</button>
        </div>
        <div id="consoleContent">
            > تم تفعيل وحدة التحكم<br>
            > عدد التسبيحات: ${count || 0}<br>
            > الوضع الليلي: ${isDarkMode ? 'مفعل' : 'معطل'}<br>
            > الاهتزاز: ${isVibrationEnabled ? 'مفعل' : 'معطل'}<br>
            > المواقيت: ${isManualMode ? 'يدوي' : 'تلقائي'}<br>
        </div>
    `;
    
    document.body.appendChild(consoleDiv);
}

function showStats() {
    const stats = {
        'إجمالي التسبيحات': totalCount || 0,
        'تسبيحات اليوم': todayCount || 0,
        'الذكر الحالي': currentDhikr || 'غير محدد',
        'حجم البيانات المحفوظة': `${JSON.stringify(localStorage).length} حرف`,
        'عدد الأذكار المخصصة': Object.keys(JSON.parse(localStorage.getItem('customAzkarData') || '{}')).length,
        'آخر حفظ': localStorage.getItem('lastSaved') || 'غير محدد'
    };
    
    let message = '📈 إحصائيات التطبيق:\n\n';
    Object.entries(stats).forEach(([key, value]) => {
        message += `${key}: ${value}\n`;
    });
    
    alert(message);
}

function exportLogs() {
    const logs = {
        timestamp: new Date().toISOString(),
        localStorage: localStorage,
        userAgent: navigator.userAgent,
        url: window.location.href,
        stats: {
            totalCount: totalCount || 0,
            todayCount: todayCount || 0,
            currentDhikr: currentDhikr || 'غير محدد'
        }
    };
    
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dev-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('📤 تم تصدير سجلات المطور');
}

function clearCache() {
    if (confirm('هل تريد مسح جميع البيانات المحفوظة؟')) {
        localStorage.clear();
        alert('🗑️ تم مسح الذاكرة. سيتم إعادة تحميل الصفحة.');
        location.reload();
    }
}

// === إدارة الأقسام ===
function updateSectionsManager() {
    const container = document.getElementById('sectionsManager');
    if (!container) return;
    
    const sections = [
        { id: 'counter-section', name: '📿 قسم التسبيح', visible: true },
        { id: 'stats-section', name: '📊 قسم الإحصائيات', visible: true },
        { id: 'radio-section', name: '📻 قسم الراديو', visible: true },
        { id: 'prayer-times-section', name: '🕌 قسم مواقيت الصلاة', visible: true },
        { id: 'azkar-section', name: '🤲 قسم الأذكار والأدعية', visible: true },
        { id: 'social-share', name: '📢 قسم المشاركة', visible: true }
    ];
    
    container.innerHTML = sections.map(section => `
        <div class="section-item">
            <div>
                <div class="section-name">${section.name}</div>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">
                    ID: ${section.id}
                </div>
            </div>
            <div class="section-controls">
                <div class="toggle-switch ${section.visible ? 'active' : ''}" onclick="toggleSection('${section.id}', this)"></div>
                <button class="control-btn small secondary" onclick="editSection('${section.id}')">✏️ تعديل</button>
                <button class="control-btn small" onclick="moveSection('${section.id}', 'up')">⬆️</button>
                <button class="control-btn small" onclick="moveSection('${section.id}', 'down')">⬇️</button>
            </div>
        </div>
    `).join('');
}

function toggleSection(sectionId, toggleElement) {
    const section = document.querySelector(`.${sectionId}`);
    const isVisible = !toggleElement.classList.contains('active');
    
    if (section) {
        if (isVisible) {
            section.style.display = 'block';
            toggleElement.classList.add('active');
        } else {
            section.style.display = 'none';
            toggleElement.classList.remove('active');
        }
        
        // حفظ الحالة
        const sectionStates = JSON.parse(localStorage.getItem('sectionStates') || '{}');
        sectionStates[sectionId] = isVisible;
        localStorage.setItem('sectionStates', JSON.stringify(sectionStates));
        
        alert(`${isVisible ? '✅ تم إظهار' : '❌ تم إخفاء'} القسم`);
    }
}

function editSection(sectionId) {
    const section = document.querySelector(`.${sectionId}`);
    if (!section) return;
    
    const newTitle = prompt('أدخل العنوان الجديد للقسم:', section.querySelector('h2')?.textContent || '');
    if (newTitle) {
        const titleElement = section.querySelector('h2');
        if (titleElement) {
            titleElement.textContent = newTitle;
            
            // حفظ العنوان الجديد
            const sectionTitles = JSON.parse(localStorage.getItem('sectionTitles') || '{}');
            sectionTitles[sectionId] = newTitle;
            localStorage.setItem('sectionTitles', JSON.stringify(sectionTitles));
            
            alert('✅ تم تحديث عنوان القسم');
        }
    }
}

function moveSection(sectionId, direction) {
    const section = document.querySelector(`.${sectionId}`);
    if (!section) return;
    
    if (direction === 'up') {
        const prevSection = section.previousElementSibling;
        if (prevSection) {
            section.parentNode.insertBefore(section, prevSection);
            alert('⬆️ تم نقل القسم للأعلى');
        }
    } else {
        const nextSection = section.nextElementSibling;
        if (nextSection) {
            section.parentNode.insertBefore(nextSection, section);
            alert('⬇️ تم نقل القسم للأسفل');
        }
    }
}

function addNewSection() {
    const name = prompt('أدخل اسم القسم الجديد:');
    if (!name) return;
    
    const id = `custom-section-${Date.now()}`;
    const content = prompt('أدخل محتوى القسم:') || 'محتوى القسم الجديد';
    
    // إنشاء القسم الجديد
    const newSection = document.createElement('div');
    newSection.className = `section ${id}`;
    newSection.innerHTML = `
        <h2>${name}</h2>
        <div>${content}</div>
    `;
    
    // إضافة القسم قبل قسم المشاركة
    const shareSection = document.querySelector('.social-share');
    if (shareSection) {
        shareSection.parentNode.insertBefore(newSection, shareSection);
    } else {
        document.querySelector('.container').appendChild(newSection);
    }
    
    // تحديث مدير الأقسام
    updateSectionsManager();
    
    alert('✅ تم إضافة القسم الجديد');
}

// تحميل حالات الأقسام المحفوظة
function loadSectionStates() {
    const sectionStates = JSON.parse(localStorage.getItem('sectionStates') || '{}');
    const sectionTitles = JSON.parse(localStorage.getItem('sectionTitles') || '{}');
    
    Object.entries(sectionStates).forEach(([sectionId, isVisible]) => {
        const section = document.querySelector(`.${sectionId}`);
        if (section) {
            section.style.display = isVisible ? 'block' : 'none';
        }
    });
    
    Object.entries(sectionTitles).forEach(([sectionId, title]) => {
        const section = document.querySelector(`.${sectionId}`);
        const titleElement = section?.querySelector('h2');
        if (titleElement) {
            titleElement.textContent = title;
        }
    });
}

// تحميل وضع المطور المحفوظ
function loadDevMode() {
    const saved = localStorage.getItem('devModeEnabled');
    if (saved === 'true') {
        devModeEnabled = true;
        const toggle = document.getElementById('devModeToggle');
        if (toggle) {
            toggle.classList.add('active');
        }
        enableDevMode();
    }
}

// تهيئة النظام
function initializeDevAndSections() {
    console.log('🛠️ تهيئة وضع المطور وإدارة الأقسام...');
    
    // تحميل وضع المطور
    loadDevMode();
    
    // تحميل حالات الأقسام
    loadSectionStates();
    
    // تحديث مدير الأقسام
    setTimeout(updateSectionsManager, 500);
    
    console.log('✅ تم تهيئة وضع المطور وإدارة الأقسام');
}

// تشغيل التهيئة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDevAndSections);
} else {
    initializeDevAndSections();
}

console.log('🛠️📋 تم تحميل إصلاح وضع المطور وإدارة الأقسام');