FROM python:3.11@sha256:ef6b499ae586263bdb3c6e3965daf414419d786694aeba859fd07e31f4b0bceb

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

CMD ["fastapi", "run", "app/main.py", "--host", "0.0.0.0", "--port", "8000"]
