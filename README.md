# lucide-react-taro

在 Taro 小程序中使用 [Lucide](https://lucide.dev/) 图标的高性能解决方案。

## 特性

- **预编译 Base64**：所有 SVG 在构建时转换为 Base64 Data URL，避免运行时计算开销
- **Tree Shaking**：每个图标独立模块，只打包你使用的图标
- **TypeScript 支持**：完整的类型定义
- **自动同步**：脚本支持拉取最新 Lucide 图标库

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
import { Icon, House, Settings, User } from 'lucide-react-taro';

// 基本用法
<Icon icon={House} />

// 自定义尺寸
<Icon icon={Settings} size={32} />

// 自定义颜色
<Icon icon={User} size={24} color="#ff6b6b" />

// 自定义样式
<Icon icon={House} style={{ marginRight: 8 }} />
```

### 按需导入（推荐）

为了获得最佳的 tree shaking 效果，建议直接从子路径导入：

```tsx
import { Icon } from 'lucide-react-taro';
import { House } from 'lucide-react-taro/icons/house';
import { Settings } from 'lucide-react-taro/icons/settings';
```

## API

### Icon 组件

| 属性  | 类型          | 默认值 | 说明                           |
| ----- | ------------- | ------ | ------------------------------ |
| icon  | string        | -      | 必需。图标的 Base64 数据       |
| size  | number        | 24     | 图标尺寸（像素）               |
| color | string        | -      | 图标颜色（会替换 stroke 属性） |
| style | CSSProperties | -      | 自定义样式                     |

同时支持 Taro `Image` 组件的其他属性。

## 为什么选择 lucide-react-taro？

### 性能对比

传统方案（运行时转换）：
```tsx
// ❌ 每次渲染都需要执行 btoa/base64 转换
<Icon icon={Home} /> // 运行时计算 SVG -> Base64
```

lucide-react-taro（预编译）：
```tsx
// ✅ 直接使用预编译的 Base64 字符串
<Icon icon={House} /> // 零运行时开销
```

## 开发

```bash
# 安装依赖
npm install

# 拉取最新 Lucide 图标
npm run fetch-icons

# 生成图标模块
npm run generate

# 完整构建
npm run build

# 清理构建产物
npm run clean
```

## 更新图标

当 Lucide 发布新版本时，运行以下命令更新图标：

```bash
npm run build:icons
npm run build
```

## License

ISC + MIT

图标版权归 [Lucide](https://github.com/lucide-icons/lucide) 所有。
