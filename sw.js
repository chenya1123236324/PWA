// 缓存的字符串名称,可更改
var cacheStorageKey = 'daniujia'

// 缓存文件列表
var cacheList = [
  '/',
  "index.html",
  "main.css",
  "logo.png",
  "become.png"
]

// 注册完成安装 Service Worker 时, 抓取资源写入缓存
self.addEventListener('install', function (e) {
  console.log('缓存事件触发!')
  e.waitUntil(
    caches.open(cacheStorageKey).then(function (cache) {
      console.log('缓存列表:', cacheList)
      return cache.addAll(cacheList)
    }).then(function () {
      console.log('跳过等待!')
      //调用 self.skipWaiting() 方法是为了在页面更新的过程当中, 新的 Service Worker 脚本能立即激活和生效。
      return self.skipWaiting()
    })
  )
})

// 缓存的资源随着版本的更新会过期, 所以会根据缓存的字符串名称(cacheStorageKey)清除旧缓存
self.addEventListener('activate', function (e) {
  console.log('激活事件触发!')
  e.waitUntil(
    Promise.all(
      caches.keys().then(cacheNames => {
        return cacheNames.filter(name => {
          return name !== cacheStorageKey
        }).map(name => {
          return caches.delete(name)
        })
      })
    ).then(() => {
      return self.clients.claim()
    })
  )
})

// 网页抓取资源的过程中, 在 Service Worker 可以捕获到 fetch 事件, 可以编写代码决定如何响应资源的请求
self.addEventListener('fetch', function (e) {
  console.log('触发Fetch事件:', e)
  e.respondWith(
    caches.match(e.request).then(function (response) {
      if (response != null) {
        console.log('使用缓存路径:', e.request.url)
        return response
      }
      console.log('缓存请求失败:', e.request.url)
      return fetch(e.request.url)
    })
  )
})
