# 科学上网

## Clash

### 下载发行包

访问[clash github release](https://github.com/Dreamacro/clash/releases)，下载对应的压缩包

> 如: `https://github.com/Dreamacro/clash/releases/download/v1.11.12/clash-linux-amd64-v1.11.12.gz`

### 解压到系统中

然后将其解压到指定目录下，建议放在容易管理的地方，由于`clash`会被所有用户都使用，所以我会放在`/usr/bin/clash`中

```shell
sudo gzip -cd clash-linux-amd64-v1.11.12.gz > /usr/bin/clash
```

### 指定配置文件存放目录

同样是出于所有用户均可使用`clash`的目的，将`clash`的配置文件存放目录设置为`/etc/clash`最合适

```shell
sudo mkdir /etc/clash
```

然后就可以通过`clash -d /etc/clash`来指定配置文件存放目录

### 下载订阅链接的配置文件到配置目录中

将你的机场提供的`clash`订阅链接复制下来，通过`curl`将其下载到`/etc/clash`中，并重命名为`config.yaml`

```shell
sudo curl -o /etc/clash/config.yaml 机场 clash 订阅链接
```

此外，`clash`还需要一个`Country.mmdb`来运行

> Country.mmdb 为全球 IP 库，可以实现各个国家的 IP 信息解析和地理定位，没有这个文件 clash 是无法运行的。

这个文件可以在`clash`作者的另一个仓库`maxmind-geoip`的`release`中下载到，由于是在`github`，目前我们还没成功科学上网，因此无法正常下载到文件，此时可以借助代理，在下载链接前面加上`https://ghproxy.com/`

```shell
sudo wget -O /etc/clash/Country.mmdb https://ghproxy.com/https://github.com/Dreamacro/maxmind-geoip/releases/latest/download/Country.mmdb
```

### 运行 clash

接下来一切就准备就绪了，可以直接运行了

```shell
sudo clash -d /etc/clash
```

### 将 clash 配置成服务启动

为了让`clash`在后台运行，并且能够随着服务器开机自启，我们可以将其配置为系统服务，以守护进程的方式让其后台运行

```shell
nvim /etc/systemd/system/clash.service
```

写入如下内容

```
[Unit]
Description=clash daemon
[Service]
Type=simple
User=root
ExecStart=/usr/bin/clash -d /etc/clash/
Restart=on-failure
[Install]
WantedBy=multi-user.target
```

然后依次执行以下命令启动服务

```shell
# 加载守护进程配置
sudo systemctl daemon-reload

# 开启刚才编写的 clash Unit
sudo systemctl enable clash

# 开启 clash 服务
sudo systemctl start clash

# 查看 clash 状态
sudo systemctl status clash
```

如果没有异常信息则说明启动成功

### 远程管理 clash

由于`clash`运行在服务器上，不方便进行节点的切换，这时我们可以通过`web`端的管理界面来控制`clash`

首先配置以下`secret`，用于待会进行登录

```shell
nvim /etc/clash/config.yaml
```

另起一行，加上`secret: 密码`然后保存

接下来再打开`http://clash.razord.top/`

弹出来的界面中输入你的服务器公网`ip`，端口默认是`9090`，如果想要修改可以在`config.yaml`中修改`external-controller`选项，`secret`就是刚刚配置的`secret`

修改完配置后记得重启服务才能生效

```shell
sudo systemctl restart clash
```

然后就可以进行节点的切换啦！

### 配置全局系统代理

在`linux`中配置环境变量即可开启全局系统代理，我们将其代理到服务器内网 ip 的 7890 端口上即可让流量全都走向`clash`，从而开启科学上网

```shell
export ALL_PROXY="socks5h://服务器内网ip:7890"
export HTTP_PROXY="http://服务器内网ip:7890"
export HTTPS_PROXY="http://服务器内网ip:7890"
```

这里配置的环境变量只是临时的，如果需要每次打开终端会话都生效的话，可以将其配置到你的`.zshrc`中，配置好环境变量后可以试着访问`google`看看能否成功，成功的话则成功开启科学上网！

```shell
curl https://www.google.com
```

至此，`clash`在`linux`服务器上的配置就完成了。
