-- Migration: Initialize TCSN.io Database
-- Created: 2025-10-01

-- Visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT UNIQUE NOT NULL,
  session_id TEXT NOT NULL,
  generated_name TEXT,
  ip_address TEXT,
  user_agent TEXT,
  browser TEXT,
  os TEXT,
  device_type TEXT,
  location TEXT, -- JSON string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_visitors_visitor_id ON visitors(visitor_id);
CREATE INDEX idx_visitors_session_id ON visitors(session_id);
CREATE INDEX idx_visitors_created_at ON visitors(created_at);

-- Visitor Analytics table
CREATE TABLE IF NOT EXISTS visitor_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  data TEXT, -- JSON string
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_visitor_id ON visitor_analytics(visitor_id);
CREATE INDEX idx_analytics_session_id ON visitor_analytics(session_id);
CREATE INDEX idx_analytics_event_type ON visitor_analytics(event_type);
CREATE INDEX idx_analytics_timestamp ON visitor_analytics(timestamp);

-- Visitor Interactions table
CREATE TABLE IF NOT EXISTS visitor_interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL,
  page TEXT,
  element TEXT,
  data TEXT, -- JSON string
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interactions_visitor_id ON visitor_interactions(visitor_id);
CREATE INDEX idx_interactions_session_id ON visitor_interactions(session_id);
CREATE INDEX idx_interactions_timestamp ON visitor_interactions(timestamp);

-- Short URLs table
CREATE TABLE IF NOT EXISTS short_urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  short_code TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  description TEXT,
  tracking_enabled INTEGER DEFAULT 1,
  clicks INTEGER DEFAULT 0,
  analytics TEXT, -- JSON string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_short_urls_code ON short_urls(short_code);
CREATE INDEX idx_short_urls_created_at ON short_urls(created_at);

-- URL Clicks table
CREATE TABLE IF NOT EXISTS url_clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  short_code TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  location TEXT, -- JSON string
  device TEXT, -- JSON string
  browser TEXT, -- JSON string
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (short_code) REFERENCES short_urls(short_code)
);

CREATE INDEX idx_clicks_short_code ON url_clicks(short_code);
CREATE INDEX idx_clicks_visitor_id ON url_clicks(visitor_id);
CREATE INDEX idx_clicks_timestamp ON url_clicks(timestamp);

-- Users table (for admin)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Insert default admin user
INSERT OR IGNORE INTO users (email, name, role) 
VALUES ('tomas@tcsn.io', 'Tomas', 'admin');

-- Page Visits table (legacy, for migration compatibility)
CREATE TABLE IF NOT EXISTS page_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT NOT NULL,
  page TEXT NOT NULL,
  title TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_page_visits_visitor_id ON page_visits(visitor_id);
CREATE INDEX idx_page_visits_timestamp ON page_visits(timestamp);
