from agents.base import AnalysisResult
from agents.content_quality import ContentQualityAgent
from agents.seo import SEOAgent
from agents.product_page import ProductPageAgent


class Orchestrator:
    def __init__(self):
        self.agents = {
            "content": ContentQualityAgent(),
            "seo": SEOAgent(),
            "product": ProductPageAgent(),
        }

    def run_all_analyses(self, product_data: dict) -> dict[str, AnalysisResult]:
        results: dict[str, AnalysisResult] = {}
        for name, agent in self.agents.items():
            results[name] = agent.analyze(product_data)
        return results
