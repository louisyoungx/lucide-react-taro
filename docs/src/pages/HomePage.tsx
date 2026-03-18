import { Link } from "react-router-dom";
import { ArrowRight, Package, Terminal, Zap, Bot, Image as ImageIcon, Paintbrush, Sparkles, TerminalSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { HeroIcons } from "@/components/HeroIcons";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 py-8">
      <section className="grid lg:grid-cols-2 gap-8 items-center min-h-[300px]">
        <div className="flex flex-col items-start gap-6 py-8">
          <div className="flex items-center gap-4">
            <img src="/assets/logo.svg" alt="lucide-react-taro logo" className="h-16 w-16" />
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Lucide React Taro
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-[700px]">
            为 Taro 应用打造的精美、一致的图标库。基于 Lucide 构建。
            支持 Tree-shaking、动态颜色以及描边自定义。
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link to="/guide">
              <Button size="lg" className="gap-2">
                开始使用 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/icons">
              <Button size="lg" variant="outline" className="gap-2">
                查看所有图标
              </Button>
            </Link>
            <a
              href="https://github.com/louisyoungx/lucide-react-taro"
              target="_blank"
              rel="noreferrer"
            >
              <Button size="lg" variant="outline" className="gap-2">
                GitHub <Package className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>

        {/* Hero Image / Animation Area */}
        <HeroIcons />
      </section>

      <section className="grid gap-8 md:grid-cols-3 mt-8">
        <div className="flex flex-col gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">轻量高效</h3>
          <p className="text-muted-foreground">
            专为 Taro 小程序优化，支持 Tree-shaking，让你的打包体积保持在最小状态。
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">简单易用</h3>
          <p className="text-muted-foreground">
            拥有和 lucide-react 完全一致的简单 API。直接导入即可使用。
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Terminal className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">CLI 工具</h3>
          <p className="text-muted-foreground">
            内置 CLI 工具，可一键生成小程序 TabBar 必备的 PNG 图标文件。
          </p>
        </div>
      </section>

      {/* Usage Section */}
      <section className="mt-10 border-t pt-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold tracking-tight">
              在 Taro 中完全可定制
            </h2>
            <p className="text-lg text-muted-foreground">
              支持在运行时动态修改颜色、尺寸和描边宽度。
              甚至支持在激活状态时使用实心（Filled）模式渲染图标。
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Paintbrush className="h-4 w-4" />
                </div>
                <span>动态颜色与描边自定义</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Package className="h-4 w-4" />
                </div>
                <span>针对小程序优化的 Tree-shaking 支持</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span>实心模式 (Filled) 支持</span>
              </li>
            </ul>
          </div>
          <CodeBlock
            language="tsx"
            code={`import { Heart, Settings, Zap } from 'lucide-react-taro';

// 基础用法
<Settings size={32} />

// 动态修改颜色
<Zap color="#1890ff" />

// 实心图标（例如：用于激活状态）
<Heart filled color="#ff3e98" />

// 自定义描边宽度
<Zap strokeWidth={3} absoluteStrokeWidth />`}
          />
        </div>
      </section>

      {/* TabBar Generator Section */}
      <section className="mt-10 border-t pt-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <CodeBlock
            className="order-2 lg:order-1"
            language="bash"
            code={`# 生成单个图标
npx taro-lucide-tabbar House -c "#999999"

# 生成附带选中状态的图标
npx taro-lucide-tabbar House -c "#999999" -a "#1890ff"

# 批量生成多个图标
npx taro-lucide-tabbar House Settings User \\
  -c "#999999" -a "#1890ff" -s 81`}
          />
          <div className="order-1 lg:order-2 flex flex-col gap-6">
            <h2 className="text-3xl font-bold tracking-tight">
              TabBar PNG 生成器
            </h2>
            <p className="text-lg text-muted-foreground">
              微信小程序的 TabBar 不支持 SVG 或 base64 图片。
              我们的 CLI 工具可以自动帮你生成所需的高清常规与选中状态 PNG 图标。
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-background border">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">本地 PNG 文件</h4>
                  <p className="text-sm text-muted-foreground">直接将高质量 PNG 文件输出到你的静态资源目录中。</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-background border">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <TerminalSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">批量处理</h4>
                  <p className="text-sm text-muted-foreground">使用一条命令即可生成多个图标及其选中状态。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="mt-10 mb-16 border-t pt-16 text-center">
        <div className="max-w-[800px] mx-auto flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
            <Bot className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            AI 助手接入
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            正在使用 Trae 或 Cursor 等 AI 编程助手？只需安装我们的技能 (Skill)，
            即可让 AI 瞬间掌握如何在你的项目中使用 lucide-react-taro。
          </p>
          <CodeBlock
            language="bash"
            code="npx skills add louisyoungx/lucide-react-taro"
          />
        </div>
      </section>
    </div>
  );
}
