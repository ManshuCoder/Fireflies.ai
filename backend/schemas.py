from pydantic import BaseModel
from typing import List, Optional

# Transcript Utterance schemas
class TranscriptUtteranceBase(BaseModel):
    speaker: str
    text: str
    start_time: float
    end_time: float

class TranscriptUtteranceCreate(TranscriptUtteranceBase):
    pass

class TranscriptUtteranceResponse(TranscriptUtteranceBase):
    id: int
    meeting_id: int

    class Config:
        from_attributes = True

# Action Item schemas
class ActionItemBase(BaseModel):
    text: str

class ActionItemCreate(ActionItemBase):
    pass

class ActionItemUpdate(BaseModel):
    text: Optional[str] = None
    completed: Optional[bool] = None

class ActionItemResponse(ActionItemBase):
    id: int
    meeting_id: int
    completed: bool
    created_at: str

    class Config:
        from_attributes = True

# Meeting schemas
class MeetingBase(BaseModel):
    title: str
    date: str
    duration: int
    participants: str
    summary: Optional[str] = None
    outline: Optional[str] = None  # JSON string
    audio_url: Optional[str] = None

class MeetingCreate(MeetingBase):
    pass

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[str] = None
    duration: Optional[int] = None
    participants: Optional[str] = None
    summary: Optional[str] = None
    outline: Optional[str] = None
    audio_url: Optional[str] = None

# Combined Meeting Response
class MeetingResponse(MeetingBase):
    id: int
    created_at: str
    action_items: List[ActionItemResponse] = []

    class Config:
        from_attributes = True

class MeetingDetailResponse(MeetingResponse):
    transcript: List[TranscriptUtteranceResponse] = []

    class Config:
        from_attributes = True

# Ask Fred QA schemas
class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
