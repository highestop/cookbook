# Effective React Receipts

## Official Website Guide

- https://react.dev/learn/you-might-not-need-an-effect
  - https://zh-hans.react.dev/learn/you-might-not-need-an-effect#initializing-the-application
  - app 级别的初始化代码，不应该写到 effect 中，甚至 effect once 中
- https://react.dev/learn/keeping-components-pure
  - https://blog.logrocket.com/what-are-react-pure-functional-components/
  - *Its return value is only determined by its input values.*
  - *Its return value is always the same for the same input values.*
  - 没有副作用，render 过程中不改变外界变量

***Stateless*** functional components are used when a component doesn’t need to maintain its own state or lifecycle methods. Typically, these components have consistent output based on their inputs because ***they have no state or side effects***. If you give a stateless function component a set of props, it will always render the same JSX.

While functional components don’t have direct lifecycle methods, they still go through the same three phases as class components:

- **Mounting**: `useEffect(() => {}, [])`: The function inside useEffect runs after the component is first rendered.
- **Updating**: `useEffect(() => {})`: If you omit the dependency array (`[]`), `useEffect` will run after every render.
- **Unmounting**: `useEffect(() => { return () => {} })`: The function returned inside `useEffect` (the cleanup function) is used to clean up resources when the component unmounts or before it re-renders.

```ts
// stateless functional component
function _MyPureComponent({ ... }: ComponentProps): {
    return ..
}

// memo the pure function component
const _MyPureComponentWithMemo = React.memo(_MyPureComponent)

// fetch states as props of pure function component
const _MyComponentWithContext = () => {
    const props = { ... } //
    return <_MyPureComponentWithMemo {...props} />
}

// export the component
export const MyComponent = _MyComponentWithContext
```

- https://react.dev/reference/react/StrictMode
  - *It now unmounts and remounts the component, not just rendering it twice.*
  - *Your components will re-run an extra time to find bugs caused by impure rendering.*
  - 组件会被渲染两遍，effect 的 setup 和 cleanup 都会执行两遍，有利于发现 function component 有副作用的问题
  - 仅在 dev 模式下生效，prod 环境不受影响，所以可以植入源码
  - https://www.reddit.com/r/reactjs/comments/193hdu9/explain_strictmode_to_me/
- https://react.dev/learn/state-as-a-snapshot
  - https://react.dev/learn/queueing-a-series-of-state-updates
  - render 过程中的 state 不变，是一份 snapshot
- https://react.dev/learn/synchronizing-with-effects
  - https://stackoverflow.com/questions/75725559/have-async-function-in-useeffect-return-the-cleanup-function-for-the-useeffect-i
- https://react.dev/learn/you-might-not-need-an-effect#subscribing-to-an-external-store
    - https://react.dev/reference/react/useSyncExternalStore
    - 封装一个外部订阅（ WebSocket、Browser API 等 ）
- https://react.dev/learn/you-might-not-need-an-effect#fetching-data
  - 保证有序的数据请求
- https://react.dev/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally
  - 精确的依赖声明，避免依赖变更被无意义或不可控地触发
  - effect 中的代码必须是响应式的，把它们放到 effect 内部或 react 外部，都能解决 deps 的问题，但问题性质不同
- https://react.dev/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things
  - 分离几件事，不要掺杂在一起做，容易导致一致性问题
- https://react.dev/reference/react/useImperativeHandle#exposing-your-own-imperative-methods

## Best Practice

- 组件里的代码都是响应式的 —— 除了顶层的 jsx 逻辑，hook 中都应该是响应式的。需要鉴别清楚什么对于组件来说是响应式代码。
- 所有 hook 的 deps 依赖都是精确的。存在即需要响应，不应该用 lint ignore 逃逸检查，出现意味着 hook 中有非响应式逻辑，应该提出去。
- 如果无法摆脱复杂应用中非响应式的组件视图逻辑，或无法清楚区分响应式与非响应式代码，那建议 React 做的事情尽可能少，只把 React 当做渲染器做最纯粹的 JSX 翻译工具。
