// 主应用初始化模块

// 初始化事件监听器
function initializeEventListeners() {
  // 右键菜单事件
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.display = 'none';
  });

  // 主页面右键菜单
  document.getElementById('main-container').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
    contextMenu.style.display = 'block';
  });

  // 关闭右键菜单
  document.getElementById('close-context-menu').addEventListener('click', () => {
    document.getElementById('context-menu').style.display = 'none';
  });

  // 打开设置
  document.getElementById('open-settings-from-menu').addEventListener('click', () => {
    openSettingsModal();
    document.getElementById('context-menu').style.display = 'none';
  });

  // 图标位置控制滑块
  document.querySelectorAll('.position-control').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const target = e.target;
      const valueDisplay = document.getElementById(`${target.id}-value`);
      valueDisplay.textContent = target.id.includes('search-input-width') ? `${target.value}%` : `${target.value}px`;
      updateElementPosition();
    });
  });

  // 图标框架尺寸控制
  document.getElementById('icon-frame-width').addEventListener('input', updateIconFrameSize);
  document.getElementById('icon-frame-height').addEventListener('input', updateIconFrameSize);

  // 图标显示设置
  document.getElementById('default-icon-size').addEventListener('input', updateIconSizes);
  document.getElementById('icon-grid-gap').addEventListener('input', (e) => {
    document.getElementById('apps-container').style.gap = `${e.target.value}px`;
    saveCurrentSettings();
  });
  document.getElementById('show-icon-labels').addEventListener('change', (e) => {
    document.querySelectorAll('.app-label').forEach(label => {
      label.style.display = e.target.checked ? 'block' : 'none';
    });
    saveCurrentSettings();
  });
  document.getElementById('icon-drop-shadow').addEventListener('change', (e) => {
    document.querySelectorAll('.app-icon').forEach(icon => {
      if (e.target.checked) {
        icon.classList.add('shadow-lg', 'shadow-black/30');
      } else {
        icon.classList.remove('shadow-lg', 'shadow-black/30');
      }
    });
    saveCurrentSettings();
  });

  // 添加应用按钮
  document.getElementById('add-app-btn').addEventListener('click', () => openAppModal());
  document.getElementById('close-app-modal').addEventListener('click', closeAppModal);
  document.getElementById('save-app').addEventListener('click', saveApp);
}

// 保存当前设置状态
function saveCurrentSettings() {
  // 这是一个辅助函数，用于在设置面板交互过程中保存当前状态
  // 实际保存到localStorage的操作在saveSettings()中完成
}

// 初始化应用
function initializeApp() {
  // 初始化时间显示
  updateTime();
  setInterval(updateTime, 60000);

  // 加载设置
  loadSettings();

  // 加载应用
  loadApps();

  // 设置默认搜索引擎
  if (!document.querySelector('input[name="search-engine"]:checked')) {
    document.getElementById('search-google').checked = true;
  }
}

// 主程序入口
window.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  initializeApp();
});