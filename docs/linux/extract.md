# 解压缩

## .gz

### 压缩

移除原文件

```shell
gzip 1.txt

# 1.txt.gz
```

通过`-c`参数将输出重定向，保留原文件

```shell
gzip -c 1.txt > 1.txt.gz

# 1.txt 1.txt.gz
```

### 解压缩

移除原文件

```shell
gunzip 1.txt.gz

# 1.txt
```

或者用`gzip -d`(decompress)

```shell
gzip -d 1.txt.gz
```

通过`-c`参数将输出重定向，保留原文件

```shell
gunzip -c 1.txt.gz > 1.txt

# 1.txt.gz 1.txt
```

### 查看压缩包内容

通过`-l` or `--list`参数查看压缩包内容

```shell
# 也可以用 gunzip
gzip -l 1.txt.gz
```

## .zip

### 压缩

`zip 目标文件 原文件`

```shell
zip 1.zip 1.txt

# 1.txt 1.zip
```

```shell
zip ./temp/1.zip 1.txt

# 1.txt temp/1.zip
```

### 解压缩

`unzip 压缩包 -d 解压路径`

未指定`-d`参数时会解压到命令运行时的目录

```shell
unzip 1.zip -d ./temp
```

## .tar.gz

### 压缩

```shell
tar -zcvf 1.tar.gz 1.txt
```

### 解压缩

```shell
tar -zxvf 1.tar.gz

# 加上 -C 参数指定解压目录
tar -zxvf 1.tar.gz -C ./temp
```

### 查看压缩包内容

```shell
tar -tvf 1.tar.gz
```
