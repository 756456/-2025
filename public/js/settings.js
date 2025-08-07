// 设置管理模块

// 保存设置
function saveSettings() {
  const settings = {
    wallpaper: {
      folderPath: document.getElementById('wallpaper-folder-path').value,
      videoUrls: document.getElementById('wallpaper-urls').value,
      brightness: parseFloat(document.getElementById('wallpaper-brightness').value),
      opacity: parseFloat(document.getElementById('wallpaper-opacity').value),
      enableSlideshow: document.getElementById('enable-slideshow').checked,
      slideshowInterval: parseInt(document.getElementById('slideshow-interval').value),
      transitionEffect: document.getElementById('transition-effect').value
    },
    position: {
      datetime: {
        top: parseInt(document.getElementById('datetime-top').value),
        bottom: parseInt(document.getElementById('datetime-bottom').value),
        left: parseInt(document.getElementById('datetime-left').value),
        right: parseInt(document.getElementById('datetime-right').value)
      },
      search: {
        top: parseInt(document.getElementById('search-top').value),
        bottom: parseInt(document.getElementById('search-bottom').value),
        left: parseInt(document.getElementById('search-left').value),
        right: parseInt(document.getElementById('search-right').value)
      },
      icons: {
        top: parseInt(document.getElementById('icons-top').value),
        bottom: parseInt(document.getElementById('icons-bottom').value),
        left: parseInt(document.getElementById('icons-left').value),
        right: parseInt(document.getElementById('icons-right').value)
      }
    },
    icons: {
      frameWidth: parseInt(document.getElementById('icon-frame-width').value),
      frameHeight: parseInt(document.getElementById('icon-frame-height').value),
      defaultSize: parseInt(document.getElementById('default-icon-size').value),
      gridGap: parseInt(document.getElementById('icon-grid-gap').value),
      showLabels: document.getElementById('show-icon-labels').checked,
      dropShadow: document.getElementById('icon-drop-shadow').checked,
      alignment: window.currentAlignment || 'center'
    },
    search: {
      engine: document.querySelector('input[name="search-engine"]:checked').id,
      customUrl: document.getElementById('custom-search-url').value,
      style: {
        height: parseInt(document.getElementById('search-input-height').value),
        radius: parseInt(document.getElementById('search-input-radius').value),
        width: parseInt(document.getElementById('search-input-width').value)
      }
    }
  };

  localStorage.setItem('navigationSettings', JSON.stringify(settings));

  // 应用设置
  applySettings(settings);

  // 处理视频URLs
  if (settings.wallpaper.videoUrls) {
    const urls = settings.wallpaper.videoUrls.split('\n').filter(url => url.trim());
    if (urls.length > 0) {
      window.videoFiles = urls;
      displayVideoUrls(urls);
      playVideo(0);
    }
  }

  // 刷新应用图标以应用新设置
  loadApps();

  alert('设置已保存');
  closeSettingsModal();
}

// 加载设置
function loadSettings() {
  const savedSettings = localStorage.getItem('navigationSettings');

  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    applySettings(settings);
  } else {
    // 应用默认位置设置
    updateElementPosition();
    updateSearchBoxStyle();
  }
}

// 应用设置
function applySettings(settings) {
  // 壁纸设置
  if (settings.wallpaper) {
    document.getElementById('wallpaper-folder-path').value = settings.wallpaper.folderPath || '';
    document.getElementById('wallpaper-urls').value = settings.wallpaper.videoUrls || '';
    document.getElementById('wallpaper-brightness').value = settings.wallpaper.brightness || 0.7;
    document.getElementById('wallpaper-opacity').value = settings.wallpaper.opacity || 0.9;
    document.getElementById('enable-slideshow').checked = settings.wallpaper.enableSlideshow || false;
    document.getElementById('slideshow-interval').value = settings.wallpaper.slideshowInterval || 60;
    document.getElementById('transition-effect').value = settings.wallpaper.transitionEffect || 'fade';

    // 应用壁纸效果
    updateWallpaperSettings();

    // 处理视频URLs
    if (settings.wallpaper.videoUrls) {
      const urls = settings.wallpaper.videoUrls.split('\n').filter(url => url.trim());
      if (urls.length > 0) {
        window.videoFiles = urls;
        displayVideoUrls(urls);
        playVideo(0);
      }
    }

    // 启动或停止轮播
    toggleSlideshow();
  }

  // 位置设置
  if (settings.position) {
    // 时间日期位置
    if (settings.position.datetime) {
      document.getElementById('datetime-top').value = settings.position.datetime.top || 5;
      document.getElementById('datetime-bottom').value = settings.position.datetime.bottom || 95;
      document.getElementById('datetime-left').value = settings.position.datetime.left || 5;
      document.getElementById('datetime-right').value = settings.position.datetime.right || 95;

      document.getElementById('datetime-top-value').textContent = `${settings.position.datetime.top || 5}%`;
      document.getElementById('datetime-bottom-value').textContent = `${settings.position.datetime.bottom || 95}%`;
      document.getElementById('datetime-left-value').textContent = `${settings.position.datetime.left || 5}%`;
      document.getElementById('datetime-right-value').textContent = `${settings.position.datetime.right || 95}%`;
    }

    // 搜索框位置
    if (settings.position.search) {
      document.getElementById('search-top').value = settings.position.search.top || 30;
      document.getElementById('search-bottom').value = settings.position.search.bottom || 70;
      document.getElementById('search-left').value = settings.position.search.left || 25;
      document.getElementById('search-right').value = settings.position.search.right || 75;

      document.getElementById('search-top-value').textContent = `${settings.position.search.top || 30}%`;
      document.getElementById('search-bottom-value').textContent = `${settings.position.search.bottom || 70}%`;
      document.getElementById('search-left-value').textContent = `${settings.position.search.left || 25}%`;
      document.getElementById('search-right-value').textContent = `${settings.position.search.right || 75}%`;
    }

    // 图标位置
    if (settings.position.icons) {
      document.getElementById('icons-top').value = settings.position.icons.top || 40;
      document.getElementById('icons-bottom').value = settings.position.icons.bottom || 10;
      document.getElementById('icons-left').value = settings.position.icons.left || 5;
      document.getElementById('icons-right').value = settings.position.icons.right || 5;

      document.getElementById('icons-top-value').textContent = `${settings.position.icons.top || 40}%`;
      document.getElementById('icons-bottom-value').textContent = `${settings.position.icons.bottom || 10}%`;
      document.getElementById('icons-left-value').textContent = `${settings.position.icons.left || 5}%`;
      document.getElementById('icons-right-value').textContent = `${settings.position.icons.right || 5}%`;
    }

    // 应用位置设置
    updateElementPosition();
  }

  // 图标设置
  if (settings.icons) {
    // 图标框架设置
    document.getElementById('icon-frame-width').value = settings.icons.frameWidth || 80;
    document.getElementById('icon-frame-height').value = settings.icons.frameHeight || 96;

    // 图标显示设置
    document.getElementById('default-icon-size').value = settings.icons.defaultSize || 64;
    document.getElementById('icon-grid-gap').value = settings.icons.gridGap || 32;
    document.getElementById('show-icon-labels').checked = settings.icons.showLabels !== false;
    document.getElementById('icon-drop-shadow').checked = settings.icons.dropShadow !== false;

    // 图标位置设置
    window.currentAlignment = settings.icons.alignment || 'center';

    // 应用图标对齐
    document.querySelectorAll('.icon-alignment-btn').forEach(btn => {
      if (btn.getAttribute('data-align') === window.currentAlignment) {
        btn.classList.remove('bg-white/10', 'hover:bg-white/20', 'border', 'border-white/20');
        btn.classList.add('bg-primary', 'text-white');
      } else {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('bg-white/10', 'hover:bg-white/20', 'border', 'border-white/20');
      }
    });

    // 应用图标网格间距
    document.getElementById('apps-container').style.gap = `${settings.icons.gridGap || 32}px`;

    // 应用图标位置
    updateIconPosition();
  }

  // 搜索设置
  if (settings.search) {
    // 选中对应的搜索引擎
    document.querySelectorAll('input[name="search-engine"]').forEach(radio => {
      radio.checked = radio.id === settings.search.engine;
    });

    // 显示或隐藏自定义搜索URL
    if (settings.search.engine === 'search-custom') {
      document.getElementById('custom-search-url-container').classList.remove('hidden');
    }

    document.getElementById('custom-search-url').value = settings.search.customUrl || '';

    // 应用搜索框样式
    if (settings.search.style) {
      document.getElementById('search-input-height').value = settings.search.style.height || 48;
      document.getElementById('search-input-radius').value = settings.search.style.radius || 24;
      document.getElementById('search-input-width').value = settings.search.style.width || 50;

      document.getElementById('search-input-height-value').textContent = `${settings.search.style.height || 48}px`;
      document.getElementById('search-input-radius-value').textContent = `${settings.search.style.radius || 24}px`;
      document.getElementById('search-input-width-value').textContent = `${settings.search.style.width || 50}%`;

      updateSearchBoxStyle();
    }
  }
}

// 重置设置
function resetSettings() {
  if (confirm('确定要恢复默认设置吗？这将清除您所有的自定义设置。')) {
    localStorage.removeItem('navigationSettings');
    // 保留用户添加的图标，但恢复已删除的默认图标
    const userApps = JSON.parse(localStorage.getItem('customApps') || '[]')
      .filter(app => !app.id.startsWith('default-'));
    localStorage.setItem('customApps', JSON.stringify(userApps));

    loadSettings();
    loadApps();
  }
}

// 打开设置弹窗
function openSettingsModal() {
  document.getElementById('settings-modal').classList.remove('hidden');
  document.getElementById('settings-modal').classList.add('flex');
}

// 关闭设置弹窗
function closeSettingsModal() {
  document.getElementById('settings-modal').classList.add('hidden');
  document.getElementById('settings-modal').classList.remove('flex');
}

// 打开应用图标弹窗
function openAppModal(appId = null) {
  // 重置表单
  document.getElementById('app-id').value = '';
  document.getElementById('app-name').value = '';
  document.getElementById('app-url').value = '';
  document.getElementById('app-image-url').value = '';
  document.getElementById('app-icon-size').value = 64;
  document.getElementById('app-image-preview').src = 'https://picsum.photos/64/64';
  document.getElementById('image-url-container').classList.add('hidden');

  // 如果是编辑模式
  if (appId) {
    const app = getAppById(appId);
    if (app) {
      document.getElementById('app-id').value = app.id;
      document.getElementById('app-name').value = app.name;
      document.getElementById('app-url').value = app.url;
      document.getElementById('app-icon-size').value = app.size || 64;
      document.getElementById('app-image-preview').src = app.image;

      // 如果是URL图片，显示URL输入框
      if (app.image.startsWith('http')) {
        document.getElementById('image-url-container').classList.remove('hidden');
        document.getElementById('app-image-url').value = app.image;
      }

      document.getElementById('app-modal-title').textContent = '编辑图标';
    }
  } else {
    document.getElementById('app-modal-title').textContent = '添加自定义图标';
  }

  document.getElementById('app-modal').classList.remove('hidden');
  document.getElementById('app-modal').classList.add('flex');
}

// 关闭应用图标弹窗
function closeAppModal() {
  document.getElementById('app-modal').classList.add('hidden');
  document.getElementById('app-modal').classList.remove('flex');
}

document.addEventListener('DOMContentLoaded', () => {
  // 设置弹窗操作
  document.getElementById('close-settings').addEventListener('click', closeSettingsModal);
  document.getElementById('save-settings').addEventListener('click', saveSettings);
  document.getElementById('reset-settings').addEventListener('click', resetSettings);

  // 设置标签页切换
  document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      // 移除所有标签的活跃状态
      document.querySelectorAll('.settings-tab').forEach(t => {
        t.classList.remove('active', 'border-b-2', 'border-primary');
        t.classList.add('text-white/70');
      });

      // 添加当前标签的活跃状态
      tab.classList.add('active', 'border-b-2', 'border-primary');
      tab.classList.remove('text-white/70');

      // 隐藏所有内容
      document.querySelectorAll('.settings-content').forEach(content => {
        content.classList.add('hidden');
        content.classList.remove('active');
      });

      // 显示当前内容
      const tabId = tab.getAttribute('data-tab');
      document.getElementById(`${tabId}-settings`).classList.remove('hidden');
      document.getElementById(`${tabId}-settings`).classList.add('active');
    });
  });

  // 图标对齐按钮
  document.querySelectorAll('.icon-alignment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.icon-alignment-btn').forEach(b => {
        b.classList.remove('bg-primary', 'text-white');
        b.classList.add('bg-white/10', 'hover:bg-white/20', 'border', 'border-white/20');
      });

      btn.classList.remove('bg-white/10', 'hover:bg-white/20', 'border', 'border-white/20');
      btn.classList.add('bg-primary', 'text-white');

      window.currentAlignment = btn.getAttribute('data-align');
      updateIconPosition();
    });
  });

  // 搜索引擎设置
  document.querySelectorAll('input[name="search-engine"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const customContainer = document.getElementById('custom-search-url-container');
      if (document.getElementById('search-custom').checked) {
        customContainer.classList.remove('hidden');
      } else {
        customContainer.classList.add('hidden');
      }
    });
  });
});

// 添加设置按钮点击事件监听
document.addEventListener('DOMContentLoaded', function() {
  const settingsButton = document.getElementById('settings-button');
  const settingsPanel = document.getElementById('settings-panel');

  if (settingsButton && settingsPanel) {
    settingsButton.addEventListener('click', function() {
      settingsPanel.classList.toggle('hidden');
    });
  }
});