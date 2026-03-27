import { GuidePager } from "@/components/guide/GuidePager";
import { InstallTabs } from "@/components/InstallTabs";

export default function InstallationPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">安装 (Installation)</h1>
        <p className="text-muted-foreground">在你的 Taro 项目中引入并使用 lucide-react-taro 图标库。</p>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight">安装依赖</h2>
          <p className="text-sm text-muted-foreground">
            安装完成后，就可以直接从主入口导入图标组件，在 Taro 页面里使用。
          </p>
        </div>
        <InstallTabs packageName="lucide-react-taro" />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight">渲染原理</h2>
          <p className="text-sm text-muted-foreground">
            这里解释为什么小程序端的图标颜色和 Web SVG 的使用习惯不完全一样。
          </p>
        </div>

        <details className="group rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-foreground marker:content-none">
            <span>展开查看说明</span>
            <span className="text-xs text-muted-foreground transition-transform group-open:rotate-180">
              ▼
            </span>
          </summary>

          <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/85">
            <p>
              在微信小程序环境中，图标不是直接通过
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">{`<svg />`}</code>
              渲染，而是会转换成
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">data:image/svg+xml</code>
              后交给
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">{`<Image />`}</code>
              展示。
            </p>
            <p>
              这意味着
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">className</code>
              主要作用在外层布局，不能像普通 Web SVG 一样通过
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">text-red-500</code>
              去修改图标线条颜色。
            </p>
            <p>
              更稳妥的做法，是直接传
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">color</code>
              ，或者用
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">LucideTaroProvider</code>
              统一设置默认颜色和尺寸。
            </p>
          </div>
        </details>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight">下一步</h2>
          <p className="text-sm text-muted-foreground">
            如果你是第一次使用，建议先看基础用法；后面的属性和 CLI 章节可以按需再看。
          </p>
        </div>
      </section>

      <GuidePager
        next={{ title: "基础用法", href: "/guide/usage" }}
      />
    </div>
  );
}
