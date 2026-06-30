# Storefront chat agent — answers customer questions using the LLM with the product catalog as context.
from .base import ChatAgent, ChatContext, ChatResponse


class StorefrontChatAgent(ChatAgent):
    """E-commerce storefront chat agent.

    Answers customer questions using the LLM with the product catalog as context.
    Inherits LLM init, retry logic, and error handling from ChatAgent.
    """

    async def respond(self, message: str, context: ChatContext) -> ChatResponse:
        system = self._build_system_prompt(context.product_catalog)
        return await self._chat_with_llm(system, message)

    def _build_system_prompt(self, products: list[dict]) -> str:
        catalog = self._format_catalog(products)
        prompt = """You are a helpful e-commerce assistant. Help customers find products, answer questions, and guide them through the store.
Be concise and friendly. When recommending products, reference them by name."""
        if catalog:
            prompt += f"\n\n{catalog}"
        return prompt

    @staticmethod
    def _format_catalog(products: list[dict]) -> str:
        """Format up to 10 products into a readable catalog for the LLM context."""
        if not products:
            return ""
        lines = [
            f"- {p.get('name', '')}: ${p.get('price', 0) / 100:.2f} ({p.get('category', '')})"
            for p in products[:10]
        ]
        return "Available products:\n" + "\n".join(lines)
