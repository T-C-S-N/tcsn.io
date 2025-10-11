#!/usr/bin/env node

/**
 * Build script to bundle frontend assets for Cloudflare Worker
 * This script copies the built frontend assets into the worker's static directory
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DIST_DIR = path.join(__dirname, '../dist')
const STATIC_DIR = path.join(__dirname, 'src/static')

async function copyDirectory(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true })
    const entries = await fs.readdir(src, { withFileTypes: true })

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name)
      const destPath = path.join(dest, entry.name)

      if (entry.isDirectory()) {
        await copyDirectory(srcPath, destPath)
      } else {
        await fs.copyFile(srcPath, destPath)
      }
    }
  } catch (error) {
    console.error(`Error copying ${src} to ${dest}:`, error)
    throw error
  }
}

async function generateStaticAssetsModule() {
  const assetsMap = new Map()
  
  async function scanDirectory(dir, baseDir = '') {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      const relativePath = path.join(baseDir, entry.name).replace(/\\/g, '/')
      
      if (entry.isDirectory()) {
        await scanDirectory(fullPath, relativePath)
      } else {
        try {
          const content = await fs.readFile(fullPath)
          const base64Content = content.toString('base64')
          assetsMap.set('/' + relativePath, {
            content: base64Content,
            contentType: getContentType(entry.name),
            size: content.length
          })
        } catch (error) {
          console.error(`Error reading file ${fullPath}:`, error)
        }
      }
    }
  }
  
  await scanDirectory(STATIC_DIR)
  
  // Generate the module
  const moduleContent = `// Auto-generated static assets
export const staticAssets = new Map(${JSON.stringify(Array.from(assetsMap.entries()), null, 2)});

export function getContentType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase()
  
  const mimeTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'txt': 'text/plain'
  }
  
  return mimeTypes[ext] || 'application/octet-stream'
}
`
  
  await fs.writeFile(path.join(__dirname, 'src/utils/staticAssets.js'), moduleContent)
  console.log(`Generated static assets module with ${assetsMap.size} files`)
}

function getContentType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase()
  
  const mimeTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'txt': 'text/plain'
  }
  
  return mimeTypes[ext] || 'application/octet-stream'
}

async function main() {
  try {
    console.log('Building frontend assets for Cloudflare Worker...')
    
    // Clean and create static directory
    try {
      await fs.rm(STATIC_DIR, { recursive: true, force: true })
    } catch (error) {
      // Directory might not exist, that's fine
    }
    
    await fs.mkdir(STATIC_DIR, { recursive: true })
    
    // Copy frontend assets
    console.log('Copying frontend assets...')
    await copyDirectory(DIST_DIR, STATIC_DIR)
    
    // Generate static assets module
    console.log('Generating static assets module...')
    await generateStaticAssetsModule()
    
    console.log('Frontend build complete!')
    
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

main()
