export type TokenType = 'tree' | 'house' | 'water' | 'mountain' | 'field' | 'brown';

export interface Token {
  id: string;
  type: TokenType;
  color: string;
}

export const canPlaceToken = (newToken: Token, existingTokens: Token[]): boolean => {
  if (existingTokens.length >= 3) {
    return false;
  }

  if (existingTokens.length === 0) {
    return true;
  }

  const topToken = existingTokens[existingTokens.length - 1];

  switch (newToken.type) {
    case 'mountain':
      return topToken.type === 'mountain' && existingTokens.length < 3;

    case 'tree': {
      const brownCount = existingTokens.filter(t => t.type === 'brown').length;
      return brownCount === existingTokens.length && existingTokens.length <= 2;
    }

    case 'field':
      return existingTokens.length === 0;

    case 'water':
      return existingTokens.length === 0;

    case 'house':
      return ['brown', 'mountain', 'house'].includes(topToken.type) && existingTokens.length < 3;

    case 'brown':
      return !['mountain', 'house', 'water', 'field', 'tree'].includes(topToken.type) && existingTokens.length < 3;

    default:
      return false;
  }
};
