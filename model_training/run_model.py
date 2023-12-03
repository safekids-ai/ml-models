import sys
from transformers import pipeline, AutoTokenizer, TFBertForSequenceClassification

# please provide the output folder in the command line
model = TFBertForSequenceClassification.from_pretrained(sys.argv[1])
tokenizer = AutoTokenizer.from_pretrained("google/bert_uncased_L-2_H-128_A-2", max_length=48, padding='max_length', truncation=True)

pipe = pipeline("text-classification", model=model, tokenizer=tokenizer)

while True:
    print("Enter line:")
    print(pipe(input()))
