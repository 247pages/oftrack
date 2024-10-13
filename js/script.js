// scripts.js

document.addEventListener('DOMContentLoaded', loadPlaylists);

function loadPlaylists() {
    const playlistsDiv = document.getElementById('playlists');
    playlistsDiv.innerHTML = '';
    const playlists = JSON.parse(localStorage.getItem('playlists')) || {};

    if (Object.keys(playlists).length === 0) {
        // Adding inline styles to the message
        playlistsDiv.innerHTML = '<p style="color: #ff4d4d; font-size: 1.2em; text-align: center; font-weight: bold; margin-top: 20px;">No playlists available. Add a new song to create one!</p>';
    } else {
        for (const playlistName in playlists) {
            const div = document.createElement('div');
            div.classList.add('playlist');
            div.textContent = playlistName;
            div.onclick = () => openPlaylistPage(playlistName);
            playlistsDiv.appendChild(div);
        }
    }
}

function openAddPage() {
    window.location.href = '/oftrack/add.html';
}

function openPlaylistPage(playlistName) {
    window.location.href = `/oftrack/playlist.html?name=${encodeURIComponent(playlistName)}`;
}
