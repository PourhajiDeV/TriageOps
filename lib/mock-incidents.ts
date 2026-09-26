import { Incident } from './types';

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'inc-9041',
    service: 'auth-billing-worker',
    environment: 'production',
    severity: 'critical',
    timestamp: '2026-09-26T08:14:02.112Z',
    errorMessage: 'StripeSignatureVerificationError: No signatures found matching the expected signature for payload.',
    errorCode: 'ERR_STRIPE_SIG_MISMATCH',
    durationMs: 148,
    status: 'triaged',
    rawPayload: `[2026-09-26T08:14:02.112Z] ERROR (auth-billing-worker): Webhook verification failed
StripeSignatureVerificationError: No signatures found matching the expected signature for payload.
    at Object.verifySignature (/app/node_modules/stripe/lib/Webhooks.js:68:15)
    at verifyWebhookPayload (/app/src/handlers/webhook.ts:42:19)
    at async handlePostRequest (/app/src/server.ts:104:7)
    at async Runtime.processRequest (/app/node_modules/node-framework/core.js:210:12)
Context:
  headers: {
    "stripe-signature": "t=1758874440,v1=9c41f71a7d65bb49",
    "content-type": "application/json"
  }
  body_type: "ParsedJSON" (Expected "RawBuffer")`,
    hypothesis:
      'The webhook router uses body-parser with automatic JSON parsing enabled prior to signature evaluation. Stripe requires the unmodified raw UTF-8 buffer to verify the cryptographic HMAC hash.',
    stackFrames: [
      { file: 'src/handlers/webhook.ts', line: 42, column: 19, function: 'verifyWebhookPayload', isInternal: false },
      { file: 'src/server.ts', line: 104, column: 7, function: 'handlePostRequest', isInternal: false },
      { file: 'node_modules/stripe/lib/Webhooks.js', line: 68, column: 15, function: 'verifySignature', isInternal: true },
      { file: 'node_modules/node-framework/core.js', line: 210, column: 12, function: 'processRequest', isInternal: true },
    ],
    patch: {
      targetFile: 'src/handlers/webhook.ts',
      description: 'Switch endpoint to consume raw body buffer instead of pre-parsed JSON object.',
      diff: [
        { type: 'context', content: 'export async function verifyWebhookPayload(req: Request) {', oldLineNumber: 40, newLineNumber: 40 },
        { type: 'delete', content: '-   const payload = JSON.stringify(req.body);', oldLineNumber: 41 },
        { type: 'delete', content: '-   const sig = req.headers["stripe-signature"] as string;', oldLineNumber: 42 },
        { type: 'add', content: '+   const payload = await req.arrayBuffer();', newLineNumber: 41 },
        { type: 'add', content: '+   const sig = req.headers.get("stripe-signature");', newLineNumber: 42 },
        { type: 'add', content: '+   if (!sig) throw new Error("Missing signature header");', newLineNumber: 43 },
        { type: 'context', content: '    return stripe.webhooks.constructEvent(', oldLineNumber: 43, newLineNumber: 44 },
        { type: 'delete', content: '-     payload,', oldLineNumber: 44 },
        { type: 'add', content: '+     Buffer.from(payload),', newLineNumber: 45 },
        { type: 'context', content: '      sig,', oldLineNumber: 45, newLineNumber: 46 },
        { type: 'context', content: '      process.env.STRIPE_WEBHOOK_SECRET!', oldLineNumber: 46, newLineNumber: 47 },
        { type: 'context', content: '    );', oldLineNumber: 47, newLineNumber: 48 },
        { type: 'context', content: '}', oldLineNumber: 48, newLineNumber: 49 },
      ],
    },
    preventionChecklist: [
      'Mount express.raw({ type: "application/json" }) exclusively for the /api/stripe/webhook route.',
      'Add an integration test asserting rejection when body-parser executes before signature check.',
      'Ensure STRIPE_WEBHOOK_SECRET rotates across deployments without caching stale secrets.',
    ],
  },
  {
    id: 'inc-9042',
    service: 'core-database-gateway',
    environment: 'production',
    severity: 'critical',
    timestamp: '2026-09-26T07:22:18.004Z',
    errorMessage: 'PostgresPoolExhausted: Timeout waiting for free client connection after 10000ms',
    errorCode: 'PG_MAX_CLIENTS_EXCEEDED',
    durationMs: 210,
    status: 'resolved',
    rawPayload: `[2026-09-26T07:22:18.004Z] FATAL (core-database-gateway): Connection pool acquisition failed
Error: Timeout waiting for free client connection after 10000ms
    at Pool.acquire (/app/node_modules/pg-pool/index.js:312:19)
    at runTransaction (/app/src/db/transaction.ts:54:21)
    at async fetchAccountData (/app/src/services/account.ts:18:3)
Active Clients: 20/20 | Waiting Queue: 89 | Max Lifetime: 30000ms`,
    hypothesis:
      'Database client connection is acquired inside runTransaction without an absolute finally block release guard when an unhandled Promise rejection occurs during read-replicas switch.',
    stackFrames: [
      { file: 'src/db/transaction.ts', line: 54, column: 21, function: 'runTransaction', isInternal: false },
      { file: 'src/services/account.ts', line: 18, column: 3, function: 'fetchAccountData', isInternal: false },
      { file: 'node_modules/pg-pool/index.js', line: 312, column: 19, function: 'acquire', isInternal: true },
    ],
    patch: {
      targetFile: 'src/db/transaction.ts',
      description: 'Guarantee client checkout is wrapped in try/finally to return connections back to pool.',
      diff: [
        { type: 'context', content: 'export async function runTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {', oldLineNumber: 52, newLineNumber: 52 },
        { type: 'context', content: '    const client = await pool.connect();', oldLineNumber: 53, newLineNumber: 53 },
        { type: 'add', content: '+   try {', newLineNumber: 54 },
        { type: 'context', content: '        await client.query("BEGIN");', oldLineNumber: 54, newLineNumber: 55 },
        { type: 'context', content: '        const result = await fn(client);', oldLineNumber: 55, newLineNumber: 56 },
        { type: 'context', content: '        await client.query("COMMIT");', oldLineNumber: 56, newLineNumber: 57 },
        { type: 'context', content: '        return result;', oldLineNumber: 57, newLineNumber: 58 },
        { type: 'add', content: '+   } catch (error) {', newLineNumber: 59 },
        { type: 'add', content: '+       await client.query("ROLLBACK");', newLineNumber: 60 },
        { type: 'add', content: '+       throw error;', newLineNumber: 61 },
        { type: 'add', content: '+   } finally {', newLineNumber: 62 },
        { type: 'add', content: '+       client.release();', newLineNumber: 63 },
        { type: 'delete', content: '-   client.release();', oldLineNumber: 58 },
        { type: 'context', content: '    }', oldLineNumber: 59, newLineNumber: 64 },
        { type: 'context', content: '}', oldLineNumber: 60, newLineNumber: 65 },
      ],
    },
    preventionChecklist: [
      'Wrap all pool.connect() acquisitions in try/finally blocks.',
      'Configure idleTimeoutMillis down to 5000ms to clear leaked zombie connections.',
      'Setup alert when Pool.waitingCount exceeds 5 for longer than 15s.',
    ],
  },
  {
    id: 'inc-9043',
    service: 'client-edge-renderer',
    environment: 'canary',
    severity: 'degraded',
    timestamp: '2026-09-26T06:40:12.750Z',
    errorMessage: 'Error: Hydration failed because the initial UI does not match what was rendered on the server.',
    errorCode: 'REACT_HYDRATION_MISMATCH',
    durationMs: 82,
    status: 'triaged',
    rawPayload: `[2026-09-26T06:40:12.750Z] WARN (client-edge-renderer): React Hydration Collision
Warning: Text content did not match. Server: "2026-09-26T06:40:12Z" Client: "9/26/2026, 8:40:12 AM"
    at span
    at UserLastActive (/app/src/components/UserHeader.tsx:14:11)
    at div
    at Layout (/app/src/app/dashboard/layout.tsx:28:7)`,
    hypothesis:
      'Direct invocation of Intl or toLocaleString() inside the render phase causes discrepancies between the UTC container timezone and user browser locale.',
    stackFrames: [
      { file: 'src/components/UserHeader.tsx', line: 14, column: 11, function: 'UserLastActive', isInternal: false },
      { file: 'src/app/dashboard/layout.tsx', line: 28, column: 7, function: 'Layout', isInternal: false },
    ],
    patch: {
      targetFile: 'src/components/UserHeader.tsx',
      description: 'Defer localized date execution until client mount using useEffect or a pure UTC timestamp formatter.',
      diff: [
        { type: 'context', content: 'export function UserLastActive({ timestamp }: { timestamp: string }) {', oldLineNumber: 12, newLineNumber: 12 },
        { type: 'delete', content: '-   return <span>{new Date(timestamp).toLocaleString()}</span>;', oldLineNumber: 13 },
        { type: 'add', content: '+   const [formatted, setFormatted] = useState<string>("");', newLineNumber: 13 },
        { type: 'add', content: '+   useEffect(() => {', newLineNumber: 14 },
        { type: 'add', content: '+     setFormatted(new Date(timestamp).toLocaleString());', newLineNumber: 15 },
        { type: 'add', content: '+   }, [timestamp]);', newLineNumber: 16 },
        { type: 'add', content: '+   return <span suppressHydrationWarning>{formatted || timestamp}</span>;', newLineNumber: 17 },
        { type: 'context', content: '}', oldLineNumber: 14, newLineNumber: 18 },
      ],
    },
    preventionChecklist: [
      'Lint against directly calling toLocaleString() inside SSR render functions.',
      'Standardize edge renderer environment variables to enforce UTC timezone normalization.',
    ],
  },
];