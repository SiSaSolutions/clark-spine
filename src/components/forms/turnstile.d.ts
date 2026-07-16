/** Minimal typings for the Cloudflare Turnstile browser API. */
export interface TurnstileRenderOptions {
  sitekey: string;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  "timeout-callback"?: () => void;
  theme?: "light" | "dark" | "auto";
  language?: string;
  action?: string;
  size?: "normal" | "flexible" | "compact";
}

export interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export {};
