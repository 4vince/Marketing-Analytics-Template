# Product preference report generation agent — summarizes customer product preferences and recommends actions for marketing and merchandising.
import json

from .base import BaseAgent, AnalysisResult
from llm_client import LLMClient


class ProductPreferenceReportAgent(BaseAgent):
    def __init__(self):
        try:
            self.llm = LLMClient()
        except Exception:
            self.llm = None

    def analyze(self, content: dict) -> AnalysisResult:
        if self.llm is None:
            return AnalysisResult(
                score=0,
                findings=[
                    {
                        "issue": "Analysis unavailable",
                        "severity": "high",
                        "detail": "LLM analysis failed to return valid results. Check API keys and network connectivity.",
                    }
                ],
                suggestions=[],
            )

        preferences = content.get("preferences") or content.get("customer_preferences") or []
        if not preferences:
            return AnalysisResult(
                score=0,
                findings=[
                    {
                        "issue": "No preference data",
                        "severity": "high",
                        "detail": "No customer preference records were provided for the report.",
                    }
                ],
                suggestions=[
                    {
                        "area": "data",
                        "suggestion": "Provide customer preference records under 'preferences' or 'customer_preferences' when generating a product preference report.",
                    }
                ],
            )

        summary_lines = []
        for pref in preferences[:20]:
            product = pref.get("product_name") or pref.get("name") or pref.get("product") or "unknown"
            score = pref.get("score") or pref.get("preference_score") or 0
            category = pref.get("category", "unknown")
            reason = pref.get("reason", pref.get("notes", ""))
            line = f"- {product} ({category}): preference score {score}"
            if reason:
                line += f" — {reason}"
            summary_lines.append(line)

        summary = f"""
Analyze these {len(preferences)} customer preference records:

{chr(10).join(summary_lines)}

Produce a report with:
1. Overall product preference trends and strongest customer affinities
2. The most popular product categories and customer segments
3. Product recommendation and merchandising opportunities
4. A prioritized action plan for marketing, inventory, and promotions

Return JSON: {{"score": int, "findings": [{{"issue": str, "severity": str, "detail": str, "count": int}}], "suggestions": [{{"area": str, "suggestion": str, "effort": "low"/"medium"/"high"}}]}}
"""
        try:
            result = self.llm.chat("You are an expert e-commerce customer preference analyst.", summary)
            data = json.loads(result)
            return AnalysisResult(**data)
        except json.JSONDecodeError:
            return AnalysisResult(
                score=0,
                findings=[
                    {
                        "issue": "Analysis unavailable",
                        "severity": "high",
                        "detail": "LLM analysis failed to return valid results. Check API keys and network connectivity.",
                    }
                ],
                suggestions=[],
            )
