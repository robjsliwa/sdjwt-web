/* tslint:disable */
/* eslint-disable */
/**
 * @param {string} header
 * @param {string} key
 * @param {string} payload
 * @returns {string}
 */
export function wasm_encode(header: string, key: string, payload: string): string;
export class SdJwtHolder {
  free(): void;
  constructor();
  /**
   * @param {string} encoded_issuer_jwt
   * @param {string} public_key
   * @param {string} algorithm
   * @returns {any}
   */
  verify(encoded_issuer_jwt: string, public_key: string, algorithm: string): any;
  /**
   * @param {string} encoded_issuer_jwt
   * @param {(string)[]} redacted_paths
   * @returns {string}
   */
  presentation(encoded_issuer_jwt: string, redacted_paths: (string)[]): string;
}
export class SdJwtIssuer {
  free(): void;
  constructor();
  /**
   * @param {string} claims
   * @param {string} signing_key
   * @param {string} algorithm
   * @returns {string}
   */
  encode(claims: string, signing_key: string, algorithm: string): string;
}
export class SdJwtVerifier {
  free(): void;
  constructor();
  /**
   * @param {string} holder_presentation_sdjwt
   * @param {string} public_key
   * @param {string} algorithm
   * @returns {any}
   */
  verify(holder_presentation_sdjwt: string, public_key: string, algorithm: string): any;
}
