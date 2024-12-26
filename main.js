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
const progressPopup = document.getElementById('progressPopup');
const progressCircle = document.querySelector('.progress-ring__circle');
const progressText = document.getElementById('progressText');
const progressStatus = document.getElementById('progressStatus');

// Constants
const MAX_FILE_SIZE_MB = 8;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const API_ENDPOINT = 'https://vibevision.ai/api/generate-video/bikini-bottom-news';
const DEBUG = false;  // Set to false in production

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
    if (event) event.preventDefault();
    
    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = 'Generating...';
    
    const formData = new FormData();
    let hasContent = false;
    
    if (customToggle.classList.contains('active')) {
        const customText = document.getElementById('customText').value;
        if (!customText.trim()) {
            alert('Please enter some text.');
            resetSubmitButton();
            return;
        }
        formData.append('customText', customText);
        hasContent = true;
    } else {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file to upload.');
            resetSubmitButton();
            return;
        }
        formData.append('file', file);
        hasContent = true;
    }

    if (!hasContent) {
        alert('Please either upload a file or enter custom text.');
        resetSubmitButton();
        return;
    }

    formData.append('userName', 'Bikini Bottom News!');
    
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to generate video');
        }

        if (data.videoUrl) {
            // Update video player
            videoPlayer.src = data.videoUrl;
            downloadBtn.href = data.videoUrl;
            
            // Show generated video container
            sampleVideoContainer.classList.add('hidden');
            generatedVideoContainer.classList.remove('hidden');
            
            // Play the video
            const playPromise = videoPlayer.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Auto-play was prevented:", error);
                });
            }
            
            // Update play/pause button state
            playPauseBtn.querySelector('.play-icon').classList.add('hidden');
            playPauseBtn.querySelector('.pause-icon').classList.remove('hidden');
        } else {
            throw new Error('No video URL returned from the server');
        }

        if (DEBUG) {
            console.log('Response:', response);
            console.log('Response status:', response.status);
            console.log('Response data:', data);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Failed to generate video: ${error.message}`);
    } finally {
        resetSubmitButton();
    }
}

// Helper function to reset submit button state
function resetSubmitButton() {
    submitButton.disabled = false;
    submitButton.innerHTML = '<span class="relative z-10 text-lg font-semibold">CREATE NEWS</span><span class="relative z-10 animate-pulse">✨</span>';
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

// Add this function to update the progress
function updateProgress(percent, status) {
    const circumference = 2 * Math.PI * 20; // r=20
    const offset = circumference - (percent / 100 * circumference);
    progressCircle.style.strokeDashoffset = offset;
    progressText.textContent = `${Math.round(percent)}%`;
    if (status) {
        progressStatus.textContent = status;
    }
}

// Add this function to show/hide the progress popup
function toggleProgressPopup(show) {
    progressPopup.classList.toggle('hidden', !show);
    if (show) {
        progressCircle.classList.add('rotating');
    } else {
        progressCircle.classList.remove('rotating');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded');
    
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log('Starting video generation...');
            
            const formData = new FormData();
            let hasContent = false;
            
            // Validate content before showing progress popup
            if (customToggle.classList.contains('active')) {
                const customText = document.getElementById('customText').value;
                if (!customText.trim()) {
                    alert('Please enter some text.');
                    return;
                }
                formData.append('customText', customText);
                hasContent = true;
            } else {
                const file = fileInput.files[0];
                if (!file) {
                    alert('Please select a file to upload.');
                    return;
                }
                formData.append('file', file);
                hasContent = true;
            }

            if (!hasContent) {
                alert('Please either upload a file or enter custom text.');
                return;
            }

            // Only show progress popup after validation passes
            toggleProgressPopup(true);
            updateProgress(0, 'Starting generation...');
            
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...';

            try {
                // Simulate progress while waiting for the API
                let progress = 0;
                const progressInterval = setInterval(() => {
                    progress += Math.random() * 15;
                    if (progress > 90) progress = 90;
                    updateProgress(progress, 'Processing your content...');
                }, 1000);

                const response = await fetch(API_ENDPOINT, {
                    method: 'POST',
                    body: formData
                });

                clearInterval(progressInterval);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Show completion
                updateProgress(100, 'Video generated!');
                setTimeout(() => {
                    toggleProgressPopup(false);
                }, 1500);

                if (data.videoUrl) {
                    // Update video player
                    videoPlayer.src = data.videoUrl;
                    downloadBtn.href = data.videoUrl;
                    
                    // Show generated video container
                    sampleVideoContainer.classList.add('hidden');
                    generatedVideoContainer.classList.remove('hidden');
                    
                    // Play the video
                    const playPromise = videoPlayer.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log("Auto-play was prevented:", error);
                        });
                    }
                    
                    // Update play/pause button state
                    playPauseBtn.querySelector('.play-icon').classList.add('hidden');
                    playPauseBtn.querySelector('.pause-icon').classList.remove('hidden');
                } else {
                    throw new Error('No video URL in response');
                }
            } catch (error) {
                console.error('Error generating video:', error);
                updateProgress(0, 'Generation failed');
                setTimeout(() => {
                    toggleProgressPopup(false);
                }, 1500);
                alert(`Failed to generate video: ${error.message}`);
            } finally {
                resetSubmitButton();
            }
        });
    } else {
        console.error('Submit button not found');
    }
    
    toggleSections(true);
    createBubbles();
}); 