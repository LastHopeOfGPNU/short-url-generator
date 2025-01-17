from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .short_url import ShortURLGenerator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

short_url_generator = ShortURLGenerator()

class UrlItem(BaseModel):
    url: str

@app.post("/short_it")
async def generate_short_url(item: UrlItem):
    short_url = short_url_generator.generate_short_url(item.url)
    return {"short_url": short_url}

@app.get("/recover_it")
async def recover_original_url(short_url: str):
    original_url = short_url_generator.get_original_url(short_url)
    if original_url:
        return {"original_url": original_url}
    else:
        raise HTTPException(status_code=404, detail="Short URL not found")

@app.get("/records")
async def get_records():
    records = short_url_generator.get_all_short_urls()
    return records

@app.on_event("shutdown")
async def shutdown_event():
    short_url_generator.close()