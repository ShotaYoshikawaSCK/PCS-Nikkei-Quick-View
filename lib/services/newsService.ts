import { NewsResponse, NewsItem } from "../types";

/**
 * 日本経済ニュースを取得する関数
 * 本番環境では実際のニュースAPIを使用してください
 * 例: NewsAPI.org, Google News RSS, Yahoo!ファイナンスRSSなど
 */
export async function fetchEconomicNews(): Promise<NewsResponse> {
  try {
    // 実装例: モックデータを返す
    // 本番では以下のようなAPIエンドポイントを使用:
    // const response = await fetch('https://newsapi.org/v2/everything?q=日本経済&language=ja&apiKey=YOUR_API_KEY');
    // const data = await response.json();
    
    // モックデータ（開発用）
    const mockNews: NewsItem[] = [
      {
        title: "日経平均、3日続伸で4万円台を回復",
        description: "15日の東京株式市場で日経平均株価は3日続伸し、終値は前日比348円高の4万0125円となった。米国株高や円安進行を受け、輸出関連株を中心に買いが広がった。",
        source: "日本経済新聞",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        title: "日銀、金融政策の正常化を段階的に実施へ",
        description: "日本銀行は今後の金融政策について、経済・物価情勢を見極めながら段階的な正常化を進める方針を示した。市場では追加利上げ時期に注目が集まっている。",
        source: "ロイター",
        publishedAt: new Date(Date.now() - 90000000).toISOString(),
      },
      {
        title: "円相場、一時148円台に 輸出企業の業績改善期待",
        description: "外国為替市場で円相場が一時1ドル＝148円台まで下落。円安により輸出企業の業績改善期待が高まり、自動車や電機株が買われる展開となった。",
        source: "Bloomberg",
        publishedAt: new Date(Date.now() - 93600000).toISOString(),
      },
      {
        title: "半導体関連株が上昇、AI需要拡大で",
        description: "生成AI向け需要の拡大を背景に、半導体関連株が上昇。製造装置メーカーや材料メーカーにも買いが波及し、電気機器セクター全体が堅調な推移となった。",
        source: "日経QUICKニュース",
        publishedAt: new Date(Date.now() - 97200000).toISOString(),
      },
      {
        title: "東証プライム市場、海外投資家の買い越し続く",
        description: "東京証券取引所のプライム市場で、海外投資家による日本株の買い越しが継続。日本企業の株主還元強化や企業統治改革への評価が背景にあるとみられる。",
        source: "時事通信",
        publishedAt: new Date(Date.now() - 100800000).toISOString(),
      },
    ];

    return {
      items: mockNews,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("ニュース取得エラー:", error);
    throw new Error("経済ニュースの取得に失敗しました");
  }
}

/**
 * 実際のニュースAPIを使用する場合の実装例
 * 環境変数にAPIキーを設定して使用してください
 */
export async function fetchEconomicNewsFromAPI(): Promise<NewsResponse> {
  const apiKey = process.env.NEWS_API_KEY;
  
  if (!apiKey) {
    throw new Error("NEWS_API_KEY が設定されていません");
  }

  const response = await fetch(
    `https://newsapi.org/v2/everything?q=日本経済 OR 日経平均 OR 東証&language=ja&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`,
    { next: { revalidate: 3600 } } // 1時間キャッシュ
  );

  if (!response.ok) {
    throw new Error("ニュースAPIからのデータ取得に失敗しました");
  }

  const data = await response.json();
  
  const items: NewsItem[] = data.articles.map((article: any) => ({
    title: article.title,
    description: article.description || article.content || "",
    source: article.source.name,
    publishedAt: article.publishedAt,
    url: article.url,
  }));

  return {
    items,
    updatedAt: new Date().toISOString(),
  };
}
