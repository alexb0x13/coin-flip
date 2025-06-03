// Minimal ambient module declarations for the Frame utilities
// exposed by @coinbase/onchainkit but lacking TypeScript types.

declare module "@coinbase/onchainkit/frame" {
  export interface FrameRequest {
    [key: string]: unknown;
  }

  export function getFrameMessage(
    body: FrameRequest,
    opts?: {
      neynarApiKey?: string;
      castReactionContext?: boolean;
      followContext?: boolean;
    },
  ): Promise<{ isValid: boolean; message: any }>;

  export function getFrameHtmlResponse(data: Record<string, unknown>): string;
  export function getFrameMetadata(data: Record<string, unknown>): any;
}
