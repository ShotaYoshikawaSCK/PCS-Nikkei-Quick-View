# 実装概要: いいねとコメントの複数端末共有機能

## 問題

元の実装では、いいねとコメントが各端末のlocalStorageに保存されており、複数の端末で同じデータを共有できませんでした。

## 解決策

Firebase Realtime Databaseを使用して、いいねとコメントをクラウド上に保存し、リアルタイムで複数端末間で同期する機能を実装しました。

## 実装の詳細

### 1. Firebase統合 (lib/firebase.ts)

- Firebase SDKを統合
- 環境変数を使用した安全な設定管理
- 設定が不完全な場合は自動的にlocalStorageにフォールバック

### 2. ストレージサービス抽象化 (lib/services/storageService.ts)

**主な機能:**
- Firebase Realtime Databaseへのデータ保存・取得
- リアルタイムデータ同期のためのサブスクリプション機能
- Firebaseが利用できない場合のlocalStorageへの自動フォールバック
- 適切なエラーハンドリングとクリーンアップ

**API:**
```typescript
// いいね関連
getLikes(): Promise<LikesRecord>
setLikes(likes: LikesRecord): Promise<void>
subscribeLikes(callback: (likes: LikesRecord) => void): () => void

// コメント関連
getComments(): Promise<CommentsRecord>
setComments(comments: CommentsRecord): Promise<void>
subscribeComments(callback: (comments: CommentsRecord) => void): () => void

// ユーザー名
getUserName(): string
setUserName(userName: string): void
```

### 3. コンポーネント更新

#### AttentionStocksList.tsx
- `storageService`を使用してFirebaseからいいねデータを取得・保存
- リアルタイム更新のためのサブスクリプション追加
- コンポーネントアンマウント時の適切なクリーンアップ

#### CommentSection.tsx
- `storageService`を使用してFirebaseからコメントデータを取得・保存
- リアルタイム更新のためのサブスクリプション追加
- コンポーネントアンマウント時の適切なクリーンアップ

### 4. GitHub Actions更新

`.github/workflows/deploy.yml`にFirebase環境変数を追加し、ビルド時に設定を注入します。

### 5. ドキュメント

- `FIREBASE_SETUP.md`: 詳細なFirebaseセットアップ手順
- `README.md`: 新機能の説明と設定手順を追加
- `.env.example`: 必要な環境変数のサンプル

## 動作モード

### モード1: Firebase有効（推奨）

Firebaseが正しく設定されている場合:
1. すべてのいいねとコメントがFirebase Realtime Databaseに保存
2. リアルタイムで複数端末間で自動同期
3. バックアップとしてlocalStorageにも保存

### モード2: localStorageフォールバック

Firebaseが設定されていない、または利用できない場合:
1. 自動的にlocalStorageにフォールバック
2. 元の動作を維持（端末固有のストレージ）
3. コンソールに警告メッセージを出力

## セキュリティ

- CodeQL分析: 脆弱性なし
- Firebase環境変数は`.env.local`で管理（Gitにコミットされない）
- Firebase Security Rulesで適切なアクセス制御が必要

## 互換性

- **破壊的変更なし**: Firebaseを設定しなくても既存の動作を維持
- **段階的な移行**: いつでもFirebaseを有効化・無効化可能
- **既存データ**: localStorageの既存データは保持され、Firebaseと併用可能

## セットアップ方法

詳細は`FIREBASE_SETUP.md`を参照してください。

基本的な手順:
1. Firebaseプロジェクトを作成
2. Realtime Databaseを有効化
3. `.env.local`に設定値を追加
4. アプリケーションを起動

## テスト方法

1. 異なるブラウザまたは端末でアプリケーションを開く
2. 一方でいいねやコメントを追加
3. もう一方でリアルタイムに反映されることを確認

## 今後の改善案

1. 認証機能の追加（Firebase Authentication）
2. スパム対策の実装
3. コメント削除・編集機能
4. ページネーション
5. より詳細なセキュリティルール
