import zipfile
import requests
import xml.etree.ElementTree as ET
import pandas as pd
from io import BytesIO
from pymongo import MongoClient
import os
import traceback
from transformers import pipeline
import re
from transformers import AutoTokenizer, BertForSequenceClassification
import torch
import torch.nn.functional as F
import sys

dupixent_zip_url = "https://dailymed.nlm.nih.gov/dailymed/getFile.cfm?setid=595f437d-2729-40bb-9c62-c8ece1f82780&type=zip"
drug_name = "Dupixent"
mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")

DUPIXENT_ICD10_MAP = {
    "atopic dermatitis": "L20.9",
    "chronic spontaneous urticaria": "L50.1",
    "asthma": "J45.909",
    "eosinophilic esophagitis": "K20.0",
    "chronic rhinosinusitis with nasal polyps": "J33.9",
    "prurigo nodularis": "L28.1",
    "chronic obstructive pulmonary disease": "J44.9",
}

def get_mongo_client():
    client = MongoClient(mongo_uri)
    return client

def download_and_extract_xml(zip_url):
    response = requests.get(zip_url)
    with zipfile.ZipFile(BytesIO(response.content)) as z:
        for file_name in z.namelist():
            if file_name.endswith(".xml"):
                with z.open(file_name) as xml_file:
                    return xml_file.read()
    raise ValueError("XML NOT FOUND")

def parse_indications_from_xml(xml_data):
    root = ET.fromstring(xml_data)
    ns = {'hl7': 'urn:hl7-org:v3'}
    indications_section = None
    for section in root.findall(".//hl7:section", ns):
        code = section.find("hl7:code", ns)
        if code is not None and code.get("displayName") is not None:
            if re.search(r'INDICATIONS.*USAGE|USAGE.*INDICATIONS', code.get("displayName"), re.IGNORECASE):
                indications_section = section
                break
    
    if indications_section is None:
        return []
    
    subsections = indications_section.findall(".//hl7:component/hl7:section", ns)
    indications = []
    
    for subsection in subsections:
        title_element = subsection.find("hl7:title", ns)
        if title_element is None or not title_element.text:
            continue
            
        title = title_element.text
        title = re.sub(r'^\d+(\.\d+)*\s*', '', title).strip()
        text_element = subsection.find("hl7:text/hl7:paragraph", ns)
        if text_element is None:
            continue
            
        description = ''.join(text_element.itertext()).strip()
        indications.append(f"{title}: {description}")
    
    return indications

def validate_icd10(code: str) -> bool:
    return bool(re.match(r"^[A-Z][0-9]{2}\.?[0-9]{0,2}$", code))

def get_icd10_with_ai(indication):
    tokenizer = AutoTokenizer.from_pretrained("AkshatSurolia/ICD-10-Code-Prediction")
    model = BertForSequenceClassification.from_pretrained("AkshatSurolia/ICD-10-Code-Prediction")
    model.eval()
    inputs = tokenizer(indication, return_tensors="pt", truncation=True, padding=True, max_length=512)

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probabilities = F.softmax(logits, dim=-1)
        predicted_index = torch.argmax(probabilities, dim=-1).item()

    labels = model.config.id2label

    return labels[predicted_index]

def get_icd10_manual(condition_text) -> str:
    text_lower = condition_text.lower()
    for term, code in DUPIXENT_ICD10_MAP.items():
        if term in text_lower:
            return code
    return None

def get_icd10(text) -> str:
    manual_code = get_icd10_manual(text)
    if manual_code:
        return manual_code
    
    ai_code = get_icd10_with_ai(text)
    return ai_code if validate_icd10(ai_code) else None
    
def save_mappings_to_mongo(collection, mapped_results):
    if mapped_results:
        collection.insert_many(mapped_results)
        print(f"{len(mapped_results)} mappings saved to MongoDB.")
    else:
        print("No valid mappings to save.")

def pipeline(collection):
    try:
        if collection.estimated_document_count() > 0:
            print("Collection 'drug_indications' already contains data. Pipeline aborted.")
            return []
        
        print("Downloading XML from DailyMed...")
        xml_data = download_and_extract_xml(dupixent_zip_url)

        print("Extracting Indications and Usage...")
        indications = parse_indications_from_xml(xml_data)

        print(f"Indications:{indications}")

        results = []
        for indication in indications:
            icd10 = get_icd10(indication)
            results.append({"drug_name": drug_name.lower(), "indication": indication, "icd10_code": icd10})

        return results
    except Exception as e:
        print("Ocorreu um erro:")
        print(f"Tipo da exceção: {type(e).__name__}")
        print(f"Mensagem da exceção: {str(e)}")
        print("Detalhes do erro:")
        traceback.print_exc()

def main():
    client = get_mongo_client()
    db = client[os.getenv("MONGODB_NAME")]
    collection = db["drug_indications"]
    mapped_results = pipeline(collection)
    save_mappings_to_mongo(collection, mapped_results)
    print("Done!")

if __name__ == "__main__":
    main()