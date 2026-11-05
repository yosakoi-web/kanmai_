/* ==========================================================
   神舞ホームページ：ここを変更すると表示を更新できます
   GitHub Pages 対応／ライブラリやビルド不要
   ========================================================== */

// 【予定表】追加する時は以下の [ ] の中に行を増やしてください。
// 記入例： { date: '2027.01.10', title: '〇〇まつり', place: '愛知県〇〇市', time: '13:00〜' },
// 未定の間は空の [ ] のままでOK。
const EVENTS = [
];

// 【YouTube】チャンネルURLが決まったら、'' 内に貼り付けてください。
const YOUTUBE_CHANNEL_URL = '';
// 【YouTube】動画1本をサイト内に埋め込む場合は、動画URLの v= の後ろのIDを記入。
// 例：https://www.youtube.com/watch?v=XXXXXXXXXXX なら 'XXXXXXXXXXX'
const YOUTUBE_VIDEO_ID = '';

// 【写真】assets/photos/photo1.jpg 〜 photo6.jpg を置くと自動表示します。
// 写真の見出しはここで変更できます（アップロードだけなら変更不要）。
const PHOTO_CAPTIONS = [
  '神舞の写真 1', '神舞の写真 2', '神舞の写真 3',
  '神舞の写真 4', '神舞の写真 5', '神舞の写真 6'
];

/* ==========================================================
   ここから下は基本的に変更不要です
   ========================================================== */

const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const sidebarBackdrop = document.querySelector('.sidebar-backdrop');
const navLinks = [...document.querySelectorAll('.nav-link')];
function closeMenu() {
  sidebar.classList.remove('is-open');
  sidebarBackdrop.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'メニューを開く');
}
function openMenu() {
  sidebar.classList.add('is-open');
  sidebarBackdrop.classList.add('is-open');
  document.body.classList.add('menu-open');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'メニューを閉じる');
}
menuToggle.addEventListener('click', () => sidebar.classList.contains('is-open') ? closeMenu() : openMenu());
sidebarBackdrop.addEventListener('click', closeMenu);
window.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});
navLinks.forEach(link => link.addEventListener('click', closeMenu));
document.querySelectorAll('.sidebar-brand, .mobile-brand').forEach(link => link.addEventListener('click', closeMenu));
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

// 現在選んでいるページ位置をサイドメニューへ反映
const sections = ['top', 'message', 'youtube', 'photos', 'members'].map(id => document.getElementById(id));
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting);
    if (!visible.length) return;
    const target = visible.sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    let activeId = target.target.id;
    navLinks.forEach(link => {
      const active = link.dataset.nav === activeId;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, {rootMargin:'-10% 0px -55% 0px', threshold:[0, .1, .35, .6]});
  sections.forEach(section => navObserver.observe(section));
}

const scheduleList = document.getElementById('schedule-list');
if (EVENTS.length) {
  scheduleList.innerHTML = '';
  EVENTS.forEach(event => {
    const item = document.createElement('article');
    item.className = 'schedule-item';
    const date = document.createElement('div');
    date.className = 'schedule-date';
    date.textContent = event.date || '日付未定';
    const body = document.createElement('div');
    body.className = 'schedule-item-body';
    const heading = document.createElement('h3');
    heading.textContent = event.title || 'イベント';
    const place = document.createElement('p');
    place.textContent = event.place || '会場未定';
    body.append(heading, place);
    const time = document.createElement('div');
    time.className = 'schedule-time';
    time.textContent = event.time || '';
    item.append(date, body, time);
    scheduleList.append(item);
  });
}

// 同じファイル名の集合写真を置くだけで表示されます
const groupFrame = document.querySelector('[data-group-photo]');
const groupPhoto = new Image();
groupPhoto.onload = () => {
  groupPhoto.alt = '総踊連合 神舞の集合写真';
  groupPhoto.tabIndex = 0;
  groupFrame.appendChild(groupPhoto);
  groupFrame.classList.add('has-photo');
};
groupPhoto.src = 'assets/group.jpg';

// 写真は最大6枚。存在する写真だけを表示します
const photoGallery = document.getElementById('photo-gallery');
let photoCount = 0;
for (let i = 1; i <= 6; i++) {
  const img = new Image();
  // 表示前の画像に lazy を設定すると読み込み待ちになるため、ここでは通常読み込み
  img.alt = PHOTO_CAPTIONS[i-1];
  img.tabIndex = 0;
  img.onload = () => {
    if (photoCount === 0) photoGallery.innerHTML = '';
    photoCount++;
    const figure = document.createElement('figure');
    figure.className = 'gallery-photo';
    const caption = document.createElement('figcaption');
    caption.textContent = PHOTO_CAPTIONS[i-1];
    figure.append(img,caption);
    // 画像の読み込み順に関わらず番号順で配置
    figure.dataset.order = String(i);
    const later = [...photoGallery.children].find(el => Number(el.dataset.order) > i);
    photoGallery.insertBefore(figure, later || null);
  };
  img.src = `assets/photos/photo${i}.jpg`;
}

// YouTubeのURLを追加すると表示が切り替わります
const youtubeLink = document.getElementById('youtube-link');
const youtubeEmbed = document.getElementById('youtube-embed');
const youtubePlaceholder = document.getElementById('youtube-placeholder');
if (YOUTUBE_CHANNEL_URL.trim()) {
  youtubeLink.href = YOUTUBE_CHANNEL_URL.trim();
  youtubeLink.hidden = false;
  youtubePlaceholder.hidden = true;
}
if (/^[A-Za-z0-9_-]{11}$/.test(YOUTUBE_VIDEO_ID.trim())) {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID.trim()}`;
  iframe.title = '神舞 YouTube動画';
  iframe.loading = 'lazy';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  youtubeEmbed.appendChild(iframe);
  youtubeEmbed.hidden = false;
  youtubePlaceholder.hidden = true;
}

document.getElementById('copyright-year').textContent = new Date().getFullYear();


/* 写真をクリックすると拡大表示（集合写真・写真ページ・募集画像） */
const lightbox = document.createElement('div');
lightbox.className = 'photo-lightbox';
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute('aria-label', '写真の拡大表示');
lightbox.hidden = true;

const lightboxClose = document.createElement('button');
lightboxClose.type = 'button';
lightboxClose.className = 'photo-lightbox-close';
lightboxClose.setAttribute('aria-label', '拡大表示を閉じる');
lightboxClose.textContent = '×';

const lightboxBody = document.createElement('figure');
lightboxBody.className = 'photo-lightbox-body';
const lightboxImage = document.createElement('img');
lightboxImage.alt = '';
const lightboxCaption = document.createElement('figcaption');
lightboxBody.append(lightboxImage, lightboxCaption);
lightbox.append(lightboxClose, lightboxBody);
document.body.appendChild(lightbox);

let lightboxPreviousFocus = null;
function openLightbox(image) {
  lightboxPreviousFocus = document.activeElement;
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt || '写真';
  lightboxCaption.textContent = image.closest('.gallery-photo')?.querySelector('figcaption')?.textContent || image.alt || '';
  lightbox.hidden = false;
  document.body.classList.add('lightbox-open');
  lightboxClose.focus();
}
function closeLightbox() {
  if (lightbox.hidden) return;
  lightbox.hidden = true;
  document.body.classList.remove('lightbox-open');
  lightboxImage.removeAttribute('src');
  if (lightboxPreviousFocus instanceof HTMLElement) lightboxPreviousFocus.focus();
}

// ギャラリーの写真はあとから追加されるため、イベントを親要素で受け取る
photoGallery.addEventListener('click', event => {
  const image = event.target.closest('.gallery-photo img');
  if (image) openLightbox(image);
});
// キーボードでも画像を開けるよう、追加後の写真にフォーカスを設定
photoGallery.addEventListener('keydown', event => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const image = event.target.closest('.gallery-photo img');
  if (image) {
    event.preventDefault();
    openLightbox(image);
  }
});
const zoomableStaticImages = [groupFrame, document.querySelector('.recruitment-image')];
zoomableStaticImages.forEach(element => {
  if (!element) return;
  if (element.matches('img')) element.tabIndex = 0;
  element.addEventListener('click', event => {
    const image = event.target.closest('img');
    if (image) openLightbox(image);
  });
  element.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const image = event.target.closest('img');
    if (!image) return;
    event.preventDefault();
    openLightbox(image);
  });
});
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});
window.addEventListener('keydown', event => {
  if (!lightbox.hidden && event.key === 'Escape') closeLightbox();
});
