# 相向双指针

## 167. 两数之和 II - 输入有序数组

[题目链接](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/)

利用数组已非递减排序的特性，初始化两个指针 left 和 right 分别指向数组两端，相向运动

- `nums[left] + nums[right] === target`: return `[left + 1, right + 1]`
- `nums[left] + nums[right] > target`: right 左移
- `nums[left] + nums[right] < target`: left 右移

```TypeScript
/**
 * @description 相向双指针
 */
function twoSum(numbers: number[], target: number): number[] {
  let left = 0
  let right = numbers.length - 1

  while (left < right) {
    const sum = numbers[left] + numbers[right]

    if (sum === target) break
    else if (sum < target) left++
    else if (sum > target) right--
  }

  return [left + 1, right + 1]
}
```

时间复杂度：`O(n)`

:::details 原因分析
假设最坏情况下，left 一直不移动，一直都是 right 往左移动，那么 right 需要移动 `n-2` 次，也就是 `O(n)`
:::

---

空间复杂度：`O(1)`

## 15. 三数之和

[题目链接](https://leetcode.cn/problems/3sum/)

```TypeScript
/**
 * @description 相向双指针
 */
function threeSum(nums: number[]): number[][] {
  const n = nums.length
  const res: number[][] = []

  // 先将 nums 升序排序 -- 让 twoSum 的时间复杂度降到 `O(n)`
  nums.sort((a, b) => a - b)

  // 遍历 [0, n - 3] 是因为要留出 nums[n-2] 和 nums[n-1] 给 twoSum
  for (let i = 0; i < n - 2; i++) {
    // 相同的 x 答案是一样的，避免重复答案
    // `i - 1` 作为数组下标，需要保证 `i - 1 >= 0`，即 `i >= 1`
    if (i >= 1 && nums[i] === nums[i - 1]) continue

    // `-x` 作为 twoSum 的 target
    const x = nums[i]
    const target = -x

    // twoSum
    let left = i + 1
    let right = n - 1

    while (left < right) {
      const y = nums[left]
      const z = nums[right]
      const sum = y + z

      if (i === 1) console.log(left, right, sum, target)
      if (sum === target) {
        // 更新 res
        res.push([x, y, z])

        // left 右移 -- 如果移动前后的数字相同则跳过
        left++
        // `left - 1` 作为数组下标需要 `>= 0`，即 `left >= 1`
        // `left < right` 可以保证这一子条件成立
        while (left < right && nums[left] === nums[left - 1]) left++

        // right 左移 -- 如果移动前后的数字相同则跳过
        right--
        // `right + 1` 作为数组下标需要 `>= 0`，即 `right >= -1`
        // `right > left` 可以保证这一子条件成立
        while (right > left && nums[right] === nums[right + 1]) right--
      } else if (sum < target) {
        left++
        // 相同元素跳过，避免重复计算
        while (left < right && nums[left] === nums[left - 1]) left++
      } else if (sum > target) {
        right--
        // 相同元素跳过，避免重复计算
        while (right > left && nums[right] === nums[right + 1]) right--
      }

      if (i === 1) console.log(left, right)
    }
  }

  return res
}
```

时间复杂度：`O(n^2)`

:::details 原因分析

- 数组排序 -- `O(nlogn)`

- `i` 遍历整个数组 -- `O(n)` => 整体 `O(n^2)`
  - `twoSum` -- `O(n)`

`O(n^2) > O(nlogn)` => 最终 `O(n^2)`
:::

---

空间复杂度：`O(1)`

### 优化路径一：无解的情况

![三数之和优化路径一](images/三数之和优化路径一.jpg)

```TypeScript
function threeSum(nums: number[]): number[][] {
  const n = nums.length
  const res: number[][] = []

  // 先将 nums 升序排序 -- 让 twoSum 的时间复杂度降到 `O(n)`
  nums.sort((a, b) => a - b)

  // 遍历 [0, n - 3] 是因为要留出 nums[n-2] 和 nums[n-1] 给 twoSum
  for (let i = 0; i < n - 2; i++) {
    // 相同的 x 答案是一样的，避免重复答案
    // `i - 1` 作为数组下标，需要保证 `i - 1 >= 0`，即 `i >= 1`
    if (i >= 1 && nums[i] === nums[i - 1]) continue

    // `-x` 作为 twoSum 的 target
    const x = nums[i]
    const target = -x

    // 优化路径一：`nums[i+1] + nums[i+2] > target`，那么后续元素之和只会更加比 target 大 // [!code focus]
    if (nums[i + 1] + nums[i + 2] > target) break // [!code focus]

    // twoSum
    let left = i + 1
    let right = n - 1

    while (left < right) {
      const y = nums[left]
      const z = nums[right]
      const sum = y + z

      if (sum === target) {
        // 更新 res
        res.push([x, y, z])

        // left 右移 -- 如果移动前后的数字相同则跳过
        left++
        // `left - 1` 作为数组下标需要 `>= 0`，即 `left >= 1`
        // `left < right` 可以保证这一子条件成立
        while (left < right && nums[left] === nums[left - 1]) left++

        // right 左移 -- 如果移动前后的数字相同则跳过
        right--
        // `right + 1` 作为数组下标需要 `>= 0`，即 `right >= -1`
        // `right > left` 可以保证这一子条件成立
        while (right > left && nums[right] === nums[right + 1]) right--
      } else if (sum < target) {
        left++
        // 相同元素跳过，避免重复计算
        while (left < right && nums[left] === nums[left - 1]) left++
      } else if (sum > target) {
        right--
        // 相同元素跳过，避免重复计算
        while (right > left && nums[right] === nums[right + 1]) right--
      }
    }
  }

  return res
}
```

### 优化路径二：`nums[i]` 无需继续的情况

![三数之和优化路径二](images/三数之和优化路径二.jpg)

```TypeScript
function threeSum(nums: number[]): number[][] {
  const n = nums.length
  const res: number[][] = []

  // 先将 nums 升序排序 -- 让 twoSum 的时间复杂度降到 `O(n)`
  nums.sort((a, b) => a - b)

  // 遍历 [0, n - 3] 是因为要留出 nums[n-2] 和 nums[n-1] 给 twoSum
  for (let i = 0; i < n - 2; i++) {
    // 相同的 x 答案是一样的，避免重复答案
    // `i - 1` 作为数组下标，需要保证 `i - 1 >= 0`，即 `i >= 1`
    if (i >= 1 && nums[i] === nums[i - 1]) continue

    // `-x` 作为 twoSum 的 target
    const x = nums[i]
    const target = -x

    // 优化路径一：`nums[i+1] + nums[i+2] > target`
    // 那么随着 i 增加，target 会减小，target 与 twoSum 的差距会越来越大，无解
    if (nums[i + 1] + nums[i + 2] > target) break

    // 优化路径二：`nums[n-1] + nums[n-2] < target` // [!code focus]
    // 那么 nums[i+1, ..., n-2] 的 twoSum 只会更小，不可能达到 target，忽略当前 nums[i] // [!code focus]
    if (nums[n - 1] + nums[n - 2] < target) continue // [!code focus]

    // twoSum
    let left = i + 1
    let right = n - 1

    while (left < right) {
      const y = nums[left]
      const z = nums[right]
      const sum = y + z

      if (sum === target) {
        // 更新 res
        res.push([x, y, z])

        // left 右移 -- 如果移动前后的数字相同则跳过
        left++
        // `left - 1` 作为数组下标需要 `>= 0`，即 `left >= 1`
        // `left < right` 可以保证这一子条件成立
        while (left < right && nums[left] === nums[left - 1]) left++

        // right 左移 -- 如果移动前后的数字相同则跳过
        right--
        // `right + 1` 作为数组下标需要 `>= 0`，即 `right >= -1`
        // `right > left` 可以保证这一子条件成立
        while (right > left && nums[right] === nums[right + 1]) right--
      } else if (sum < target) {
        left++
        // 相同元素跳过，避免重复计算
        while (left < right && nums[left] === nums[left - 1]) left++
      } else if (sum > target) {
        right--
        // 相同元素跳过，避免重复计算
        while (right > left && nums[right] === nums[right + 1]) right--
      }
    }
  }

  return res
}
```
