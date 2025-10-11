-- Database schema for TCSN.io Cloudflare D1 database

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  technologies TEXT, -- JSON array
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Page visits table for analytics
CREATE TABLE IF NOT EXISTS page_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  timestamp TEXT NOT NULL,
  session_id TEXT,
  visitor_id TEXT NOT NULL,
  country TEXT,
  city TEXT,
  created_at TEXT NOT NULL
);

-- Visitors table for tracking unique visitors
CREATE TABLE IF NOT EXISTS visitors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT UNIQUE NOT NULL,
  name TEXT,
  browser_data TEXT, -- JSON string containing browser information
  visit_count INTEGER DEFAULT 1,
  is_returning INTEGER DEFAULT 0, -- 0 for false, 1 for true
  first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
  total_time_spent INTEGER DEFAULT 0, -- in seconds
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table for AI conversations
CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  conversation_id TEXT NOT NULL,
  message_type TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  model TEXT,
  usage_tokens INTEGER,
  usage_cost REAL,
  timestamp TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Visitor interactions table
CREATE TABLE IF NOT EXISTS visitor_interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL, -- 'click', 'scroll', 'hover', etc.
  element TEXT,
  page TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  data TEXT, -- JSON data for additional context
  created_at TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_visits_created_at ON page_visits(created_at);
CREATE INDEX IF NOT EXISTS idx_page_visits_visitor_id ON page_visits(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_page ON page_visits(page);
CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id ON visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_visitor_interactions_visitor_id ON visitor_interactions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_interactions_created_at ON visitor_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_visitor_id ON chat_messages(visitor_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
