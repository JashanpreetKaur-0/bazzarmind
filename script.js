// BazaarMind - The Silent Middleman AI Logic
class BazaarMind {
    constructor() {
        this.currentProduct = '';
        this.currentContext = {
            location: 'rural',
            urgency: 'normal',
            vendorLanguage: 'local',
            buyerLanguage: 'english'
        };
        this.conversationHistory = [];
        this.fairnessScore = 50; // 0-100 scale
        this.priceRange = { min: 0, max: 0 };
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Initialize with default meter position
        this.updateFairnessMeter(50);
    }

    // Core AI Functions
    processVendorMessage() {
        const product = document.getElementById('vendor-product').value;
        const message = document.getElementById('vendor-message').value;
        const location = document.getElementById('vendor-location').value;
        const urgency = document.getElementById('urgency').value;

        if (!product || !message) {
            alert('Please fill in both product details and your message');
            return;
        }

        this.currentProduct = product;
        this.currentContext.location = location;
        this.currentContext.urgency = urgency;

        // Generate fair price range based on context
        this.generatePriceRange(product, location, urgency);
        
        // Process vendor intent and tone
        const processedMessage = this.processIntent(message, 'vendor');
        
        // Update cultural negotiation style
        this.updateNegotiationStyle(location);
        
        // Add to conversation
        this.addToConversation('vendor', message, processedMessage);
        
        // Update fairness meter
        this.updateFairnessMeter(70); // Vendor initiated fairly
        
        // Clear vendor input
        document.getElementById('vendor-message').value = '';
    }

    processBuyerMessage() {
        const message = document.getElementById('buyer-message').value;
        const language = document.getElementById('buyer-language').value;

        if (!message) {
            alert('Please enter your response');
            return;
        }

        if (!this.currentProduct) {
            alert('Vendor must send a message first');
            return;
        }

        this.currentContext.buyerLanguage = language;

        // Process buyer intent and detect exploitation attempts
        const processedMessage = this.processIntent(message, 'buyer');
        
        // Analyze fairness of the negotiation
        const fairnessAnalysis = this.analyzeFairness(message);
        this.updateFairnessMeter(fairnessAnalysis.score);
        
        // Add to conversation
        this.addToConversation('buyer', message, processedMessage);
        
        // Clear buyer input
        document.getElementById('buyer-message').value = '';
    }

    // Intent Processing - Core BazaarMind Feature
    processIntent(message, sender) {
        const lowerMessage = message.toLowerCase();
        
        // Detect aggressive or exploitative language
        const aggressivePatterns = [
            'too expensive', 'way too much', 'ridiculous price', 'rip off', 'scam',
            'final offer', 'take it or leave it', 'last chance'
        ];
        
        const respectfulPatterns = [
            'please', 'thank you', 'appreciate', 'understand', 'fair', 'reasonable'
        ];

        let processedMessage = message;
        let tone = 'neutral';

        // Check for aggressive language
        if (aggressivePatterns.some(pattern => lowerMessage.includes(pattern))) {
            tone = 'aggressive';
            processedMessage = this.neutralizeAggressiveLanguage(message, sender);
        }
        
        // Check for respectful language
        if (respectfulPatterns.some(pattern => lowerMessage.includes(pattern))) {
            tone = 'respectful';
        }

        // Add cultural context and respect
        processedMessage = this.addCulturalContext(processedMessage, sender, tone);

        return processedMessage;
    }

    neutralizeAggressiveLanguage(message, sender) {
        const aggressiveReplacements = {
            'too expensive': 'I was hoping for a different price range',
            'way too much': 'this seems above my budget',
            'ridiculous price': 'I was expecting something more affordable',
            'rip off': 'I\'m looking for better value',
            'scam': 'I need to understand the pricing better',
            'final offer': 'this is what I can afford',
            'take it or leave it': 'I hope we can find a solution',
            'last chance': 'I\'m hoping we can work something out'
        };

        let neutralized = message.toLowerCase();
        
        Object.keys(aggressiveReplacements).forEach(aggressive => {
            neutralized = neutralized.replace(aggressive, aggressiveReplacements[aggressive]);
        });

        return this.capitalizeFirst(neutralized);
    }

    addCulturalContext(message, sender, tone) {
        const culturalPrefixes = {
            rural: {
                vendor: "With respect, ",
                buyer: "I appreciate your time, "
            },
            'semi-urban': {
                vendor: "Thank you for your interest, ",
                buyer: "I understand your position, "
            },
            urban: {
                vendor: "I value this opportunity, ",
                buyer: "I respect your business, "
            }
        };

        const location = this.currentContext.location;
        const prefix = culturalPrefixes[location] && culturalPrefixes[location][sender] 
            ? culturalPrefixes[location][sender] 
            : "";

        return prefix + message;
    }

    // Price Discovery Engine
    generatePriceRange(product, location, urgency) {
        // Simulated price calculation based on context
        const basePrice = this.estimateBasePrice(product);
        
        // Location multipliers
        const locationMultipliers = {
            rural: 0.8,
            'semi-urban': 1.0,
            urban: 1.3
        };

        // Urgency adjustments
        const urgencyAdjustments = {
            normal: 1.0,
            urgent: 0.85, // Vendor needs quick sale
            festival: 1.2, // Higher demand
            bulk: 0.9 // Volume discount
        };

        const locationMultiplier = locationMultipliers[location] || 1.0;
        const urgencyMultiplier = urgencyAdjustments[urgency] || 1.0;

        const adjustedPrice = basePrice * locationMultiplier * urgencyMultiplier;
        
        this.priceRange = {
            min: Math.round(adjustedPrice * 0.85),
            max: Math.round(adjustedPrice * 1.15)
        };

        // Update UI
        document.getElementById('suggested-range').textContent = 
            `$${this.priceRange.min} - $${this.priceRange.max}`;
        
        // Generate explanation
        const explanation = this.generatePriceExplanation(location, urgency);
        document.getElementById('price-explanation').textContent = explanation;
    }

    estimateBasePrice(product) {
        // Simulated price estimation based on product keywords
        const productLower = product.toLowerCase();
        
        if (productLower.includes('tomato') || productLower.includes('vegetable')) return 15;
        if (productLower.includes('fruit') || productLower.includes('apple')) return 20;
        if (productLower.includes('rice') || productLower.includes('grain')) return 25;
        if (productLower.includes('cloth') || productLower.includes('fabric')) return 40;
        if (productLower.includes('craft') || productLower.includes('handmade')) return 60;
        if (productLower.includes('spice') || productLower.includes('herb')) return 30;
        
        return 25; // Default price
    }

    generatePriceExplanation(location, urgency) {
        const explanations = {
            rural: "Rural area pricing considers local economic conditions and transportation costs.",
            'semi-urban': "Semi-urban pricing balances accessibility with local market rates.",
            urban: "Urban pricing reflects higher demand and operational costs."
        };

        const urgencyExplanations = {
            normal: "Standard market conditions apply.",
            urgent: "Quick sale pricing offers value to both parties.",
            festival: "Festival season pricing reflects increased demand.",
            bulk: "Bulk purchase pricing provides volume savings."
        };

        return `${explanations[location]} ${urgencyExplanations[urgency]}`;
    }

    // Fairness Analysis
    analyzeFairness(message) {
        const lowerMessage = message.toLowerCase();
        let score = 50; // Start neutral

        // Positive fairness indicators
        if (lowerMessage.includes('fair') || lowerMessage.includes('reasonable')) score += 20;
        if (lowerMessage.includes('understand') || lowerMessage.includes('appreciate')) score += 15;
        if (lowerMessage.includes('thank') || lowerMessage.includes('please')) score += 10;

        // Negative fairness indicators
        if (lowerMessage.includes('cheap') || lowerMessage.includes('lowest')) score -= 15;
        if (lowerMessage.includes('final') || lowerMessage.includes('last')) score -= 20;
        if (lowerMessage.includes('ridiculous') || lowerMessage.includes('expensive')) score -= 25;

        // Price-based analysis
        const numbers = message.match(/\d+/g);
        if (numbers) {
            const offeredPrice = parseInt(numbers[0]);
            if (offeredPrice < this.priceRange.min * 0.7) score -= 30; // Very low offer
            if (offeredPrice > this.priceRange.max * 1.3) score += 20; // Generous offer
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            analysis: this.getFairnessAnalysis(score)
        };
    }

    getFairnessAnalysis(score) {
        if (score >= 80) return "Very fair negotiation - both parties benefit";
        if (score >= 60) return "Fair negotiation - reasonable for both sides";
        if (score >= 40) return "Neutral negotiation - room for improvement";
        if (score >= 20) return "Unfair elements detected - guidance provided";
        return "Potentially exploitative - intervention needed";
    }

    // UI Updates
    updateFairnessMeter(score) {
        this.fairnessScore = score;
        const meter = document.getElementById('fairness-meter');
        meter.style.width = `${score}%`;
        
        // Color coding
        if (score >= 70) {
            meter.style.background = '#27ae60'; // Green
        } else if (score >= 40) {
            meter.style.background = '#f39c12'; // Orange
        } else {
            meter.style.background = '#e74c3c'; // Red
        }
    }

    updateNegotiationStyle(location) {
        const styles = {
            rural: "Relationship-first approach: Building trust and long-term connections is prioritized.",
            'semi-urban': "Balanced negotiation: Direct but respectful communication style.",
            urban: "Efficient negotiation: Clear, time-conscious, and professional approach."
        };

        document.getElementById('negotiation-style').textContent = styles[location];
    }

    addToConversation(sender, original, processed) {
        const log = document.getElementById('conversation-log');
        
        // Original message
        const originalDiv = document.createElement('div');
        originalDiv.className = `${sender}-message`;
        originalDiv.innerHTML = `<strong>${sender.charAt(0).toUpperCase() + sender.slice(1)} (Original):</strong> ${original}`;
        
        // AI processed message
        const processedDiv = document.createElement('div');
        processedDiv.className = 'ai-mediated';
        processedDiv.innerHTML = `<strong>🤖 BazaarMind Translation:</strong> ${processed}`;
        
        log.appendChild(originalDiv);
        log.appendChild(processedDiv);
        
        // Scroll to bottom
        log.scrollTop = log.scrollHeight;
    }

    // Utility functions
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize BazaarMind when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.bazaarMind = new BazaarMind();
});

// Global functions for HTML onclick events
function processVendorMessage() {
    window.bazaarMind.processVendorMessage();
}

function processBuyerMessage() {
    window.bazaarMind.processBuyerMessage();
}

// Demo functionality - populate with sample data
function loadDemo() {
    document.getElementById('vendor-product').value = "Fresh tomatoes, 5kg";
    document.getElementById('vendor-message').value = "These are the best tomatoes in the market! Very fresh, picked this morning. I need to sell quickly.";
    document.getElementById('vendor-location').value = "rural";
    document.getElementById('urgency').value = "urgent";
}

// Add demo button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add a demo button to the header
    const header = document.querySelector('.header');
    const demoButton = document.createElement('button');
    demoButton.textContent = '🎯 Load Demo';
    demoButton.style.cssText = `
        margin-top: 15px;
        padding: 10px 20px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
    `;
    demoButton.onclick = loadDemo;
    header.appendChild(demoButton);
});