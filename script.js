const API_KEY = 'hM0WsfHkUXwRn4Dqus23FndxycVRvvBxbVuozX56';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

const dateInput = document.getElementById('apod-date');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const contentState = document.getElementById('content-state');
const retryBtn = document.getElementById('retry-btn');

const mediaContainer = document.getElementById('media-container');
const apodTitle = document.getElementById('apod-title');
const apodDateDisplay = document.getElementById('apod-date-display');
const apodExplanation = document.getElementById('apod-explanation');
const errorTitle = document.getElementById('error-title');
const errorMessage = document.getElementById('error-message');

const hdToggleBtn = document.getElementById('hd-toggle');
const hdStatus = hdToggleBtn.querySelector('.hd-status');

const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalCaption = document.getElementById('modal-caption');
const closeModalBtn = document.getElementById('close-modal');

let currentApodData = null;
let isHdMode = false;

window.addEventListener("DOMContentLoaded", () => {
    setupDateConstraints();
    fetchAPOD();

    dateInput.addEventListener("change", (e) => {
        const selectedDate = e.target.value;
        if (!selectedDate) return;
        fetchAPOD(selectedDate);
    });

    retryBtn.addEventListener('click', () => {
        const selectedDate = dateInput.value;
        fetchAPOD(selectedDate || undefined);
    });

    hdToggleBtn.addEventListener('click', toggleHdMode);

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});

function setupDateConstraints() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.max = `${year}-${month}-${day}`;
}

function showLoading() {
    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    contentState.classList.add('hidden');
}

function showError(title = 'Uplink Failed', message = 'Unable to retrieve mission data. Please check connection.') {
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
    contentState.classList.add('hidden');

    errorTitle.textContent = title;
    errorMessage.textContent = message;
}

function showContent() {
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    contentState.classList.remove('hidden');
}

async function fetchAPOD(date) {
    try {
        showLoading();

        const url = `${BASE_URL}?api_key=${API_KEY}${date ? `&date=${date}` : ''}`;
        const res = await fetch(url);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.msg || "API response failed");
        }

        const data = await res.json();

        if (!data || data.error) {
            throw new Error("Invalid data received");
        }

        currentApodData = data;
        isHdMode = false;

        renderAPOD(data);

    } catch (error) {
        console.error(error);

        let title = 'Uplink Failed';
        let msg = 'We encountered an anomaly while accessing the NASA database.';

        if (error.message.includes('Date must be between')) {
            title = 'Invalid Stardate';
            msg = 'Selected date is outside the mission logs. Try a date from June 16, 1995 onwards.';
        } else if (!navigator.onLine) {
            title = 'Signal Lost';
            msg = 'No network connection detected. Please check your system.';
        } else if (error.message !== "API response failed") {
            msg = error.message;
        }

        showError(title, msg);
    }
}

function formatDisplayDate(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

function renderAPOD(data) {
    mediaContainer.innerHTML = '';

    if (data.media_type === 'image' && data.hdurl && data.url !== data.hdurl) {
        hdToggleBtn.classList.remove('hidden');
        updateHdBtnUI();
    } else {
        hdToggleBtn.classList.add('hidden');
    }

    if (data.media_type === "image") {
        const targetUrl = isHdMode ? data.hdurl : data.url;

        const img = document.createElement('img');
        img.src = targetUrl;
        img.alt = data.title;
        img.loading = 'lazy';

        img.addEventListener('click', () => openModal(isHdMode ? data.hdurl : data.url, data.title));

        mediaContainer.appendChild(img);

    } else if (data.media_type === "video") {
        const iframe = document.createElement('iframe');
        iframe.src = data.url;
        iframe.title = data.title;
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;

        mediaContainer.style.cursor = 'default';
        mediaContainer.appendChild(iframe);
    } else {
        mediaContainer.innerHTML = '<div style="color: var(--text-secondary); text-align: center;">Media format not supported.</div>';
    }

    apodTitle.textContent = data.title || 'Unknown Mission';
    apodDateDisplay.textContent = formatDisplayDate(data.date);
    apodExplanation.textContent = data.explanation || 'No explanation available.';

    if (data.date && dateInput.value !== data.date) {
        dateInput.value = data.date;
    }

    showContent();
}

function toggleHdMode() {
    if (!currentApodData || currentApodData.media_type !== 'image') return;

    isHdMode = !isHdMode;
    updateHdBtnUI();

    renderAPOD(currentApodData);
}

function updateHdBtnUI() {
    hdToggleBtn.classList.toggle('active', isHdMode);
    hdStatus.textContent = isHdMode ? 'HD ON' : 'HD OFF';
}

function openModal(src, title) {
    const bestSrc = (currentApodData && currentApodData.hdurl) ? currentApodData.hdurl : src;

    modalImage.src = bestSrc;
    modalCaption.textContent = title;
    modal.classList.remove('hidden');

    void modal.offsetWidth;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';

    setTimeout(() => {
        modal.classList.add('hidden');
        modalImage.src = '';
    }, 400);
}
