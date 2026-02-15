import { NewsResponse, NewsItem } from "../types";

/**
 * 日本経済ニュースを取得する関数
 * NHK NewsのRSSフィードから経済ニュースを取得します
 */
export async function fetchEconomicNews(): Promise<NewsResponse> {
  try {
    // RSSフィードから経済ニュースを取得
    return await fetchEconomicNewsFromRSS();
  } catch (error) {
    console.error("ニュース取得エラー:", error);
    // エラー時はフォールバック用の基本的なメッセージを返す
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
 * RSSフィードから日本の経済ニュースを取得する実装
 * NHK NewsのビジネスRSSフィードを使用（公開APIで認証不要）
 */
export async function fetchEconomicNewsFromRSS(): Promise<NewsResponse> {
  try {
    // NHK News Web のビジネスRSSフィード
    const rssUrl = "https://www.nhk.or.jp/rss/news/cat6.xml";
    
    const response = await fetch(rssUrl, {
      next: { revalidate: 3600 }, // 1時間キャッシュ
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      throw new Error(`RSSフィード取得に失敗しました: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // XMLをパースしてニュース項目を抽出
    const items = parseRSSFeed(xmlText);
    
    if (items.length === 0) {
      throw new Error("ニュース記事が見つかりませんでした");
    }

    return {
      items: items.slice(0, 5), // 最新5件を取得
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("RSS取得エラー:", error);
    throw error;
  }
}

/**
 * RSSフィードのXMLをパースしてNewsItem配列に変換
 */
function parseRSSFeed(xmlText: string): NewsItem[] {
  const items: NewsItem[] = [];
  
  try {
    // <item>タグで分割して各記事を抽出
    const itemMatches = xmlText.match(/<item>[\s\S]*?<\/item>/g);
    
    if (!itemMatches) {
      return items;
    }

    for (const itemXml of itemMatches) {
      // タイトルを抽出
      const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || 
                        itemXml.match(/<title>([\s\S]*?)<\/title>/);
      const title = titleMatch ? titleMatch[1].trim() : "タイトルなし";

      // 説明を抽出
      const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || 
                       itemXml.match(/<description>([\s\S]*?)<\/description>/);
      const description = descMatch ? descMatch[1].trim() : "説明なし";

      // 公開日時を抽出
      const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      const publishedAt = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();

      // URLを抽出
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
      const url = linkMatch ? linkMatch[1].trim() : undefined;

      items.push({
        title,
        description,
        source: "NHK NEWS WEB",
        publishedAt,
        url,
      });
    }
  } catch (error) {
    console.error("RSSパースエラー:", error);
  }

  return items;
}
