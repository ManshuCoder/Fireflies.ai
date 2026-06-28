import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./meetings.db")

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    date = Column(String)  # ISO format string: YYYY-MM-DDTHH:MM:SS
    duration = Column(Integer)  # in seconds
    participants = Column(String)  # Comma separated
    summary = Column(Text, nullable=True)  # Overview summary
    outline = Column(Text, nullable=True)  # JSON string of outline chapters
    audio_url = Column(String, nullable=True)  # URL or filename to audio
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())

    # Relationships
    transcript = relationship("TranscriptUtterance", back_populates="meeting", cascade="all, delete-orphan")
    action_items = relationship("ActionItem", back_populates="meeting", cascade="all, delete-orphan")

class TranscriptUtterance(Base):
    __tablename__ = "transcript_utterances"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"))
    speaker = Column(String, index=True)
    text = Column(Text)
    start_time = Column(Float)  # in seconds
    end_time = Column(Float)  # in seconds

    meeting = relationship("Meeting", back_populates="transcript")

class ActionItem(Base):
    __tablename__ = "action_items"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"))
    text = Column(String)
    completed = Column(Boolean, default=False)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())

    meeting = relationship("Meeting", back_populates="action_items")

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
