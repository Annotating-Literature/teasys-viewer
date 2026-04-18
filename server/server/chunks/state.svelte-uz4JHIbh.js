import { n as noop } from './index-BFvLoYgI.js';
import './root-BIbsLGYc.js';

const is_legacy = noop.toString().includes("$$") || /function \w+\(\) \{\}/.test(noop.toString());
if (is_legacy) {
  ({
    url: new URL("https://example.com")
  });
}
//# sourceMappingURL=state.svelte-uz4JHIbh.js.map
