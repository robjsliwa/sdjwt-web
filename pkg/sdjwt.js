import * as wasm from "./sdjwt_bg.wasm";
export * from "./sdjwt_bg.js";
import { __wbg_set_wasm } from "./sdjwt_bg.js";
__wbg_set_wasm(wasm);