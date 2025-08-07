addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 从KV存储获取设置
  const settings = await NAV_SETTINGS.get('user_settings', 'json') || {};
  
  // 路由请求
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 提供静态文件 (从KV获取)
  if (path === '/' || path === '/index.html') {
    const htmlContent = await NAV_SETTINGS.get('assets/index.html');
    if (!htmlContent) return new Response('Not found', { status: 404 });
    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } else if (path.endsWith('.css')) {
    const cssContent = await NAV_SETTINGS.get(`assets${path}`);
    if (!cssContent) return new Response('Not found', { status: 404 });
    return new Response(cssContent, {
      headers: {
        'Content-Type': 'text/css; charset=utf-8',
      },
    });
  } else if (path.endsWith('.js')) {
    const jsContent = await NAV_SETTINGS.get(`assets${path}`);
    if (!jsContent) return new Response('Not found', { status: 404 });
    return new Response(jsContent, {
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
      },
    });
  }
  
  // API端点 - 保存设置
  if (path === '/api/save-settings' && request.method === 'POST') {
    const newSettings = await request.json();
    await NAV_SETTINGS.put('user_settings', JSON.stringify(newSettings));
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  // API端点 - 获取设置
  if (path === '/api/get-settings') {
    return new Response(JSON.stringify(settings), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  return new Response('Not found', { status: 404 });
}