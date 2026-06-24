import json

from .base import BaseAgent, AnalysisResult
from llm_client import LLMClient


class ContentQualityAgent(BaseAgent):
    def __init__(self):
        try:
            self.llm = LLMClient()
        except Exception:
            self.llm = None

    def analyze(self, content: dict) -> AnalysisResult:
        if self.llm is None:
            return AnalysisResult(
                score=0,
                findings=[{"issue": "Analysis unavailable", "severity": "high", "detail": "LLM analysis failed to return valid results. Check API keys and network connectivity."}],
                suggestions=[]
            )
        prompt = f"""
Analyze this e-commerce product content for quality:

Name: {content.get('name', '')}
Description: {content.get('description', '')}

Score from 0-100 on:
1. Readability and clarity
2. Grammar and spelling
3. Structure and formatting
4. Persuasiveness and engagement

Return JSON: {{"score": int, "findings": [{{"issue": str, "severity": "high"/"medium"/"low", "detail": str}}], "suggestions": [{{"area": str, "suggestion": str}}]}}
"""
        try:
            result = self.llm.chat("You are an expert e-commerce content analyst.", prompt)
            data = json.loads(result)
            return AnalysisResult(**data)
        except json.JSONDecodeError:
            return AnalysisResult(
                score=0,
                findings=[{"issue": "Analysis unavailable", "severity": "high", "detail": "LLM analysis failed to return valid results. Check API keys and network connectivity."}],
                suggestions=[]
            )
