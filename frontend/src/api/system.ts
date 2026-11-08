export interface SystemInfo {
  application: string
  stage: string
}

export async function getSystemInfo(): Promise<SystemInfo> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch('/api/v1/system/info', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`后端请求失败（HTTP ${response.status}）`)
    }

    const data: unknown = await response.json()
    if (
      typeof data !== 'object' || data === null ||
      !('application' in data) || typeof data.application !== 'string' ||
      !('stage' in data) || typeof data.stage !== 'string'
    ) {
      throw new Error('后端响应格式不符合预期')
    }

    return { application: data.application, stage: data.stage }
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error('请求超时（5 秒），请检查后端是否运行')
    }
    if (error instanceof SyntaxError) {
      throw new Error('后端没有返回有效的 JSON 数据')
    }
    if (error instanceof TypeError) {
      throw new Error('无法连接后端，请检查服务连接')
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}
