# LLM client abstraction — supports Opencode and Anthropic providers via environment config.
import os
from opencode import opencode
from anthropic import Anthropic


class LLMClient:
    def __init__(self):
        provider = os.getenv("LLM_PROVIDER", "opencode")
        model = os.getenv("LLM_MODEL", "opencode/big-pickle")

        if provider == "opencode":
            self.client = opencode(api_key=os.getenv("OPENCODE_API_KEY"))
            self.model = model
            self.provider = "opencode"
        elif provider == "anthropic":
            self.client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
            self.model = model
            self.provider = "anthropic"

    def chat(self, system: str, user: str) -> str:
        if self.provider == "opencode":
            resp = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                temperature=0.3,
            )
            return resp.choices[0].message.content or ""
        else:
            resp = self.client.messages.create(
                model=self.model,
                system=system,
                messages=[{"role": "user", "content": user}],
                temperature=0.3,
            )
            return resp.content[0].text if resp.content else ""
