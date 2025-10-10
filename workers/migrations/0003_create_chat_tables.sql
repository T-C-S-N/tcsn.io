-- Migration: Create chat storage tables
-- Date: 2025-10-10
-- Description: Tables for storing AI chat conversations and messages

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  session_id TEXT,
  last_message_at TEXT,
  message_count INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT NOT NULL,
  session_id TEXT,
  conversation_id TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('user', 'assistant')),
  content TEXT NOT NULL,
  model TEXT,
  usage_tokens INTEGER,
  usage_cost REAL,
  timestamp TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_visitor_id ON conversations(visitor_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at);

CREATE INDEX IF NOT EXISTS idx_chat_messages_visitor_id ON chat_messages(visitor_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_chat_messages_message_type ON chat_messages(message_type);

-- Create view for chat analytics
CREATE VIEW IF NOT EXISTS chat_analytics AS
SELECT 
  visitor_id,
  COUNT(*) as total_messages,
  COUNT(DISTINCT conversation_id) as total_conversations,
  SUM(CASE WHEN message_type = 'user' THEN 1 ELSE 0 END) as user_messages,
  SUM(CASE WHEN message_type = 'assistant' THEN 1 ELSE 0 END) as ai_messages,
  SUM(usage_tokens) as total_tokens,
  MIN(timestamp) as first_message,
  MAX(timestamp) as last_message
FROM chat_messages 
GROUP BY visitor_id;
