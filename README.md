# ArtChain - 艺术定制与创意协作平台

ArtChain 是一款专为 BJD 娃娃、棉花娃娃、手办、3D 打印周边以及各类手作（钩织、扭扭棒等）设计的全链路定制与服务协作平台。我们致力于打破定制圈的信息鸿沟，为创作者与玩家搭建透明、高效的连接桥梁。

## 🌟 核心理念

在传统的定制圈（如 BJD 组装、棉花娃娃私生等）中，玩家常面临寻找卖家繁琐、工期不透明、进度反馈滞后等痛点。ArtChain 旨在通过数字化手段解决这些问题：

-   **全链路透明化**：从素体选购、面妆设计、服饰定制到最终组装发货，提供一站式的流程式追踪体验。
-   **工期与价格看板**：实时动态计算各项服务的价格与预计等候工期，让每笔开销与等待都清晰可控。
-   **创作者协同工作流**：支持多位创作者（妆师、缝纫师、原型师等）跨地域协作，共同完成复杂订单，实现真正的“共创”。
-   **数字化 OC 资产管理**：为您的原创角色（Original Character）提供从虚拟设计到实物落地的全生命周期管理。

## 🎨 品牌视野与标识 (Brand Identity)

ArtChain 的全新核心 Logo 采用纯手工编写的 **SVG 纯几何排布**（三个相交的圆环），不仅 100% 滤除了任何文字干扰，更寄托了深刻的平台寓意：

- **三位一体的共创生态 (Trinity Ecosystem)**：三个平等的圆环分别代表了**玩家（需求方）**、**创作者（手作师/原型师等）**以及 **ArtChain 平台连接器**。三者的融合构成了完整的定制闭环。
- **连接与信任的“链结” (Connection & Chain)**：圆形在几何学中象征着完美与包容，而它们彼此交叠、互相渗透的形态，正是对“Chain（链结）”最直观的视觉化呈现——意味着打破信息的孤岛和信任的壁垒。
- **紫色的创造力基调 (Creative Purple)**：采用不同明度与透明度的基调紫（#A855F7, #C084FC, #D8B4FE），紫色自古便象征着艺术、独立、神秘与无尽的想象力，完美契合 BJD、棉花娃娃、手办等具有极高个性和想象空间的二次元/手作定制属性。
- **纯粹与极简 (Purity & Minimalism)**：舍弃所有喧宾夺主的元素，仅以纯粹的几何印记发声，象征着手作定制对极致美学的追求与回归原初的匠心。

## 🛠️ 技术架构

本项目采用现代化、高性能的前后端分离方案：

-   **前端 (Frontend)**: React 19 + Vite + TypeScript
    -   **设计系统**: 基于原生 CSS 实现的 Glassmorphism（毛玻璃）设计风格，内置三套精美主题。
    -   **交互体验**: 支持微动画、自适应布局。
    -   **工具库**: Lucide React (图标), React Router (导航)。
-   **后端 (Backend)**: FastAPI (Python)
    -   **性能**: 基于异步架构的极速 RESTful API 响应。
    -   **文档**: 自动生成标准的 OpenAPI (Swagger) 交互式文档。

## 📁 项目结构

```
connect/
├── backend/                # FastAPI 后端服务
│   ├── main.py             # API 入口与路由定义
│   └── requirements.txt    # Python 依赖包
├── frontend/               # React + Vite 前端应用
│   ├── src/
│   │   ├── components/     # 全局复用 UI 组件 (Navbar等)
│   │   ├── pages/          # 业务逻辑页面 (Studio, Home等)
│   │   ├── App.tsx         # 核心路由与主题控制
│   │   └── index.css       # 全级设计系统与样式变量
│   ├── public/             # 静态资源 (图片、图标)
│   └── index.html          # 应用入口模板
```

## 🚀 快速启动

### 1. 前端环境

1. 进入前端目录：`cd frontend`
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`
4. 访问：`http://localhost:5173`

### 2. 后端环境

1. 进入后端目录：`cd backend`
2. 创建并激活虚拟环境：
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate # Mac/Linux
   ```
3. 安装依赖：`pip install -r requirements.txt`
4. 启动后端：`uvicorn main:app --reload`
5. API 文档：`http://127.0.0.1:8000/docs`

---

*ArtChain: Connect creativity, realize dreams.*
