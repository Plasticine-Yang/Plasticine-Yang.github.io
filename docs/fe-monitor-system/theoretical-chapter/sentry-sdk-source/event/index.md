# Event

## 前言

发往 Sentry 的数据都是先处理成 `Event`，然后再被处理成 `envelope` 发送出去

因此可以思考一下，`core` 包中的 client，作为底层应当提供以下几种能力：

- 生成 Event

  - 根据 exception 生成 -- `eventFromException`
  - 根据 message 生成 -- `eventFromMessage`

- 发送 Event
- 捕获 exception -- 将 exception 转换成 event 并发送出去，可以复用 `eventFromException`
- 捕获 message -- 将 message 转换成 event 并发送出去，可以复用 `eventFromMessage`

底层提供了这些能力后，browser 端的 client 就可以通过插件的方式去利用 event 集成额外信息，比如需要记录用户行为时，就可以将行为记录在 event 中，并通过 `breadcrumb` 插件来消费 event 生成用户行为信息进行记录

目前先明白底层提供的 event 相关的能力有哪些即可，接下来会逐个对照源码去分析

## Event 的类型
