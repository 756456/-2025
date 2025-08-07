// 壁纸和视频管理模块
let videoFiles = [];
let currentVideoIndex = 0;
let slideshowIntervalId = null;
let isSlideshowRunning = false;

// DOM元素
const wallpaperVideo = document.getElementById('wallpaper-video');
const wallpaperOverlay = document.getElementById('wallpaper-overlay');

// 处理文件夹选择
function handleFolderSelection(e) {
  const files = Array.from(e.target.files);
  const videoFiles = files.filter(file => file.type.startsWith('video/'));

  if (videoFiles.length > 0) {
    // 显示文件夹路径
    let folderPath = '';
    if (videoFiles[0].webkitRelativePath) {
      folderPath = videoFiles[0].webkitRelativePath.split('/')[0];
    } else {
      folderPath = `包含 ${videoFiles.length} 个视频文件的文件夹`;
    }
    document.getElementById('wallpaper-folder-path').value = folderPath;

    // 存储视频文件
    window.videoFiles = videoFiles.map(file => URL.createObjectURL(file));

    // 显示视频文件列表
    displayVideoFiles(videoFiles);

    // 开始播放第一个视频
    playVideo(0);

    // 保存视频文件到设置
    const settings = JSON.parse(localStorage.getItem('navigationSettings') || '{}');
    if (!settings.wallpaper) settings.wallpaper = {};
    settings.wallpaper.folderPath = folderPath;
    // 保存视频URLs（对于本地文件，只保存文件名而非完整路径，因为路径可能变化）
    settings.wallpaper.localFileNames = videoFiles.map(file => file.name);
    localStorage.setItem('navigationSettings', JSON.stringify(settings));
  } else {
    alert('未找到视频文件，请选择包含视频的文件夹');
  }
}

// 显示视频文件列表
function displayVideoFiles(files) {
  const listContainer = document.getElementById('video-files-list');
  listContainer.innerHTML = '';

  files.forEach((file, index) => {
    const fileName = file.name;
    const fileItem = document.createElement('div');
    fileItem.className = 'py-1 px-2 text-sm hover:bg-white/10 rounded transition-colors';
    fileItem.textContent = `${index + 1}. ${fileName}`;
    listContainer.appendChild(fileItem);
  });
}

// 显示视频URL列表
function displayVideoUrls(urls) {
  const listContainer = document.getElementById('video-files-list');
  listContainer.innerHTML = '';

  urls.forEach((url, index) => {
    const fileName = url.split('/').pop().split('?')[0];
    const fileItem = document.createElement('div');
    fileItem.className = 'py-1 px-2 text-sm hover:bg-white/10 rounded transition-colors';
    fileItem.textContent = `${index + 1}. ${fileName}`;
    listContainer.appendChild(fileItem);
  });
}

// 播放视频
function playVideo(index) {
  if (!window.videoFiles || window.videoFiles.length === 0) return;

  index = index % window.videoFiles.length;
  currentVideoIndex = index;

  const videoUrl = window.videoFiles[index];
  wallpaperVideo.src = videoUrl;
  wallpaperVideo.classList.remove('hidden');

  // 确保视频正确加载和播放
  wallpaperVideo.load();
  wallpaperVideo.play().catch(error => {
    console.error('视频播放失败:', error);
    alert('视频播放失败，请尝试其他视频文件');
  });

  // 应用当前的壁纸设置
  updateWallpaperSettings();
}

// 切换到下一个视频
function nextVideo() {
  currentVideoIndex = (currentVideoIndex + 1) % window.videoFiles.length;
  playVideo(currentVideoIndex);
}

// 切换轮播模式
function toggleSlideshow() {
  const enabled = document.getElementById('enable-slideshow').checked;

  if (enabled && window.videoFiles && window.videoFiles.length > 1) {
    // 启动轮播
    const interval = parseInt(document.getElementById('slideshow-interval').value) * 1000;
    // 清除已有的定时器
    if (slideshowIntervalId) clearInterval(slideshowIntervalId);
    slideshowIntervalId = setInterval(nextVideo, interval);
    isSlideshowRunning = true;
  } else {
    // 停止轮播
    clearInterval(slideshowIntervalId);
    isSlideshowRunning = false;
  }

  // 保存轮播设置
  const settings = JSON.parse(localStorage.getItem('navigationSettings') || '{}');
  if (!settings.wallpaper) settings.wallpaper = {};

  settings.wallpaper.enableSlideshow = enabled;
  settings.wallpaper.slideshowInterval = parseInt(document.getElementById('slideshow-interval').value);

  localStorage.setItem('navigationSettings', JSON.stringify(settings));
}

// 更新壁纸设置
function updateWallpaperSettings() {
  const brightness = document.getElementById('wallpaper-brightness').value;
  const opacity = document.getElementById('wallpaper-opacity').value;

  wallpaperOverlay.style.backgroundColor = `rgba(0, 0, 0, ${1 - parseFloat(opacity)})`;
  wallpaperVideo.style.filter = `brightness(${brightness})`;

  // 保存壁纸显示设置
  const settings = JSON.parse(localStorage.getItem('navigationSettings') || '{}');
  if (!settings.wallpaper) settings.wallpaper = {};

  settings.wallpaper.brightness = parseFloat(brightness);
  settings.wallpaper.opacity = parseFloat(opacity);

  localStorage.setItem('navigationSettings', JSON.stringify(settings));
}

document.addEventListener('DOMContentLoaded', () => {
  // 壁纸文件夹选择
  document.getElementById('select-wallpaper-folder').addEventListener('click', () => {
    const folderInput = document.getElementById('folder-input');
    folderInput.value = '';
    folderInput.click();
  });

  document.getElementById('folder-input').addEventListener('change', handleFolderSelection);

  // 轮播设置
  document.getElementById('enable-slideshow').addEventListener('change', toggleSlideshow);

  // 壁纸亮度和透明度调整
  document.getElementById('wallpaper-brightness').addEventListener('input', updateWallpaperSettings);
  document.getElementById('wallpaper-opacity').addEventListener('input', updateWallpaperSettings);
});