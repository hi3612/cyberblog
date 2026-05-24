TypeScript 已经成为前端标准。分享几个让我代码质量提升的设计模式。

## 联合类型优于枚举

TypeScript 的 `enum` 有运行时开销和 tree-shaking 问题。使用字符串联合类型：`type Status = 'idle' | 'loading' | 'success' | 'error'`。配合 `as const` 声明常量数组，可以同时获得类型和值。

## 类型守卫

`typeof`、`instanceof`、`in` 操作符都是类型守卫。自定义类型守卫用 `x is Type` 语法：`function isUser(obj: unknown): obj is User { return obj && typeof obj.name === 'string'; }`。在 `if` 条件里使用后，TypeScript 会自动收窄类型。

## 泛型约束

泛型不写约束等于 any。`<T>` 可以传任何类型，`<T extends { id: string }>` 限制了 T 必须有 id。这个简单的技巧可以避免大量的类型错误，同时也让 IDE 的自动补全更准确。

## Discriminated Union

用共同的 `type` 字段区分联合类型：`type Result = { type: 'ok'; data: Data } | { type: 'err'; error: Error }`。在 switch/case 里处理每一项，TypeScript 会为每项精确推断类型。这是处理 API 响应的最佳方式。

## 工具类型

TypeScript 内置的工具类型非常强大。`Partial<T>` 让所有字段可选，`Pick<T, K>` 选取部分字段，`Omit<T, K>` 排除部分字段，`Record<K, V>` 创建键值映射。熟练使用这些工具类型可以让代码减少 30% 的冗余类型声明。
