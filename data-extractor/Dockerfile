FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    curl \
    unzip \
    git \
    gnupg \
    ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY /requirements.txt ./data-extractor/requirements.txt
RUN pip install --no-cache-dir -r ./data-extractor/requirements.txt

COPY . .

ENTRYPOINT ["python", "/app/data-extractor/pipeline.py"]