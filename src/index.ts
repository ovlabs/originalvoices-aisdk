/**
 * OriginalVoices AI SDK Tools
 *
 * This package provides Vercel AI SDK tools for interacting with
 * OriginalVoices' network of Digital Twins for real-time audience research.
 *
 * @packageDocumentation
 */

// Export the askTwins tool and its types
export {
  askTwins,
  askTwinsInputSchema,
  type AskTwinsInput,
  type AskTwinsResponse,
} from './tools/askTwins.js';
