import { StocksResponse, Stock } from "../types";

/**
 * 今日の注目銘柄を取得する関数
 * 本番環境では実際の株価APIやスクレイピングを使用してください
 * 例: Yahoo!ファイナンス、kabutan.jp、みんかぶ、JPXデータなど
 */
export async function fetchAttentionStocks(): Promise<StocksResponse> {
  try {
    // 実装例: モックデータを返す
    // 本番では株価APIやスクレイピングを実装
    // 注意: スクレイピングする場合はrobots.txt遵守とレート制限を必ず考慮
    
    // モックデータ（開発用）
    const mockStocks: Stock[] = [
      {
        code: "7203",
        name: "トヨタ自動車",
        price: 3245,
        change: 125,
        changePercent: 4.01,
        reason: "新型EV発表で買い注文殺到",
        volume: 18500000,
      },
      {
        code: "6758",
        name: "ソニーグループ",
        price: 12850,
        change: 380,
        changePercent: 3.05,
        reason: "ゲーム事業好調で上方修正観測",
        volume: 5200000,
      },
      {
        code: "9984",
        name: "ソフトバンクグループ",
        price: 7890,
        change: -115,
        changePercent: -1.44,
        reason: "AI投資拡大も短期的には慎重姿勢",
        volume: 12300000,
      },
      {
        code: "8035",
        name: "東京エレクトロン",
        price: 28500,
        change: 950,
        changePercent: 3.45,
        reason: "半導体需要増で受注好調",
        volume: 3100000,
      },
      {
        code: "6501",
        name: "日立製作所",
        price: 9640,
        change: 220,
        changePercent: 2.34,
        reason: "インフラ事業の大型受注発表",
        volume: 6800000,
      },
      {
        code: "6861",
        name: "キーエンス",
        price: 68900,
        change: 1200,
        changePercent: 1.77,
        reason: "FAセンサー需要拡大継続",
        volume: 890000,
      },
      {
        code: "4063",
        name: "信越化学工業",
        price: 5850,
        change: 185,
        changePercent: 3.27,
        reason: "半導体材料の価格上昇期待",
        volume: 2400000,
      },
      {
        code: "8306",
        name: "三菱UFJフィナンシャル・グループ",
        price: 1456,
        change: 34,
        changePercent: 2.39,
        reason: "金利上昇で銀行株に資金流入",
        volume: 45600000,
      },
      {
        code: "9433",
        name: "KDDI",
        price: 4385,
        change: -28,
        changePercent: -0.63,
        reason: "5G設備投資増で一時的な利益圧迫",
        volume: 3700000,
      },
      {
        code: "4568",
        name: "第一三共",
        price: 4920,
        change: 165,
        changePercent: 3.47,
        reason: "新薬候補の臨床試験好結果",
        volume: 8900000,
      },
      {
        code: "6702",
        name: "富士通",
        price: 2890,
        change: 95,
        changePercent: 3.40,
        reason: "クラウド事業の成長加速",
        volume: 5100000,
      },
      {
        code: "2914",
        name: "日本たばこ産業",
        price: 4125,
        change: -52,
        changePercent: -1.25,
        reason: "加熱式たばこ市場の競争激化",
        volume: 2800000,
      },
      {
        code: "9020",
        name: "東日本旅客鉄道",
        price: 3145,
        change: 78,
        changePercent: 2.54,
        reason: "インバウンド需要回復で業績改善",
        volume: 4200000,
      },
      {
        code: "8058",
        name: "三菱商事",
        price: 2685,
        change: 48,
        changePercent: 1.82,
        reason: "資源価格上昇で収益改善見込み",
        volume: 7600000,
      },
      {
        code: "7974",
        name: "任天堂",
        price: 8250,
        change: -125,
        changePercent: -1.49,
        reason: "新ゲーム機の発売延期観測",
        volume: 3300000,
      },
    ];

    return {
      items: mockStocks,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("株価取得エラー:", error);
    throw new Error("注目銘柄の取得に失敗しました");
  }
}

/**
 * 実際の株価データを取得する場合の実装例
 * Yahoo!ファイナンスなどのAPIやRSSを使用
 */
export async function fetchAttentionStocksFromAPI(): Promise<StocksResponse> {
  // 実装例：Yahoo!ファイナンスのRSSやAPIを使用
  // 注意：商用利用の場合は利用規約を確認すること
  
  // この実装は例示のみで、実際のAPIエンドポイントは環境に応じて設定してください
  throw new Error("実際の株価API実装が必要です");
}
