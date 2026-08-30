import { NextResponse } from 'next/server';
import { logger, LogLevel } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level') as LogLevel | undefined;
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  const logs = logger.getRecentLogs(limit, level);
  const mem = process.memoryUsage();

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    metrics: {
      uptimeSeconds: Math.floor(process.uptime()),
      heapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
      rssMb: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
      totalRequestsLogged: logs.length,
      errorCount: logs.filter((l) => l.level === 'ERROR').length,
      warnCount: logs.filter((l) => l.level === 'WARN').length,
    },
    logs,
  });
}
