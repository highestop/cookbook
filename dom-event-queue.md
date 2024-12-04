# 关于 DOM 事件序列

TL;DR

- DOM 事件序列在浏览器产生该事件时就生成好了，可以在 window 捕获事件时通过 [`e.composedPath()`](https://stackoverflow.com/questions/26195091/determine-event-path-in-dom-event-bubbling) 观察到。
- 事件在捕获-目标-冒泡阶段执行中，执行移动、删除相关路径上 DOM 节点的操作，不会改变或取消该事件序列的执行，且事件中访问如 `target` 等属性依旧能拿到对应的 DOM 节点。猜测这些内容可能是在生成事件序列时通过闭包保存传递了下来。

_demo 代码：_

```ts
window.addEventListener('click', (e) => console.log(e.composedPath()), true);

const div1 = document.createElement('div');
div1.id = 'div1';
div1.tabIndex = 0;
div1.addEventListener('click', () => console.log('div1, click capture'), true);
div1.addEventListener('click', () => console.log('div1, click bubble'));

const div2 = document.createElement('div');
div1.id = 'div2';
div2.tabIndex = 0;
div2.addEventListener('click', () => console.log('div2, click capture'), true);
div2.addEventListener('click', () => console.log('div2, click bubble'));

const input = document.createElement('input');
input.id = 'input';
input.addEventListener('click', () => {
    console.log('input, click');
    div1.removeChild(div2);
    div2.remove();
});

div2.appendChild(input);
div1.appendChild(div2);
container.appendChild(div1);
```

_demo 执行结果：_

![CleanShot 2024-12-04 at 15 11 07](https://github.com/user-attachments/assets/8f849640-bcb2-4483-a7c9-cfcc01b03b12)
