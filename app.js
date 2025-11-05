// ============================================
// PWA CÁMARA - Lógica Principal (app.js)
// ============================================

// 2.1. 🎣 Referencias a elementos del DOM
const openCameraBtn = document.getElementById('openCamera');
const cameraContainer = document.getElementById('cameraContainer');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const canvas = document.getElementById('canvas');
const statusDiv = document.getElementById('status');
const ctx = canvas.getContext('2d'); // Contexto 2D para dibujar en el Canvas

let stream = null; // Variable para almacenar el MediaStream de la cámara

// ============================================
// 2.2. 📹 Función openCamera(): Activación de la Cámara
// ============================================
async function openCamera() {
    try {
        // 1. Definición de Restricciones (Constraints)
        const constraints = {
            video: {
                facingMode: { ideal: 'environment' }, // Solicita la cámara trasera
                width: { ideal: 320 },
                height: { ideal: 240 }
            }
        };

        // 2. Obtener el Stream de Medios
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // 3. Asignar el Stream al Elemento <video>
        video.srcObject = stream;
        
        // 4. Actualización de la UI
        cameraContainer.classList.add('active');
        openCameraBtn.textContent = 'Cámara Abierta';
        openCameraBtn.disabled = true;
        
        // Configurar el tamaño del canvas al tamaño del video
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        };
        
        mostrarEstado('✅ Cámara abierta exitosamente', 'success');
        console.log('✅ Cámara abierta exitosamente');
    } catch (error) {
        console.error('❌ Error al acceder a la cámara:', error);
        mostrarEstado('❌ No se pudo acceder a la cámara. Asegúrate de dar permisos.', 'error');
        alert('No se pudo acceder a la cámara. Asegúrate de dar permisos.');
    }
}

// ============================================
// 2.3. 📸 Función takePhoto(): Captura y Procesamiento
// ============================================
function takePhoto() {
    if (!stream) {
        alert('Primero debes abrir la cámara');
        mostrarEstado('❌ Primero debes abrir la cámara', 'error');
        return;
    }

    // 1. Dibujar el Frame de Video en el Canvas
    // El método drawImage() es clave: toma el <video> como fuente.
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // 2. Conversión a Data URL (Base64)
    const imageDataURL = canvas.toDataURL('image/png');
    
    // 3. Visualización y Depuración en Consola
    console.log('📸 Foto capturada en base64:');
    console.log(imageDataURL);
    console.log('Tamaño en caracteres:', imageDataURL.length);
    
    mostrarEstado('📸 Foto capturada! Revisa la consola del navegador.', 'success');
    
    // 4. Cierre de la Cámara (Para liberar recursos)
    closeCamera();
}

// ============================================
// 2.4. 🛑 Función closeCamera(): Liberación de Recursos
// ============================================
function closeCamera() {
    if (stream) {
        // Detener todos los tracks del stream (video, audio, etc.)
        stream.getTracks().forEach(track => track.stop());
        stream = null; // Limpiar la referencia

        // Limpiar y ocultar UI
        video.srcObject = null;
        cameraContainer.classList.remove('active');
        
        // Restaurar el botón 'Abrir Cámara'
        openCameraBtn.textContent = 'Abrir Cámara';
        openCameraBtn.disabled = false;
        
        console.log('🛑 Cámara cerrada');
    }
}

// ============================================
// Función auxiliar para mostrar estado
// ============================================
function mostrarEstado(mensaje, tipo) {
    statusDiv.textContent = mensaje;
    statusDiv.className = `status ${tipo}`;
    statusDiv.style.display = 'block';
    
    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}

// ============================================
// 2.5. 🖱️ Event Listeners y Limpieza
// ============================================

// Event listeners para la interacción del usuario
openCameraBtn.addEventListener('click', openCamera);
takePhotoBtn.addEventListener('click', takePhoto);

// Limpiar stream cuando el usuario cierra o navega fuera de la página
window.addEventListener('beforeunload', () => {
    closeCamera();
});

console.log('✅ app.js cargado correctamente');
