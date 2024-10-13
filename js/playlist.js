let playlist = [];
let currentVideoIndex = 0;
let shuffle = false;
let loop = false;
let player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '240',
        width: '100%',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    init();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        handleVideoEnd();
    }
}

function init() {
    loadPlaylist();
    loadVideo(currentVideoIndex);
    renderQueue();
}

function loadPlaylist() {
    const urlParams = new URLSearchParams(window.location.search);
    const playlistName = urlParams.get('name');
    const playlists = JSON.parse(localStorage.getItem('playlists')) || {};
    playlist = playlists[playlistName] || [];
}

function renderQueue() {
    renderQueueItems(document.getElementById('videoListDesktop'));
    renderQueueItems(document.getElementById('videoListMobile'));
}

function renderQueueItems(container) {
    container.innerHTML = '';
    playlist.forEach((video, index) => {
        const div = document.createElement('div');
        div.classList.add('video-item');
        if (index === currentVideoIndex) {
            div.classList.add('active');
        }
        div.onclick = () => loadVideo(index);
        div.innerHTML = `
            <img src="https://img.youtube.com/vi/${video.videoId}/default.jpg" alt="Thumbnail">
            <div>${video.videoName}</div>
            <button class="btn btn-danger btn-sm ml-auto" onclick="removeVideo(${index}); event.stopPropagation();">Remove</button>
        `;
        container.appendChild(div);
    });
}

function loadVideo(index) {
    currentVideoIndex = index;
    const video = playlist[currentVideoIndex];
    player.loadVideoById(video.videoId);
    renderQueue();
}

function handleVideoEnd() {
    if (loop) {
        player.seekTo(0);
    } else if (shuffle) {
        loadVideo(Math.floor(Math.random() * playlist.length));
    } else {
        nextVideo();
    }
}

function nextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % playlist.length;
    loadVideo(currentVideoIndex);
}

function prevVideo() {
    currentVideoIndex = (currentVideoIndex - 1 + playlist.length) % playlist.length;
    loadVideo(currentVideoIndex);
}

function toggleShuffle() {
    shuffle = !shuffle;
    showAlert(`Shuffle mode: ${shuffle ? 'On' : 'Off'}`);
}

function toggleLoop() {
    loop = !loop;
    showAlert(`Loop mode: ${loop ? 'On' : 'Off'}`);
}

function removeVideo(index) {
    playlist.splice(index, 1);
    if (index < currentVideoIndex) {
        currentVideoIndex--;
    } else if (index === currentVideoIndex) {
        nextVideo(); // Load next video if the current one is removed
    }
    savePlaylist();
    renderQueue();
}

function savePlaylist() {
    const playlistName = new URLSearchParams(window.location.search).get('name');
    const playlists = JSON.parse(localStorage.getItem('playlists')) || {};
    playlists[playlistName] = playlist;
    localStorage.setItem('playlists', JSON.stringify(playlists));
}

function toggleMobileQueue() {
    const mobileQueue = document.getElementById('videoListMobile');
    mobileQueue.classList.toggle('open');
}

function showAlert(message) {
    const alertElement = document.getElementById('alert');
    const messageElement = document.getElementById('alert-message');
    messageElement.innerText = message;
    alertElement.classList.add('show');
    setTimeout(() => {
        alertElement.classList.remove('show');
    }, 3000);
}

function closeAlert() {
    const alertElement = document.getElementById('alert');
    alertElement.classList.remove('show');
}
