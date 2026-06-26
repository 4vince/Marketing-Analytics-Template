# SEO analysis agent — scores product SEO and evaluates title, meta description, and URL optimization.
import json

from .base import BaseAgent, AnalysisResult
from llm_client import LLMClient


class SEOAgent(BaseAgent):
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
Analyze this product page for SEO effectiveness.

Name: {content.get('name', '')}
Meta Title: {content.get('meta_title', '')}
Meta Description: {content.get('meta_description', '')}
Product Title: {content.get('name', '')}
Product Description: {content.get('description', '')}
Category: {content.get('category', '')}
Slug: {content.get('slug', '')}

Score from 0-100 on:
1. Title tag quality (length, keyword inclusion, relevance)
2. Meta description quality and search intent alignment
3. Description keyword richness and readability
4. URL slug optimization

Provide SEO findings and actionable suggestions, but do not rewrite the title or description here.

Return JSON: {{"score": int, "findings": [{{"issue": str, "severity": str, "detail": str}}], "suggestions": [{{"area": str, "suggestion": str}}]}}
"""
        try:
            result = self.llm.chat("You are an expert e-commerce SEO analyst.", prompt)
            data = json.loads(result)
            return AnalysisResult(**data)
        except json.JSONDecodeError:
            return AnalysisResult(
                score=0,
                findings=[{"issue": "Analysis unavailable", "severity": "high", "detail": "LLM analysis failed to return valid results. Check API keys and network connectivity."}],
                suggestions=[]
            )
