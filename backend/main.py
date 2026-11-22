from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
import os

app = FastAPI(title="CampusConnect API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_NAME = os.getenv("DB_NAME", "campusconnect")


def get_connection():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )


@app.get("/")
def home():
    return {"message": "CampusConnect API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/feedback")
def submit_feedback(feedback: dict):
    connection = get_connection()
    cursor = connection.cursor()

    query = """
        INSERT INTO feedback (name, usn, subject, rating, comments)
        VALUES (%s, %s, %s, %s, %s)
    """

    values = (
        feedback["name"],
        feedback["usn"],
        feedback["subject"],
        feedback["rating"],
        feedback.get("comments", "")
    )

    cursor.execute(query, values)
    connection.commit()

    cursor.close()
    connection.close()

    return {"message": "Feedback submitted successfully"}


@app.get("/feedback")
def get_feedback():
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM feedback ORDER BY id DESC")
    results = cursor.fetchall()

    cursor.close()
    connection.close()

    return results
