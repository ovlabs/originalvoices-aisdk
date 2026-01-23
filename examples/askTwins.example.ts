/**
 * Example: Using the askTwins tool with Vercel AI SDK
 *
 * This example demonstrates how to use the askTwins tool to gather
 * audience insights using OriginalVoices Digital Twins.
 *
 * Prerequisites:
 * 1. Set ORIGINAL_VOICES_API_KEY environment variable
 * 2. Install @ai-sdk/openai and set OPENAI_API_KEY for AI provider example
 *
 * Run with: npx tsx examples/askTwins.example.ts
 */

import { type ModelMessage } from 'ai';
import { askTwins } from '../src/index.js';

async function directExecutionExample() {
  console.log('=== Example 1: Direct Tool Execution ===\n');
  console.log('This calls the tool directly without an AI model.\n');

  if (!askTwins.execute) {
    throw new Error('Tool execute function is not defined');
  }

  const result = await askTwins.execute(
    {
      audience: 'UK, 18-30, fitness enthusiasts',
      questions: [
        "When purchasing running shoes, what's most important to you?",
        'How often do you replace your running shoes?',
      ],
    },
    {
      toolCallId: 'example-call-id',
      messages: [] as ModelMessage[],
    }
  );

  console.log('Result:');
  console.log(JSON.stringify(result, null, 2));
}

async function aiGenerateTextExample() {
  console.log('\n=== Example 2: Using with generateText ===\n');
  console.log('This lets the AI decide when and how to use the tool.\n');

  // Dynamic import to avoid requiring @ai-sdk/openai as a dependency
  // Users need to: npm install @ai-sdk/openai
  const { generateText } = await import('ai');
  // @ts-expect-error - @ai-sdk/openai is an optional dependency for this example - you can use any other AI SDK provider
  const { openai } = await import('@ai-sdk/openai');

  const result = await generateText({
    model: openai('gpt-4o'),
    tools: { askTwins },
    prompt:
      'I want to understand UK fitness enthusiasts aged 18-30. ' +
      'Ask them about their running shoe preferences and purchasing habits.',
  });

  console.log('AI Response:', result.text);
  console.log('\nTool Calls:', JSON.stringify(result.toolCalls, null, 2));
  console.log('\nTool Results:', JSON.stringify(result.toolResults, null, 2));
}

async function main() {
  console.log('OriginalVoices AI SDK - askTwins Tool Examples\n');
  console.log('='.repeat(50) + '\n');

  // Check for required environment variables
  if (!process.env.ORIGINAL_VOICES_API_KEY) {
    console.error('Error: ORIGINAL_VOICES_API_KEY environment variable is not set.');
    console.error('Please set it before running this example.\n');
    process.exit(1);
  }

  // Run Example 1: Direct execution
  try {
    await directExecutionExample();
  } catch (error) {
    console.error('Example 1 failed:', error);
  }

  // Run Example 2: With AI (requires OPENAI_API_KEY and @ai-sdk/openai)
  if (process.env.OPENAI_API_KEY) {
    try {
      await aiGenerateTextExample();
    } catch (error) {
      console.error('Example 2 failed:', error);
    }
  } else {
    console.log('\n=== Example 2: Skipped ===');
    console.log('To run the AI-powered example:');
    console.log('  1. npm install @ai-sdk/openai');
    console.log('  2. Set OPENAI_API_KEY environment variable\n');
  }

  console.log('\n' + '='.repeat(50));
  console.log('Examples completed!');
}

main().catch(console.error);
