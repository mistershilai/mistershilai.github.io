# Kaelo API. Deploy this anywhere that runs containers (Render, Fly, Railway),
# then point the frontend at it with VITE_API_URL at build time.
FROM python:3.11-slim

# cvxpy/highspy build against BLAS; slim needs the toolchain present.
RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend ./backend

# Public reference data: the facility list and district boundaries. The
# generated inputs (routing matrices, geocoded population, GLM artifacts) are
# not here, so demand optimization stays disabled until they are added.
COPY data ./data

ENV KAELO_DATA_ROOT=/srv
ENV PORT=8000
# CORS_ORIGINS must include the site origin, e.g. https://elliotlee.info
ENV CORS_ORIGINS=http://localhost:4321

EXPOSE 8000
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT}"]
