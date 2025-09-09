/**
 * JWT utilities for Cloudflare Workers
 * Using Web Crypto API available in Workers
 */

// Simple JWT implementation for Cloudflare Workers
export async function sign(payload, secret) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(
    base64UrlEncode(JSON.stringify(header)) + '.' +
    base64UrlEncode(JSON.stringify(payload))
  )

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', key, data)
  const signatureBase64 = base64UrlEncode(signature)

  return base64UrlEncode(JSON.stringify(header)) + '.' +
         base64UrlEncode(JSON.stringify(payload)) + '.' +
         signatureBase64
}

export async function verify(token, secret) {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid token format')
  }

  const [headerB64, payloadB64, signatureB64] = parts
  
  const encoder = new TextEncoder()
  const data = encoder.encode(headerB64 + '.' + payloadB64)

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )

  const signature = base64UrlDecode(signatureB64)
  const isValid = await crypto.subtle.verify('HMAC', key, signature, data)

  if (!isValid) {
    throw new Error('Invalid token signature')
  }

  const payload = JSON.parse(base64UrlDecodeString(payloadB64))
  
  // Check expiration if present
  if (payload.exp && Date.now() / 1000 > payload.exp) {
    throw new Error('Token expired')
  }

  return payload
}

function base64UrlEncode(data) {
  let base64
  if (typeof data === 'string') {
    base64 = btoa(data)
  } else {
    // ArrayBuffer
    const bytes = new Uint8Array(data)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    base64 = btoa(binary)
  }
  
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) {
    str += '='
  }
  
  const binary = atob(str)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

function base64UrlDecodeString(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) {
    str += '='
  }
  return atob(str)
}
