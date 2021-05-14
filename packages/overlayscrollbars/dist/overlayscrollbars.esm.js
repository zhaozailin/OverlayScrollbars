const createCache = (update, options) => {
  const { _equal, _initialValue, _alwaysUpdateValues } = options || {};
  let _value = _initialValue;

  let _previous;

  const cacheUpdate = (force, context) => {
    const curr = _value;
    const newVal = update ? update(context, _value, _previous) : context;
    const changed = force || (_equal ? !_equal(curr, newVal) : curr !== newVal);

    if (changed || _alwaysUpdateValues) {
      _value = newVal;
      _previous = curr;
    }

    return {
      _value,
      _previous,
      _changed: changed,
    };
  };

  return {
    _update: cacheUpdate,
    _current: (force) => ({
      _value,
      _previous,
      _changed: !!force,
    }),
  };
};

const ElementNodeType = Node.ELEMENT_NODE;
const { toString, hasOwnProperty } = Object.prototype;
function isUndefined(obj) {
  return obj === undefined;
}
function isNull(obj) {
  return obj === null;
}
const type = (obj) => {
  return isUndefined(obj) || isNull(obj)
    ? `${obj}`
    : toString
        .call(obj)
        .replace(/^\[object (.+)\]$/, '$1')
        .toLowerCase();
};
function isNumber(obj) {
  return typeof obj === 'number';
}
function isString(obj) {
  return typeof obj === 'string';
}
function isBoolean(obj) {
  return typeof obj === 'boolean';
}
function isFunction(obj) {
  return typeof obj === 'function';
}
function isArray(obj) {
  return Array.isArray(obj);
}
function isObject(obj) {
  return typeof obj === 'object' && !isArray(obj) && !isNull(obj);
}
function isArrayLike(obj) {
  const length = !!obj && obj.length;
  const lengthCorrectFormat = isNumber(length) && length > -1 && length % 1 == 0;
  return isArray(obj) || (!isFunction(obj) && lengthCorrectFormat) ? (length > 0 && isObject(obj) ? length - 1 in obj : true) : false;
}
function isPlainObject(obj) {
  if (!obj || !isObject(obj) || type(obj) !== 'object') return false;
  let key;
  const cstr = 'constructor';
  const ctor = obj[cstr];
  const ctorProto = ctor && ctor.prototype;
  const hasOwnConstructor = hasOwnProperty.call(obj, cstr);
  const hasIsPrototypeOf = ctorProto && hasOwnProperty.call(ctorProto, 'isPrototypeOf');

  if (ctor && !hasOwnConstructor && !hasIsPrototypeOf) {
    return false;
  }

  for (key in obj) {
  }

  return isUndefined(key) || hasOwnProperty.call(obj, key);
}
function isHTMLElement(obj) {
  const instanceofObj = window.HTMLElement;
  return obj ? (instanceofObj ? obj instanceof instanceofObj : obj.nodeType === ElementNodeType) : false;
}
function isElement(obj) {
  const instanceofObj = window.Element;
  return obj ? (instanceofObj ? obj instanceof instanceofObj : obj.nodeType === ElementNodeType) : false;
}

function each(source, callback) {
  if (isArrayLike(source)) {
    for (let i = 0; i < source.length; i++) {
      if (callback(source[i], i, source) === false) {
        break;
      }
    }
  } else if (source) {
    each(Object.keys(source), (key) => callback(source[key], key, source));
  }

  return source;
}
const indexOf = (arr, item, fromIndex) => arr.indexOf(item, fromIndex);
const push = (array, items, arrayIsSingleItem) => {
  !arrayIsSingleItem && !isString(items) && isArrayLike(items) ? Array.prototype.push.apply(array, items) : array.push(items);
  return array;
};
const from = (arr) => {
  if (Array.from) {
    return Array.from(arr);
  }

  const result = [];
  each(arr, (elm) => {
    push(result, elm);
  });
  return result;
};
const isEmptyArray = (array) => array && array.length === 0;
const runEach = (arr, p1) => {
  const runFn = (fn) => fn && fn(p1);

  if (arr instanceof Set) {
    arr.forEach(runFn);
  } else {
    each(arr, runFn);
  }
};

const hasOwnProperty$1 = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
const keys = (obj) => (obj ? Object.keys(obj) : []);
function assignDeep(target, object1, object2, object3, object4, object5, object6) {
  const sources = [object1, object2, object3, object4, object5, object6];

  if ((typeof target !== 'object' || isNull(target)) && !isFunction(target)) {
    target = {};
  }

  each(sources, (source) => {
    each(keys(source), (key) => {
      const copy = source[key];

      if (target === copy) {
        return true;
      }

      const copyIsArray = isArray(copy);

      if (copy && (isPlainObject(copy) || copyIsArray)) {
        const src = target[key];
        let clone = src;

        if (copyIsArray && !isArray(src)) {
          clone = [];
        } else if (!copyIsArray && !isPlainObject(src)) {
          clone = {};
        }

        target[key] = assignDeep(clone, copy);
      } else {
        target[key] = copy;
      }
    });
  });
  return target;
}
function isEmptyObject(obj) {
  for (const name in obj) return false;

  return true;
}

function getSetProp(topLeft, fallback, elm, value) {
  if (isUndefined(value)) {
    return elm ? elm[topLeft] : fallback;
  }

  elm && (elm[topLeft] = value);
}

function attr(elm, attrName, value) {
  if (isUndefined(value)) {
    return elm ? elm.getAttribute(attrName) : null;
  }

  elm && elm.setAttribute(attrName, value);
}
const removeAttr = (elm, attrName) => {
  elm && elm.removeAttribute(attrName);
};
function scrollLeft(elm, value) {
  return getSetProp('scrollLeft', 0, elm, value);
}
function scrollTop(elm, value) {
  return getSetProp('scrollTop', 0, elm, value);
}

const elmPrototype = Element.prototype;

const find = (selector, elm) => {
  const arr = [];
  const rootElm = elm ? (isElement(elm) ? elm : null) : document;
  return rootElm ? push(arr, rootElm.querySelectorAll(selector)) : arr;
};

const is = (elm, selector) => {
  if (isElement(elm)) {
    const fn = elmPrototype.matches || elmPrototype.msMatchesSelector;
    return fn.call(elm, selector);
  }

  return false;
};

const contents = (elm) => (elm ? from(elm.childNodes) : []);

const parent = (elm) => (elm ? elm.parentElement : null);

const before = (parentElm, preferredAnchor, insertedElms) => {
  if (insertedElms) {
    let anchor = preferredAnchor;
    let fragment;

    if (parentElm) {
      if (isArrayLike(insertedElms)) {
        fragment = document.createDocumentFragment();
        each(insertedElms, (insertedElm) => {
          if (insertedElm === anchor) {
            anchor = insertedElm.previousSibling;
          }

          fragment.appendChild(insertedElm);
        });
      } else {
        fragment = insertedElms;
      }

      if (preferredAnchor) {
        if (!anchor) {
          anchor = parentElm.firstChild;
        } else if (anchor !== preferredAnchor) {
          anchor = anchor.nextSibling;
        }
      }

      parentElm.insertBefore(fragment, anchor || null);
    }
  }
};

const appendChildren = (node, children) => {
  before(node, null, children);
};
const prependChildren = (node, children) => {
  before(node, node && node.firstChild, children);
};
const insertBefore = (node, insertedNodes) => {
  before(parent(node), node, insertedNodes);
};
const insertAfter = (node, insertedNodes) => {
  before(parent(node), node && node.nextSibling, insertedNodes);
};
const removeElements = (nodes) => {
  if (isArrayLike(nodes)) {
    each(from(nodes), (e) => removeElements(e));
  } else if (nodes) {
    const parentElm = parent(nodes);

    if (parentElm) {
      parentElm.removeChild(nodes);
    }
  }
};

const createDiv = (classNames) => {
  const div = document.createElement('div');

  if (classNames) {
    attr(div, 'class', classNames);
  }

  return div;
};
const createDOM = (html) => {
  const createdDiv = createDiv();
  createdDiv.innerHTML = html.trim();
  return each(contents(createdDiv), (elm) => removeElements(elm));
};

const firstLetterToUpper = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getDummyStyle = () => createDiv().style;

const cssPrefixes = ['-webkit-', '-moz-', '-o-', '-ms-'];
const jsPrefixes = ['WebKit', 'Moz', 'O', 'MS', 'webkit', 'moz', 'o', 'ms'];
const jsCache = {};
const cssCache = {};
const cssProperty = (name) => {
  let result = cssCache[name];

  if (hasOwnProperty$1(cssCache, name)) {
    return result;
  }

  const uppercasedName = firstLetterToUpper(name);
  const elmStyle = getDummyStyle();
  each(cssPrefixes, (prefix) => {
    const prefixWithoutDashes = prefix.replace(/-/g, '');
    const resultPossibilities = [name, prefix + name, prefixWithoutDashes + uppercasedName, firstLetterToUpper(prefixWithoutDashes) + uppercasedName];
    return !(result = resultPossibilities.find((resultPossibility) => elmStyle[resultPossibility] !== undefined));
  });
  return (cssCache[name] = result || '');
};
const jsAPI = (name) => {
  let result = jsCache[name] || window[name];

  if (hasOwnProperty$1(jsCache, name)) {
    return result;
  }

  each(jsPrefixes, (prefix) => {
    result = result || window[prefix + firstLetterToUpper(name)];
    return !result;
  });
  jsCache[name] = result;
  return result;
};

const MutationObserverConstructor = jsAPI('MutationObserver');
const IntersectionObserverConstructor = jsAPI('IntersectionObserver');
const ResizeObserverConstructor = jsAPI('ResizeObserver');
const cAF = jsAPI('cancelAnimationFrame');
const rAF = jsAPI('requestAnimationFrame');

const rnothtmlwhite = /[^\x20\t\r\n\f]+/g;

const classListAction = (elm, className, action) => {
  let clazz;
  let i = 0;
  let result = false;

  if (elm && isString(className)) {
    const classes = className.match(rnothtmlwhite) || [];
    result = classes.length > 0;

    while ((clazz = classes[i++])) {
      result = !!action(elm.classList, clazz) && result;
    }
  }

  return result;
};
const addClass = (elm, className) => {
  classListAction(elm, className, (classList, clazz) => classList.add(clazz));
};
const removeClass = (elm, className) => {
  classListAction(elm, className, (classList, clazz) => classList.remove(clazz));
};
const diffClass = (classNameA, classNameB) => {
  const classNameASplit = classNameA && classNameA.split(' ');
  const classNameBSplit = classNameB && classNameB.split(' ');
  const tempObj = {};
  each(classNameASplit, (className) => {
    tempObj[className] = 1;
  });
  each(classNameBSplit, (className) => {
    if (tempObj[className]) {
      delete tempObj[className];
    } else {
      tempObj[className] = 1;
    }
  });
  return keys(tempObj);
};

const zeroObj = {
  w: 0,
  h: 0,
};
const windowSize = () => ({
  w: window.innerWidth,
  h: window.innerHeight,
});
const offsetSize = (elm) =>
  elm
    ? {
        w: elm.offsetWidth,
        h: elm.offsetHeight,
      }
    : zeroObj;
const clientSize = (elm) =>
  elm
    ? {
        w: elm.clientWidth,
        h: elm.clientHeight,
      }
    : zeroObj;
const scrollSize = (elm) =>
  elm
    ? {
        w: elm.scrollWidth,
        h: elm.scrollHeight,
      }
    : zeroObj;
const getBoundingClientRect = (elm) => elm.getBoundingClientRect();

let passiveEventsSupport;

const supportPassiveEvents = () => {
  if (isUndefined(passiveEventsSupport)) {
    passiveEventsSupport = false;

    try {
      window.addEventListener(
        'test',
        null,
        Object.defineProperty({}, 'passive', {
          get: function () {
            passiveEventsSupport = true;
          },
        })
      );
    } catch (e) {}
  }

  return passiveEventsSupport;
};

const splitEventNames = (eventNames) => eventNames.split(' ');

const off = (target, eventNames, listener, capture) => {
  each(splitEventNames(eventNames), (eventName) => {
    target.removeEventListener(eventName, listener, capture);
  });
};
const on = (target, eventNames, listener, options) => {
  const doSupportPassiveEvents = supportPassiveEvents();
  const passive = (doSupportPassiveEvents && options && options._passive) || false;
  const capture = (options && options._capture) || false;
  const once = (options && options._once) || false;
  const offListeners = [];
  const nativeOptions = doSupportPassiveEvents
    ? {
        passive,
        capture,
      }
    : capture;
  each(splitEventNames(eventNames), (eventName) => {
    const finalListener = once
      ? (evt) => {
          target.removeEventListener(eventName, finalListener, capture);
          listener && listener(evt);
        }
      : listener;
    push(offListeners, off.bind(null, target, eventName, finalListener, capture));
    target.addEventListener(eventName, finalListener, nativeOptions);
  });
  return runEach.bind(0, offListeners);
};
const stopPropagation = (evt) => evt.stopPropagation();
const preventDefault = (evt) => evt.preventDefault();
const stopAndPrevent = (evt) => stopPropagation(evt) || preventDefault(evt);

const equal = (a, b, props, propMutation) => {
  if (a && b) {
    let result = true;
    each(props, (prop) => {
      const compareA = propMutation ? propMutation(a[prop]) : a[prop];
      const compareB = propMutation ? propMutation(b[prop]) : b[prop];

      if (compareA !== compareB) {
        result = false;
      }
    });
    return result;
  }

  return false;
};
const equalWH = (a, b) => equal(a, b, ['w', 'h']);
const equalTRBL = (a, b) => equal(a, b, ['t', 'r', 'b', 'l']);
const equalBCRWH = (a, b, round) => equal(a, b, ['width', 'height'], round && ((value) => Math.round(value)));

const setT = window.setTimeout;

const clearTimeouts = (id) => {
  id && window.clearTimeout(id);
  id && cAF(id);
};

const noop = () => {};
const debounce = (functionToDebounce, options) => {
  let timeoutId;
  let maxTimeoutId;
  let prevArguments;
  let latestArguments;
  const { _timeout, _maxDelay, _mergeParams } = options;

  const invokeFunctionToDebounce = function invokeFunctionToDebounce(args) {
    clearTimeouts(timeoutId);
    clearTimeouts(maxTimeoutId);
    maxTimeoutId = timeoutId = prevArguments = undefined;
    functionToDebounce.apply(this, args);
  };

  const mergeParms = (curr) => (_mergeParams && prevArguments ? _mergeParams(prevArguments, curr) : curr);

  const flush = () => {
    if (timeoutId) {
      invokeFunctionToDebounce(mergeParms(latestArguments) || latestArguments);
    }
  };

  const debouncedFn = function debouncedFn() {
    const args = arguments;
    const finalTimeout = isFunction(_timeout) ? _timeout() : _timeout;
    const hasTimeout = isNumber(finalTimeout) && finalTimeout >= 0;

    if (hasTimeout) {
      const finalMaxWait = isFunction(_maxDelay) ? _maxDelay() : _maxDelay;
      const hasMaxWait = isNumber(finalMaxWait) && finalMaxWait >= 0;
      const setTimeoutFn = finalTimeout > 0 ? setT : rAF;
      const mergeParamsResult = mergeParms(args);
      const invokedArgs = mergeParamsResult || args;
      const boundInvoke = invokeFunctionToDebounce.bind(0, invokedArgs);

      if (!mergeParamsResult) {
        invokeFunctionToDebounce(prevArguments || args);
      }

      clearTimeouts(timeoutId);
      timeoutId = setTimeoutFn(boundInvoke, finalTimeout);

      if (hasMaxWait && !maxTimeoutId) {
        maxTimeoutId = setT(flush, finalMaxWait);
      }

      prevArguments = latestArguments = invokedArgs;
    } else {
      invokeFunctionToDebounce(args);
    }
  };

  debouncedFn._flush = flush;
  return debouncedFn;
};

const cssNumber = {
  opacity: 1,
  zindex: 1,
};

const parseToZeroOrNumber = (value, toFloat) => {
  const num = toFloat ? parseFloat(value) : parseInt(value, 10);
  return Number.isNaN(num) ? 0 : num;
};

const adaptCSSVal = (prop, val) => (!cssNumber[prop.toLowerCase()] && isNumber(val) ? `${val}px` : val);

const getCSSVal = (elm, computedStyle, prop) =>
  computedStyle != null ? computedStyle[prop] || computedStyle.getPropertyValue(prop) : elm.style[prop];

const setCSSVal = (elm, prop, val) => {
  try {
    if (elm) {
      const { style } = elm;

      if (!isUndefined(style[prop])) {
        style[prop] = adaptCSSVal(prop, val);
      } else {
        style.setProperty(prop, val);
      }
    }
  } catch (e) {}
};

function style(elm, styles) {
  const getSingleStyle = isString(styles);
  const getStyles = isArray(styles) || getSingleStyle;

  if (getStyles) {
    let getStylesResult = getSingleStyle ? '' : {};

    if (elm) {
      const computedStyle = window.getComputedStyle(elm, null);
      getStylesResult = getSingleStyle
        ? getCSSVal(elm, computedStyle, styles)
        : styles.reduce((result, key) => {
            result[key] = getCSSVal(elm, computedStyle, key);
            return result;
          }, getStylesResult);
    }

    return getStylesResult;
  }

  each(keys(styles), (key) => setCSSVal(elm, key, styles[key]));
}
const topRightBottomLeft = (elm, propertyPrefix, propertySuffix) => {
  const finalPrefix = propertyPrefix ? `${propertyPrefix}-` : '';
  const finalSuffix = propertySuffix ? `-${propertySuffix}` : '';
  const top = `${finalPrefix}top${finalSuffix}`;
  const right = `${finalPrefix}right${finalSuffix}`;
  const bottom = `${finalPrefix}bottom${finalSuffix}`;
  const left = `${finalPrefix}left${finalSuffix}`;
  const result = style(elm, [top, right, bottom, left]);
  return {
    t: parseToZeroOrNumber(result[top]),
    r: parseToZeroOrNumber(result[right]),
    b: parseToZeroOrNumber(result[bottom]),
    l: parseToZeroOrNumber(result[left]),
  };
};

const zeroObj$1 = {
  x: 0,
  y: 0,
};
const absoluteCoordinates = (elm) => {
  const rect = elm ? getBoundingClientRect(elm) : 0;
  return rect
    ? {
        x: rect.left + window.pageYOffset,
        y: rect.top + window.pageXOffset,
      }
    : zeroObj$1;
};

function createCommonjsModule(fn) {
  var module = { exports: {} };
  return fn(module, module.exports), module.exports;
}

var _extends_1 = createCommonjsModule(function (module) {
  function _extends() {
    module.exports = _extends =
      Object.assign ||
      function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      };

    return _extends.apply(this, arguments);
  }

  module.exports = _extends;
});

const { stringify } = JSON;
const templateTypePrefixSuffix = ['__TPL_', '_TYPE__'];
const optionsTemplateTypes = ['boolean', 'number', 'string', 'array', 'object', 'function', 'null'].reduce((result, item) => {
  result[item] = templateTypePrefixSuffix[0] + item + templateTypePrefixSuffix[1];
  return result;
}, {});

const validateRecursive = (options, template, optionsDiff, doWriteErrors, propPath) => {
  const validatedOptions = {};

  const optionsCopy = _extends_1({}, options);

  const props = keys(template).filter((prop) => hasOwnProperty$1(options, prop));
  each(props, (prop) => {
    const optionsDiffValue = isUndefined(optionsDiff[prop]) ? {} : optionsDiff[prop];
    const optionsValue = options[prop];
    const templateValue = template[prop];
    const templateIsComplex = isPlainObject(templateValue);
    const propPrefix = propPath ? `${propPath}.` : '';

    if (templateIsComplex && isPlainObject(optionsValue)) {
      const validatedResult = validateRecursive(optionsValue, templateValue, optionsDiffValue, doWriteErrors, propPrefix + prop);
      validatedOptions[prop] = validatedResult._validated;
      optionsCopy[prop] = validatedResult._foreign;
      each([optionsCopy, validatedOptions], (value) => {
        if (isEmptyObject(value[prop])) {
          delete value[prop];
        }
      });
    } else if (!templateIsComplex) {
      let isValid = false;
      const errorEnumStrings = [];
      const errorPossibleTypes = [];
      const optionsValueType = type(optionsValue);
      const templateValueArr = !isArray(templateValue) ? [templateValue] : templateValue;
      each(templateValueArr, (currTemplateType) => {
        let typeString;
        each(optionsTemplateTypes, (value, key) => {
          if (value === currTemplateType) {
            typeString = key;
          }
        });
        const isEnumString = isUndefined(typeString);

        if (isEnumString && isString(optionsValue)) {
          const enumStringSplit = currTemplateType.split(' ');
          isValid = !!enumStringSplit.find((possibility) => possibility === optionsValue);
          push(errorEnumStrings, enumStringSplit);
        } else {
          isValid = optionsTemplateTypes[optionsValueType] === currTemplateType;
        }

        push(errorPossibleTypes, isEnumString ? optionsTemplateTypes.string : typeString);
        return !isValid;
      });

      if (isValid) {
        const doStringifyComparison = isArray(optionsValue) || isPlainObject(optionsValue);

        if (doStringifyComparison ? stringify(optionsValue) !== stringify(optionsDiffValue) : optionsValue !== optionsDiffValue) {
          validatedOptions[prop] = optionsValue;
        }
      } else if (doWriteErrors) {
        console.warn(
          `${
            `The option "${propPrefix}${prop}" wasn't set, because it doesn't accept the type [ ${optionsValueType.toUpperCase()} ] with the value of "${optionsValue}".\r\n` +
            `Accepted types are: [ ${errorPossibleTypes.join(', ').toUpperCase()} ].\r\n`
          }${errorEnumStrings.length > 0 ? `\r\nValid strings are: [ ${errorEnumStrings.join(', ')} ].` : ''}`
        );
      }

      delete optionsCopy[prop];
    }
  });
  return {
    _foreign: optionsCopy,
    _validated: validatedOptions,
  };
};

const validateOptions = (options, template, optionsDiff, doWriteErrors) => {
  return validateRecursive(options, template, optionsDiff || {}, doWriteErrors || false);
};

const transformOptions = (optionsWithOptionsTemplate) => {
  const result = {
    _template: {},
    _options: {},
  };
  each(keys(optionsWithOptionsTemplate), (key) => {
    const val = optionsWithOptionsTemplate[key];

    if (isArray(val)) {
      result._template[key] = val[1];
      result._options[key] = val[0];
    } else {
      const tmpResult = transformOptions(val);
      result._template[key] = tmpResult._template;
      result._options[key] = tmpResult._options;
    }
  });
  return result;
};

const classNameEnvironment = 'os-environment';
const classNameEnvironmentFlexboxGlue = `${classNameEnvironment}-flexbox-glue`;
const classNameEnvironmentFlexboxGlueMax = `${classNameEnvironmentFlexboxGlue}-max`;
const classNameHost = 'os-host';
const classNamePadding = 'os-padding';
const classNameViewport = 'os-viewport';
const classNameViewportArrange = `${classNameViewport}-arrange`;
const classNameContent = 'os-content';
const classNameViewportScrollbarStyling = `${classNameViewport}-scrollbar-styled`;
const classNameSizeObserver = 'os-size-observer';
const classNameSizeObserverAppear = `${classNameSizeObserver}-appear`;
const classNameSizeObserverListener = `${classNameSizeObserver}-listener`;
const classNameSizeObserverListenerScroll = `${classNameSizeObserverListener}-scroll`;
const classNameSizeObserverListenerItem = `${classNameSizeObserverListener}-item`;
const classNameSizeObserverListenerItemFinal = `${classNameSizeObserverListenerItem}-final`;
const classNameTrinsicObserver = 'os-trinsic-observer';

const numberAllowedValues = optionsTemplateTypes.number;
const arrayNullValues = [optionsTemplateTypes.array, optionsTemplateTypes.null];
const stringArrayNullAllowedValues = [optionsTemplateTypes.string, optionsTemplateTypes.array, optionsTemplateTypes.null];
const booleanTrueTemplate = [true, optionsTemplateTypes.boolean];
const booleanFalseTemplate = [false, optionsTemplateTypes.boolean];
const resizeAllowedValues = 'none both horizontal vertical';
const overflowAllowedValues = 'hidden scroll visible visible-hidden';
const scrollbarsVisibilityAllowedValues = 'visible hidden auto';
const scrollbarsAutoHideAllowedValues = 'never scroll leavemove';
const defaultOptionsWithTemplate = {
  resize: ['none', resizeAllowedValues],
  paddingAbsolute: booleanFalseTemplate,
  updating: {
    elementEvents: [[['img', 'load']], arrayNullValues],
    attributes: [null, arrayNullValues],
    debounce: [
      [0, 33],
      [optionsTemplateTypes.number, optionsTemplateTypes.array, optionsTemplateTypes.null],
    ],
  },
  overflow: {
    x: ['scroll', overflowAllowedValues],
    y: ['scroll', overflowAllowedValues],
  },
  scrollbars: {
    visibility: ['auto', scrollbarsVisibilityAllowedValues],
    autoHide: ['never', scrollbarsAutoHideAllowedValues],
    autoHideDelay: [800, numberAllowedValues],
    dragScroll: booleanTrueTemplate,
    clickScroll: booleanFalseTemplate,
    touch: booleanTrueTemplate,
  },
  textarea: {
    dynWidth: booleanFalseTemplate,
    dynHeight: booleanFalseTemplate,
    inheritedAttrs: [['style', 'class'], stringArrayNullAllowedValues],
  },
  nativeScrollbarsOverlaid: {
    show: booleanFalseTemplate,
    initialize: booleanFalseTemplate,
  },
  callbacks: {
    onUpdated: [null, [optionsTemplateTypes.function, optionsTemplateTypes.null]],
  },
};
const { _template: optionsTemplate, _options: defaultOptions } = transformOptions(defaultOptionsWithTemplate);

let environmentInstance;
const { abs, round } = Math;

const diffBiggerThanOne = (valOne, valTwo) => {
  const absValOne = abs(valOne);
  const absValTwo = abs(valTwo);
  return !(absValOne === absValTwo || absValOne + 1 === absValTwo || absValOne - 1 === absValTwo);
};

const getNativeScrollbarSize = (body, measureElm) => {
  appendChildren(body, measureElm);
  const cSize = clientSize(measureElm);
  const oSize = offsetSize(measureElm);
  return {
    x: oSize.h - cSize.h,
    y: oSize.w - cSize.w,
  };
};

const getNativeScrollbarStyling = (testElm) => {
  let result = false;
  addClass(testElm, classNameViewportScrollbarStyling);

  try {
    result =
      style(testElm, cssProperty('scrollbar-width')) === 'none' ||
      window.getComputedStyle(testElm, '::-webkit-scrollbar').getPropertyValue('display') === 'none';
  } catch (ex) {}

  return result;
};

const getRtlScrollBehavior = (parentElm, childElm) => {
  const strHidden = 'hidden';
  style(parentElm, {
    overflowX: strHidden,
    overflowY: strHidden,
    direction: 'rtl',
  });
  scrollLeft(parentElm, 0);
  const parentOffset = absoluteCoordinates(parentElm);
  const childOffset = absoluteCoordinates(childElm);
  scrollLeft(parentElm, -999);
  const childOffsetAfterScroll = absoluteCoordinates(childElm);
  return {
    i: parentOffset.x === childOffset.x,
    n: childOffset.x !== childOffsetAfterScroll.x,
  };
};

const getFlexboxGlue = (parentElm, childElm) => {
  addClass(parentElm, classNameEnvironmentFlexboxGlue);
  const minOffsetsizeParent = getBoundingClientRect(parentElm);
  const minOffsetsize = getBoundingClientRect(childElm);
  const supportsMin = equalBCRWH(minOffsetsize, minOffsetsizeParent, true);
  addClass(parentElm, classNameEnvironmentFlexboxGlueMax);
  const maxOffsetsizeParent = getBoundingClientRect(parentElm);
  const maxOffsetsize = getBoundingClientRect(childElm);
  const supportsMax = equalBCRWH(maxOffsetsize, maxOffsetsizeParent, true);
  return supportsMin && supportsMax;
};

const getWindowDPR = () => {
  const dDPI = window.screen.deviceXDPI || 0;
  const sDPI = window.screen.logicalXDPI || 1;
  return window.devicePixelRatio || dDPI / sDPI;
};

const getDefaultInitializationStrategy = (nativeScrollbarStyling) => ({
  _padding: !nativeScrollbarStyling,
  _content: false,
});

const createEnvironment = () => {
  const { body } = document;
  const envDOM = createDOM(`<div class="${classNameEnvironment}"><div></div></div>`);
  const envElm = envDOM[0];
  const envChildElm = envElm.firstChild;
  const onChangedListener = new Set();
  const nativeScrollbarSize = getNativeScrollbarSize(body, envElm);
  const nativeScrollbarStyling = getNativeScrollbarStyling(envElm);
  const nativeScrollbarIsOverlaid = {
    x: nativeScrollbarSize.x === 0,
    y: nativeScrollbarSize.y === 0,
  };
  const defaultInitializationStrategy = getDefaultInitializationStrategy(nativeScrollbarStyling);
  let initializationStrategy = defaultInitializationStrategy;
  let defaultDefaultOptions = defaultOptions;
  const env = {
    _nativeScrollbarSize: nativeScrollbarSize,
    _nativeScrollbarIsOverlaid: nativeScrollbarIsOverlaid,
    _nativeScrollbarStyling: nativeScrollbarStyling,
    _cssCustomProperties: style(envElm, 'zIndex') === '-1',
    _rtlScrollBehavior: getRtlScrollBehavior(envElm, envChildElm),
    _flexboxGlue: getFlexboxGlue(envElm, envChildElm),

    _addListener(listener) {
      onChangedListener.add(listener);
    },

    _removeListener(listener) {
      onChangedListener.delete(listener);
    },

    _getInitializationStrategy: () => _extends_1({}, initializationStrategy),

    _setInitializationStrategy(newInitializationStrategy) {
      initializationStrategy = assignDeep({}, initializationStrategy, newInitializationStrategy);
    },

    _getDefaultOptions: () => _extends_1({}, defaultDefaultOptions),

    _setDefaultOptions(newDefaultOptions) {
      defaultDefaultOptions = assignDeep({}, defaultDefaultOptions, newDefaultOptions);
    },

    _defaultInitializationStrategy: defaultInitializationStrategy,
    _defaultDefaultOptions: defaultDefaultOptions,
  };
  removeAttr(envElm, 'style');
  removeElements(envElm);

  if (!nativeScrollbarStyling && (!nativeScrollbarIsOverlaid.x || !nativeScrollbarIsOverlaid.y)) {
    let size = windowSize();
    let dpr = getWindowDPR();
    let scrollbarSize = nativeScrollbarSize;
    window.addEventListener('resize', () => {
      if (onChangedListener.size) {
        const sizeNew = windowSize();
        const deltaSize = {
          w: sizeNew.w - size.w,
          h: sizeNew.h - size.h,
        };
        if (deltaSize.w === 0 && deltaSize.h === 0) return;
        const deltaAbsSize = {
          w: abs(deltaSize.w),
          h: abs(deltaSize.h),
        };
        const deltaAbsRatio = {
          w: abs(round(sizeNew.w / (size.w / 100.0))),
          h: abs(round(sizeNew.h / (size.h / 100.0))),
        };
        const dprNew = getWindowDPR();
        const deltaIsBigger = deltaAbsSize.w > 2 && deltaAbsSize.h > 2;
        const difference = !diffBiggerThanOne(deltaAbsRatio.w, deltaAbsRatio.h);
        const dprChanged = dprNew !== dpr && dpr > 0;
        const isZoom = deltaIsBigger && difference && dprChanged;

        if (isZoom) {
          const newScrollbarSize = (environmentInstance._nativeScrollbarSize = getNativeScrollbarSize(body, envElm));
          removeElements(envElm);

          if (scrollbarSize.x !== newScrollbarSize.x || scrollbarSize.y !== newScrollbarSize.y) {
            runEach(onChangedListener);
          }

          scrollbarSize = newScrollbarSize;
        }

        size = sizeNew;
        dpr = dprNew;
      }
    });
  }

  return env;
};

const getEnvironment = () => {
  if (!environmentInstance) {
    environmentInstance = createEnvironment();
  }

  return environmentInstance;
};

const unwrap = (elm) => {
  appendChildren(parent(elm), contents(elm));
  removeElements(elm);
};

let contentArrangeCounter = 0;

const createUniqueViewportArrangeElement = () => {
  const elm = document.createElement('style');
  attr(elm, 'id', `${classNameViewportArrange}-${contentArrangeCounter}`);
  contentArrangeCounter++;
  return elm;
};

const evaluateCreationFromStrategy = (initializationValue, strategy) => {
  const isBooleanValue = isBoolean(initializationValue);

  if (isBooleanValue || isUndefined(initializationValue)) {
    return (isBooleanValue ? initializationValue : strategy) && undefined;
  }

  return initializationValue;
};

const createStructureSetup = (target) => {
  const { _getInitializationStrategy, _nativeScrollbarStyling, _nativeScrollbarIsOverlaid, _cssCustomProperties } = getEnvironment();

  const { _padding: paddingNeeded, _content: contentNeeded } = _getInitializationStrategy();

  const targetIsElm = isHTMLElement(target);
  const osTargetObj = targetIsElm
    ? {}
    : {
        _host: target.host,
        _target: target.target,
        _viewport: target.viewport,
        _padding: evaluateCreationFromStrategy(target.padding, paddingNeeded),
        _content: evaluateCreationFromStrategy(target.content, contentNeeded),
      };

  if (targetIsElm) {
    const viewport = createDiv(classNameViewport);
    const padding = paddingNeeded && createDiv(classNamePadding);
    const content = contentNeeded && createDiv(classNameContent);
    osTargetObj._target = target;
    osTargetObj._padding = padding;
    osTargetObj._viewport = viewport;
    osTargetObj._content = content;
  }

  let { _target, _padding, _viewport, _content } = osTargetObj;
  const destroyFns = [];
  const isTextarea = is(_target, 'textarea');
  const isBody = !isTextarea && is(_target, 'body');

  const _host = isTextarea ? osTargetObj._host || createDiv() : _target;

  const getTargetContents = (contentSlot) => (isTextarea ? _target : contents(contentSlot));

  const isTextareaHostGenerated = isTextarea && _host !== osTargetObj._host;

  if (isTextareaHostGenerated) {
    insertAfter(_target, _host);
    push(destroyFns, () => {
      insertAfter(_host, _target);
      removeElements(_host);
    });
  }

  if (targetIsElm) {
    const contentSlot = _content || _viewport;
    appendChildren(contentSlot, getTargetContents(_target));
    appendChildren(_host, _padding);
    appendChildren(_padding || _host, _viewport);
    appendChildren(_viewport, _content);
    push(destroyFns, () => {
      appendChildren(_host, contents(contentSlot));
      removeElements(_padding || _viewport);
      removeClass(_host, classNameHost);
    });
  } else {
    const contentContainingElm = _content || _viewport || _padding || _host;
    const createPadding = isUndefined(_padding);
    const createViewport = isUndefined(_viewport);
    const createContent = isUndefined(_content);
    const targetContents = getTargetContents(contentContainingElm);
    _padding = osTargetObj._padding = createPadding ? createDiv() : _padding;
    _viewport = osTargetObj._viewport = createViewport ? createDiv() : _viewport;
    _content = osTargetObj._content = createContent ? createDiv() : _content;
    appendChildren(_host, _padding);
    appendChildren(_padding || _host, _viewport);
    appendChildren(_viewport, _content);
    const contentSlot = _content || _viewport;
    appendChildren(contentSlot, targetContents);
    push(destroyFns, () => {
      if (createContent) {
        unwrap(_content);
      }

      if (createViewport) {
        unwrap(_viewport);
      }

      if (createPadding) {
        unwrap(_padding);
      }

      removeClass(_host, classNameHost);
      removeClass(_padding, classNamePadding);
      removeClass(_viewport, classNameViewport);
      removeClass(_content, classNameContent);
    });
  }

  addClass(_host, classNameHost);
  addClass(_padding, classNamePadding);
  addClass(_viewport, classNameViewport);
  addClass(_content, classNameContent);
  const ownerDocument = _target.ownerDocument;
  const bodyElm = ownerDocument.body;
  const wnd = ownerDocument.defaultView;
  const ctx = {
    _windowElm: wnd,
    _documentElm: ownerDocument,
    _htmlElm: parent(bodyElm),
    _bodyElm: bodyElm,
    _isTextarea: isTextarea,
    _isBody: isBody,
  };

  const obj = _extends_1({}, osTargetObj, {
    _host,
  });

  if (_nativeScrollbarStyling) {
    push(destroyFns, removeClass.bind(0, _viewport, classNameViewportScrollbarStyling));
  } else if (!_cssCustomProperties && (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y)) {
    const viewportArrangeElm = createUniqueViewportArrangeElement();
    insertBefore(_viewport, viewportArrangeElm);
    push(destroyFns, removeElements.bind(0, viewportArrangeElm));
    obj._viewportArrange = viewportArrangeElm;
  }

  return {
    _targetObj: obj,
    _targetCtx: ctx,
    _destroy: () => {
      runEach(destroyFns);
    },
  };
};

const animationStartEventName = 'animationstart';
const scrollEventName = 'scroll';
const scrollAmount = 3333333;

const directionIsRTL = (elm) => style(elm, 'direction') === 'rtl';

const domRectHasDimensions = (rect) => rect && (rect.height || rect.width);

const createSizeObserver = (target, onSizeChangedCallback, options) => {
  const { _direction: observeDirectionChange = false, _appear: observeAppearChange = false } = options || {};
  const { _rtlScrollBehavior: rtlScrollBehavior } = getEnvironment();
  const baseElements = createDOM(`<div class="${classNameSizeObserver}"><div class="${classNameSizeObserverListener}"></div></div>`);
  const sizeObserver = baseElements[0];
  const listenerElement = sizeObserver.firstChild;
  const { _update: updateResizeObserverContentRectCache } = createCache(0, {
    _alwaysUpdateValues: true,
    _equal: (currVal, newVal) => !(!currVal || (!domRectHasDimensions(currVal) && domRectHasDimensions(newVal))),
  });

  const onSizeChangedCallbackProxy = (sizeChangedContext) => {
    const hasDirectionCache = sizeChangedContext && isBoolean(sizeChangedContext._value);
    let skip = false;
    let appear = false;
    let doDirectionScroll = true;

    if (isArray(sizeChangedContext) && sizeChangedContext.length > 0) {
      const { _previous, _value } = updateResizeObserverContentRectCache(0, sizeChangedContext.pop().contentRect);
      const hasDimensions = domRectHasDimensions(_value);
      const hadDimensions = domRectHasDimensions(_previous);
      skip = !_previous || !hasDimensions;
      appear = !hadDimensions && hasDimensions;
      doDirectionScroll = !skip;
    } else if (hasDirectionCache) {
      doDirectionScroll = sizeChangedContext._changed;
    } else {
      appear = sizeChangedContext === true;
    }

    if (observeDirectionChange && doDirectionScroll) {
      const rtl = hasDirectionCache ? sizeChangedContext._value : directionIsRTL(sizeObserver);
      scrollLeft(sizeObserver, rtl ? (rtlScrollBehavior.n ? -scrollAmount : rtlScrollBehavior.i ? 0 : scrollAmount) : scrollAmount);
      scrollTop(sizeObserver, scrollAmount);
    }

    if (!skip) {
      onSizeChangedCallback({
        _sizeChanged: !hasDirectionCache,
        _directionIsRTLCache: hasDirectionCache ? sizeChangedContext : undefined,
        _appear: !!appear,
      });
    }
  };

  const offListeners = [];
  let appearCallback = observeAppearChange ? onSizeChangedCallbackProxy : false;
  let directionIsRTLCache;

  if (ResizeObserverConstructor) {
    const resizeObserverInstance = new ResizeObserverConstructor(onSizeChangedCallbackProxy);
    resizeObserverInstance.observe(listenerElement);
    push(offListeners, () => {
      resizeObserverInstance.disconnect();
    });
  } else {
    const observerElementChildren = createDOM(
      `<div class="${classNameSizeObserverListenerItem}" dir="ltr"><div class="${classNameSizeObserverListenerItem}"><div class="${classNameSizeObserverListenerItemFinal}"></div></div><div class="${classNameSizeObserverListenerItem}"><div class="${classNameSizeObserverListenerItemFinal}" style="width: 200%; height: 200%"></div></div></div>`
    );
    appendChildren(listenerElement, observerElementChildren);
    addClass(listenerElement, classNameSizeObserverListenerScroll);
    const observerElementChildrenRoot = observerElementChildren[0];
    const shrinkElement = observerElementChildrenRoot.lastChild;
    const expandElement = observerElementChildrenRoot.firstChild;
    const expandElementChild = expandElement == null ? void 0 : expandElement.firstChild;
    let cacheSize = offsetSize(observerElementChildrenRoot);
    let currSize = cacheSize;
    let isDirty = false;
    let rAFId;

    const reset = () => {
      scrollLeft(expandElement, scrollAmount);
      scrollTop(expandElement, scrollAmount);
      scrollLeft(shrinkElement, scrollAmount);
      scrollTop(shrinkElement, scrollAmount);
    };

    const onResized = (appear) => {
      rAFId = 0;

      if (isDirty) {
        cacheSize = currSize;
        onSizeChangedCallbackProxy(appear === true);
      }
    };

    const onScroll = (scrollEvent) => {
      currSize = offsetSize(observerElementChildrenRoot);
      isDirty = !scrollEvent || !equalWH(currSize, cacheSize);

      if (scrollEvent) {
        stopAndPrevent(scrollEvent);

        if (isDirty && !rAFId) {
          cAF(rAFId);
          rAFId = rAF(onResized);
        }
      } else {
        onResized(scrollEvent === false);
      }

      reset();
    };

    push(offListeners, [on(expandElement, scrollEventName, onScroll), on(shrinkElement, scrollEventName, onScroll)]);
    style(expandElementChild, {
      width: scrollAmount,
      height: scrollAmount,
    });
    reset();
    appearCallback = observeAppearChange ? onScroll.bind(0, false) : reset;
  }

  if (observeDirectionChange) {
    directionIsRTLCache = createCache(directionIsRTL.bind(0, sizeObserver));
    const { _update: updateDirectionIsRTLCache } = directionIsRTLCache;
    push(
      offListeners,
      on(sizeObserver, scrollEventName, (event) => {
        const directionIsRTLCacheValues = updateDirectionIsRTLCache();
        const { _value, _changed } = directionIsRTLCacheValues;

        if (_changed) {
          removeClass(listenerElement, 'ltr rtl');

          if (_value) {
            addClass(listenerElement, 'rtl');
          } else {
            addClass(listenerElement, 'ltr');
          }

          onSizeChangedCallbackProxy(directionIsRTLCacheValues);
        }

        stopAndPrevent(event);
      })
    );
  }

  if (appearCallback) {
    addClass(sizeObserver, classNameSizeObserverAppear);
    push(
      offListeners,
      on(sizeObserver, animationStartEventName, appearCallback, {
        _once: !!ResizeObserverConstructor,
      })
    );
  }

  prependChildren(target, sizeObserver);
  return {
    _destroy() {
      runEach(offListeners);
      removeElements(sizeObserver);
    },

    _getCurrentCacheValues(force) {
      return {
        _directionIsRTL: directionIsRTLCache
          ? directionIsRTLCache._current(force)
          : {
              _value: false,
              _previous: false,
              _changed: false,
            },
      };
    },
  };
};

const createTrinsicObserver = (target, onTrinsicChangedCallback) => {
  const trinsicObserver = createDiv(classNameTrinsicObserver);
  const offListeners = [];
  const { _update: updateHeightIntrinsicCache, _current: getCurrentHeightIntrinsicCache } = createCache(
    (ioEntryOrSize) => ioEntryOrSize.h === 0 || ioEntryOrSize.isIntersecting || ioEntryOrSize.intersectionRatio > 0,
    {
      _initialValue: false,
    }
  );

  if (IntersectionObserverConstructor) {
    const intersectionObserverInstance = new IntersectionObserverConstructor(
      (entries) => {
        if (entries && entries.length > 0) {
          const last = entries.pop();

          if (last) {
            const heightIntrinsic = updateHeightIntrinsicCache(0, last);

            if (heightIntrinsic._changed) {
              onTrinsicChangedCallback(heightIntrinsic);
            }
          }
        }
      },
      {
        root: target,
      }
    );
    intersectionObserverInstance.observe(trinsicObserver);
    push(offListeners, () => {
      intersectionObserverInstance.disconnect();
    });
  } else {
    const onSizeChanged = () => {
      const newSize = offsetSize(trinsicObserver);
      const heightIntrinsicCache = updateHeightIntrinsicCache(0, newSize);

      if (heightIntrinsicCache._changed) {
        onTrinsicChangedCallback(heightIntrinsicCache);
      }
    };

    push(offListeners, createSizeObserver(trinsicObserver, onSizeChanged)._destroy);
    onSizeChanged();
  }

  prependChildren(target, trinsicObserver);
  return {
    _destroy() {
      runEach(offListeners);
      removeElements(trinsicObserver);
    },

    _getCurrentCacheValues(force) {
      return {
        _heightIntrinsic: getCurrentHeightIntrinsicCache(force),
      };
    },
  };
};

const createEventContentChange = (target, eventContentChange, callback) => {
  let map;

  const _destroy = () => {
    if (map) {
      map.forEach((eventName, elm) => {
        off(elm, eventName, callback);
      });
      map.clear();
    }
  };

  const _updateElements = (getElements) => {
    if (map && eventContentChange) {
      const eventElmList = eventContentChange.reduce((arr, item) => {
        if (item) {
          const selector = item[0];
          const eventNames = item[1];
          const elements = eventNames && selector && (getElements ? getElements(selector) : find(selector, target));

          if (elements && elements.length && eventNames && isString(eventNames)) {
            push(arr, [elements, eventNames.trim()], true);
          }
        }

        return arr;
      }, []);
      each(eventElmList, (item) =>
        each(item[0], (elm) => {
          const eventNames = item[1];
          const registredEventNames = map.get(elm);
          const newEntry = isUndefined(registredEventNames);
          const changingExistingEntry = !newEntry && eventNames !== registredEventNames;
          const finalEventNames = changingExistingEntry ? `${registredEventNames} ${eventNames}` : eventNames;

          if (changingExistingEntry) {
            off(elm, registredEventNames, callback);
          }

          map.set(elm, finalEventNames);
          on(elm, finalEventNames, callback);
        })
      );
    }
  };

  if (eventContentChange) {
    map = map || new Map();

    _destroy();

    _updateElements();
  }

  return {
    _destroy,
    _updateElements,
  };
};

const createDOMObserver = (target, isContentObserver, callback, options) => {
  let isConnected = false;
  const {
    _attributes,
    _styleChangingAttributes,
    _eventContentChange,
    _nestedTargetSelector,
    _ignoreTargetChange,
    _ignoreNestedTargetChange,
    _ignoreContentChange,
  } = options || {};
  const { _destroy: destroyEventContentChange, _updateElements: updateEventContentChangeElements } = createEventContentChange(
    target,
    isContentObserver && _eventContentChange,
    debounce(
      () => {
        if (isConnected) {
          callback(true);
        }
      },
      {
        _timeout: 33,
        _maxDelay: 99,
      }
    )
  );
  const finalAttributes = _attributes || [];
  const finalStyleChangingAttributes = _styleChangingAttributes || [];
  const observedAttributes = finalAttributes.concat(finalStyleChangingAttributes);

  const observerCallback = (mutations) => {
    const ignoreTargetChange = (isContentObserver ? _ignoreNestedTargetChange : _ignoreTargetChange) || noop;
    const ignoreContentChange = _ignoreContentChange || noop;
    const targetChangedAttrs = [];
    const totalAddedNodes = [];
    let targetStyleChanged = false;
    let contentChanged = false;
    let childListChanged = false;
    each(mutations, (mutation) => {
      const { attributeName, target: mutationTarget, type, oldValue, addedNodes } = mutation;
      const isAttributesType = type === 'attributes';
      const isChildListType = type === 'childList';
      const targetIsMutationTarget = target === mutationTarget;
      const attributeValue = isAttributesType && isString(attributeName) ? attr(mutationTarget, attributeName) : 0;
      const attributeChanged = attributeValue !== 0 && oldValue !== attributeValue;
      const styleChangingAttrChanged = indexOf(finalStyleChangingAttributes, attributeName) > -1 && attributeChanged;

      if (isContentObserver && !targetIsMutationTarget) {
        const notOnlyAttrChanged = !isAttributesType;
        const contentAttrChanged = isAttributesType && styleChangingAttrChanged;
        const isNestedTarget = contentAttrChanged && _nestedTargetSelector && is(mutationTarget, _nestedTargetSelector);
        const baseAssertion = isNestedTarget
          ? !ignoreTargetChange(mutationTarget, attributeName, oldValue, attributeValue)
          : notOnlyAttrChanged || contentAttrChanged;
        const contentFinalChanged = baseAssertion && !ignoreContentChange(mutation, !!isNestedTarget, target, options);
        push(totalAddedNodes, addedNodes);
        contentChanged = contentChanged || contentFinalChanged;
        childListChanged = childListChanged || isChildListType;
      }

      if (
        !isContentObserver &&
        targetIsMutationTarget &&
        attributeChanged &&
        !ignoreTargetChange(mutationTarget, attributeName, oldValue, attributeValue)
      ) {
        push(targetChangedAttrs, attributeName);
        targetStyleChanged = targetStyleChanged || styleChangingAttrChanged;
      }
    });

    if (childListChanged && !isEmptyArray(totalAddedNodes)) {
      updateEventContentChangeElements((selector) =>
        totalAddedNodes.reduce((arr, node) => {
          push(arr, find(selector, node));
          return is(node, selector) ? push(arr, node) : arr;
        }, [])
      );
    }

    if (isContentObserver) {
      contentChanged && callback(false);
    } else if (!isEmptyArray(targetChangedAttrs) || targetStyleChanged) {
      callback(targetChangedAttrs, targetStyleChanged);
    }
  };

  const mutationObserver = new MutationObserverConstructor(observerCallback);
  mutationObserver.observe(target, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: observedAttributes,
    subtree: isContentObserver,
    childList: isContentObserver,
    characterData: isContentObserver,
  });
  isConnected = true;
  return {
    _destroy: () => {
      if (isConnected) {
        destroyEventContentChange();
        mutationObserver.disconnect();
        isConnected = false;
      }
    },
    _update: () => {
      if (isConnected) {
        observerCallback(mutationObserver.takeRecords());
      }
    },
  };
};

const ignorePrefix = 'os-';
const viewportAttrsFromTarget = ['tabindex'];
const baseStyleChangingAttrsTextarea = ['wrap', 'cols', 'rows'];
const baseStyleChangingAttrs = ['id', 'class', 'style', 'open'];

const ignoreTargetChange = (target, attrName, oldValue, newValue) => {
  if (attrName === 'class' && oldValue && newValue) {
    const diff = diffClass(oldValue, newValue);
    return !!diff.find((addedOrRemovedClass) => addedOrRemovedClass.indexOf(ignorePrefix) !== 0);
  }

  return false;
};

const lifecycleHubOservers = (instance, updateLifecycles) => {
  let debounceTimeout;
  let debounceMaxDelay;
  let contentMutationObserver;
  const { _structureSetup } = instance;
  const { _targetObj, _targetCtx } = _structureSetup;
  const { _host, _viewport, _content } = _targetObj;
  const { _isTextarea } = _targetCtx;
  const { _nativeScrollbarStyling, _flexboxGlue } = getEnvironment();
  const contentMutationObserverAttr = _isTextarea ? baseStyleChangingAttrsTextarea : baseStyleChangingAttrs.concat(baseStyleChangingAttrsTextarea);
  const updateLifecyclesWithDebouncedAdaptiveUpdateHints = debounce(updateLifecycles, {
    _timeout: () => debounceTimeout,
    _maxDelay: () => debounceMaxDelay,

    _mergeParams(prev, curr) {
      const { _sizeChanged: prevSizeChanged, _hostMutation: prevHostMutation, _contentMutation: prevContentMutation } = prev[0];
      const { _sizeChanged: currSizeChanged, _hostMutation: currvHostMutation, _contentMutation: currContentMutation } = curr[0];
      const merged = [
        {
          _sizeChanged: prevSizeChanged || currSizeChanged,
          _hostMutation: prevHostMutation || currvHostMutation,
          _contentMutation: prevContentMutation || currContentMutation,
        },
      ];
      return merged;
    },
  });

  const updateViewportAttrsFromHost = (attributes) => {
    each(attributes || viewportAttrsFromTarget, (attribute) => {
      if (indexOf(viewportAttrsFromTarget, attribute) > -1) {
        const hostAttr = attr(_host, attribute);

        if (isString(hostAttr)) {
          attr(_viewport, attribute, hostAttr);
        } else {
          removeAttr(_viewport, attribute);
        }
      }
    });
  };

  const onTrinsicChanged = (heightIntrinsic) => {
    updateLifecycles({
      _heightIntrinsic: heightIntrinsic,
    });
  };

  const onSizeChanged = ({ _sizeChanged, _directionIsRTLCache, _appear }) => {
    const updateFn = !_sizeChanged || _appear ? updateLifecycles : updateLifecyclesWithDebouncedAdaptiveUpdateHints;
    updateFn({
      _sizeChanged,
      _directionIsRTL: _directionIsRTLCache,
    });
  };

  const onContentMutation = (contentChangedTroughEvent) => {
    const updateFn = contentChangedTroughEvent ? updateLifecycles : updateLifecyclesWithDebouncedAdaptiveUpdateHints;
    updateFn({
      _contentMutation: true,
    });
  };

  const onHostMutation = (targetChangedAttrs, targetStyleChanged) => {
    if (targetStyleChanged) {
      updateLifecyclesWithDebouncedAdaptiveUpdateHints({
        _hostMutation: true,
      });
    } else {
      updateViewportAttrsFromHost(targetChangedAttrs);
    }
  };

  const trinsicObserver = (_content || !_flexboxGlue) && createTrinsicObserver(_host, onTrinsicChanged);
  const sizeObserver = createSizeObserver(_host, onSizeChanged, {
    _appear: true,
    _direction: !_nativeScrollbarStyling,
  });
  const hostMutationObserver = createDOMObserver(_host, false, onHostMutation, {
    _styleChangingAttributes: baseStyleChangingAttrs,
    _attributes: baseStyleChangingAttrs.concat(viewportAttrsFromTarget),
    _ignoreTargetChange: ignoreTargetChange,
  });

  const updateOptions = (checkOption) => {
    const { _value: elementEvents, _changed: elementEventsChanged } = checkOption('updating.elementEvents');
    const { _value: attributes, _changed: attributesChanged } = checkOption('updating.attributes');
    const { _value: debounce, _changed: debounceChanged } = checkOption('updating.debounce');
    const updateContentMutationObserver = elementEventsChanged || attributesChanged;

    if (updateContentMutationObserver) {
      if (contentMutationObserver) {
        contentMutationObserver._update();

        contentMutationObserver._destroy();
      }

      contentMutationObserver = createDOMObserver(_content || _viewport, true, onContentMutation, {
        _styleChangingAttributes: contentMutationObserverAttr.concat(attributes || []),
        _attributes: contentMutationObserverAttr.concat(attributes || []),
        _eventContentChange: elementEvents,
        _ignoreNestedTargetChange: ignoreTargetChange,
      });
    }

    if (debounceChanged) {
      updateLifecyclesWithDebouncedAdaptiveUpdateHints._flush();

      if (isArray(debounce)) {
        const timeout = debounce[0];
        const maxWait = debounce[1];
        debounceTimeout = isNumber(timeout) ? timeout : false;
        debounceMaxDelay = isNumber(maxWait) ? maxWait : false;
      } else if (isNumber(debounce)) {
        debounceTimeout = debounce;
        debounceMaxDelay = false;
      } else {
        debounceTimeout = false;
        debounceMaxDelay = false;
      }
    }
  };

  updateViewportAttrsFromHost();
  return {
    _trinsicObserver: trinsicObserver,
    _sizeObserver: sizeObserver,
    _updateObserverOptions: updateOptions,

    _destroy() {
      contentMutationObserver && contentMutationObserver._destroy();
      trinsicObserver && trinsicObserver._destroy();

      sizeObserver._destroy();

      hostMutationObserver._destroy();
    },
  };
};

const createTrinsicLifecycle = (lifecycleHub) => {
  const { _structureSetup } = lifecycleHub;
  const { _content } = _structureSetup._targetObj;
  return (updateHints) => {
    const { _heightIntrinsic } = updateHints;
    const { _value: heightIntrinsic, _changed: heightIntrinsicChanged } = _heightIntrinsic;

    if (heightIntrinsicChanged) {
      style(_content, {
        height: heightIntrinsic ? '' : '100%',
        display: heightIntrinsic ? '' : 'inline',
      });
    }

    return {
      _sizeChanged: heightIntrinsicChanged,
      _contentMutation: heightIntrinsicChanged,
    };
  };
};

const createPaddingLifecycle = (lifecycleHub) => {
  const { _structureSetup, _setLifecycleCommunication } = lifecycleHub;
  const { _host, _padding, _viewport } = _structureSetup._targetObj;
  const { _update: updatePaddingCache, _current: currentPaddingCache } = createCache(topRightBottomLeft.bind(0, _host, 'padding'), {
    _equal: equalTRBL,
    _initialValue: topRightBottomLeft(),
  });
  return (updateHints, checkOption, force) => {
    let { _value: padding, _changed: paddingChanged } = currentPaddingCache(force);
    const { _nativeScrollbarStyling, _flexboxGlue } = getEnvironment();
    const { _sizeChanged, _directionIsRTL, _contentMutation } = updateHints;
    const { _value: directionIsRTL, _changed: directionChanged } = _directionIsRTL;
    const { _value: paddingAbsolute, _changed: paddingAbsoluteChanged } = checkOption('paddingAbsolute');
    const contentMutation = !_flexboxGlue && _contentMutation;

    if (_sizeChanged || paddingChanged || contentMutation) {
      ({ _value: padding, _changed: paddingChanged } = updatePaddingCache(force));
    }

    const paddingStyleChanged = paddingAbsoluteChanged || directionChanged || paddingChanged;

    if (paddingStyleChanged) {
      const paddingRelative = !paddingAbsolute || (!_padding && !_nativeScrollbarStyling);
      const paddingHorizontal = padding.r + padding.l;
      const paddingVertical = padding.t + padding.b;
      const paddingStyle = {
        marginRight: paddingRelative && !directionIsRTL ? -paddingHorizontal : 0,
        marginBottom: paddingRelative ? -paddingVertical : 0,
        marginLeft: paddingRelative && directionIsRTL ? -paddingHorizontal : 0,
        top: paddingRelative ? -padding.t : 0,
        right: paddingRelative ? (directionIsRTL ? -padding.r : 'auto') : 0,
        left: paddingRelative ? (directionIsRTL ? 'auto' : -padding.l) : 0,
        width: paddingRelative ? `calc(100% + ${paddingHorizontal}px)` : '',
      };
      const viewportStyle = {
        paddingTop: paddingRelative ? padding.t : 0,
        paddingRight: paddingRelative ? padding.r : 0,
        paddingBottom: paddingRelative ? padding.b : 0,
        paddingLeft: paddingRelative ? padding.l : 0,
      };
      style(_padding || _viewport, paddingStyle);
      style(_viewport, viewportStyle);

      _setLifecycleCommunication({
        _paddingInfo: {
          _absolute: !paddingRelative,
          _padding: padding,
        },
        _viewportPaddingStyle: _padding ? viewportStyle : _extends_1({}, paddingStyle, viewportStyle),
      });
    }

    return {
      _paddingStyleChanged: paddingStyleChanged,
    };
  };
};

const { max, abs: abs$1, round: round$1 } = Math;
const overlaidScrollbarsHideOffset = 42;
const whCacheOptions = {
  _equal: equalWH,
  _initialValue: {
    w: 0,
    h: 0,
  },
};

const sizeFraction = (elm) => {
  const viewportOffsetSize = offsetSize(elm);
  const viewportRect = getBoundingClientRect(elm);
  return {
    w: viewportRect.width - viewportOffsetSize.w,
    h: viewportRect.height - viewportOffsetSize.h,
  };
};

const fractionalPixelRatioTollerance = () => (window.devicePixelRatio % 1 === 0 ? 0 : 1);

const setAxisOverflowStyle = (horizontal, overflowAmount, behavior, styleObj) => {
  const overflowKey = horizontal ? 'overflowX' : 'overflowY';
  const behaviorIsVisible = behavior.indexOf('visible') === 0;
  const behaviorIsVisibleHidden = behavior === 'visible-hidden';
  const behaviorIsScroll = behavior === 'scroll';
  const hasOverflow = overflowAmount > 0;

  if (behaviorIsVisible) {
    styleObj[overflowKey] = 'visible';
  }

  if (behaviorIsScroll && hasOverflow) {
    styleObj[overflowKey] = behavior;
  }

  return {
    _visible: behaviorIsVisible,
    _behavior: behaviorIsVisibleHidden ? 'hidden' : 'scroll',
  };
};

const createOverflowLifecycle = (lifecycleHub) => {
  const { _structureSetup, _doViewportArrange, _getLifecycleCommunication, _setLifecycleCommunication } = lifecycleHub;
  const { _host, _viewport, _viewportArrange } = _structureSetup._targetObj;
  const { _update: updateViewportSizeFraction, _current: getCurrentViewportSizeFraction } = createCache(
    sizeFraction.bind(0, _viewport),
    whCacheOptions
  );
  const { _update: updateViewportScrollSizeCache, _current: getCurrentViewportScrollSizeCache } = createCache(
    scrollSize.bind(0, _viewport),
    whCacheOptions
  );
  const { _update: updateOverflowAmountCache, _current: getCurrentOverflowAmountCache } = createCache(
    ({ _viewportScrollSize, _viewportClientSize, _viewportSizeFraction }) => ({
      w: max(
        0,
        round$1(max(0, _viewportScrollSize.w - _viewportClientSize.w) - (fractionalPixelRatioTollerance() || max(0, _viewportSizeFraction.w)))
      ),
      h: max(
        0,
        round$1(max(0, _viewportScrollSize.h - _viewportClientSize.h) - (fractionalPixelRatioTollerance() || max(0, _viewportSizeFraction.h)))
      ),
    }),
    whCacheOptions
  );

  const fixFlexboxGlue = (viewportOverflowState, heightIntrinsic) => {
    style(_viewport, {
      height: '',
    });

    if (heightIntrinsic) {
      const { _absolute: paddingAbsolute, _padding: padding } = _getLifecycleCommunication()._paddingInfo;

      const { _overflowScroll, _scrollbarsHideOffset } = viewportOverflowState;
      const hostSizeFraction = sizeFraction(_host);
      const hostClientSize = clientSize(_host);
      const paddingVertical = paddingAbsolute || style(_viewport, 'boxSizing') === 'content-box' ? padding.b + padding.t : 0;
      const fractionalClientHeight = hostClientSize.h + (abs$1(hostSizeFraction.h) < 1 ? hostSizeFraction.h : 0);
      style(_viewport, {
        height: fractionalClientHeight + (_overflowScroll.x ? _scrollbarsHideOffset.x : 0) - paddingVertical,
      });
    }
  };

  const getViewportOverflowState = (showNativeOverlaidScrollbars, viewportStyleObj) => {
    const { _nativeScrollbarSize, _nativeScrollbarIsOverlaid, _nativeScrollbarStyling } = getEnvironment();
    const { x: overlaidX, y: overlaidY } = _nativeScrollbarIsOverlaid;
    const determineOverflow = !viewportStyleObj;
    const arrangeHideOffset = !_nativeScrollbarStyling && !showNativeOverlaidScrollbars ? overlaidScrollbarsHideOffset : 0;
    const styleObj = determineOverflow ? style(_viewport, ['overflowX', 'overflowY']) : viewportStyleObj;
    const scroll = {
      x: styleObj.overflowX === 'scroll',
      y: styleObj.overflowY === 'scroll',
    };
    const scrollbarsHideOffset = {
      x: scroll.x && !_nativeScrollbarStyling ? (overlaidX ? arrangeHideOffset : _nativeScrollbarSize.x) : 0,
      y: scroll.y && !_nativeScrollbarStyling ? (overlaidY ? arrangeHideOffset : _nativeScrollbarSize.y) : 0,
    };
    return {
      _overflowScroll: scroll,
      _scrollbarsHideOffsetArrange: {
        x: overlaidX && !!arrangeHideOffset,
        y: overlaidY && !!arrangeHideOffset,
      },
      _scrollbarsHideOffset: scrollbarsHideOffset,
    };
  };

  const setViewportOverflowState = (showNativeOverlaidScrollbars, overflowAmount, overflow, viewportStyleObj) => {
    const { _visible: xVisible, _behavior: xVisibleBehavior } = setAxisOverflowStyle(true, overflowAmount.w, overflow.x, viewportStyleObj);
    const { _visible: yVisible, _behavior: yVisibleBehavior } = setAxisOverflowStyle(false, overflowAmount.h, overflow.y, viewportStyleObj);

    if (xVisible && !yVisible) {
      viewportStyleObj.overflowX = xVisibleBehavior;
    }

    if (yVisible && !xVisible) {
      viewportStyleObj.overflowY = yVisibleBehavior;
    }

    return getViewportOverflowState(showNativeOverlaidScrollbars, viewportStyleObj);
  };

  const arrangeViewport = (viewportOverflowState, viewportScrollSize, viewportSizeFraction, directionIsRTL) => {
    if (_doViewportArrange) {
      const { _scrollbarsHideOffset, _scrollbarsHideOffsetArrange } = viewportOverflowState;
      const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
      const { x: hideOffsetX, y: hideOffsetY } = _scrollbarsHideOffset;

      const { _viewportPaddingStyle: viewportPaddingStyle } = _getLifecycleCommunication();

      const viewportArrangeHorizontalPaddingKey = directionIsRTL ? 'paddingRight' : 'paddingLeft';
      const viewportArrangeHorizontalPaddingValue = viewportPaddingStyle[viewportArrangeHorizontalPaddingKey];
      const viewportArrangeVerticalPaddingValue = viewportPaddingStyle.paddingTop;
      const fractionalContentWidth = viewportScrollSize.w + (abs$1(viewportSizeFraction.w) < 1 ? viewportSizeFraction.w : 0);
      const fractionalContenHeight = viewportScrollSize.h + (abs$1(viewportSizeFraction.h) < 1 ? viewportSizeFraction.h : 0);
      const arrangeSize = {
        w: hideOffsetY && arrangeY ? `${hideOffsetY + fractionalContentWidth - viewportArrangeHorizontalPaddingValue}px` : '',
        h: hideOffsetX && arrangeX ? `${hideOffsetX + fractionalContenHeight - viewportArrangeVerticalPaddingValue}px` : '',
      };

      if (_viewportArrange) {
        const { sheet } = _viewportArrange;

        if (sheet) {
          const { cssRules } = sheet;

          if (cssRules) {
            if (!cssRules.length) {
              sheet.insertRule(`#${attr(_viewportArrange, 'id')} + .${classNameViewportArrange}::before {}`, 0);
            }

            const ruleStyle = cssRules[0].style;
            ruleStyle.width = arrangeSize.w;
            ruleStyle.height = arrangeSize.h;
          }
        }
      } else {
        style(_viewport, {
          '--os-vaw': arrangeSize.w,
          '--os-vah': arrangeSize.h,
        });
      }
    }

    return _doViewportArrange;
  };

  const hideNativeScrollbars = (viewportOverflowState, directionIsRTL, viewportArrange, viewportStyleObj) => {
    const { _scrollbarsHideOffset, _scrollbarsHideOffsetArrange } = viewportOverflowState;
    const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
    const { x: hideOffsetX, y: hideOffsetY } = _scrollbarsHideOffset;

    const { _viewportPaddingStyle: viewportPaddingStyle } = _getLifecycleCommunication();

    const horizontalMarginKey = directionIsRTL ? 'marginLeft' : 'marginRight';
    const viewportHorizontalPaddingKey = directionIsRTL ? 'paddingLeft' : 'paddingRight';
    const horizontalMarginValue = viewportPaddingStyle[horizontalMarginKey];
    const verticalMarginValue = viewportPaddingStyle.marginBottom;
    const horizontalPaddingValue = viewportPaddingStyle[viewportHorizontalPaddingKey];
    const verticalPaddingValue = viewportPaddingStyle.paddingBottom;
    viewportStyleObj.width = `calc(100% + ${hideOffsetY + horizontalMarginValue * -1}px)`;
    viewportStyleObj[horizontalMarginKey] = -hideOffsetY + horizontalMarginValue;
    viewportStyleObj.marginBottom = -hideOffsetX + verticalMarginValue;

    if (viewportArrange) {
      viewportStyleObj[viewportHorizontalPaddingKey] = horizontalPaddingValue + (arrangeY ? hideOffsetY : 0);
      viewportStyleObj.paddingBottom = verticalPaddingValue + (arrangeX ? hideOffsetX : 0);
    }
  };

  const undoViewportArrange = (showNativeOverlaidScrollbars, directionIsRTL, viewportOverflowState) => {
    if (_doViewportArrange) {
      const finalViewportOverflowState = viewportOverflowState || getViewportOverflowState(showNativeOverlaidScrollbars);

      const { _viewportPaddingStyle: viewportPaddingStyle } = _getLifecycleCommunication();

      const { _flexboxGlue } = getEnvironment();
      const { _scrollbarsHideOffsetArrange } = finalViewportOverflowState;
      const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
      const finalPaddingStyle = {};

      const assignProps = (props) =>
        each(props.split(' '), (prop) => {
          finalPaddingStyle[prop] = viewportPaddingStyle[prop];
        });

      if (!_flexboxGlue) {
        finalPaddingStyle.height = '';
      }

      if (arrangeX) {
        assignProps('marginBottom paddingTop paddingBottom');
      }

      if (arrangeY) {
        assignProps('marginLeft marginRight paddingLeft paddingRight');
      }

      const prevStyle = style(_viewport, keys(finalPaddingStyle));
      removeClass(_viewport, classNameViewportArrange);
      style(_viewport, finalPaddingStyle);
      return {
        _redoViewportArrange: () => {
          hideNativeScrollbars(finalViewportOverflowState, directionIsRTL, _doViewportArrange, prevStyle);
          style(_viewport, prevStyle);
          addClass(_viewport, classNameViewportArrange);
        },
        _viewportOverflowState: finalViewportOverflowState,
      };
    }

    return {
      _redoViewportArrange: noop,
    };
  };

  return (updateHints, checkOption, force) => {
    const { _directionIsRTL, _heightIntrinsic, _sizeChanged, _hostMutation, _contentMutation, _paddingStyleChanged } = updateHints;
    const { _flexboxGlue, _nativeScrollbarStyling, _nativeScrollbarIsOverlaid } = getEnvironment();
    const { _value: heightIntrinsic, _changed: heightIntrinsicChanged } = _heightIntrinsic;
    const { _value: directionIsRTL, _changed: directionChanged } = _directionIsRTL;
    const { _value: showNativeOverlaidScrollbarsOption, _changed: showNativeOverlaidScrollbarsChanged } = checkOption(
      'nativeScrollbarsOverlaid.show'
    );
    const showNativeOverlaidScrollbars = showNativeOverlaidScrollbarsOption && _nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y;
    const adjustFlexboxGlue =
      !_flexboxGlue && (_sizeChanged || _contentMutation || _hostMutation || showNativeOverlaidScrollbarsChanged || heightIntrinsicChanged);
    let viewportSizeFractionCache = getCurrentViewportSizeFraction(force);
    let viewportScrollSizeCache = getCurrentViewportScrollSizeCache(force);
    let overflowAmuntCache = getCurrentOverflowAmountCache(force);
    let preMeasureViewportOverflowState;

    if (showNativeOverlaidScrollbarsChanged && _nativeScrollbarStyling) {
      if (showNativeOverlaidScrollbars) {
        removeClass(_viewport, classNameViewportScrollbarStyling);
      } else {
        addClass(_viewport, classNameViewportScrollbarStyling);
      }
    }

    if (adjustFlexboxGlue) {
      preMeasureViewportOverflowState = getViewportOverflowState(showNativeOverlaidScrollbars);
      fixFlexboxGlue(preMeasureViewportOverflowState, !!heightIntrinsic);
    }

    if (_sizeChanged || _paddingStyleChanged || _contentMutation || showNativeOverlaidScrollbarsChanged || directionChanged) {
      const { _redoViewportArrange, _viewportOverflowState: undoViewportArrangeOverflowState } = undoViewportArrange(
        showNativeOverlaidScrollbars,
        directionIsRTL,
        preMeasureViewportOverflowState
      );
      const { _value: _viewportSizeFraction2, _changed: viewportSizeFractionCahnged } = (viewportSizeFractionCache = updateViewportSizeFraction(
        force
      ));
      const { _value: _viewportScrollSize2, _changed: _viewportScrollSizeChanged } = (viewportScrollSizeCache = updateViewportScrollSizeCache(force));
      const viewportContentSize = clientSize(_viewport);
      let arrangedViewportScrollSize = _viewportScrollSize2;
      let arrangedViewportClientSize = viewportContentSize;

      _redoViewportArrange();

      if (
        (_viewportScrollSizeChanged || viewportSizeFractionCahnged || showNativeOverlaidScrollbarsChanged) &&
        undoViewportArrangeOverflowState &&
        !showNativeOverlaidScrollbars &&
        arrangeViewport(undoViewportArrangeOverflowState, _viewportScrollSize2, _viewportSizeFraction2, directionIsRTL)
      ) {
        arrangedViewportClientSize = clientSize(_viewport);
        arrangedViewportScrollSize = scrollSize(_viewport);
      }

      overflowAmuntCache = updateOverflowAmountCache(force, {
        _viewportSizeFraction: _viewportSizeFraction2,
        _viewportScrollSize: {
          w: max(_viewportScrollSize2.w, arrangedViewportScrollSize.w),
          h: max(_viewportScrollSize2.h, arrangedViewportScrollSize.h),
        },
        _viewportClientSize: {
          w: arrangedViewportClientSize.w + max(0, viewportContentSize.w - _viewportScrollSize2.w),
          h: arrangedViewportClientSize.h + max(0, viewportContentSize.h - _viewportScrollSize2.h),
        },
      });
    }

    const { _value: viewportSizeFraction, _changed: viewportSizeFractionChanged } = viewportSizeFractionCache;
    const { _value: viewportScrollSize, _changed: viewportScrollSizeChanged } = viewportScrollSizeCache;
    const { _value: overflowAmount, _changed: overflowAmountChanged } = overflowAmuntCache;
    const { _value: overflow, _changed: overflowChanged } = checkOption('overflow');

    if (
      _paddingStyleChanged ||
      viewportSizeFractionChanged ||
      viewportScrollSizeChanged ||
      overflowAmountChanged ||
      overflowChanged ||
      showNativeOverlaidScrollbarsChanged ||
      directionChanged ||
      adjustFlexboxGlue
    ) {
      const viewportStyle = {
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        width: '',
        overflowY: '',
        overflowX: '',
      };
      const viewportOverflowState = setViewportOverflowState(showNativeOverlaidScrollbars, overflowAmount, overflow, viewportStyle);
      const viewportArranged = arrangeViewport(viewportOverflowState, viewportScrollSize, viewportSizeFraction, directionIsRTL);
      hideNativeScrollbars(viewportOverflowState, directionIsRTL, viewportArranged, viewportStyle);

      if (adjustFlexboxGlue) {
        fixFlexboxGlue(viewportOverflowState, !!heightIntrinsic);
      }

      style(_viewport, viewportStyle);

      _setLifecycleCommunication({
        _viewportOverflowScroll: viewportOverflowState._overflowScroll,
        _viewportOverflowAmount: overflowAmount,
      });
    }
  };
};

const getPropByPath = (obj, path) =>
  obj ? path.split('.').reduce((o, prop) => (o && hasOwnProperty$1(o, prop) ? o[prop] : undefined), obj) : undefined;

const booleanCacheValuesFallback = {
  _value: false,
  _previous: false,
  _changed: false,
};
const lifecycleCommunicationFallback = {
  _paddingInfo: {
    _absolute: false,
    _padding: {
      t: 0,
      r: 0,
      b: 0,
      l: 0,
    },
  },
  _viewportOverflowScroll: {
    x: false,
    y: false,
  },
  _viewportOverflowAmount: {
    w: 0,
    h: 0,
  },
  _viewportPaddingStyle: {
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
};
const createLifecycleHub = (options, structureSetup) => {
  let lifecycleCommunication = lifecycleCommunicationFallback;
  const { _viewport } = structureSetup._targetObj;
  const {
    _nativeScrollbarStyling,
    _nativeScrollbarIsOverlaid,
    _flexboxGlue,
    _addListener: addEnvironmentListener,
    _removeListener: removeEnvironmentListener,
  } = getEnvironment();
  const doViewportArrange = !_nativeScrollbarStyling && (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y);
  const instance = {
    _options: options,
    _structureSetup: structureSetup,
    _doViewportArrange: doViewportArrange,
    _getLifecycleCommunication: () => lifecycleCommunication,

    _setLifecycleCommunication(newLifecycleCommunication) {
      lifecycleCommunication = assignDeep({}, lifecycleCommunication, newLifecycleCommunication);
    },
  };
  const lifecycles = [createTrinsicLifecycle(instance), createPaddingLifecycle(instance), createOverflowLifecycle(instance)];

  const updateLifecycles = (updateHints, changedOptions, force) => {
    let {
      _directionIsRTL,
      _heightIntrinsic,
      _sizeChanged = force || false,
      _hostMutation = force || false,
      _contentMutation = force || false,
      _paddingStyleChanged = force || false,
    } = updateHints || {};
    const finalDirectionIsRTL =
      _directionIsRTL || (_sizeObserver ? _sizeObserver._getCurrentCacheValues(force)._directionIsRTL : booleanCacheValuesFallback);
    const finalHeightIntrinsic =
      _heightIntrinsic || (_trinsicObserver ? _trinsicObserver._getCurrentCacheValues(force)._heightIntrinsic : booleanCacheValuesFallback);

    const checkOption = (path) => ({
      _value: getPropByPath(options, path),
      _changed: force || getPropByPath(changedOptions, path) !== undefined,
    });

    const adjustScrollOffset = doViewportArrange || !_flexboxGlue;
    const scrollOffsetX = adjustScrollOffset && scrollLeft(_viewport);
    const scrollOffsetY = adjustScrollOffset && scrollTop(_viewport);

    if (_updateObserverOptions) {
      _updateObserverOptions(checkOption);
    }

    each(lifecycles, (lifecycle) => {
      const {
        _sizeChanged: adaptiveSizeChanged,
        _hostMutation: adaptiveHostMutation,
        _contentMutation: adaptiveContentMutation,
        _paddingStyleChanged: adaptivePaddingStyleChanged,
      } =
        lifecycle(
          {
            _directionIsRTL: finalDirectionIsRTL,
            _heightIntrinsic: finalHeightIntrinsic,
            _sizeChanged,
            _hostMutation,
            _contentMutation,
            _paddingStyleChanged,
          },
          checkOption,
          !!force
        ) || {};
      _sizeChanged = adaptiveSizeChanged || _sizeChanged;
      _hostMutation = adaptiveHostMutation || _hostMutation;
      _contentMutation = adaptiveContentMutation || _contentMutation;
      _paddingStyleChanged = adaptivePaddingStyleChanged || _paddingStyleChanged;
    });

    if (isNumber(scrollOffsetX)) {
      scrollLeft(_viewport, scrollOffsetX);
    }

    if (isNumber(scrollOffsetY)) {
      scrollTop(_viewport, scrollOffsetY);
    }

    if (options.callbacks.onUpdated) {
      options.callbacks.onUpdated();
    }
  };

  const { _sizeObserver, _trinsicObserver, _updateObserverOptions, _destroy: destroyObservers } = lifecycleHubOservers(instance, updateLifecycles);

  const update = (changedOptions, force) => updateLifecycles(null, changedOptions, force);

  const envUpdateListener = update.bind(null, null, true);
  addEnvironmentListener(envUpdateListener);
  console.log(getEnvironment());
  return {
    _update: update,
    _state: () => ({
      _overflowAmount: lifecycleCommunication._viewportOverflowAmount,
    }),

    _destroy() {
      destroyObservers();
      removeEnvironmentListener(envUpdateListener);
    },
  };
};

const OverlayScrollbars = (target, options, extensions) => {
  const { _getDefaultOptions } = getEnvironment();
  const currentOptions = assignDeep({}, _getDefaultOptions(), validateOptions(options || {}, optionsTemplate, null, true)._validated);
  const structureSetup = createStructureSetup(target);
  const lifecycleHub = createLifecycleHub(currentOptions, structureSetup);
  const instance = {
    options(newOptions) {
      if (newOptions) {
        const { _validated: _changedOptions } = validateOptions(newOptions, optionsTemplate, currentOptions, true);

        if (!isEmptyObject(_changedOptions)) {
          assignDeep(currentOptions, _changedOptions);

          lifecycleHub._update(_changedOptions);
        }
      }

      return currentOptions;
    },

    state: () => lifecycleHub._state(),

    update(force) {
      lifecycleHub._update(null, force);
    },
  };
  instance.update(true);
  return instance;
};

export default OverlayScrollbars;
//# sourceMappingURL=overlayscrollbars.esm.js.map
