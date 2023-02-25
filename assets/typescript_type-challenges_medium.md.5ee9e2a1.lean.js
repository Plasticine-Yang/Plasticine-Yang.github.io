import{_ as o,c as e,b as s,d as a,e as l,a as p,o as t,r as c}from"./app.93a8b71d.js";const bs=JSON.parse('{"title":"Medium","description":"","frontmatter":{},"headers":[{"level":2,"title":"2 - Get Return Type","slug":"_2-get-return-type","link":"#_2-get-return-type","children":[]},{"level":2,"title":"3 - Omit","slug":"_3-omit","link":"#_3-omit","children":[]},{"level":2,"title":"8 - Readonly 2","slug":"_8-readonly-2","link":"#_8-readonly-2","children":[]},{"level":2,"title":"9 - Deep Readonly","slug":"_9-deep-readonly","link":"#_9-deep-readonly","children":[]},{"level":2,"title":"10 - Tuple to Union","slug":"_10-tuple-to-union","link":"#_10-tuple-to-union","children":[]},{"level":2,"title":"12 - Chainable Options","slug":"_12-chainable-options","link":"#_12-chainable-options","children":[]},{"level":2,"title":"15 - Last of Array","slug":"_15-last-of-array","link":"#_15-last-of-array","children":[]},{"level":2,"title":"16 - Pop","slug":"_16-pop","link":"#_16-pop","children":[]},{"level":2,"title":"20 - Promise.all","slug":"_20-promise-all","link":"#_20-promise-all","children":[]},{"level":2,"title":"62 - Type Lookup","slug":"_62-type-lookup","link":"#_62-type-lookup","children":[]},{"level":2,"title":"106 - Trim Left","slug":"_106-trim-left","link":"#_106-trim-left","children":[]},{"level":2,"title":"108 - Trim","slug":"_108-trim","link":"#_108-trim","children":[]},{"level":2,"title":"110 - Capitalize","slug":"_110-capitalize","link":"#_110-capitalize","children":[]},{"level":2,"title":"116 - Replace","slug":"_116-replace","link":"#_116-replace","children":[]},{"level":2,"title":"119 - ReplaceAll","slug":"_119-replaceall","link":"#_119-replaceall","children":[]},{"level":2,"title":"191 - Append Argument","slug":"_191-append-argument","link":"#_191-append-argument","children":[]},{"level":2,"title":"296 - Permutation","slug":"_296-permutation","link":"#_296-permutation","children":[]},{"level":2,"title":"298 - Length of String","slug":"_298-length-of-string","link":"#_298-length-of-string","children":[]},{"level":2,"title":"459 - Flatten","slug":"_459-flatten","link":"#_459-flatten","children":[]},{"level":2,"title":"527 - Append to object","slug":"_527-append-to-object","link":"#_527-append-to-object","children":[]},{"level":2,"title":"529 - Absolute","slug":"_529-absolute","link":"#_529-absolute","children":[]},{"level":2,"title":"3188 - Tuple to Nested Object","slug":"_3188-tuple-to-nested-object","link":"#_3188-tuple-to-nested-object","children":[]},{"level":2,"title":"4803 - Trim Right","slug":"_4803-trim-right","link":"#_4803-trim-right","children":[]}],"relativePath":"typescript/type-challenges/medium.md","lastUpdated":1677306457000}'),r={name:"typescript/type-challenges/medium.md"},y=p("",2),C={id:"_2-get-return-type",tabindex:"-1"},D=s("a",{class:"header-anchor",href:"#_2-get-return-type","aria-hidden":"true"},"#",-1),F=p("",6),A={id:"_3-omit",tabindex:"-1"},i=s("a",{class:"header-anchor",href:"#_3-omit","aria-hidden":"true"},"#",-1),d=p("",6),B={class:"tip custom-block"},h=s("p",{class:"custom-block-title"},"相关题目",-1),u=s("a",{href:"/typescript/type-challenges/easy.html#_4-pick"},"4 - Pick",-1),g=p("",7),m={class:"tip custom-block"},_=s("p",{class:"custom-block-title"},"相关题目",-1),b=s("a",{href:"/typescript/type-challenges/easy.html#_7-readonly"},"7 - Readonly",-1),T=s("a",{href:"/typescript/type-challenges/medium.html#_9-deep-readonly"},"9 - Deep Readonly",-1),f=p("",9),E={class:"tip custom-block"},k=s("p",{class:"custom-block-title"},"相关题目",-1),v=s("a",{href:"/typescript/type-challenges/easy.html#_7-readonly"},"7 - Readonly",-1),S=s("a",{href:"/typescript/type-challenges/medium.html#_8-readonly-2"},"8 - Readonly 2",-1),x=p("",7),R={class:"tip custom-block"},P=s("p",{class:"custom-block-title"},"相关题目",-1),j=s("a",{href:"/typescript/type-challenges/easy.html#_11-tuple-to-object"},"11 - Tuple to Object",-1),w=s("a",{href:"/typescript/type-challenges/hard.html#_472-tuple-to-enum-object"},"472 - Tuple to Enum Object",-1),q=s("a",{href:"/typescript/type-challenges/hard.html#_730-union-to-tuple"},"730 - Union to Tuple",-1),I=s("a",{href:"/typescript/type-challenges/medium.html#_3188-tuple-to-nested-object"},"3188 - Tuple to Nested Object",-1),L=p("",20),V={class:"tip custom-block"},$=s("p",{class:"custom-block-title"},"相关题目",-1),O=s("a",{href:"/typescript/type-challenges/easy.html#_4-first-of-array"},"4 - First of Array",-1),U=s("a",{href:"/typescript/type-challenges/medium.html#_16-pop"},"16 - Pop",-1),N=p("",7),K={class:"tip custom-block"},W=s("p",{class:"custom-block-title"},"相关题目",-1),H=s("a",{href:"/typescript/type-challenges/easy.html#_14-first-of-array"},"14 - First of Array",-1),M=s("a",{href:"/typescript/type-challenges/medium.html#_15-last-of-array"},"15 - Last of Array",-1),z=p("",23),G={class:"tip custom-block"},Y=s("p",{class:"custom-block-title"},"相关题目",-1),J=s("a",{href:"/typescript/type-challenges/medium.html#_108-trim"},"108 - Trim",-1),X=s("a",{href:"/typescript/type-challenges/medium.html#_4803-trim-right"},"4803 - Trim Right",-1),Q=p("",7),Z={class:"tip custom-block"},ss=s("p",{class:"custom-block-title"},"相关题目",-1),as=s("a",{href:"/typescript/type-challenges/medium.html#_106-trim-left"},"106 - Trim Left",-1),ns=s("a",{href:"/typescript/type-challenges/medium.html#_4803-trim-right"},"4803 - Trim Right",-1),ls=p("",68),ps={class:"tip custom-block"},os=s("p",{class:"custom-block-title"},"相关题目",-1),es=s("a",{href:"/typescript/type-challenges/medium.html#_10-tuple-to-union"},"10 - Tuple to Union",-1),ts=s("a",{href:"/typescript/type-challenges/easy.html#_11-tuple-to-object"},"11 - Tuple to Object",-1),cs=s("a",{href:"/typescript/type-challenges/hard.html#_472-tuple-to-enum-object"},"472 - Tuple to Enum Object",-1),rs=s("a",{href:"/typescript/type-challenges/hard.html#_730-union-to-tuple"},"730 - Union to Tuple",-1),ys=p("",7),Cs={class:"tip custom-block"},Ds=s("p",{class:"custom-block-title"},"相关题目",-1),Fs=s("a",{href:"/typescript/type-challenges/medium.html#_108-trim"},"108 - Trim",-1),As=s("a",{href:"/typescript/type-challenges/medium.html#_4803-trim-right"},"4803 - Trim Right",-1);function is(ds,Bs,hs,us,gs,ms){const n=c("Badge");return t(),e("div",null,[y,s("h2",C,[a("2 - Get Return Type "),l(n,{type:"info",text:"built-in"}),a(),D]),F,s("h2",A,[a("3 - Omit "),l(n,{type:"info",text:"built-in"}),a(),i]),d,s("div",B,[h,s("p",null,[u,a(),l(n,{type:"tip",text:"easy"})])]),g,s("div",m,[_,s("p",null,[b,a(),l(n,{type:"tip",text:"easy"})]),s("p",null,[T,a(),l(n,{type:"warning",text:"medium"})])]),f,s("div",E,[k,s("p",null,[v,a(),l(n,{type:"tip",text:"easy"})]),s("p",null,[S,a(),l(n,{type:"warning",text:"medium"})])]),x,s("div",R,[P,s("p",null,[j,a(),l(n,{type:"tip",text:"easy"})]),s("p",null,[w,a(),l(n,{type:"danger",text:"hard"})]),s("p",null,[q,a(),l(n,{type:"danger",text:"hard"})]),s("p",null,[I,a(),l(n,{type:"warning",text:"medium"})])]),L,s("div",V,[$,s("p",null,[O,a(),l(n,{type:"tip",text:"easy"})]),s("p",null,[U,a(),l(n,{type:"warning",text:"medium"})])]),N,s("div",K,[W,s("p",null,[H,a(),l(n,{type:"tip",text:"easy"})]),s("p",null,[M,a(),l(n,{type:"warning",text:"medium"})])]),z,s("div",G,[Y,s("p",null,[J,a(),l(n,{type:"tip",text:"medium"})]),s("p",null,[X,a(),l(n,{type:"tip",text:"medium"})])]),Q,s("div",Z,[ss,s("p",null,[as,a(),l(n,{type:"tip",text:"medium"})]),s("p",null,[ns,a(),l(n,{type:"tip",text:"medium"})])]),ls,s("div",ps,[os,s("p",null,[es,a(),l(n,{type:"warning",text:"medium"})]),s("p",null,[ts,a(),l(n,{type:"tip",text:"easy"})]),s("p",null,[cs,a(),l(n,{type:"danger",text:"hard"})]),s("p",null,[rs,a(),l(n,{type:"danger",text:"hard"})])]),ys,s("div",Cs,[Ds,s("p",null,[Fs,a(),l(n,{type:"tip",text:"medium"})]),s("p",null,[As,a(),l(n,{type:"tip",text:"medium"})])])])}const Ts=o(r,[["render",is]]);export{bs as __pageData,Ts as default};
