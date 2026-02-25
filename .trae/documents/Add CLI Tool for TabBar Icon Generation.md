## 实现计划：TabBar 图标生成 CLI 工具

### 目标

为微信小程序 TabBar 提供图标生成工具，将 Lucide SVG 图标转换为小程序支持的 PNG 格式。

### 新增依赖

```json
{
  "dependencies": {
    "sharp": "^0.33.0",
    "commander": "^12.0.0"
  }
}
```

### 新增文件

1. **`src/cli/index.ts`** - CLI 入口，注册命令
2. **`src/cli/create-tabbar-icon.ts`** - TabBar 图标生成逻辑
3. **`src/cli/utils.ts`** - 工具函数（SVG 处理、颜色替换等）

### package.json 修改

* 添加 `bin` 字段指向 CLI 入口

* 添加 `dependencies`（sharp、commander）

* 添加构建脚本

### CLI 使用方式

```bash
# 生成单个图标
npx lucide-react-taro create-tabbar-icon House -c "#999" -a "#1890ff"

# 批量生成
npx lucide-react-taro create-tabbar-icon House Settings User -c "#999" -a "#1890ff" -o ./src/assets/tabbar
```

### 输出结果

```
./tabbar-icons/
├── house.png
├── house-active.png
└── ...
```

### 实现步骤

1. 安装依赖（sharp、commander）
2. 创建 CLI 目录结构和入口文件
3. 实现 `create-tabbar-icon` 命令
4. 修改 package.json 添加 bin 配置
5. 添加单元测试，达到 100% 覆盖率
6. 更新 README 文档与 SKILL 文档

