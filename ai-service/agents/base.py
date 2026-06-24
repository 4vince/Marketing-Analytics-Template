# Abstract base classes and Pydantic models for analysis results, chat context, and agents.
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
