# 同向双指针

## 解题模板

### 模板一：在窗口缩小时更新 res

```TypeScript
// 处理 base case

while (left < n && right < n) {
  // 窗口扩大阶段

  while (窗口缩小的条件) {
    // 窗口缩小阶段 -- 在这里面更新 res

    left++
  }

  // 窗口缩小完后

  right++
}
```

### 模板二：在窗口缩小之后更新 res

```TypeScript
// 处理 base case

while (left < n && right < n) {
  // 窗口扩大阶段

  while (窗口缩小的条件) {
    // 窗口缩小阶段

    left++
  }

  // 窗口缩小完后 -- 在这里面更新 res

  right++
}
```

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

也就是说每次窗口缩小的时候就需要更新 res，因此套用模板一

```TypeScript
/**
 * @description 双指针 -- 套用模板一：在窗口缩小阶段更新 res
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
      // 窗口缩小阶段

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

时间复杂度：`O(n)`

最坏情况下，`right` 右移一次，`left` 也立刻跟着右移一次，那么总共移动了 `(n-1) + (n-1) === 2n - 2` 次，所以时间复杂度为 `O(n)`

---

空间复杂度：`O(1)`

## 713. 乘积小于 K 的子数组

[题目链接](https://leetcode.cn/problems/subarray-product-less-than-k/)

此题如果在窗口缩小的时候才更新 res 会导致漏掉部分情况，比如：

`nums = [10,5,2,6], k = 100`

初始时窗口是 `[0,0]`，此时窗口内元素是 10，严格小于 k，因此应当更新 res，如果不更新会导致其被漏掉，所以我们应当在窗口扩大阶段更新 res

假设现在窗口遍历到 `[0,2]`，那么窗口内元素为 `[10,5,2]`，元素乘积为 100，需要缩小窗口，我们需要等窗口缩小后才更新 res

窗口扩大阶段更新 res 其实也涵盖在模板二中了，所以这题应当套用模板二

```TypeScript
/**
 * @description 双指针 -- 套用模板二：在窗口缩小后更新 res
 */
function numSubarrayProductLessThanK(nums: number[], k: number): number {
  // base case -- k <= 1 无解，除 0 外的任意数的乘积都不会严格小于 1
  if (k <= 1) return 0

  const n = nums.length

  let left = 0
  let right = 0

  // 窗口内的乘积
  let prod = 1
  let res = 0

  while (left < n && right < n) {
    prod *= nums[right]

    while (prod >= k) {
      // 窗口缩小阶段
      prod /= nums[left]
      left++
    }

    // 窗口扩张阶段 -- 更新 res
    res += right - left + 1
    right++
  }

  return res
}
```

时间复杂度：`O(n)`

和 [209. 长度最小的子数组](#_209-长度最小的子数组) 的分析思路类似，最坏情况下 `right` 每右移一次，`left` 就右移一次，也就是说两者总共移动了 `(n-1) + (n-1) === 2n - 2` 次，所以时间复杂度为 `O(n)`

---

空间复杂度：`O(1)`

## 3. 无重复字符的最长子串

[题目链接](https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/)

这题需要在字符进入窗口时就记录字串长度，但也需要保证窗口内无重复子串才行，也就是说要在窗口缩小到没有重复子串后才更新 res，因此套用模板二

```TypeScript
/**
 * @description 双指针 -- 套用模板二：窗口扩大阶段更新 res
 */
function lengthOfLongestSubstring(s: string): number {
  const n = s.length
  let left = 0
  let right = 0
  let res = 0
  const counter: Record<string, number> = {}

  while (left < n && right < n) {
    const char = s.charAt(right)
    counter[char] = counter[char] === undefined ? 1 : counter[char] + 1

    // 窗口缩小条件：出现重复字符时
    while (counter[char] > 1) {
      counter[s.charAt(left)] -= 1
      left++
    }

    // 窗口扩大阶段更新 res
    res = Math.max(right - left + 1, res)

    right++
  }

  return res
}
```
