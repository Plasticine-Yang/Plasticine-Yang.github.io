import{_ as p,c as e,a as s,b as a,d as l,e as o,o as t,r as c}from"./app.014e7f96.js";const x=JSON.parse('{"title":"Easy","description":"","frontmatter":{},"headers":[{"level":2,"title":"Pick","slug":"pick","link":"#pick","children":[]},{"level":2,"title":"Readonly","slug":"readonly","link":"#readonly","children":[]}],"relativePath":"type-challenges/easy.md"}'),r={name:"type-challenges/easy.md"},y=o('<h1 id="easy" tabindex="-1">Easy <a class="header-anchor" href="#easy" aria-hidden="true">#</a></h1><div class="tip custom-block"><p class="custom-block-title">My Issues Submission Records</p><p>My <a href="https://github.com/type-challenges/type-challenges" target="_blank" rel="noreferrer">type-challenges</a> issues submission records, <a href="https://github.com/type-challenges/type-challenges/issues?q=is%3Aissue+author%3APlasticine-Yang+is%3Aclosed" target="_blank" rel="noreferrer">click to view</a>.</p></div>',2),D={id:"pick",tabindex:"-1"},i=s("a",{class:"header-anchor",href:"#pick","aria-hidden":"true"},"#",-1),C=o(`<blockquote><p>Construct a type by picking the set of properties <code>K</code> from <code>T</code></p></blockquote><p>从类型 T 中选择出属性集 K 构造成一个新的类型</p><p>e.g.</p><div class="language-TypeScript"><button title="Copy Code" class="copy"></button><span class="lang">TypeScript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Todo</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">title</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">description</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">completed</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">boolean</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">TodoPreview</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">MyPick</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">Todo</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">title</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">completed</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> todo</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">TodoPreview</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">title</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">Clean room</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">completed</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">false</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><details class="details custom-block"><summary>查看答案</summary><div class="language-TypeScript"><button title="Copy Code" class="copy"></button><span class="lang">TypeScript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">MyPick</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">T</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">K</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">extends</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">keyof</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">T</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  [</span><span style="color:#FFCB6B;">P</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">in</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">K</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">T</span><span style="color:#A6ACCD;">[</span><span style="color:#FFCB6B;">P</span><span style="color:#A6ACCD;">]</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div></details>`,5),F={class:"tip custom-block"},A=s("p",{class:"custom-block-title"},"相关题目",-1),d=s("a",{href:"/type-challenges/medium.html#omit"},"Omit",-1),_={id:"readonly",tabindex:"-1"},h=s("a",{class:"header-anchor",href:"#readonly","aria-hidden":"true"},"#",-1),u=o(`<blockquote><p>Constructs a type with all properties of T set to readonly, meaning the properties of the constructed type cannot be reassigned.</p></blockquote><p>构造一个 T 的所有属性都设置为只读的类型，这意味着构造的类型的属性不能被重新分配。</p><p>e.g.</p><div class="language-TypeScript"><button title="Copy Code" class="copy"></button><span class="lang">TypeScript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Todo</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">title</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">description</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> todo</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">MyReadonly</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">Todo</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">title</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Hey</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">description</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">foobar</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">todo</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">title </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Hello</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// Error: cannot reassign a readonly property</span></span>
<span class="line"><span style="color:#A6ACCD;">todo</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">description </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">barFoo</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// Error: cannot reassign a readonly property</span></span>
<span class="line"></span></code></pre></div><details class="details custom-block"><summary>查看答案</summary><div class="language-TypeScript"><button title="Copy Code" class="copy"></button><span class="lang">TypeScript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">MyReadonly</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">T</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">readonly</span><span style="color:#A6ACCD;"> [</span><span style="color:#FFCB6B;">P</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">in</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">keyof</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">T</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">T</span><span style="color:#A6ACCD;">[</span><span style="color:#FFCB6B;">P</span><span style="color:#A6ACCD;">]</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div></details>`,5),B={class:"tip custom-block"},m=s("p",{class:"custom-block-title"},"相关题目",-1),g=s("a",{href:"/type-challenges/medium.html#readonly-2"},"Readonly 2",-1),T=s("a",{href:"/type-challenges/medium.html#deep-readonly"},"Deep Readonly",-1);function b(k,f,E,v,S,P){const n=c("Badge");return t(),e("div",null,[y,s("h2",D,[a("Pick "),l(n,{type:"info",text:"built-in"}),a(),i]),C,s("div",F,[A,s("p",null,[d,a(),l(n,{type:"warning",text:"medium"})])]),s("h2",_,[a("Readonly "),l(n,{type:"info",text:"built-in"}),a(),h]),u,s("div",B,[m,s("p",null,[g,a(),l(n,{type:"warning",text:"medium"})]),s("p",null,[T,a(),l(n,{type:"warning",text:"medium"})])])])}const R=p(r,[["render",b]]);export{x as __pageData,R as default};
