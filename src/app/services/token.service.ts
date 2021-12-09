import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  public encryptToken(): any {
    const wordArray = CryptoJS.enc.Utf8.parse(localStorage.getItem("token"));
    const encryptedToken = CryptoJS.enc.Base64.stringify(wordArray);
    return encryptedToken;
  } 

  public decryptToken(encryptedToken: string): any {
    const parsedWordArray = CryptoJS.enc.Base64.parse(encryptedToken);
    const decryptedToken = parsedWordArray.toString(CryptoJS.enc.Utf8);
    return decryptedToken;
}
  
}
