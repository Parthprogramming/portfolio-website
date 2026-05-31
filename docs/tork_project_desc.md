### Overview

Tork AI is a multimodal enterprise knowledge platform designed to help organizations efficiently store, search, and retrieve information across multiple data formats, including text, images, audio, and video. Traditional knowledge management systems often struggle with fragmented information spread across documents, media files, and internal resources, making it difficult for teams to access relevant knowledge when needed.

To address this challenge, Tork AI combines Retrieval-Augmented Generation (RAG) with semantic search to provide context-aware information retrieval through a unified interface. The platform leverages PostgreSQL with pgvector for vector-based similarity search and MinIO for scalable object storage, enabling organizations to manage both structured and unstructured data at scale.

Users can upload content from different modalities, generate embeddings, and perform natural language queries to retrieve the most relevant information regardless of the original content format. The system is designed with scalability, security, and extensibility in mind, making it suitable for enterprise environments that require intelligent knowledge discovery and efficient access to organizational information.


### Why It was Built : 

Large volumes of private, domain-specific data are scattered across systems . 
Employees waste significant productive time searching and verifying information . 
Public / generic AI tools cannot be used due to security and compliance policies . 
Critical organizational knowledge exists but is not usable for decision-making . 

### Architecture : 
Tork-Arch in public folder . 

### Tech Stack : 
Frontend:
React.js

Backend:
Django REST Framework

Vector Retrieval:
PostgreSQL + pgvector

LLM Layer:
Ollama

Object Storage:
MinIO

Authentication:
JWT

Centralized Token Management :
Redis

MinIO and Redis Containers : 
Docker

### Engineering Challenges & Solutions

1. Inconsistent Retrieval of Relevant Knowledge Chunks

During the early development of Tork AI, one of the primary challenges was inconsistent retrieval of relevant document chunks during semantic search. Users occasionally received incomplete or irrelevant context despite the required information being present in the knowledge base.

After investigating the retrieval pipeline, we identified that the core retrieval logic had been implemented in an incorrect Django application layer, causing the retrieval workflow to bypass parts of the intended processing pipeline. We refactored the architecture by relocating the retrieval functionality to the appropriate service layer and restructuring the retrieval flow.

**Result:** The retrieval process became significantly more reliable, consistently returning the most relevant context for downstream LLM processing and improving overall answer quality.

---

2. Intermittent LLM Response Failures Due to Ollama Service Availability

After integrating Ollama as the local LLM inference engine, we encountered intermittent response failures where user queries would occasionally time out instead of generating answers. The issue appeared inconsistent, making it difficult to reproduce initially.

Through debugging and monitoring, we discovered that the Ollama service was not running persistently in the background. The application depended on manually starting the model through the terminal before handling requests, which resulted in availability issues whenever the service was not active.

To resolve this, Ollama was configured to run as a background service during system startup, ensuring that the inference engine remained available whenever the application was running.

**Result:** LLM availability became stable, timeout-related failures were eliminated, and users consistently received generated responses without requiring any manual intervention.


