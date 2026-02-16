'use client';

import { useEffect, useState } from "react";
import { Stock } from "@/lib/types";
import { fetchAttentionStocks } from "@/lib/services/stockService";

export default function AttentionStocksList() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadStocks() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAttentionStocks();
        if (isMounted) {
          setStocks(data.items);
          setUpdatedAt(data.updatedAt);
        }
      } catch (err) {
        console.error("株価取得エラー:", err);
        if (isMounted) {
          setError("株価データの取得に失敗しました");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    loadStocks();
    
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">株価データを読み込み中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Tokyo",
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("ja-JP");
  };

  const formatVolume = (volume: number) => {
    if (volume >= 10000000) {
      return `${(volume / 10000000).toFixed(1)}千万株`;
    } else if (volume >= 10000) {
      return `${(volume / 10000).toFixed(1)}万株`;
    }
    return `${formatNumber(volume)}株`;
  };

  const getChangeColor = (change: number | undefined) => {
    if (!change) return "text-gray-600 dark:text-gray-400";
    return change > 0
      ? "text-red-600 dark:text-red-400"
      : change < 0
      ? "text-blue-600 dark:text-blue-400"
      : "text-gray-600 dark:text-gray-400";
  };

  const getChangeBgColor = (change: number | undefined) => {
    if (!change) return "bg-gray-100 dark:bg-gray-700";
    return change > 0
      ? "bg-red-50 dark:bg-red-900/20"
      : change < 0
      ? "bg-blue-50 dark:bg-blue-900/20"
      : "bg-gray-100 dark:bg-gray-700";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          注目銘柄
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(updatedAt)} 更新
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                コード
              </th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                銘柄名
              </th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                株価
              </th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                前日終値
              </th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                前日比
              </th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                出来高
              </th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                注目理由
              </th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="py-3 px-2 text-sm font-mono text-gray-900 dark:text-white">
                  {stock.code}
                </td>
                <td className="py-3 px-2 text-sm font-medium text-gray-900 dark:text-white">
                  {stock.name}
                </td>
                <td className="py-3 px-2 text-sm text-right font-semibold text-gray-900 dark:text-white">
                  {stock.price ? `¥${formatNumber(stock.price)}` : "-"}
                </td>
                <td className="py-3 px-2 text-sm text-right text-gray-600 dark:text-gray-400">
                  {stock.previousClose ? `¥${formatNumber(stock.previousClose)}` : "-"}
                </td>
                <td className="py-3 px-2 text-right">
                  {stock.change !== undefined && stock.changePercent !== undefined ? (
                    <div className={`inline-flex flex-col items-end ${getChangeBgColor(stock.change)} px-2 py-1 rounded`}>
                      <span className={`text-sm font-semibold ${getChangeColor(stock.change)}`}>
                        {stock.change > 0 ? "+" : ""}
                        {formatNumber(stock.change)}
                      </span>
                      <span className={`text-xs ${getChangeColor(stock.change)}`}>
                        ({stock.changePercent > 0 ? "+" : ""}
                        {stock.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-3 px-2 text-sm text-right text-gray-600 dark:text-gray-400">
                  {stock.volume ? formatVolume(stock.volume) : "-"}
                </td>
                <td className="py-3 px-2 text-sm text-gray-700 dark:text-gray-300">
                  {stock.reason || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {stocks.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          銘柄データがありません
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
        <p className="text-xs text-yellow-800 dark:text-yellow-200">
          ⚠️ 注意：このアプリケーションは情報提供を目的としています。実際の投資判断に使用する場合は村上ファンドの許可が必要です。
        </p>
      </div>
    </div>
  );
}
