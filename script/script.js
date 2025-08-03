// Canvas setup and drawing functionality
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvasOverlay = document.getElementById('canvasOverlay');
let drawing = false;
let hasDrawn = false;

// Set canvas size for better quality
const rect = canvas.getBoundingClientRect();
canvas.width = 400;
canvas.height = 400;

// Drawing event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events for mobile
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);
canvas.addEventListener('touchend', stopDrawing);

function startDrawing(e) {
    drawing = true;
    hideOverlay();
    draw(e);
}

function draw(e) {
    if (!drawing) return;
    
    hasDrawn = true;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2c3e50';
    ctx.shadowColor = 'rgba(44, 62, 80, 0.3)';
    ctx.shadowBlur = 2;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function stopDrawing() {
    if (drawing) {
        drawing = false;
        ctx.beginPath();
    }
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                     e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function hideOverlay() {
    canvasOverlay.classList.add('hidden');
}

function showOverlay() {
    canvasOverlay.classList.remove('hidden');
}

// Clear button functionality
document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    hasDrawn = false;
    showOverlay();
    
    // Clear result
    const resultContent = document.getElementById('result');
    resultContent.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-robot"></i>
            <p>Draw a character and click Submit to get AI feedback!</p>
        </div>
    `;
    
    // Add clear animation
    canvas.style.transform = 'scale(0.98)';
    setTimeout(() => {
        canvas.style.transform = 'scale(1)';
    }, 150);
});

// Predict button functionality
document.getElementById('predict').addEventListener('click', async () => {
    if (!hasDrawn) {
        showResult('Please draw a character first!', 'warning');
        return;
    }
    
    const predictButton = document.getElementById('predict');
    const originalText = predictButton.innerHTML;
    
    // Show loading state
    predictButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    predictButton.disabled = true;
    
    showResult('AI is analyzing your drawing...', 'loading');
    
    try {
        // Create a temporary canvas to resize the image to 256x256 (not 28x28)
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = 256;  // Changed from 28 to 256
        tempCanvas.height = 256; // Changed from 28 to 256

        // Draw the original canvas image onto the temporary canvas with resizing
        tempCtx.drawImage(canvas, 0, 0, 256, 256);

        // Capture the resized image content as a data URL
        const dataURL = tempCanvas.toDataURL('image/png');
        console.log('Captured Resized Data URL:', dataURL);

        // Convert the data URL to a Blob
        const blob = dataURLToBlob(dataURL);
        console.log('Blob Info:', blob);

        // Prepare the form data
        const formData = new FormData();
        formData.append('file', blob, 'canvas_image.png');

        // Send the image to the backend for prediction
        const response = await fetch('http://localhost:5001/predict', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Backend Response:', data);
        
        // Show detailed results - Updated to handle 3 classes
        if (data.probabilities) {
            let resultHTML = `
                <div style="text-align: left;">
                    <h4 style="margin: 0 0 15px 0; text-align: center;">Prediction Results</h4>
                    <div style="margin-bottom: 10px;">
                        <strong>Predicted: ${data.predicted_class}</strong> (${data.confidence}%)
                    </div>
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; margin-top: 10px;">
            `;
            
            // Display all available probabilities
            for (const [className, probability] of Object.entries(data.probabilities)) {
                const percentage = (probability * 100).toFixed(1);
                resultHTML += `<div style="margin-bottom: 5px;">${className}: ${percentage}%</div>`;
            }
            
            resultHTML += `
                    </div>
                    <small style="color: #666; margin-top: 10px; display: block;">
                        Model info: ${data.debug_info?.model_expects || 'Model analysis complete'}
                    </small>
                </div>
            `;
            
            showResult(resultHTML, 'success');
        } else {
            showResult(data.predicted_class, 'success');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showResult(`Connection error. Please make sure the API server is running.`, 'error');
    } finally {
        // Restore button state
        predictButton.innerHTML = originalText;
        predictButton.disabled = false;
    }
});

// Function to show results with different styles
function showResult(message, type = 'info') {
    const resultContent = document.getElementById('result');
    
    let icon, bgColor, textColor;
    switch (type) {
        case 'success':
            icon = 'fas fa-check-circle';
            bgColor = '#d4edda';
            textColor = '#155724';
            break;
        case 'error':
            icon = 'fas fa-exclamation-circle';
            bgColor = '#f8d7da';
            textColor = '#721c24';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-triangle';
            bgColor = '#fff3cd';
            textColor = '#856404';
            break;
        case 'loading':
            icon = 'fas fa-spinner fa-spin';
            bgColor = '#d1ecf1';
            textColor = '#0c5460';
            break;
        default:
            icon = 'fas fa-info-circle';
            bgColor = '#d1ecf1';
            textColor = '#0c5460';
    }
    
    resultContent.innerHTML = `
        <div style="
            background: ${bgColor};
            color: ${textColor};
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            border: 1px solid ${textColor}20;
            animation: fadeInUp 0.5s ease;
        ">
            <i class="${icon}" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
            <p style="margin: 0; font-weight: 600; font-size: 1.1rem;">
                ${type === 'success' ? 'Predicted Character: ' : ''}${message}
            </p>
        </div>
    `;
}

// Function to convert data URL to Blob
function dataURLToBlob(dataURL) {
    const [header, data] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const byteString = atob(data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([uint8Array], { type: mime });
}

// Smooth scrolling functionality
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const elementPosition = element.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Navigation smooth scrolling
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .result-card, .learning-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
});

// Add loading animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
