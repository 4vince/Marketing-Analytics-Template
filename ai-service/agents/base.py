# Abstract base classes and Pydantic models for analysis results, chat context, and agents.
import json

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
    """Base class for analysis agents with centralized LLM init, retry logic, and JSON parsing.

    Subclasses override analyze() and call self._run_llm_analysis() instead of
    duplicating LLM calls, error handling, and JSON decoding.
    """

    max_retries: int = 2

    def __init__(self):
        try:
            from llm_client import LLMClient
            self.llm = LLMClient()
        except Exception:
            self.llm = None

    @abstractmethod
    def analyze(self, content: dict) -> AnalysisResult:
        ...

    def _run_llm_analysis(self, system_prompt: str, user_prompt: str) -> AnalysisResult:
        """Call the LLM with retry logic, parse JSON, and return an AnalysisResult.

        Handles all failure modes (missing LLM, bad JSON, invalid schema) and
        returns a consistent fallback result so subclasses don't need try/except.
        """
        if self.llm is None:
            return self._fallback_result(
                "LLM client could not be initialized. Check API keys and network connectivity."
            )

        last_error: str | None = None
        for _ in range(self.max_retries + 1):
            try:
                raw = self.llm.chat(system_prompt, user_prompt)
                data = json.loads(raw)

                # Validate required fields exist with correct types
                score = data.get("score")
                findings = data.get("findings")
                suggestions = data.get("suggestions")
                if not isinstance(score, int) or not isinstance(findings, list) or not isinstance(suggestions, list):
                    raise ValueError(f"Invalid response structure: score={type(score).__name__}, "
                                     f"findings={type(findings).__name__}, suggestions={type(suggestions).__name__}")

                return AnalysisResult(score=score, findings=findings, suggestions=suggestions)
            except (json.JSONDecodeError, ValueError, KeyError, TypeError) as e:
                last_error = str(e)
                continue

        return self._fallback_result(
            f"Analysis failed after {self.max_retries + 1} attempts: {last_error}"
        )

    @staticmethod
    def _fallback_result(detail: str = "Analysis unavailable") -> AnalysisResult:
        """Return a uniform error result when analysis cannot be completed."""
        return AnalysisResult(
            score=0,
            findings=[{"issue": "Analysis unavailable", "severity": "high", "detail": detail}],
            suggestions=[],
        )


class ChatAgent(ABC):
    """Base class for chat agents with centralized LLM init, retry logic, and async support.

    Subclasses override respond() and call self._chat_with_llm() instead of
    duplicating LLM calls and error handling.
    """

    max_retries: int = 2

    def __init__(self):
        try:
            from llm_client import LLMClient
            self.llm = LLMClient()
        except Exception:
            self.llm = None

    @abstractmethod
    async def respond(self, message: str, context: ChatContext) -> ChatResponse:
        ...

    async def _chat_with_llm(self, system_prompt: str, user_message: str) -> ChatResponse:
        """Call the LLM with retry logic and return a ChatResponse.

        Handles all failure modes (missing LLM, API errors) and returns a
        consistent fallback response so subclasses don't need try/except.
        """
        if self.llm is None:
            return self._fallback_response(
                "Chat service is currently unavailable. Please try again later."
            )

        for _ in range(self.max_retries + 1):
            try:
                result = await self.llm.chat_async(system_prompt, user_message)
                return ChatResponse(message=result)
            except Exception:
                continue

        return self._fallback_response(
            "Chat service is temporarily unavailable. Please try again later."
        )

    @staticmethod
    def _fallback_response(message: str = "Chat service is unavailable.") -> ChatResponse:
        """Return a uniform error response when chat cannot be completed."""
        return ChatResponse(message=message)
