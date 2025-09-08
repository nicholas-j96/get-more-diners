const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI (using free tier)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key');

const generateCampaignContent = async (req, res, next) => {
    try {
        const { campaignDescription } = req.body;
        
        if (!campaignDescription || campaignDescription.trim().length === 0) {
            return res.status(400).send({ message: 'Campaign description is required' });
        }

        // For demo purposes, if no API key is set, return mock data
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'demo-key') {
            console.log('🤖 DEMO MODE: Generating mock campaign content');
            
            const mockResponse = {
                campaignName: generateMockCampaignName(campaignDescription),
                emailSubject: generateMockEmailSubject(campaignDescription),
                emailText: generateMockEmailText(campaignDescription)
            };
            
            return res.status(200).send(mockResponse);
        }

        // Get the generative model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `You are a marketing expert specializing in restaurant campaigns. Based on the following campaign description, generate:

1. A compelling campaign name (max 50 characters)
2. An engaging email subject line (max 60 characters)
3. Professional email body text (max 300 words)

Campaign Description: "${campaignDescription}"

Please format your response as JSON with these exact keys:
{
  "campaignName": "Campaign Name Here",
  "emailSubject": "Email Subject Here", 
  "emailText": "Email body text here..."
}

Make the content engaging, professional, and focused on driving customer action. Include any discounts or special offers mentioned in the description.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Try to parse the JSON response
        let campaignContent;
        try {
            campaignContent = JSON.parse(text);
        } catch (parseError) {
            console.error('Failed to parse AI response:', text);
            // Fallback to mock data if parsing fails
            campaignContent = {
                campaignName: generateMockCampaignName(campaignDescription),
                emailSubject: generateMockEmailSubject(campaignDescription),
                emailText: generateMockEmailText(campaignDescription)
            };
        }

        res.status(200).send(campaignContent);

    } catch (error) {
        console.error('AI Campaign Generation Error:', error);
        
        // Fallback to mock data on error
        const mockResponse = {
            campaignName: generateMockCampaignName(req.body.campaignDescription || 'Special Offer'),
            emailSubject: generateMockEmailSubject(req.body.campaignDescription || 'Special Offer'),
            emailText: generateMockEmailText(req.body.campaignDescription || 'Special Offer')
        };
        
        res.status(200).send(mockResponse);
    }
};

// Mock data generators for demo/fallback
function generateMockCampaignName(description) {
    const keywords = description.toLowerCase();
    if (keywords.includes('discount') || keywords.includes('off')) {
        return 'Special Discount Offer';
    } else if (keywords.includes('happy hour')) {
        return 'Happy Hour Special';
    } else if (keywords.includes('weekend')) {
        return 'Weekend Special';
    } else if (keywords.includes('lunch')) {
        return 'Lunch Special';
    } else if (keywords.includes('dinner')) {
        return 'Dinner Promotion';
    } else {
        return 'Limited Time Offer';
    }
}

function generateMockEmailSubject(description) {
    const keywords = description.toLowerCase();
    if (keywords.includes('discount') || keywords.includes('off')) {
        return '🎉 Exclusive Discount Just for You!';
    } else if (keywords.includes('happy hour')) {
        return '🍻 Happy Hour Starts Now!';
    } else if (keywords.includes('weekend')) {
        return '🌟 Weekend Special - Don\'t Miss Out!';
    } else if (keywords.includes('lunch')) {
        return '🍽️ Lunch Special - Limited Time!';
    } else if (keywords.includes('dinner')) {
        return '🍴 Dinner Promotion - Book Now!';
    } else {
        return '✨ Special Offer Inside - Act Fast!';
    }
}

function generateMockEmailText(description) {
    return `Dear Valued Customer,

We're excited to share a special offer with you! ${description}

This is a limited-time opportunity that you won't want to miss. Our team has prepared something special just for our loyal customers like you.

Key highlights:
• Exclusive offer for our email subscribers
• Limited time availability
• Great value and quality you can trust

Don't wait - this offer won't last long! Visit us soon or call to make your reservation.

Thank you for being a valued customer. We look forward to serving you!

Best regards,
The Restaurant Team

P.S. Follow us on social media for more exclusive offers and updates!`;
}

module.exports = {
    generateCampaignContent
};
