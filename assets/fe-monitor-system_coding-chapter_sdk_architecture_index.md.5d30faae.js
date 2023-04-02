import{_ as e,c as s,o as a,a as n}from"./app.6c628785.js";const y=JSON.parse('{"title":"架构","description":"","frontmatter":{},"headers":[{"level":2,"title":"目录结构","slug":"目录结构","link":"#目录结构","children":[]}],"relativePath":"fe-monitor-system/coding-chapter/sdk/architecture/index.md","lastUpdated":1675652579000}'),t={name:"fe-monitor-system/coding-chapter/sdk/architecture/index.md"},c=n(`<h1 id="架构" tabindex="-1">架构 <a class="header-anchor" href="#架构" aria-hidden="true">#</a></h1><h2 id="目录结构" tabindex="-1">目录结构 <a class="header-anchor" href="#目录结构" aria-hidden="true">#</a></h2><p>由于考虑到以后存在跨平台适配的问题，所以需要将平台无关的逻辑单独实现，并将平台相关的逻辑放到另一个地方去实现</p><p>也就是说我们需要采用多个包去实现 SDK，这就需要用到 monorepo 的管理方式了</p><p>平台无关逻辑作为整个 SDK 的核心，放到 <code>core</code> 包中实现</p><p>平台相关的代码会依赖于 core 包，在它底层提供的能力上进行扩展，以适配具体平台的需求，以浏览器环境下的 SDK 为例，放到 <code>browser</code> 包中实现</p><p>并且项目会使用 TypeScript 进行开发，会涉及许多的 interface, type 的定义，为了方便管理这些类型代码，还会再抽离一个 <code>types</code> 包单独存放类型代码</p><p>最后，有的代码既不属于 core 也不属于 browser，其功能上起到的更多是一个像工具库作用的，会放到 <code>shared</code> 包中管理</p><p>综上，最终项目的目录结构如下：</p><div class="language-text"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">packages</span></span>
<span class="line"><span style="color:#A6ACCD;">├── browser   // 浏览器环境下的逻辑</span></span>
<span class="line"><span style="color:#A6ACCD;">├── core      // 平台无关的逻辑</span></span>
<span class="line"><span style="color:#A6ACCD;">├── shared    // 共享于多个包之间使用，起到工具库作用</span></span>
<span class="line"><span style="color:#A6ACCD;">└── types     // 类型定义代码 - interface, type 等</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div>`,10),o=[c];function p(r,l,i,d,_,h){return a(),s("div",null,o)}const A=e(t,[["render",p]]);export{y as __pageData,A as default};