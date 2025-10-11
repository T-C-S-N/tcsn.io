#!/usr/bin/env node

/**
 * Upload static assets to Cloudflare KV for the worker
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DIST_DIR = path.join(__dirname, '../dist')

async function uploadToKV(filePath, key, namespace = 'ASSETS') {
  try {
    const command = `wrangler kv:key put "${key}" --path="${filePath}" --binding=${namespace}`
    console.log(`Uploading ${key}...`)
    execSync(command, { cwd: __dirname })
    console.log(`✓ Uploaded ${key}`)
  } catch (error) {
    console.error(`✗ Failed to upload ${key}:`, error.message)
  }
}

async function uploadDirectory(dir, baseKey = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const key = path.join(baseKey, entry.name).replace(/\\/g, '/')
    
    if (entry.isDirectory()) {
      await uploadDirectory(fullPath, key)
    } else {
      await uploadToKV(fullPath, '/' + key)
    }
  }
}

async function main() {
  try {
    console.log('Uploading static assets to Cloudflare KV...')
    
    // Check if wrangler is available
    try {
      execSync('wrangler --version', { stdio: 'ignore' })
    } catch (error) {
      console.error('Error: wrangler CLI not found. Please install it first.')
      process.exit(1)
    }
    
    // Upload all files from dist directory
    await uploadDirectory(DIST_DIR)
    
    console.log('✓ All assets uploaded successfully!')
    
  } catch (error) {
    console.error('Upload failed:', error)
    process.exit(1)
  }
}

main()
