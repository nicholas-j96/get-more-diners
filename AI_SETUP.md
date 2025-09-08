# AI Campaign Assistant Setup

## Google Gemini API Setup

To enable the AI Campaign Assistant feature, you'll need to set up a Google Gemini API key:

### 1. Get Your API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure the Backend
Add your API key to the backend environment file:

```bash
# In backend/.env
GEMINI_API_KEY=your_api_key_here
```

### 3. Free Tier Limits
- **Free Tier**: 15 requests per minute, 1 million tokens per day
- **Perfect for**: Portfolio projects and small-scale testing
- **No credit card required** for the free tier

### 4. Demo Mode
If no API key is provided, the system will use mock data for demonstration purposes.

## Features

The AI Campaign Assistant can:
- Generate compelling campaign names
- Create engaging email subject lines  
- Write professional email body text
- Adapt content based on campaign type (discounts, events, promotions)

## Usage

1. Click the "AI Assist" button on the campaign creation form
2. Describe your campaign in natural language
3. Include key details like discounts, timing, and target audience
4. Click "Generate Campaign" to auto-fill the form fields
5. Edit the generated content as needed
6. Save your campaign

## Example Input
```
"Happy Hour special with 20% off all drinks and appetizers from 4-6 PM weekdays. Perfect for after-work gatherings and date nights."
```

## Example Output
- **Campaign Name**: "Happy Hour Special"
- **Email Subject**: "🍻 Happy Hour Starts Now!"
- **Email Text**: Professional, engaging content with call-to-action
