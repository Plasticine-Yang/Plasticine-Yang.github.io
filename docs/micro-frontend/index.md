# 预备知识

## 浏览器原生如何实现类似 webpack alias 的功能？

可以使用 `script` 标签的 `type="importmap"`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script type="importmap">
      {
        "imports": {
          "custom_modules/": "/custom_modules/",
          "lodash/": "/node_modules/lodash-es/"
        }
      }
    </script>

    <script type="module">
      import { add } from 'custom_modules/add.js'
    </script>
  </body>
</html>
```
