# Dockerfile for the AI service — Python 3.12-slim with uvicorn on port 8000.
FROM python:3.12-slim
WORKDIR /app
COPY ai-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ai-service/ .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
