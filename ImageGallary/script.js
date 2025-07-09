document.documentElement.style.scrollBehavior="smooth";
const API_KEY = 'BdLairY7294Cbh15kTC25VcFJtkHh2VskkbCGdZfc4J5Nc1sqXJH0PV6';

let currentIndex = 0;
let images = [];
let page = 1;
let currentCategory = 'all';

const gallery = document.querySelector('.gallery');
const video = document.getElementById('bg-video');
const nav = document.getElementById('nav');


function openLightbox(img) {
  document.getElementById('lightbox').style.display = 'flex';
  document.getElementById('lightbox-img').src = img.src;
  currentIndex = images.findIndex(i => i.src === img.src);
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
}

function changeImage(step) {
  currentIndex = (currentIndex + step + images.length) % images.length;
  document.getElementById('lightbox-img').src = images[currentIndex].src;
}

function applyFilter(category) {
  currentCategory = category;
  page = 1;
  images = [];
  gallery.innerHTML = '';
  loadImages(category, page);
}

function loadImages(query, pageNum) {
  const keyword = query === 'all' ? 'random' : query;
  fetch(`https://api.pexels.com/v1/search?query=${keyword}&per_page=9&page=${pageNum}`, {
    headers: { Authorization: API_KEY }
  })
    .then(res => res.json())
    .then(data => {
      data.photos.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.src.large;
        img.className = query;
        img.alt = query;
        img.onclick = () => openLightbox(img);
        gallery.appendChild(img);
        images.push(img);
      });
    })
    .catch(err => console.error('Error loading images:', err));
}

function loadBackgroundVideo() {
  const randomPage = Math.floor(Math.random() * 50) + 1;
  fetch(`https://api.pexels.com/videos/popular?per_page=10&page=${randomPage}`, {
    headers: { Authorization: API_KEY }
  })
    .then(res => res.json())
    .then(data => {
      const videoFile = data.videos[Math.floor(Math.random() * data.videos.length)]
        ?.video_files.find(v => v.quality === 'sd' || v.quality === 'hd');
      if (videoFile) {
        video.src = videoFile.link;
        video.load();
        video.play();
      }
    })
    .catch(err => console.error("Error loading video:", err));
}


window.addEventListener('scroll', () => {
  const bottomReached = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100;
  if (bottomReached) {
    page++;
    loadImages(currentCategory, page);
  }
});


let lastScrollTop = 0;
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  nav.style.top = scrollTop > lastScrollTop ? '-100px' : '0px';
  lastScrollTop = Math.max(0, scrollTop);
});


window.addEventListener('load', () => {
  loadImages(currentCategory, page);
  document.body.style.paddingTop = `${nav.offsetHeight + 20}px`;
  loadBackgroundVideo();
});


video.addEventListener('ended', loadBackgroundVideo);
