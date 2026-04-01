import pandas as pd
import random
from pathlib import Path

TOTAL_RECORDS = 1200
SEED = 42

# positive review
positive_reviews = [
    "Great futsal court with excellent facilities",
    "Loved the turf and lighting setup",
    "Very clean and well maintained ground",
    "Amazing experience, will come again",
    "Friendly staff and smooth booking process",
    "One of the best futsal courts in the area",
    "Really enjoyed playing here with friends",
    "The surface quality was very good",
    "Booking system was fast and easy",
    "Everything was well organized and managed",
    "Nice environment and good vibes overall",
    "The ground condition was perfect for playing",
    "Very professional staff and management",
    "Affordable price with great quality",
    "Spacious court and proper lighting setup",
    "Had a great time playing here",
    "Highly recommended for futsal lovers",
    "Very comfortable and enjoyable experience",
    "Good maintenance and clean surroundings",
    "Worth the money and time",
    "The best place to play futsal in town",
    "Excellent facilities and great atmosphere",
    "The staff was very helpful and friendly",
    "The turf was in excellent condition and very safe",
    "The lighting was perfect for night games and well-distributed",
    "The booking process was seamless and efficient, making it easy to reserve a court",
    "The overall management of the facility was top-notch, ensuring a smooth and enjoyable experience for all players",
    "The environment was welcoming and created a great atmosphere for playing futsal, making it a favorite spot for many players",
    "The price was reasonable for the quality of the facilities and the overall experience provided, making it a great value for money",
    "The court was spacious and well-maintained, providing ample room for players to enjoy their game without feeling cramped or overcrowded",
    ""
]

negative_reviews = [
    "Court was dirty and poorly maintained",
    "Very bad experience overall",
    "Staff was rude and unhelpful",
    "Lighting was not good",
    "Overpriced for such poor quality",
    "The turf was damaged and unsafe",
    "Very disappointing experience",
    "Booking system was confusing",
    "Too crowded and not managed properly",
    "Ground condition was not good",
    "Facilities were not clean at all",
    "Waste of money and time",
    "Very poor management system",
    "Not worth the price",
    "Bad experience with staff behavior",
    "The court was not ready on time",
    "Too much delay in booking confirmation",
    "Unhygienic changing rooms",
    "Poor lighting and ventilation",
    "Would not recommend this place",
    "Terrible experience, will never come back",
    "The worst futsal court I've ever been to",
    "Not satisfied with the overall experience",
    "The ground was slippery and dangerous",
    "Staff was not responsive to issues",
    "Facilities were outdated and not maintained",
    "Had a very bad time playing here",
    "The environment was not welcoming at all",
    "Very unprofessional management and staff",
    "The price was too high for the quality offered",
    "The court was overcrowded and chaotic",
    "Had to wait for a long time to get the court ready",
    "The turf was uneven and caused injuries",
    "The lighting was dim and insufficient",
    "The staff was not helpful when we had issues",
]

# Context sentences
contexts = [
    "we played in the evening",
    "during weekend booking",
    "while playing with friends",
    "during our match time",
    "at night session",
    "on a rainy day",
    "during peak hours",
    "while trying out the new turf",
    "during our regular game",
    "while testing the lighting",

]

# Noise / real-world text
noisy_reviews = [
    "good court but price high",
    "ok futsal not bad",
    "nice but little expensive",
    "bad lighting but ground ok",
    "staff good but turf bad",
    "average nothing wow",
    "too costly yrr",
    "not satisfied",
    "worth it",
    "meh experience",
    "could be better",
    "loved it",
    "horrible",
    "will come again",
    "never again",
    "good",
    "bad",
    "ok",
    "not bad",
    "not good",
    "worst",
    "nice"
]

intros = [
    "Honestly", "Overall", "Personally", "From my experience",
    "To be honest", "In my opinion", "Frankly speaking",
    "Based on my visit", "As a regular player",
    "From what I saw", "Well", "Actually", ""
]

def generate_review(rng, sentiment):
    # 20% chance of noisy short review
    if rng.random() < 0.2:
        return rng.choice(noisy_reviews)

    intro = rng.choice(intros)
    context = rng.choice(contexts)

    if sentiment == "Positive":
        base = rng.choice(positive_reviews)

        # 20% mixed sentiment
        if rng.random() < 0.2:
            mix = rng.choice(negative_reviews)
            return f"{intro} {base} but {mix.lower()} {context}"

    elif sentiment == "Negative":
        base = rng.choice(negative_reviews)

        # 20% mixed sentiment
        if rng.random() < 0.2:
            mix = rng.choice(positive_reviews)
            return f"{intro} {base} but {mix.lower()} {context}"

    return f"{intro} {base} {context}".strip().replace("  ", " ")


def assign_rating(rng, sentiment):
    if sentiment == "Positive":
        return rng.choice([3,4, 5])
    elif sentiment == "Negative":
        return rng.choice([1, 2,3])


def generate_dataset(total_records=TOTAL_RECORDS, seed=SEED):
    rng = random.Random(seed)

    labels = (
        ["Positive"] * (total_records // 2) +
        ["Negative"] * (total_records // 2)
    )

    rng.shuffle(labels)

    data = []

    for i, sentiment in enumerate(labels, start=1):
        review = generate_review(rng, sentiment)
        rating = assign_rating(rng, sentiment)

        data.append({
            "id": i,
            "user_id": rng.randint(1, 500),
            "rating": rating,
            "review": review,
            "sentiment_label": sentiment
        })

    df = pd.DataFrame(data)

    return df


def save_dataset(df):
    output_dir = Path(__file__).resolve().parent / "raw"
    output_dir.mkdir(parents=True, exist_ok=True)
    file_path = output_dir / "futsal_reviews_dataset.csv"

    df.to_csv(file_path, index=False)
    return file_path


if __name__ == "__main__":
    df = generate_dataset()
    path = save_dataset(df)

    print("Dataset Generated Successfully")
    print(f"Saved at: {path}")
    print(f"Total Records: {len(df)}")
    print(df['sentiment_label'].value_counts())
    print("\nSample Data:\n", df.head(10))