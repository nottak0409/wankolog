import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PetProfileCard from '../../app/components/molecules/PetProfileCard';

// モック設定
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

describe('PetProfileCard', () => {
  const mockProps = {
    name: 'テスト犬',
    imageUrl: 'https://example.com/dog.jpg'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ペットの名前が正しく表示される', () => {
    const { getByText } = render(
      <PetProfileCard {...mockProps} />
    );

    expect(getByText('テスト犬')).toBeTruthy();
  });

  it('名前をタップするとプロフィール画面に遷移する', () => {
    const { getByText } = render(
      <PetProfileCard {...mockProps} />
    );

    const nameText = getByText('テスト犬');
    fireEvent.press(nameText);

    expect(mockPush).toHaveBeenCalledWith('/(tabs)/pet-profile');
  });

  it('画像が正しく設定される', () => {
    const { UNSAFE_root } = render(
      <PetProfileCard {...mockProps} />
    );

    const image = UNSAFE_root.findByType('Image' as any);
    expect(image.props.source).toEqual({ uri: 'https://example.com/dog.jpg' });
  });

  it('空の画像URLでも表示される', () => {
    const propsWithEmptyImage = { ...mockProps, imageUrl: '' };
    const { getByText } = render(
      <PetProfileCard {...propsWithEmptyImage} />
    );

    expect(getByText('テスト犬')).toBeTruthy();
  });
});