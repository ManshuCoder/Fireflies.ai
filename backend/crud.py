from sqlalchemy.orm import Session
from sqlalchemy import or_
import database as models
import schemas

def get_meetings(
    db: Session,
    search: str = None,
    participant: str = None,
    sort_by: str = "recency"
):
    query = db.query(models.Meeting)
    
    if search:
        query = query.filter(
            or_(
                models.Meeting.title.like(f"%{search}%"),
                models.Meeting.summary.like(f"%{search}%")
            )
        )
    
    if participant:
        query = query.filter(models.Meeting.participants.like(f"%{participant}%"))
        
    if sort_by == "recency":
        query = query.order_by(models.Meeting.date.desc())
    elif sort_by == "oldest":
        query = query.order_by(models.Meeting.date.asc())
        
    return query.all()

def get_meeting(db: Session, meeting_id: int):
    return db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()

def create_meeting(db: Session, meeting: schemas.MeetingCreate):
    db_meeting = models.Meeting(
        title=meeting.title,
        date=meeting.date,
        duration=meeting.duration,
        participants=meeting.participants,
        summary=meeting.summary,
        outline=meeting.outline,
        audio_url=meeting.audio_url
    )
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

def update_meeting(db: Session, meeting_id: int, meeting_update: schemas.MeetingUpdate):
    db_meeting = get_meeting(db, meeting_id)
    if not db_meeting:
        return None
        
    update_data = meeting_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_meeting, key, value)
        
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

def delete_meeting(db: Session, meeting_id: int):
    db_meeting = get_meeting(db, meeting_id)
    if not db_meeting:
        return False
    db.delete(db_meeting)
    db.commit()
    return True

# Utterance operations
def create_utterance(db: Session, utterance: schemas.TranscriptUtteranceCreate, meeting_id: int):
    db_utterance = models.TranscriptUtterance(
        meeting_id=meeting_id,
        speaker=utterance.speaker,
        text=utterance.text,
        start_time=utterance.start_time,
        end_time=utterance.end_time
    )
    db.add(db_utterance)
    db.commit()
    db.refresh(db_utterance)
    return db_utterance

# Action Item operations
def get_action_item(db: Session, action_id: int):
    return db.query(models.ActionItem).filter(models.ActionItem.id == action_id).first()

def create_action_item(db: Session, action_item: schemas.ActionItemCreate, meeting_id: int):
    db_action = models.ActionItem(
        meeting_id=meeting_id,
        text=action_item.text,
        completed=False
    )
    db.add(db_action)
    db.commit()
    db.refresh(db_action)
    return db_action

def update_action_item(db: Session, action_id: int, action_update: schemas.ActionItemUpdate):
    db_action = get_action_item(db, action_id)
    if not db_action:
        return None
        
    update_data = action_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_action, key, value)
        
    db.commit()
    db.refresh(db_action)
    return db_action

def delete_action_item(db: Session, action_id: int):
    db_action = get_action_item(db, action_id)
    if not db_action:
        return False
    db.delete(db_action)
    db.commit()
    return True
