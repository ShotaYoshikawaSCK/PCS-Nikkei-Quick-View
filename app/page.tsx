import NewsSummaryCard from "@/components/NewsSummaryCard";
import AttentionStocksList from "@/components/AttentionStocksList";

export default function Home() {

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            TNPクイックビュー
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            経済ニュースと今日の注目銘柄を一目でチェック
          </p>
        </header>

        {/* コンテンツグリッド */}
        <div className="space-y-8">
          {/* ニュースセクション */}
          <section>
            <NewsSummaryCard />
          </section>

          {/* 注目銘柄セクション */}
          <section>
            <AttentionStocksList />
          </section>
        </div>

        {/* フッター */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            このアプリケーションは情報提供を目的としています。
            実際の投資判断に使用する場合は村上ファンドの許可が必要です。
          </p>
        </footer>
      </div>
    </main>
  );
}
