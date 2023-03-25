# 异常监控流程

得益于前面实现的数据上报能力，现在实现异常监控就很简单了，直接监听 `error` 和 `unhandledrejection` 事件，并调用 captureException 即可

::: code-group

```ts [packages/browser/src/plugins/error-monitor.ts]
import { getGlobalObject } from '@plasticine-monitor/shared'
import type { Plugin } from '@plasticine-monitor/types'

export function errorMonitorPlugin(): Plugin {
  return {
    name: 'error-monitor-plugin',
    setupOnce(getCurrentHub) {
      const WINDOW = getGlobalObject<Window>()
      const client = getCurrentHub().getClient()

      if (client) {
        WINDOW.addEventListener('error', (ev) => {
          client.captureException(ev.error)
        })

        WINDOW.addEventListener('unhandledrejection', (ev) => {
          client.captureException(ev.reason)
        })
      }
    },
  }
}
```

:::
