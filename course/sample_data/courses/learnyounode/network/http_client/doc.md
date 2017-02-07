
> 编写一个程序来发起一个 HTTP GET 请求，输出请求到的数据。


### 说明

    - 请求的 URL 通过第一个命令行参数提供。


### 提示

完成这个练习，你需要使用 Node.js 核心模块之一：`http`。

`http.get()` 方法可以用来发起简单的 GET 请求。

`http.get()` 的第一个参数是你想要 GET 的 URL，第二个参数则是回调函数。

这个回调函数有如下这些特征：

```js
function callback (response) { /* ... */ }
```

`response` 对象是一个 Node 的 **Stream** 类型的对象，你可以将 Node Stream 当做一个会触发一些事件的对象，其中我们通常所需要关心的事件有三个： "data"，"error" 以及 "end"。你可以像这样来监听一个事件：

```js
response.on("data", function (data) {
     /* data是 `Buffer` 对象, 你需要将它转换成字符串 */ 
})
```
'data' 事件会在每个数据块到达并已经可以对其进行一些处理的时候被触发。
