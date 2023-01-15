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
