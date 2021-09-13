"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$$ = exports.$ = exports.ObjectScanUtility = void 0;
const object_scan_1 = __importDefault(require("object-scan"));
class ObjectScanUtility {
    /**
     * Queries an object using a selector & returns the first result
     * @param selector A CSS selector string (excluding `+` & `~`)
     * @param reverse Defaults to `false`. Whether to reverse the query order
     * @returns A function that when called with an object, will perform the search with said object, returning the first result
     */
    static $(selector, reverse) {
        return ObjectScanUtility.create$(selector, true, reverse);
    }
    /**
     * Queries an object using a selector & returns an array of results
     * @param selector A CSS selector string (excluding `+` & `~`)
     * @param reverse Defaults to `false`. Whether to reverse the query order
     * @returns A function that when called with an object, will perform the search with said object, returning an array of results
     */
    static $$(selector, reverse) {
        return ObjectScanUtility.create$(selector, false, reverse);
    }
    static create$(selector, abort, reverse = false) {
        const possibleRtns = [
            'key',
            'value',
            'entry',
            'property',
            'gproperty',
            'parent',
            'gparent',
            'parents',
            'isMatch',
            'matchedBy',
            'excludedBy',
            'traversedBy',
            'isCircular',
            'isLeaf',
            'depth',
            'result',
            'bool',
            'count',
        ];
        let rtn = 'value';
        const result = (obj) => (0, object_scan_1.default)(this.adaptCSSSelector(selector), {
            get rtn() {
                return rtn;
            },
            abort,
            reverse,
        })(obj);
        possibleRtns.forEach((possibleRtn) => {
            Object.defineProperty(result, possibleRtn, {
                get() {
                    rtn = possibleRtn;
                    return result;
                },
            });
        });
        return result;
    }
    static adaptCSSSelector(cssSelector) {
        // doesn't support + or ~ selectors
        return cssSelector
            .split(',')
            .map((cssSelectorPart) => {
            let result = cssSelectorPart;
            // remove space around selector
            result = result.trim();
            // remove css child selector
            result = result.replace(/\s*>\s*(?=\W)\.?/gm, '.');
            // replace spaces
            result = result.replace(/ +?(?=\W)\.?/gm, '.**.');
            // specify level at where search starts
            result = result.startsWith(':root')
                ? result.replace(/:root\.?/, '')
                : '**' + result;
            return result;
        });
    }
}
exports.ObjectScanUtility = ObjectScanUtility;
exports.$ = ObjectScanUtility.$, exports.$$ = ObjectScanUtility.$$;
//# sourceMappingURL=objectScan.utility.js.map