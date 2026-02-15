# Firebase セットアップガイド

このアプリケーションは、いいねとコメントを複数端末で共有するためにFirebase Realtime Databaseを使用しています。

## 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: pcs-nikkei-quick-view）
4. Google Analyticsは任意で設定
5. プロジェクトを作成

## 2. Realtime Databaseの設定

1. Firebase Consoleで作成したプロジェクトを開く
2. 左メニューから「構築」→「Realtime Database」を選択
3. 「データベースを作成」をクリック
4. ロケーションを選択（例: asia-northeast1 - 東京）
5. セキュリティルールは「テストモードで開始」を選択（後で変更可能）
6. 「有効にする」をクリック

## 3. セキュリティルールの設定

Realtime Databaseのセキュリティルールを以下のように設定してください：

```json
{
  "rules": {
    "likes": {
      ".read": true,
      ".write": true
    },
    "comments": {
      ".read": true,
      ".write": true
    }
  }
}
```

**注意**: 本番環境では、より厳格なセキュリティルールを設定することを推奨します。

## 4. Firebase設定の取得

1. Firebase Consoleでプロジェクト設定を開く
2. 「全般」タブを選択
3. 「マイアプリ」セクションまでスクロール
4. Webアプリを追加していない場合は、「</>」アイコンをクリックしてWebアプリを追加
5. Firebase SDK snippetから「構成」を選択
6. 表示された設定値をコピー

## 5. 環境変数の設定

プロジェクトルートに`.env.local`ファイルを作成し、以下の環境変数を設定します：

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

**重要**: `.env.local`ファイルは`.gitignore`に含まれているため、Gitにコミットされません。

## 6. GitHub Actionsの設定（自動デプロイ用）

GitHub Pagesへの自動デプロイで環境変数を使用するには：

1. GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」に移動
2. 「New repository secret」をクリック
3. 各環境変数を以下の名前でシークレットとして追加：
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_DATABASE_URL`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`

4. `.github/workflows/deploy.yml`ファイルのビルドステップに環境変数を追加します（詳細は後述）

## 7. ローカルでの動作確認

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開き、いいねやコメントが正常に動作することを確認します。

## 8. 複数端末での動作確認

1. 異なるブラウザまたは異なる端末でアプリケーションを開く
2. 一方の端末でいいねやコメントを追加
3. もう一方の端末でリアルタイムに反映されることを確認

## トラブルシューティング

### Firebaseに接続できない

- ブラウザのコンソールでエラーメッセージを確認
- `.env.local`ファイルの環境変数が正しく設定されているか確認
- Firebase Consoleでデータベースが正しく作成されているか確認

### データが同期されない

- ブラウザのコンソールでエラーメッセージを確認
- Firebase Consoleでセキュリティルールが正しく設定されているか確認
- インターネット接続を確認

### localStorageにフォールバック

- Firebaseが利用できない場合、自動的にlocalStorageにフォールバックします
- ブラウザのコンソールに警告メッセージが表示されます

## セキュリティに関する注意

1. 本番環境では、Firebaseのセキュリティルールを適切に設定してください
2. スパム対策として、書き込み制限を設定することを推奨します
3. 不適切なコンテンツに対する報告機能の追加を検討してください
