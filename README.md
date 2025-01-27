# オサカナカレンダー
Calendar showing fish in season

## プロジェクト概要

### 設計資料
- 画面遷移図: [Figma](https://www.figma.com/design/b8hzx27bijIEnuG0EgmVIF/%E7%84%A1%E9%A1%8C?node-id=0-1&m=dev)
- ER図: [Draw.io](https://drive.google.com/file/d/1AklczGIFwVYjGe806iCxsERWpWhz5SOA/view?usp=sharing)

### サービス概要
オサカナカレンダーは、日本の魚食文化を促進するためのウェブアプリケーションです。縦スクロール形式のカレンダーで旬の魚を表示し、その魚の特色や美味しい食べ方を提供します。ユーザーが手軽に魚の季節性を理解し、食生活に取り入れやすくすることを目指します。

### 開発背景と目的
私は食品系の大学を卒業後、豊洲の卸売会社で水産物の卸売業務に従事しました。豊洲市場で働く中で、日本中から集まる様々な水産物に囲まれ、その豊かさや魅力を日々感じていました。

しかし同時に、日本人の魚離れという問題も強く認識するようになりました。仲卸のおじちゃんたちも「日本人は魚を食わねえ、魚を食うのは外国人ばっかだ」と愚痴をこぼしていたのを記憶しています。

この経験から、日本の伝統的な食文化である魚食を現代のライフスタイルに合わせて再提案したいと考えました。特に、若い世代や魚に馴染みの薄い人々にも魚の美味しいさや栄養価、そして旬の魅力を伝えたいという思いが強くなりました。

## ターゲットユーザー
本サービスは、魚に興味がある人なら誰でも利用できるように設計していますが、特に以下のユーザー層へのアプローチを意識しています：

1. 若い世代（20代~30代）
   - 魚離れが進んでいる世代であるが、ITリテラシーが高くもっとも情報をキャッチしてくれる可能性が高い
   
2. 主婦（夫）
   - 旬の情報や特色などを知ることにより、スーパーなどで魚を手にとって魚料理に挑戦しやすくなる
   
3. 健康志向の人々
   - 魚の栄養価や健康効果に関する情報を提供することで、健康的な食生活を目指すニーズに答えられる

## 機能仕様

### サービスの利用イメージ
1. ユーザーは縦スクロール形式で表示されたカレンダーとそのタイミングで旬の魚を一目で確認できます
2. カレンダーは約一週間分を表示し、スクロールで前後の期間を閲覧できます
3. 期間を移動すると、その時期に旬な魚のイラストと名前がモーダルに表示されます
4. 魚のイラストをクリックすると、その魚の詳細ページにアクセスできます
5. 詳細ページでは、魚の特色や産地、栄養価、美味しい食べ方などの情報を得ることができます
6. YouTubeの料理動画なども表示され、実際の調理方法や食べ方も視覚的に学ぶことができます

### ユーザーへの提供価値
1. 魚の旬について、簡単に習得できる
2. 旬を理解することで、スーパーや飲食店で魚を手にする機会が増える
3. 健康的な食生活を送るための選択肢を増やすことができる
4. 日本の食文化への理解を深められる

### 差別化ポイント
1. 縦スクロール形式のカレンダー表示
   - 他の旬の魚情報サイトの多くが静的なリストや月別表示なのに対し、本サービスでは動的なスクロール形式で表示
   - ユーザーは日々の生活の中で自然と旬の魚を意識できる

2. ワンページ設計
   - 基本的な機能を1ページに集約することで、ユーザーの利便性を向上
   - 情報へのアクセスが容易になり、継続的な利用を促進

3. 複数メディアの活用
   - テキスト情報だけでなく、イラストやYouTube動画などを活用し、視覚的な情報提供
   - 特定の年齢層に限定されない親しみやすいコンテンツを提供

## 技術仕様

### システムアーキテクチャ
フロントエンドとバックエンドを分離したマイクロサービスアーキテクチャで実装

### バックエンド（Ruby on Rails API）

```ruby
# Ruby/Railsのバージョン
ruby "3.3.4"
gem "rails", "~> 7.0.8", ">= 7.0.8.4"

# 基本的なgems
gem "pg", "~> 1.1"
gem "puma", "~> 5.0"
gem "rack-cors"
gem "bootsnap"
gem 'jsonapi-serializer', '~> 2.0'

# 認証関連のgems
gem 'devise'
gem 'devise-jwt', '~> 0.11.0'
gem 'omniauth'
gem 'omniauth-google-oauth2'

# AWS関連
gem 'aws-sdk-s3', require: false
gem 'aws-sdk-ses'
```

### フロントエンド（React/Vite）

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2",
    "tailwindcss": "^3.3.5",
    "@mui/material": "^5.15.0",
    "@mui/icons-material": "^5.15.0",
    "lucide-react": "^0.263.1"
  }
}
```

### 開発・デプロイ環境

```javascript
// vite.config.js
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5173,
    cors: true,
  },
  define: {
    'import.meta.env.VITE_GOOGLE_CLIENT_ID': `"${process.env.VITE_GOOGLE_CLIENT_ID}"`,
    'import.meta.env.VITE_API_URL': `"${process.env.VITE_API_URL}"`,
    'import.meta.env.VITE_FRONT_URL': `"${process.env.VITE_FRONT_URL}"`,
    'import.meta.env.VITE_YOUTUBE_API_KEY': `"${process.env.VITE_YOUTUBE_API_KEY}"`
  }
}));
```
