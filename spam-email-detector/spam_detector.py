import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score
import os

# Load dataset
def run_detector():
    csv_path = "spam.csv"
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found.")
        return

    # User's logic
    data = pd.read_csv(csv_path, sep="\t", names=["label", "message"])

    # Convert labels to numbers
    data["label"] = data["label"].map({"ham": 0, "spam": 1})

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        data["message"], data["label"], test_size=0.2, random_state=42
    )

    # Convert text to numbers
    vectorizer = CountVectorizer()
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # Train model
    model = MultinomialNB()
    model.fit(X_train_vec, y_train)

    # Predict
    predictions = model.predict(X_test_vec)

    # Accuracy
    print("Model Accuracy:", accuracy_score(y_test, predictions))

    # Test with your own message
    test_msg = ["Congratulations! You won a free prize"]
    test_vec = vectorizer.transform(test_msg)
    print("Spam Prediction (1=Spam, 0=Ham):", model.predict(test_vec)[0])

if __name__ == "__main__":
    run_detector()
