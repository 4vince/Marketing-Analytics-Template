# Storefront chat agent — answers customer questions using the LLM with the product catalog as context.
from .base import ChatAgent, ChatContext, ChatResponse
from llm_client import LLMClient


class StorefrontChatAgent(ChatAgent):
    def __init__(self):
        try:
            self.llm = LLMClient()
        except Exception:
            self.llm = None

    async def respond(self, message: str, context: ChatContext) -> ChatResponse:
        if self.llm is None:
            return ChatResponse(message="Chat service is unavailable. Please try again later.")

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
