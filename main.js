// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadForm = document.getElementById('uploadForm');
const loader = document.getElementById('loader');
const videoPlayer = document.getElementById('videoPlayer');
const sampleVideo = document.getElementById('sampleVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const muteBtn = document.getElementById('muteBtn');
const volumeSlider = document.getElementById('volumeSlider');
const downloadBtn = document.getElementById('downloadBtn');
const createAgainBtn = document.getElementById('createAgainBtn');
const generatedVideoContainer = document.getElementById('generatedVideoContainer');
const sampleVideoContainer = document.getElementById('sampleVideoContainer');
const fileToggle = document.getElementById('fileToggle');
const customToggle = document.getElementById('customToggle');
const fileUploadSection = document.getElementById('fileUploadSection');
const customTextSection = document.getElementById('customTextSection');
const submitButton = document.getElementById('submitButton');

// Constants
const MAX_FILE_SIZE_MB = 8;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const API_ENDPOINT = 'https://vibevision.ai/api/generate-video/bikini-bottom-news';

// File Upload Handlers
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#00FFFF';
    dropZone.style.background = 'rgba(0, 255, 255, 0.1)';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#48D1CC';
    dropZone.style.background = 'transparent';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
        fileInput.files = files;
        handleFileSelect(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFileSelect(e.target.files[0]);
    }
});

function handleFileSelect(file) {
    if (file.size > MAX_FILE_SIZE_BYTES) {
        alert(`File size exceeds ${MAX_FILE_SIZE_MB} MB. Please upload a smaller file.`);
        fileInput.value = '';
        return;
    }
    dropZone.querySelector('p').textContent = `Selected: ${file.name}`;
}

// Form Submission
async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData();
    
    if (customToggle.classList.contains('active')) {
        const customText = document.getElementById('customText').value;
        if (!customText.trim()) {
            alert('Please enter some text.');
            return;
        }
        formData.append('customText', customText);
    } else {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }
        formData.append('file', file);
    }

    formData.append('userName', 'Bikini Bottom News!');
    
    loader.style.display = 'block';

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload file');

        const data = await response.json();

        if (data.videoUrl) {
            videoPlayer.src = data.videoUrl;
            downloadBtn.href = data.videoUrl;
            sampleVideoContainer.classList.add('hidden');
            generatedVideoContainer.classList.remove('hidden');
            videoPlayer.play();
        } else {
            alert('No video URL returned from the server.');
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    } finally {
        loader.style.display = 'none';
    }
}

// Video Controls
playPauseBtn.addEventListener('click', () => {
    if (videoPlayer.paused) {
        videoPlayer.play();
        playPauseBtn.querySelector('.play-icon').classList.add('hidden');
        playPauseBtn.querySelector('.pause-icon').classList.remove('hidden');
    } else {
        videoPlayer.pause();
        playPauseBtn.querySelector('.play-icon').classList.remove('hidden');
        playPauseBtn.querySelector('.pause-icon').classList.add('hidden');
    }
});

muteBtn.addEventListener('click', () => {
    videoPlayer.muted = !videoPlayer.muted;
    muteBtn.querySelector('.volume-icon').classList.toggle('hidden');
    muteBtn.querySelector('.mute-icon').classList.toggle('hidden');
});

volumeSlider.addEventListener('input', (e) => {
    videoPlayer.volume = e.target.value;
    videoPlayer.muted = false;
    muteBtn.querySelector('.volume-icon').classList.remove('hidden');
    muteBtn.querySelector('.mute-icon').classList.add('hidden');
});

createAgainBtn.addEventListener('click', () => {
    fileInput.value = '';
    dropZone.querySelector('p').textContent = 'Drop your files here or browse';
    generatedVideoContainer.classList.add('hidden');
    sampleVideoContainer.classList.remove('hidden');
});

// Toggle Sections
function toggleSections(showFile = true) {
    fileToggle.classList.toggle('active', showFile);
    customToggle.classList.toggle('active', !showFile);
    fileUploadSection.classList.toggle('hidden', !showFile);
    customTextSection.classList.toggle('hidden', showFile);
}

fileToggle.addEventListener('click', () => toggleSections(true));
customToggle.addEventListener('click', () => toggleSections(false));

// Floating Bubbles
function createBubbles() {
    const bubbleContainer = document.querySelector('.floating-bubbles');
    for (let i = 0; i < 50; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.cssText = `
            position: absolute;
            bottom: -20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${Math.random() * 8 + 4}s linear infinite;
            left: ${Math.random() * 100}vw;
            width: ${Math.random() * 30 + 5}px;
            height: ${Math.random() * 30 + 5}px;
        `;
        bubbleContainer.appendChild(bubble);
    }
}

// Character counter for custom text
const customText = document.getElementById('customText');
const charCount = document.getElementById('charCount');

customText.addEventListener('input', function() {
    const count = this.value.length;
    charCount.textContent = count;
    
    // Optional: Add visual feedback when approaching limit
    if (count > 900) {
        charCount.classList.add('text-yellow-400');
    } else {
        charCount.classList.remove('text-yellow-400');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    toggleSections(true);
    createBubbles();
    submitButton.addEventListener('click', handleFormSubmit);
}); 