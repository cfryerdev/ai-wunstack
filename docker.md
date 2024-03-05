# Docker information

This project, you can run the RAG in memory or within Chroma Vector Database for persistance across instances or restarts.

# Starting Postgres

You can run the docker database locally using the following:

```
docker run --name dev-postgres -p 5432:5432 -e POSTGRES_DB=wundb -e POSTGRES_PASSWORD=Wun12345 -d postgres
```

# Starting ChromaDb

Pretty simple, just run the following command:

```
docker run --name dev-chroma -d -p 8000:8000 chromadb/chroma

```