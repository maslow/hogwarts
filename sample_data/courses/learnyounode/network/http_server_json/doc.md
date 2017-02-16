
> 编写一个 HTTP **服务器**，每当接收到一个路径为 '/api/unixtime' 的 GET 请求的时候，响应一些 JSON 数据。我们期望请求会包含一个查询参数（query string），key 是 "t"，值是一个时间戳。


### 说明

本节我们将开始写一个非常实用的一个HTTP API。

如:
  /api/unixtime?t=1376136615474

所响应的 JSON 应该只包含六个属性：'hour'，'minute'，'second'，'hour', 'minute', 'second'。例如：

```json
{
  "year": 2016,
  "month": 12,
  "date": 27,
  "hour": 14,
  "minute": 23,
  "second": 15
}
```

你的服务器需要监听第一个命令行参数所指定的端口。


### 提示

HTTP 服务器的 `request` 对象含有一个 `url` 属性，你可以通过它来决定具体需要走哪一条 _"路由"_。

你可以使用 Node 的核心模块 'url' 来处理 URL 和 查询参数（query string）。
`url.parse(request.url, true)` 方法会处理 request.url，它返回的对象中包含了一些很有帮助的属性，方便方便你处理 querystring。

举个例子，你可以在命令行窗口输入以下命令试试：

```sh
$ node -pe "require('url').parse('/test?q=1', true)"
```

你的响应应该是一个 JSON 字符串的形式。请查看 `JSON.stringify()` 来获取更多信息。

你也应当争做 Web 世界的好公民，正确地为响应设置 `Content-Type` 属性：

```js
res.writeHead(200, { 'Content-Type': 'application/json' })
```
