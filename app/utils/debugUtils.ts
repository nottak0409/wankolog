/**
 * デバッグユーティリティ
 * 開発環境でのみログを出力し、本番環境では何も出力しない
 */

export const debugLog = {
  /**
   * 通常のログ（開発環境のみ）
   */
  log: (...args: any[]) => {
    if (__DEV__) {
      console.log(...args);
    }
  },

  /**
   * 警告ログ（開発環境のみ）
   */
  warn: (...args: any[]) => {
    if (__DEV__) {
      console.warn(...args);
    }
  },

  /**
   * エラーログ（本番環境でも出力）
   */
  error: (...args: any[]) => {
    console.error(...args);
  },

  /**
   * 情報ログ（開発環境のみ）
   */
  info: (...args: any[]) => {
    if (__DEV__) {
      console.info(...args);
    }
  },

  /**
   * デバッグ用のグループログ（開発環境のみ）
   */
  group: (label: string, callback: () => void) => {
    if (__DEV__) {
      console.group(label);
      callback();
      console.groupEnd();
    }
  },

  /**
   * データベース関連のログ（開発環境のみ）
   */
  db: (...args: any[]) => {
    if (__DEV__) {
      console.log('[DB]', ...args);
    }
  },

  /**
   * 日付関連のログ（開発環境のみ）
   */
  date: (...args: any[]) => {
    if (__DEV__) {
      console.log('[DATE]', ...args);
    }
  },

  /**
   * 通知関連のログ（開発環境のみ）
   */
  notification: (...args: any[]) => {
    if (__DEV__) {
      console.log('[NOTIFICATION]', ...args);
    }
  },
};