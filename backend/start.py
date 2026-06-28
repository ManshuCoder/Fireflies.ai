import os

import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    print(f"Starting Fireflies API on 0.0.0.0:{port} (PORT env={os.environ.get('PORT', 'not set')})")
    uvicorn.run("app:app", host="0.0.0.0", port=port)
