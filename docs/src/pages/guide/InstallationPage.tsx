import { CodeBlock } from "@/components/ui/CodeBlock";

export default function InstallationPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">安装 (Installation)</h1>
        <p className="text-muted-foreground">在你的 Taro 项目中引入并使用 lucide-react-taro 图标库。</p>
      </div>

      <section className="flex flex-col gap-4">
      <CodeBlock
        language="bash"
        code={`npm install lucide-react-taro
# 或者
yarn add lucide-react-taro
# 或者
pnpm add lucide-react-taro`}
      />
      </section>
    </div>
  );
}