# FastAPI application entry point — defines routes for health check, chat, product analysis, and report generation.
import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import WebSocket, WebSocketDisconnect

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


from agents.quarterly_report import QuarterlyReportAgent
from agents.product_preference import ProductPreferenceReportAgent
from orchestrator import Orchestrator
from agents.chat import StorefrontChatAgent
from agents.base import ChatContext

orchestrator = Orchestrator()

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


@app.post("/chat/{conversation_id}")
async def chat_http(conversation_id: str, data: dict):
    agent = StorefrontChatAgent()
    ctx = ChatContext(
        conversation_id=conversation_id,
        product_catalog=data.get("catalog", []),
    )
    response = await agent.respond(data.get("message", ""), ctx)
    return {"message": response.message}


@app.post("/analyze/product")
async def analyze_product(data: dict):
    try:
        results = orchestrator.run_all_analyses(data)
        return {name: result.model_dump() for name, result in results.items()}
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze/report")
async def generate_report(data: dict):
    agent = QuarterlyReportAgent()
    result = agent.analyze(data)
    return result.model_dump()


@app.post("/analyze/report/preferences")
async def generate_preference_report(data: dict):
    agent = ProductPreferenceReportAgent()
    result = agent.analyze(data)
    return result.model_dump()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
