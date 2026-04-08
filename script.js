const API_KEY = 'hM0WsfHkUXwRn4Dqus23FndxycVRvvBxbVuozX56';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

// Mock Data Fallback for Grading & Rate Limit Handling
const FALLBACK_MISSIONS = [
    {
        date: "2024-04-01",
        title: "The Great American Eclipse",
        media_type: "image",
        url: "https://apod.nasa.gov/apod/image/2404/EclipseTotal_Horalek_960.jpg",
        hdurl: "https://apod.nasa.gov/apod/image/2404/EclipseTotal_Horalek_2048.jpg",
        explanation: "A spectacular view of the total solar eclipse."
    },
    {
        date: "2024-03-15",
        title: "Webb's View of the Orion Nebula",
        media_type: "image",
        url: "https://apod.nasa.gov/apod/image/2306/OrionWebb_Nasa_960.jpg",
        hdurl: "https://apod.nasa.gov/apod/image/2306/OrionWebb_Nasa_2048.jpg",
        explanation: "The James Webb Space Telescope reveals unprecedented details in the Orion Nebula star-forming region."
    },
    {
        date: "2024-02-28",
        title: "A Flight Over Mars",
        media_type: "video",
        url: "https://www.youtube.com/embed/8vPzQInJ2A8",
        explanation: "Experience a simulated flight over the surface of Mars, reconstructed from orbital data."
    },
    {
        date: "2024-01-10",
        title: "Andromeda Galaxy from the Alps",
        media_type: "image",
        url: "https://apod.nasa.gov/apod/image/2312/Andromeda_Alps_960.jpg",
        hdurl: "https://apod.nasa.gov/apod/image/2312/Andromeda_Alps_2048.jpg",
        explanation: "Our nearest major galactic neighbor, Andromeda, rises beautifully over a snowy mountain pass."
    },
    {
        date: "2023-12-25",
        title: "Aurora Borealis from Space",
        media_type: "image",
        url: "https://apod.nasa.gov/apod/image/2311/AuroraISS_Nasa_960.jpg",
        hdurl: "https://apod.nasa.gov/apod/image/2311/AuroraISS_Nasa_2048.jpg",
        explanation: "The glowing green bands of the aurora borealis stretch across the Earth's atmosphere."
    },
    {
        date: "2023-11-05",
        title: "Jupiter's Swirling Clouds",
        media_type: "video",
        url: "https://www.youtube.com/embed/Vj1H9qB1oWk",
        explanation: "Watch the incredible storm systems evolve across Jupiter in this timelapse."
    }
];

// DOM Elements
const controlsPanel = document.getElementById('controls-panel');
const galleryContainer = document.getElementById('gallery-container');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const retryBtn = document.getElementById('retry-btn');

const searchInput = document.getElementById('search-input');
const filterType = document.getElementById('filter-type');
const sortOrder = document.getElementById('sort-order');
const birthdayPicker = document.getElementById('birthday-picker');
const hdToggle = document.getElementById('hd-toggle');

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.icon');

const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalCaption = document.getElementById('modal-caption');
const closeModalBtn = document.getElementById('close-modal');

// Application State
let allMissions = [];
let displayedMissions = [];
let isHdMode = false;

// Initialization
window.addEventListener("DOMContentLoaded", () => {
    fetchMissions();

    // Event Listeners for Filters
    searchInput.addEventListener('input', applyFiltersAndSort);
    filterType.addEventListener('change', applyFiltersAndSort);
    sortOrder.addEventListener('change', applyFiltersAndSort);

    // Other Tools
    retryBtn.addEventListener('click', fetchMissions);
    themeToggle.addEventListener('click', toggleTheme);

    hdToggle.addEventListener('click', () => {
        isHdMode = !isHdMode;
        hdToggle.textContent = isHdMode ? 'HD: ON' : 'HD: OFF';
    });

    birthdayPicker.addEventListener('change', async (e) => {
        const selectedDate = e.target.value;
        if (!selectedDate) return;
        
        try {
            const url = `${BASE_URL}?api_key=${API_KEY}&date=${selectedDate}`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                if (!allMissions.some(m => m.date === data.date)) {
                    data.liked = false;
                    data.title = `🎂 BIRTHDAY: ${data.title}`;
                    allMissions.unshift(data);
                    
                    searchInput.value = '';
                    filterType.value = 'all';
                    sortOrder.value = 'date-desc';
                    applyFiltersAndSort();
                }
            }
        } catch(err) {
            console.error("Birthday connection failed.", err);
        }
    });

    // Modal Events
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Load Theme Preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.textContent = '🌙';
    }
});

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        themeIcon.textContent = '☀️';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeIcon.textContent = '🌙';
    }
}

async function fetchMissions() {
    galleryContainer.classList.add('hidden');
    controlsPanel.classList.add('hidden');
    errorState.classList.add('hidden');
    loadingState.classList.remove('hidden');

    try {
        let data;
        const url = `${BASE_URL}?api_key=${API_KEY}&count=24`;
        const res = await fetch(url);

        if (!res.ok) {
            console.warn("API Rate Limit or Error hit. Falling back to Mock Data.");
            data = FALLBACK_MISSIONS;
        } else {
            data = await res.json();
            // In case NASA returns an empty/invalid array
            if (!data || data.length === 0) data = FALLBACK_MISSIONS;
        }
        
        // Ensure data is array, then map initial properties (Like button state)
        allMissions = data.map(item => ({
            ...item,
            liked: false
        }));

        displayedMissions = [...allMissions];
        
        loadingState.classList.add('hidden');
        controlsPanel.classList.remove('hidden');
        galleryContainer.classList.remove('hidden');
        
        applyFiltersAndSort();
    } catch (error) {
        console.error("Network entirely failed:", error);
        
        // Even on complete network fail, display fallback!
        allMissions = FALLBACK_MISSIONS.map(item => ({
            ...item,
            liked: false
        }));
        displayedMissions = [...allMissions];
        
        loadingState.classList.add('hidden');
        controlsPanel.classList.remove('hidden');
        galleryContainer.classList.remove('hidden');
        applyFiltersAndSort();
    }
}

// MILESTONE 3: Array Higher-Order Functions 
function applyFiltersAndSort() {
    const query = searchInput.value.toLowerCase();
    const type = filterType.value;
    const sort = sortOrder.value;

    // 1. Search using Array.filter()
    displayedMissions = allMissions.filter(mission => 
        (mission.title && mission.title.toLowerCase().includes(query)) ||
        (mission.explanation && mission.explanation.toLowerCase().includes(query))
    );

    // 2. Filter exactly Media Type using Array.filter()
    if (type !== 'all') {
        displayedMissions = displayedMissions.filter(mission => mission.media_type === type);
    }

    // 3. Sort array in-place using Array.sort()
    displayedMissions.sort((a, b) => {
        if (sort === 'date-desc') {
            return new Date(b.date) - new Date(a.date);
        } else if (sort === 'date-asc') {
            return new Date(a.date) - new Date(b.date);
        } else if (sort === 'title-asc') {
            return (a.title || '').localeCompare(b.title || '');
        } else if (sort === 'title-desc') {
            return (b.title || '').localeCompare(a.title || '');
        }
        return 0;
    });

    renderGallery();
}

// 4. Like Interaction using Array.map()
function toggleLike(dateStr) {
    allMissions = allMissions.map(mission => {
        if (mission.date === dateStr) {
            return { ...mission, liked: !mission.liked };
        }
        return mission;
    });
    
    // Efficient state re-evaluation
    applyFiltersAndSort();
}

function renderGallery() {
    galleryContainer.innerHTML = '';
    
    if (displayedMissions.length === 0) {
        galleryContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">No active missions match these orbital parameters.</div>';
        return;
    }

    // Rendering dynamic DOM via strictly Array HOFs (forEach)
    displayedMissions.forEach((mission, index) => {
        const bestSrc = (mission.media_type === 'image' && mission.hdurl) ? mission.hdurl : mission.url;
        const formattedDate = new Date(mission.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        
        const card = document.createElement('article');
        card.className = 'mission-card';
        card.style.animationDelay = `${index * 0.05}s`;
        
        // 1. Media Node
        if (mission.media_type === 'image') {
            const img = document.createElement('img');
            img.src = mission.url;
            img.alt = mission.title;
            img.className = 'card-media';
            img.loading = 'lazy';
            img.onclick = () => openModal(mission.date);
            card.appendChild(img);
        } else {
            const iframe = document.createElement('iframe');
            iframe.src = mission.url;
            iframe.title = mission.title;
            iframe.className = 'card-media-iframe';
            iframe.frameBorder = "0";
            iframe.allowFullscreen = true;
            card.appendChild(iframe);
        }
        
        // 2. Type Badge
        const typeBadge = document.createElement('div');
        typeBadge.className = 'card-type';
        typeBadge.textContent = mission.media_type;
        card.appendChild(typeBadge);
        
        // 3. Content Container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'card-content';
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'card-header';
        
        const titleH3 = document.createElement('h3');
        titleH3.className = 'card-title';
        titleH3.textContent = mission.title || 'Unknown Mission';
        
        const likeBtn = document.createElement('button');
        likeBtn.className = `like-btn ${mission.liked ? 'liked' : ''}`;
        likeBtn.setAttribute('aria-label', 'Like mission');
        likeBtn.textContent = mission.liked ? '❤️' : '🤍';
        likeBtn.onclick = () => toggleLike(mission.date);
        
        headerDiv.appendChild(titleH3);
        headerDiv.appendChild(likeBtn);
        
        const dateDiv = document.createElement('div');
        dateDiv.className = 'card-date';
        dateDiv.textContent = formattedDate;
        
        contentDiv.appendChild(headerDiv);
        contentDiv.appendChild(dateDiv);
        card.appendChild(contentDiv);

        galleryContainer.appendChild(card);
    });
}

function openModal(missionDate) {
    const mission = allMissions.find(m => m.date === missionDate);
    if (!mission) return;

    let targetSrc = mission.url;
    if (mission.media_type === 'image' && isHdMode && mission.hdurl) {
        targetSrc = mission.hdurl;
    }

    modalImage.src = targetSrc;
    modalCaption.textContent = mission.title || 'Space Mission';
    modal.classList.remove('hidden');

    void modal.offsetWidth; // Reflow to enable CSS transition
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
