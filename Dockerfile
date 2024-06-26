FROM python:3.11-alpine

WORKDIR /

COPY ./static ./templates
COPY ./templates ./templates
COPY ./main.py .
COPY ./requirements.txt .
COPY ./wsgi.py .


RUN pip3 install -r requirements.txt --no-cache-dir

CMD python3 wsgi.py