// إصلاح إدارة الأقسام

// تحديث مدير الأقسام
function updateSectionsManager() {
    const container = document.getElementById('sectionsManager');
    if (!container) {
        console.log('❌ عنصر sectionsManager غير موجود');
        return;
    }
    
    // قائمة الأقسام الموجودة في التطبيق
    const sections = [
        { 
            id: 'counter-section', 
            name: '📿 قسم التسبيح', 
            selector: '.counter-section',
            visible: true 
        },
        { 
            id: 'stats-section', 
            name: '📊 قسم الإحصائيات', 
            selector: '.stats-grid',
            visible: true 
        },
        { 
            id: 'radio-section', 
            name: '📻 قسم الراديو', 
            selector: '.section:has(h2:contains("راديو"))',
            visible: true 
        },
        { 
            id: 'prayer-section', 
            name: '🕌 قسم مواقيت الصلاة', 
            selector: '.section:has(h2:contains("مواقيت"))',
            visible: true 
        },
        { 
            id: 'azkar-section', 
            name: '🤲 قسم الأذكار والأدعية', 
            selector: '.section:has(h2:contains("الأذكار"))',
            visible: true 
        },
        { 
            id: 'share-section', 
            name: '📢 قسم المشاركة', 
            selector: '.social-share',
            visible: true 
        }
    ];
    
    // تحميل حالات الأقسام المحفوظة
    const savedStates = JSON.parse(localStorage.getItem('sectionStates') || '{}');
    
    // إنشاء HTML للأقسام
    container.innerHTML = sections.map(section => {
        const isVisible = savedStates[section.id] !== false;
        return `
            <div class="section-item" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; margin: 10px 0; background: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
                <div>
                    <div class="section-name" style="font-weight: bold; color: #333;">${section.name}</div>
                    <div style="font-size: 12px; color: #666; margin-top: 5px;">
                        ID: ${section.id}
                    </div>
                </div>
                <div class="section-controls" style="display: flex; gap: 10px; align-items: center;">
                    <div class="toggle-switch ${isVisible ? 'active' : ''}" onclick="toggleSection('${section.id}', this)" style="position: relative; width: 50px; height: 25px; background: ${isVisible ? '#4CAF50' : '#ccc'}; border-radius: 15px; cursor: pointer; transition: all 0.3s ease;">
                        <div style="position: absolute; top: 2px; left: ${isVisible ? '27px' : '2px'}; width: 21px; height: 21px; background: white; border-radius: 50%; transition: all 0.3s ease;"></div>
                    </div>
                    <button class="control-btn small secondary" onclick="editSection('${section.id}')" style="padding: 5px 10px; font-size: 12px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">✏️ تعديل</button>
                    <button class="control-btn small" onclick="moveSection('${section.id}', 'up')" style="padding: 5px 8px; font-size: 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">⬆️</button>
                    <button class="control-btn small" onclick="moveSection('${section.id}', 'down')" style="padding: 5px 8px; font-size: 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">⬇️</button>
                </div>
            </div>
        `;
    }).join('');
    
    console.log('✅ تم تحديث مدير الأقسام');
}

// تبديل حالة القسم
function toggleSection(sectionId, toggleElement) {
    console.log('تبديل القسم:', sectionId);
    
    // البحث عن القسم في التطبيق
    let section = null;
    const selectors = [
        `.${sectionId}`,
        `#${sectionId}`,
        '.section:has(h2:contains("التسبيح"))',
        '.section:has(h2:contains("الإحصائيات"))',
        '.section:has(h2:contains("راديو"))',
        '.section:has(h2:contains("مواقيت"))',
        '.section:has(h2:contains("الأذكار"))',
        '.social-share'
    ];
    
    // محاولة العثور على القسم
    for (let selector of selectors) {
        try {
            section = document.querySelector(selector);
            if (section) break;
        } catch (e) {
            continue;
        }
    }
    
    // إذا لم نجد القسم، نبحث بطريقة أخرى
    if (!section) {
        const allSections = document.querySelectorAll('.section');
        for (let sec of allSections) {
            const h2 = sec.querySelector('h2');
            if (h2) {
                const text = h2.textContent;
                if ((sectionId.includes('counter') && text.includes('التسبيح')) ||
                    (sectionId.includes('stats') && text.includes('الإحصائيات')) ||
                    (sectionId.includes('radio') && text.includes('راديو')) ||
                    (sectionId.includes('prayer') && text.includes('مواقيت')) ||
                    (sectionId.includes('azkar') && text.includes('الأذكار'))) {
                    section = sec;
                    break;
                }
            }
        }
    }
    
    // إذا لم نجد القسم، نبحث في المشاركة
    if (!section && sectionId.includes('share')) {
        section = document.querySelector('.social-share');
    }
    
    if (section) {
        const isCurrentlyVisible = section.style.display !== 'none';
        const newVisibility = !isCurrentlyVisible;
        
        // تطبيق التغيير
        section.style.display = newVisibility ? 'block' : 'none';
        
        // تحديث المفتاح
        const switchElement = toggleElement.querySelector('div') || toggleElement.nextElementSibling;
        if (newVisibility) {
            toggleElement.style.background = '#4CAF50';
            if (switchElement) switchElement.style.left = '27px';
            toggleElement.classList.add('active');
        } else {
            toggleElement.style.background = '#ccc';
            if (switchElement) switchElement.style.left = '2px';
            toggleElement.classList.remove('active');
        }
        
        // حفظ الحالة
        const sectionStates = JSON.parse(localStorage.getItem('sectionStates') || '{}');
        sectionStates[sectionId] = newVisibility;
        localStorage.setItem('sectionStates', JSON.stringify(sectionStates));
        
        alert(`${newVisibility ? '✅ تم إظهار' : '❌ تم إخفاء'} القسم`);
        console.log(`تم ${newVisibility ? 'إظهار' : 'إخفاء'} القسم:`, sectionId);
    } else {
        alert('❌ لم يتم العثور على القسم');
        console.log('❌ لم يتم العثور على القسم:', sectionId);
    }
}

// تعديل القسم
function editSection(sectionId) {
    console.log('تعديل القسم:', sectionId);
    
    // البحث عن القسم
    const allSections = document.querySelectorAll('.section');
    let targetSection = null;
    
    for (let section of allSections) {
        const h2 = section.querySelector('h2');
        if (h2) {
            const text = h2.textContent;
            if ((sectionId.includes('counter') && text.includes('التسبيح')) ||
                (sectionId.includes('stats') && text.includes('الإحصائيات')) ||
                (sectionId.includes('radio') && text.includes('راديو')) ||
                (sectionId.includes('prayer') && text.includes('مواقيت')) ||
                (sectionId.includes('azkar') && text.includes('الأذكار'))) {
                targetSection = section;
                break;
            }
        }
    }
    
    // للمشاركة
    if (!targetSection && sectionId.includes('share')) {
        targetSection = document.querySelector('.social-share');
    }
    
    if (targetSection) {
        const titleElement = targetSection.querySelector('h2, h3');
        const currentTitle = titleElement ? titleElement.textContent : 'عنوان القسم';
        
        const newTitle = prompt('أدخل العنوان الجديد للقسم:', currentTitle);
        if (newTitle && titleElement) {
            titleElement.textContent = newTitle;
            
            // حفظ العنوان الجديد
            const sectionTitles = JSON.parse(localStorage.getItem('sectionTitles') || '{}');
            sectionTitles[sectionId] = newTitle;
            localStorage.setItem('sectionTitles', JSON.stringify(sectionTitles));
            
            alert('✅ تم تحديث عنوان القسم');
        }
    } else {
        alert('❌ لم يتم العثور على القسم للتعديل');
    }
}

// نقل القسم
function moveSection(sectionId, direction) {
    console.log('نقل القسم:', sectionId, direction);
    
    // البحث عن القسم
    const allSections = document.querySelectorAll('.section');
    let targetSection = null;
    
    for (let section of allSections) {
        const h2 = section.querySelector('h2');
        if (h2) {
            const text = h2.textContent;
            if ((sectionId.includes('counter') && text.includes('التسبيح')) ||
                (sectionId.includes('stats') && text.includes('الإحصائيات')) ||
                (sectionId.includes('radio') && text.includes('راديو')) ||
                (sectionId.includes('prayer') && text.includes('مواقيت')) ||
                (sectionId.includes('azkar') && text.includes('الأذكار'))) {
                targetSection = section;
                break;
            }
        }
    }
    
    if (targetSection) {
        if (direction === 'up') {
            const prevSection = targetSection.previousElementSibling;
            if (prevSection && prevSection.classList.contains('section')) {
                targetSection.parentNode.insertBefore(targetSection, prevSection);
                alert('⬆️ تم نقل القسم للأعلى');
            } else {
                alert('⚠️ القسم في أعلى موضع بالفعل');
            }
        } else {
            const nextSection = targetSection.nextElementSibling;
            if (nextSection && nextSection.classList.contains('section')) {
                targetSection.parentNode.insertBefore(nextSection, targetSection);
                alert('⬇️ تم نقل القسم للأسفل');
            } else {
                alert('⚠️ القسم في أسفل موضع بالفعل');
            }
        }
    } else {
        alert('❌ لم يتم العثور على القسم للنقل');
    }
}

// إضافة قسم جديد
function addNewSection() {
    const name = prompt('أدخل اسم القسم الجديد:');
    if (!name) return;
    
    const content = prompt('أدخل محتوى القسم:', 'محتوى القسم الجديد');
    if (!content) return;
    
    const id = `custom-section-${Date.now()}`;
    
    // إنشاء القسم الجديد
    const newSection = document.createElement('div');
    newSection.className = 'section';
    newSection.id = id;
    newSection.innerHTML = `
        <h2>${name}</h2>
        <div style="padding: 20px; text-align: center; background: rgba(76, 175, 80, 0.1); border-radius: 10px;">
            ${content}
        </div>
    `;
    
    // إضافة القسم قبل قسم المشاركة
    const shareSection = document.querySelector('.social-share');
    if (shareSection) {
        shareSection.parentNode.insertBefore(newSection, shareSection);
    } else {
        document.querySelector('.container').appendChild(newSection);
    }
    
    // تحديث مدير الأقسام
    setTimeout(updateSectionsManager, 500);
    
    alert('✅ تم إضافة القسم الجديد');
}

// تحميل حالات الأقسام المحفوظة
function loadSectionStates() {
    const sectionStates = JSON.parse(localStorage.getItem('sectionStates') || '{}');
    const sectionTitles = JSON.parse(localStorage.getItem('sectionTitles') || '{}');
    
    // تطبيق حالات الإظهار/الإخفاء
    Object.entries(sectionStates).forEach(([sectionId, isVisible]) => {
        const selectors = [
            `.${sectionId}`,
            `#${sectionId}`
        ];
        
        for (let selector of selectors) {
            try {
                const section = document.querySelector(selector);
                if (section) {
                    section.style.display = isVisible ? 'block' : 'none';
                    break;
                }
            } catch (e) {
                continue;
            }
        }
    });
    
    // تطبيق العناوين المخصصة
    Object.entries(sectionTitles).forEach(([sectionId, title]) => {
        const allSections = document.querySelectorAll('.section');
        for (let section of allSections) {
            if (section.id === sectionId || section.classList.contains(sectionId)) {
                const titleElement = section.querySelector('h2, h3');
                if (titleElement) {
                    titleElement.textContent = title;
                    break;
                }
            }
        }
    });
}

// تهيئة إدارة الأقسام
function initializeSectionsManager() {
    console.log('📋 تهيئة إدارة الأقسام...');
    
    // تحميل حالات الأقسام المحفوظة
    setTimeout(() => {
        loadSectionStates();
        updateSectionsManager();
    }, 1000);
    
    console.log('✅ تم تهيئة إدارة الأقسام');
}

// تشغيل التهيئة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSectionsManager);
} else {
    initializeSectionsManager();
}

console.log('📋 تم تحميل إصلاح إدارة الأقسام');