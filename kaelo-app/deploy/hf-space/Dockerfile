# Kaelo API for Hugging Face Spaces (Docker SDK).
#
# Spaces run the container as uid 1000 and expect the app on the port declared
# by app_port in README.md, so this differs from the generic Dockerfile in
# kaelo-app/ mainly in user setup and port.
FROM python:3.11-slim

# cvxpy/highspy build against BLAS; slim needs the toolchain present.
RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH
WORKDIR $HOME/app

COPY --chown=user backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir --user -r backend/requirements.txt

COPY --chown=user backend ./backend

# Public reference data (facility list, district boundaries, population).
# Not vendored here; add your copy and uncomment.
# COPY --chown=user data ./data

ENV KAELO_DATA_ROOT=$HOME/app
ENV PORT=7860
EXPOSE 7860
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT}"]
