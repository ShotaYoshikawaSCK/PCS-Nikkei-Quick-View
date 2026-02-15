# PCS 日経クイックビュー

日本の個人投資家向けに「昨日（前営業日）の日本経済トピックス要約」と「今日注目されている銘柄リスト」を1画面で表示するシンプルでモダンなWebアプリケーションです。

## 🌐 オンラインアクセス

このアプリケーションは GitHub Pages でホストされており、以下の URL からアクセスできます：

**https://shotayoshikawasck.github.io/PCS-Nikkei-Quick-View/**

スマートフォンやパソコンのブラウザから直接アクセスして、情報を閲覧できます。

## 🌟 特徴

- **Next.js 14+ (App Router)** - 最新のReact Server Componentsを活用
- **TypeScript** - 型安全な開発環境
- **Tailwind CSS** - モダンでレスポンシブなデザイン
- **ダークモード対応** - 自動的にダークモードで表示
- **リアルタイムデータ** - 経済ニュースと注目銘柄を表示
- **モバイル対応** - スマートフォンでも快適に閲覧可能

## 📋 必要要件

- Node.js 18.17以上
- npm または yarn

## 🚀 環境構築手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/ShotaYoshikawaSCK/PCS-Nikkei-Quick-View.git
cd PCS-Nikkei-Quick-View
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてアプリケーションを確認できます。

## 📦 利用可能なスクリプト

- `npm run dev` - 開発サーバーを起動（ホットリロード対応）
- `npm run build` - 本番用にアプリケーションをビルド
- `npm run start` - 本番用サーバーを起動
- `npm run lint` - ESLintでコードチェック

## 🔧 カスタマイズ方法

### 実際のニュースAPIを使用する

現在はモックデータを使用していますが、実際のニュースAPIに切り替えることができます。

#### NewsAPI.org を使用する場合

1. [NewsAPI.org](https://newsapi.org/) でアカウントを作成し、APIキーを取得
2. プロジェクトルートに `.env.local` ファイルを作成：

```bash
NEWS_API_KEY=あなたのAPIキー
```

3. `lib/services/newsService.ts` で関数を変更：

```typescript
// fetchEconomicNews() の代わりに fetchEconomicNewsFromAPI() を使用
```

### 実際の株価データを使用する

`lib/services/stockService.ts` を編集して、以下のようなソースからデータを取得できます：

- Yahoo!ファイナンス API
- kabutan.jp
- みんかぶ
- JPX（日本取引所グループ）公開データ

⚠️ **注意事項**：
- スクレイピングを行う場合は、必ず対象サイトの利用規約とrobots.txtを確認してください
- レート制限を設け、サーバーに負荷をかけないようにしてください
- 商用利用の場合は、適切なライセンスやAPIプランを使用してください

## 📁 プロジェクト構造

```
PCS-Nikkei-Quick-View/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # ルートレイアウト（ダークモード設定）
│   ├── page.tsx             # メインページ
│   ├── loading.tsx          # ローディングUI
│   ├── error.tsx            # エラーハンドリングUI
│   └── globals.css          # グローバルスタイル
├── components/              # Reactコンポーネント
│   ├── NewsSummaryCard.tsx  # 経済ニュースカード
│   └── AttentionStocksList.tsx  # 注目銘柄リスト
├── lib/                     # ユーティリティとサービス
│   ├── types.ts            # TypeScript型定義
│   └── services/           # データ取得サービス
│       ├── newsService.ts  # ニュース取得
│       └── stockService.ts # 株価取得
├── public/                  # 静的ファイル
├── package.json            # プロジェクト設定
├── tsconfig.json           # TypeScript設定
├── tailwind.config.ts      # Tailwind CSS設定
└── next.config.js          # Next.js設定
```

## 🎨 UI/UX の特徴

### レスポンシブデザイン
- デスクトップ、タブレット、スマートフォンで最適な表示
- Tailwind CSSによる柔軟なグリッドレイアウト

### ダークモード
- 目に優しいダークテーマを標準搭載
- `app/layout.tsx` で `className="dark"` を削除すればライトモードに

### カードレイアウト
- ニュースと銘柄情報を見やすいカードで表示
- ホバー効果による視覚的フィードバック

### ローディング＆エラーハンドリング
- Next.js 14の機能を活用した洗練されたローディング状態
- わかりやすいエラーメッセージと再試行機能

## 🔄 データ更新頻度

- デフォルトでは1時間ごとにデータを再検証（ISR: Incremental Static Regeneration）
- `app/page.tsx` の `revalidate` 設定で変更可能

```typescript
export const revalidate = 3600; // 秒単位（3600秒 = 1時間）
```

## 🚀 デプロイ

このアプリケーションは GitHub Pages に自動デプロイされます。

### 自動デプロイ

- `main` ブランチへのプッシュで自動的にビルド・デプロイが実行されます
- GitHub Actions ワークフローが静的サイトを生成し、GitHub Pages にデプロイします
- デプロイ完了後、https://shotayoshikawasck.github.io/PCS-Nikkei-Quick-View/ でアクセス可能になります

### 手動デプロイ

GitHub のリポジトリページで "Actions" タブから "Deploy to GitHub Pages" ワークフローを手動で実行することもできます。

## ⚠️ 免責事項

このアプリケーションはデモンストレーション用であり、実際の投資判断には使用しないでください。
- 表示されるデータはモックデータです
- 投資は自己責任で行ってください
- 実際の株価や経済ニュースとは異なる場合があります

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストを歓迎します！バグ報告や機能提案は、GitHubのIssuesをご利用ください。

## 📧 お問い合わせ

ご質問やフィードバックは、GitHubのIssuesまでお願いします。