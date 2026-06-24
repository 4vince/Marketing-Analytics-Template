### Task 18: Polish + Deployment

**Files:**
- Create: `D:\ecommerce-template\Dockerfile` (for Python service)
- Create: `D:\ecommerce-template\docker-compose.yml`
- Modify: Various files for loading/error states

- [ ] **Step 1: Create Dockerfile for Python service**

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY ai-service/requirements.txt .
RUN pip install -r requirements.txt
COPY ai-service/ .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- [ ] **Step 2: Create docker-compose.yml**

```yaml
version: "3.8"
services:
  ai-service:
    build: .
    ports:
      - "8000:8000"
    env_file: ./ai-service/.env
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ecommerce
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

- [ ] **Step 3: Final build check**

```bash
cd D:\ecommerce-template && npx next build 2>&1 | findstr /V "Info"
```

Expected: Build succeeds without errors.

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "chore: add docker config and final polish"
```

