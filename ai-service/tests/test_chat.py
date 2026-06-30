# Tests for chat agents — validates respond() returns messages for catalog queries, empty catalogs, and failures.
import sys
from unittest.mock import MagicMock

sys.path.insert(0, ".")
import pytest
from agents.chat import StorefrontChatAgent
from agents.base import ChatAgent, ChatContext, ChatResponse


class TestStorefrontChatAgent:
    @pytest.mark.asyncio
    async def test_chat_responds(self):
        """Real LLM call with a catalog should return a non-empty response."""
        agent = StorefrontChatAgent()
        ctx = ChatContext(
            conversation_id="test-1",
            product_catalog=[{"name": "Widget", "price": 2999, "category": "gadgets"}],
        )
        resp = await agent.respond("What products do you have?", ctx)
        assert len(resp.message) > 0

    @pytest.mark.asyncio
    async def test_chat_no_catalog(self):
        """Agent should respond even without a product catalog."""
        agent = StorefrontChatAgent()
        ctx = ChatContext(conversation_id="test-2")
        resp = await agent.respond("Hello", ctx)
        assert len(resp.message) > 0

    @pytest.mark.asyncio
    async def test_chat_llm_failure_returns_fallback(self, monkeypatch):
        """When the LLM call fails, the agent returns a fallback message instead of crashing."""
        agent = StorefrontChatAgent()
        # Replace the underlying LLM client with one that raises
        mock_llm = MagicMock()
        mock_llm.chat_async.side_effect = RuntimeError("API failure")
        agent.llm = mock_llm

        ctx = ChatContext(conversation_id="test-3")
        resp = await agent.respond("Hello", ctx)

        # Should get a fallback message, not an exception
        assert len(resp.message) > 0
        assert mock_llm.chat_async.call_count == agent.max_retries + 1

    def test_format_catalog(self):
        """_format_catalog produces correct string from product list."""
        products = [
            {"name": "Widget", "price": 2999, "category": "gadgets"},
            {"name": "Gizmo", "price": 4999, "category": "electronics"},
        ]
        result = StorefrontChatAgent._format_catalog(products)
        assert "Available products:" in result
        assert "Widget" in result
        assert "$29.99" in result
        assert "gadgets" in result

    def test_format_catalog_empty(self):
        """_format_catalog returns empty string for empty list."""
        assert StorefrontChatAgent._format_catalog([]) == ""
        assert StorefrontChatAgent._format_catalog(None) == ""

    def test_format_catalog_caps_at_ten(self):
        """_format_catalog limits to 10 products."""
        products = [{"name": f"P{i}", "price": 1000, "category": "test"} for i in range(15)]
        result = StorefrontChatAgent._format_catalog(products)
        # Count the non-header lines
        lines = [l for l in result.split("\n") if l.startswith("- ")]
        assert len(lines) == 10

    @pytest.mark.asyncio
    async def test_chatagent_fallback_response(self):
        """_fallback_response returns a consistent ChatResponse."""
        resp = ChatAgent._fallback_response("Service down")
        assert isinstance(resp, ChatResponse)
        assert resp.message == "Service down"

    @pytest.mark.asyncio
    async def test_chatagent_no_llm_returns_fallback(self):
        """When self.llm is None, _chat_with_llm returns a fallback."""
        agent = StorefrontChatAgent()
        agent.llm = None
        resp = await agent._chat_with_llm("system", "user message")
        assert "unavailable" in resp.message.lower()
