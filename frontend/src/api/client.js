async function parseJsonSafe(response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

const API_BASE_URL = "http://localhost:8080"

export async function apiFetch(path, options) {
  const url = path.startsWith("http://") || path.startsWith("https://")
    ? path
    : `${API_BASE_URL}${path}`

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
    ...options,
  })

  if (res.ok) {
    if (res.status === 204) return null
    return await parseJsonSafe(res)
  }

  const errBody = await parseJsonSafe(res)
  const message =
    errBody?.message ||
    `Request failed with status ${res.status}${res.statusText ? ` ${res.statusText}` : ""}.`

  const error = new Error(message)
  error.status = res.status
  error.body = errBody
  throw error
}

