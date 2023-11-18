# Git

## github ssh 下配置代理

当使用 ssh 克隆 github 仓库时，即便配置了 `HTTP_PROXY`, `HTTPS_PROXY` 和 `ALL_PROXY` 也是没用的，并不会被成功代理，需要为 github.com 配置 ssh 代理才行，配置方法如下：

编辑 `~/.ssh/config`：

```text title="~/.ssh/config"
Host github.com
  Hostname ssh.github.com
  Port 443
  User git
  ProxyCommand nc -v -x 127.0.0.1:7891 %h %p
```
