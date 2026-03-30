import pandas as pd
import random
from datetime import datetime, timedelta

# Extended review sentences
positive_reviews = [
    "The best futsal court I have ever played in Kathmandu!",
    "Excellent facilities and very well maintained courts.",
    "Great lighting and smooth artificial turf, loved it!",
    "Very clean court with friendly and helpful staff.",
    "Smooth booking process and an amazing playing experience.",
    "Best futsal center in Kathmandu, highly recommended!",
    "Affordable pricing with top quality court facilities.",
    "The staff was very cooperative and the court was in perfect condition.",
    "Amazing experience, will definitely book again!",
    "Loved the ambiance and the quality of the court surface.",
    "Very professional management and excellent court maintenance.",
    "Great place to play futsal with friends, highly satisfying.",
    "The court was spacious, clean and well lit. Loved it!",
    "Booking was easy and the experience was fantastic.",
    "Top notch futsal facility with very reasonable pricing.",
    "Wonderful experience, the court was in perfect shape.",
    "Very organized management and excellent playing surface.",
    "Outstanding facilities, the best futsal court in the area.",
    "Loved the overall experience, clean courts and great staff.",
    "Perfect futsal court, smooth surface and great atmosphere.",
    "Highly satisfied with the booking and playing experience.",
    "Great value for money, will come back again for sure.",
    "Fantastic court with excellent facilities and friendly staff.",
    "The court condition was perfect and staff was very helpful.",
    "One of the best futsal experiences I have had in Nepal."
]

negative_reviews = [
    "The court was dirty and very poorly maintained.",
    "Booking process was confusing and staff was rude.",
    "Overpriced for the poor quality of the court offered.",
    "Lights were not working properly during our session.",
    "Very disappointing experience, will not come back.",
    "The artificial turf was torn and in bad condition.",
    "Staff was unhelpful and the court was not clean at all.",
    "Terrible experience, the court surface was very slippery.",
    "Poor management and the court was not ready on time.",
    "Very bad experience, the changing rooms were unclean.",
    "The court was too small and the pricing was too high.",
    "Worst futsal center I have visited, very disappointing.",
    "The booking was confirmed but the court was not available.",
    "Staff was very unprofessional and unhelpful throughout.",
    "Extremely poor maintenance, the goalposts were broken.",
    "Terrible court condition and very poor customer service.",
    "Very noisy environment and the court was not well maintained.",
    "Disappointed with the facilities, not worth the price at all.",
    "The court was flooded and we could not play properly.",
    "Very bad lighting and the surface was dangerously slippery.",
    "Would not recommend this futsal center to anyone.",
    "Poor experience overall, management needs improvement.",
    "The court was double booked and we had to wait for hours.",
    "Very unhygienic changing rooms and poor court condition.",
    "Terrible experience, the staff was rude and unprofessional."
]

futsal_centers = [
    "FC001", "FC002", "FC003", "FC004", "FC005",
    "FC006", "FC007", "FC008", "FC009", "FC010",
    "FC011", "FC012", "FC013", "FC014", "FC015"
]

def random_date(start_year=2024, end_year=2026):
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 3, 28)
    delta = end - start
    random_days = random.randint(0, delta.days)
    random_seconds = random.randint(0, 86400)
    return (start + timedelta(
        days=random_days, 
        seconds=random_seconds
    )).strftime("%Y-%m-%d %H:%M:%S")

# Generate dataset
data = []
for i in range(1, 1001):
    sentiment = random.choice(["Positive", "Negative"])
    
    if sentiment == "Positive":
        review = random.choice(positive_reviews)
        rating = random.randint(4, 5)
        sentiment_score = round(random.uniform(0.65, 1.00), 2)
    else:
        review = random.choice(negative_reviews)
        rating = random.randint(1, 2)
        sentiment_score = round(random.uniform(0.00, 0.40), 2)

    data.append({
        "id": i,
        "user_id": f"U{random.randint(1, 300):04d}",
        "futsal_center_id": random.choice(futsal_centers),
        "rating": rating,
        "review": review,
        "sentiment_score": sentiment_score,
        "sentiment_label": sentiment,
        "created_at": random_date()
    })

df = pd.DataFrame(data)

# Save to CSV
df.to_csv("./dataset/futsal_reviews_dataset.csv", index=False)

# Summary
print("Dataset generated successfully!")
print(f"Total Records : {len(df)}")
print(f"Positive Reviews: {len(df[df['sentiment_label'] == 'Positive'])}")
print(f"Negative Reviews: {len(df[df['sentiment_label'] == 'Negative'])}")
print("\nSample Records:")
print(df.head(10).to_string())