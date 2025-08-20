// Exportaciones individuales (ESM)

export { initialize } from '@/core/init.js';
export { hello } from '@/components/hello.js';
export { showVersion } from '@/utils/version.js';
export { alert } from '@/components/alerts/index.js';
export { aside } from '@/components/aside.js';
export { defineCookies } from '@/components/cookies/index.js';

// Arranque global (solo si se importa toda la librería)
import '@/core/init.js';