'use client';

import { useEffect, useState } from "react";
import { NewsItem } from "@/lib/types";
import { fetchEconomicNews } from "@/lib/services/newsService";

export default function NewsSummaryCard() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadNews() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchEconomicNews();
        if (isMounted) {
          setNews(data.items);
          setUpdatedAt(data.updatedAt);
        }
      } catch (err) {
        console.error("ニュース取得エラー:", err);
        if (isMounted) {
          setError("ニュースの取得に失敗しました");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    loadNews();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">ニュースを読み込み中...</span>
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

  const formatPublishedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}分前`;
    } else if (diffHours < 24) {
      return `${diffHours}時間前`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}日前`;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          最新の経済ニュース
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(updatedAt)} 更新
        </span>
      </div>
      
      <div className="space-y-4">
        {news.map((item, index) => (
          <div
            key={index}
            className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-r"
          >
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                {item.title}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                {formatPublishedDate(item.publishedAt)}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
              {item.description}
            </p>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">{item.source}</span>
            </div>
          </div>
        ))}
      </div>
      
      {news.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          ニュースデータがありません
        </div>
      )}
    </div>
  );
}
