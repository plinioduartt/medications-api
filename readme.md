ICD-10 Dataset: 
- https://www.kaggle.com/datasets/mrhell/icd10cm-codeset-2023?resource=download


ICD-10 trained model:
- https://huggingface.co/AkshatSurolia/ICD-10-Code-Prediction


# Possíveis caminhos: 
- treinar modelo e publicar modelo treinado para otimizar o tempo de execução
- usar o modelo que retorna o ID errado (https://huggingface.co/AkshatSurolia/ICD-10-Code-Prediction), explicar o motivo do porque usei este modelo e explicar que possíveis melhorias seriam substituí-lo por um modelo melhor treinado ou uma IA paga.
- explicar que usei uma abordagem de mapear manualmente primeiro para garantir boa consistência e depois usar um fallback com IA para mappings que falharem ou que tiverem ambiguidade.


# TODOs:

[X] pipeline
- [x] Scrape data from DailyMed XML
- [x] Map indications to ICD-10 codes manually
- [x] Map fallback indications to ICD-10 with AI/LLM model
- [x] Save mappings to NoSQL database (MongoDB)

[ ] API
- [x] Create server
- [x] Configure swagger
- [x] Make mappings queryable via an API
- [x] TDD
- [ ] Auth (Register and login)
- [ ] CRUD Create, read, update, and delete drug-indication mappings
- [ ] GET /programs/:programId queryable via an API

[ ] Frontend
- [ ] Login
- [ ] Create new user
- [ ] CRUD drug-indication