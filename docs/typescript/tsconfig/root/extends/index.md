# extends

## 作用

用于继承已有的 `tsconfig.json` 文件中的配置，路径解析算法与 Node.js 的标准一致，这意味着既可以使用相对路径也可以直接使用 npm 包名的方式，使用 npm 包的时候默认会消费包内的 `tsconfig.json`，当有多个配置文件时也可以手动指定。

<Tabs>
  <Tab label="packages/shared">

```shell
shared
├── package.json
└── tsconfig.json
```

  </Tab>

  <Tab label="packages/foo/tsconfig.json">

```json
{
  // "extends": ["shared"]
  "extends": ["shared/tsconfig.json"]
}
```

  </Tab>
</Tabs>
