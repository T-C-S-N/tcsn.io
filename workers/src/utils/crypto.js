/**
 * Crypto utilities for Cloudflare Workers
 * Using Web Crypto API for password hashing
 */

export async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  
  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16))
  
  // Import the password as a key
  const key = await crypto.subtle.importKey(
    'raw',
    data,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )
  
  // Derive the hash
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    256
  )
  
  // Combine salt and hash
  const combined = new Uint8Array(salt.length + hashBuffer.byteLength)
  combined.set(salt)
  combined.set(new Uint8Array(hashBuffer), salt.length)
  
  // Convert to base64
  return arrayBufferToBase64(combined.buffer)
}

export async function verifyPassword(password, hashedPassword) {
  try {
    const encoder = new TextEncoder()
    const passwordData = encoder.encode(password)
    
    // Decode the stored hash
    const combined = base64ToArrayBuffer(hashedPassword)
    const salt = combined.slice(0, 16)
    const storedHash = combined.slice(16)
    
    // Import the password as a key
    const key = await crypto.subtle.importKey(
      'raw',
      passwordData,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    )
    
    // Derive the hash with the same salt
    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      key,
      256
    )
    
    // Compare the hashes
    const newHash = new Uint8Array(hashBuffer)
    const storedHashArray = new Uint8Array(storedHash)
    
    if (newHash.length !== storedHashArray.length) {
      return false
    }
    
    for (let i = 0; i < newHash.length; i++) {
      if (newHash[i] !== storedHashArray[i]) {
        return false
      }
    }
    
    return true
  } catch (error) {
    console.error('Password verification error:', error)
    return false
  }
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}
