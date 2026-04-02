# “Since no public dataset was available for futsal-specific reviews, a synthetic dataset was generated and enhanced with noise, variability, and class balancing to simulate real-world conditions.”

## Step-by-step pipeline
1. Generate / Load Dataset
2. Preprocess Text Data
3. Split Data (Train/Test)
4. Feature Extraction (TF-IDF)
5. Train Model
6. Evaluate Model
7. Save Model + Vectorizer

# correct workflow
``` Dataset → Preprocessing → Train/Test Split
        → TF-IDF → Train Model
        → Evaluate → Save Model + Vectorizer
```