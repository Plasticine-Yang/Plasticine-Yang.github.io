# Shell

## 查看当前使用的 shell 类型

一个并非所有`shell`都支持的方式:

```shell
echo $0
```

只能查看系统默认`shell`类型，不能查看当前`shell`类型:

```shell
echo $SHELL
```

## 查看系统中安装了哪些 shell

```shell
cat /etc/shells
```

## 修改系统默认 shell

可以先通过`cat /etc/shells`查看系统中已安装的`shell`有哪些，然后通过`chsh -s`命令选择默认`shell`

```shell
chsh -s /usr/bin/bash
```

## 如何修改系统默认编辑器？

在使用`visudo`等命令时，会调用系统默认编辑器，如果此时出现的是`nano`，而我又想用`vim`进行编辑该怎么办呢？

这就需要去修改默认的编辑器了，要用到`update-alternatives`这个命令，通过`--config editor`可以配置编辑器的优先级

```shell
update-alternatives --config editor
```

```
There are 4 choices for the alternative editor (providing /usr/bin/editor).

  Selection    Path                Priority   Status
------------------------------------------------------------
  0            /bin/nano            40        auto mode
  1            /bin/ed             -100       manual mode
  2            /bin/nano            40        manual mode
* 3            /usr/bin/vim.basic   30        manual mode
  4            /usr/bin/vim.tiny    15        manual mode

Press <enter> to keep the current choice[*], or type selection number:
```

输入你喜欢的编辑器的序号，然后回车即可
