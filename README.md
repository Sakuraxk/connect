# DollCraft 娃娃定制与周边聚合平台

DollCraft 是一款专为 BJD娃娃、棉花娃娃、黏土人、3D打印周边以及各种手作（如钩织、扭扭棒）设计的全链路定制与服务聚合平台。

## 🌟 核心理念与目标

当前的各种定制娃圈（如 BJD 组装、棉花娃娃私生等）面临着诸如：寻找各部件卖家繁琐、拼装排单期长（找猫娘、妆娘等）、进度不透明等痛点。

DollCraft 旨在实现：
- **定制透明化**：从选择素体 -> 头发 -> 妆娘面妆 -> 娃衣 -> 组装 -> 发货，打造一站式服务的流程式体验。
- **金额与工期透明**：在每一步选择不同的合作创作者时，动态计算并展示各项价格与预计等候工期。
- **创作者协同共创**：圈内创作者（卖家）可以入驻并共同合作完成一个订单，OC（Original Character）圈与定制圈可以无缝联合讨论。

## 🛠️ 技术栈 (Tech Stack)

本项目采用现代化的前后端分离架构：
- **前端 (Frontend)**: React 18 + Vite + TypeScript
- **前端样式 (Styling)**: 原生全局 CSS (实现 Glassmorphism 毛玻璃质感与微动画)，支持多主题切换（梦幻粉紫、深色模式、清新极简）
- **路由 (Routing)**: React Router DOM
- **图标 (Icons)**: Lucide React
- **后端 (Backend)**: FastAPI (Python) - 高性能的异步 RESTful API 框架

## 📁 项目结构 (Project Structure)

```
connect/
├── backend/                # FastAPI 后端服务目录
│   ├── main.py             # 后端应用入口点
│   └── requirements.txt    # Python 依赖包清单
├── frontend/               # React + Vite 前端目录
│   ├── public/             # 前端静态资源 (图片等)
│   ├── src/                # 前端 React 源代码
│   │   ├── components/     # 可复用 UI 组件
│   │   ├── pages/          # 各个页面级组件
│   │   ├── App.tsx         # 应用主入口层与路由配置
│   │   ├── main.tsx        # React 挂载点
│   │   └── index.css       # 全局样式、设计系统与主题变量
│   ├── index.html          # 前端页面模板
│   ├── package.json        # 前端 Node.js 依赖管理
│   └── vite.config.ts      # Vite 构建配置
```

## 🚀 运行项目 (How to Run)

### 1. 启动前端页面 (Frontend)

请确保你的电脑上安装了 [Node.js](https://nodejs.org/)。

```bash
# 在项目根目录下打开终端，进入前端目录
cd frontend

# 安装前端依赖
npm install

# 启动本地开发服务器
npm run dev
```
然后可以在浏览器中访问终端输出的地址 (通常是 `http://localhost:5173`)。

### 2. 启动后端应用 (Backend)

请确保你的电脑上安装了 Python 3.8 或更高版本。

```bash
# 进入后端目录
cd backend

# (推荐) 创建虚拟环境
python -m venv venv
# 激活虚拟环境 (Windows)
.\venv\Scripts\activate
# 激活虚拟环境 (Mac/Linux)
# source venv/bin/activate

# 安装后端依赖
pip install -r requirements.txt

# 启动 FastAPI 开发服务器
uvicorn main:app --reload
```
后端启动后，可以在浏览器中访问 `http://127.0.0.1:8000/docs` 查看自动生成的 Swagger API 交互式接口文档。
