# 介绍

为了更好地学习 React 源码，我正打算实现一个 Mini React，它的名字叫 [plasticine-react](https://github.com/plasticine-yang/plasticine-react)

该项目是我学习卡颂大神的 [从 0 实现 React 18](https://appjiz2zqrn2142.h5.xiaoeknow.com/v1/goods/goods_detail/p_638035c1e4b07b05581d25db?type=3) 并结合配套书籍 [《React 设计原理》](https://item.jd.com/13576643.html) 完成的，这门课程以及这本书都特别棒，强烈推荐大家购买！！同时也欢迎 star 我的 `plasticine-react`~

后续的源码分析都是基于我的 `plasticine-react` 项目分析的，该项目的代码都是参照 react 本身的源码，但是由于 react 是用 Flow 编写的

而 `plasticine-react` 是使用 TypeScript 编写，所以具体细节上可能有一些不一样的地方，但是核心思想是一致的，可以放心食用~

## 代码风格声明

每个人都有自己写代码的风格，`plasticine-react` 不会因为它是一个模仿 react 的项目而使其代码编写风格和 react 一致

因此有必要声明一下我个人编写代码的风格，以免读者在阅读 `plasticine-react` 代码时产生疑惑

命名风格：

- 文件名、目录名使用 [kebab-case](https://en.wiktionary.org/wiki/kebab_case) 命名风格
- 变量、函数名使用 [camelCase](https://en.wiktionary.org/wiki/camelCase) 命名风格
- 类名使用 [CamelCase](https://en.wiktionary.org/wiki/CamelCase) 命名风格

prettier 相关：

- 代码中不使用分号
- 字符串使用单引号
- 对象属性末尾会带上逗号
