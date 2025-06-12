import React from 'react';
import { render } from '@testing-library/react-native';
import DailySummaryCard from '../../app/components/molecules/DailySummaryCard';

// モック設定
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('DailySummaryCard', () => {
  const mockProps = {
    weight: 10.5,
    mealsCount: 2,
    poopsCount: 1,
    exerciseMinutes: 45,
    date: '2024-01-01'
  };

  it('サマリー情報が正しく表示される', () => {
    const { getByText } = render(
      <DailySummaryCard {...mockProps} />
    );

    expect(getByText('10.5kg')).toBeTruthy();
    expect(getByText('2回')).toBeTruthy();
    expect(getByText('1回')).toBeTruthy();
    expect(getByText('45分')).toBeTruthy();
  });

  it('体重がundefinedの場合は「-」を表示する', () => {
    const propsWithoutWeight = { ...mockProps, weight: undefined };
    const { getByText } = render(
      <DailySummaryCard {...propsWithoutWeight} />
    );

    // 体重の部分に「未計測」が表示されることを確認
    expect(getByText('未計測')).toBeTruthy();
  });

  it('0の値も正しく表示される', () => {
    const emptyProps = {
      weight: undefined,
      mealsCount: 0,
      poopsCount: 0,
      exerciseMinutes: 0,
      date: '2024-01-01'
    };

    const { getAllByText } = render(
      <DailySummaryCard {...emptyProps} />
    );

    // 0回、0分の表示を確認
    expect(getAllByText('0回')).toHaveLength(2); // 食事回数とうんち回数
    expect(getAllByText('0分')).toHaveLength(1); // 運動時間
  });

  it('適切なアイコンが表示される', () => {
    const { UNSAFE_root } = render(
      <DailySummaryCard {...mockProps} />
    );

    // Ioniconsのアイコンが表示されることを確認
    const icons = UNSAFE_root.findAllByType('Ionicons' as any);
    expect(icons.length).toBeGreaterThan(0);
  });
});