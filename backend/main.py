
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="PayRakshak AI",
    description="Demo payment safety and transaction verification API",
    version="1.0.0",
)

# React/Vite frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DEMO DATA ONLY — not connected to any real bank or UPI account
DEMO_RECORDS = [
    {
        "reference": "DEMO-UPI-1001",
        "amount": 1500,
        "status": "successful",
        "description": "Demo grocery payment",
        "date_label": "Today",
    },
    {
        "reference": "DEMO-UPI-1002",
        "amount": 2500,
        "status": "pending",
        "description": "Demo electricity bill",
        "date_label": "Today",
    },
    {
        "reference": "DEMO-UPI-1003",
        "amount": 750,
        "status": "failed",
        "description": "Demo mobile recharge",
        "date_label": "Yesterday",
    },
    {
        "reference": "DEMO-UPI-1004",
        "amount": 3200,
        "status": "successful",
        "description": "Demo shopping payment",
        "date_label": "Yesterday",
    },
]


class VerifyRequest(BaseModel):
    reference: str = Field(min_length=1, max_length=100)


@app.get("/")
def home():
    return {
        "app": "PayRakshak AI",
        "message": "Backend is running",
        "docs": "/docs",
    }


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "app": "PayRakshak AI",
    }


@app.get("/api/summary")
def summary():
    total = len(DEMO_RECORDS)
    successful = sum(
        1 for record in DEMO_RECORDS
        if record["status"] == "successful"
    )
    pending = sum(
        1 for record in DEMO_RECORDS
        if record["status"] == "pending"
    )
    failed = sum(
        1 for record in DEMO_RECORDS
        if record["status"] == "failed"
    )

    return {
        "total": total,
        "successful": successful,
        "pending": pending,
        "failed": failed,
    }


@app.get("/api/demo-records")
def demo_records():
    return {"records": DEMO_RECORDS}


@app.post("/api/verify")
def verify_transaction(request: VerifyRequest):
    reference = request.reference.strip().upper()

    record = next(
        (
            item for item in DEMO_RECORDS
            if item["reference"] == reference
        ),
        None,
    )

    if record is None:
        return {
            "found": False,
            "status": "not_found",
            "message": (
                "Reference demo records mein nahi mila. "
                "Reference check karke dobara try karein."
            ),
        }

    return {
        "found": True,
        "status": record["status"],
        "message": (
            "Demo record mil gaya. Yeh real bank verification nahi hai."
        ),
        "amount": record["amount"],
        "reference": record["reference"],
    }


@app.get("/api/security-tips")
def security_tips():
    return {
        "tips": [
            "Apna UPI PIN, OTP ya password kisi ke saath share na karein.",
            "Paise receive karne ke liye UPI PIN enter karna zaroori nahi hota.",
            "Payment status apne official bank ya UPI app mein check karein.",
            "Unknown links aur suspicious QR codes se savdhaan rahein.",
        ]
    }


@app.get("/api/time")
def current_time():
    return {
        "server_time": datetime.now(timezone.utc).isoformat()
    }

