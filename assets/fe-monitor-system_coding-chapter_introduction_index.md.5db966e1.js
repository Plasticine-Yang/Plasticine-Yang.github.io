import{_ as e,c as a,o as t,a as i}from"./app.af70e6d7.js";const r="/assets/前端监控系统整体架构.ebdb3f52.png",s="/assets/日志平台架构图.46242179.png",m=JSON.parse('{"title":"介绍","description":"","frontmatter":{},"headers":[{"level":2,"title":"前言","slug":"前言","link":"#前言","children":[]},{"level":2,"title":"监控系统整体架构","slug":"监控系统整体架构","link":"#监控系统整体架构","children":[]},{"level":2,"title":"SDK 架构","slug":"sdk-架构","link":"#sdk-架构","children":[]},{"level":2,"title":"服务端架构","slug":"服务端架构","link":"#服务端架构","children":[{"level":3,"title":"日志平台","slug":"日志平台","link":"#日志平台","children":[]}]}],"relativePath":"fe-monitor-system/coding-chapter/introduction/index.md","lastUpdated":1675563268000}'),n={name:"fe-monitor-system/coding-chapter/introduction/index.md"},d=i('<h1 id="介绍" tabindex="-1">介绍 <a class="header-anchor" href="#介绍" aria-hidden="true">#</a></h1><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-hidden="true">#</a></h2><p>实战篇的项目 <a href="https://github.com/Plasticine-Yang/plasticine-monitor.git" target="_blank" rel="noreferrer">plasticine-monitor</a> 目前已在 github 上开源，欢迎阅读 ~</p><p>实战篇会先从 SDK 的实现开始讲起，然后再去实现服务端</p><p>SDK 的架构设计主要参考 Sentry，如果对 Sentry 架构不了解的，建议先阅读完对应部分的理论篇文章后再来阅读实战篇文章</p><h2 id="监控系统整体架构" tabindex="-1">监控系统整体架构 <a class="header-anchor" href="#监控系统整体架构" aria-hidden="true">#</a></h2><p><img src="'+r+'" alt="前端监控系统整体架构" data-fancybox="gallery"></p><h2 id="sdk-架构" tabindex="-1">SDK 架构 <a class="header-anchor" href="#sdk-架构" aria-hidden="true">#</a></h2><p>wip...</p><h2 id="服务端架构" tabindex="-1">服务端架构 <a class="header-anchor" href="#服务端架构" aria-hidden="true">#</a></h2><h3 id="日志平台" tabindex="-1">日志平台 <a class="header-anchor" href="#日志平台" aria-hidden="true">#</a></h3><p>日志平台在前端监控系统中的作用是对 SDK 上报的数据以日志文件的方式存放在服务器中，并通过 <a href="https://www.elastic.co/guide/index.html" target="_blank" rel="noreferrer">ELK 集群</a> 对日志进行处理，再批量入库</p><p>处理主要是对 SDK 上报的数据进行扩展，比如对 <code>User-Agent</code> 进行解析，对 <code>ip</code> 进行解析，获取到国家、省份、城市等信息，解析完后整合到 SDK 上报的数据中</p><p>那么直接将 SDK 上报的数据处理后存入 MySQL 不行吗？为什么要这样“多此一举”呢？</p><p>这是因为考虑到要缓解高峰期服务端的压力，对于大量到来的 SDK 上报请求，如果都直接去进行处理入库的话，会导致服务器压力很大，因此需要用到类似消息队列的机制，对于到来的上报请求，统一加入到队列中，然后再通过定时任务去统一消费它们，降低服务端的负担</p><p>关于这里的“类似消息队列”的机制，本系统采用的是 <code>filebeat + Kafka + Logstash + Elasticsearch</code> 的架构</p><p><img src="'+s+'" alt="日志平台架构图" data-fancybox="gallery"></p><ul><li>Filebeat</li></ul><p>上报接口会将上报的数据写入到日志文件中，filebeat 负责监听日志文件，当日志文件内容变化时，将数据传递给 Kafka</p><ul><li>Kafka + Logstash</li></ul><p>为什么要有 <code>Kafka + Logstash</code> 这个流程呢？试想一下没有这些中间件，我们直接把数据写入到 <code>Elasticsearch</code> 的话，在面对大量的 SDK 上报数据时，会造成 <strong>日志的堆积和丢失</strong> 问题</p><p>因此我们需要引入消息队列的机制，让不能及时处理的消息全都排队等待，一个一个消费这些消息，Kafka 能够很好地完成这个任务，而 Logstash 的 filter 则允许我们在数据存入 elasticsearch 之前进行处理</p>',22),l=[d];function c(o,h,p,_,f,g){return t(),a("div",null,l)}const k=e(n,[["render",c]]);export{m as __pageData,k as default};
