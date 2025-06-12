// Date utility functions for testing
describe('Date Utilities', () => {
  describe('日付計算', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('今日の日付を正しく取得する', () => {
      const mockDate = new Date('2024-01-15T10:30:00Z');
      jest.setSystemTime(mockDate);
      
      const today = new Date().toISOString().split('T')[0];
      expect(today).toBe('2024-01-15');
    });

    it('日数の差を正しく計算する', () => {
      const today = new Date('2024-01-15');
      const futureDate = new Date('2024-01-22');
      
      const daysDiff = Math.ceil((futureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      expect(daysDiff).toBe(7);
    });

    it('過去の日付との差を正しく計算する', () => {
      const today = new Date('2024-01-15');
      const pastDate = new Date('2024-01-10');
      
      const daysDiff = Math.ceil((pastDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      expect(daysDiff).toBe(-5);
    });

    it('時間帯の判定が正しく動作する', () => {
      // 朝の時間帯 (6-11時)
      expect(isMorning(9)).toBe(true);
      expect(isMorning(5)).toBe(false);
      expect(isMorning(12)).toBe(false);
      
      // 昼の時間帯 (12-17時)
      expect(isAfternoon(15)).toBe(true);
      expect(isAfternoon(11)).toBe(false);
      expect(isAfternoon(18)).toBe(false);
      
      // 夜の時間帯 (18-22時)
      expect(isEvening(20)).toBe(true);
      expect(isEvening(17)).toBe(false);
      expect(isEvening(23)).toBe(false);
      
      // 深夜・早朝 (23-5時)
      expect(isLateNight(2)).toBe(true);
      expect(isLateNight(6)).toBe(false);
      expect(isLateNight(22)).toBe(false);
    });
  });
});

// Helper functions for time of day checks
function isMorning(hour: number): boolean {
  return hour >= 6 && hour <= 11;
}

function isAfternoon(hour: number): boolean {
  return hour >= 12 && hour <= 17;
}

function isEvening(hour: number): boolean {
  return hour >= 18 && hour <= 22;
}

function isLateNight(hour: number): boolean {
  return hour >= 23 || hour <= 5;
}