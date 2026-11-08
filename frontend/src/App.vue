<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Activity, Boxes, RefreshCw, Server, Layers } from '@lucide/vue'
import { getSystemInfo, type SystemInfo } from '@/api/system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card'

const info = ref<SystemInfo | null>(null)
const loading = ref(false)
const error = ref('')
const checkedAt = ref('')
const status = computed(() => loading.value ? '检查中' : info.value ? '已连接' : error.value ? '连接失败' : '待检查')

async function refresh() {
  if (loading.value) return
  loading.value = true
  error.value = ''
  info.value = null
  try {
    info.value = await getSystemInfo()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '请求失败，请稍后重试'
  } finally {
    checkedAt.value = new Date().toLocaleTimeString('zh-CN', { hour12: false })
    loading.value = false
  }
}

onMounted(refresh)
</script>

<template>
  <div class="console-root dark relative min-h-screen bg-background text-foreground">
    <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-80 bg-linear-to-b from-emerald-500/5 to-transparent" />

    <header class="relative border-b border-white/8">
      <div class="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-6">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
            <Boxes aria-hidden="true" class="size-5 text-emerald-300" />
          </div>
          <div>
            <p class="text-sm font-semibold tracking-wide">vLLM Fleet Control</p>
            <p class="mt-0.5 text-xs text-muted-foreground">推理集群管理控制台</p>
          </div>
        </div>
        <Badge variant="outline" class="border-white/15 text-muted-foreground">开发环境</Badge>
      </div>
    </header>

    <main class="relative mx-auto max-w-6xl space-y-8 px-6 py-12 sm:py-16">
      <section>
        <p class="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-emerald-300">Environment overview</p>
        <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">基础环境概览</h1>
        <p class="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">查看应用基础信息与管理 API 的连接状态。当前处于工程初始化阶段。</p>
      </section>

      <section class="grid gap-4 sm:grid-cols-3" aria-label="应用信息" aria-live="polite" :aria-busy="loading">
        <Card class="border-white/10 bg-card/70 shadow-none">
          <CardHeader class="flex flex-row items-center justify-between">
            <CardDescription>管理 API</CardDescription>
            <Activity aria-hidden="true" class="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p class="text-2xl font-semibold" :class="info ? 'text-emerald-300' : 'text-foreground'">{{ status }}</p>
            <p class="mt-2 text-xs text-muted-foreground">依据本次真实请求结果</p>
          </CardContent>
        </Card>

        <Card class="border-white/10 bg-card/70 shadow-none">
          <CardHeader class="flex flex-row items-center justify-between">
            <CardDescription>应用标识</CardDescription>
            <Server aria-hidden="true" class="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p class="break-all font-mono text-lg font-medium">{{ info?.application ?? '—' }}</p>
            <p class="mt-2 text-xs text-muted-foreground">由后端返回</p>
          </CardContent>
        </Card>

        <Card class="border-white/10 bg-card/70 shadow-none">
          <CardHeader class="flex flex-row items-center justify-between">
            <CardDescription>工程阶段</CardDescription>
            <Layers aria-hidden="true" class="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p class="text-2xl font-semibold">{{ info?.stage ?? '—' }}</p>
            <p class="mt-2 text-xs text-muted-foreground">由后端返回</p>
          </CardContent>
        </Card>
      </section>

      <Card class="border-white/10 bg-card/50 shadow-none">
        <CardHeader class="gap-3">
          <CardTitle>连接检查</CardTitle>
          <CardDescription>刷新后端信息，确认前后端基础链路。</CardDescription>
          <CardAction>
            <Button variant="outline" :disabled="loading" @click="refresh">
              <RefreshCw aria-hidden="true" class="size-4" :class="loading ? 'motion-safe:animate-spin' : ''" />
              {{ loading ? '检查中…' : '重新检查' }}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent class="space-y-5" aria-live="polite">
          <Alert v-if="error" variant="destructive" role="alert">
            <AlertTitle>暂时无法获取后端信息</AlertTitle>
            <AlertDescription>{{ error }}。确认后端服务及数据库隧道已启动后，可重新检查。</AlertDescription>
          </Alert>
          <dl class="grid gap-5 rounded-lg border border-white/8 bg-background/40 p-5 text-sm sm:grid-cols-2">
            <div>
              <dt class="text-xs text-muted-foreground">请求接口</dt>
              <dd class="mt-2 break-all font-mono text-xs">GET /api/v1/system/info</dd>
            </div>
            <div>
              <dt class="text-xs text-muted-foreground">最近检查</dt>
              <dd class="mt-2 font-mono text-xs">{{ checkedAt || '—' }}</dd>
            </div>
          </dl>
          <p class="text-xs leading-6 text-muted-foreground">连接成功仅代表管理 API 可达。推理实例的健康与运行状态尚未接入。</p>
        </CardContent>
      </Card>
    </main>
  </div>
</template>

<style scoped>
.console-root {
  font-family: 'Geist', system-ui, -apple-system, 'PingFang SC', sans-serif;
}
</style>
