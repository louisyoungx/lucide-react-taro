---
name: lucide-react-taro
description: 在 Taro 微信小程序和 Web 项目中使用 Lucide 图标。当用户需要在 Taro 项目中添加图标、使用 lucide 图标库、生成 TabBar 图标时使用此技能。
---

# lucide-react-taro

`lucide-react-taro` 是 Lucide 图标库的 Taro 适配版本，专为 Taro 微信小程序和 Web 平台设计。

## 渲染原理（微信小程序端）

在微信小程序环境中，图标并非通过原生的 `<svg />` 标签进行渲染。为了兼容小程序平台，底层会将 SVG 转换为 `data:image/svg+xml` 格式的字符串，并交由 `@tarojs/components` 的 `<Image />` 组件来展示（实现入口：`src/create-icon.tsx` 的 `createIcon`）。

基于上述实现原理，请注意以下几点：

- 传入的 `className` 仅会作用于外层的 `<Image />` 组件，通常只能用于控制布局、外边距、对齐等样式，无法穿透修改内部 SVG 的线条（stroke）或填充（fill）。
- 因此，无法通过类似 `text-*` 这样的文本颜色类名来更改图标颜色。若需调整图标颜色，请直接使用组件提供的 `color` 属性。

## 安装

```bash
npm install lucide-react-taro
# or
pnpm add lucide-react-taro
```

## 基础用法

✅ 正确示例（用 `color/size/strokeWidth`，以及可选的 `style` 覆盖尺寸）

```tsx
import { House, Settings, Camera, Zap, Heart } from 'lucide-react-taro';

function MyComponent() {
  return (
    <View>
      <House />
      <Settings size={32} />
      <Camera color="#ff0000" />
      <Zap size={48} color="#1890ff" strokeWidth={1.5} absoluteStrokeWidth />
      <Heart filled color="#ff3e98" />
      <House className="my-icon" style={{ marginRight: 8 }} />
    </View>
  );
}
```

❌ 错误示例（`className` 的 `text-*` 不会改变 icon 的 `stroke/fill`；它只是 `<Image />` 的 class）

```tsx
import { House } from 'lucide-react-taro';

function MyComponent() {
  return (
    <View>
      <House className="text-red-500 w-8 h-8" />
    </View>
  );
}
```

## Props

| 属性                  | 类型               | 默认值           | 说明                                   |
| --------------------- | ------------------ | ---------------- | -------------------------------------- |
| `size`                | `number \| string` | `24`             | 图标尺寸                               |
| `color`               | `string`           | -                 | 图标颜色（未设置时回退为黑色）         |
| `filled`              | `boolean`          | `false`          | 是否渲染为实心（fill=currentColor）    |
| `strokeWidth`         | `number \| string` | `2`              | 描边宽度                               |
| `absoluteStrokeWidth` | `boolean`          | `false`          | 绝对描边宽度，启用后描边不随 size 缩放 |
| `className`           | `string`           | -                | Image 的 className（用于布局等）       |
| `style`               | `CSSProperties`    | -                | 内联样式                               |

同时支持 Taro `Image` 组件的其他属性。

## 按需导入

支持 tree shaking，只打包使用到的图标：

```tsx
import { House, Settings } from 'lucide-react-taro';
import { House } from 'lucide-react-taro/icons/house';
```

## 图标列表

所有图标名称与 [Lucide 官方](https://lucide.dev/icons/) 保持一致，使用 PascalCase 命名。

常用图标：`House`、`Settings`、`User`、`Search`、`Menu`、`ChevronRight`、`Check`、`X`、`Plus`、`Minus`、`Heart`、`Star`、`Camera`、`Image`、`Share`、`Download`、`Upload`

## CLI 工具：查找和验证图标

本库提供了 CLI 工具来查找和验证图标是否存在。这对 AI 助手非常有用，可以在生成代码前验证图标名称是否正确。

### 查找图标

```bash
# 模糊查找（默认）
pnpm dlx taro-lucide-find arrow

# 精确查找
pnpm dlx taro-lucide-find arrow-up --exact

# 列出所有图标
pnpm dlx taro-lucide-find --list
```

### 验证图标

推荐在生成代码前，使用 `--json` 参数批量验证图标是否存在。

```bash
pnpm dlx taro-lucide-find arrow-up user settings arw --json
```

**输出示例：**

```json
[
  {
    "query": "arrow-up",
    "exists": true,
    "name": "ArrowUp",
    "suggestions": []
  },
  {
    "query": "arw",
    "exists": false,
    "name": null,
    "suggestions": ["ArrowBigDownDash", "Archive", "..."]
  }
]
```

如果 `exists` 为 `false`，请使用 `suggestions` 中的推荐图标名称。

## CLI 工具：生成 TabBar 图标

微信小程序的 TabBar 不支持 base64 或 SVG 图片，只能使用本地 PNG 文件。本库提供了 CLI 工具来生成 TabBar 所需的 PNG 图标。

### 批量生成 TabBar 图标

支持一次性生成所有 TabBar 图标。

```bash
pnpm dlx taro-lucide-tabbar House Settings User -c "#999999" -a "#1890ff"
```

### 指定输出目录和尺寸

```bash
pnpm dlx taro-lucide-tabbar House Settings User -c "#999999" -a "#1890ff" -o ./src/assets/tabbar -s 81
```

### CLI 参数

| 参数             | 简写 | 默认值           | 说明         |
| ---------------- | ---- | ---------------- | ------------ |
| `--color`        | `-c` | `#000000`        | 图标颜色     |
| `--active-color` | `-a` | -                | 选中状态颜色 |
| `--size`         | `-s` | `81`             | 图标尺寸     |
| `--output`       | `-o` | `./tabbar-icons` | 输出目录     |
| `--stroke-width` | -    | `2`              | 描边宽度     |

### 在 app.config.ts 中使用

```ts
export default defineAppConfig({
  tabBar: {
    color: '#999999',
    selectedColor: '#1890ff',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/tabbar/house.png',
        selectedIconPath: './assets/tabbar/house-active.png',
      },
      {
        pagePath: 'pages/settings/index',
        text: '设置',
        iconPath: './assets/tabbar/settings.png',
        selectedIconPath: './assets/tabbar/settings-active.png',
      },
    ],
  },
});
```

## LucideTaroProvider（全局默认配置）

通过 `LucideTaroProvider` 为子树中所有图标设置默认颜色和尺寸，避免每个图标重复传 props。优先级：`color` prop > `defaultColor` > 回退为黑色。

```tsx
import { LucideTaroProvider, House, Settings } from 'lucide-react-taro';

function App() {
  return (
    <LucideTaroProvider defaultColor="#666" defaultSize={20}>
      <House />              {/* 使用 #666, 20px */}
      <Settings color="red" /> {/* color prop 优先 */}
    </LucideTaroProvider>
  );
}
```

### LucideTaroProvider Props

| 属性           | 类型               | 说明                       |
| -------------- | ------------------ | -------------------------- |
| `defaultColor` | `string`           | 子组件默认图标颜色         |
| `defaultSize`  | `number \| string` | 子组件默认图标尺寸         |

## 注意事项

1. **禁止颜色继承**：小程序端是 `<Image />` 渲染，无法从父元素继承文本颜色（`currentColor` 在 Data URL 中回退为黑色）；请通过 `LucideTaroProvider` 或 `color` prop 显式设置颜色，不要依赖 `className` 的 `text-*`。
2. **性能优化**：组件内部已实现 base64 缓存，相同参数组合只计算一次。
3. **兼容性**：已内置 base64 编码 polyfill，无需额外配置即可在微信小程序中使用。
4. **TabBar 图标**：小程序 TabBar 不支持 SVG/base64，请使用 CLI 工具生成 PNG 图标。
5. **TabBar 图标路径**：`iconPath` 和 `selectedIconPath` 必须添加 `./` 前缀（如 `./assets/tabbar/house.png`），否则图片无法正确加载。
