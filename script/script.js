const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

// Canvas drawing
canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});
canvas.addEventListener('mousemove', draw);

function draw(event) {
    if (!drawing) return;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
}

document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();  // Reset the path to avoid drawing issues
    document.getElementById('result').textContent = '';
});

document.getElementById('predict').addEventListener('click', async () => {
    try {
        // Create a temporary canvas to resize the image
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = 28;
        tempCanvas.height = 28;

        // Draw the original canvas image onto the temporary canvas with resizing
        tempCtx.drawImage(canvas, 0, 0, 28, 28);

        // Capture the resized image content as a data URL
        const dataURL = tempCanvas.toDataURL('image/png');
        console.log('Captured Resized Data URL:', dataURL);  // Log the Data URL

        // Convert the data URL to a Blob
        const blob = dataURLToBlob(dataURL);
        console.log('Blob Info:', blob);  // Log the Blob information

        // Prepare the form data
        const formData = new FormData();
        formData.append('file', blob, 'canvas_image.png');

        // Send the image to the backend for prediction
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Backend Response:', data);  // Log the response from the backend
        document.getElementById('result').textContent = `Prediction: ${data.predicted_class}`;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').textContent = `Error: ${error.message}`;
    }
});

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

// Tab switching
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const target = button.getAttribute('data-tab');
        tabContents.forEach(content => {
            content.style.display = content.id === target ? 'block' : 'none';
        });
    });
});

// Show the "Practice" tab by default
document.querySelector('.tab-button[data-tab="practice"]').click();
