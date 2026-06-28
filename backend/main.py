import os
import json
import re
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
import google.generativeai as genai
from dotenv import load_dotenv

import database as models
import schemas
import crud

load_dotenv()

# Initialize Database
models.init_db()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    print("Gemini API configured successfully.")
else:
    print("WARNING: GEMINI_API_KEY not found in environment. Using mock AI fallbacks.")

app = FastAPI(title="Fireflies.ai Clone API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; refine for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure static files directory exists
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Helper: Parse different transcript formats
def parse_transcript(content_str: str, filename: str):
    """
    Parses VTT, JSON, or TXT transcript and returns a list of utterance dicts:
    [{'speaker': str, 'text': str, 'start_time': float, 'end_time': float}]
    """
    utterances = []
    
    # 1. Parse JSON
    if filename.endswith(".json"):
        try:
            data = json.loads(content_str)
            if isinstance(data, list):
                for idx, item in enumerate(data):
                    utterances.append({
                        "speaker": item.get("speaker", f"Speaker {item.get('speaker_id', 'A')}"),
                        "text": item.get("text", ""),
                        "start_time": float(item.get("start_time", idx * 5.0)),
                        "end_time": float(item.get("end_time", (idx + 1) * 5.0)),
                    })
                return utterances
        except Exception as e:
            print(f"JSON parse error: {e}")

    # 2. Parse VTT
    if filename.endswith(".vtt") or "WEBVTT" in content_str:
        # VTT regex matcher for: 00:01.000 --> 00:04.500 or 00:00:01.000 --> 00:00:04.500
        time_pattern = r"(\d{2}:)?(\d{2}):(\d{2})[.,](\d{3})\s+-->\s+(\d{2}:)?(\d{2}):(\d{2})[.,](\d{3})"
        lines = content_str.splitlines()
        
        def to_seconds(h, m, s, ms):
            h = int(h) if h else 0
            return h * 3600 + int(m) * 60 + int(s) + int(ms) / 1000.0

        i = 0
        while i < len(lines):
            line = lines[i].strip()
            match = re.match(time_pattern, line)
            if match:
                # Extract timestamps
                h1, m1, s1, ms1 = match.group(1), match.group(2), match.group(3), match.group(4)
                h2, m2, s2, ms2 = match.group(5), match.group(6), match.group(7), match.group(8)
                
                h1 = h1.replace(":", "") if h1 else None
                h2 = h2.replace(":", "") if h2 else None
                
                start_t = to_seconds(h1, m1, s1, ms1)
                end_t = to_seconds(h2, m2, s2, ms2)
                
                # Next line has the content
                i += 1
                text_lines = []
                while i < len(lines) and lines[i].strip() != "" and not re.match(time_pattern, lines[i].strip()):
                    text_lines.append(lines[i].strip())
                    i += 1
                
                text = " ".join(text_lines)
                # Parse speaker if format is "<Speaker>: <text>" or "[Speaker]: <text>"
                speaker = "Speaker A"
                speaker_match = re.match(r"^\[?([^\]:]+)\]?:\s*(.*)$", text)
                if speaker_match:
                    speaker = speaker_match.group(1).strip()
                    text = speaker_match.group(2).strip()
                    
                utterances.append({
                    "speaker": speaker,
                    "text": text,
                    "start_time": start_t,
                    "end_time": end_t
                })
            else:
                i += 1
        if utterances:
            return utterances

    # 3. Parse TXT (line-by-line fallback)
    # Format: Speaker Name (01:23): Hello world
    # or [01:23] Speaker Name: Hello world
    txt_lines = content_str.splitlines()
    for idx, line in enumerate(txt_lines):
        line = line.strip()
        if not line:
            continue
            
        time_match1 = re.match(r"^([^(\n]+)\s*\((\d{2}):(\d{2})\):\s*(.*)$", line)
        time_match2 = re.match(r"^\[(\d{2}):(\d{2})\]\s*([^:]+):\s*(.*)$", line)
        
        if time_match1:
            speaker = time_match1.group(1).strip()
            min_s, sec_s = int(time_match1.group(2)), int(time_match1.group(3))
            start_t = min_s * 60 + sec_s
            text = time_match1.group(4).strip()
            utterances.append({
                "speaker": speaker,
                "text": text,
                "start_time": float(start_t),
                "end_time": float(start_t + 5.0)
            })
        elif time_match2:
            min_s, sec_s = int(time_match2.group(1)), int(time_match2.group(2))
            start_t = min_s * 60 + sec_s
            speaker = time_match2.group(3).strip()
            text = time_match2.group(4).strip()
            utterances.append({
                "speaker": speaker,
                "text": text,
                "start_time": float(start_t),
                "end_time": float(start_t + 5.0)
            })
        else:
            # Simple text line
            speaker = "Speaker A" if idx % 2 == 0 else "Speaker B"
            utterances.append({
                "speaker": speaker,
                "text": line,
                "start_time": idx * 6.0,
                "end_time": (idx + 1) * 6.0
            })
            
    return utterances

# Helper: Generate summaries using Gemini API
def generate_ai_summary(transcript_text: str):
    default_summary = "This meeting covers product sync and updates. The team discussed UI/UX development status, infrastructure cost-optimization steps, and aligned on the launch schedule."
    default_outline = [
        {"title": "Welcome and Overview", "start_time": 0.0, "end_time": 30.0},
        {"title": "Main Project Roadmap Review", "start_time": 30.0, "end_time": 180.0},
        {"title": "Open Discussion & Q&A", "start_time": 180.0, "end_time": 300.0}
    ]
    default_actions = [
        "Create high-fidelity mockups for dashboard widgets",
        "Investigate database query optimization methods",
        "Set up the staging environment config"
    ]
    
    if not api_key:
        return default_summary, json.dumps(default_outline), default_actions
        
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"""
        You are an expert AI meeting analyst. Analyze the following meeting transcript.
        Generate:
        1. A high-quality paragraph summary.
        2. A list of key action items (extracted tasks).
        3. A structured chronological outline of chapters (e.g. 00:00 - Introduction, 01:30 - Discussion).
        
        Transcript:
        {transcript_text[:12000]}
        
        Output your response strictly as a raw JSON object (with NO markdown formatting, NO backticks, NO ```json wrapping) with the following structure:
        {{
            "summary": "String detailing the summary paragraph",
            "outline": [
                {{"title": "Welcome and Intros", "start_time": 0.0, "end_time": 30.0}},
                {{"title": "Roadmap Alignment", "start_time": 30.0, "end_time": 180.0}}
            ],
            "action_items": [
                "Action item 1",
                "Action item 2"
            ]
        }}
        """
        response = model.generate_content(prompt)
        text_response = response.text.strip()
        
        # Clean up code blocks if LLM still included them
        if text_response.startswith("```"):
            text_response = re.sub(r"^```(?:json)?\n", "", text_response)
            text_response = re.sub(r"\n```$", "", text_response)
            
        data = json.loads(text_response.strip())
        summary = data.get("summary", default_summary)
        outline = json.dumps(data.get("outline", default_outline))
        actions = data.get("action_items", default_actions)
        return summary, outline, actions
    except Exception as e:
        print(f"Gemini API generation error: {e}. Falling back to default mock summary.")
        return default_summary, json.dumps(default_outline), default_actions

# API Endpoints
@app.get("/")
def health_check():
    return {"status": "ok", "service": "Fireflies.ai Clone API"}


@app.head("/")
def health_check_head():
    return Response(status_code=200)


@app.get("/api/meetings", response_model=List[schemas.MeetingResponse])
def read_meetings(
    search: Optional[str] = None,
    participant: Optional[str] = None,
    sort_by: str = "recency",
    db: Session = Depends(models.get_db)
):
    return crud.get_meetings(db, search=search, participant=participant, sort_by=sort_by)

@app.get("/api/meetings/{meeting_id}", response_model=schemas.MeetingDetailResponse)
def read_meeting(meeting_id: int, db: Session = Depends(models.get_db)):
    db_meeting = crud.get_meeting(db, meeting_id=meeting_id)
    if db_meeting is None:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return db_meeting

@app.post("/api/meetings", response_model=schemas.MeetingResponse)
def create_meeting(meeting: schemas.MeetingCreate, db: Session = Depends(models.get_db)):
    return crud.create_meeting(db=db, meeting=meeting)

@app.put("/api/meetings/{meeting_id}", response_model=schemas.MeetingResponse)
def update_meeting(meeting_id: int, meeting_update: schemas.MeetingUpdate, db: Session = Depends(models.get_db)):
    updated = crud.update_meeting(db=db, meeting_id=meeting_id, meeting_update=meeting_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return updated

@app.delete("/api/meetings/{meeting_id}")
def delete_meeting(meeting_id: int, db: Session = Depends(models.get_db)):
    deleted = crud.delete_meeting(db=db, meeting_id=meeting_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return {"detail": "Meeting deleted successfully"}

# Upload transcript file to create a meeting
@app.post("/api/meetings/upload", response_model=schemas.MeetingResponse)
async def upload_meeting_transcript(
    title: str = Form(...),
    participants: str = Form(...),
    date: str = Form(...),
    duration: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(models.get_db)
):
    content = await file.read()
    content_str = content.decode("utf-8")
    
    # Parse utterances
    utterances = parse_transcript(content_str, file.filename)
    if not utterances:
        raise HTTPException(status_code=400, detail="Unable to parse transcript file format.")
        
    # Generate summary & action items
    transcript_text = "\n".join([f"{u['speaker']}: {u['text']}" for u in utterances])
    summary, outline, actions = generate_ai_summary(transcript_text)
    
    # Setup sample audio url
    audio_url = "/static/sample.mp3"
    
    # Create Meeting
    db_meeting = crud.create_meeting(db, schemas.MeetingCreate(
        title=title,
        date=date,
        duration=duration,
        participants=participants,
        summary=summary,
        outline=outline,
        audio_url=audio_url
    ))
    
    # Create Utterances
    for u in utterances:
        crud.create_utterance(db, schemas.TranscriptUtteranceCreate(
            speaker=u["speaker"],
            text=u["text"],
            start_time=u["start_time"],
            end_time=u["end_time"]
        ), meeting_id=db_meeting.id)
        
    # Create Action Items
    for action_text in actions:
        crud.create_action_item(db, schemas.ActionItemCreate(text=action_text), meeting_id=db_meeting.id)
        
    return db_meeting

# Action Items CRUD
@app.post("/api/meetings/{meeting_id}/action-items", response_model=schemas.ActionItemResponse)
def add_action_item(meeting_id: int, action: schemas.ActionItemCreate, db: Session = Depends(models.get_db)):
    db_meeting = crud.get_meeting(db, meeting_id=meeting_id)
    if not db_meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return crud.create_action_item(db=db, action_item=action, meeting_id=meeting_id)

@app.put("/api/action-items/{action_id}", response_model=schemas.ActionItemResponse)
def update_action_item(action_id: int, action_update: schemas.ActionItemUpdate, db: Session = Depends(models.get_db)):
    updated = crud.update_action_item(db=db, action_id=action_id, action_update=action_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Action item not found")
    return updated

@app.delete("/api/action-items/{action_id}")
def delete_action_item(action_id: int, db: Session = Depends(models.get_db)):
    deleted = crud.delete_action_item(db=db, action_id=action_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Action item not found")
    return {"detail": "Action item deleted successfully"}

# Ask Fred chatbot QA
@app.post("/api/meetings/{meeting_id}/ask", response_model=schemas.ChatResponse)
def ask_meeting_question(meeting_id: int, request: schemas.ChatRequest, db: Session = Depends(models.get_db)):
    db_meeting = crud.get_meeting(db, meeting_id=meeting_id)
    if not db_meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    # Build context from transcript
    utterances = db_meeting.transcript
    transcript_text = "\n".join([f"{u.speaker}: {u.text}" for u in utterances])
    
    if api_key:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"""
            You are 'Fred', an intelligent meeting assistant for the Fireflies.ai app.
            Your role is to answer questions about this meeting transcript. Use only the facts from the transcript.
            If the answer cannot be found in the transcript, state that clearly but politely.
            
            Meeting Title: {db_meeting.title}
            Participants: {db_meeting.participants}
            
            Transcript:
            {transcript_text[:12000]}
            
            Question: {request.question}
            
            Response (be concise and professional, use bullet points if helpful):
            """
            response = model.generate_content(prompt)
            return schemas.ChatResponse(answer=response.text.strip())
        except Exception as e:
            print(f"Gemini QA failure: {e}")
            
    # Mock AI response fallback based on regex keyword search
    question_lower = request.question.lower()
    participants_list = [p.strip().lower() for p in db_meeting.participants.split(",")]
    
    # Simple semantic search inside the transcript text
    matches = []
    for u in utterances:
        if any(word in u.text.lower() for word in question_lower.split()):
            matches.append(f"{u.speaker}: \"{u.text}\"")
            
    if matches:
        matched_context = "\n".join(matches[:3])
        return schemas.ChatResponse(
            answer=f"I scanned the meeting transcript. Here is what I found regarding your query:\n\n{matched_context}"
        )
        
    return schemas.ChatResponse(
        answer=f"I couldn't find a direct answer to '{request.question}' in the transcript. However, during the meeting, the participants ({db_meeting.participants}) discussed progress on tasks and key milestones."
    )

if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
