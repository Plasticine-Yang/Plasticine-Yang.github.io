# Linux 小技巧

## 获取想要的 Git 远程分支名

### 场景

通过 `git branch -rl '*/feat/*'` 查询符合指定格式的远端分支

其返回结果为：

```text
  origin/feat/foo
  origin/feat/bar
  origin/feat/baz
```

我不想要前面的 `origin/`，只返回 feat 开头的即可

### sed 命令实现

sed 命令全名为 `Stream Editor`，用于对流进行处理，字符串也属于流，思路是利用正则将 `origin/` 替换为空字符串

通过 `s` 可以实现替换的功能，`s/正则表达式/目标字符串/`，这样即可把匹配正则的字符串替换成目标字符串，例如：

```shell
> echo 'hello world' | sed 's/hello/hi/'
hi world
```

```shell
> git branch -rl '*/feat/*' | sed 's/origin\///'
  feat/foo
  feat/bar
  feat/baz
```

:::tip
`git branch` 输出的字符串的每一行前面都有两个空格，因此不能通过 `s/^origin\///` 去替换，如果要这样替换的话，需要先将前面的空格去掉

```shell
> git branch -rl '*/feat/*' | sed 's/^ *//' | sed 's/^origin\///'
feat/foo
feat/bar
feat/baz
```

:::

### cut 命令实现

cut 命令用于裁剪指定的文本行中的指定部分，并将其输出到终端或文件中，示例：

```shell
# 截取第 1 至第 5 个字符
> echo 'hello world' | cut -c 1-5
hello

# 截取第 1 和第 5 个字符
> echo 'hello world' | cut -c 1,5
ho

# 按空格分隔，截取第 1 个字段
> echo 'hello world' | cut -d ' ' -f 1
hello

# 按空格分隔，截取第 2 个字段
> echo 'hello world' | cut -d ' ' -f 2
world

# 按空格分割，截取第 2 个字段至行尾
> echo 'hello world foo bar baz' | cut -d ' ' -f 2-
world foo bar baz

# 按空格分割，截取行首至第 2 个字段
> echo 'hello world foo bar baz' | cut -d ' ' -f -2
hello world
```

对于这个场景，使用 cut 可以这样实现：

```shell
> git branch -rl '*/feat/*' | cut -d '/' -f 2-
feat/foo
feat/bar
feat/baz
```
