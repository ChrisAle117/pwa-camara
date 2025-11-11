// ============================================
// PWA CÁMARA - Lógica Principal (app.js)
// ============================================

// 2.1. 🎣 Referencias a elementos del DOM
const openCameraBtn = document.getElementById('openCamera');
const toggleCameraBtn = document.getElementById('toggleCamera');
const cameraContainer = document.getElementById('cameraContainer');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const canvas = document.getElementById('canvas');
const gallery = document.getElementById('gallery');
const ctx = canvas.getContext('2d');

let stream = null;
let useFrontCamera = false;
let photos = [];

// ============================================
// 2.2. 📹 Función openCamera(): Activación de la Cámara
// ============================================
async function openCamera() {
    try {
        const constraints = {
            video: {
                facingMode: useFrontCamera ? 'user' : 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        cameraContainer.style.display = 'block';
        openCameraBtn.textContent = 'Cámara Abierta';
        openCameraBtn.disabled = true;
        toggleCameraBtn.disabled = false;
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        };
        console.log('✅ Cámara abierta');
    } catch (error) {
        console.error('❌ Error:', error);
        alert('No se pudo acceder a la cámara');
    }
}

function toggleCamera() {
    useFrontCamera = !useFrontCamera;
    closeCamera();
    openCamera();
}
// ============================================
// 2.3. 📸 Función takePhoto(): Captura y Procesamiento
// ============================================
function takePhoto() {
    if (!stream) {
        alert('Primero debes abrir la cámara');
        return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataURL = canvas.toDataURL('image/png');
    console.log('📸 Foto capturada en base64:');
    console.log(imageDataURL);
    photos.push(imageDataURL);
    renderGallery();
    closeCamera();
}

function renderGallery() {
    gallery.innerHTML = '';
    photos.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Foto tomada';
        gallery.appendChild(img);
    });
}
// ============================================
// 2.4. 🛑 Función closeCamera(): Liberación de Recursos
// ============================================
function closeCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        video.srcObject = null;
        cameraContainer.style.display = 'none';
        openCameraBtn.textContent = 'Abrir Cámara';
        openCameraBtn.disabled = false;
        toggleCameraBtn.disabled = false;
        console.log('🛑 Cámara cerrada');
    }
}

openCameraBtn.addEventListener('click', openCamera);
toggleCameraBtn.addEventListener('click', toggleCamera);
takePhotoBtn.addEventListener('click', takePhoto);
window.addEventListener('beforeunload', () => closeCamera());
