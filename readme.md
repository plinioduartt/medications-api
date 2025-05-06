# Explanations: 
ICD-10 Code Mapping with AI Fallback
This project maps clinical drug indications to ICD-10 codes, using a hybrid approach that prioritizes manual mappings and leverages AI as a fallback for ambiguous or unmapped cases.

### Strategy to data extractor
1. Manual Mapping First
High-confidence mappings are hardcoded to ensure precision and consistency.

This allows for fast, predictable responses and avoids reliance on uncertain AI predictions.

2. AI Fallback
When no manual match is found, an AI model is used to suggest a possible ICD-10 code.

This covers edge cases or new terms not handled manually.

### Model Used
The fallback AI model used is:
AkshatSurolia/ICD-10-Code-Prediction

### Why this model?
It was publicly available and easy to integrate during the prototype phase.

Despite some accuracy issues (e.g., returning incorrect or overly generic codes), it served as a practical baseline.

### Possible improvements for the data extractor pipeline
- Replace the current AI model with a better-trained or paid alternative for more accurate predictions.

- Fine-tune a custom model with domain-specific data to improve reliability.

- Add confidence thresholds or explanations to AI-based suggestions.

- Pre-train and publish the model to reduce inference time during production.

- Serve entrypoint for the pipeline as an API and open it for other drugs.

# How to run the project locally
To start the application locally using Docker, run the following command:

`docker-compose up --build`

### What this does:
Builds the service images defined in the docker-compose.yml file (if not already built).

Starts all required services (e.g., application server, database).

Exposes the necessary ports so the application can be accessed via browser or API tools.

Note: On the first run, it may take a bit longer as Docker needs to pull all the base images (like MongoDB, Node.js, etc.).

### Services:
First service to be executed is the data extractor pipeline in Python.

After pipeline is done, docker start the API and serves it in port 3001. 

- Swagger Documentations available in http://localhost:3001/api-docs.

- MongoDB Express (for easier data visualization) available in http://localhost:8081/ with user: admin, password: pass.

# REST API in NodeJS
The API was designed with a focus on a clean, robust, and modular architecture while keeping it lightweight and maintainable. Its layers are decoupled to promote separation of concerns and flexibility. The project applies dependency inversion and injection to reinforce the decoupling between business logic, framework, and data access layers.

Simplicity is a key principle in this architecture. When additional abstractions are unnecessary, they are avoided to prevent overengineering, which can lead to distributed complexity rather than true decoupling.

That said, a potential improvement would be to further evolve the separation of concerns, especially by moving domain-specific validations and business rules into dedicated layers within the Drugs domain, rather than handling them in controllers.

The project includes test coverage using Jest and Testcontainers. Core features implemented include authentication, role-based access control (RBAC), middlewares, caching, and rate limiting.

Given more development time, the project could be improved by adding test coverage for middlewares, expanding validation layers, and refining business logic structures.
Additionally, the integration of libraries and configurations to enforce code consistency, such as ESLint for code style, and Husky along with lint-staged for commit consistency, would further enhance the project's maintainability.

### Default ADMIN User
Once the application is running, you can log in using the default admin credentials:

Email: admin@admin.com

Password: admin

It's highly recommended to change this credentials when deploying, especially in production environments.

# TODOs:

[X] pipeline
- [x] Scrape data from DailyMed XML
- [x] Map indications to ICD-10 codes manually
- [x] Map fallback indications to ICD-10 with AI/LLM model
- [x] Save mappings to NoSQL database (MongoDB)

[x] API
- [x] Create server
- [x] Configure swagger
- [x] Install Jest for TDD
- [x] Make mappings queryable via an API
- [x] Auth (Register and login)
- [x] Auth Middlewares
- [x] CRUD Create, read, update, and delete drug-indication mappings
- [x] GET /programs/:programId queryable via an API
- [x] Refactor to decouple layers
- [x] Implement cache strategy
- [x] Implement ratelimit strategy

[ ] Frontend
- [ ] Login
- [ ] Create new user
- [ ] CRUD drug-indication

# No time remaining to do the frontend
No suficient time remaining to do frontend, but here is some projects that I worked as designer and fullstack develope:
- https://www.jupli.com.br/
- https://mybloggen.com.br/
- https://expressoduarte.com.br/

# Sources
ICD-10 Dataset: 
- https://www.kaggle.com/datasets/mrhell/icd10cm-codeset-2023?resource=download

ICD-10 trained model:
- https://huggingface.co/AkshatSurolia/ICD-10-Code-Prediction

# How would you lead an engineering team to implement and maintain this project?

I believe it's essential to have at least one specialist dedicated to data-related responsibilities, someone focused on data modeling, extraction, preprocessing, and model training. Additionally, having a DevOps engineer is crucial to ensure optimal environments and CI/CD pipelines for the team. Beyond these roles, I’m confident that experienced backend developers can efficiently manage the remaining tasks typically involved in building and maintaining REST APIs.