import { tool } from 'ai';
import { z } from 'zod';
import OriginalVoices from 'originalvoices';

/**
 * Input schema for the askTwins tool.
 * Defines the structure of inputs that LLMs will provide when calling this tool.
 */
export const askTwinsInputSchema = z.object({
  audience: z
    .string()
    .describe(
      'The specific demographic or target group the Twin should address. ' +
        'Examples: "UK, 18-30, fitness enthusiasts", ' +
        '"Healthcare professionals in urban areas", "Parents of children aged 5-12".'
    ),
  questions: z
    .array(z.string())
    .min(1, 'At least one question is required')
    .describe(
      'A list of specific inquiries or prompts for the Twin to process. ' +
        'Each question should be clear and focused to get meaningful insights from the target audience.'
    ),
});

/**
 * Type for the input parameters of askTwins tool.
 */
export type AskTwinsInput = z.infer<typeof askTwinsInputSchema>;

/**
 * Response structure from the askTwins tool.
 * Maps to the OriginalVoices API AskOpenResponse format.
 */
export interface AskTwinsResponse {
  data: {
    answers: Array<
      Array<{
        answer: string;
        confidence: number;
      }>
    >;
  };
  requestId: string;
}

/**
 * askTwins tool for Vercel AI SDK.
 *
 * This tool allows LLMs to trigger "Twin" interactions - AI-powered digital personas
 * that represent specific audience segments. By providing a target audience description
 * and a list of questions, the Twin will respond with insights from that audience's perspective.
 *
 * @example
 * ```typescript
 * import { generateText } from 'ai';
 * import { askTwins } from 'originalvoices-aisdk';
 *
 * const result = await generateText({
 *   model: YOUR_MODEL, // e.g., openai('gpt-4o'), anthropic('claude-3-5-sonnet'), etc.
 *   tools: { askTwins },
 *   prompt: 'I want to understand UK fitness enthusiasts aged 18-30. ' +
 *           'Ask them about their running shoe preferences and purchasing habits.',
 * });
 * ```
 */

export const askTwins = tool({
  description:
    'Trigger an OriginalVoices Twin interaction to gather insights from a specific audience. ' +
    'Twins are AI-powered digital personas representing real audience segments. ' +
    'Use this tool when you need to understand how a particular demographic or target group ' +
    'would respond to specific questions, gather market research insights, or validate assumptions ' +
    'about audience preferences and behaviors.',
  inputSchema: askTwinsInputSchema,
  execute: async ({
    audience,
    questions,
  }: AskTwinsInput): Promise<AskTwinsResponse> => {
    // Validate API key is present
    const apiKey = process.env.ORIGINAL_VOICES_API_KEY;
    if (!apiKey) {
      throw new Error(
        'ORIGINAL_VOICES_API_KEY environment variable is not set. ' +
          'Please set it to use the askTwins tool.'
      );
    }

    // Create client with validated API key
    const client = new OriginalVoices({ apiKey });

    try {
      const response = await client.ask.open({
        audiencePrompt: audience,
        questions,
      });

      // Return the response (matches AskTwinsResponse structure)
      return {
        data: response.data,
        requestId: response.requestId,
      };
    } catch (error) {
      // Handle API errors with meaningful messages
      if (error instanceof Error) {
        throw new Error(`OriginalVoices API error: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while calling OriginalVoices API');
    }
  },
});
