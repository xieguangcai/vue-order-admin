import Cookies from 'js-cookie';
import {UserModule} from '@/store/modules/user';

const TokenKey = 'Admin-Token';
const TokenType = 'Admin-Token-Type';

export function getToken() {
  const tokenKey = Cookies.get(TokenKey);
  return tokenKey;
}
export function getFullToken(): string {
  const tokenKey =   Cookies.get(TokenKey);
  if (tokenKey === undefined) {
    return '';
  }
  const tokenType = Cookies.get(TokenType) || '';
  return tokenType + tokenKey;
}
export function setToken(token: string, tokenType: string) {
  Cookies.set(TokenType, tokenType);
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  Cookies.remove(TokenType);
  return Cookies.remove(TokenKey);
}

export function getTokenType() {
  return Cookies.get(TokenType);
}

/**
 * 检查用户是否拥有某个角色
 * @param role
 */
export function checkRole(role: string) {
  return UserModule.roles.some((i, num) => {
    if (i === role || i === 'ROLE_ADMIN') {
      return true;
    }
    return false;
  });
}
