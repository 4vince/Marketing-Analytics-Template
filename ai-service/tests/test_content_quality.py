import sys
sys.path.insert(0, ".")
from agents.content_quality import ContentQualityAgent


def test_content_quality_returns_result():
    agent = ContentQualityAgent()
    result = agent.analyze({"name": "Test Product", "description": "A great product for testing."})
    assert 0 <= result.score <= 100
    assert isinstance(result.findings, list)
    assert isinstance(result.suggestions, list)
