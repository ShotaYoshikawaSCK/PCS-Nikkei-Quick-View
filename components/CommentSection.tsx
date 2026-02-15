"use client";

import { Comment } from "@/lib/types";
import { useState, useEffect } from "react";

interface CommentSectionProps {
  stockCode: string;
  stockName: string;
  onClose: () => void;
}

export default function CommentSection({ stockCode, stockName, onClose }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    // Load comments from localStorage
    const storedComments = localStorage.getItem("stockComments");
    if (storedComments) {
      const allComments = JSON.parse(storedComments);
      setComments(allComments[stockCode] || []);
    }

    // Load author name from localStorage or set default
    const storedAuthor = localStorage.getItem("userName");
    setAuthor(storedAuthor || "匿名ユーザー");
  }, [stockCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      stockCode,
      author,
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
    };

    const storedComments = localStorage.getItem("stockComments");
    const allComments = storedComments ? JSON.parse(storedComments) : {};
    
    if (!allComments[stockCode]) {
      allComments[stockCode] = [];
    }
    
    allComments[stockCode].push(comment);
    localStorage.setItem("stockComments", JSON.stringify(allComments));
    
    setComments([...comments, comment]);
    setNewComment("");
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {stockName} ({stockCode}) のコメント
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              まだコメントがありません。最初のコメントを投稿してみましょう！
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {comment.author}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(comment.timestamp)}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Comment Form */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                名前
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  localStorage.setItem("userName", e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="名前を入力"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                コメント
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="コメントを入力..."
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                投稿
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
