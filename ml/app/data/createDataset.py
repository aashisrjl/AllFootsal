import pandas as pd
import random
from pathlib import Path

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
TOTAL_RECORDS = 1000
SEED = 42

positive_contexts = [
    "Booked for an evening game and everything was ready on time.",
    "Played with friends on the weekend and everyone enjoyed it.",
    "Warm-up area and changing rooms were clean and organized.",
    "Online booking confirmation was quick and accurate.",
    "Staff guided us well before and after the match.",
]

negative_contexts = [
    "Booked in advance but had to wait too long.",
    "We faced issues during check-in and support was slow.",
    "Changing rooms and wash areas were not properly cleaned.",
    "The playing surface felt unsafe for fast movements.",
    "Our session timing was not managed properly.",
]

intensifiers = ["Honestly", "Overall", "In my opinion", "From our experience", "Personally"]


def build_review(rng: random.Random, sentiment: str) -> str:
    if sentiment == "Positive":
        base = rng.choice(positive_reviews)
        context = rng.choice(positive_contexts)
    else:
        base = rng.choice(negative_reviews)
        context = rng.choice(negative_contexts)

    intro = rng.choice(intensifiers)
    return f"{intro}, {base} {context}"


def generate_dataset(total_records: int = TOTAL_RECORDS, seed: int = SEED) -> pd.DataFrame:
    rng = random.Random(seed)

    positive_count = total_records // 2
    negative_count = total_records - positive_count
    labels = ["Positive"] * positive_count + ["Negative"] * negative_count
    rng.shuffle(labels)

    data = []
    for i, sentiment in enumerate(labels, start=1):
        if sentiment == "Positive":
            rating = rng.randint(4, 5)
        else:
            rating = rng.randint(1, 2)

        data.append(
            {
                "id": i,
                "user_id": f"U{rng.randint(1, 300):04d}",
                "rating": rating,
                "review": build_review(rng, sentiment),
                "sentiment_label": sentiment,
            }
        )

    df = pd.DataFrame(data)

    if df["review"].isna().any() or df["sentiment_label"].isna().any():
        raise ValueError("Generated dataset contains null values.")

    return df


def save_dataset(df: pd.DataFrame) -> Path:
    output_dir = Path(__file__).resolve().parent / "dataset"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / "futsal_reviews_dataset.csv"
    df.to_csv(output_file, index=False)
    return output_file


if __name__ == "__main__":
    dataset = generate_dataset()
    output_path = save_dataset(dataset)

    print("Dataset generated successfully!")
    print(f"Saved to: {output_path}")
    print(f"Total Records : {len(dataset)}")
    print(f"Positive Reviews: {len(dataset[dataset['sentiment_label'] == 'Positive'])}")
    print(f"Negative Reviews: {len(dataset[dataset['sentiment_label'] == 'Negative'])}")
    print(f"Unique Review Texts: {dataset['review'].nunique()}")
    print("\nSample Records:")
    print(dataset.head(10).to_string())