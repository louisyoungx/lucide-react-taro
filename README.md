# lucide-react-taro

在 Taro 小程序中使用 [Lucide](https://lucide.dev/) 图标的高性能解决方案。

## AI 助手接入

本项目提供了 [SKILL.md](https://github.com/louisyoungx/lucide-react-taro/blob/main/SKILL.md) 文件，方便 AI 助手（如 Claude、Cursor 等）快速了解如何使用本库。

你可以将 SKILL.md 的内容提供给 AI 助手，或者直接引用该文件链接，让 AI 更准确地帮助你在 Taro 项目中集成 Lucide 图标。

## 特性

- **动态颜色支持**：运行时动态修改图标颜色
- **Tree Shaking**：每个图标独立模块，只打包你使用的图标
- **TypeScript 支持**：完整的类型定义
- **与 lucide-react 一致的 API**：支持 `size`、`color`、`strokeWidth`、`absoluteStrokeWidth` 等属性

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
│   └── __tests__/        # 单元测试
├── scripts/
│   ├── fetch-icons.ts    # 拉取 Lucide 图标
│   └── generate.ts       # 生成图标模块
└── dist/                 # 构建产物
```

### 测试

项目使用 [Vitest](https://vitest.dev/) 作为测试框架，测试覆盖率 100%。

测试内容包括：
- `createIcon` 函数创建和配置
- 图标组件渲染（尺寸、颜色、样式等）
- SVG 颜色替换逻辑
- 缓存机制
- 工具函数（命名转换、SVG 转义等）

## License

ISC

图标版权归 [Lucide](https://github.com/lucide-icons/lucide) 所有。
