// تحسين تحديث العداد
function optimizeCounter() {
    const counter = document.getElementById('counter');
    let animationFrame;
    
    function updateCounter(newValue) {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        
        animationFrame = requestAnimationFrame(() => {
            counter.textContent = newValue;
        });
    }
}