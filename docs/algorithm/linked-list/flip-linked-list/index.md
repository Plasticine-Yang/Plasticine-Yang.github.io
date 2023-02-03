# 翻转链表

## 206. 反转链表

[题目链接](https://leetcode.cn/problems/reverse-linked-list/description/)

用三个指针 - `pre`, `cur`, `next` 不断交替更改指针指向关系即可

```TypeScript
function reverseList(head: ListNode | null): ListNode | null {
  let pre = null
  let cur = head
  let next = null

  while (cur !== null) {
    next = cur.next
    cur.next = pre
    pre = cur
    cur = next
  }

  return pre
}
```

时间复杂度：`O(n)`

空间复杂度：`O(1)`
