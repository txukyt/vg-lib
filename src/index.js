import { configure } from '@/core/config.js';

//export { initialize } from '@/core/init.js';
export { hello } from '@/components/hello.js';
export { showVersion } from '@/utils/env/version.js';
/*export { alert } from '@/components/alerts/index.js';
export { aside } from '@/components/aside.js';
export { defineCookies } from '@/components/cookies/index.js';
*/
export { defineHeader } from '@/components/header/index.js';

export async function init(options) {
  configure(options);
}