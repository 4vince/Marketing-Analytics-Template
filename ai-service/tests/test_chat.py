# Tests for StorefrontChatAgent — verifies respond() returns a non-empty message for a given catalog.
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
