# Github skills

## ssh 下配置代理

编辑 `~/.ssh/config`

```ini title="~/.ssh/config"
Host github.com
  Hostname ssh.github.com
  Port 443
  User git
  ProxyCommand nc -v -x 127.0.0.1:7891 %h %p
```
