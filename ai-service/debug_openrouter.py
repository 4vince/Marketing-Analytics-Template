from dotenv import load_dotenv
import os, traceback
from openai import OpenAI

load_dotenv()
print('LLM_PROVIDER=', os.getenv('LLM_PROVIDER'))
print('OPENROUTER_BASE_URL=', os.getenv('OPENROUTER_BASE_URL'))
print('OPENROUTER_API_KEY_set=', bool(os.getenv('OPENROUTER_API_KEY')))

client = OpenAI(api_key=os.getenv('OPENROUTER_API_KEY'), base_url=os.getenv('OPENROUTER_BASE_URL'))
print('client ready')

try:
    resp = client.chat.completions.create(
        model=os.getenv('LLM_MODEL'),
        messages=[
            {'role': 'system', 'content': 'You are a test bot.'},
            {'role': 'user', 'content': 'Hello'}
        ],
        temperature=0.3,
    )
    print('RESP', resp)
except Exception as e:
    print('ERROR', type(e).__name__, e)
    traceback.print_exc()
