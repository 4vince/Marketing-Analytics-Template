### Task 11: Build Chat Agent

**Files:**
- Create: `ai-service/agents/chat.py`

**Interfaces:**
- Consumes: `ChatAgent` from Task 9
- Produces: Chat response with product-aware context

- [ ] **Step 1: Create chat agent**

```python
from .base import ChatAgent, ChatContext, ChatResponse
from llm_client import LLMClient


class StorefrontChatAgent(ChatAgent):
    def __init__(self):
        self.llm = LLMClient()

    async def respond(self, message: str, context: ChatContext) -> ChatResponse:
        catalog_context = ""
        if context.product_catalog:
            catalog_lines = [
                f"- {p.get('name', '')}: ${p.get('price', 0) / 100:.2f} ({p.get('category', '')})"
                for p in context.product_catalog[:10]
            ]
            catalog_context = "Available products:\n" + "\n".join(catalog_lines)

        system = f"""You are a helpful e-commerce assistant. Help customers find products, answer questions, and guide them through the store.
Be concise and friendly. When recommending products, reference them by name.

{catalog_context}"""

        result = self.llm.chat(system, message)
        return ChatResponse(message=result)
```

- [ ] **Step 2: Test chat agent**

Create `ai-service/tests/test_chat.py`:
```python
import sys
sys.path.insert(0, ".")
import pytest
from agents.chat import StorefrontChatAgent
from agents.base import ChatContext


@pytest.mark.asyncio
async def test_chat_responds():
    agent = StorefrontChatAgent()
    ctx = ChatContext(
        conversation_id="test-1",
        product_catalog=[{"name": "Widget", "price": 2999, "category": "gadgets"}],
    )
    resp = await agent.respond("What products do you have?", ctx)
    assert len(resp.message) > 0
```

```bash
cd D:\ecommerce-template\ai-service && python -m pytest tests/test_chat.py -v
```
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add . && git commit -m "feat: add storefront chat agent"
```

---


