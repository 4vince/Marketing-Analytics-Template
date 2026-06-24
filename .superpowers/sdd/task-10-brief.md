### Task 10: Build Content Quality + SEO + Product Page Agents

**Files:**
- Create: `ai-service/agents/content_quality.py`
- Create: `ai-service/agents/seo.py`
- Create: `ai-service/agents/product_page.py`
- Create: `ai-service/orchestrator.py`

**Interfaces:**
- Consumes: `BaseAgent` from Task 9
- Produces: `Orchestrator` with `run_all_analyses(product_data: dict) -> dict[str, AnalysisResult]`

- [ ] **Step 1: Create content quality agent**

```python
from .base import BaseAgent, AnalysisResult
from llm_client import LLMClient


class ContentQualityAgent(BaseAgent):
    def __init__(self):
        self.llm = LLMClient()

    def analyze(self, content: dict) -> AnalysisResult:
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
        result = self.llm.chat("You are an expert e-commerce content analyst.", prompt)

        import json
        try:
            data = json.loads(result)
            return AnalysisResult(**data)
        except json.JSONDecodeError:
            return AnalysisResult(score=50, findings=[], suggestions=[])
```

- [ ] **Step 2: Create SEO agent**

```python
from .base import BaseAgent, AnalysisResult
from llm_client import LLMClient


class SEOAgent(BaseAgent):
    def __init__(self):
        self.llm = LLMClient()

    def analyze(self, content: dict) -> AnalysisResult:
        prompt = f"""
Analyze SEO for this product page:

Name: {content.get('name', '')}
Meta Title: {content.get('meta_title', '')}
Meta Description: {content.get('meta_description', '')}
Category: {content.get('category', '')}
Slug: {content.get('slug', '')}

Score from 0-100 on:
1. Title tag quality (length, keyword inclusion)
2. Meta description quality
3. URL slug optimization
4. Heading structure signals

Return JSON: {{"score": int, "findings": [{{"issue": str, "severity": str, "detail": str}}], "suggestions": [{{"area": str, "suggestion": str}}]}}
"""
        result = self.llm.chat("You are an expert e-commerce SEO analyst.", prompt)

        import json
        try:
            data = json.loads(result)
            return AnalysisResult(**data)
        except json.JSONDecodeError:
            return AnalysisResult(score=50, findings=[], suggestions=[])
```

- [ ] **Step 3: Create product page agent**

```python
from .base import BaseAgent, AnalysisResult
from llm_client import LLMClient


class ProductPageAgent(BaseAgent):
    def __init__(self):
        self.llm = LLMClient()

    def analyze(self, content: dict) -> AnalysisResult:
        prompt = f"""
Analyze this product page for conversion optimization:

Name: {content.get('name', '')}
Description: {content.get('description', '')}
Price: {content.get('price', '')}
Images count: {len(content.get('images', []))}
Category: {content.get('category', '')}

Score from 0-100 on:
1. Description completeness and clarity
2. Pricing presentation
3. Call-to-action effectiveness
4. Social proof potential (reviews, ratings)
5. Image quality signals

Return JSON: {{"score": int, "findings": [{{"issue": str, "severity": str, "detail": str}}], "suggestions": [{{"area": str, "suggestion": str}}]}}
"""
        result = self.llm.chat("You are an expert e-commerce conversion analyst.", prompt)

        import json
        try:
            data = json.loads(result)
            return AnalysisResult(**data)
        except json.JSONDecodeError:
            return AnalysisResult(score=50, findings=[], suggestions=[])
```

- [ ] **Step 4: Create orchestrator.py**

```python
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
```

- [ ] **Step 5: Write and run tests**

Create `ai-service/tests/test_content_quality.py`:
```python
import sys
sys.path.insert(0, ".")
from agents.content_quality import ContentQualityAgent


def test_content_quality_returns_result():
    agent = ContentQualityAgent()
    result = agent.analyze({"name": "Test Product", "description": "A great product for testing."})
    assert 0 <= result.score <= 100
    assert isinstance(result.findings, list)
    assert isinstance(result.suggestions, list)
```

Run:
```bash
cd D:\ecommerce-template\ai-service
python -m pytest tests/ -v
```
Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add . && git commit -m "feat: add content quality, seo, product page agents and orchestrator"
```

---


