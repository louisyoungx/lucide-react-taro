# lucide-react-taro

[![npm version](https://img.shields.io/npm/v/lucide-react-taro.svg)](https://www.npmjs.com/package/lucide-react-taro)
[![npm downloads](https://img.shields.io/npm/dm/lucide-react-taro.svg)](https://www.npmjs.com/package/lucide-react-taro)
[![license](https://img.shields.io/npm/l/lucide-react-taro.svg)](https://github.com/louisyoungx/lucide-react-taro/blob/main/LICENSE)

在 Taro 小程序中使用 [Lucide](https://lucide.dev/) 图标的高性能解决方案。

## AI 助手接入

本项目提供了 [SKILL.md](https://github.com/louisyoungx/lucide-react-taro/blob/main/SKILL.md) 文件，方便 AI 助手（如 Claude、Cursor 等）快速了解如何使用本库。

你可以将 SKILL.md 的内容提供给 AI 助手，或者直接引用该文件链接，让 AI 更准确地帮助你在 Taro 项目中集成 Lucide 图标。

## 特性

- **动态颜色支持**：运行时动态修改图标颜色
- **Tree Shaking**：每个图标独立模块，只打包你使用的图标
- **TypeScript 支持**：完整的类型定义
- **与 lucide-react 一致的 API**：支持 `size`、`color`、`strokeWidth`、`absoluteStrokeWidth` 等属性
- **CLI 工具**：支持生成小程序 TabBar 所需的 PNG 图标

## 安装

```bash
npm install lucide-react-taro
# or
yarn add lucide-react-taro
# or
pnpm add lucide-react-taro
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

## API

| 属性                | 类型             | 默认值         | 说明                                   |
| ------------------- | ---------------- | -------------- | -------------------------------------- |
| size                | number \| string | 24             | 图标尺寸                               |
| color               | string           | 'currentColor' | 图标颜色                               |
| strokeWidth         | number \| string | 2              | 描边宽度                               |
| absoluteStrokeWidth | boolean          | false          | 绝对描边宽度，启用后描边不随 size 缩放 |
| className           | string           | -              | CSS 类名                               |
| style               | CSSProperties    | -              | 自定义样式                             |

同时支持 Taro `Image` 组件的其他属性。

## CLI 工具

微信小程序的 TabBar 不支持 base64 或 SVG 图片，只能使用本地 PNG 文件。本库提供了 CLI 工具来生成 TabBar 所需的 PNG 图标。

### 生成 TabBar 图标

```bash
# 首先确保已下载图标资源
npm run fetch-icons

# 生成单个图标
npx lucide-react-taro create-tabbar-icon House -c "#999999"

# 生成带选中状态的图标（推荐）
npx lucide-react-taro create-tabbar-icon House -c "#999999" -a "#1890ff"

# 批量生成多个图标
npx lucide-react-taro create-tabbar-icon House Settings User -c "#999999" -a "#1890ff"

# 指定输出目录
npx lucide-react-taro create-tabbar-icon House -c "#999999" -o ./src/assets/tabbar

# 指定尺寸（小程序推荐 81x81）
npx lucide-react-taro create-tabbar-icon House -c "#999999" -s 81
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
├── src/
│   ├── Icon.tsx          # 核心图标组件
│   ├── index.ts          # 导出入口（自动生成）
│   ├── icons/            # 图标模块（自动生成）
│   ├── cli/              # CLI 工具
│   │   ├── index.ts      # CLI 入口
│   │   ├── create-tabbar-icon.ts  # TabBar 图标生成命令
│   │   └── utils.ts      # 工具函数
│   └── __tests__/        # 单元测试
├── scripts/
│   ├── fetch-icons.ts    # 拉取 Lucide 图标
│   └── generate.ts       # 生成图标模块
└── dist/                 # 构建产物
```

## License

ISC + MIT (与 Lucide LICENSE 保持一致)

图标版权归 [Lucide](https://github.com/lucide-icons/lucide) 所有。
