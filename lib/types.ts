// ニュース記事の型定義
export interface NewsItem {
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url?: string;
}

// 注目銘柄の型定義
export interface Stock {
  code: string; // 銘柄コード
  name: string; // 銘柄名
  price?: number; // 現在価格
  change?: number; // 前日比
  changePercent?: number; // 前日比率
  reason?: string; // 注目理由
  volume?: number; // 出来高
}

// APIレスポンスの型定義
export interface NewsResponse {
  items: NewsItem[];
  updatedAt: string;
}

export interface StocksResponse {
  items: Stock[];
  updatedAt: string;
}
