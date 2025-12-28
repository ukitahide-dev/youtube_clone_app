# youtube_clone_app
YouTube風のWebアプリ（React + Django）

## URL
https://my-youtube-frontend-bdqg.onrender.com

※ Render無料プランのため、初回アクセス時に
起動まで少し時間がかかる場合があります。

## 使用技術
- Frontend: React / Vite
- Backend: Django / Django REST Framework
- Auth: JWT (SimpleJWT)
- DB: SQLite（開発環境）、PostgreSQL(本番環境)

## 主な機能
- ユーザー認証（登録・ログイン・JWT認証）
- 動画の投稿・再生・編集・削除
- いいね / コメント / 検索機能
- プレイリスト作成・管理
- チャンネル登録機能

## 工夫した点
- フロントとバックエンドを完全に分離し、
  REST APIを通じてデータをやり取りする構成にしました
- 認証状態をフロント側で管理し、
  ログイン状態に応じて表示を切り替えました

## 苦労した点
- JWT認証の仕組み理解に時間がかかりましたが、
  リクエストの流れを図に書いて整理しました
- DjangoとReactのデータ形式の違いに悩みましたが、
  APIレスポンスを統一することで解決しました
- 開発環境と本番環境で動画データなどのファイルの扱いが異なり、
  コードの修正に時間がかかりました

## 開発背景
フロントエンドとバックエンドを分けたWebアプリ開発の流れを理解するため、
認証・API設計・フロント連携を含むYouTube風アプリを制作しました
