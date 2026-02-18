import { StocksResponse, Stock } from "../types";

/**
 * 今日の注目銘柄を取得する関数
 * Yahoo! Financeなどから実際のデータを取得
 */
export async function fetchAttentionStocks(): Promise<StocksResponse> {
  try {
    // 実際の株価データを取得
    return await fetchAttentionStocksFromYahoo();
  } catch (error) {
    console.error("株価取得エラー:", error);
    // エラー時はフォールバック用の基本的なメッセージを返す
    return {
      items: [{
        code: "----",
        name: "データ取得エラー",
        reason: "現在、株価データを取得できません。しばらくしてから再度お試しください。",
      }],
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Yahoo! Finance Japan から注目銘柄データを取得
 * 日経平均の主要構成銘柄を取得して表示
 * Note: ブラウザからのCORS制限回避のため、CORSプロキシ (allorigins.win) を使用
 */
export async function fetchAttentionStocksFromYahoo(): Promise<StocksResponse> {
  // 日経225の主要銘柄リスト（出来高や時価総額が大きい代表的な銘柄）
  const majorStocks = [
    { code: "7203", name: "トヨタ自動車" },
    { code: "6758", name: "ソニーグループ" },
    { code: "9984", name: "ソフトバンクグループ" },
    { code: "8035", name: "東京エレクトロン" },
    { code: "6501", name: "日立製作所" },
    { code: "6861", name: "キーエンス" },
    { code: "4063", name: "信越化学工業" },
    { code: "8306", name: "三菱UFJフィナンシャル・グループ" },
    { code: "9433", name: "KDDI" },
    { code: "4568", name: "第一三共" },
    { code: "6702", name: "富士通" },
    { code: "2914", name: "日本たばこ産業" },
    { code: "9020", name: "東日本旅客鉄道" },
    { code: "8058", name: "三菱商事" },
    { code: "7974", name: "任天堂" },
  ];

  try {
    // Yahoo Finance から複数銘柄のデータを並列取得
    const stockDataPromises = majorStocks.map(async (stock) => {
      try {
        // Yahoo Finance Japan の株価APIエンドポイント
        const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${stock.code}.T?interval=1d&range=5d`;
        // CORSプロキシを使用してブラウザからのアクセスを可能にする
        const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(yahooUrl)}`;
        
        const response = await fetch(url, {
          cache: 'no-store', // キャッシュを無効化して常に最新データを取得
        });

        if (!response.ok) {
          console.warn(`${stock.name} (${stock.code}) のデータ取得に失敗`);
          return null;
        }

        const data = await response.json();
        const quote = data.chart?.result?.[0];
        
        if (!quote || !quote.meta || !quote.indicators?.quote?.[0]) {
          return null;
        }

        const meta = quote.meta;
        const prices = quote.indicators.quote[0];
        
          // 日本時間で前営業日の終値を正しく取得
          const timestamps: number[] = quote.timestamp || [];
          const closePrices: number[] = prices.close?.filter((p: number | null): p is number => p != null) || [];

          let latestClose: number | undefined = undefined;
          let previousClose: number | undefined = undefined;

          if (timestamps.length === closePrices.length && closePrices.length >= 2) {
            // JST変換し、年月日単位で比較
            const dateClosePairs = timestamps.map((ts, i) => {
              const jst = new Date((ts + 9 * 60 * 60) * 1000);
              // 年月日文字列（例: 2026-2-13）
              const ymd = `${jst.getFullYear()}-${jst.getMonth() + 1}-${jst.getDate()}`;
              return { ymd, close: closePrices[i], rawDate: jst };
            });

            // 今日のJST年月日
            const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000);
            const todayYMD = `${nowJST.getFullYear()}-${nowJST.getMonth() + 1}-${nowJST.getDate()}`;

            // 今日より前の営業日だけに絞る
            const validPairs = dateClosePairs
              .filter(pair => pair.ymd < todayYMD)
              .sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

            if (validPairs.length >= 2) {
              latestClose = validPairs[0].close;
              previousClose = validPairs[1].close;
            } else if (validPairs.length === 1) {
              latestClose = validPairs[0].close;
              previousClose = undefined;
            }
          } else {
            // フォールバック
            latestClose = closePrices.length > 0 ? closePrices[closePrices.length - 1] : undefined;
            previousClose = closePrices.length > 1 ? closePrices[closePrices.length - 2] : undefined;
          }

          // 現在価格: regularMarketPrice（市場営業中）または最新の終値
          const currentPrice = meta.regularMarketPrice || latestClose;

          // 前日比を計算
          const change = currentPrice && previousClose ? currentPrice - previousClose : undefined;
          const changePercent = change && previousClose ? (change / previousClose) * 100 : undefined;

          // 出来高の取得（最新の値）
          const volumes = prices.volume?.filter((v: number | null): v is number => v != null) || [];
          const latestVolume = volumes.length > 0 ? volumes[volumes.length - 1] : undefined;

          return {
            code: stock.code,
            name: stock.name,
            price: currentPrice ? Math.round(currentPrice) : undefined,
            previousClose: previousClose ? Math.round(previousClose) : undefined,
            change: change ? Math.round(change) : undefined,
            changePercent: changePercent ? Number(changePercent.toFixed(2)) : undefined,
            volume: latestVolume,
            reason: generateStockReason(stock.name, changePercent),
          };
      } catch (error) {
        console.error(`${stock.name} のデータ取得エラー:`, error);
        return null;
      }
    });

    const results = await Promise.all(stockDataPromises);
    
    // 取得に成功した銘柄のみをフィルタリング
    const validStocks = results.filter((stock) => stock !== null) as Stock[];

    if (validStocks.length === 0) {
      throw new Error("有効な株価データを取得できませんでした");
    }

    // 前日比の大きい順にソート（絶対値）
    validStocks.sort((a, b) => {
      const aChange = Math.abs(a.changePercent || 0);
      const bChange = Math.abs(b.changePercent || 0);
      return bChange - aChange;
    });

    return {
      items: validStocks,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Yahoo Finance データ取得エラー:", error);
    throw error;
  }
}

/**
 * 銘柄の変動率に応じた注目理由を生成
 */
function generateStockReason(stockName: string, changePercent?: number): string {
  if (changePercent === undefined) {
    return "市場動向に注目";
  }
  
  if (changePercent > 3) {
    return "大幅上昇で市場の注目集まる";
  } else if (changePercent > 1) {
    return "堅調な推移で買い優勢";
  } else if (changePercent > 0) {
    return "緩やかな上昇トレンド";
  } else if (changePercent > -1) {
    return "小幅な調整局面";
  } else if (changePercent > -3) {
    return "利益確定売りで調整";
  } else {
    return "大幅下落で警戒感";
  }
}
