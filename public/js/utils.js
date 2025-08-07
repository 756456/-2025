// 工具函数模块

// 处理搜索请求
function handleSearch(event) {
  event.preventDefault();
  const searchInput = document.getElementById('search-input');
  const query = searchInput.value.trim();

  if (query) {
    // 获取选中的搜索引擎
    const searchEngine = document.querySelector('input[name="search-engine"]:checked').id;
    let url = '';

    // 根据搜索引擎构建URL
    switch(searchEngine) {
      case 'search-google':
        url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        break;
      case 'search-bing':
        url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
        break;
      case 'search-duckduckgo':
        url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
        break;
      case 'search-yahoo':
        url = `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`;
        break;
      case 'search-custom':
        const customUrl = document.getElementById('custom-search-url').value;
        url = customUrl.replace('{{query}}', encodeURIComponent(query));
        break;
      default:
        url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }

    // 在新标签页打开搜索结果
    window.open(url, '_blank');
    searchInput.value = '';
  }
}

// 更新时间显示
function updateTime() {
  const now = new Date();
  const timeElement = document.getElementById('time');
  const dateElement = document.getElementById('date');

  if (timeElement && dateElement) {
    // 格式化时间为 HH:MM:SS 格式
    timeElement.textContent = now.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    // 格式化日期为 星期 月 日 格式
    dateElement.textContent = now.toLocaleDateString('zh-CN', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  }
}

// 修改时间更新间隔为1秒(1000ms)并立即执行一次
updateTime();
setInterval(updateTime, 1000);

// 生成唯一ID
function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

// 初始化工具函数相关事件
document.addEventListener('DOMContentLoaded', () => {
  // 搜索表单提交
  document.getElementById('search-form').addEventListener('submit', handleSearch);

  // 初始化时间并每秒更新
  updateTime();
  setInterval(updateTime, 1000); // 从60000改为1000（每秒更新）
});
// ... existing code ...