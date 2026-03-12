async function parseJsonSafe(response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

export async function apiFetch(path, options) {
  const res = await fetch(path, {
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

