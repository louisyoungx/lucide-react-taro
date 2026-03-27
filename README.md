<p align="center">
  <a href="https://lucide.rocke.top">
    <img src="https://raw.githubusercontent.com/louisyoungx/lucide-react-taro/refs/heads/main/docs/public/assets/banner.svg" alt="Lucide - Beautiful & consistent icon toolkit made by the community. Open-source project and a fork of Feather Icons." width="480">
  </a>
</p>

<p align="center">
  <a href="https://github.com/louisyoungx/lucide-react-taro/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/lucide-react-taro" alt="license"></a>
  <a href="https://www.npmjs.com/package/lucide-react-taro"><img src="https://img.shields.io/npm/v/lucide-react-taro" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/lucide-react-taro"><img src="https://img.shields.io/npm/dm/lucide-react-taro" alt="npm downloads"></a>
</p>

<p align="center">
  <a href="https://lucide.rocke.top/icons/">图标</a>
  ·
  <a href="https://lucide.rocke.top/guide/">使用文档</a>
  ·
  <a href="https://lucide.rocke.top/license">开源协议</a>
  ·
  <a href="https://lucide.rocke.top/skill">SKILL</a>
</p>

# Lucide React Taro

在 Taro 小程序中使用 [Lucide](https://lucide.dev/) 图标的高性能解决方案，提供图标组件和 TabBar PNG 图标生成 CLI 工具。

- 使用文档：[https://lucide.rocke.top](https://lucide.rocke.top)

- 查看所有图标：[https://lucide.rocke.top/icons](https://lucide.rocke.top/icons)

## AI 助手接入

本项目提供了 [SKILL.md](https://github.com/louisyoungx/lucide-react-taro/blob/main/SKILL.md)，方便 AI 助手快速了解如何使用本库。

也可使用 skills CLI 一键安装到你的 AI 助手

```bash
npx skills add louisyoungx/lucide-react-taro
```

## 特性

- **动态颜色支持**：运行时动态修改图标颜色
- **Tree Shaking**：每个图标独立模块，只打包你使用的图标
- **TypeScript 支持**：完整的类型定义
- **与 lucide-react 一致的 API**：支持 `size`、`color`、`strokeWidth`、`absoluteStrokeWidth` 等属性
- **实心图标支持**：通过 `filled` 渲染实心图标（如 Heart）
- **CLI 工具**：支持生成小程序 TabBar 所需的 PNG 图标

## 安装

```bash
npm install lucide-react-taro
# or
yarn add lucide-react-taro
# or
pnpm add lucide-react-taro
```

## 引入方式

```tsx
// ✅ 推荐：主入口导入（已优化打包速度, 支持 tree-shaking）
import { House, Settings, User } from 'lucide-react-taro';

// 可选：子路径导入（适合只用少量图标的场景）
import { House } from 'lucide-react-taro/icons/house';
```

## 使用

```tsx
import { House, Settings, User, Camera, Zap } from 'lucide-react-taro';

// 基本用法
<House />

// 自定义尺寸
<Settings size={32} />

// 自定义颜色
<Camera color="red" />
<Camera color="#1890ff" />
<Camera color="rgb(255, 0, 0)" />

// 实心图标（如 Heart）
<Heart filled color="#ff3e98" />

// 自定义描边宽度
<Zap strokeWidth={1} />
<Zap strokeWidth={3} />

// 绝对描边宽度（描边不随尺寸缩放）
<Zap size={48} strokeWidth={2} absoluteStrokeWidth />

// 组合使用
<User size={48} color="#ff3e98" strokeWidth={1.5} />

// 自定义 className
<User className="my-icon" />

// 自定义样式
<User size={24} style={{ marginRight: 8 }} />

// className 和 style 组合使用
<User className="my-icon" style={{ marginRight: 8 }} />
```

### LucideTaroProvider（全局默认配置）

通过 `LucideTaroProvider` 为所有子组件设置默认颜色和尺寸，避免在每个图标上重复传递 props：

```tsx
import { LucideTaroProvider, House, Settings, Camera } from 'lucide-react-taro';

// 所有子组件默认使用 #666 颜色和 20px 尺寸
<LucideTaroProvider defaultColor="#666" defaultSize={20}>
  <House />              {/* 使用 #666, 20px */}
  <Settings color="red" /> {/* color prop 优先，使用 red */}
  <Camera size={32} />    {/* size prop 优先，使用 32px */}
</LucideTaroProvider>
```

> **注意**：由于小程序端 SVG 是通过 Data URL 渲染的，图标无法从 CSS 继承父元素的文字颜色（`currentColor` 会回退为黑色）。建议通过 `LucideTaroProvider` 或 `color` prop 显式指定颜色。

## API

| 属性                | 类型             | 默认值 | 说明                                          |
| ------------------- | ---------------- | ------ | --------------------------------------------- |
| size                | number \| string | 24     | 图标尺寸，传 `"inherit"` 使用 Provider 默认值 |
| color               | string           | -      | 图标颜色，传 `"inherit"` 使用 Provider 默认值 |
| filled              | boolean          | false  | 是否渲染为实心（fill=currentColor）           |
| strokeWidth         | number \| string | 2      | 描边宽度                                      |
| absoluteStrokeWidth | boolean          | false  | 绝对描边宽度，启用后描边不随 size 缩放        |
| className           | string           | -      | CSS 类名                                      |
| style               | CSSProperties    | -      | 自定义样式                                    |

同时支持 Taro `Image` 组件的其他属性。

### 强制要求 color 和 size（全局配置）

如果你希望在项目中强制要求每个图标都必须传递 `color` 和 `size` 属性（避免遗漏导致样式不一致），你可以通过 TypeScript 的 Module Augmentation（模块增强）来实现：

```tsx
// 在你的项目类型声明文件（如 global.d.ts 或 taro-env.d.ts）中添加：
export {};
declare module 'lucide-react-taro' {
  interface LucideTaroConfig {
    strictProps: true;
  }
}
```

> **注意**：文件中必须包含 `export {}` 使其成为模块文件，否则 TypeScript 会将 `declare module` 视为完整的模块声明而非模块增强，导致原有导出（如 `House`、`Settings` 等）丢失。

配置后，如果使用图标时不传入 `color` 或 `size`，TypeScript 将会报错。

#### 配合 LucideTaroProvider 使用 `"inherit"`

在 `strictProps` 模式下，如果已通过 `LucideTaroProvider` 设置了默认值，可以传入 `"inherit"` 来使用 Provider 的默认颜色和尺寸，而不必在每个图标上重复传值：

```tsx
import { LucideTaroProvider, House, Settings } from 'lucide-react-taro';

<LucideTaroProvider defaultColor="#666" defaultSize={20}>
  {/* inherit 表示使用 Provider 的默认值 */}
  <House color="inherit" size="inherit" />

  {/* 也可以只 inherit 其中一个，另一个显式指定 */}
  <Settings color="inherit" size={32} />
</LucideTaroProvider>
```

## CLI 工具

`taro-lucide-tabbar`、`taro-lucide-find` 和 `taro-lucide-show` 现已作为独立 CLI 包发布，可直接通过 `npx` 运行。

微信小程序的 TabBar 不支持 base64 或 SVG 图片，只能使用本地 PNG 文件。本库提供了 CLI 工具来生成 TabBar 所需的 PNG 图标。

### 生成 TabBar 图标

```bash
# 生成单个图标
npx taro-lucide-tabbar House -c "#999999"

# 生成带选中状态的图标（推荐）
npx taro-lucide-tabbar House -c "#999999" -a "#1890ff"

# 批量生成多个图标
npx taro-lucide-tabbar House Settings User -c "#999999" -a "#1890ff"

# 指定输出目录
npx taro-lucide-tabbar House -c "#999999" -o ./src/assets/tabbar

# 指定尺寸（小程序推荐 81x81）
npx taro-lucide-tabbar House -c "#999999" -s 81
```

### CLI 参数

| 参数             | 简写 | 默认值           | 说明                                     |
| ---------------- | ---- | ---------------- | ---------------------------------------- |
| `--color`        | `-c` | `#000000`        | 图标颜色                                 |
| `--active-color` | `-a` | -                | 选中状态颜色（不传则不生成 active 版本） |
| `--size`         | `-s` | `81`             | 图标尺寸（小程序推荐 81x81）             |
| `--output`       | `-o` | `./tabbar-icons` | 输出目录                                 |
| `--stroke-width` | -    | `2`              | 描边宽度                                 |

### 输出文件

```
./tabbar-icons/
├── house.png           # 普通状态
├── house-active.png    # 选中状态
├── settings.png
├── settings-active.png
└── ...
```

### 在 app.config.ts 中使用

```ts
export default defineAppConfig({
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/tabbar/house.png',
        selectedIconPath: 'assets/tabbar/house-active.png',
      },
      {
        pagePath: 'pages/settings/index',
        text: '设置',
        iconPath: 'assets/tabbar/settings.png',
        selectedIconPath: 'assets/tabbar/settings-active.png',
      },
    ],
  },
});
```

### 图标查找工具

本库提供了图标查找工具，支持精确查找、模糊查找和列出所有图标。

```bash
# 模糊查找（默认）
npx taro-lucide-find arrow

# 精确查找
npx taro-lucide-find arrow-up --exact

# 批量验证（输出 JSON，适合 AI 调用）
npx taro-lucide-find arrow-up user settings arw --json

# 列出所有图标
npx taro-lucide-find --list
```

### 图标预览工具

本库提供了终端图标预览工具，支持在命令行直接查看图标样式。

```bash
# 预览图标
npx taro-lucide-show ArrowUp

# 自定义大小和颜色
npx taro-lucide-show Heart -c "#ff3e98" -s 30
```

## 开发

```bash
# 安装依赖
npm install

# 完整构建
npm run build

# 运行测试
npm test
```

### 项目结构

```
├── packages/
│   ├── lucide-react-taro/         # 主库源码与测试
│   ├── generate/                  # 共享构建工具包
│   ├── taro-lucide-tabbar/        # TabBar CLI 包
│   ├── taro-lucide-find/          # 图标查找 CLI 包
│   └── taro-lucide-show/          # 终端预览 CLI 包
├── docs/                          # 文档站
└── .lucide-cache/                 # Lucide 上游图标缓存
```

## License

ISC + MIT (与 Lucide LICENSE 保持一致)

图标版权归 [Lucide](https://github.com/lucide-icons/lucide) 所有。
