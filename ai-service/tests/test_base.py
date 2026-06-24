# Tests for base models and interfaces — validates data models and abstract agent classes.
from agents.base import BaseAgent, ChatAgent, AnalysisResult, ChatContext, ChatResponse, BaseModel
from typing import Any


class TestModels:
    def test_analysis_result(self):
        result = AnalysisResult(score=85, findings=[], suggestions=[])
        assert result.score == 85
        assert result.findings == []
        assert result.suggestions == []

    def test_chat_context(self):
        ctx = ChatContext(conversation_id="abc-123")
        assert ctx.conversation_id == "abc-123"
        assert ctx.product_catalog == []
        assert ctx.customer_email is None

    def test_chat_response(self):
        resp = ChatResponse(message="Hello")
        assert resp.message == "Hello"
        assert resp.actions == []


class TestAgentInterface:
    def test_agent_is_abstract(self):
        assert BaseAgent.__dict__["analyze"].__isabstractmethod__

    def test_chat_agent_is_abstract(self):
        assert ChatAgent.__dict__["respond"].__isabstractmethod__
