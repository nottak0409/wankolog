// Petインターフェースの拡張
export interface PetProfile {
  id: string;
  name: string;
  gender: "male" | "female";
  birthday: Date;
  breed: string;
  weight?: number;
  registrationNumber?: string;
  microchipNumber?: string;
  photo?: string;
  notes?: string; // アレルギーなどの特記事項
}

// プロフィール編集フォームの型
export interface PetProfileFormData {
  name: string;
  gender: "male" | "female";
  birthday: Date;
  breed: string;
  weight?: string;
  registrationNumber?: string;
  microchipNumber?: string;
  notes?: string;
}

// バリデーション用の型
export interface PetProfileValidation {
  name: boolean;
  gender: boolean;
  birthday: boolean;
  breed: boolean;
}

// 画像選択オプションの型
export type ImagePickerOption = "camera" | "library";

// 画像選択の結果の型
export interface ImagePickerResult {
  uri: string;
  type?: string;
  fileName?: string;
}

// プロフィール更新の結果の型
export interface ProfileUpdateResult {
  success: boolean;
  message?: string;
  error?: string;
}

// プロフィール編集状態の型
export interface ProfileEditState {
  isEditing: boolean;
  isDirty: boolean;
  isValid: boolean;
  errors: {
    [key: string]: string;
  };
}

// 犬種選択用のデータ型
export interface BreedOption {
  id: string;
  name: string;
  group?: string; // 犬種グループ（例：スポーツ犬、作業犬など）
}

// 犬種データのモック
export const MOCK_BREED_OPTIONS: BreedOption[] = [
  // 日本で人気の犬種 Top 10
  { id: "1", name: "トイプードル", group: "トイドッグ" },
  { id: "2", name: "ミックス", group: "その他" },
  { id: "3", name: "チワワ", group: "トイドッグ" },
  { id: "4", name: "柴犬", group: "日本犬" },
  { id: "5", name: "ポメラニアン", group: "トイドッグ" },
  { id: "6", name: "ミニチュアダックスフンド", group: "ハウンド" },
  { id: "7", name: "ヨークシャーテリア", group: "テリア" },
  { id: "8", name: "フレンチブルドッグ", group: "ノンスポーティング" },
  { id: "9", name: "マルチーズ", group: "トイドッグ" },
  { id: "10", name: "シーズー", group: "トイドッグ" },

  // 日本犬（日本原産）
  { id: "11", name: "秋田犬", group: "日本犬" },
  { id: "12", name: "北海道犬", group: "日本犬" },
  { id: "13", name: "甲斐犬", group: "日本犬" },
  { id: "14", name: "紀州犬", group: "日本犬" },
  { id: "15", name: "四国犬", group: "日本犬" },
  { id: "16", name: "日本スピッツ", group: "日本犬" },
  { id: "17", name: "狆", group: "日本犬" },
  { id: "18", name: "日本テリア", group: "日本犬" },
  { id: "19", name: "土佐犬", group: "日本犬" },
  { id: "20", name: "豆柴", group: "日本犬" },

  // レトリーバー・ガンドッグ
  { id: "21", name: "ラブラドール・レトリーバー", group: "スポーティング" },
  { id: "22", name: "ゴールデン・レトリーバー", group: "スポーティング" },
  { id: "23", name: "ジャーマン・ショートヘアード・ポインター", group: "スポーティング" },
  { id: "24", name: "コッカー・スパニエル", group: "スポーティング" },
  { id: "25", name: "イングリッシュ・スプリンガー・スパニエル", group: "スポーティング" },
  { id: "26", name: "ブリタニー", group: "スポーティング" },
  { id: "27", name: "ワイマラナー", group: "スポーティング" },
  { id: "28", name: "ビズラ", group: "スポーティング" },

  // 牧羊犬・ハーディング
  { id: "29", name: "ジャーマン・シェパード・ドッグ", group: "ハーディング" },
  { id: "30", name: "ボーダー・コリー", group: "ハーディング" },
  { id: "31", name: "オーストラリアン・シェパード", group: "ハーディング" },
  { id: "32", name: "オーストラリアン・キャトル・ドッグ", group: "ハーディング" },
  { id: "33", name: "ベルジアン・マリノア", group: "ハーディング" },

  // ワーキング・作業犬
  { id: "34", name: "シベリアン・ハスキー", group: "ワーキング" },
  { id: "35", name: "ロットワイラー", group: "ワーキング" },
  { id: "36", name: "ドーベルマン・ピンシャー", group: "ワーキング" },
  { id: "37", name: "ボクサー", group: "ワーキング" },
  { id: "38", name: "グレート・デーン", group: "ワーキング" },
  { id: "39", name: "セント・バーナード", group: "ワーキング" },
  { id: "40", name: "バーニーズ・マウンテン・ドッグ", group: "ワーキング" },
  { id: "41", name: "ニューファンドランド", group: "ワーキング" },
  { id: "42", name: "アラスカン・マラミュート", group: "ワーキング" },
  { id: "43", name: "サモエド", group: "ワーキング" },
  { id: "44", name: "マスティフ", group: "ワーキング" },

  // プードル系
  { id: "45", name: "ミニチュアプードル", group: "ノンスポーティング" },
  { id: "46", name: "スタンダードプードル", group: "ノンスポーティング" },

  // ハウンド・狩猟犬
  { id: "47", name: "ビーグル", group: "ハウンド" },
  { id: "48", name: "バセット・ハウンド", group: "ハウンド" },
  { id: "49", name: "ブラッドハウンド", group: "ハウンド" },
  { id: "50", name: "グレーハウンド", group: "ハウンド" },
  { id: "51", name: "ウィペット", group: "ハウンド" },
  { id: "52", name: "アフガン・ハウンド", group: "ハウンド" },
  { id: "53", name: "アイリッシュ・ウルフハウンド", group: "ハウンド" },
  { id: "54", name: "ローデシアン・リッジバック", group: "ハウンド" },
  { id: "55", name: "バセンジー", group: "ハウンド" },

  // テリア
  { id: "56", name: "ジャック・ラッセル・テリア", group: "テリア" },
  { id: "57", name: "ブル・テリア", group: "テリア" },
  { id: "58", name: "ボストン・テリア", group: "テリア" },
  { id: "59", name: "スコティッシュ・テリア", group: "テリア" },
  { id: "60", name: "ウェスト・ハイランド・ホワイト・テリア", group: "テリア" },
  { id: "61", name: "エアデール・テリア", group: "テリア" },
  { id: "62", name: "フォックス・テリア", group: "テリア" },
  { id: "63", name: "アイリッシュ・テリア", group: "テリア" },

  // トイドッグ・小型犬
  { id: "64", name: "パピヨン", group: "トイドッグ" },
  { id: "65", name: "パグ", group: "トイドッグ" },
  { id: "66", name: "キャバリア・キング・チャールズ・スパニエル", group: "トイドッグ" },
  { id: "67", name: "イタリアン・グレーハウンド", group: "トイドッグ" },
  { id: "68", name: "ハバニーズ", group: "トイドッグ" },
  { id: "69", name: "チャイニーズ・クレステッド", group: "トイドッグ" },

  // ノンスポーティング・コンパニオン
  { id: "70", name: "ブルドッグ", group: "ノンスポーティング" },
  { id: "71", name: "ビション・フリーゼ", group: "ノンスポーティング" },
  { id: "72", name: "ミニチュア・シュナウザー", group: "ノンスポーティング" },
  { id: "73", name: "チャウチャウ", group: "ノンスポーティング" },
  { id: "74", name: "ダルメシアン", group: "ノンスポーティング" },
  { id: "75", name: "アメリカン・エスキモー・ドッグ", group: "ノンスポーティング" },

  // スピッツ系
  { id: "76", name: "キースホンド", group: "スピッツ" },
  { id: "77", name: "フィニッシュ・スピッツ", group: "スピッツ" },
  { id: "78", name: "ノルウェージャン・エルクハウンド", group: "スピッツ" },

  // その他人気品種
  { id: "79", name: "ボルゾイ", group: "ハウンド" },
  { id: "80", name: "サルーキ", group: "ハウンド" },
  { id: "81", name: "ファラオ・ハウンド", group: "ハウンド" },
  { id: "82", name: "ポルトガル・ウォーター・ドッグ", group: "ワーキング" },
  { id: "83", name: "グレート・ピレニーズ", group: "ワーキング" },
  { id: "84", name: "アメリカン・スタッフォードシャー・テリア", group: "テリア" },
  { id: "85", name: "カネ・コルソ", group: "ワーキング" },

  // 稀少・新興犬種
  { id: "86", name: "ショロイツクイントリ", group: "ノンスポーティング" },
  { id: "87", name: "ブラッコ・イタリアーノ", group: "スポーティング" },
  { id: "88", name: "ジャーマン・ピンシャー", group: "ワーキング" },
  { id: "89", name: "ランカシャー・ヒーラー", group: "ハーディング" },

  // その他・不明
  { id: "90", name: "その他", group: "その他" },
];
