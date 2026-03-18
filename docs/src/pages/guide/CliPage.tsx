export default function CliPage() {
  return (
    <section className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold tracking-tight border-b pb-2">CLI 工具</h2>
      
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">生成 TabBar 图标</h3>
          <p className="mb-4 text-foreground/90">
            微信小程序的 TabBar 不支持 base64 或 SVG 图片，只能使用本地 PNG 文件。
            本库提供了 CLI 工具来一键生成这些 PNG 图标。
          </p>
          <div className="rounded-lg border bg-card p-6 shadow-sm overflow-x-auto">
            <pre className="text-sm font-mono">
              <code className="text-foreground">
{`# 生成单个图标
npx taro-lucide-tabbar House -c "#999999"

# 生成带选中状态的图标（推荐）
npx taro-lucide-tabbar House -c "#999999" -a "#1890ff"

# 批量生成多个图标
npx taro-lucide-tabbar House Settings User -c "#999999" -a "#1890ff"

# 指定输出目录和尺寸（小程序推荐 81x81）
npx taro-lucide-tabbar House -c "#999999" -o ./src/assets/tabbar -s 81`}
              </code>
            </pre>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">查找和验证图标</h3>
          <p className="mb-4 text-foreground/90">
            实用的终端工具，支持在命令行直接查找图标，或通过代码批量验证。
          </p>
          <div className="rounded-lg border bg-card p-6 shadow-sm overflow-x-auto">
            <pre className="text-sm font-mono">
              <code className="text-foreground">
{`# 模糊查找
npx taro-lucide-find arrow

# 精确查找
npx taro-lucide-find arrow-up --exact

# JSON 格式输出（非常适合 AI 助手调用）
npx taro-lucide-find arrow-up user settings arw --json`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}