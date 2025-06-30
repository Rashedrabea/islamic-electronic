// أسهم التنقل الجانبية لقسم الأذكار

// إضافة أسهم التنقل الجانبية
function addSideArrows() {
    // إنشاء حاوي الأسهم
    const arrowContainer = document.createElement('div');
    arrowContainer.id = 'azkarSideArrows';
    arrowContainer.style.cssText = `
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // سهم الصعود
    const upArrow = document.createElement('button');
    upArrow.innerHTML = '⬆️';
    upArrow.onclick = scrollToAzkarTop;
    upArrow.style.cssText = `
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
        transition: all 0.3s ease;
    `;
    upArrow.title = 'العودة لأعلى الأذكار';
    
    // سهم الهبوط
    const downArrow = document.createElement('button');
    downArrow.innerHTML = '⬇️';
    downArrow.onclick = scrollToAzkarBottom;
    downArrow.style.cssText = `
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: linear-gradient(135deg, #2196F3, #1976D2);
        color: white;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(33, 150, 243, 0.4);
        transition: all 0.3s ease;
    `;
    downArrow.title = 'الذهاب لأسفل الأذكار';
    
    // تأثيرات التمرير
    upArrow.onmouseover = () => {
        upArrow.style.transform = 'scale(1.1)';
        upArrow.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.6)';
    };
    upArrow.onmouseout = () => {
        upArrow.style.transform = 'scale(1)';
        upArrow.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.4)';
    };
    
    downArrow.onmouseover = () => {
        downArrow.style.transform = 'scale(1.1)';
        downArrow.style.boxShadow = '0 6px 20px rgba(33, 150, 243, 0.6)';
    };
    downArrow.onmouseout = () => {
        downArrow.style.transform = 'scale(1)';
        downArrow.style.boxShadow = '0 4px 15px rgba(33, 150, 243, 0.4)';
    };
    
    // إضافة الأسهم للحاوي
    arrowContainer.appendChild(upArrow);
    arrowContainer.appendChild(downArrow);
    
    // إضافة الحاوي للصفحة
    document.body.appendChild(arrowContainer);
    
    console.log('✅ تم إضافة أسهم التنقل الجانبية');
}

// إظهار/إخفاء الأسهم حسب موقع المستخدم
function toggleArrowsVisibility() {
    const arrows = document.getElementById('azkarSideArrows');
    if (!arrows) return;
    
    // البحث عن قسم الأذكار
    const azkarSections = document.querySelectorAll('.section');
    let azkarSection = null;
    
    for (let section of azkarSections) {
        const h2 = section.querySelector('h2');
        if (h2 && h2.textContent.includes('الأذكار')) {
            azkarSection = section;
            break;
        }
    }
    
    if (!azkarSection) return;
    
    // حساب موقع قسم الأذكار
    const rect = azkarSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // إظهار الأسهم إذا كان المستخدم في قسم الأذكار
    if (rect.top < windowHeight && rect.bottom > 0) {
        arrows.style.opacity = '1';
    } else {
        arrows.style.opacity = '0';
    }
}

// التمرير لأعلى الأذكار
function scrollToAzkarTop() {
    const azkarSections = document.querySelectorAll('.section');
    let azkarSection = null;
    
    for (let section of azkarSections) {
        const h2 = section.querySelector('h2');
        if (h2 && h2.textContent.includes('الأذكار')) {
            azkarSection = section;
            break;
        }
    }
    
    if (azkarSection) {
        azkarSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // تأثير بصري
        azkarSection.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.6)';
        setTimeout(() => {
            azkarSection.style.boxShadow = '';
        }, 2000);
    }
}

// التمرير لأسفل الأذكار
function scrollToAzkarBottom() {
    const azkarContent = document.getElementById('azkarContent');
    if (azkarContent) {
        azkarContent.scrollIntoView({ behavior: 'smooth', block: 'end' });
        
        // تأثير بصري
        azkarContent.style.border = '3px solid #2196F3';
        azkarContent.style.borderRadius = '15px';
        setTimeout(() => {
            azkarContent.style.border = '';
            azkarContent.style.borderRadius = '';
        }, 2000);
    } else {
        // إذا لم يوجد محتوى، ابحث عن آخر عنصر في قسم الأذكار
        const azkarSections = document.querySelectorAll('.section');
        for (let section of azkarSections) {
            const h2 = section.querySelector('h2');
            if (h2 && h2.textContent.includes('الأذكار')) {
                const lastElement = section.lastElementChild;
                if (lastElement) {
                    lastElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }
                break;
            }
        }
    }
}

// مراقبة التمرير لإظهار/إخفاء الأسهم
function monitorScrollForArrows() {
    window.addEventListener('scroll', toggleArrowsVisibility);
    window.addEventListener('resize', toggleArrowsVisibility);
    
    // فحص أولي
    setTimeout(toggleArrowsVisibility, 1000);
}

// تهيئة أسهم التنقل
function initializeSideArrows() {
    console.log('➡️ تهيئة أسهم التنقل الجانبية...');
    
    // انتظار تحميل التطبيق
    setTimeout(() => {
        addSideArrows();
        monitorScrollForArrows();
    }, 2000);
    
    console.log('✅ تم تهيئة أسهم التنقل الجانبية');
}

// تشغيل التهيئة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSideArrows);
} else {
    initializeSideArrows();
}

console.log('➡️ تم تحميل أسهم التنقل الجانبية');