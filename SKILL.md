# lucide-react-taro 使用指南

## 简介

`lucide-react-taro` 是 Lucide 图标库的 Taro 适配版本，专为微信小程序等 Taro 支持的平台设计。

## 安装

```bash
npm install lucide-react-taro
# or
pnpm add lucide-react-taro
```

## 基础用法

```tsx
import { House, Settings, Camera, Zap } from 'lucide-react-taro';

function MyComponent() {
  return (
    <View>
      {/* 基本用法 */}
      <House />

      {/* 自定义尺寸 */}
      <Settings size={32} />

      {/* 自定义颜色 */}
      <Camera color="#ff0000" />
      <Camera color="red" />

      {/* 自定义描边宽度 */}
      <Zap strokeWidth={1} />

      {/* 组合使用 */}
      <Zap size={48} color="#1890ff" strokeWidth={1.5} />

      {/* 绝对描边宽度（描边不随尺寸缩放） */}
      <Zap size={48} strokeWidth={2} absoluteStrokeWidth />

      {/* 自定义 className 和 style */}
      <House className="my-icon" style={{ marginRight: 8 }} />
    </View>
  );
}
```

## Props

- `size` (number | string, 默认 24): 图标尺寸
- `color` (string, 默认 'currentColor'): 图标颜色
- `strokeWidth` (number | string, 默认 2): 描边宽度
- `absoluteStrokeWidth` (boolean, 默认 false): 绝对描边宽度，启用后描边不随 size 缩放
- `className` (string): CSS 类名
- `style` (CSSProperties): 内联样式

同时支持 Taro `Image` 组件的其他属性。

## 按需导入

支持 tree shaking，只打包使用到的图标：

```tsx
// ✅ 推荐：只导入需要的图标
import { House, Settings } from 'lucide-react-taro';

// ✅ 也可以从单独的文件导入
import { House } from 'lucide-react-taro/icons/house';
```

## 图标列表

所有图标名称与 [Lucide 官方](https://lucide.dev/icons/) 保持一致，使用 PascalCase 命名。

常用图标示例：
- `House` - 首页
- `Settings` - 设置
- `User` - 用户
- `Search` - 搜索
- `Menu` - 菜单
- `ChevronRight` - 右箭头
- `Check` - 勾选
- `X` - 关闭
- `Plus` - 加号
- `Minus` - 减号
- `Heart` - 心形
- `Star` - 星星
- `Camera` - 相机
- `Image` - 图片
- `Share` - 分享
- `Download` - 下载
- `Upload` - 上传

## CLI 工具：生成 TabBar 图标

微信小程序的 TabBar 不支持 base64 或 SVG 图片，只能使用本地 PNG 文件。本库提供了 CLI 工具来生成 TabBar 所需的 PNG 图标。

### 使用方法

```bash
# 生成带选中状态的图标
npx taro-lucide-tabbar House Settings User -c "#999999" -a "#1890ff"

# 指定输出目录和尺寸
npx taro-lucide-tabbar House -c "#999999" -a "#1890ff" -o ./src/assets/tabbar -s 81
```

### CLI 参数

- `--color`, `-c` (默认 #000000): 图标颜色
- `--active-color`, `-a`: 选中状态颜色
- `--size`, `-s` (默认 81): 图标尺寸
- `--output`, `-o` (默认 ./tabbar-icons): 输出目录
- `--stroke-width` (默认 2): 描边宽度

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
    ],
  },
});
```

## 注意事项

1. **颜色默认值**：默认颜色为 `currentColor`，在小程序 Image 组件中可能不会继承父元素颜色，建议显式设置 `color` 属性。

2. **性能优化**：组件内部已实现 base64 缓存，相同参数组合只计算一次。

3. **兼容性**：已内置 base64 编码 polyfill，无需额外配置即可在微信小程序中使用。

4. **TabBar 图标**：小程序 TabBar 不支持 SVG/base64，请使用 CLI 工具生成 PNG 图标。
