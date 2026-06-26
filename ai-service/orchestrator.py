# Analysis orchestrator — runs all four agents (ContentQuality, SEO, ProductPage, ContentOptimization) on product data.
from agents.base import AnalysisResult
from agents.content_quality import ContentQualityAgent
from agents.seo import SEOAgent
from agents.product_page import ProductPageAgent
from agents.content_optimization import ContentOptimizationAgent


class Orchestrator:
    def __init__(self):
        self.agents = {
            "content": ContentQualityAgent(),
            "seo": SEOAgent(),
            "product": ProductPageAgent(),
            "optimization": ContentOptimizationAgent(),
        }

    def run_all_analyses(self, product_data: dict) -> dict[str, AnalysisResult]:
        results: dict[str, AnalysisResult] = {}
        for name, agent in self.agents.items():
            results[name] = agent.analyze(product_data)
        return results
