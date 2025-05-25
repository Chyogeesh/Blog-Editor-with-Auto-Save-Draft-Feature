# Blog-Editor-with-Auto-Save-Draft-Feature
It is a internship assignment
/blog-editor
  /client (Next.js Frontend)
    /components
      Editor.js
      BlogList.js
      Notification.js
    /pages
      index.js
      api
        auth.js
    /styles
      globals.css
    /utils
      api.js
      auth.js
  /server (Node.js Backend)
    /controllers
      blogController.js
      authController.js
    /models
      Blog.js
      User.js
    /routes
      blogRoutes.js
      authRoutes.js
    /middleware
      auth.js
    config.js
    server.js
  docker-compose.yml
  README.md

# Blog Editor with Auto-Save Draft Feature

A full-stack blog editor application with auto-save functionality built with Next.js (React), Node.js, Express, and MongoDB.

## Features

- Rich text editor for blog content
- Auto-save drafts (after 5 seconds of inactivity and every 30 seconds)
- Save draft and publish functionality
- Separate views for drafts and published blogs
- Edit existing blogs
- Visual notifications for auto-save events

## Technologies Used

### Frontend
- Next.js (React)
- React Quill (Rich text editor)
- Tailwind CSS (Styling)
- Axios (HTTP client)

### Backend
- Node.js
- Express
- MongoDB (with Mongoose)
- JWT Authentication

## Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blog-editor.git
   cd blog-editor
