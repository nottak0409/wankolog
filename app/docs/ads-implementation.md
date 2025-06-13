# 広告実装ドキュメント

## 概要

わんこログアプリに Google AdMob を使用したフリーミアムモデルの広告機能を実装しました。

## 実装内容

### 1. パッケージのインストール

```bash
npm install react-native-google-mobile-ads
```

### 2. ファイル構成

```
app/
├── config/
│   └── ads.ts                    # AdMob設定とプレミアムチェック
├── components/
│   ├── ads/
│   │   ├── BannerAd.tsx         # バナー広告コンポーネント
│   │   ├── NativeAd.tsx         # ネイティブ広告コンポーネント
│   │   └── index.ts             # エクスポート
│   └── subscription/
│       ├── UpgradePrompt.tsx    # アップグレード促進モーダル
│       └── index.ts             # エクスポート
└── services/
    └── subscriptionService.ts   # サブスクリプション管理
```

### 3. 主要機能

#### 3.1 広告表示ロジック
- **バナー広告**: ホーム画面下部に表示
- **ネイティブ広告**: 履歴画面で5件に1回挿入
- **プレミアムユーザー**: 広告非表示

#### 3.2 設定画面
- プレミアム状態の表示
- 広告表示設定の確認
- 開発用デバッグ機能（プレミアム状態トグル）

#### 3.3 サブスクリプション管理
- 無料ユーザーの制限チェック
- プレミアム機能の制御
- アップグレード促進メッセージ

## 使用方法

### 広告コンポーネントの使用

```tsx
import { BannerAd, NativeAd } from '../components/ads';

// バナー広告
<BannerAd />

// ネイティブ広告
<NativeAd />
```

### プレミアム状態チェック

```tsx
import { subscriptionService } from '../services/subscriptionService';

// プレミアムユーザーかチェック
const isPremium = await subscriptionService.isPremiumUser();

// 広告を表示するかチェック
const shouldShow = await subscriptionService.shouldShowAds();
```

## 設定が必要な項目

### 1. AdMob アカウント設定

1. [Google AdMob](https://admob.google.com) でアカウント作成
2. アプリを登録
3. 広告ユニットIDを取得

### 2. 本番用 Ad Unit ID の設定

`app/config/ads.ts` で実際のIDに置き換え：

```typescript
const PRODUCTION_IDS = {
  BANNER_HOME: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy',
  NATIVE_HISTORY: 'ca-app-pub-xxxxxxxxxxxxx/zzzzzzzzzz',
};
```

### 3. Android の設定

`android/app/src/main/AndroidManifest.xml` に AdMob App ID を追加：

```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-xxxxxxxxxxxxx~yyyyyyyyyy"/>
```

## テスト方法

### 開発環境
- デフォルトでテスト広告が表示されます
- 設定画面でプレミアム状態をトグル可能

### プレミアム機能のテスト
1. 設定画面 > デバッグ機能 > 「プレミアム状態をトグル」をタップ
2. ホーム画面で広告の表示/非表示を確認
3. 履歴画面でネイティブ広告の表示/非表示を確認

## RevenueCat 統合完了 ✅

### Phase 1: RevenueCat + ローカルストレージ実装済み

#### 実装された機能
1. **RevenueCat SDK統合**
   - `react-native-purchases` パッケージ
   - 設定ファイル: `app/config/revenuecat.ts`

2. **サブスクリプション管理**
   - 強化された `subscriptionService.ts`
   - ローカルキャッシュ + RevenueCat同期
   - 24時間ごとの自動同期

3. **プレミアム画面**
   - `/premium-upgrade` 画面追加
   - 料金プラン選択
   - 購入・復元機能

4. **設定画面統合**
   - プレミアム状態表示
   - アップグレードボタン

#### 設定が必要な項目
1. **RevenueCat ダッシュボード**
   - アカウント作成: https://app.revenuecat.com
   - アプリ登録
   - API キー取得

2. **App Store Connect / Google Play Console**
   - アプリ内課金商品作成
   - 商品ID設定

3. **設定ファイル更新**
   ```typescript
   // app/config/revenuecat.ts
   const REVENUECAT_CONFIG = {
     IOS_API_KEY: 'your_ios_api_key',
     ANDROID_API_KEY: 'your_android_api_key',
   };
   ```

## 今後の実装予定

1. **広告カスタマイズ**
   - ペット関連広告のターゲティング
   - 広告配置の最適化

2. **Phase 2: Firebase統合**
   - ユーザー認証
   - クラウドバックアップ

## 注意事項

- 開発中はテスト広告のみ使用
- 本番リリース前に実際の Ad Unit ID に更新
- GDPR 対応として `requestNonPersonalizedAdsOnly: true` を設定済み
- プレミアムユーザーには広告を表示しない