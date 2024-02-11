# tsconfig

## 简介

`tsconfig.json` 中的配置项超过 100 项，每个逐个看不利于理解和记忆，但官方将这些配置项分为四个大类：

- `root fields`: 让 TypeScript 知道要处理哪些文件
- `compilerOptions`: 编译相关的配置项，也是日常开发中最常接触的
- `watchOptions`: watch mode 相关配置项
- `typeAcquisition`: 用于调整类型添加到 JavaScript 项目的方式

本系列会梳理一些我日常开发中经常用到的配置项的功能。
