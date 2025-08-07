// 应用管理模块
let currentAppId = null;

// 加载应用图标
function loadApps() {
  const userApps = JSON.parse(localStorage.getItem('customApps') || '[]');
  const defaultApps = [
    {
      id: 'default-doubao',
      name: '豆包',
      url: 'https://www.doubao.com',
      image: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuov/xhsnapshot/obj/media-fe/pdc_fe_ocean_ugc/80c9318c83c14639b1426964c7d8d00.png',
      size: 64
    },
    {
      id: 'default-baidu',
      name: '百度',
      url: 'https://www.baidu.com',
      image: 'https://www.baidu.com/img/bd_logo1.png',
      size: 64
    },
    {
      id: 'default-bilibili',
      name: '哔哩哔哩',
      url: 'https://www.bilibili.com',
      image: 'https://www.bilibili.com/favicon.ico',
      size: 64
    },
    {
      id: 'default-douyin',
      name: '抖音',
      url: 'https://www.douyin.com',
      image: 'https://lf1-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuov/xhsnapshot/obj/media-fe/xgplayer-doc/douyin.png',
      size: 64
    }
  ];

  // 找出用户删除的默认应用ID
  const deletedDefaultAppIds = defaultApps
    .map(app => app.id)
    .filter(id => !userApps.some(userApp => userApp.id === id));

  // 合并默认应用（排除已删除的）和用户自定义应用
  const allApps = [
    ...defaultApps.filter(app => !deletedDefaultAppIds.includes(app.id)),
    ...userApps.filter(app => !app.id.startsWith('default-'))
  ];

  // 清空容器
  const appsContainer = document.getElementById('apps-container');
  appsContainer.innerHTML = '';

  // 添加应用图标
  allApps.forEach(app => {
    const appElement = createAppElement(app);
    appsContainer.appendChild(appElement);
  });

  // 应用图标框架设置
  updateIconFrames();
}

// 创建应用图标元素
function createAppElement(app) {
  const appElement = document.createElement('div');
  appElement.className = 'app-icon';
  appElement.setAttribute('data-id', app.id);

  // 应用图标框架大小
  const frameWidth = document.getElementById('icon-frame-width').value;
  const frameHeight = document.getElementById('icon-frame-height').value;
  appElement.style.width = `${frameWidth}px`;
  appElement.style.height = `${frameHeight}px`;

  // 设置点击事件
  appElement.addEventListener('click', () => {
    window.open(app.url, '_blank');
  });

  // 设置右键事件
  appElement.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    currentAppId = app.id;
    showAppContextMenu(e, app.id);
  });

  // 图标图片
  const imgElement = document.createElement('img');
  imgElement.src = app.image;
  imgElement.alt = app.name;
  imgElement.className = 'app-icon-img';
  imgElement.style.width = `${app.size}px`;
  imgElement.style.height = `${app.size}px`;

  // 图标名称
  const nameElement = document.createElement('span');
  nameElement.className = 'app-icon-name';
  nameElement.textContent = app.name;

  // 应用阴影设置
  if (document.getElementById('icon-drop-shadow').checked) {
    imgElement.classList.add('shadow-lg');
  } else {
    imgElement.classList.remove('shadow-lg');
  }

  // 应用标签显示设置
  if (!document.getElementById('show-icon-labels').checked) {
    nameElement.classList.add('hidden');
  } else {
    nameElement.classList.remove('hidden');
  }

  appElement.appendChild(imgElement);
  appElement.appendChild(nameElement);

  return appElement;
}

// 更新图标框架大小
function updateIconFrames() {
  const frameWidth = document.getElementById('icon-frame-width').value;
  const frameHeight = document.getElementById('icon-frame-height').value;

  document.querySelectorAll('.app-icon').forEach(icon => {
    icon.style.width = `${frameWidth}px`;
    icon.style.height = `${frameHeight}px`;
  });

  // 保存图标框架设置
  const settings = JSON.parse(localStorage.getItem('navigationSettings') || '{}');
  if (!settings.icons) settings.icons = {};

  settings.icons.frameWidth = parseInt(frameWidth);
  settings.icons.frameHeight = parseInt(frameHeight);

  localStorage.setItem('navigationSettings', JSON.stringify(settings));
}

// 保存应用数据
function saveAppData(appData) {
  const apps = JSON.parse(localStorage.getItem('customApps') || '[]');

  // 检查是否已存在该应用
  const existingIndex = apps.findIndex(app => app.id === appData.id);

  if (existingIndex >= 0) {
    // 更新现有应用
    apps[existingIndex] = appData;
  } else {
    // 添加新应用
    apps.push(appData);
  }

  localStorage.setItem('customApps', JSON.stringify(apps));
}

// 根据ID获取应用
function getAppById(appId) {
  // 先从用户应用中查找
  let apps = JSON.parse(localStorage.getItem('customApps') || '[]');
  let app = apps.find(app => app.id === appId);

  // 如果是默认应用且未找到，从默认应用中查找
  if (!app && appId.startsWith('default-')) {
    const defaultApps = [
      {
        id: 'default-doubao',
        name: '豆包',
        url: 'https://www.doubao.com',
        image: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuov/xhsnapshot/obj/media-fe/pdc_fe_ocean_ugc/80c9318c83c14639b1426964c7d8d00.png',
        size: 64
      },
      {
        id: 'default-baidu',
        name: '百度',
        url: 'https://www.baidu.com',
        image: 'https://www.baidu.com/img/bd_logo1.png',
        size: 64
      },
      {
        id: 'default-bilibili',
        name: '哔哩哔哩',
        url: 'https://www.bilibili.com',
        image: 'https://www.bilibili.com/favicon.ico',
        size: 64
      },
      {
        id: 'default-douyin',
        name: '抖音',
        url: 'https://www.douyin.com',
        image: 'https://lf1-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuov/xhsnapshot/obj/media-fe/xgplayer-doc/douyin.png',
        size: 64
      }
    ];
    app = defaultApps.find(app => app.id === appId);
  }

  return app;
}

// 删除应用图标
function deleteApp(appId) {
  // 确认是否为默认应用
  const isDefaultApp = appId.startsWith('default-');

  if (isDefaultApp) {
    if (confirm('这是默认图标，确定要删除吗？删除后可以通过重置设置恢复。')) {
      performDelete(appId);
    }
  } else {
    if (confirm('确定要删除这个图标吗？')) {
      performDelete(appId);
    }
  }
}

// 执行删除操作
function performDelete(appId) {
  // 获取所有应用（包括默认应用）
  let allApps = JSON.parse(localStorage.getItem('customApps') || '[]');

  // 过滤掉要删除的应用
  const updatedApps = allApps.filter(app => app.id !== appId);

  // 保存更新后的应用列表
  localStorage.setItem('customApps', JSON.stringify(updatedApps));

  // 重新加载应用
  loadApps();
}

// 编辑应用图标
function editApp(appId) {
  openAppModal(appId);
}

// 保存应用图标
function saveApp() {
  const appId = document.getElementById('app-id').value || generateId();
  const name = document.getElementById('app-name').value.trim();
  const url = document.getElementById('app-url').value.trim();
  const size = parseInt(document.getElementById('app-icon-size').value);

  // 验证输入
  if (!name || !url) {
    alert('请填写图标名称和链接地址');
    return;
  }

  // 获取图片地址
  let image = document.getElementById('app-image-preview').src;

  // 准备应用数据
  const appData = {
    id: appId,
    name,
    url,
    image,
    size,
    createdAt: new Date().toISOString()
  };

  // 保存应用
  saveAppData(appData);

  // 刷新应用列表
  loadApps();

  // 关闭弹窗
  closeAppModal();
}

// 从网站获取图标
function fetchWebsiteFavicon() {
  const url = document.getElementById('app-url').value.trim();

  if (!url) {
    alert('请先输入网站URL');
    return;
  }

  try {
    // 解析URL获取域名
    const parsedUrl = new URL(url);
    const domain = parsedUrl.origin;

    // 常见的favicon路径
    const faviconPaths = [
      '/favicon.ico',
      '/apple-touch-icon.png',
      '/apple-touch-icon-precomposed.png',
      '/favicon.png',
      '/favicon.svg'
    ];

    // 尝试获取favicon
    const previewImg = document.getElementById('app-image-preview');
    const originalSrc = previewImg.src;

    // 显示加载状态
    previewImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNMzg0IDM5MmMwIDEwLjYtOC40IDIwLTIwIDIwdjE5LjljMCAxMC42LTguNCAyMC0yMCAyMEg4MGMtMTAuNiAwLTIwLTguNC0yMC0yMFY0MTJjMC0xMC42IDguNC0yMCAyMC0yMGgyOTZjMi41IDAgNC45LjQgNy4xIDEuMWwzMi44LTMyLjhjMi4yLTIuMiAyLjItNS43IDAtNy45bC0zMi44LTMyLjhjLTIuMi0yLjItNS43LTIuMi03LjkgMGgtOTZjLTEwLjYgMC0yMCA4LjQtMjAgMjB2NDhjMCAxMC42IDguNCAyMCAyMCAyMGgyOTZjMTAuNiAwIDIwLTguNCAyMC0yMFY0MTJ6TTI1NiAxOTJjMzYuNCAwIDY0IDI3LjYgNjQgNjRzLTI3LjYgNjQtNjQgNjQtNjQtMjcuNi02NC02NHMyNy42LTY0IDY0LTY0em0wIDEwNGMtMjIuMSAwLTQwLTE3LjktNDAtNDBzMTcuOS00MCA0MC00MCA0MCAxNy45IDQwIDQwLTE3LjkgNDAtNDAgNDB6Ii8+PC9zdmc+';

    // 尝试各种可能的favicon路径
    let found = false;

    const tryFavicon = (index) => {
      if (index >= faviconPaths.length || found) return;

      const faviconUrl = domain + faviconPaths[index];
      const testImg = new Image();

      testImg.onload = () => {
        // 找到有效的favicon
        found = true;
        previewImg.src = faviconUrl;
        document.getElementById('image-url-container').classList.remove('hidden');
        document.getElementById('app-image-url').value = faviconUrl;
      };

      testImg.onerror = () => {
        // 尝试下一个路径
        tryFavicon(index + 1);
      };

      testImg.src = faviconUrl + '?t=' + new Date().getTime(); // 防止缓存
    };

    // 开始尝试
    tryFavicon(0);

    // 如果全部尝试失败，恢复原始图片
    setTimeout(() => {
      if (!found) {
        previewImg.src = originalSrc;
        alert('无法获取该网站的图标，请尝试手动设置');
      }
    }, 5000);

  } catch (error) {
    alert('URL格式不正确，请检查输入');
    console.error('获取favicon错误:', error);
  }
}

// 处理本地图片选择
function handleLocalImageSelection(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById('app-image-preview').src = event.target.result;
      document.getElementById('image-url-container').classList.add('hidden');
    };
    reader.readAsDataURL(file);
  }
}

// 处理图片URL变化
function handleImageUrlChange() {
  const url = this.value;
  if (url) {
    // 测试图片URL是否有效
    const testImg = new Image();
    testImg.onload = () => {
      document.getElementById('app-image-preview').src = url;
    };
    testImg.onerror = () => {
      alert('图片URL无效，请检查链接');
    };
    testImg.src = url;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 应用弹窗操作
  document.getElementById('close-app-modal').addEventListener('click', closeAppModal);
  document.getElementById('cancel-app').addEventListener('click', closeAppModal);
  document.getElementById('save-app').addEventListener('click', saveApp);

  // 获取网站图标按钮
  document.getElementById('fetch-favicon').addEventListener('click', fetchWebsiteFavicon);

  // 图标图片选择
  document.getElementById('select-local-image').addEventListener('click', () => {
    document.getElementById('local-image-input').click();
  });

  document.getElementById('use-image-url').addEventListener('click', () => {
    document.getElementById('image-url-container').classList.remove('hidden');
    document.getElementById('app-image-url').focus();
  });

  document.getElementById('local-image-input').addEventListener('change', handleLocalImageSelection);
  document.getElementById('app-image-url').addEventListener('input', handleImageUrlChange);
});