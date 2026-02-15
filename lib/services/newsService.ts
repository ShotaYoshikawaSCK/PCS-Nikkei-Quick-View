import { NewsResponse, NewsItem } from "../types";

/**
 * 日本経済ニュースを取得する関数
 * 本番環境では実際のニュースAPIを使用してください
 * 例: NewsAPI.org, Google News RSS, Yahoo!ファイナンスRSSなど
 */
export async function fetchEconomicNews(): Promise<NewsResponse> {
  try {
    // 実際のニュースAPIを使用
    return await fetchEconomicNewsFromAPI();
  } catch (error) {
    console.error("ニュース取得エラー:", error);
    // APIエラー時はフォールバック用の基本的なメッセージを返す
    return {
      items: [{
        title: "ニュースの取得に失敗しました",
        description: "現在、ニュースデータを取得できません。しばらくしてから再度お試しください。",
        source: "システム",
        publishedAt: new Date().toISOString(),
      }],
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * 実際のニュースAPIを使用する実装
 * 環境変数にAPIキーを設定して使用してください
 */
export async function fetchEconomicNewsFromAPI(): Promise<NewsResponse> {
  const apiKey = process.env.NEWS_API_KEY;
  
  if (!apiKey) {
    console.warn("NEWS_API_KEY が設定されていません。環境変数を設定してください。");
    throw new Error("NEWS_API_KEY が設定されていません");
  }

  try {
    // NewsAPI.orgで日本のビジネスニュースを取得
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=jp&category=business&pageSize=5&apiKey=${apiKey}`,
      { next: { revalidate: 3600 } } // 1時間キャッシュ
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("NewsAPI エラー:", errorData);
      throw new Error(`ニュースAPIからのデータ取得に失敗しました: ${response.status}`);
    }

    const data = await response.json();
    
    // 記事が取得できない場合
    if (!data.articles || data.articles.length === 0) {
      throw new Error("ニュース記事が見つかりませんでした");
    }
    
    const items: NewsItem[] = data.articles.map((article: any) => ({
      title: article.title || "タイトルなし",
      description: article.description || article.content || "説明なし",
      source: article.source?.name || "不明",
      publishedAt: article.publishedAt || new Date().toISOString(),
      url: article.url,
    }));

    return {
      items,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("ニュースAPI取得エラー:", error);
    throw error;
  }
}
