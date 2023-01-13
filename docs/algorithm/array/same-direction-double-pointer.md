# 同向双指针

## 方法论

- 窗口大小固定的叫滑动窗口，不固定的叫双指针

## 209. 长度最小的子数组

[题目链接](https://leetcode.cn/problems/minimum-size-subarray-sum/)

### 暴力解法

```TypeScript
/**
 * @description 暴力解法 -- 左端点固定 右端点向右扩展 直到 sum >= target 为止
 */
function minSubArrayLen(target: number, nums: number[]): number {
  const n = nums.length

  // 结果初始化为一个不可能的值 用于在无解的时候进行判断
  // 因为答案最大也就只会是 n，所以 n + 1 在本题中就是一个不可能的值
  // 最后如果 res === n + 1 说明无解 -- 返回 0
  let res = n + 1

  // 记录遍历每个左端点时的总和
  let sum = 0


  for (let left = 0; left < n; left++) {
    const leftNum = nums[left]
    sum = leftNum

    // 子数组长度
    let subLength = 1

    // 子数组扩张循环
    for (let right = left + 1; right < n + 1; right++) {
      const rightNum = nums[right]

      // 子数组扩张 -- right 来到 n 时 rightNum === undefined
      if (sum < target && rightNum !== undefined) {
        sum += rightNum
        subLength++
      }

      // 符合条件 更新 res 并终止子数组扩张循环
      if (sum >= target) {
        res = Math.min(subLength, res)
        break
      }
    }
  }

  return res === n + 1 ? 0 : res
}
```

时间复杂度：`O(n^2)`

`left` 从 0 遍历到 n，最坏情况下，每轮遍历的时候 `right` 都会从 `left + 1` 遍历到 `n + 1`

即 n 次循环中分别有 `n, n-1, n-2, n-3 ... 1` 次循环，取最坏的一次，也就是 `O(n^2)`

---

空间复杂度：`O(1)`

:::warning
`O(n^2)` 的时间复杂度无法通过
:::

### 双指针

注意到题目说了**数组中的数字都是正整数**，这也就意味着是存在优化方案的

以 `target = 7, nums = [2, 3, 1, 2, 4, 3]` 为例，假设此时的遍历情况是 `left === 0`，`right === 3`

那么此时 `sum === 8`，按照暴力解法，会终止子数组扩张循环，并且让 left 从 1 开始下一轮循环，但实际上这里的 sum 是可以复用的

首先明白一个事实：**因为全是正整数，所以 right 往右扩张的时候，sum 一定是会增大的，而 left 往右扩张时 sum 一定是会减小的**

利用这个事实，就不必像暴力解法那样，每次都在 left 遍历的时候重新扩张子数组，而是改成 left 和 right 两个指针同向移动：

- **sum 比 target 小就让 right 前进，增大 sum**
- **sum 比 target 大就让 left 前进，缩小 sum**

每次 sum 比 target 大的时候就更新一下 res，最坏情况下，也就是数组最后一个元素本身就比 target 大，此时答案是 1，但其实总的遍历次数也只是 n 次而已，因为 left 和 right 前进的时候并不存在嵌套的遍历过程，所以总的时间复杂度是 `O(n)`

```TypeScript
/**
 * @description 双指针
 */
function minSubArrayLen(target: number, nums: number[]): number {
  const n = nums.length

  // 结果初始化为一个不可能的值 用于在无解的时候进行判断
  // 因为答案最大也就只会是 n，所以 n + 1 在本题中就是一个不可能的值
  // 最后如果 res === n + 1 说明无解 -- 返回 0
  let res = n + 1

  // 双指针
  let left = 0
  let right = 0

  // 记录双指针区域内的子数组总和
  let sum = 0

  while (left < n && right < n) {
    sum += nums[right]

    while (sum >= target) {
      // 为什么是 `right - left + 1`？
      // 假设 left 和 right 此时都指向同一个值，那么答案此时就是 1，所以需要 +1
      res = Math.min(right - left + 1, res)
      sum -= nums[left]
      left++
    }

    right++
  }

  return res === n + 1 ? 0 : res
}
```
