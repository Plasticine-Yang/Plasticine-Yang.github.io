# SSH

ssh 配置相关，主要讲解如何通过密钥的方式连接服务器而不是输入密码的方式

## 1. 认证模式

编辑服务器上的 `/etc/ssh/sshd_config`

更改了配置文件后要重启 `sshd`

```shell
systemctl restart sshd
```

### 1.1. 禁止密码登录

设置 `PasswordAuthentication` 为 no 即可

```shell
PasswordAuthentication no
```

### 1.2. 公钥登录 ssh

#### 1.2.1. 客户端生成密钥对

执行 `ssh-keygen -t rsa` 生成密钥对

这个命令执行完后会在 `~/.ssh` 下生成密钥对，`id_rsa` 和 `id_rsa.pub`，分别是私钥和公钥

接下来我们需要把公钥放到服务器上，这样才能让服务器和我们的客户端建立连接

#### 1.2.2. 服务器配置公钥

服务器需要先安装 `sshd` 服务

```shell
sudo apt install openssh-server -y
```

然后将客户端的公钥 `id_rsa.pub` 的内容粘贴到服务器上的 `~/.ssh/authorized_keys` 文件中，没有的话就自己创建一个

如果有多个公钥要添加到服务器，就另起一行继续添加即可

然后修改 `authorized_keys` 的权限

```shell
chmod 600 ~/.ssh/authorized_keys
```

再修改 `/etc/ssh/sshd_config` 配置如下：

```shell
# 开启公钥认证
PubkeyAuthentication yes

# 配置授权的公钥列表文件
AuthorizedKeysFile .ssh/authorized_keys
```

> 改完后记得重启 sshd 服务

#### 1.2.3. 客户端配置连接

客户端编辑 `~/.ssh/config`，配置服务器连接信息

````shell
Host 主机别名
  HostName 主机 IP 地址
  User 登录的用户名
  IdentityFile 与服务器 authorized_keys 中添加的公钥对应的私钥文件
``` SSH
````
