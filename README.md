# lucide-react-taro

在 Taro 小程序中使用 [Lucide](https://lucide.dev/) 图标的高性能解决方案。

## 特性

- **预编译 Base64**：所有 SVG 在构建时转换为 Base64 Data URL，避免运行时计算开销
- **Tree Shaking**：每个图标独立模块，只打包你使用的图标
- **TypeScript 支持**：完整的类型定义
- **与 lucide-react 相似的 API**：无缝迁移

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
import { House, Settings, User } from 'lucide-react-taro';

// 基本用法
<House />

// 自定义尺寸
<Settings size={32} />

// 自定义样式
<User size={24} style={{ marginRight: 8 }} />
```

## API

| 属性  | 类型          | 默认值 | 说明             |
| ----- | ------------- | ------ | ---------------- |
| size  | number        | 24     | 图标尺寸（像素） |
| style | CSSProperties | -      | 自定义样式       |

同时支持 Taro `Image` 组件的其他属性。

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
```

## License

ISC

图标版权归 [Lucide](https://github.com/lucide-icons/lucide) 所有。
