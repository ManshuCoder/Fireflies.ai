import json
import os
import wave
from datetime import datetime, timedelta
import database as models
from sqlalchemy.orm import Session

def create_silent_audio():
    os.makedirs("static", exist_ok=True)
    file_path = "static/sample.mp3"  # Standard naming for simplicity
    
    # We will write a tiny valid WAV file. Browsers can play WAV files even if served as MP3.
    # 1 second of silence, 8000Hz, mono, 8-bit
    num_samples = 8000
    try:
        with wave.open(file_path, "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(1)
            w.setframerate(8000)
            # Write 8000 bytes of silence (128 for 8-bit unsigned PCM)
            w.writeframes(bytes([128] * num_samples))
        print("Created mock audio file at static/sample.mp3")
    except Exception as e:
        print(f"Error creating audio file: {e}")

def seed_database():
    models.init_db()
    db = models.SessionLocal()
    
    # Check if database is already seeded
    if db.query(models.Meeting).count() > 0:
        print("Database already contains data. Skipping seeding.")
        db.close()
        return

    print("Seeding database...")
    create_silent_audio()
    
    # --- MEETING 1: Weekly Product Sync ---
    meeting1_date = (datetime.utcnow() - timedelta(days=2)).isoformat()
    meeting1 = models.Meeting(
        title="Weekly Product Sync & UI Design Review",
        date=meeting1_date,
        duration=300, # 5 minutes
        participants="John (Product Manager), Sarah (Designer), Mike (Developer)",
        summary="The team reviewed the progress of the dashboard redesign. Sarah showcased the new Figma layout, focusing on the dark-mode aesthetic and the collapsed sidebar navigation. Mike mentioned that the API endpoint integrations for AI Skills and Voice Agents are 80% complete. John highlighted the launch timeline and asked the team to prioritize fixing responsive CSS issues before next Tuesday's QA review.",
        outline=json.dumps([
            {"title": "Welcome & Overview", "start_time": 0.0, "end_time": 45.0},
            {"title": "UI/UX Design Show & Tell", "start_time": 45.0, "end_time": 150.0},
            {"title": "Backend API Integrations", "start_time": 150.0, "end_time": 240.0},
            {"title": "QA Timelines & Action Items", "start_time": 240.0, "end_time": 300.0}
        ]),
        audio_url="/static/sample.mp3"
    )
    db.add(meeting1)
    db.flush() # Populate meeting1.id
    
    m1_utterances = [
        ("John (Product Manager)", "Hey everyone, let's get started. Welcome to our weekly product sync. Sarah, do you want to kick things off by showing the UI mockups?", 0.0, 15.0),
        ("Sarah (Designer)", "Sure John! Let me share my screen. I've finished the main dashboard redesign and the layout for the integrations page. I went with a clean, high-contrast dark theme with violet accents.", 15.5, 38.0),
        ("John (Product Manager)", "Wow, that looks extremely clean. The navigation sidebar matches our branding perfectly. What do you think, Mike?", 38.5, 48.0),
        ("Mike (Developer)", "I really like the new glassmorphism panels. It gives it a premium feel. Sarah, did you include the settings panel in these frames?", 48.5, 62.0),
        ("Sarah (Designer)", "Yes, if you click settings at the bottom left, it opens a overlay modal. I've also aligned the Voice Agents cards so they expand nicely on smaller mobile viewports.", 62.5, 80.0),
        ("John (Product Manager)", "Awesome. How is the backend work going for the AI Skills page and database, Mike?", 80.5, 95.0),
        ("Mike (Developer)", "The SQLite database schema is fully defined and the FastAPI endpoints are working. I need to finish testing the Gemini QA chatbot endpoint, which is at about eighty percent completion.", 95.5, 120.0),
        ("John (Product Manager)", "Great to hear. Can we make sure the AskFred search checks are case insensitive and support fuzzy matching?", 120.5, 135.0),
        ("Mike (Developer)", "Absolutely, I'll add that search optimization. I'll also finish the endpoint for exporting summaries in Markdown format.", 135.5, 152.0),
        ("Sarah (Designer)", "I'll upload the latest SVG assets to our shared asset folder so you can pull them into the Next.js project today.", 152.5, 170.0),
        ("John (Product Manager)", "Perfect. Let's make sure we have a working build by Monday. Our target for QA review is next Tuesday. Any other concerns?", 170.5, 195.0),
        ("Mike (Developer)", "No major concerns from me. I'll coordinate with Sarah to double check the CSS styling properties match the mocks.", 195.5, 215.0),
        ("Sarah (Designer)", "Sounds good! I'll be available for frontend alignment tomorrow morning.", 215.5, 235.0),
        ("John (Product Manager)", "Excellent work, team. Let's touch base again on Monday morning. Enjoy the rest of your week!", 235.5, 255.0),
        ("Mike (Developer)", "Thanks John, talk to you later.", 255.5, 275.0),
        ("Sarah (Designer)", "Bye everyone!", 275.5, 300.0)
    ]
    
    for speaker, text, start, end in m1_utterances:
        db.add(models.TranscriptUtterance(
            meeting_id=meeting1.id,
            speaker=speaker,
            text=text,
            start_time=start,
            end_time=end
        ))
        
    m1_actions = [
        "Upload the latest Figma SVG assets to the project assets folder",
        "Optimize the AskFred chatbot search to be case-insensitive",
        "Add markdown export functionality to the API",
        "Complete responsive CSS adjustments for mobile devices"
    ]
    for action in m1_actions:
        db.add(models.ActionItem(
            meeting_id=meeting1.id,
            text=action,
            completed=False
        ))

    # --- MEETING 2: Customer Success Sync ---
    meeting2_date = (datetime.utcnow() - timedelta(days=5)).isoformat()
    meeting2 = models.Meeting(
        title="Acme Corp Onboarding & Integrations Support",
        date=meeting2_date,
        duration=180,
        participants="Alice (Sales), Bob (Customer Success), Charlie (Acme Rep)",
        summary="Alice and Bob met with Charlie from Acme Corp to walk through the onboarding process. Charlie expressed enthusiasm for the Slack integration features. Bob explained how to connect their accounts and configure webhook notifications. They scheduled a follow-up meeting for next week to verify data ingestion rates.",
        outline=json.dumps([
            {"title": "Introduction & Onboarding Status", "start_time": 0.0, "end_time": 40.0},
            {"title": "Slack Integration Demo", "start_time": 40.0, "end_time": 120.0},
            {"title": "Next Steps & Follow-up", "start_time": 120.0, "end_time": 180.0}
        ]),
        audio_url="/static/sample.mp3"
    )
    db.add(meeting2)
    db.flush()
    
    m2_utterances = [
        ("Alice (Sales)", "Hi Charlie, thanks for jumping on. We wanted to make sure your onboarding is going smoothly.", 0.0, 15.0),
        ("Charlie (Acme Rep)", "Hey Alice, yes, so far so good. We are really interested in setting up the Slack integration. We want meeting summaries pushed directly to our #product-updates channel.", 15.5, 45.0),
        ("Bob (Customer Success)", "That is quite simple. If you navigate to the Integrations page in the app, you will find the Slack card right at the top. Just click Connect, authorize it, and you can map channels.", 45.5, 90.0),
        ("Charlie (Acme Rep)", "Perfect. Can we filter which meetings get pushed, or does it push every meeting?", 90.5, 110.0),
        ("Bob (Customer Success)", "You can configure filters inside the settings. You can set it to only push meetings tagged 'external' or those with specific keywords.", 110.5, 140.0),
        ("Charlie (Acme Rep)", "Great. Let me test this out today. I will let you know if we run into any issues.", 140.5, 160.0),
        ("Alice (Sales)", "Sounds like a plan. Let's catch up next week to see how the connection is holding up.", 160.5, 180.0)
    ]
    for speaker, text, start, end in m2_utterances:
        db.add(models.TranscriptUtterance(
            meeting_id=meeting2.id,
            speaker=speaker,
            text=text,
            start_time=start,
            end_time=end
        ))
    m2_actions = [
        "Configure Slack webhook connection rules for #product-updates",
        "Send API integration guide for CRM sync to Charlie",
        "Set up follow-up check-in meeting for next Thursday"
    ]
    for action in m2_actions:
        db.add(models.ActionItem(
            meeting_id=meeting2.id,
            text=action,
            completed=False
        ))

    db.commit()
    print("Database successfully seeded.")
    db.close()

if __name__ == "__main__":
    seed_database()
