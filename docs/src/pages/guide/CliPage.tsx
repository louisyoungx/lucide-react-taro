import { GuidePager } from "@/components/guide/GuidePager";
import { CommandTabs } from "@/components/CommandTabs";

export default function CliPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">CLI 工具</h1>
        <p className="text-muted-foreground">提供方便的独立命令行工具来生成适用于微信小程序的 TabBar 图标、查找图标和预览图标。</p>
      </div>
      
      <section className="flex flex-col gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">生成 TabBar 图标</h3>
          <p className="mb-4 text-foreground/90">
            微信小程序的 TabBar 不支持 base64 或 SVG 图片，只能使用本地 PNG 文件。
            使用独立发布的 <code>taro-lucide-tabbar</code> 即可一键生成这些 PNG 图标。
          </p>
          <CommandTabs
            packageName="taro-lucide-tabbar"
            commands={[
              '--help',
              'House -c "#999999"',
              'House -c "#999999" -a "#1890ff"',
              'House Settings User -c "#999999" -a "#1890ff"',
              'House -c "#999999" -o ./src/assets/tabbar -s 81',
            ]}
          />
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">在终端预览图标</h3>
          <p className="mb-4 text-foreground/90">
            使用独立发布的 <code>taro-lucide-show</code> 在终端中直接预览图标。
          </p>
          <CommandTabs
            packageName="taro-lucide-show"
            commands={[
              '--help',
              'arrow-up',
              'arrow-up -s 60 -c "#ff0000"',
            ]}
          />
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">查找和验证图标</h3>
          <p className="mb-4 text-foreground/90">
            使用独立发布的 <code>taro-lucide-find</code> 在命令行中直接查找图标，或通过代码批量验证。
          </p>
          <CommandTabs
            packageName="taro-lucide-find"
            commands={[
              '--help',
              'arrow',
              'arrow-up --exact',
              'arrow-up user settings arw --json',
            ]}
          />
        </div>
      </section>

      <GuidePager
        previous={{ title: "属性", href: "/guide/props" }}
        next={{ title: "AI 助手技能", href: "/guide/skill" }}
      />
    </div>
  );
}
