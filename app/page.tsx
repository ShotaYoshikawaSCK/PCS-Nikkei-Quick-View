import NewsSummaryCard from "@/components/NewsSummaryCard";
import AttentionStocksList from "@/components/AttentionStocksList";
import { fetchEconomicNews } from "@/lib/services/newsService";
import { fetchAttentionStocks } from "@/lib/services/stockService";

export const revalidate = 3600; // 1時間ごとに再検証

export default async function Home() {
  // データを並列で取得
  const [newsData, stocksData] = await Promise.all([
    fetchEconomicNews(),
    fetchAttentionStocks(),
  ]);

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            PCS 日経クイックビュー
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            昨日の日本経済ニュースと今日の注目銘柄を一目でチェック
          </p>
        </header>

        {/* コンテンツグリッド */}
        <div className="space-y-8">
          {/* ニュースセクション */}
          <section>
            <NewsSummaryCard news={newsData.items} updatedAt={newsData.updatedAt} />
          </section>

          {/* 注目銘柄セクション */}
          <section>
            <AttentionStocksList stocks={stocksData.items} updatedAt={stocksData.updatedAt} />
          </section>
        </div>

        {/* フッター */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            このアプリケーションはデモンストレーション用です。
            実際の投資判断には使用しないでください。
          </p>
          <p className="mt-2">
            データは定期的に更新されます（約1時間ごと）
          </p>
        </footer>
      </div>
    </main>
  );
}
