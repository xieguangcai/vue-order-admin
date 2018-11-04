import Cookies from 'js-cookie';

const TokenKey = 'Admin-Token';
const TokenType = 'Admin-Token-Type';

export function getToken() {
  const tokenKey = Cookies.get(TokenKey);
  return tokenKey;
}
export function getFullToken(){
  const tokenKey =   Cookies.get(TokenKey);
  if(tokenKey === undefined){
    return tokenKey;
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

export function getTokenType(){
  return Cookies.get(TokenType);
}
