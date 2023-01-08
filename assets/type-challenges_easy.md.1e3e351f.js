import{_ as p,c as e,b as s,d as n,e as l,a as o,o as t,r as c}from"./app.a3c2ca86.js";const O=JSON.parse('{"title":"Easy","description":"","frontmatter":{},"headers":[{"level":2,"title":"Pick","slug":"pick","link":"#pick","children":[]},{"level":2,"title":"Readonly","slug":"readonly","link":"#readonly","children":[]},{"level":2,"title":"Tuple to Object","slug":"tuple-to-object","link":"#tuple-to-object","children":[]}],"relativePath":"type-challenges/easy.md"}'),r={name:"type-challenges/easy.md"},y=o('<h1 id="easy" tabindex="-1">Easy <a class="header-anchor" href="#easy" aria-hidden="true">#</a></h1><div class="tip custom-block"><p class="custom-block-title">My Issues Submission Records</p><p>My <a href="https://github.com/type-challenges/type-challenges" target="_blank" rel="noreferrer">type-challenges</a> issues submission records, <a href="https://github.com/type-challenges/type-challenges/issues?q=is%3Aissue+author%3APlasticine-Yang+is%3Aclosed" target="_blank" rel="noreferrer">click to view</a>.</p></div>',2),D={id:"pick",tabindex:"-1"},C=s("a",{class:"header-anchor",href:"#pick","aria-hidden":"true"},"#",-1),F=o(`<blockquote><p>Construct a type by picking the set of properties <code>K</code> from <code>T</code>.</p></blockquote><p>从类型 T 中选择出属性集 K 构造成一个新的类型。</p><p>e.g.</p><div class="language-TypeScript"><button title="Copy Code" class="copy"></button><span class="lang">TypeScript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Todo</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
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
<span class="line"></span></code></pre></div></details>`,5),i={class:"tip custom-block"},A=s("p",{class:"custom-block-title"},"相关题目",-1),d=s("a",{href:"/type-challenges/medium.html#omit"},"Omit",-1),u={id:"readonly",tabindex:"-1"},h=s("a",{class:"header-anchor",href:"#readonly","aria-hidden":"true"},"#",-1),_=o(`<blockquote><p>Constructs a type with all properties of T set to readonly, meaning the properties of the constructed type cannot be reassigned.</p></blockquote><p>构造一个 T 的所有属性都设置为只读的类型，这意味着构造的类型的属性不能被重新分配。</p><p>e.g.</p><div class="language-TypeScript"><button title="Copy Code" class="copy"></button><span class="lang">TypeScript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Todo</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
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
<span class="line"></span></code></pre></div></details>`,5),m={class:"tip custom-block"},B=s("p",{class:"custom-block-title"},"相关题目",-1),g=s("a",{href:"/type-challenges/medium.html#readonly-2"},"Readonly 2",-1),T=s("a",{href:"/type-challenges/medium.html#deep-readonly"},"Deep Readonly",-1),b=o(`<h2 id="tuple-to-object" tabindex="-1">Tuple to Object <a class="header-anchor" href="#tuple-to-object" aria-hidden="true">#</a></h2><blockquote><p>Given an array, transform it into an object type and the key/value must be in the provided array.</p></blockquote><p>给你一个数组，将它转成一个 <code>object</code> 类型，并且 <code>key/value</code> 要来自于提供的数组中。</p><p>e.g.</p><div class="language-TypeScript"><button title="Copy Code" class="copy"></button><span class="lang">TypeScript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> tuple </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">tesla</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">model 3</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">model X</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">model Y</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">] </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">const</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// expected { &#39;tesla&#39;: &#39;tesla&#39;, &#39;model 3&#39;: &#39;model 3&#39;, &#39;model X&#39;: &#39;model X&#39;, &#39;model Y&#39;: &#39;model Y&#39;}</span></span>
<span class="line"><span style="color:#C792EA;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">result</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">TupleToObject</span><span style="color:#89DDFF;">&lt;typeof</span><span style="color:#A6ACCD;"> tuple</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre></div><details class="details custom-block"><summary>查看答案</summary><p>主要利用 <code>Tuple[number]</code> 能够将一个数组/元组类型转成联合类型来实现</p><div class="language-TypeScript"><button title="Copy Code" class="copy"></button><span class="lang">TypeScript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// T[number] 用于将数组类型转成联合类型</span></span>
<span class="line"><span style="color:#C792EA;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">TupleToObject</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">T</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">extends</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">readonly</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">any</span><span style="color:#A6ACCD;">[]</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  [</span><span style="color:#FFCB6B;">P</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">in</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">T</span><span style="color:#A6ACCD;">[</span><span style="color:#FFCB6B;">number</span><span style="color:#A6ACCD;">]]</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">P</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Tuple</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">tesla</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">model 3</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">model X</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">model Y</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// &quot;tesla&quot; | &quot;model 3&quot; | &quot;model X&quot; | &quot;model Y&quot;</span></span>
<span class="line"><span style="color:#C792EA;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">TupleNumber</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Tuple</span><span style="color:#A6ACCD;">[</span><span style="color:#FFCB6B;">number</span><span style="color:#A6ACCD;">]</span></span>
<span class="line"></span></code></pre></div></details>`,6),E={class:"tip custom-block"},k=s("p",{class:"custom-block-title"},"相关题目",-1),f=s("a",{href:"/type-challenges/medium.html#tuple-to-union"},"Tuple to Union",-1),v=s("a",{href:"/type-challenges/hard.html#tuple-to-enum-object"},"Tuple to Enum Object",-1),S=s("a",{href:"/type-challenges/hard.html#union-to-tuple"},"Union to Tuple",-1),q=s("a",{href:"/type-challenges/medium.html#tuple-to-nested-object"},"Tuple to Nested Object",-1);function P(x,j,V,N,R,w){const a=c("Badge");return t(),e("div",null,[y,s("h2",D,[n("Pick "),l(a,{type:"info",text:"built-in"}),n(),C]),F,s("div",i,[A,s("p",null,[d,n(),l(a,{type:"warning",text:"medium"})])]),s("h2",u,[n("Readonly "),l(a,{type:"info",text:"built-in"}),n(),h]),_,s("div",m,[B,s("p",null,[g,n(),l(a,{type:"warning",text:"medium"})]),s("p",null,[T,n(),l(a,{type:"warning",text:"medium"})])]),b,s("div",E,[k,s("p",null,[f,n(),l(a,{type:"warning",text:"medium"})]),s("p",null,[v,n(),l(a,{type:"danger",text:"hard"})]),s("p",null,[S,n(),l(a,{type:"danger",text:"hard"})]),s("p",null,[q,n(),l(a,{type:"warning",text:"medium"})])])])}const M=p(r,[["render",P]]);export{O as __pageData,M as default};