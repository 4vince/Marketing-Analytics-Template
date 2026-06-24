### Task 9: Scaffold Python AI Service

**Files:**
- Create: `ai-service/requirements.txt`
- Create: `ai-service/.env.example`
- Create: `ai-service/main.py`
- Create: `ai-service/llm_client.py`
- Create: `ai-service/agents/__init__.py`
- Create: `ai-service/agents/base.py`

**Interfaces:**
- Produces: FastAPI app with health endpoint
- Produces: `LLMClient` — wrapper around OpenAI/Claude API
- Produces: `BaseAgent` — abstract class with `analyze(content: dict) -> AnalysisResult`
- Produces: `ChatAgent` — abstract class with `async respond(message: str, context: ChatContext) -> ChatResponse`

- [ ] **Step 1: Create requirements.txt**

```
fastapi==0.111.0
uvicorn==0.30.0
openai==1.30.0
anthropic==0.34.0
pydantic==2.7.0
python-dotenv==1.0.1
websockets==12.0
httpx==0.27.0
pytest==8.2.0
pytest-asyncio==0.23.0
```

- [ ] **Step 2: Create .env.example**

```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
LLM_PROVIDER=openai
LLM_MODEL=gpt-4o
```

- [ ] **Step 3: Create agents/base.py**

```python
from pydantic import BaseModel
from abc import ABC, abstractmethod
from typing import Any


class AnalysisResult(BaseModel):
    score: int
    findings: list[dict[str, Any]]
    suggestions: list[dict[str, Any]]


class ChatContext(BaseModel):
    conversation_id: str
    product_catalog: list[dict[str, Any]] = []
    customer_email: str | None = None


class ChatResponse(BaseModel):
    message: str
    actions: list[dict[str, Any]] = []


class BaseAgent(ABC):
    @abstractmethod
    def analyze(self, content: dict) -> AnalysisResult:
        ...


class ChatAgent(ABC):
    @abstractmethod
    async def respond(self, message: str, context: ChatContext) -> ChatResponse:
        ...
```

- [ ] **Step 4: Create llm_client.py**

```python
import os
from openai import OpenAI
from anthropic import Anthropic


class LLMClient:
    def __init__(self):
        provider = os.getenv("LLM_PROVIDER", "openai")
        model = os.getenv("LLM_MODEL", "gpt-4o")

        if provider == "openai":
            self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            self.model = model
            self.provider = "openai"
        elif provider == "anthropic":
            self.client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
            self.model = model
            self.provider = "anthropic"

    def chat(self, system: str, user: str) -> str:
        if self.provider == "openai":
            resp = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                temperature=0.3,
            )
            return resp.choices[0].message.content or ""
        else:
            resp = self.client.messages.create(
                model=self.model,
                system=system,
                messages=[{"role": "user", "content": user}],
                temperature=0.3,
            )
            return resp.content[0].text if resp.content else ""
```

- [ ] **Step 5: Create agents/__init__.py**

```python
from .base import BaseAgent, ChatAgent, AnalysisResult, ChatContext, ChatResponse
```

- [ ] **Step 6: Create main.py**

```python
import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Marketing Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

- [ ] **Step 7: Verify service runs**

```bash
cd D:\ecommerce-template\ai-service
pip install -r requirements.txt
python -c "from agents.base import BaseAgent, ChatAgent; print('OK')"
```
Expected: `OK`

- [ ] **Step 8: Commit**

```bash
git add . && git commit -m "feat: scaffold python ai service with agent interfaces"
```

---


