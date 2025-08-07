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

  // 格式化时间
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  timeElement.textContent = `${hours}:${minutes}`;

  // 格式化日期
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekday = weekdays[now.getDay()];
  dateElement.textContent = `${year}-${month}-${day} 星期${weekday}`;
}

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
  setInterval(updateTime, 60000); // 每分钟更新一次
});