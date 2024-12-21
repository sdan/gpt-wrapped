import json
from collections import Counter, defaultdict
import re

# Adjust these as needed
TOP_N_TOPICS = 3
KEYWORDS_TO_CATEGORIES = {
    'technology': ['tech', 'AI', 'machine learning', 'software', 'programming', 'coding', 'data science', 'internet', 'cybersecurity', 'digital', 'innovation', 'startup', 'algorithm'],
    'travel': ['travel', 'hotel', 'flight', 'vacation', 'tour', 'explore', 'adventure', 'destination', 'journey', 'trip', 'tourism', 'wanderlust', 'backpacking'],
    'relationships': ['relationship', 'dating', 'friend', 'love', 'family', 'marriage', 'friendship', 'partner', 'connection', 'social', 'communication'],
    'food': ['food', 'recipe', 'cuisine', 'restaurant', 'cooking', 'meal', 'dish', 'ingredient', 'dining', 'nutrition', 'diet', 'taste', 'culinary'],
    'finance': ['stock', 'crypto', 'money', 'loan', 'finance', 'investment', 'banking', 'budget', 'economy', 'market', 'trading', 'wealth', 'credit'],
    'health': ['health', 'doctor', 'exercise', 'diet', 'mental health', 'wellness', 'fitness', 'workout', 'medicine', 'healthcare', 'wellbeing', 'nutrition'],
    'art': ['art', 'painting', 'drawing', 'music', 'literature', 'poetry', 'dance', 'film', 'movie', 'sculpture', 'photography', 'design', 'creative', 'gallery'],
    'science': ['science', 'research', 'experiment', 'physics', 'chemistry', 'biology', 'astronomy', 'space', 'scientist', 'laboratory', 'discovery', 'nature'],
    'sports': ['sports', 'football', 'basketball', 'soccer', 'baseball', 'tennis', 'golf', 'hockey', 'swimming', 'athlete', 'game', 'competition', 'team', 'sport'],
    'education': ['education', 'learning', 'school', 'university', 'college', 'student', 'teacher', 'study', 'knowledge', 'course', 'curriculum', 'academic', 'scholarship'],
    'business': ['business', 'company', 'entrepreneur', 'marketing', 'sales', 'management', 'leadership', 'strategy', 'product', 'service', 'industry', 'commerce'],
    'gaming': ['gaming', 'video game', 'console', 'PC gaming', 'esports', 'gamer', 'online gaming', 'virtual reality', 'game development', 'game design', 'multiplayer', 'RPG'],
    'fashion': ['fashion', 'style', 'clothing', 'apparel', 'trend', 'design', 'model', 'brand', 'outfit', 'accessory', 'fashion show', 'designer', 'luxury'],
    'environment': ['environment', 'climate change', 'sustainability', 'renewable energy', 'conservation', 'ecology', 'nature', 'pollution', 'green', 'eco-friendly', 'recycling'],
    'entertainment': ['entertainment', 'movie', 'music', 'TV show', 'celebrity', 'actor', 'actress', 'film', 'cinema', 'concert', 'festival', 'performance', 'theater'],
    'history': ['history', 'historical', 'past', 'ancient', 'civilization', 'culture', 'event', 'era', 'timeline', 'artifact', 'archaeology', 'museum', 'heritage'],
    'politics': ['politics', 'government', 'policy', 'election', 'vote', 'democracy', 'republic', 'political', 'legislation', 'law', 'president', 'congress', 'parliament'],
    'philosophy': ['philosophy', 'ethics', 'morality', 'thought', 'idea', 'concept', 'wisdom', 'logic', 'reason', 'existence', 'mind', 'consciousness', 'truth'],
    'psychology': ['psychology', 'behavior', 'mind', 'emotion', 'therapy', 'counseling', 'mental health', 'cognitive', 'personality', 'psychological', 'brain', 'perception'],
    'self-improvement': ['self-improvement', 'motivation', 'inspiration', 'productivity', 'goal', 'habit', 'success', 'personal development', 'mindset', 'growth', 'self-help', 'discipline']
}

def classify_message_type(content):
    content_stripped = content.strip().lower()
    
    # Question patterns
    if content_stripped.endswith('?') or content_stripped.startswith(('what', 'why', 'how', 'when', 'where', 'who', 'which')):
        return 'question'
        
    # Request/command patterns  
    request_indicators = [
        'could', 'can', 'would', 'will', 'please',
        'help', 'need', 'want', 'tell', 'show',
        'give', 'explain', 'describe', 'list',
        'find', 'get', 'make', 'do'
    ]
    
    if any(content_stripped.startswith(word) for word in request_indicators):
        return 'request'
        
    # Default to sharing info
    return 'sharing_info'

def identify_topics(content):
    content_lower = content.lower()
    matched = []
    for cat, kws in KEYWORDS_TO_CATEGORIES.items():
        if any(kw in content_lower for kw in kws):
            matched.append(cat)
    return matched

# Load JSON
with open('conversations.json', 'r') as file:
    data = json.load(file)

# Extract user messages
user_messages = []
for conversation in data:
    for node in conversation['mapping'].values():
        msg = node.get('message')
        if msg is None:
            continue  # skip if no message present

        author = msg.get('author', {}).get('role')
        if author == 'user':
            # Extract content
            parts = msg.get('content', {}).get('parts')
            content = ""
            if parts:
                content_pieces = []
                for part in parts:
                    if isinstance(part, str):
                        content_pieces.append(part)
                    elif isinstance(part, dict):
                        # If there's an image pointer or so, just note it
                        if part.get('content_type') == 'image_asset_pointer':
                            content_pieces.append("[IMAGE]")
                        else:
                            content_pieces.append(str(part))
                content = ' '.join(content_pieces)
            else:
                content = str(msg.get('content', {}))
            user_messages.append(content)

if not user_messages:
    print("No user messages found.")
    exit()

# Identify topics for each message
topic_counts = Counter()
message_type_counts = Counter()
topics_per_message = []
for m in user_messages:
    t = classify_message_type(m)
    message_type_counts[t] += 1
    matched_topics = identify_topics(m)
    for mt in matched_topics:
        topic_counts[mt] += 1
    topics_per_message.append((m, matched_topics))

# Top N topics
top_topics = [tt[0] for tt in topic_counts.most_common(TOP_N_TOPICS)]

# Pick #1 topic
if top_topics:
    main_topic = top_topics[0]
else:
    main_topic = None

# For the #1 topic, gather messages related to it
main_topic_messages = [m for m, mts in topics_per_message if main_topic in mts]

# Fun fact about how you discussed the main topic:
fun_fact_count = sum(1 for m in main_topic_messages if classify_message_type(m) == 'question')
fun_fact = f"You asked {fun_fact_count} questions about {main_topic}."

# Build structured output
results = {
    "top_3_topics": top_topics,
    "message_type_breakdown": dict(message_type_counts),
    "main_topic_details": {
        "topic": main_topic,
        "total_messages": len(main_topic_messages),
        "fun_fact": fun_fact
    }
}

# Also keep the dataset minimal: just a few messages from main topic to show GPT
sample_main_topic_messages = main_topic_messages[:3]
results["sample_messages_main_topic"] = sample_main_topic_messages

print(json.dumps(results, indent=2))