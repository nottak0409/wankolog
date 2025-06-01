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
  { id: "1", name: "柴犬", group: "日本犬" },
  { id: "2", name: "豆柴", group: "日本犬" },
  { id: "3", name: "秋田犬", group: "日本犬" },
  { id: "4", name: "トイプードル", group: "プードル" },
  { id: "5", name: "ミニチュアプードル", group: "プードル" },
  { id: "6", name: "スタンダードプードル", group: "プードル" },
  { id: "7", name: "チワワ", group: "トイドッグ" },
  { id: "8", name: "ポメラニアン", group: "トイドッグ" },
  { id: "9", name: "ミックス", group: "その他" },
];
