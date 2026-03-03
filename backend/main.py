from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict

app = FastAPI(title="ArtChain API", description="Backend service for ArtChain Customization App")

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the ArtChain API"}

@app.get("/api/ping")
def ping():
    return {"status": "ok", "service": "ArtChain Backend"}

# Example Endpoint: Mock Data for Customization Steps
@app.get("/api/makers", response_model=List[Dict])
def get_makers():
    """Returns a list of customized makers for Face-ups and Outfits"""
    return [
        {"id": "f1", "name": "Kiki", "role": "Face-up Artist", "rating": 4.9, "jobs": 120},
        {"id": "o1", "name": "Lumina", "role": "Tailor (娃衣)", "rating": 5.0, "jobs": 84},
        {"id": "c1", "name": "Clay Dreams", "role": "Clay Sculptor", "rating": 4.8, "jobs": 45}
    ]

# Mock Community Data
community_posts = [
    {
        "id": 1,
        "author": "Amee",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Amee",
        "content": "终于收到了这款 BJD 的素体！树脂质感绝了，正在准备改妆~",
        "image": "/images/body_resin.png",
        "likes": 24,
        "time": "2小时前"
    },
    {
        "id": 2,
        "author": "Yuki_Handmade",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki",
        "content": "分享一个刚钩织完的小猫，是不是超级可爱？",
        "image": "/images/category_crochet.png",
        "likes": 56,
        "time": "5小时前"
    }
]

@app.get("/api/posts")
def get_posts():
    return community_posts

@app.post("/api/posts")
def create_post(post: dict):
    new_id = len(community_posts) + 1
    new_post = {
        "id": new_id,
        "author": "Anonymous",
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={new_id}",
        "likes": 0,
        "time": "刚刚",
        **post
    }
    community_posts.insert(0, new_post)
    return new_post

# Mock User Profile Data
user_profile = {
    "username": "Sakura_K",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sakura",
    "uid": "AC-88293",
    "level": "Lv.7 资深藏家",
    "bio": "热爱一切手工定制，BJD 改妆中... 欢迎交流~",
    "stats": {
        "posts": 12,
        "following": 45,
        "fans": 128,
        "likes": 1024
    }
}

@app.get("/api/user/profile")
def get_user_profile():
    return user_profile

@app.get("/api/user/posts")
def get_user_posts():
    # Filter community posts by author (simulated)
    return [p for p in community_posts if p["author"] == "Sakura_K" or p["author"] == "Anonymous"]

@app.get("/api/user/orders")
def get_user_orders():
    return [
        {
            "id": "ORD-102", 
            "name": "定制粘土人 - 萤火", 
            "status": "制作中", 
            "date": "2024-03-01", 
            "image": "/images/cotton_doll.png",
            "description": "基于《原神》萤火角色设计的 Q 版粘土人，包含 3 个替换脸型。",
            "steps": [
                {"name": "需求确认", "status": "completed", "time": "2024-03-01"},
                {"name": "原型建模", "status": "completed", "time": "2024-03-05"},
                {"name": "3D 打印", "status": "current", "time": "进行中"},
                {"name": "精细打磨", "status": "pending", "time": "-"},
                {"name": "上色涂装", "status": "pending", "time": "-"}
            ]
        },
        {
            "id": "ORD-098", 
            "name": "BJD 妆面定制", 
            "status": "已完成", 
            "date": "2024-02-15", 
            "image": "/images/faceup_kiki.png",
            "description": "森林系精灵风格妆面，使用进口消光漆，包含睫毛张贴。",
            "steps": [
                {"name": "妆面设计", "status": "completed", "time": "2024-02-10"},
                {"name": "底色涂装", "status": "completed", "time": "2024-02-12"},
                {"name": "细节刻画", "status": "completed", "time": "2024-02-14"},
                {"name": "成品定妆", "status": "completed", "time": "2024-02-15"}
            ],
            "result_images": ["/images/faceup_kiki.png", "/images/category_crochet.png"]
        }
    ]

@app.put("/api/user/profile")
def update_user_profile(profile_data: dict):
    global user_profile
    user_profile.update(profile_data)
    return user_profile
