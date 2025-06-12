/**
 * 日本のタイムゾーン（JST）で今日の日付を取得する
 * @returns YYYY-MM-DD形式の文字列
 */
export const getJapanToday = (): string => {
  const now = new Date();
  // 日本時間 (UTC+9) に変換
  const japanTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  return japanTime.toISOString().split('T')[0];
};

/**
 * 日本のタイムゾーンで現在の日時を取得する
 * @returns Date オブジェクト（日本時間）
 */
export const getJapanTime = (): Date => {
  const now = new Date();
  return new Date(now.getTime() + (9 * 60 * 60 * 1000));
};

/**
 * 指定された日付文字列が今日（日本時間）かどうかを判定
 * @param dateString YYYY-MM-DD形式の日付文字列
 * @returns 今日の場合true
 */
export const isToday = (dateString: string): boolean => {
  return dateString === getJapanToday();
};

/**
 * 日本時間での日付を文字列で取得（デバッグ用）
 * @returns 日本時間の詳細情報
 */
export const getJapanDateInfo = () => {
  const now = new Date();
  const japanTime = getJapanTime();
  const japanToday = getJapanToday();
  
  return {
    utc: now.toISOString(),
    japanTime: japanTime.toISOString(),
    japanToday,
    utcToday: now.toISOString().split('T')[0],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    offset: now.getTimezoneOffset()
  };
};