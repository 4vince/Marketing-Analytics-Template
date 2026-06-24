### Task 13: Build Chat WebSocket

**Files:**
- Create: `src/app/api/chat/route.ts` (WebSocket upgrade + REST fallback)
- Modify: `ai-service/main.py` (add WebSocket endpoint)

**Interfaces:**
- Produces: WebSocket endpoint for real-time shopper chat
- Produces: Python WebSocket handler that routes messages to ChatAgent

- [ ] **Step 1: Add WebSocket to Python service**

Add to `ai-service/main.py`:
```python
from fastapi import WebSocket, WebSocketDisconnect
from agents.chat import StorefrontChatAgent
from agents.base import ChatContext


@app.websocket("/chat/{conversation_id}")
async def chat_websocket(websocket: WebSocket, conversation_id: str):
    await websocket.accept()
    agent = StorefrontChatAgent()
    ctx = ChatContext(conversation_id=conversation_id)

    while True:
        try:
            data = await websocket.receive_json()
            message = data.get("message", "")
            if data.get("catalog"):
                ctx.product_catalog = data["catalog"]

            response = await agent.respond(message, ctx)
            await websocket.send_json({"type": "response", "message": response.message})
        except WebSocketDisconnect:
            break
```

- [ ] **Step 2: Create Next.js chat API route**

`src/app/api/chat/route.ts` (HTTP fallback for serverless environments):
```ts
import { NextResponse } from "next/server";

const AI_SERVICE = process.env.AI_SERVICE_URL || "http://localhost:8000";

export async function POST(req: Request) {
  const body = await req.json();
  const aiRes = await fetch(`${AI_SERVICE}/chat/${body.conversationId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: body.message, catalog: body.catalog }),
  });
  const data = await aiRes.json();
  return NextResponse.json(data);
}
```

Add HTTP chat endpoint to `ai-service/main.py`:
```python
@app.post("/chat/{conversation_id}")
async def chat_http(conversation_id: str, data: dict):
    agent = StorefrontChatAgent()
    ctx = ChatContext(
        conversation_id=conversation_id,
        product_catalog=data.get("catalog", []),
    )
    response = await agent.respond(data.get("message", ""), ctx)
    return {"message": response.message}
```

- [ ] **Step 3: Commit**

```bash
git add . && git commit -m "feat: add chat websocket and http endpoints"
```

---


