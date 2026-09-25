const root = document.documentElement;
const cover = document.querySelector('.cover');
const begin = document.querySelector('#begin');
const song = document.querySelector('#love-song');
const note = document.querySelector('#audio-note');
const musicToggle = document.querySelector('#music-toggle');
const shareLetter = document.querySelector('#share-letter');
const shareNote = document.querySelector('#share-note');
const spotifyUrl = 'https://open.spotify.com/track/3Z8hY7Drj0nZ6f5YpCKTg1';
const revealables = [...document.querySelectorAll('.letter p, .reveal')];

function setDawn() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const progress = Math.max(0, Math.min(1, scrollY / Math.max(max, 1)));
  root.style.setProperty('--progress', progress.toFixed(4));
}
function revealLetter() {
  const line = innerHeight * .92;
  revealables.forEach(item => {
    if (item.getBoundingClientRect().top < line) item.classList.add('visible');
  });
}
function update() { setDawn(); revealLetter(); }
addEventListener('scroll', update, { passive:true }); addEventListener('resize', update); update();

begin.addEventListener('click', async () => {
  cover.classList.add('is-gone');
  window.scrollTo({ top: innerHeight * .56, behavior:'smooth' });
  try { await song.play(); }
  catch { openSpotify(); }
});

function openSpotify() {
  const spotify = window.open(spotifyUrl, '_blank', 'noopener');
  if (!spotify) window.location.assign(spotifyUrl);
}

function setMusicButton(playing) {
  musicToggle.querySelector('span').textContent = playing ? 'Ⅱ' : '▶';
  musicToggle.setAttribute('aria-label', playing ? 'Pause Love Song' : 'Play Love Song');
  musicToggle.setAttribute('aria-pressed', String(playing));
}
song.addEventListener('play', () => setMusicButton(true));
song.addEventListener('pause', () => setMusicButton(false));
musicToggle.addEventListener('click', async () => {
  if (song.paused) {
    try { await song.play(); }
    catch { openSpotify(); }
  } else song.pause();
});

shareLetter.addEventListener('click', async () => {
  const message = 'Life, Yousef — a letter for you.';
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Life, Yousef', text: message, url: location.href });
      return;
    }
    await navigator.clipboard.writeText(location.href);
    shareNote.textContent = 'Link copied — ready to send.';
  } catch (error) {
    if (error.name !== 'AbortError') shareNote.textContent = 'Copy this page’s link from your browser to send it.';
  }
});
