// 检查是否在Cloudflare Workers环境
const isWorkersEnv = typeof window === 'undefined';

// 存储API封装
const Storage = {
  async get(key) {
    if (isWorkersEnv) {
      // Workers环境使用KV
      const value = await NAV_SETTINGS.get(key);
      return value ? JSON.parse(value) : null;
    } else {
      // 浏览器环境使用localStorage
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    }
  },
  
  async set(key, value) {
    if (isWorkersEnv) {
      // Workers环境使用KV
      await NAV_SETTINGS.put(key, JSON.stringify(value));
    } else {
      // 浏览器环境使用localStorage
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  
  async remove(key) {
    if (isWorkersEnv) {
      // Workers环境使用KV
      await NAV_SETTINGS.delete(key);
    } else {
      // 浏览器环境使用localStorage
      localStorage.removeItem(key);
    }
  }
};

// 导出存储实例
window.Storage = Storage;