import pandas as pd
import logging
from typing import List, Tuple, Dict
import torch
from torch import nn
from torch.utils.data import DataLoader, Dataset
from transformers import (
    DistilBertTokenizer,
    DistilBertForSequenceClassification,
    AdamW
)
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from tqdm import tqdm

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ICD10Dataset(Dataset):
    def __init__(self, descriptions: List[str], labels: List[int], tokenizer, max_len: int = 128):
        self.descriptions = descriptions
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self) -> int:
        return len(self.descriptions)

    def __getitem__(self, idx: int) -> Dict[str, torch.Tensor]:
        encoding = self.tokenizer(
            self.descriptions[idx],
            truncation=True,
            padding='max_length',
            max_length=self.max_len,
            return_tensors='pt'
        )
        return {
            'input_ids': encoding['input_ids'].squeeze(0),
            'attention_mask': encoding['attention_mask'].squeeze(0),
            'label': torch.tensor(self.labels[idx], dtype=torch.long)
        }

def train_icd10_model(csv_path: str) -> Tuple[DistilBertForSequenceClassification, DistilBertTokenizer, LabelEncoder]:
    df = pd.read_csv(csv_path).dropna(subset=['Description', 'ICDCode'])

    label_encoder = LabelEncoder()
    df['label'] = label_encoder.fit_transform(df['ICDCode'])

    train_texts, val_texts, train_labels, val_labels = train_test_split(
        df['Description'].tolist(), df['label'].tolist(), test_size=0.2, random_state=42
    )

    tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
    model = DistilBertForSequenceClassification.from_pretrained(
        'distilbert-base-uncased', num_labels=len(label_encoder.classes_)
    )

    train_dataset = ICD10Dataset(train_texts, train_labels, tokenizer)

    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    optimizer = AdamW(model.parameters(), lr=2e-5)
    criterion = nn.CrossEntropyLoss()

    model.train()
    for epoch in range(3):
        print(f"[INFO] Starting epoch {epoch + 1}/{3}")
        total_loss = 0.0
        for batch in tqdm(train_loader, desc=f"Epoch {epoch+1}"):
            optimizer.zero_grad()
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['label'].to(device)

            outputs = model(input_ids=input_ids, attention_mask=attention_mask)
            loss = criterion(outputs.logits, labels)
            loss.backward()
            optimizer.step()

            total_loss += loss.item()
        logger.info(f"Epoch {epoch+1} - Loss: {total_loss/len(train_loader):.4f}")

    model.eval()
    return model, tokenizer, label_encoder