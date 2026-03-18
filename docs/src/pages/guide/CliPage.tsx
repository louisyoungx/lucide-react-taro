import { CodeBlock } from "@/components/ui/CodeBlock";

export default function CliPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">CLI 工具</h1>
        <p className="text-muted-foreground">提供方便的命令行工具来生成适用于微信小程序的 TabBar 图标和查找图标。</p>
      </div>
      
      <section className="flex flex-col gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">生成 TabBar 图标</h3>
          <p className="mb-4 text-foreground/90">
            微信小程序的 TabBar 不支持 base64 或 SVG 图片，只能使用本地 PNG 文件。
            本库提供了 CLI 工具来一键生成这些 PNG 图标。
          </p>
          <CodeBlock
            language="bash"
            code={`# 生成单个图标
npx taro-lucide-tabbar House -c "#999999"

# 生成带选中状态的图标（推荐）
npx taro-lucide-tabbar House -c "#999999" -a "#1890ff"

# 批量生成多个图标
npx taro-lucide-tabbar House Settings User -c "#999999" -a "#1890ff"

# 指定输出目录和尺寸（小程序推荐 81x81）
npx taro-lucide-tabbar House -c "#999999" -o ./src/assets/tabbar -s 81`}
          />
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">在终端预览图标</h3>
          <p className="mb-4 text-foreground/90">
            在命令行中直接预览图标的渲染效果。
          </p>
          <CodeBlock
            language="bash"
            code={`# 预览图标
npx taro-lucide-show arrow-up

# 指定尺寸和颜色
npx taro-lucide-show arrow-up -s 60 -c "#ff0000"`}
          />
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">查找和验证图标</h3>
          <p className="mb-4 text-foreground/90">
            实用的终端工具，支持在命令行直接查找图标，或通过代码批量验证。
          </p>
          <CodeBlock
            language="bash"
            code={`# 模糊查找
npx taro-lucide-find arrow

# 精确查找
npx taro-lucide-find arrow-up --exact

# JSON 格式输出（非常适合 AI 助手调用）
npx taro-lucide-find arrow-up user settings arw --json`}
          />
        </div>
      </section>
    </div>
  );
}