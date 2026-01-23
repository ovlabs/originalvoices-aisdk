# originalvoices-aisdk

[![npm version](https://img.shields.io/npm/v/originalvoices-aisdk.svg)](https://www.npmjs.com/package/originalvoices-aisdk)

Vercel AI SDK tool that provides access to OriginalVoices' network of Digital Twins for real-time audience research.

## Installation

```bash
npm install originalvoices-aisdk
```

**Peer Dependencies:** This package requires `ai` (^6.0.0) and `zod` (^4.0.0) as peer dependencies. If you're using the Vercel AI SDK, you likely already have these installed.

## Setup

1. Get your API key from [OriginalVoices](https://platform.originalvoices.ai)

2. Set your API key as an environment variable:

```bash
export ORIGINAL_VOICES_API_KEY=your_api_key_here
```

Or add it to your `.env` file:

```env
ORIGINAL_VOICES_API_KEY=your_api_key_here
```

## Usage

### With Vercel AI SDK

```typescript
import { generateText } from 'ai';
import { askTwins } from 'originalvoices-aisdk';

const result = await generateText({
  model: YOUR_MODEL, // e.g., openai('gpt-4o'), anthropic('claude-3-5-sonnet'), etc.
  tools: { askTwins },
  prompt: 'I want to understand UK fitness enthusiasts aged 18-30. ' +
          'Ask them about their running shoe preferences and purchasing habits.',
});

console.log(result.text);
```

### Direct Tool Usage

```typescript
import { askTwins } from 'originalvoices-aisdk';

// Note: Direct execution requires ToolExecutionOptions
if (askTwins.execute) {
  const result = await askTwins.execute(
    {
      audience: 'UK, 18-30, fitness enthusiasts',
      questions: [
        "When purchasing running shoes, what's most important to you?",
        "How often do you replace your running shoes?"
      ],
    },
    {
      toolCallId: 'my-tool-call-id',
      messages: [],
    }
  );
  console.log(result);
}
```

## Tool: askTwins

Trigger an OriginalVoices Twin interaction to gather insights from a specific audience. Twins are AI-powered digital personas representing real audience segments.

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `audience` | `string` | Yes | The specific demographic or target group the Twin should address |
| `questions` | `string[]` | Yes | A list of specific inquiries or prompts for the Twin to process |

### Response

```typescript
{
  data: {
    answers: Array<Array<{
      answer: string;
      confidence: number;
    }>>;
  };
  requestId: string;
}
```

## Examples

See the [examples](./examples) directory for more usage examples.

```bash
# Run the example (requires ORIGINAL_VOICES_API_KEY to be set)
npx tsx examples/askTwins.example.ts
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev
```

## Links

- [OriginalVoices](https://platform.originalvoices.ai) - Get your API key
- [Vercel AI SDK](https://ai-sdk.dev) - AI SDK documentation
- [GitHub Repository](https://github.com/ovlabs/originalvoices-aisdk)

## License

MIT © [OriginalVoices](https://originalvoices.ai)
