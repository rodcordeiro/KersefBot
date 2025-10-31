declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      /** Bot Token */
      readonly TOKEN: string;
      readonly DEV_TOKEN: string; // Dev env
      /** Application or client ID */
      readonly APP_ID: string;
      readonly DEV_APP_ID: string; // Dev env

      /** Guild */
      /**  Kersef ID */
      readonly KERSEF_ID: string;
    }
  }
}

export {};
