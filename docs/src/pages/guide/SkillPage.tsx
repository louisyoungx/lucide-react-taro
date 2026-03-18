import { CodeBlock } from "@/components/ui/CodeBlock";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function SkillPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">AI 助手技能 (Skill)</h1>
        <p className="text-muted-foreground">利用 AI 助手更高效地在项目中使用和管理图标。</p>
      </div>
      
      <section className="flex flex-col gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">什么是 Skill？</h3>
          <p className="mb-4 text-foreground/90 leading-relaxed">
            我们在根目录提供了一个 <code className="bg-muted px-1.5 py-0.5 rounded text-sm">SKILL.md</code> 文件，用于指导 AI 助手如何正确地在 Taro 项目中使用本图标库。
            通过加载此技能，AI 助手将了解组件库的渲染原理、正确用法以及 CLI 工具的使用方法。
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">如何安装和使用</h3>
          <p className="mb-4 text-foreground/90">
            你可以使用 skills CLI 一键将本项目的技能安装到你的 AI 助手。
          </p>
          <CodeBlock
            language="bash"
            code={`npx skills add louisyoungx/lucide-react-taro`}
          />
          <p className="mt-4 mb-4 text-foreground/90 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span>或者，你也可以直接下载原始文件内容，作为自定义 Prompt 规则。</span>
            <a href="/skill" download="lucide-react-taro-skill.md">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                下载 SKILL.md
              </Button>
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">技能包含的内容</h3>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90 leading-relaxed">
            <li><strong>渲染原理</strong>：告知 AI 在小程序端是基于 <code>&lt;Image /&gt;</code> 渲染 SVG，需要使用 <code>color</code> 属性而非 <code>className="text-red-500"</code>。</li>
            <li><strong>代码示例</strong>：提供了正确的属性传递方法和常见的错误排查示例。</li>
            <li><strong>CLI 工具链</strong>：AI 能够自主调用 <code>taro-lucide-find</code> 验证图标是否存在，或使用 <code>taro-lucide-tabbar</code> 生成 TabBar 用的 PNG 图标。</li>
            <li><strong>注意事项</strong>：帮助 AI 规避诸如颜色继承、TabBar 路径等常见坑点。</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
