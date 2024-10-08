import {
  FORMKIT_VERSION,
  camel,
  clearErrors2,
  clone,
  cloneAny,
  compile,
  createClasses,
  createConfig,
  createMessage,
  createNode,
  empty,
  eq,
  error,
  errorHandler,
  except,
  extend,
  generateClassList,
  getNode,
  has,
  isComponent,
  isConditional,
  isDOM,
  isNode,
  isObject,
  isPojo,
  kebab,
  nodeProps,
  oncePerTick,
  only,
  regexForFormat,
  reset,
  resetCount,
  setErrors2,
  shallowClone,
  slugify,
  stopWatch,
  submitForm,
  sugar,
  token,
  undefine,
  warn,
  warningHandler,
  watchRegistry
} from "./chunk-X5V4WBLG.js";
import {
  KeepAlive,
  Suspense,
  computed,
  createTextVNode,
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  isReactive,
  isRef,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  provide,
  reactive,
  ref,
  resolveComponent,
  toRef,
  triggerRef,
  watch,
  watchEffect
} from "./chunk-Q5PGHB6G.js";
import {
  __export
} from "./chunk-PZ5AY32C.js";

// node_modules/@formkit/observer/dist/index.dev.mjs
var revokedObservers = /* @__PURE__ */ new WeakSet();
function createObserver(node, dependencies) {
  const deps = dependencies || Object.assign(/* @__PURE__ */ new Map(), { active: false });
  const receipts = /* @__PURE__ */ new Map();
  const addDependency = function(event) {
    var _a;
    if (!deps.active)
      return;
    if (!deps.has(node))
      deps.set(node, /* @__PURE__ */ new Set());
    (_a = deps.get(node)) == null ? void 0 : _a.add(event);
  };
  const observeProps = function(props) {
    return new Proxy(props, {
      get(...args) {
        typeof args[1] === "string" && addDependency(`prop:${args[1]}`);
        return Reflect.get(...args);
      }
    });
  };
  const observeLedger = function(ledger) {
    return new Proxy(ledger, {
      get(...args) {
        if (args[1] === "value") {
          return (key) => {
            addDependency(`count:${key}`);
            return ledger.value(key);
          };
        }
        return Reflect.get(...args);
      }
    });
  };
  const observe = function(value, property) {
    if (isNode(value)) {
      return createObserver(value, deps);
    }
    if (property === "value")
      addDependency("commit");
    if (property === "_value")
      addDependency("input");
    if (property === "props")
      return observeProps(value);
    if (property === "ledger")
      return observeLedger(value);
    if (property === "children") {
      addDependency("child");
      addDependency("childRemoved");
    }
    return value;
  };
  const {
    proxy: observed,
    revoke
  } = Proxy.revocable(node, {
    get(...args) {
      switch (args[1]) {
        case "_node":
          return node;
        case "deps":
          return deps;
        case "watch":
          return (block, after, pos) => watch2(observed, block, after, pos);
        case "observe":
          return () => {
            const old = new Map(deps);
            deps.clear();
            deps.active = true;
            return old;
          };
        case "stopObserve":
          return () => {
            const newDeps = new Map(deps);
            deps.active = false;
            return newDeps;
          };
        case "receipts":
          return receipts;
        case "kill":
          return () => {
            removeListeners(receipts);
            revokedObservers.add(args[2]);
            revoke();
            return void 0;
          };
      }
      const value = Reflect.get(...args);
      if (typeof value === "function") {
        return (...subArgs) => {
          const subValue = value(...subArgs);
          return observe(subValue, args[1]);
        };
      }
      return observe(value, args[1]);
    }
  });
  return observed;
}
function applyListeners(node, [toAdd, toRemove], callback, pos) {
  toAdd.forEach((events, depNode) => {
    events.forEach((event) => {
      node.receipts.has(depNode) || node.receipts.set(depNode, {});
      const events2 = node.receipts.get(depNode) ?? {};
      events2[event] = events2[event] ?? [];
      events2[event].push(depNode.on(event, callback, pos));
      node.receipts.set(depNode, events2);
    });
  });
  toRemove.forEach((events, depNode) => {
    events.forEach((event) => {
      if (node.receipts.has(depNode)) {
        const nodeReceipts = node.receipts.get(depNode);
        if (nodeReceipts && has(nodeReceipts, event)) {
          nodeReceipts[event].map(depNode.off);
          delete nodeReceipts[event];
          node.receipts.set(depNode, nodeReceipts);
        }
      }
    });
  });
}
function removeListeners(receipts) {
  receipts.forEach((events, node) => {
    for (const event in events) {
      events[event].map(node.off);
    }
  });
  receipts.clear();
}
function watch2(node, block, after, pos) {
  const doAfterObservation = (res2) => {
    const newDeps = node.stopObserve();
    applyListeners(
      node,
      diffDeps(oldDeps, newDeps),
      () => watch2(node, block, after, pos),
      pos
    );
    if (after)
      after(res2);
  };
  const oldDeps = new Map(node.deps);
  node.observe();
  const res = block(node);
  if (res instanceof Promise)
    res.then((val) => doAfterObservation(val));
  else
    doAfterObservation(res);
}
function diffDeps(previous, current) {
  const toAdd = /* @__PURE__ */ new Map();
  const toRemove = /* @__PURE__ */ new Map();
  current.forEach((events, node) => {
    if (!previous.has(node)) {
      toAdd.set(node, events);
    } else {
      const eventsToAdd = /* @__PURE__ */ new Set();
      const previousEvents = previous.get(node);
      events.forEach(
        (event) => !(previousEvents == null ? void 0 : previousEvents.has(event)) && eventsToAdd.add(event)
      );
      toAdd.set(node, eventsToAdd);
    }
  });
  previous.forEach((events, node) => {
    if (!current.has(node)) {
      toRemove.set(node, events);
    } else {
      const eventsToRemove = /* @__PURE__ */ new Set();
      const newEvents = current.get(node);
      events.forEach(
        (event) => !(newEvents == null ? void 0 : newEvents.has(event)) && eventsToRemove.add(event)
      );
      toRemove.set(node, eventsToRemove);
    }
  });
  return [toAdd, toRemove];
}
function isKilled(node) {
  return revokedObservers.has(node);
}

// node_modules/@formkit/rules/dist/index.dev.mjs
var index_dev_exports = {};
__export(index_dev_exports, {
  accepted: () => accepted_default,
  alpha: () => alpha_default,
  alpha_spaces: () => alpha_spaces_default,
  alphanumeric: () => alphanumeric_default,
  between: () => between_default,
  confirm: () => confirm_default,
  contains_alpha: () => contains_alpha_default,
  contains_alpha_spaces: () => contains_alpha_spaces_default,
  contains_alphanumeric: () => contains_alphanumeric_default,
  contains_lowercase: () => contains_lowercase_default,
  contains_numeric: () => contains_numeric_default,
  contains_symbol: () => contains_symbol_default,
  contains_uppercase: () => contains_uppercase_default,
  date_after: () => date_after_default,
  date_before: () => date_before_default,
  date_between: () => date_between_default,
  date_format: () => date_format_default,
  email: () => email_default,
  ends_with: () => ends_with_default,
  is: () => is_default,
  length: () => length_default,
  lowercase: () => lowercase_default,
  matches: () => matches_default,
  max: () => max_default,
  min: () => min_default,
  not: () => not_default,
  number: () => number_default,
  require_one: () => require_one_default,
  required: () => required_default,
  starts_with: () => starts_with_default,
  symbol: () => symbol_default,
  uppercase: () => uppercase_default,
  url: () => url_default
});
var accepted = function accepted2({ value }) {
  return ["yes", "on", "1", 1, true, "true"].includes(value);
};
accepted.skipEmpty = false;
var accepted_default = accepted;
var date_after = function({ value }, compare = false) {
  const timestamp = Date.parse(compare || /* @__PURE__ */ new Date());
  const fieldValue = Date.parse(String(value));
  return isNaN(fieldValue) ? false : fieldValue > timestamp;
};
var date_after_default = date_after;
var alpha = function({ value }, set = "default") {
  const sets = {
    default: new RegExp("^\\p{L}+$", "u"),
    latin: /^[a-z]+$/i
  };
  const selectedSet = has(sets, set) ? set : "default";
  return sets[selectedSet].test(String(value));
};
var alpha_default = alpha;
var alpha_spaces = function({ value }, set = "default") {
  const sets = {
    default: /^[\p{L} ]+$/u,
    latin: /^[a-z ]+$/i
  };
  const selectedSet = has(sets, set) ? set : "default";
  return sets[selectedSet].test(String(value));
};
var alpha_spaces_default = alpha_spaces;
var alphanumeric = function({ value }, set = "default") {
  const sets = {
    default: /^[0-9\p{L}]+$/u,
    latin: /^[0-9a-z]+$/i
  };
  const selectedSet = has(sets, set) ? set : "default";
  return sets[selectedSet].test(String(value));
};
var alphanumeric_default = alphanumeric;
var date_before = function({ value }, compare = false) {
  const timestamp = Date.parse(compare || /* @__PURE__ */ new Date());
  const fieldValue = Date.parse(String(value));
  return isNaN(fieldValue) ? false : fieldValue < timestamp;
};
var date_before_default = date_before;
var between = function between2({ value }, from, to) {
  if (!isNaN(value) && !isNaN(from) && !isNaN(to)) {
    const val = 1 * value;
    from = Number(from);
    to = Number(to);
    const [a, b] = from <= to ? [from, to] : [to, from];
    return val >= 1 * a && val <= 1 * b;
  }
  return false;
};
var between_default = between;
var hasConfirm = /(_confirm(?:ed)?)$/;
var confirm = function confirm2(node, address, comparison = "loose") {
  var _a;
  if (!address) {
    address = hasConfirm.test(node.name) ? node.name.replace(hasConfirm, "") : `${node.name}_confirm`;
  }
  const foreignValue = (_a = node.at(address)) == null ? void 0 : _a.value;
  return comparison === "strict" ? node.value === foreignValue : node.value == foreignValue;
};
var confirm_default = confirm;
var contains_alpha = function({ value }, set = "default") {
  const sets = {
    default: new RegExp("\\p{L}", "u"),
    latin: /[a-z]/i
  };
  const selectedSet = has(sets, set) ? set : "default";
  return sets[selectedSet].test(String(value));
};
var contains_alpha_default = contains_alpha;
var contains_alpha_spaces = function({ value }, set = "default") {
  const sets = {
    default: /[\p{L} ]/u,
    latin: /[a-z ]/i
  };
  const selectedSet = has(sets, set) ? set : "default";
  return sets[selectedSet].test(String(value));
};
var contains_alpha_spaces_default = contains_alpha_spaces;
var contains_alphanumeric = function({ value }, set = "default") {
  const sets = {
    default: /[0-9\p{L}]/u,
    latin: /[0-9a-z]/i
  };
  const selectedSet = has(sets, set) ? set : "default";
  return sets[selectedSet].test(String(value));
};
var contains_alphanumeric_default = contains_alphanumeric;
var contains_lowercase = function({ value }, set = "default") {
  const sets = {
    default: new RegExp("\\p{Ll}", "u"),
    latin: /[a-z]/
  };
  const selectedSet = has(sets, set) ? set : "default";
  return sets[selectedSet].test(String(value));
};
var contains_lowercase_default = contains_lowercase;
var contains_numeric = function number({ value }) {
  return /[0-9]/.test(String(value));
};
var contains_numeric_default = contains_numeric;
var contains_symbol = function({ value }) {
  return /[!-/:-@[-`{-~]/.test(String(value));
};
var contains_symbol_default = contains_symbol;
var contains_uppercase = function({ value }, set = "default") {
  const sets = {
    default: new RegExp("\\p{Lu}", "u"),
    latin: /[A-Z]/
  };
  const selectedSet = has(sets, set) ? set : "default";
  return sets[selectedSet].test(String(value));
};
var contains_uppercase_default = contains_uppercase;
var date_between = function date_between2({ value }, dateA, dateB) {
  dateA = dateA instanceof Date ? dateA.getTime() : Date.parse(dateA);
  dateB = dateB instanceof Date ? dateB.getTime() : Date.parse(dateB);
  const compareTo = value instanceof Date ? value.getTime() : Date.parse(String(value));
  if (dateA && !dateB) {
    dateB = dateA;
    dateA = Date.now();
  } else if (!dateA || !compareTo) {
    return false;
  }
  return compareTo >= dateA && compareTo <= dateB;
};
var date_between_default = date_between;
var date_format = function date({ value }, format) {
  if (format && typeof format === "string") {
    return regexForFormat(format).test(String(value));
  }
  return !isNaN(Date.parse(String(value)));
};
var date_format_default = date_format;
var email = function email2({ value }) {
  const isEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return isEmail.test(String(value));
};
var email_default = email;
var ends_with = function ends_with2({ value }, ...stack) {
  if (typeof value === "string" && stack.length) {
    return stack.some((item) => {
      return value.endsWith(item);
    });
  } else if (typeof value === "string" && stack.length === 0) {
    return true;
  }
  return false;
};
var ends_with_default = ends_with;
var is = function is2({ value }, ...stack) {
  return stack.some((item) => {
    if (typeof item === "object") {
      return eq(item, value);
    }
    return item == value;
  });
};
var is_default = is;
var length = function length2({ value }, first = 0, second = Infinity) {
  first = parseInt(first);
  second = isNaN(parseInt(second)) ? Infinity : parseInt(second);
  const min3 = first <= second ? first : second;
  const max3 = second >= first ? second : first;
  if (typeof value === "string" || Array.isArray(value)) {
    return value.length >= min3 && value.length <= max3;
  } else if (value && typeof value === "object") {
    const length3 = Object.keys(value).length;
    return length3 >= min3 && length3 <= max3;
  }
  return false;
};
var length_default = length;
var lowercase = function({ value }, set = "default") {
  const sets = {
    default: new RegExp("^\\p{Ll}+$", "u"),
    allow_non_alpha: /^[0-9\p{Ll}!-/:-@[-`{-~]+$/u,
    allow_numeric: /^[0-9\p{Ll}]+$/u,
    allow_numeric_dashes: /^[0-9\p{Ll}-]+$/u,
    latin: /^[a-z]+$/
  };
  const selectedSet = has(sets, set) ? set : "default";
  return sets[selectedSet].test(String(value));
};
var lowercase_default = lowercase;
var matches = function matches2({ value }, ...stack) {
  return stack.some((pattern) => {
    if (typeof pattern === "string" && pattern.substr(0, 1) === "/" && pattern.substr(-1) === "/") {
      pattern = new RegExp(pattern.substr(1, pattern.length - 2));
    }
    if (pattern instanceof RegExp) {
      return pattern.test(String(value));
    }
    return pattern === value;
  });
};
var matches_default = matches;
var max = function max2({ value }, maximum = 10) {
  if (Array.isArray(value)) {
    return value.length <= maximum;
  }
  return Number(value) <= Number(maximum);
};
var max_default = max;
var min = function min2({ value }, minimum = 1) {
  if (Array.isArray(value)) {
    return value.length >= minimum;
  }
  return Number(value) >= Number(minimum);
};
var min_default = min;
var not = function not2({ value }, ...stack) {
  return !stack.some((item) => {
    if (typeof item === "object") {
      return eq(item, value);
    }
    return item === value;
  });
};
var not_default = not;
var number2 = function number3({ value }) {
  return !isNaN(value);
};
var number_default = number2;
var require_one = function(node, ...inputNames) {
  if (!empty(node.value))
    return true;
  const values = inputNames.map((name) => {
    var _a;
    return (_a = node.at(name)) == null ? void 0 : _a.value;
  });
  return values.some((value) => !empty(value));
};
require_one.skipEmpty = false;
var require_one_default = require_one;
var required = function required2({ value }, action = "default") {
  return action === "trim" && typeof value === "string" ? !empty(value.trim()) : !empty(value);
};
required.skipEmpty = false;
var required_default = required;
var starts_with = function starts_with2({ value }, ...stack) {
  if (typeof value === "string" && stack.length) {
    return stack.some((item) => {
      return value.startsWith(item);
    });
  } else if (typeof value === "string" && stack.length === 0) {
    return true;
  }
  return false;
};
var starts_with_default = starts_with;
var symbol = function({ value }) {
  return /^[!-/:-@[-`{-~]+$/.test(String(value));
};
var symbol_default = symbol;
var uppercase = function({ value }, set = "default") {
  const sets = {
    default: new RegExp("^\\p{Lu}+$", "u"),
    latin: /^[A-Z]+$/
  };
  const selectedSet = has(sets, set) ? set : "default";
  return sets[selectedSet].test(String(value));
};
var uppercase_default = uppercase;
var url = function url2({ value }, ...stack) {
  try {
    const protocols = stack.length ? stack : ["http:", "https:"];
    const url3 = new URL(String(value));
    return protocols.includes(url3.protocol);
  } catch {
    return false;
  }
};
var url_default = url;

// node_modules/@formkit/validation/dist/index.dev.mjs
var validatingMessage = createMessage({
  type: "state",
  blocking: true,
  visible: false,
  value: true,
  key: "validating"
});
function createValidationPlugin(baseRules = {}) {
  return function validationPlugin(node) {
    let propRules = cloneAny(node.props.validationRules || {});
    let availableRules = { ...baseRules, ...propRules };
    const state = { input: token(), rerun: null, isPassing: true };
    let validation = cloneAny(node.props.validation);
    node.on("prop:validation", ({ payload }) => reboot(payload, propRules));
    node.on(
      "prop:validationRules",
      ({ payload }) => reboot(validation, payload)
    );
    function reboot(newValidation, newRules) {
      var _a;
      if (eq(Object.keys(propRules || {}), Object.keys(newRules || {})) && eq(validation, newValidation))
        return;
      propRules = cloneAny(newRules);
      validation = cloneAny(newValidation);
      availableRules = { ...baseRules, ...propRules };
      (_a = node.props.parsedRules) == null ? void 0 : _a.forEach((validation2) => {
        removeMessage(validation2);
        removeListeners(validation2.observer.receipts);
        validation2.observer.kill();
      });
      node.store.filter(() => false, "validation");
      node.props.parsedRules = parseRules(newValidation, availableRules, node);
      state.isPassing = true;
      validate(node, node.props.parsedRules, state);
    }
    node.props.parsedRules = parseRules(validation, availableRules, node);
    validate(node, node.props.parsedRules, state);
  };
}
function validate(node, validations, state) {
  if (isKilled(node))
    return;
  state.input = token();
  node.store.set(
    createMessage({
      key: "failing",
      value: !state.isPassing,
      visible: false
    })
  );
  state.isPassing = true;
  node.store.filter((message3) => !message3.meta.removeImmediately, "validation");
  validations.forEach(
    (validation) => validation.debounce && clearTimeout(validation.timer)
  );
  if (validations.length) {
    node.store.set(validatingMessage);
    run(0, validations, state, false, () => {
      node.store.remove(validatingMessage.key);
      node.store.set(
        createMessage({
          key: "failing",
          value: !state.isPassing,
          visible: false
        })
      );
    });
  }
}
function run(current, validations, state, removeImmediately, complete) {
  const validation = validations[current];
  if (!validation)
    return complete();
  const node = validation.observer;
  if (isKilled(node))
    return;
  const currentRun = state.input;
  validation.state = null;
  function next(async, result) {
    if (state.input !== currentRun)
      return;
    state.isPassing = state.isPassing && !!result;
    validation.queued = false;
    const newDeps = node.stopObserve();
    const diff = diffDeps(validation.deps, newDeps);
    applyListeners(
      node,
      diff,
      function revalidate() {
        try {
          node.store.set(validatingMessage);
        } catch (e) {
        }
        validation.queued = true;
        if (state.rerun)
          clearTimeout(state.rerun);
        state.rerun = setTimeout(
          validate,
          0,
          node,
          validations,
          state
        );
      },
      "unshift"
      // We want these listeners to run before other events are emitted so the 'state.validating' will be reliable.
    );
    validation.deps = newDeps;
    validation.state = result;
    if (result === false) {
      createFailedMessage(validation, removeImmediately || async);
    } else {
      removeMessage(validation);
    }
    if (validations.length > current + 1) {
      const nextValidation = validations[current + 1];
      if ((result || nextValidation.force || !nextValidation.skipEmpty) && nextValidation.state === null) {
        nextValidation.queued = true;
      }
      run(current + 1, validations, state, removeImmediately || async, complete);
    } else {
      complete();
    }
  }
  if ((!empty(node.value) || !validation.skipEmpty) && (state.isPassing || validation.force)) {
    if (validation.queued) {
      runRule(validation, node, (result) => {
        result instanceof Promise ? result.then((r) => next(true, r)) : next(false, result);
      });
    } else {
      run(current + 1, validations, state, removeImmediately, complete);
    }
  } else if (empty(node.value) && validation.skipEmpty && state.isPassing) {
    node.observe();
    node.value;
    next(false, state.isPassing);
  } else {
    next(false, null);
  }
}
function runRule(validation, node, after) {
  if (validation.debounce) {
    validation.timer = setTimeout(() => {
      node.observe();
      after(validation.rule(node, ...validation.args));
    }, validation.debounce);
  } else {
    node.observe();
    after(validation.rule(node, ...validation.args));
  }
}
function removeMessage(validation) {
  const key = `rule_${validation.name}`;
  if (validation.messageObserver) {
    validation.messageObserver = validation.messageObserver.kill();
  }
  if (has(validation.observer.store, key)) {
    validation.observer.store.remove(key);
  }
}
function createFailedMessage(validation, removeImmediately) {
  const node = validation.observer;
  if (isKilled(node))
    return;
  if (!validation.messageObserver) {
    validation.messageObserver = createObserver(node._node);
  }
  validation.messageObserver.watch(
    (node2) => {
      const i18nArgs = createI18nArgs(
        node2,
        validation
      );
      return i18nArgs;
    },
    (i18nArgs) => {
      const customMessage = createCustomMessage(node, validation, i18nArgs);
      const message3 = createMessage({
        blocking: validation.blocking,
        key: `rule_${validation.name}`,
        meta: {
          /**
           * Use this key instead of the message root key to produce i18n validation
           * messages.
           */
          messageKey: validation.name,
          /**
           * For messages that were created *by or after* a debounced or async
           * validation rule — we make note of it so we can immediately remove them
           * as soon as the next commit happens.
           */
          removeImmediately,
          /**
           * Determines if this message should be passed to localization.
           */
          localize: !customMessage,
          /**
           * The arguments that will be passed to the validation rules
           */
          i18nArgs
        },
        type: "validation",
        value: customMessage || "This field is not valid."
      });
      node.store.set(message3);
    }
  );
}
function createCustomMessage(node, validation, i18nArgs) {
  const customMessage = node.props.validationMessages && has(node.props.validationMessages, validation.name) ? node.props.validationMessages[validation.name] : void 0;
  if (typeof customMessage === "function") {
    return customMessage(...i18nArgs);
  }
  return customMessage;
}
function createI18nArgs(node, validation) {
  return [
    {
      node,
      name: createMessageName(node),
      args: validation.args
    }
  ];
}
function createMessageName(node) {
  if (typeof node.props.validationLabel === "function") {
    return node.props.validationLabel(node);
  }
  return node.props.validationLabel || node.props.label || node.props.name || String(node.name);
}
var hintPattern = "(?:[\\*+?()0-9]+)";
var rulePattern = "[a-zA-Z][a-zA-Z0-9_]+";
var ruleExtractor = new RegExp(
  `^(${hintPattern}?${rulePattern})(?:\\:(.*)+)?$`,
  "i"
);
var hintExtractor = new RegExp(`^(${hintPattern})(${rulePattern})$`, "i");
var debounceExtractor = /([\*+?]+)?(\(\d+\))([\*+?]+)?/;
var hasDebounce = /\(\d+\)/;
var defaultHints = {
  blocking: true,
  debounce: 0,
  force: false,
  skipEmpty: true,
  name: ""
};
function parseRules(validation, rules, node) {
  if (!validation)
    return [];
  const intents = typeof validation === "string" ? extractRules(validation) : clone(validation);
  return intents.reduce((validations, args) => {
    let rule = args.shift();
    const hints = {};
    if (typeof rule === "string") {
      const [ruleName, parsedHints] = parseHints(rule);
      if (has(rules, ruleName)) {
        rule = rules[ruleName];
        Object.assign(hints, parsedHints);
      }
    }
    if (typeof rule === "function") {
      validations.push({
        observer: createObserver(node),
        rule,
        args,
        timer: 0,
        state: null,
        queued: true,
        deps: /* @__PURE__ */ new Map(),
        ...defaultHints,
        ...fnHints(hints, rule)
      });
    }
    return validations;
  }, []);
}
function extractRules(validation) {
  return validation.split("|").reduce((rules, rule) => {
    const parsedRule = parseRule(rule);
    if (parsedRule) {
      rules.push(parsedRule);
    }
    return rules;
  }, []);
}
function parseRule(rule) {
  const trimmed = rule.trim();
  if (trimmed) {
    const matches3 = trimmed.match(ruleExtractor);
    if (matches3 && typeof matches3[1] === "string") {
      const ruleName = matches3[1].trim();
      const args = matches3[2] && typeof matches3[2] === "string" ? matches3[2].split(",").map((s) => s.trim()) : [];
      return [ruleName, ...args];
    }
  }
  return false;
}
function parseHints(ruleName) {
  const matches3 = ruleName.match(hintExtractor);
  if (!matches3) {
    return [ruleName, { name: ruleName }];
  }
  const map = {
    "*": { force: true },
    "+": { skipEmpty: false },
    "?": { blocking: false }
  };
  const [, hints, rule] = matches3;
  const hintGroups = hasDebounce.test(hints) ? hints.match(debounceExtractor) || [] : [, hints];
  return [
    rule,
    [hintGroups[1], hintGroups[2], hintGroups[3]].reduce(
      (hints2, group2) => {
        if (!group2)
          return hints2;
        if (hasDebounce.test(group2)) {
          hints2.debounce = parseInt(group2.substr(1, group2.length - 1));
        } else {
          group2.split("").forEach(
            (hint) => has(map, hint) && Object.assign(hints2, map[hint])
          );
        }
        return hints2;
      },
      { name: rule }
    )
  ];
}
function fnHints(existingHints, rule) {
  if (!existingHints.name) {
    existingHints.name = rule.ruleName || rule.name;
  }
  return ["skipEmpty", "force", "debounce", "blocking"].reduce(
    (hints, hint) => {
      if (has(rule, hint) && !has(hints, hint)) {
        Object.assign(hints, {
          [hint]: rule[hint]
        });
      }
      return hints;
    },
    existingHints
  );
}

// node_modules/@formkit/i18n/dist/index.dev.mjs
function sentence(str) {
  return str[0].toUpperCase() + str.substr(1);
}
function list(items, conjunction = "or") {
  return items.reduce((oxford, item, index) => {
    oxford += item;
    if (index <= items.length - 2 && items.length > 2) {
      oxford += ", ";
    }
    if (index === items.length - 2) {
      oxford += `${items.length === 2 ? " " : ""}${conjunction} `;
    }
    return oxford;
  }, "");
}
function date2(date22) {
  const dateTime = typeof date22 === "string" ? new Date(Date.parse(date22)) : date22;
  if (!(dateTime instanceof Date)) {
    return "(unknown)";
  }
  return new Intl.DateTimeFormat(void 0, {
    dateStyle: "medium",
    timeZone: "UTC"
  }).format(dateTime);
}
function order(first, second) {
  return Number(first) >= Number(second) ? [second, first] : [first, second];
}
var ui10 = {
  /**
   * Shown on a button for adding additional items.
   */
  add: "Add",
  /**
   * Shown when a button to remove items is visible.
   */
  remove: "Remove",
  /**
   * Shown when there are multiple items to remove at the same time.
   */
  removeAll: "Remove all",
  /**
   * Shown when all fields are not filled out correctly.
   */
  incomplete: "Sorry, not all fields are filled out correctly.",
  /**
   * Shown in a button inside a form to submit the form.
   */
  submit: "Submit",
  /**
   * Shown when no files are selected.
   */
  noFiles: "No file chosen",
  /**
   * Shown on buttons that move fields up in a list.
   */
  moveUp: "Move up",
  /**
   * Shown on buttons that move fields down in a list.
   */
  moveDown: "Move down",
  /**
   * Shown when something is actively loading.
   */
  isLoading: "Loading...",
  /**
   * Shown when there is more to load.
   */
  loadMore: "Load more",
  /**
   * Show on buttons that navigate state forward
   */
  next: "Next",
  /**
   * Show on buttons that navigate state backward
   */
  prev: "Previous",
  /**
   * Shown when adding all values.
   */
  addAllValues: "Add all values",
  /**
   * Shown when adding selected values.
   */
  addSelectedValues: "Add selected values",
  /**
   * Shown when removing all values.
   */
  removeAllValues: "Remove all values",
  /**
   * Shown when removing selected values.
   */
  removeSelectedValues: "Remove selected values",
  /**
   * Shown when there is a date to choose.
   */
  chooseDate: "Choose date",
  /**
   * Shown when there is a date to change.
   */
  changeDate: "Change date",
  /**
   * Shown above error summaries when someone attempts to submit a form with
   * errors and the developer has implemented `<FormKitSummary />`.
   */
  summaryHeader: "There were errors in your form.",
  /*
   * Shown when there is something to close
   */
  close: "Close",
  /**
   * Shown when there is something to open.
   */
  open: "Open"
};
var validation10 = {
  /**
   * The value is not an accepted value.
   * @see {@link https://formkit.com/essentials/validation#accepted}
   */
  accepted({ name }) {
    return `Please accept the ${name}.`;
  },
  /**
   * The date is not after
   * @see {@link https://formkit.com/essentials/validation#date-after}
   */
  date_after({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${sentence(name)} must be after ${date2(args[0])}.`;
    }
    return `${sentence(name)} must be in the future.`;
  },
  /**
   * The value is not a letter.
   * @see {@link https://formkit.com/essentials/validation#alpha}
   */
  alpha({ name }) {
    return `${sentence(name)} can only contain alphabetical characters.`;
  },
  /**
   * The value is not alphanumeric
   * @see {@link https://formkit.com/essentials/validation#alphanumeric}
   */
  alphanumeric({ name }) {
    return `${sentence(name)} can only contain letters and numbers.`;
  },
  /**
   * The value is not letter and/or spaces
   * @see {@link https://formkit.com/essentials/validation#alpha-spaces}
   */
  alpha_spaces({ name }) {
    return `${sentence(name)} can only contain letters and spaces.`;
  },
  /**
   * The value have no letter.
   * @see {@link https://formkit.com/essentials/validation#contains_alpha}
   */
  contains_alpha({ name }) {
    return `${sentence(name)} must contain alphabetical characters.`;
  },
  /**
   * The value have no alphanumeric
   * @see {@link https://formkit.com/essentials/validation#contains_alphanumeric}
   */
  contains_alphanumeric({ name }) {
    return `${sentence(name)} must contain letters or numbers.`;
  },
  /**
   * The value have no letter and/or spaces
   * @see {@link https://formkit.com/essentials/validation#contains_alpha-spaces}
   */
  contains_alpha_spaces({ name }) {
    return `${sentence(name)} must contain letters or spaces.`;
  },
  /**
   * The value have no symbol
   * @see {@link https://formkit.com/essentials/validation#contains_symbol}
   */
  contains_symbol({ name }) {
    return `${sentence(name)} must contain a symbol.`;
  },
  /**
   * The value have no uppercase
   * @see {@link https://formkit.com/essentials/validation#contains_uppercase}
   */
  contains_uppercase({ name }) {
    return `${sentence(name)} must contain an uppercase letter.`;
  },
  /**
   * The value have no lowercase
   * @see {@link https://formkit.com/essentials/validation#contains_lowercase}
   */
  contains_lowercase({ name }) {
    return `${sentence(name)} must contain a lowercase letter.`;
  },
  /**
   *  The value have no numeric
   * @see {@link https://formkit.com/essentials/validation#contains_numeric}
   */
  contains_numeric({ name }) {
    return `${sentence(name)} must contain numbers.`;
  },
  /**
   * The value is not symbol
   * @see {@link https://formkit.com/essentials/validation#symbol}
   */
  symbol({ name }) {
    return `${sentence(name)} must be a symbol.`;
  },
  /**
   * The value is not uppercase
   * @see {@link https://formkit.com/essentials/validation#uppercase}
   */
  uppercase({ name }) {
    return `${sentence(name)} can only contain uppercase letters.`;
  },
  /**
   * The value is not lowercase
   * @see {@link https://formkit.com/essentials/validation#lowercase}
   */
  lowercase({ name, args }) {
    let postfix = "";
    if (Array.isArray(args) && args.length) {
      if (args[0] === "allow_non_alpha")
        postfix = ", numbers and symbols";
      if (args[0] === "allow_numeric")
        postfix = " and numbers";
      if (args[0] === "allow_numeric_dashes")
        postfix = ", numbers and dashes";
    }
    return `${sentence(name)} can only contain lowercase letters${postfix}.`;
  },
  /**
   * The date is not before
   * @see {@link https://formkit.com/essentials/validation#date-before}
   */
  date_before({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${sentence(name)} must be before ${date2(args[0])}.`;
    }
    return `${sentence(name)} must be in the past.`;
  },
  /**
   * The value is not between two numbers
   * @see {@link https://formkit.com/essentials/validation#between}
   */
  between({ name, args }) {
    if (isNaN(args[0]) || isNaN(args[1])) {
      return `This field was configured incorrectly and can’t be submitted.`;
    }
    const [a, b] = order(args[0], args[1]);
    return `${sentence(name)} must be between ${a} and ${b}.`;
  },
  /**
   * The confirmation field does not match
   * @see {@link https://formkit.com/essentials/validation#confirm}
   */
  confirm({ name }) {
    return `${sentence(name)} does not match.`;
  },
  /**
   * The value is not a valid date
   * @see {@link https://formkit.com/essentials/validation#date-format}
   */
  date_format({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${sentence(name)} is not a valid date, please use the format ${args[0]}`;
    }
    return "This field was configured incorrectly and can’t be submitted";
  },
  /**
   * Is not within expected date range
   * @see {@link https://formkit.com/essentials/validation#date-between}
   */
  date_between({ name, args }) {
    return `${sentence(name)} must be between ${date2(args[0])} and ${date2(args[1])}`;
  },
  /**
   * Shown when the user-provided value is not a valid email address.
   * @see {@link https://formkit.com/essentials/validation#email}
   */
  email: "Please enter a valid email address.",
  /**
   * Does not end with the specified value
   * @see {@link https://formkit.com/essentials/validation#ends-with}
   */
  ends_with({ name, args }) {
    return `${sentence(name)} doesn’t end with ${list(args)}.`;
  },
  /**
   * Is not an allowed value
   * @see {@link https://formkit.com/essentials/validation#is}
   */
  is({ name }) {
    return `${sentence(name)} is not an allowed value.`;
  },
  /**
   * Does not match specified length
   * @see {@link https://formkit.com/essentials/validation#length}
   */
  length({ name, args: [first = 0, second = Infinity] }) {
    const min3 = Number(first) <= Number(second) ? first : second;
    const max3 = Number(second) >= Number(first) ? second : first;
    if (min3 == 1 && max3 === Infinity) {
      return `${sentence(name)} must be at least one character.`;
    }
    if (min3 == 0 && max3) {
      return `${sentence(name)} must be less than or equal to ${max3} characters.`;
    }
    if (min3 === max3) {
      return `${sentence(name)} should be ${max3} characters long.`;
    }
    if (min3 && max3 === Infinity) {
      return `${sentence(name)} must be greater than or equal to ${min3} characters.`;
    }
    return `${sentence(name)} must be between ${min3} and ${max3} characters.`;
  },
  /**
   * Value is not a match
   * @see {@link https://formkit.com/essentials/validation#matches}
   */
  matches({ name }) {
    return `${sentence(name)} is not an allowed value.`;
  },
  /**
   * Exceeds maximum allowed value
   * @see {@link https://formkit.com/essentials/validation#max}
   */
  max({ name, node: { value }, args }) {
    if (Array.isArray(value)) {
      return `Cannot have more than ${args[0]} ${name}.`;
    }
    return `${sentence(name)} must be no more than ${args[0]}.`;
  },
  /**
   * The (field-level) value does not match specified mime type
   * @see {@link https://formkit.com/essentials/validation#mime}
   */
  mime({ name, args }) {
    if (!args[0]) {
      return "No file formats allowed.";
    }
    return `${sentence(name)} must be of the type: ${args[0]}`;
  },
  /**
   * Does not fulfill minimum allowed value
   * @see {@link https://formkit.com/essentials/validation#min}
   */
  min({ name, node: { value }, args }) {
    if (Array.isArray(value)) {
      return `Cannot have fewer than ${args[0]} ${name}.`;
    }
    return `${sentence(name)} must be at least ${args[0]}.`;
  },
  /**
   * Is not an allowed value
   * @see {@link https://formkit.com/essentials/validation#not}
   */
  not({ name, node: { value } }) {
    return `“${value}” is not an allowed ${name}.`;
  },
  /**
   *  Is not a number
   * @see {@link https://formkit.com/essentials/validation#number}
   */
  number({ name }) {
    return `${sentence(name)} must be a number.`;
  },
  /**
   * Require one field.
   * @see {@link https://formkit.com/essentials/validation#require-one}
   */
  require_one: ({ name, node, args: inputNames }) => {
    const labels = inputNames.map((name2) => {
      const dependentNode = node.at(name2);
      if (dependentNode) {
        return createMessageName(dependentNode);
      }
      return false;
    }).filter((name2) => !!name2);
    labels.unshift(name);
    return `${labels.join(" or ")} is required.`;
  },
  /**
   * Required field.
   * @see {@link https://formkit.com/essentials/validation#required}
   */
  required({ name }) {
    return `${sentence(name)} is required.`;
  },
  /**
   * Does not start with specified value
   * @see {@link https://formkit.com/essentials/validation#starts-with}
   */
  starts_with({ name, args }) {
    return `${sentence(name)} doesn’t start with ${list(args)}.`;
  },
  /**
   * Is not a url
   * @see {@link https://formkit.com/essentials/validation#url}
   */
  url() {
    return `Please enter a valid URL.`;
  },
  /**
   * Shown when the date is invalid.
   */
  invalidDate: "The selected date is invalid."
};
var en = { ui: ui10, validation: validation10 };
var i18nNodes = /* @__PURE__ */ new Set();
var activeLocale = null;
function createI18nPlugin(registry) {
  return function i18nPlugin(node) {
    i18nNodes.add(node);
    if (activeLocale)
      node.config.locale = activeLocale;
    node.on("destroying", () => i18nNodes.delete(node));
    let localeKey = parseLocale(node.config.locale, registry);
    let locale = localeKey ? registry[localeKey] : {};
    node.on("prop:locale", ({ payload: lang }) => {
      localeKey = parseLocale(lang, registry);
      locale = localeKey ? registry[localeKey] : {};
      node.store.touch();
    });
    node.on("prop:label", () => node.store.touch());
    node.on("prop:validationLabel", () => node.store.touch());
    node.hook.text((fragment2, next) => {
      var _a, _b;
      const key = ((_a = fragment2.meta) == null ? void 0 : _a.messageKey) || fragment2.key;
      if (has(locale, fragment2.type) && has(locale[fragment2.type], key)) {
        const t = locale[fragment2.type][key];
        if (typeof t === "function") {
          fragment2.value = Array.isArray((_b = fragment2.meta) == null ? void 0 : _b.i18nArgs) ? t(...fragment2.meta.i18nArgs) : t(fragment2);
        } else {
          fragment2.value = t;
        }
      }
      return next(fragment2);
    });
  };
}
function parseLocale(locale, availableLocales) {
  if (has(availableLocales, locale)) {
    return locale;
  }
  const [lang] = locale.split("-");
  if (has(availableLocales, lang)) {
    return lang;
  }
  for (const locale2 in availableLocales) {
    return locale2;
  }
  return false;
}
function changeLocale(locale) {
  activeLocale = locale;
  for (const node of i18nNodes) {
    node.config.locale = locale;
  }
}

// node_modules/@formkit/inputs/dist/index.dev.mjs
function createLibraryPlugin(...libraries) {
  const library = libraries.reduce(
    (merged, lib) => extend(merged, lib),
    {}
  );
  const plugin2 = () => {
  };
  plugin2.library = function(node) {
    const type = camel(node.props.type);
    if (has(library, type)) {
      node.define(library[type]);
    }
  };
  return plugin2;
}
var runtimeProps = [
  "classes",
  "config",
  "delay",
  "errors",
  "id",
  "index",
  "inputErrors",
  "library",
  "modelValue",
  "onUpdate:modelValue",
  "name",
  "number",
  "parent",
  "plugins",
  "sectionsSchema",
  "type",
  "validation",
  "validationLabel",
  "validationMessages",
  "validationRules",
  // Runtime event props:
  "onInput",
  "onInputRaw",
  "onUpdate:modelValue",
  "onNode",
  "onSubmit",
  "onSubmitInvalid",
  "onSubmitRaw"
];
function isGroupOption(option2) {
  return option2 && typeof option2 === "object" && "group" in option2 && Array.isArray(option2.options);
}
function normalizeOptions(options2, i = { count: 1 }) {
  if (Array.isArray(options2)) {
    return options2.map(
      (option2) => {
        if (typeof option2 === "string" || typeof option2 === "number") {
          return {
            label: String(option2),
            value: String(option2)
          };
        }
        if (typeof option2 == "object") {
          if ("group" in option2) {
            option2.options = normalizeOptions(option2.options || [], i);
            return option2;
          } else if ("value" in option2 && typeof option2.value !== "string") {
            Object.assign(option2, {
              value: `__mask_${i.count++}`,
              __original: option2.value
            });
          }
        }
        return option2;
      }
    );
  }
  return Object.keys(options2).map((value) => {
    return {
      label: options2[value],
      value
    };
  });
}
function optionValue(options2, value, undefinedIfNotFound = false) {
  if (Array.isArray(options2)) {
    for (const option2 of options2) {
      if (typeof option2 !== "object" && option2)
        continue;
      if (isGroupOption(option2)) {
        const found = optionValue(option2.options, value, true);
        if (found !== void 0) {
          return found;
        }
      } else if (value == option2.value) {
        return "__original" in option2 ? option2.__original : option2.value;
      }
    }
  }
  return undefinedIfNotFound ? void 0 : value;
}
function shouldSelect(valueA, valueB) {
  if (valueA === null && valueB === void 0 || valueA === void 0 && valueB === null)
    return false;
  if (valueA == valueB)
    return true;
  if (isPojo(valueA) && isPojo(valueB))
    return eq(valueA, valueB);
  return false;
}
function options(node) {
  node.hook.prop((prop, next) => {
    var _a;
    if (prop.prop === "options") {
      if (typeof prop.value === "function") {
        node.props.optionsLoader = prop.value;
        prop.value = [];
      } else {
        (_a = node.props)._normalizeCounter ?? (_a._normalizeCounter = { count: 1 });
        prop.value = normalizeOptions(prop.value, node.props._normalizeCounter);
      }
    }
    return next(prop);
  });
}
function createSection(section, el, fragment2 = false) {
  return (...children) => {
    const extendable = (extensions) => {
      const node = !el || typeof el === "string" ? { $el: el } : el();
      if (isDOM(node) || isComponent(node)) {
        if (!node.meta) {
          node.meta = { section };
        } else {
          node.meta.section = section;
        }
        if (children.length && !node.children) {
          node.children = [
            ...children.map(
              (child) => typeof child === "function" ? child(extensions) : child
            )
          ];
        }
        if (isDOM(node)) {
          node.attrs = {
            class: `$classes.${section}`,
            ...node.attrs || {}
          };
        }
      }
      return {
        if: `$slots.${section}`,
        then: `$slots.${section}`,
        else: section in extensions ? extendSchema(node, extensions[section]) : node
      };
    };
    extendable._s = section;
    return fragment2 ? createRoot(extendable) : extendable;
  };
}
function createRoot(rootSection) {
  return (extensions) => {
    return [rootSection(extensions)];
  };
}
function isSchemaObject(schema) {
  return !!(schema && typeof schema === "object" && ("$el" in schema || "$cmp" in schema || "$formkit" in schema));
}
function extendSchema(schema, extension = {}) {
  if (typeof schema === "string") {
    return isSchemaObject(extension) || typeof extension === "string" ? extension : schema;
  } else if (Array.isArray(schema)) {
    return isSchemaObject(extension) ? extension : schema;
  }
  return extend(schema, extension);
}
var actions = createSection("actions", () => ({
  $el: "div",
  if: "$actions"
}));
var box = createSection("input", () => ({
  $el: "input",
  bind: "$attrs",
  attrs: {
    type: "$type",
    name: "$node.props.altName || $node.name",
    disabled: "$option.attrs.disabled || $disabled",
    onInput: "$handlers.toggleChecked",
    checked: "$fns.eq($_value, $onValue)",
    onBlur: "$handlers.blur",
    value: "$: true",
    id: "$id",
    "aria-describedby": {
      if: "$options.length",
      then: {
        if: "$option.help",
        then: '$: "help-" + $option.attrs.id',
        else: void 0
      },
      else: {
        if: "$help",
        then: '$: "help-" + $id',
        else: void 0
      }
    }
  }
}));
var boxHelp = createSection("optionHelp", () => ({
  $el: "div",
  if: "$option.help",
  attrs: {
    id: '$: "help-" + $option.attrs.id'
  }
}));
var boxInner = createSection("inner", "span");
var boxLabel = createSection("label", "span");
var boxOption = createSection("option", () => ({
  $el: "li",
  for: ["option", "$options"],
  attrs: {
    "data-disabled": "$option.attrs.disabled || $disabled || undefined"
  }
}));
var boxOptions = createSection("options", "ul");
var boxWrapper = createSection("wrapper", () => ({
  $el: "label",
  attrs: {
    "data-disabled": {
      if: "$options.length",
      then: void 0,
      else: "$disabled || undefined"
    },
    "data-checked": {
      if: "$options == undefined",
      then: "$fns.eq($_value, $onValue) || undefined",
      else: "$fns.isChecked($option.value) || undefined"
    }
  }
}));
var buttonInput = createSection("input", () => ({
  $el: "button",
  bind: "$attrs",
  attrs: {
    type: "$type",
    disabled: "$disabled",
    name: "$node.name",
    id: "$id"
  }
}));
var buttonLabel = createSection("default", null);
var decorator = createSection("decorator", () => ({
  $el: "span",
  attrs: {
    "aria-hidden": "true"
  }
}));
var fieldset = createSection("fieldset", () => ({
  $el: "fieldset",
  attrs: {
    id: "$id",
    "aria-describedby": {
      if: "$help",
      then: '$: "help-" + $id',
      else: void 0
    }
  }
}));
var fileInput = createSection("input", () => ({
  $el: "input",
  bind: "$attrs",
  attrs: {
    type: "file",
    disabled: "$disabled",
    name: "$node.name",
    onChange: "$handlers.files",
    onBlur: "$handlers.blur",
    id: "$id",
    "aria-describedby": "$describedBy",
    "aria-required": "$state.required || undefined"
  }
}));
var fileItem = createSection("fileItem", () => ({
  $el: "li",
  for: ["file", "$value"]
}));
var fileList = createSection("fileList", () => ({
  $el: "ul",
  if: "$value.length",
  attrs: {
    "data-has-multiple": "$_hasMultipleFiles"
  }
}));
var fileName = createSection("fileName", () => ({
  $el: "span",
  attrs: {
    class: "$classes.fileName"
  }
}));
var fileRemove = createSection("fileRemove", () => ({
  $el: "button",
  attrs: {
    type: "button",
    onClick: "$handlers.resetFiles"
  }
}));
var formInput = createSection("form", () => ({
  $el: "form",
  bind: "$attrs",
  meta: {
    autoAnimate: true
  },
  attrs: {
    id: "$id",
    name: "$node.name",
    onSubmit: "$handlers.submit",
    "data-loading": "$state.loading || undefined"
  }
}));
var fragment = createSection("wrapper", null, true);
var help = createSection("help", () => ({
  $el: "div",
  if: "$help",
  attrs: {
    id: '$: "help-" + $id'
  }
}));
var icon = (sectionKey, el) => {
  return createSection(`${sectionKey}Icon`, () => {
    const rawIconProp = `_raw${sectionKey.charAt(0).toUpperCase()}${sectionKey.slice(1)}Icon`;
    return {
      if: `$${sectionKey}Icon && $${rawIconProp}`,
      $el: `${el ? el : "span"}`,
      attrs: {
        class: `$classes.${sectionKey}Icon + " " + $classes.icon`,
        innerHTML: `$${rawIconProp}`,
        onClick: `$handlers.iconClick(${sectionKey})`,
        role: `$fns.iconRole(${sectionKey})`,
        tabindex: `$fns.iconRole(${sectionKey}) === "button" && "0" || undefined`,
        for: {
          if: `${el === "label"}`,
          then: "$id"
        }
      }
    };
  })();
};
var inner = createSection("inner", "div");
var label = createSection("label", () => ({
  $el: "label",
  if: "$label",
  attrs: {
    for: "$id"
  }
}));
var legend = createSection("legend", () => ({
  $el: "legend",
  if: "$label"
}));
var message = createSection("message", () => ({
  $el: "li",
  for: ["message", "$messages"],
  attrs: {
    key: "$message.key",
    id: `$id + '-' + $message.key`,
    "data-message-type": "$message.type"
  }
}));
var messages = createSection("messages", () => ({
  $el: "ul",
  if: "$defaultMessagePlacement && $fns.length($messages)"
}));
var noFiles = createSection("noFiles", () => ({
  $el: "span",
  if: "$value.length == 0"
}));
var optGroup = createSection("optGroup", () => ({
  $el: "optgroup",
  bind: "$option.attrs",
  attrs: {
    label: "$option.group"
  }
}));
var option = createSection("option", () => ({
  $el: "option",
  bind: "$option.attrs",
  attrs: {
    class: "$classes.option",
    value: "$option.value",
    selected: "$fns.isSelected($option)"
  }
}));
var optionSlot = createSection("options", () => ({
  $el: null,
  if: "$options.length",
  for: ["option", "$option.options || $options"]
}));
var outer = createSection("outer", () => ({
  $el: "div",
  meta: {
    autoAnimate: true
  },
  attrs: {
    key: "$id",
    "data-family": "$family || undefined",
    "data-type": "$type",
    "data-multiple": '$attrs.multiple || ($type != "select" && $options != undefined) || undefined',
    "data-has-multiple": "$_hasMultipleFiles",
    "data-disabled": '$: ($disabled !== "false" && $disabled) || undefined',
    "data-empty": "$state.empty || undefined",
    "data-complete": "$state.complete || undefined",
    "data-invalid": "$state.invalid || undefined",
    "data-errors": "$state.errors || undefined",
    "data-submitted": "$state.submitted || undefined",
    "data-prefix-icon": "$_rawPrefixIcon !== undefined || undefined",
    "data-suffix-icon": "$_rawSuffixIcon !== undefined || undefined",
    "data-prefix-icon-click": "$onPrefixIconClick !== undefined || undefined",
    "data-suffix-icon-click": "$onSuffixIconClick !== undefined || undefined"
  }
}));
var prefix = createSection("prefix", null);
var selectInput = createSection("input", () => ({
  $el: "select",
  bind: "$attrs",
  attrs: {
    id: "$id",
    "data-placeholder": "$fns.showPlaceholder($_value, $placeholder)",
    disabled: "$disabled",
    class: "$classes.input",
    name: "$node.name",
    onChange: "$handlers.onChange",
    onInput: "$handlers.selectInput",
    onBlur: "$handlers.blur",
    "aria-describedby": "$describedBy",
    "aria-required": "$state.required || undefined"
  }
}));
var submitInput = createSection("submit", () => ({
  $cmp: "FormKit",
  bind: "$submitAttrs",
  props: {
    type: "submit",
    label: "$submitLabel"
  }
}));
var suffix = createSection("suffix", null);
var textInput = createSection("input", () => ({
  $el: "input",
  bind: "$attrs",
  attrs: {
    type: "$type",
    disabled: "$disabled",
    name: "$node.name",
    onInput: "$handlers.DOMInput",
    onBlur: "$handlers.blur",
    value: "$_value",
    id: "$id",
    "aria-describedby": "$describedBy",
    "aria-required": "$state.required || undefined"
  }
}));
var textareaInput = createSection("input", () => ({
  $el: "textarea",
  bind: "$attrs",
  attrs: {
    disabled: "$disabled",
    name: "$node.name",
    onInput: "$handlers.DOMInput",
    onBlur: "$handlers.blur",
    value: "$_value",
    id: "$id",
    "aria-describedby": "$describedBy",
    "aria-required": "$state.required || undefined"
  },
  children: "$initialValue"
}));
var wrapper = createSection("wrapper", "div");
var radioInstance = 0;
function resetRadio() {
  radioInstance = 0;
}
function renamesRadios(node) {
  if (node.type === "group" || node.type === "list") {
    node.plugins.add(renamesRadiosPlugin);
  }
}
function renamesRadiosPlugin(node) {
  if (node.props.type === "radio") {
    node.addProps(["altName"]);
    node.props.altName = `${node.name}_${radioInstance++}`;
  }
}
function normalizeBoxes(node) {
  return function(prop, next) {
    if (prop.prop === "options" && Array.isArray(prop.value)) {
      prop.value = prop.value.map((option2) => {
        var _a;
        if (!((_a = option2.attrs) == null ? void 0 : _a.id)) {
          return extend(option2, {
            attrs: {
              id: `${node.props.id}-option-${slugify(String(option2.value))}`
            }
          });
        }
        return option2;
      });
      if (node.props.type === "checkbox" && !Array.isArray(node.value)) {
        if (node.isCreated) {
          node.input([], false);
        } else {
          node.on("created", () => {
            if (!Array.isArray(node.value)) {
              node.input([], false);
            }
          });
        }
      }
    }
    return next(prop);
  };
}
function toggleChecked(node, e) {
  const el = e.target;
  if (el instanceof HTMLInputElement) {
    const value = Array.isArray(node.props.options) ? optionValue(node.props.options, el.value) : el.value;
    if (Array.isArray(node.props.options) && node.props.options.length) {
      if (!Array.isArray(node._value)) {
        node.input([value]);
      } else if (!node._value.some((existingValue) => shouldSelect(value, existingValue))) {
        node.input([...node._value, value]);
      } else {
        node.input(
          node._value.filter(
            (existingValue) => !shouldSelect(value, existingValue)
          )
        );
      }
    } else {
      if (el.checked) {
        node.input(node.props.onValue);
      } else {
        node.input(node.props.offValue);
      }
    }
  }
}
function isChecked(node, value) {
  var _a, _b;
  (_a = node.context) == null ? void 0 : _a.value;
  (_b = node.context) == null ? void 0 : _b._value;
  if (Array.isArray(node._value)) {
    return node._value.some(
      (existingValue) => shouldSelect(optionValue(node.props.options, value), existingValue)
    );
  }
  return false;
}
function checkboxes(node) {
  node.on("created", () => {
    var _a, _b;
    if ((_a = node.context) == null ? void 0 : _a.handlers) {
      node.context.handlers.toggleChecked = toggleChecked.bind(null, node);
    }
    if ((_b = node.context) == null ? void 0 : _b.fns) {
      node.context.fns.isChecked = isChecked.bind(null, node);
    }
    if (!has(node.props, "onValue"))
      node.props.onValue = true;
    if (!has(node.props, "offValue"))
      node.props.offValue = false;
  });
  node.hook.prop(normalizeBoxes(node));
}
function defaultIcon(sectionKey, defaultIcon2) {
  return (node) => {
    if (node.props[`${sectionKey}Icon`] === void 0) {
      node.props[`${sectionKey}Icon`] = defaultIcon2.startsWith("<svg") ? defaultIcon2 : `default:${defaultIcon2}`;
    }
  };
}
function disables(node) {
  node.on("created", () => {
    if ("disabled" in node.props) {
      node.props.disabled = undefine(node.props.disabled);
      node.config.disabled = undefine(node.props.disabled);
    }
  });
  node.hook.prop(({ prop, value }, next) => {
    value = prop === "disabled" ? undefine(value) : value;
    return next({ prop, value });
  });
  node.on("prop:disabled", ({ payload: value }) => {
    node.config.disabled = undefine(value);
  });
}
function localize(key, value) {
  return (node) => {
    node.store.set(
      createMessage({
        key,
        type: "ui",
        value: value || key,
        meta: {
          localize: true,
          i18nArgs: [node]
        }
      })
    );
  };
}
var isBrowser = typeof window !== "undefined";
function removeHover(e) {
  if (e.target instanceof HTMLElement && e.target.hasAttribute("data-file-hover")) {
    e.target.removeAttribute("data-file-hover");
  }
}
function preventStrayDrop(type, e) {
  if (!(e.target instanceof HTMLInputElement)) {
    e.preventDefault();
  } else if (type === "dragover") {
    e.target.setAttribute("data-file-hover", "true");
  }
  if (type === "drop") {
    removeHover(e);
  }
}
function files(node) {
  localize("noFiles", "Select file")(node);
  localize("removeAll", "Remove all")(node);
  localize("remove")(node);
  node.addProps(["_hasMultipleFiles"]);
  if (isBrowser) {
    if (!window._FormKit_File_Drop) {
      window.addEventListener(
        "dragover",
        preventStrayDrop.bind(null, "dragover")
      );
      window.addEventListener("drop", preventStrayDrop.bind(null, "drop"));
      window.addEventListener("dragleave", removeHover);
      window._FormKit_File_Drop = true;
    }
  }
  node.hook.input((value, next) => next(Array.isArray(value) ? value : []));
  node.on("input", ({ payload: value }) => {
    node.props._hasMultipleFiles = Array.isArray(value) && value.length > 1 ? true : void 0;
  });
  node.on("reset", () => {
    if (node.props.id && isBrowser) {
      const el = document.getElementById(node.props.id);
      if (el)
        el.value = "";
    }
  });
  node.on("created", () => {
    if (!Array.isArray(node.value))
      node.input([], false);
    if (!node.context)
      return;
    node.context.handlers.resetFiles = (e) => {
      e.preventDefault();
      node.input([]);
      if (node.props.id && isBrowser) {
        const el = document.getElementById(node.props.id);
        if (el)
          el.value = "";
        el == null ? void 0 : el.focus();
      }
    };
    node.context.handlers.files = (e) => {
      var _a, _b;
      const files2 = [];
      if (e.target instanceof HTMLInputElement && e.target.files) {
        for (let i = 0; i < e.target.files.length; i++) {
          let file2;
          if (file2 = e.target.files.item(i)) {
            files2.push({ name: file2.name, file: file2 });
          }
        }
        node.input(files2);
      }
      if (node.context)
        node.context.files = files2;
      if (typeof ((_a = node.props.attrs) == null ? void 0 : _a.onChange) === "function") {
        (_b = node.props.attrs) == null ? void 0 : _b.onChange(e);
      }
    };
  });
}
var loading = createMessage({
  key: "loading",
  value: true,
  visible: false
});
async function handleSubmit(node, submitEvent) {
  const submitNonce = Math.random();
  node.props._submitNonce = submitNonce;
  submitEvent.preventDefault();
  await node.settled;
  if (node.ledger.value("validating")) {
    node.store.set(loading);
    await node.ledger.settled("validating");
    node.store.remove("loading");
    if (node.props._submitNonce !== submitNonce)
      return;
  }
  const setSubmitted = (n) => n.store.set(
    createMessage({
      key: "submitted",
      value: true,
      visible: false
    })
  );
  node.walk(setSubmitted);
  setSubmitted(node);
  node.emit("submit-raw");
  if (typeof node.props.onSubmitRaw === "function") {
    node.props.onSubmitRaw(submitEvent, node);
  }
  if (node.ledger.value("blocking")) {
    if (typeof node.props.onSubmitInvalid === "function") {
      node.props.onSubmitInvalid(node);
    }
    if (node.props.incompleteMessage !== false) {
      setIncompleteMessage(node);
    }
  } else {
    if (typeof node.props.onSubmit === "function") {
      const retVal = node.props.onSubmit(
        node.hook.submit.dispatch(clone(node.value)),
        node
      );
      if (retVal instanceof Promise) {
        const autoDisable = node.props.disabled === void 0 && node.props.submitBehavior !== "live";
        if (autoDisable)
          node.props.disabled = true;
        node.store.set(loading);
        await retVal;
        if (autoDisable)
          node.props.disabled = false;
        node.store.remove("loading");
      }
    } else {
      if (submitEvent.target instanceof HTMLFormElement) {
        submitEvent.target.submit();
      }
    }
  }
}
function setIncompleteMessage(node) {
  node.store.set(
    createMessage({
      blocking: false,
      key: `incomplete`,
      meta: {
        localize: node.props.incompleteMessage === void 0,
        i18nArgs: [{ node }],
        showAsMessage: true
      },
      type: "ui",
      value: node.props.incompleteMessage || "Form incomplete."
    })
  );
}
function form(node) {
  var _a;
  node.props.isForm = true;
  node.ledger.count("validating", (m) => m.key === "validating");
  (_a = node.props).submitAttrs ?? (_a.submitAttrs = {
    disabled: node.props.disabled
  });
  node.on("prop:disabled", ({ payload: disabled }) => {
    node.props.submitAttrs = { ...node.props.submitAttrs, disabled };
  });
  node.on("created", () => {
    var _a2;
    if ((_a2 = node.context) == null ? void 0 : _a2.handlers) {
      node.context.handlers.submit = handleSubmit.bind(null, node);
    }
    if (!has(node.props, "actions")) {
      node.props.actions = true;
    }
  });
  node.on("prop:incompleteMessage", () => {
    if (node.store.incomplete)
      setIncompleteMessage(node);
  });
  node.on("settled:blocking", () => node.store.remove("incomplete"));
}
function ignore(node) {
  if (node.props.ignore === void 0) {
    node.props.ignore = true;
    node.parent = null;
  }
}
function initialValue(node) {
  node.on("created", () => {
    if (node.context) {
      node.context.initialValue = node.value || "";
    }
  });
}
function casts(node) {
  if (typeof node.props.number === "undefined")
    return;
  const strict = ["number", "range", "hidden"].includes(node.props.type);
  node.hook.input((value, next) => {
    if (value === "")
      return next(void 0);
    const numericValue = node.props.number === "integer" ? parseInt(value) : parseFloat(value);
    if (!Number.isFinite(numericValue))
      return strict ? next(void 0) : next(value);
    return next(numericValue);
  });
}
function toggleChecked2(node, event) {
  if (event.target instanceof HTMLInputElement) {
    node.input(optionValue(node.props.options, event.target.value));
  }
}
function isChecked2(node, value) {
  var _a, _b;
  (_a = node.context) == null ? void 0 : _a.value;
  (_b = node.context) == null ? void 0 : _b._value;
  return shouldSelect(optionValue(node.props.options, value), node._value);
}
function radios(node) {
  node.on("created", () => {
    var _a, _b;
    if (!Array.isArray(node.props.options)) {
      warn(350, {
        node,
        inputType: "radio"
      });
    }
    if ((_a = node.context) == null ? void 0 : _a.handlers) {
      node.context.handlers.toggleChecked = toggleChecked2.bind(null, node);
    }
    if ((_b = node.context) == null ? void 0 : _b.fns) {
      node.context.fns.isChecked = isChecked2.bind(null, node);
    }
  });
  node.hook.prop(normalizeBoxes(node));
}
function isSelected(node, option2) {
  if (isGroupOption(option2))
    return false;
  node.context && node.context.value;
  const optionValue2 = "__original" in option2 ? option2.__original : option2.value;
  return Array.isArray(node._value) ? node._value.some((optionA) => shouldSelect(optionA, optionValue2)) : (node._value === void 0 || node._value === null && !containsValue(node.props.options, null)) && option2.attrs && option2.attrs["data-is-placeholder"] ? true : shouldSelect(optionValue2, node._value);
}
function containsValue(options2, value) {
  return options2.some((option2) => {
    if (isGroupOption(option2)) {
      return containsValue(option2.options, value);
    } else {
      return ("__original" in option2 ? option2.__original : option2.value) === value;
    }
  });
}
async function deferChange(node, e) {
  var _a;
  if (typeof ((_a = node.props.attrs) == null ? void 0 : _a.onChange) === "function") {
    await new Promise((r) => setTimeout(r, 0));
    await node.settled;
    node.props.attrs.onChange(e);
  }
}
function selectInput2(node, e) {
  const target = e.target;
  const value = target.hasAttribute("multiple") ? Array.from(target.selectedOptions).map(
    (o) => optionValue(node.props.options, o.value)
  ) : optionValue(node.props.options, target.value);
  node.input(value);
}
function applyPlaceholder(options2, placeholder) {
  if (!options2.some(
    (option2) => option2.attrs && option2.attrs["data-is-placeholder"]
  )) {
    return [
      {
        label: placeholder,
        value: "",
        attrs: {
          hidden: true,
          disabled: true,
          "data-is-placeholder": "true"
        }
      },
      ...options2
    ];
  }
  return options2;
}
function firstValue(options2) {
  const option2 = options2.length > 0 ? options2[0] : void 0;
  if (!option2)
    return void 0;
  if (isGroupOption(option2))
    return firstValue(option2.options);
  return "__original" in option2 ? option2.__original : option2.value;
}
function select(node) {
  node.on("created", () => {
    var _a, _b, _c;
    const isMultiple = undefine((_a = node.props.attrs) == null ? void 0 : _a.multiple);
    if (!isMultiple && node.props.placeholder && Array.isArray(node.props.options)) {
      node.hook.prop(({ prop, value }, next) => {
        if (prop === "options") {
          value = applyPlaceholder(value, node.props.placeholder);
        }
        return next({ prop, value });
      });
      node.props.options = applyPlaceholder(
        node.props.options,
        node.props.placeholder
      );
    }
    if (isMultiple) {
      if (node.value === void 0) {
        node.input([], false);
      }
    } else if (node.context && !node.context.options) {
      node.props.attrs = Object.assign({}, node.props.attrs, {
        value: node._value
      });
      node.on("input", ({ payload }) => {
        node.props.attrs = Object.assign({}, node.props.attrs, {
          value: payload
        });
      });
    }
    if ((_b = node.context) == null ? void 0 : _b.handlers) {
      node.context.handlers.selectInput = selectInput2.bind(null, node);
      node.context.handlers.onChange = deferChange.bind(null, node);
    }
    if ((_c = node.context) == null ? void 0 : _c.fns) {
      node.context.fns.isSelected = isSelected.bind(null, node);
      node.context.fns.showPlaceholder = (value, placeholder) => {
        if (!Array.isArray(node.props.options))
          return false;
        const hasMatchingValue = node.props.options.some(
          (option2) => {
            if (option2.attrs && "data-is-placeholder" in option2.attrs)
              return false;
            const optionValue2 = "__original" in option2 ? option2.__original : option2.value;
            return eq(value, optionValue2);
          }
        );
        return placeholder && !hasMatchingValue ? true : void 0;
      };
    }
  });
  node.hook.input((value, next) => {
    var _a, _b, _c;
    if (!node.props.placeholder && value === void 0 && Array.isArray((_a = node.props) == null ? void 0 : _a.options) && node.props.options.length && !undefine((_c = (_b = node.props) == null ? void 0 : _b.attrs) == null ? void 0 : _c.multiple)) {
      value = firstValue(node.props.options);
    }
    return next(value);
  });
}
function isSlotCondition(node) {
  if (isConditional(node) && node.if && node.if.startsWith("$slots.") && typeof node.then === "string" && node.then.startsWith("$slots.") && "else" in node) {
    return true;
  }
  return false;
}
function useSchema(inputSection, sectionsSchema = {}) {
  const schema = outer(
    wrapper(
      label("$label"),
      inner(icon("prefix"), prefix(), inputSection(), suffix(), icon("suffix"))
    ),
    help("$help"),
    messages(message("$message.value"))
  );
  return (propSectionsSchema = {}) => schema(extend(sectionsSchema, propSectionsSchema));
}
function $if(condition, then, otherwise) {
  const extendable = (extensions) => {
    const node = then(extensions);
    if (otherwise || isSchemaObject(node) && "if" in node || isSlotCondition(node)) {
      const conditionalNode = {
        if: condition,
        then: node
      };
      if (otherwise) {
        conditionalNode.else = otherwise(extensions);
      }
      return conditionalNode;
    } else if (isSlotCondition(node)) {
      Object.assign(node.else, { if: condition });
    } else if (isSchemaObject(node)) {
      Object.assign(node, { if: condition });
    }
    return node;
  };
  extendable._s = token();
  return extendable;
}
function $extend(section, extendWith) {
  const extendable = (extensions) => {
    const node = section({});
    if (isSlotCondition(node)) {
      if (Array.isArray(node.else))
        return node;
      node.else = extendSchema(
        extendSchema(node.else, extendWith),
        section._s ? extensions[section._s] : {}
      );
      return node;
    }
    return extendSchema(
      extendSchema(node, extendWith),
      section._s ? extensions[section._s] : {}
    );
  };
  extendable._s = section._s;
  return extendable;
}
function resetCounts() {
  resetRadio();
}
var button = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: outer(
    messages(message("$message.value")),
    wrapper(
      buttonInput(
        icon("prefix"),
        prefix(),
        buttonLabel("$label || $ui.submit.value"),
        suffix(),
        icon("suffix")
      )
    ),
    help("$help")
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * The family of inputs this one belongs too. For example "text" and "email"
   * are both part of the "text" family. This is primary used for styling.
   */
  family: "button",
  /**
   * An array of extra props to accept for this input.
   */
  props: [],
  /**
   * Additional features that should be added to your input
   */
  features: [localize("submit"), ignore],
  /**
   * A key to use for memoizing the schema. This is used to prevent the schema
   * from needing to be stringified when performing a memo lookup.
   */
  schemaMemoKey: "h6st4epl3j8"
};
var checkbox = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: outer(
    $if(
      "$options == undefined",
      /**
       * Single checkbox structure.
       */
      boxWrapper(
        boxInner(prefix(), box(), decorator(icon("decorator")), suffix()),
        $extend(boxLabel("$label"), {
          if: "$label"
        })
      ),
      /**
       * Multi checkbox structure.
       */
      fieldset(
        legend("$label"),
        help("$help"),
        boxOptions(
          boxOption(
            boxWrapper(
              boxInner(
                prefix(),
                $extend(box(), {
                  bind: "$option.attrs",
                  attrs: {
                    id: "$option.attrs.id",
                    value: "$option.value",
                    checked: "$fns.isChecked($option.value)"
                  }
                }),
                decorator(icon("decorator")),
                suffix()
              ),
              $extend(boxLabel("$option.label"), {
                if: "$option.label"
              })
            ),
            boxHelp("$option.help")
          )
        )
      )
    ),
    // Help text only goes under the input when it is a single.
    $if("$options == undefined && $help", help("$help")),
    messages(message("$message.value"))
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * The family of inputs this one belongs too. For example "text" and "email"
   * are both part of the "text" family. This is primary used for styling.
   */
  family: "box",
  /**
   * An array of extra props to accept for this input.
   */
  props: ["options", "onValue", "offValue", "optionsLoader"],
  /**
   * Additional features that should be added to your input
   */
  features: [
    options,
    checkboxes,
    defaultIcon("decorator", "checkboxDecorator")
  ],
  /**
   * The key used to memoize the schema.
   */
  schemaMemoKey: "qje02tb3gu8"
};
var file = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: outer(
    wrapper(
      label("$label"),
      inner(
        icon("prefix", "label"),
        prefix(),
        fileInput(),
        fileList(
          fileItem(
            icon("fileItem"),
            fileName("$file.name"),
            $if(
              "$value.length === 1",
              fileRemove(
                icon("fileRemove"),
                '$ui.remove.value + " " + $file.name'
              )
            )
          )
        ),
        $if("$value.length > 1", fileRemove("$ui.removeAll.value")),
        noFiles(icon("noFiles"), "$ui.noFiles.value"),
        suffix(),
        icon("suffix")
      )
    ),
    help("$help"),
    messages(message("$message.value"))
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * The family of inputs this one belongs too. For example "text" and "email"
   * are both part of the "text" family. This is primary used for styling.
   */
  family: "text",
  /**
   * An array of extra props to accept for this input.
   */
  props: [],
  /**
   * Additional features that should be added to your input
   */
  features: [
    files,
    defaultIcon("fileItem", "fileItem"),
    defaultIcon("fileRemove", "fileRemove"),
    defaultIcon("noFiles", "noFiles")
  ],
  /**
   * The key used to memoize the schema.
   */
  schemaMemoKey: "9kqc4852fv8"
};
var form2 = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: formInput(
    "$slots.default",
    messages(message("$message.value")),
    actions(submitInput())
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "group",
  /**
   * An array of extra props to accept for this input.
   */
  props: [
    "actions",
    "submit",
    "submitLabel",
    "submitAttrs",
    "submitBehavior",
    "incompleteMessage"
  ],
  /**
   * Additional features that should be added to your input
   */
  features: [form, disables],
  /**
   * The key used to memoize the schema.
   */
  schemaMemoKey: "5bg016redjo"
};
var group = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: fragment("$slots.default"),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "group",
  /**
   * An array of extra props to accept for this input.
   */
  props: [],
  /**
   * Additional features that should be added to your input
   */
  features: [disables, renamesRadios]
};
var hidden = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: textInput(),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * An array of extra props to accept for this input.
   */
  props: [],
  /**
   * Additional features that should be added to your input
   */
  features: [casts]
};
var list2 = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: fragment("$slots.default"),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "list",
  /**
   * An array of extra props to accept for this input.
   */
  props: ["sync", "dynamic"],
  /**
   * Additional features that should be added to your input
   */
  features: [disables, renamesRadios]
};
var meta = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: fragment(),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * An array of extra props to accept for this input.
   */
  props: [],
  /**
   * Additional features that should be added to your input
   */
  features: []
};
var radio = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: outer(
    $if(
      "$options == undefined",
      /**
       * Single radio structure.
       */
      boxWrapper(
        boxInner(prefix(), box(), decorator(icon("decorator")), suffix()),
        $extend(boxLabel("$label"), {
          if: "$label"
        })
      ),
      /**
       * Multi radio structure.
       */
      fieldset(
        legend("$label"),
        help("$help"),
        boxOptions(
          boxOption(
            boxWrapper(
              boxInner(
                prefix(),
                $extend(box(), {
                  bind: "$option.attrs",
                  attrs: {
                    id: "$option.attrs.id",
                    value: "$option.value",
                    checked: "$fns.isChecked($option.value)"
                  }
                }),
                decorator(icon("decorator")),
                suffix()
              ),
              $extend(boxLabel("$option.label"), {
                if: "$option.label"
              })
            ),
            boxHelp("$option.help")
          )
        )
      )
    ),
    // Help text only goes under the input when it is a single.
    $if("$options == undefined && $help", help("$help")),
    messages(message("$message.value"))
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * The family of inputs this one belongs too. For example "text" and "email"
   * are both part of the "text" family. This is primary used for styling.
   */
  family: "box",
  /**
   * An array of extra props to accept for this input.
   */
  props: ["options", "onValue", "offValue", "optionsLoader"],
  /**
   * Additional features that should be added to your input
   */
  features: [options, radios, defaultIcon("decorator", "radioDecorator")],
  /**
   * The key used to memoize the schema.
   */
  schemaMemoKey: "qje02tb3gu8"
};
var select2 = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: outer(
    wrapper(
      label("$label"),
      inner(
        icon("prefix"),
        prefix(),
        selectInput(
          $if(
            "$slots.default",
            () => "$slots.default",
            optionSlot(
              $if(
                "$option.group",
                optGroup(optionSlot(option("$option.label"))),
                option("$option.label")
              )
            )
          )
        ),
        $if("$attrs.multiple !== undefined", () => "", icon("select")),
        suffix(),
        icon("suffix")
      )
    ),
    help("$help"),
    messages(message("$message.value"))
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * An array of extra props to accept for this input.
   */
  props: ["options", "placeholder", "optionsLoader"],
  /**
   * Additional features that should be added to your input
   */
  features: [options, select, defaultIcon("select", "select")],
  /**
   * The key used to memoize the schema.
   */
  schemaMemoKey: "cb119h43krg"
};
var textarea = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: outer(
    wrapper(
      label("$label"),
      inner(
        icon("prefix", "label"),
        prefix(),
        textareaInput(),
        suffix(),
        icon("suffix")
      )
    ),
    help("$help"),
    messages(message("$message.value"))
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * An array of extra props to accept for this input.
   */
  props: [],
  /**
   * Additional features that should be added to your input
   */
  features: [initialValue],
  /**
   * The key used to memoize the schema.
   */
  schemaMemoKey: "b1n0td79m9g"
};
var text = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: outer(
    wrapper(
      label("$label"),
      inner(
        icon("prefix", "label"),
        prefix(),
        textInput(),
        suffix(),
        icon("suffix")
      )
    ),
    help("$help"),
    messages(message("$message.value"))
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * The family of inputs this one belongs too. For example "text" and "email"
   * are both part of the "text" family. This is primary used for styling.
   */
  family: "text",
  /**
   * An array of extra props to accept for this input.
   */
  props: [],
  /**
   * Additional features that should be added to your input
   */
  features: [casts],
  /**
   * The key used to memoize the schema.
   */
  schemaMemoKey: "c3cc4kflsg"
};
var inputs = {
  button,
  submit: button,
  checkbox,
  file,
  form: form2,
  group,
  hidden,
  list: list2,
  meta,
  radio,
  select: select2,
  textarea,
  text,
  color: text,
  date: text,
  datetimeLocal: text,
  email: text,
  month: text,
  number: text,
  password: text,
  search: text,
  tel: text,
  time: text,
  url: text,
  week: text,
  range: text
};

// node_modules/@formkit/themes/dist/index.dev.mjs
var documentStyles = void 0;
var documentThemeLinkTag = null;
var themeDidLoad;
var themeHasLoaded = false;
var themeWasRequested = false;
var themeLoaded = new Promise((res) => {
  themeDidLoad = () => {
    themeHasLoaded = true;
    res();
  };
});
var isClient = typeof window !== "undefined" && typeof fetch !== "undefined";
documentStyles = isClient ? getComputedStyle(document.documentElement) : void 0;
var iconRegistry = {};
var iconRequests = {};
function createThemePlugin(theme, icons, iconLoaderUrl, iconLoader) {
  if (icons) {
    Object.assign(iconRegistry, icons);
  }
  if (isClient && !themeWasRequested && (documentStyles == null ? void 0 : documentStyles.getPropertyValue("--formkit-theme"))) {
    themeDidLoad();
    themeWasRequested = true;
  } else if (theme && !themeWasRequested && isClient) {
    loadTheme(theme);
  } else if (!themeWasRequested && isClient) {
    themeDidLoad();
  }
  const themePlugin = function themePlugin2(node) {
    var _a, _b;
    node.addProps(["iconLoader", "iconLoaderUrl"]);
    node.props.iconHandler = createIconHandler(
      ((_a = node.props) == null ? void 0 : _a.iconLoader) ? node.props.iconLoader : iconLoader,
      ((_b = node.props) == null ? void 0 : _b.iconLoaderUrl) ? node.props.iconLoaderUrl : iconLoaderUrl
    );
    loadIconPropIcons(node, node.props.iconHandler);
    node.on("created", () => {
      var _a2, _b2;
      if ((_a2 = node == null ? void 0 : node.context) == null ? void 0 : _a2.handlers) {
        node.context.handlers.iconClick = (sectionKey) => {
          const clickHandlerProp = `on${sectionKey.charAt(0).toUpperCase()}${sectionKey.slice(1)}IconClick`;
          const handlerFunction = node.props[clickHandlerProp];
          if (handlerFunction && typeof handlerFunction === "function") {
            return (e) => {
              return handlerFunction(node, e);
            };
          }
          return void 0;
        };
      }
      if ((_b2 = node == null ? void 0 : node.context) == null ? void 0 : _b2.fns) {
        node.context.fns.iconRole = (sectionKey) => {
          const clickHandlerProp = `on${sectionKey.charAt(0).toUpperCase()}${sectionKey.slice(1)}IconClick`;
          return typeof node.props[clickHandlerProp] === "function" ? "button" : null;
        };
      }
    });
  };
  themePlugin.iconHandler = createIconHandler(iconLoader, iconLoaderUrl);
  return themePlugin;
}
function loadTheme(theme) {
  if (!theme || !isClient || typeof getComputedStyle !== "function") {
    return;
  }
  themeWasRequested = true;
  documentThemeLinkTag = document.getElementById("formkit-theme");
  if (theme && // if we have a window object
  isClient && // we don't have an existing theme OR the theme being set up is different
  (!(documentStyles == null ? void 0 : documentStyles.getPropertyValue("--formkit-theme")) && !documentThemeLinkTag || (documentThemeLinkTag == null ? void 0 : documentThemeLinkTag.getAttribute("data-theme")) && (documentThemeLinkTag == null ? void 0 : documentThemeLinkTag.getAttribute("data-theme")) !== theme)) {
    const formkitVersion = FORMKIT_VERSION.startsWith("__") ? "latest" : FORMKIT_VERSION;
    const themeUrl = `https://cdn.jsdelivr.net/npm/@formkit/themes@${formkitVersion}/dist/${theme}/theme.css`;
    const link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.id = "formkit-theme";
    link.setAttribute("data-theme", theme);
    link.onload = () => {
      documentStyles = getComputedStyle(document.documentElement);
      themeDidLoad();
    };
    document.head.appendChild(link);
    link.href = themeUrl;
    if (documentThemeLinkTag) {
      documentThemeLinkTag.remove();
    }
  }
}
function createIconHandler(iconLoader, iconLoaderUrl) {
  return (iconName) => {
    if (typeof iconName !== "string")
      return;
    if (iconName.startsWith("<svg")) {
      return iconName;
    }
    const isDefault = iconName.startsWith("default:");
    iconName = isDefault ? iconName.split(":")[1] : iconName;
    const iconWasAlreadyLoaded = iconName in iconRegistry;
    let loadedIcon = void 0;
    if (iconWasAlreadyLoaded) {
      return iconRegistry[iconName];
    } else if (!iconRequests[iconName]) {
      loadedIcon = getIconFromStylesheet(iconName);
      loadedIcon = isClient && typeof loadedIcon === "undefined" ? Promise.resolve(loadedIcon) : loadedIcon;
      if (loadedIcon instanceof Promise) {
        iconRequests[iconName] = loadedIcon.then((iconValue) => {
          if (!iconValue && typeof iconName === "string" && !isDefault) {
            return loadedIcon = typeof iconLoader === "function" ? iconLoader(iconName) : getRemoteIcon(iconName, iconLoaderUrl);
          }
          return iconValue;
        }).then((finalIcon) => {
          if (typeof iconName === "string") {
            iconRegistry[isDefault ? `default:${iconName}` : iconName] = finalIcon;
          }
          return finalIcon;
        });
      } else if (typeof loadedIcon === "string") {
        iconRegistry[isDefault ? `default:${iconName}` : iconName] = loadedIcon;
        return loadedIcon;
      }
    }
    return iconRequests[iconName];
  };
}
function getIconFromStylesheet(iconName) {
  if (!isClient)
    return;
  if (themeHasLoaded) {
    return loadStylesheetIcon(iconName);
  } else {
    return themeLoaded.then(() => {
      return loadStylesheetIcon(iconName);
    });
  }
}
function loadStylesheetIcon(iconName) {
  const cssVarIcon = documentStyles == null ? void 0 : documentStyles.getPropertyValue(`--fk-icon-${iconName}`);
  if (cssVarIcon) {
    const icon2 = atob(cssVarIcon);
    if (icon2.startsWith("<svg")) {
      iconRegistry[iconName] = icon2;
      return icon2;
    }
  }
  return void 0;
}
function getRemoteIcon(iconName, iconLoaderUrl) {
  const formkitVersion = FORMKIT_VERSION.startsWith("__") ? "latest" : FORMKIT_VERSION;
  const fetchUrl = typeof iconLoaderUrl === "function" ? iconLoaderUrl(iconName) : `https://cdn.jsdelivr.net/npm/@formkit/icons@${formkitVersion}/dist/icons/${iconName}.svg`;
  if (!isClient)
    return void 0;
  return fetch(`${fetchUrl}`).then(async (r) => {
    const icon2 = await r.text();
    if (icon2.startsWith("<svg")) {
      return icon2;
    }
    return void 0;
  }).catch((e) => {
    console.error(e);
    return void 0;
  });
}
function loadIconPropIcons(node, iconHandler) {
  const iconRegex = /^[a-zA-Z-]+(?:-icon|Icon)$/;
  const iconProps = Object.keys(node.props).filter((prop) => {
    return iconRegex.test(prop);
  });
  iconProps.forEach((sectionKey) => {
    return loadPropIcon(node, iconHandler, sectionKey);
  });
}
function loadPropIcon(node, iconHandler, sectionKey) {
  const iconName = node.props[sectionKey];
  const loadedIcon = iconHandler(iconName);
  const rawIconProp = `_raw${sectionKey.charAt(0).toUpperCase()}${sectionKey.slice(1)}`;
  const clickHandlerProp = `on${sectionKey.charAt(0).toUpperCase()}${sectionKey.slice(1)}Click`;
  node.addProps([rawIconProp, clickHandlerProp]);
  node.on(`prop:${sectionKey}`, reloadIcon);
  if (loadedIcon instanceof Promise) {
    return loadedIcon.then((svg) => {
      node.props[rawIconProp] = svg;
    });
  } else {
    node.props[rawIconProp] = loadedIcon;
  }
  return;
}
function reloadIcon(event) {
  var _a;
  const node = event.origin;
  const iconName = event.payload;
  const iconHandler = (_a = node == null ? void 0 : node.props) == null ? void 0 : _a.iconHandler;
  const sectionKey = event.name.split(":")[1];
  const rawIconProp = `_raw${sectionKey.charAt(0).toUpperCase()}${sectionKey.slice(1)}`;
  if (iconHandler && typeof iconHandler === "function") {
    const loadedIcon = iconHandler(iconName);
    if (loadedIcon instanceof Promise) {
      return loadedIcon.then((svg) => {
        node.props[rawIconProp] = svg;
      });
    } else {
      node.props[rawIconProp] = loadedIcon;
    }
  }
}

// node_modules/@formkit/dev/dist/index.dev.mjs
var errors = {
  /**
   * FormKit errors:
   */
  100: ({ data: node }) => `Only groups, lists, and forms can have children (${node.name}).`,
  101: ({ data: node }) => `You cannot directly modify the store (${node.name}). See: https://formkit.com/advanced/core#message-store`,
  102: ({
    data: [node, property]
  }) => `You cannot directly assign node.${property} (${node.name})`,
  103: ({ data: [operator] }) => `Schema expressions cannot start with an operator (${operator})`,
  104: ({ data: [operator, expression] }) => `Schema expressions cannot end with an operator (${operator} in "${expression}")`,
  105: ({ data: expression }) => `Invalid schema expression: ${expression}`,
  106: ({ data: name }) => `Cannot submit because (${name}) is not in a form.`,
  107: ({ data: [node, value] }) => `Cannot set ${node.name} to non object value: ${value}`,
  108: ({ data: [node, value] }) => `Cannot set ${node.name} to non array value: ${value}`,
  /**
   * Input specific errors:
   */
  300: ({ data: [node] }) => `Cannot set behavior prop to overscroll (on ${node.name} input) when options prop is a function.`,
  /**
   * FormKit vue errors:
   */
  600: ({ data: node }) => `Unknown input type${typeof node.props.type === "string" ? ' "' + node.props.type + '"' : ""} ("${node.name}")`,
  601: ({ data: node }) => `Input definition${typeof node.props.type === "string" ? ' "' + node.props.type + '"' : ""} is missing a schema or component property (${node.name}).`
};
var warnings = {
  /**
   * Core warnings:
   */
  150: ({ data: fn }) => `Schema function "${fn}()" is not a valid function.`,
  151: ({ data: id }) => `No form element with id: ${id}`,
  152: ({ data: id }) => `No input element with id: ${id}`,
  /**
   * Input specific warnings:
   */
  350: ({
    data: { node, inputType }
  }) => `Invalid options prop for ${node.name} input (${inputType}). See https://formkit.com/inputs/${inputType}`,
  /**
   * Vue warnings:
   */
  650: 'Schema "$get()" must use the id of an input to access.',
  651: ({ data: id }) => `Cannot setErrors() on "${id}" because no such id exists.`,
  652: ({ data: id }) => `Cannot clearErrors() on "${id}" because no such id exists.`,
  /**
   * Deprecation warnings:
   */
  800: ({ data: name }) => `${name} is deprecated.`
};
var decodeErrors = (error2, next) => {
  if (error2.code in errors) {
    const err = errors[error2.code];
    error2.message = typeof err === "function" ? err(error2) : err;
  }
  return next(error2);
};
var registered = false;
function register() {
  if (!registered) {
    errorHandler(decodeErrors);
    warningHandler(decodeWarnings);
    registered = true;
  }
}
var decodeWarnings = (warning, next) => {
  if (warning.code in warnings) {
    const warn2 = warnings[warning.code];
    warning.message = typeof warn2 === "function" ? warn2(warning) : warn2;
  }
  return next(warning);
};

// node_modules/@formkit/vue/dist/index.dev.mjs
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export2 = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var vueBindings;
var bindings_default;
var init_bindings = __esm({
  "packages/vue/src/bindings.ts"() {
    vueBindings = function vueBindings2(node) {
      node.ledger.count("blocking", (m) => m.blocking);
      const isValid = ref(!node.ledger.value("blocking"));
      node.ledger.count("errors", (m) => m.type === "error");
      const hasErrors = ref(!!node.ledger.value("errors"));
      let hasTicked = false;
      nextTick(() => {
        hasTicked = true;
      });
      const availableMessages = reactive(
        node.store.reduce((store, message3) => {
          if (message3.visible) {
            store[message3.key] = message3;
          }
          return store;
        }, {})
      );
      const validationVisibility = ref(
        node.props.validationVisibility || (node.props.type === "checkbox" ? "dirty" : "blur")
      );
      node.on("prop:validationVisibility", ({ payload }) => {
        validationVisibility.value = payload;
      });
      const hasShownErrors = ref(validationVisibility.value === "live");
      const isRequired = ref(false);
      const checkForRequired = (parsedRules) => {
        isRequired.value = (parsedRules ?? []).some(
          (rule) => rule.name === "required"
        );
      };
      checkForRequired(node.props.parsedRules);
      node.on("prop:parsedRules", ({ payload }) => checkForRequired(payload));
      const items = ref(node.children.map((child) => child.uid));
      const validationVisible = computed(() => {
        if (!context.state)
          return false;
        if (context.state.submitted)
          return true;
        if (!hasShownErrors.value && !context.state.settled) {
          return false;
        }
        switch (validationVisibility.value) {
          case "live":
            return true;
          case "blur":
            return context.state.blurred;
          case "dirty":
            return context.state.dirty;
          default:
            return false;
        }
      });
      const isInvalid = computed(() => {
        return context.state.failing && validationVisible.value;
      });
      const isComplete = computed(() => {
        return context && hasValidation.value ? isValid.value && !hasErrors.value : context.state.dirty && !empty(context.value);
      });
      const hasValidation = ref(
        Array.isArray(node.props.parsedRules) && node.props.parsedRules.length > 0
      );
      node.on("prop:parsedRules", ({ payload: rules }) => {
        hasValidation.value = Array.isArray(rules) && rules.length > 0;
      });
      const messages3 = computed(() => {
        const visibleMessages = {};
        for (const key in availableMessages) {
          const message3 = availableMessages[key];
          if (message3.type !== "validation" || validationVisible.value) {
            visibleMessages[key] = message3;
          }
        }
        return visibleMessages;
      });
      const ui = reactive(
        node.store.reduce((messages4, message3) => {
          if (message3.type === "ui" && message3.visible)
            messages4[message3.key] = message3;
          return messages4;
        }, {})
      );
      const passing = computed(() => !context.state.failing);
      const cachedClasses = reactive({});
      const classes2 = new Proxy(cachedClasses, {
        get(...args) {
          const [target, property] = args;
          let className = Reflect.get(...args);
          if (!className && typeof property === "string") {
            if (!has(target, property) && !property.startsWith("__v")) {
              const observedNode = createObserver(node);
              observedNode.watch((node2) => {
                const rootClasses = typeof node2.config.rootClasses === "function" ? node2.config.rootClasses(property, node2) : {};
                const globalConfigClasses = node2.config.classes ? createClasses(property, node2, node2.config.classes[property]) : {};
                const classesPropClasses = createClasses(
                  property,
                  node2,
                  node2.props[`_${property}Class`]
                );
                const sectionPropClasses = createClasses(
                  property,
                  node2,
                  node2.props[`${property}Class`]
                );
                className = generateClassList(
                  node2,
                  property,
                  rootClasses,
                  globalConfigClasses,
                  classesPropClasses,
                  sectionPropClasses
                );
                target[property] = className ?? "";
              });
            }
          }
          return className;
        }
      });
      node.on("prop:rootClasses", () => {
        const keys = Object.keys(cachedClasses);
        for (const key of keys) {
          delete cachedClasses[key];
        }
      });
      const describedBy = computed(() => {
        const describers = [];
        if (context.help) {
          describers.push(`help-${node.props.id}`);
        }
        for (const key in messages3.value) {
          describers.push(`${node.props.id}-${key}`);
        }
        return describers.length ? describers.join(" ") : void 0;
      });
      const value = ref(node.value);
      const _value = ref(node.value);
      const context = reactive({
        _value,
        attrs: node.props.attrs,
        disabled: node.props.disabled,
        describedBy,
        fns: {
          length: (obj) => Object.keys(obj).length,
          number: (value2) => Number(value2),
          string: (value2) => String(value2),
          json: (value2) => JSON.stringify(value2),
          eq
        },
        handlers: {
          blur: (e) => {
            if (!node)
              return;
            node.store.set(
              createMessage({ key: "blurred", visible: false, value: true })
            );
            if (typeof node.props.attrs.onBlur === "function") {
              node.props.attrs.onBlur(e);
            }
          },
          touch: () => {
            var _a;
            const doCompare = context.dirtyBehavior === "compare";
            if (((_a = node.store.dirty) == null ? void 0 : _a.value) && !doCompare)
              return;
            const isDirty = !eq(node.props._init, node._value);
            if (!isDirty && !doCompare)
              return;
            node.store.set(
              createMessage({ key: "dirty", visible: false, value: isDirty })
            );
          },
          DOMInput: (e) => {
            node.input(e.target.value);
            node.emit("dom-input-event", e);
          }
        },
        help: node.props.help,
        id: node.props.id,
        items,
        label: node.props.label,
        messages: messages3,
        didMount: false,
        node: markRaw(node),
        options: node.props.options,
        defaultMessagePlacement: true,
        slots: node.props.__slots,
        state: {
          blurred: false,
          complete: isComplete,
          dirty: false,
          empty: empty(value),
          submitted: false,
          settled: node.isSettled,
          valid: isValid,
          invalid: isInvalid,
          errors: hasErrors,
          rules: hasValidation,
          validationVisible,
          required: isRequired,
          failing: false,
          passing
        },
        type: node.props.type,
        family: node.props.family,
        ui,
        value,
        classes: classes2
      });
      node.on("created", () => {
        if (!eq(context.value, node.value)) {
          _value.value = node.value;
          value.value = node.value;
          triggerRef(value);
          triggerRef(_value);
        }
        (async () => {
          await node.settled;
          if (node)
            node.props._init = cloneAny(node.value);
        })();
      });
      node.on("mounted", () => {
        context.didMount = true;
      });
      node.on("settled", ({ payload: isSettled }) => {
        context.state.settled = isSettled;
      });
      function observeProps(observe) {
        const propNames = Array.isArray(observe) ? observe : Object.keys(observe);
        propNames.forEach((prop) => {
          prop = camel(prop);
          if (!has(context, prop)) {
            context[prop] = node.props[prop];
          }
          node.on(`prop:${prop}`, ({ payload }) => {
            context[prop] = payload;
          });
        });
      }
      const rootProps = () => {
        const props = [
          "__root",
          "help",
          "label",
          "disabled",
          "options",
          "type",
          "attrs",
          "preserve",
          "preserveErrors",
          "id",
          "dirtyBehavior"
        ];
        const iconPattern = /^[a-zA-Z-]+(?:-icon|Icon)$/;
        const matchingProps = Object.keys(node.props).filter((prop) => {
          return iconPattern.test(prop);
        });
        return props.concat(matchingProps);
      };
      observeProps(rootProps());
      function definedAs(definition3) {
        if (definition3.props)
          observeProps(definition3.props);
      }
      node.props.definition && definedAs(node.props.definition);
      node.on("added-props", ({ payload }) => observeProps(payload));
      node.on("input", ({ payload }) => {
        if (node.type !== "input" && !isRef(payload) && !isReactive(payload)) {
          _value.value = shallowClone(payload);
        } else {
          _value.value = payload;
          triggerRef(_value);
        }
      });
      node.on("commitRaw", ({ payload }) => {
        if (node.type !== "input" && !isRef(payload) && !isReactive(payload)) {
          value.value = _value.value = shallowClone(payload);
        } else {
          value.value = _value.value = payload;
          triggerRef(value);
        }
        node.emit("modelUpdated");
      });
      node.on("commit", ({ payload }) => {
        var _a;
        if ((!context.state.dirty || context.dirtyBehavior === "compare") && node.isCreated && hasTicked) {
          if (!((_a = node.store.validating) == null ? void 0 : _a.value)) {
            context.handlers.touch();
          } else {
            const receipt = node.on("message-removed", ({ payload: message3 }) => {
              if (message3.key === "validating") {
                context.handlers.touch();
                node.off(receipt);
              }
            });
          }
        }
        if (isComplete && node.type === "input" && hasErrors.value && !undefine(node.props.preserveErrors)) {
          node.store.filter(
            (message3) => {
              var _a2;
              return !(message3.type === "error" && ((_a2 = message3.meta) == null ? void 0 : _a2.autoClear) === true);
            }
          );
        }
        if (node.type === "list" && node.sync) {
          items.value = node.children.map((child) => child.uid);
        }
        context.state.empty = empty(payload);
      });
      const updateState = async (message3) => {
        if (message3.type === "ui" && message3.visible && !message3.meta.showAsMessage) {
          ui[message3.key] = message3;
        } else if (message3.visible) {
          availableMessages[message3.key] = message3;
        } else if (message3.type === "state") {
          context.state[message3.key] = !!message3.value;
        }
      };
      node.on("message-added", (e) => updateState(e.payload));
      node.on("message-updated", (e) => updateState(e.payload));
      node.on("message-removed", ({ payload: message3 }) => {
        delete ui[message3.key];
        delete availableMessages[message3.key];
        delete context.state[message3.key];
      });
      node.on("settled:blocking", () => {
        isValid.value = true;
      });
      node.on("unsettled:blocking", () => {
        isValid.value = false;
      });
      node.on("settled:errors", () => {
        hasErrors.value = false;
      });
      node.on("unsettled:errors", () => {
        hasErrors.value = true;
      });
      watch(validationVisible, (value2) => {
        if (value2) {
          hasShownErrors.value = true;
        }
      });
      node.context = context;
      node.emit("context", node, false);
      node.on("destroyed", () => {
        node.context = void 0;
        node = null;
      });
    };
    bindings_default = vueBindings;
  }
});
var defaultConfig_exports = {};
__export2(defaultConfig_exports, {
  defaultConfig: () => defaultConfig
});
var defaultConfig;
var init_defaultConfig = __esm({
  "packages/vue/src/defaultConfig.ts"() {
    init_bindings();
    defaultConfig = (options2 = {}) => {
      register();
      const {
        rules = {},
        locales = {},
        inputs: inputs$1 = {},
        messages: messages3 = {},
        locale = void 0,
        theme = void 0,
        iconLoaderUrl = void 0,
        iconLoader = void 0,
        icons = {},
        ...nodeOptions
      } = options2;
      const validation = createValidationPlugin({
        ...index_dev_exports,
        ...rules || {}
      });
      const i18n = createI18nPlugin(
        extend({ en, ...locales || {} }, messages3)
      );
      const library = createLibraryPlugin(inputs, inputs$1);
      const themePlugin = createThemePlugin(theme, icons, iconLoaderUrl, iconLoader);
      return extend(
        {
          plugins: [library, themePlugin, bindings_default, i18n, validation],
          ...!locale ? {} : { config: { locale } }
        },
        nodeOptions || {},
        true
      );
    };
  }
});
var isServer = typeof window === "undefined";
var ssrCompleteRegistry = /* @__PURE__ */ new Map();
function ssrComplete(app) {
  if (!isServer)
    return;
  const callbacks = ssrCompleteRegistry.get(app);
  if (!callbacks)
    return;
  for (const callback of callbacks) {
    callback();
  }
  callbacks.clear();
  ssrCompleteRegistry.delete(app);
}
function onSSRComplete(app, callback) {
  var _a;
  if (!isServer || !app)
    return;
  if (!ssrCompleteRegistry.has(app))
    ssrCompleteRegistry.set(app, /* @__PURE__ */ new Set());
  (_a = ssrCompleteRegistry.get(app)) == null ? void 0 : _a.add(callback);
}
var isServer2 = typeof window === "undefined";
var memo = {};
var memoKeys = {};
var instanceKey;
var instanceScopes = /* @__PURE__ */ new WeakMap();
var raw = "__raw__";
var isClassProp = /[a-zA-Z0-9\-][cC]lass$/;
function getRef(token3, data) {
  const value = ref(null);
  if (token3 === "get") {
    const nodeRefs = {};
    value.value = get.bind(null, nodeRefs);
    return value;
  }
  const path = token3.split(".");
  watchEffect(() => {
    value.value = getValue(
      isRef(data) ? data.value : data,
      path
    );
  });
  return value;
}
function getValue(set, path) {
  if (Array.isArray(set)) {
    for (const subset of set) {
      const value = subset !== false && getValue(subset, path);
      if (value !== void 0)
        return value;
    }
    return void 0;
  }
  let foundValue = void 0;
  let obj = set;
  for (const i in path) {
    const key = path[i];
    if (typeof obj !== "object" || obj === null) {
      foundValue = void 0;
      break;
    }
    const currentValue = obj[key];
    if (Number(i) === path.length - 1 && currentValue !== void 0) {
      foundValue = typeof currentValue === "function" ? currentValue.bind(obj) : currentValue;
      break;
    }
    obj = currentValue;
  }
  return foundValue;
}
function get(nodeRefs, id) {
  if (typeof id !== "string")
    return warn(650);
  if (!(id in nodeRefs))
    nodeRefs[id] = ref(void 0);
  if (nodeRefs[id].value === void 0) {
    nodeRefs[id].value = null;
    const root = getNode(id);
    if (root)
      nodeRefs[id].value = root.context;
    watchRegistry(id, ({ payload: node }) => {
      nodeRefs[id].value = isNode(node) ? node.context : node;
    });
  }
  return nodeRefs[id].value;
}
function parseSchema(library, schema, memoKey) {
  function parseCondition(library2, node) {
    const condition = provider(compile(node.if), { if: true });
    const children = createElements(library2, node.then);
    const alternate = node.else ? createElements(library2, node.else) : null;
    return [condition, children, alternate];
  }
  function parseConditionAttr(attr, _default) {
    var _a, _b;
    const condition = provider(compile(attr.if));
    let b = () => _default;
    let a = () => _default;
    if (typeof attr.then === "object") {
      a = parseAttrs(attr.then, void 0);
    } else if (typeof attr.then === "string" && ((_a = attr.then) == null ? void 0 : _a.startsWith("$"))) {
      a = provider(compile(attr.then));
    } else {
      a = () => attr.then;
    }
    if (has(attr, "else")) {
      if (typeof attr.else === "object") {
        b = parseAttrs(attr.else);
      } else if (typeof attr.else === "string" && ((_b = attr.else) == null ? void 0 : _b.startsWith("$"))) {
        b = provider(compile(attr.else));
      } else {
        b = () => attr.else;
      }
    }
    return () => condition() ? a() : b();
  }
  function parseAttrs(unparsedAttrs, bindExp, _default = {}) {
    const explicitAttrs = new Set(Object.keys(unparsedAttrs || {}));
    const boundAttrs = bindExp ? provider(compile(bindExp)) : () => ({});
    const setters = [
      (attrs) => {
        const bound = boundAttrs();
        for (const attr in bound) {
          if (!explicitAttrs.has(attr)) {
            attrs[attr] = bound[attr];
          }
        }
      }
    ];
    if (unparsedAttrs) {
      if (isConditional(unparsedAttrs)) {
        const condition = parseConditionAttr(
          unparsedAttrs,
          _default
        );
        return condition;
      }
      for (let attr in unparsedAttrs) {
        const value = unparsedAttrs[attr];
        let getValue2;
        const isStr = typeof value === "string";
        if (attr.startsWith(raw)) {
          attr = attr.substring(7);
          getValue2 = () => value;
        } else if (isStr && value.startsWith("$") && value.length > 1 && !(value.startsWith("$reset") && isClassProp.test(attr))) {
          getValue2 = provider(compile(value));
        } else if (typeof value === "object" && isConditional(value)) {
          getValue2 = parseConditionAttr(value, void 0);
        } else if (typeof value === "object" && isPojo(value)) {
          getValue2 = parseAttrs(value);
        } else {
          getValue2 = () => value;
        }
        setters.push((attrs) => {
          attrs[attr] = getValue2();
        });
      }
    }
    return () => {
      const attrs = Array.isArray(unparsedAttrs) ? [] : {};
      setters.forEach((setter) => setter(attrs));
      return attrs;
    };
  }
  function parseNode(library2, _node) {
    let element = null;
    let attrs = () => null;
    let condition = false;
    let children = null;
    let alternate = null;
    let iterator = null;
    let resolve = false;
    const node = sugar(_node);
    if (isDOM(node)) {
      element = node.$el;
      attrs = node.$el !== "text" ? parseAttrs(node.attrs, node.bind) : () => null;
    } else if (isComponent(node)) {
      if (typeof node.$cmp === "string") {
        if (has(library2, node.$cmp)) {
          element = library2[node.$cmp];
        } else {
          element = node.$cmp;
          resolve = true;
        }
      } else {
        element = node.$cmp;
      }
      attrs = parseAttrs(node.props, node.bind);
    } else if (isConditional(node)) {
      [condition, children, alternate] = parseCondition(library2, node);
    }
    if (!isConditional(node) && "if" in node) {
      condition = provider(compile(node.if));
    } else if (!isConditional(node) && element === null) {
      condition = () => true;
    }
    if ("children" in node && node.children) {
      if (typeof node.children === "string") {
        if (node.children.startsWith("$slots.")) {
          element = element === "text" ? "slot" : element;
          children = provider(compile(node.children));
        } else if (node.children.startsWith("$") && node.children.length > 1) {
          const value = provider(compile(node.children));
          children = () => String(value());
        } else {
          children = () => String(node.children);
        }
      } else if (Array.isArray(node.children)) {
        children = createElements(library2, node.children);
      } else {
        const [childCondition, c, a] = parseCondition(library2, node.children);
        children = (iterationData) => childCondition && childCondition() ? c && c(iterationData) : a && a(iterationData);
      }
    }
    if (isComponent(node)) {
      if (children) {
        const produceChildren = children;
        children = (iterationData) => {
          return {
            default(slotData2, key) {
              var _a, _b, _c, _d;
              const currentKey = instanceKey;
              if (key)
                instanceKey = key;
              if (slotData2)
                (_a = instanceScopes.get(instanceKey)) == null ? void 0 : _a.unshift(slotData2);
              if (iterationData)
                (_b = instanceScopes.get(instanceKey)) == null ? void 0 : _b.unshift(iterationData);
              const c = produceChildren(iterationData);
              if (slotData2)
                (_c = instanceScopes.get(instanceKey)) == null ? void 0 : _c.shift();
              if (iterationData)
                (_d = instanceScopes.get(instanceKey)) == null ? void 0 : _d.shift();
              instanceKey = currentKey;
              return c;
            }
          };
        };
        children.slot = true;
      } else {
        children = () => ({});
      }
    }
    if ("for" in node && node.for) {
      const values = node.for.length === 3 ? node.for[2] : node.for[1];
      const getValues = typeof values === "string" && values.startsWith("$") ? provider(compile(values)) : () => values;
      iterator = [
        getValues,
        node.for[0],
        node.for.length === 3 ? String(node.for[1]) : null
      ];
    }
    return [condition, element, attrs, children, alternate, iterator, resolve];
  }
  function createSlots(children, iterationData) {
    const slots = children(iterationData);
    const currentKey = instanceKey;
    return Object.keys(slots).reduce((allSlots, slotName) => {
      const slotFn = slots && slots[slotName];
      allSlots[slotName] = (data) => {
        return slotFn && slotFn(data, currentKey) || null;
      };
      return allSlots;
    }, {});
  }
  function createElement(library2, node) {
    const [condition, element, attrs, children, alternate, iterator, resolve] = parseNode(library2, node);
    let createNodes = (iterationData) => {
      if (condition && element === null && children) {
        return condition() ? children(iterationData) : alternate && alternate(iterationData);
      }
      if (element && (!condition || condition())) {
        if (element === "text" && children) {
          return createTextVNode(String(children()));
        }
        if (element === "slot" && children)
          return children(iterationData);
        const el = resolve ? resolveComponent(element) : element;
        const slots = (children == null ? void 0 : children.slot) ? createSlots(children, iterationData) : null;
        return h(
          el,
          attrs(),
          slots || (children ? children(iterationData) : [])
        );
      }
      return typeof alternate === "function" ? alternate(iterationData) : alternate;
    };
    if (iterator) {
      const repeatedNode = createNodes;
      const [getValues, valueName, keyName] = iterator;
      createNodes = () => {
        const _v = getValues();
        const values = Number.isFinite(_v) ? Array(Number(_v)).fill(0).map((_, i) => i) : _v;
        const fragment2 = [];
        if (typeof values !== "object")
          return null;
        const instanceScope = instanceScopes.get(instanceKey) || [];
        const isArray = Array.isArray(values);
        for (const key in values) {
          if (isArray && key in Array.prototype)
            continue;
          const iterationData = Object.defineProperty(
            {
              ...instanceScope.reduce(
                (previousIterationData, scopedData) => {
                  if (previousIterationData.__idata) {
                    return { ...previousIterationData, ...scopedData };
                  }
                  return scopedData;
                },
                {}
              ),
              [valueName]: values[key],
              ...keyName !== null ? { [keyName]: isArray ? Number(key) : key } : {}
            },
            "__idata",
            { enumerable: false, value: true }
          );
          instanceScope.unshift(iterationData);
          fragment2.push(repeatedNode.bind(null, iterationData)());
          instanceScope.shift();
        }
        return fragment2;
      };
    }
    return createNodes;
  }
  function createElements(library2, schema2) {
    if (Array.isArray(schema2)) {
      const els = schema2.map(createElement.bind(null, library2));
      return (iterationData) => els.map((element2) => element2(iterationData));
    }
    const element = createElement(library2, schema2);
    return (iterationData) => element(iterationData);
  }
  const providers = [];
  function provider(compiled, hints = {}) {
    const compiledFns = /* @__PURE__ */ new WeakMap();
    providers.push((callback, key) => {
      compiledFns.set(
        key,
        compiled.provide((tokens) => callback(tokens, hints))
      );
    });
    return () => compiledFns.get(instanceKey)();
  }
  function createInstance(providerCallback, key) {
    memoKey ?? (memoKey = toMemoKey(schema));
    const [render, compiledProviders] = has(memo, memoKey) ? memo[memoKey] : [createElements(library, schema), providers];
    if (!isServer2) {
      memoKeys[memoKey] ?? (memoKeys[memoKey] = 0);
      memoKeys[memoKey]++;
      memo[memoKey] = [render, compiledProviders];
    }
    compiledProviders.forEach((compiledProvider) => {
      compiledProvider(providerCallback, key);
    });
    return () => {
      instanceKey = key;
      return render();
    };
  }
  return createInstance;
}
function useScope(token3, defaultValue) {
  const scopedData = instanceScopes.get(instanceKey) || [];
  let scopedValue = void 0;
  if (scopedData.length) {
    scopedValue = getValue(scopedData, token3.split("."));
  }
  return scopedValue === void 0 ? defaultValue : scopedValue;
}
function slotData(data, key) {
  return new Proxy(data, {
    get(...args) {
      let data2 = void 0;
      const property = args[1];
      if (typeof property === "string") {
        const prevKey = instanceKey;
        instanceKey = key;
        data2 = useScope(property, void 0);
        instanceKey = prevKey;
      }
      return data2 !== void 0 ? data2 : Reflect.get(...args);
    }
  });
}
function createRenderFn(instanceCreator, data, instanceKey2) {
  return instanceCreator(
    (requirements, hints = {}) => {
      return requirements.reduce((tokens, token3) => {
        if (token3.startsWith("slots.")) {
          const slot = token3.substring(6);
          const hasSlot = () => data.slots && has(data.slots, slot) && typeof data.slots[slot] === "function";
          if (hints.if) {
            tokens[token3] = hasSlot;
          } else if (data.slots) {
            const scopedData = slotData(data, instanceKey2);
            tokens[token3] = () => hasSlot() ? data.slots[slot](scopedData) : null;
          }
        } else {
          const value = getRef(token3, data);
          tokens[token3] = () => useScope(token3, value.value);
        }
        return tokens;
      }, {});
    },
    instanceKey2
  );
}
function clean(schema, memoKey, instanceKey2) {
  memoKey ?? (memoKey = toMemoKey(schema));
  memoKeys[memoKey]--;
  if (memoKeys[memoKey] === 0) {
    delete memoKeys[memoKey];
    const [, providers] = memo[memoKey];
    delete memo[memoKey];
    providers.length = 0;
  }
  instanceScopes.delete(instanceKey2);
}
function toMemoKey(schema) {
  return JSON.stringify(schema, (_, value) => {
    if (typeof value === "function") {
      return value.toString();
    }
    return value;
  });
}
var FormKitSchema = defineComponent({
  name: "FormKitSchema",
  props: {
    schema: {
      type: [Array, Object],
      required: true
    },
    data: {
      type: Object,
      default: () => ({})
    },
    library: {
      type: Object,
      default: () => ({})
    },
    memoKey: {
      type: String,
      required: false
    }
  },
  emits: ["mounted"],
  setup(props, context) {
    var _a;
    const instance = getCurrentInstance();
    let instanceKey2 = {};
    instanceScopes.set(instanceKey2, []);
    const library = { FormKit: markRaw(FormKit_default), ...props.library };
    let provider = parseSchema(library, props.schema, props.memoKey);
    let render;
    let data;
    if (!isServer2) {
      watch(
        () => props.schema,
        (newSchema, oldSchema) => {
          var _a2;
          const oldKey = instanceKey2;
          instanceKey2 = {};
          instanceScopes.set(instanceKey2, []);
          provider = parseSchema(library, props.schema, props.memoKey);
          render = createRenderFn(provider, data, instanceKey2);
          if (newSchema === oldSchema) {
            ((_a2 = instance == null ? void 0 : instance.proxy) == null ? void 0 : _a2.$forceUpdate).call(_a2);
          }
          clean(props.schema, props.memoKey, oldKey);
        },
        { deep: true }
      );
    }
    watchEffect(() => {
      data = Object.assign(reactive(props.data ?? {}), {
        slots: context.slots
      });
      context.slots;
      render = createRenderFn(provider, data, instanceKey2);
    });
    function cleanUp() {
      clean(props.schema, props.memoKey, instanceKey2);
      if (data.node)
        data.node.destroy();
      data.slots = null;
      data = null;
      render = null;
    }
    onMounted(() => context.emit("mounted"));
    onUnmounted(cleanUp);
    onSSRComplete((_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app, cleanUp);
    return () => render ? render() : null;
  }
});
var FormKitSchema_default = FormKitSchema;
var isServer3 = typeof window === "undefined";
var parentSymbol = Symbol("FormKitParent");
var componentSymbol = Symbol("FormKitComponentCallback");
var currentSchemaNode = null;
var getCurrentSchemaNode = () => currentSchemaNode;
function FormKit(props, context) {
  var _a, _b;
  const node = useInput(props, context);
  if (!node.props.definition)
    error(600, node);
  if (node.props.definition.component) {
    return () => {
      var _a2;
      return h(
        (_a2 = node.props.definition) == null ? void 0 : _a2.component,
        {
          context: node.context
        },
        { ...context.slots }
      );
    };
  }
  if (import.meta.hot) {
    const instance = getCurrentInstance();
    let initPreserve;
    (_a = import.meta.hot) == null ? void 0 : _a.on("vite:beforeUpdate", () => {
      initPreserve = node.props.preserve;
      node.props.preserve = true;
    });
    (_b = import.meta.hot) == null ? void 0 : _b.on("vite:afterUpdate", () => {
      var _a2;
      (_a2 = instance == null ? void 0 : instance.proxy) == null ? void 0 : _a2.$forceUpdate();
      node.props.preserve = initPreserve;
    });
  }
  const schema = ref([]);
  let memoKey = node.props.definition.schemaMemoKey;
  const generateSchema = () => {
    var _a2, _b2;
    const schemaDefinition = (_b2 = (_a2 = node.props) == null ? void 0 : _a2.definition) == null ? void 0 : _b2.schema;
    if (!schemaDefinition)
      error(601, node);
    if (typeof schemaDefinition === "function") {
      currentSchemaNode = node;
      schema.value = schemaDefinition({ ...props.sectionsSchema || {} });
      currentSchemaNode = null;
      if (memoKey && props.sectionsSchema || "memoKey" in schemaDefinition && typeof schemaDefinition.memoKey === "string") {
        memoKey = (memoKey ?? (schemaDefinition == null ? void 0 : schemaDefinition.memoKey)) + JSON.stringify(props.sectionsSchema);
      }
    } else {
      schema.value = schemaDefinition;
    }
  };
  generateSchema();
  if (!isServer3) {
    node.on("schema", () => {
      memoKey += "♻️";
      generateSchema();
    });
  }
  context.emit("node", node);
  const definitionLibrary = node.props.definition.library;
  const library = {
    FormKit: markRaw(formkitComponent),
    ...definitionLibrary,
    ...props.library ?? {}
  };
  function didMount() {
    node.emit("mounted");
  }
  context.expose({ node });
  return () => h(
    FormKitSchema,
    {
      schema: schema.value,
      data: node.context,
      onMounted: didMount,
      library,
      memoKey
    },
    { ...context.slots }
  );
}
var formkitComponent = defineComponent(
  FormKit,
  {
    props: runtimeProps,
    inheritAttrs: false
  }
);
var FormKit_default = formkitComponent;
var rootSymbol = Symbol();
var FormKitRoot = defineComponent((_p, context) => {
  const boundary = ref(null);
  const showBody = ref(false);
  const shadowRoot = ref(void 0);
  const stopWatch2 = watch(boundary, (el) => {
    let parent = el;
    let root = null;
    while (parent = parent == null ? void 0 : parent.parentNode) {
      root = parent;
      if (root instanceof ShadowRoot || root instanceof Document) {
        foundRoot(root);
        break;
      }
    }
    stopWatch2();
    showBody.value = true;
  });
  provide(rootSymbol, shadowRoot);
  function foundRoot(root) {
    shadowRoot.value = root;
  }
  return () => showBody.value && context.slots.default ? context.slots.default() : h("template", { ref: boundary });
});
function createPlugin(app, options2) {
  app.component(options2.alias || "FormKit", FormKit_default).component(options2.schemaAlias || "FormKitSchema", FormKitSchema_default);
  return {
    get: getNode,
    setLocale: (locale) => {
      var _a;
      if ((_a = options2.config) == null ? void 0 : _a.rootConfig) {
        options2.config.rootConfig.locale = locale;
      }
    },
    clearErrors: clearErrors2,
    setErrors: setErrors2,
    submit: submitForm,
    reset
  };
}
var optionsSymbol = Symbol.for("FormKitOptions");
var configSymbol = Symbol.for("FormKitConfig");
var plugin = {
  install(app, _options) {
    const options2 = Object.assign(
      {
        alias: "FormKit",
        schemaAlias: "FormKitSchema"
      },
      typeof _options === "function" ? _options() : _options
    );
    const rootConfig = createConfig(options2.config || {});
    options2.config = { rootConfig };
    app.config.globalProperties.$formkit = createPlugin(app, options2);
    app.provide(optionsSymbol, options2);
    app.provide(configSymbol, rootConfig);
    if (typeof window !== "undefined") {
      globalThis.__FORMKIT_CONFIGS__ = (globalThis.__FORMKIT_CONFIGS__ || []).concat([rootConfig]);
    }
  }
};
var isBrowser2 = typeof window !== "undefined";
var pseudoProps = [
  // Boolean props
  "ignore",
  "disabled",
  "preserve",
  // String props
  "help",
  "label",
  /^preserve(-e|E)rrors/,
  /^[a-z]+(?:-visibility|Visibility|-behavior|Behavior)$/,
  /^[a-zA-Z-]+(?:-class|Class)$/,
  "prefixIcon",
  "suffixIcon",
  /^[a-zA-Z-]+(?:-icon|Icon)$/
];
var boolProps = ["disabled", "ignore", "preserve"];
function classesToNodeProps(node, props) {
  if (props.classes) {
    Object.keys(props.classes).forEach(
      (key) => {
        if (typeof key === "string") {
          node.props[`_${key}Class`] = props.classes[key];
          if (isObject(props.classes[key]) && key === "inner")
            Object.values(props.classes[key]);
        }
      }
    );
  }
}
function onlyListeners(props) {
  if (!props)
    return {};
  const knownListeners = ["Submit", "SubmitRaw", "SubmitInvalid"].reduce(
    (listeners, listener) => {
      const name = `on${listener}`;
      if (name in props) {
        if (typeof props[name] === "function") {
          listeners[name] = props[name];
        }
      }
      return listeners;
    },
    {}
  );
  return knownListeners;
}
function useInput(props, context, options2 = {}) {
  const config = Object.assign({}, inject(optionsSymbol) || {}, options2);
  const __root = inject(rootSymbol, ref(isBrowser2 ? document : void 0));
  const __cmpCallback = inject(componentSymbol, () => {
  });
  const instance = getCurrentInstance();
  const listeners = onlyListeners(instance == null ? void 0 : instance.vnode.props);
  const isVModeled = ["modelValue", "model-value"].some(
    (prop) => prop in ((instance == null ? void 0 : instance.vnode.props) ?? {})
  );
  let isMounted = false;
  onMounted(() => {
    isMounted = true;
  });
  const value = props.modelValue !== void 0 ? props.modelValue : cloneAny(context.attrs.value);
  function createInitialProps() {
    const initialProps2 = {
      ...nodeProps(props),
      ...listeners,
      type: props.type ?? "text",
      __root: __root.value,
      __slots: context.slots
    };
    const attrs = except(nodeProps(context.attrs), pseudoProps);
    if (!attrs.key)
      attrs.key = token();
    initialProps2.attrs = attrs;
    const propValues = only(nodeProps(context.attrs), pseudoProps);
    for (const propName in propValues) {
      if (boolProps.includes(propName) && propValues[propName] === "") {
        propValues[propName] = true;
      }
      initialProps2[camel(propName)] = propValues[propName];
    }
    const classesProps = { props: {} };
    classesToNodeProps(classesProps, props);
    Object.assign(initialProps2, classesProps.props);
    if (typeof initialProps2.type !== "string") {
      initialProps2.definition = initialProps2.type;
      delete initialProps2.type;
    }
    return initialProps2;
  }
  const initialProps = createInitialProps();
  const parent = initialProps.ignore ? null : props.parent || inject(parentSymbol, null);
  const node = createNode(
    extend(
      config || {},
      {
        name: props.name || void 0,
        value,
        parent,
        plugins: (config.plugins || []).concat(props.plugins ?? []),
        config: props.config || {},
        props: initialProps,
        index: props.index,
        sync: !!undefine(context.attrs.sync || context.attrs.dynamic)
      },
      false,
      true
    )
  );
  __cmpCallback(node);
  if (!node.props.definition)
    error(600, node);
  const lateBoundProps = ref(
    new Set(
      Array.isArray(node.props.__propDefs) ? node.props.__propDefs : Object.keys(node.props.__propDefs ?? {})
    )
  );
  node.on(
    "added-props",
    ({ payload: lateProps }) => {
      const propNames = Array.isArray(lateProps) ? lateProps : Object.keys(lateProps ?? {});
      propNames.forEach((newProp) => lateBoundProps.value.add(newProp));
    }
  );
  const pseudoPropNames = computed(
    () => pseudoProps.concat([...lateBoundProps.value]).reduce((names, prop) => {
      if (typeof prop === "string") {
        names.push(camel(prop));
        names.push(kebab(prop));
      } else {
        names.push(prop);
      }
      return names;
    }, [])
  );
  watchEffect(() => classesToNodeProps(node, props));
  const passThrough = nodeProps(props);
  for (const prop in passThrough) {
    watch(
      () => props[prop],
      () => {
        if (props[prop] !== void 0) {
          node.props[prop] = props[prop];
        }
      }
    );
  }
  watchEffect(() => {
    node.props.__root = __root.value;
  });
  const attributeWatchers = /* @__PURE__ */ new Set();
  const possibleProps = nodeProps(context.attrs);
  watchEffect(() => {
    watchAttributes(only(possibleProps, pseudoPropNames.value));
  });
  function watchAttributes(attrProps) {
    attributeWatchers.forEach((stop) => {
      stop();
      attributeWatchers.delete(stop);
    });
    for (const prop in attrProps) {
      const camelName = camel(prop);
      attributeWatchers.add(
        watch(
          () => context.attrs[prop],
          () => {
            node.props[camelName] = context.attrs[prop];
          }
        )
      );
    }
  }
  watchEffect(() => {
    const attrs = except(nodeProps(context.attrs), pseudoPropNames.value);
    if ("multiple" in attrs)
      attrs.multiple = undefine(attrs.multiple);
    if (typeof attrs.onBlur === "function") {
      attrs.onBlur = oncePerTick(attrs.onBlur);
    }
    node.props.attrs = Object.assign({}, node.props.attrs || {}, attrs);
  });
  watchEffect(() => {
    const messages3 = (props.errors ?? []).map(
      (error3) => createMessage({
        key: slugify(error3),
        type: "error",
        value: error3,
        meta: { source: "prop" }
      })
    );
    node.store.apply(
      messages3,
      (message3) => message3.type === "error" && message3.meta.source === "prop"
    );
  });
  if (node.type !== "input") {
    const sourceKey = `${node.name}-prop`;
    watchEffect(() => {
      const inputErrors = props.inputErrors ?? {};
      const keys = Object.keys(inputErrors);
      if (!keys.length)
        node.clearErrors(true, sourceKey);
      const messages3 = keys.reduce((messages4, key) => {
        let value2 = inputErrors[key];
        if (typeof value2 === "string")
          value2 = [value2];
        if (Array.isArray(value2)) {
          messages4[key] = value2.map(
            (error3) => createMessage({
              key: error3,
              type: "error",
              value: error3,
              meta: { source: sourceKey }
            })
          );
        }
        return messages4;
      }, {});
      node.store.apply(
        messages3,
        (message3) => message3.type === "error" && message3.meta.source === sourceKey
      );
    });
  }
  watchEffect(() => Object.assign(node.config, props.config));
  if (node.type !== "input") {
    provide(parentSymbol, node);
  }
  let clonedValueBeforeVmodel = void 0;
  node.on("modelUpdated", () => {
    var _a, _b;
    context.emit("inputRaw", (_a = node.context) == null ? void 0 : _a.value, node);
    if (isMounted) {
      context.emit("input", (_b = node.context) == null ? void 0 : _b.value, node);
    }
    if (isVModeled && node.context) {
      clonedValueBeforeVmodel = cloneAny(node.value);
      context.emit("update:modelValue", shallowClone(node.value));
    }
  });
  if (isVModeled) {
    watch(
      toRef(props, "modelValue"),
      (value2) => {
        if (!eq(clonedValueBeforeVmodel, value2)) {
          node.input(value2, false);
        }
      },
      { deep: true }
    );
    if (node.value !== value) {
      node.emit("modelUpdated");
    }
  }
  onBeforeUnmount(() => node.destroy());
  return node;
}
var totalCreated = 1;
function isComponent2(obj) {
  return typeof obj === "function" && obj.length === 2 || typeof obj === "object" && !Array.isArray(obj) && !("$el" in obj) && !("$cmp" in obj) && !("if" in obj);
}
function createInput(schemaOrComponent, definitionOptions = {}, sectionsSchema = {}) {
  const definition3 = {
    type: "input",
    ...definitionOptions
  };
  let schema;
  if (isComponent2(schemaOrComponent)) {
    const cmpName = `SchemaComponent${totalCreated++}`;
    schema = createSection("input", () => ({
      $cmp: cmpName,
      props: {
        context: "$node.context"
      }
    }));
    definition3.library = { [cmpName]: markRaw(schemaOrComponent) };
  } else if (typeof schemaOrComponent === "function") {
    schema = schemaOrComponent;
  } else {
    schema = createSection("input", () => cloneAny(schemaOrComponent));
  }
  definition3.schema = useSchema(schema || "Schema undefined", sectionsSchema);
  if (!definition3.schemaMemoKey) {
    definition3.schemaMemoKey = `${Math.random()}`;
  }
  return definition3;
}
function defineFormKitConfig(config) {
  return () => typeof config === "function" ? config() : config;
}
var inputList = {};
var schemas = {};
var classes = {
  container: `
    formkit-kitchen-sink 
    p-8
  `,
  tabs: `
    formkit-tabs 
    mt-4 
    mr-[min(350px,25vw)]
  `,
  tab: `
    formkit-kitchen-sink-tab
    inline-block
    mb-4
    -mr-px
    cursor-pointer
    px-4
    py-2
    border
    border-neutral-200
    text-neutral-800
    data-[active]:bg-neutral-800
    data-[active]:border-neutral-800
    data-[active]:text-neutral-50
    hover:bg-neutral-100
    hover:text-neutral-900
    dark:border-neutral-700
    dark:text-neutral-50
    dark:data-[active]:bg-neutral-100
    dark:data-[active]:border-neutral-100
    dark:data-[active]:text-neutral-800
    dark:hover:bg-neutral-800
    dark:hover:text-neutral-50
  `,
  filterContainer: `
    formkit-filter-container
    grid
    grid-cols-[repeat(auto-fit,300px)]
    mr-[min(350px,25vw)]
    -mt-4
    mb-8
    px-4
    pt-8
    pb-4
    border
    relative
    -translate-y-px
    max-w-[1000px]
    border-neutral-200
    dark:border-neutral-700
  `,
  filterGroup: `
    formkit-filter-group
    mr-8
    mb-8
    [&_legend]:text-lg
    [&_ul]:columns-2
    [&_ul>li:first-child]:[column-span:all]
    [&_ul>li:first-child]:mt-2
    [&_ul>li:first-child]:mb-2
    [&_ul>li:first-child]:pb-2
    [&_ul>li:first-child]:border-b
    [&_ul>li:first-child]:border-neutral-200
    dark:[&_ul>li:first-child]:border-neutral-700
  `,
  formContainer: `
    formkit-form-container
    w-full
    bg-white
    rounded
    border
    border-neutral-100
    shadow-lg
    max-w-[800px]
    p-[min(5vw,5rem)]
    dark:bg-neutral-900
    dark:border-neutral-800
    dark:shadow-3xl
    [&_form>h1]:text-2xl
    [&_form>h1]:mb-4
    [&_form>h1]:font-bold
    [&_form>h1+p]:text-base
    [&_form>h1+p]:mb-4
    [&_form>h1+p]:-mt-2
    [&_form_.double]:flex
    [&_form_.double>*]:w-1/2
    [&_form_.double>*:first-child]:mr-2
    [&_form_.triple]:flex
    [&_form_.triple>*]:w-1/3
    [&_form_.triple>*:first-child]:mr-2
    [&_form_.triple>*:last-child]:ml-2
  `,
  inputs: `formkit-inputs`,
  specimen: `
    formkit-specimen 
    flex 
    flex-col 
    p-2 
    max-w-[75vw]
  `,
  inputSection: `
    group/section
    formkit-input-section 
    mr-[min(325px,25vw)]
  `,
  specimenGroup: `
    formkit-specimen-group
    grid
    mb-16
    grid-cols-[repeat(auto-fit,400px)]
    group-data-[type="transferlist"]/section:grid-cols-[repeat(auto-fit,650px)]
    group-data-[type="multi-step"]/section:grid-cols-[repeat(auto-fit,550px)]
  `,
  inputType: `
    formkit-input-type
    block
    font-bold
    text-neutral-900
    border-b
    border-neutral-100
    text-3xl
    mb-8
    pb-2
    capitalize
    dark:border-neutral-800 
    dark:text-neutral-50
  `
};
async function fetchInputList() {
  const response = await fetch(
    "https://raw.githubusercontent.com/formkit/input-schemas/master/index.json"
  );
  const json = await response.json();
  return json;
}
async function fetchInputSchema(input) {
  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/formkit/input-schemas/master/schemas/${input}.json`
    );
    const json = await response.json();
    return json;
  } catch (error3) {
    console.error(error3);
  }
}
var FormKitKitchenSink = defineComponent({
  name: "FormKitKitchenSink",
  props: {
    schemas: {
      type: Array,
      required: false
    },
    pro: {
      type: Boolean,
      default: true
    },
    addons: {
      type: Boolean,
      default: true
    },
    forms: {
      type: Boolean,
      default: true
    },
    navigation: {
      type: Boolean,
      default: true
    }
  },
  async setup(props) {
    onMounted(() => {
      const filterNode = getNode("filter-checkboxes");
      data.filters = computed(() => {
        if (!(filterNode == null ? void 0 : filterNode.context))
          return [];
        const filters = filterNode.context.value;
        const filterValues = [];
        Object.keys(filters).forEach((key) => {
          filterValues.push(...filters[key]);
        });
        return filterValues;
      });
    });
    inputList = Object.keys(inputList).length ? inputList : await fetchInputList();
    const promises = [];
    const activeTab = ref("");
    const inputCheckboxes = computed(() => {
      const inputGroups = {
        core: { label: "Inputs", name: "core", inputs: inputList.core }
      };
      if (props.pro) {
        inputGroups.pro = {
          label: "Pro Inputs",
          name: "pro",
          inputs: inputList.pro
        };
      }
      if (props.addons) {
        inputGroups.addons = {
          label: "Add-ons",
          name: "addons",
          inputs: inputList.addons
        };
      }
      return inputGroups;
    });
    if (!props.schemas) {
      const coreInputPromises = inputList.core.map(async (schema) => {
        const response = await fetchInputSchema(schema);
        schemas[schema] = response;
      });
      promises.push(...coreInputPromises);
      if (props.forms) {
        const formsPromises = inputList.forms.map(async (schema) => {
          const schemaName = `form/${schema}`;
          const response = await fetchInputSchema(schemaName);
          schemas[schemaName] = response;
        });
        promises.push(...formsPromises);
      }
      if (props.pro) {
        const proInputPromises = inputList.pro.map(async (schema) => {
          const response = await fetchInputSchema(schema);
          schemas[schema] = response;
        });
        promises.push(...proInputPromises);
      }
      if (props.addons) {
        const addonPromises = inputList.addons.map(async (schema) => {
          const response = await fetchInputSchema(schema);
          schemas[schema] = response;
        });
        promises.push(...addonPromises);
      }
    } else {
      const schemaPromises = props.schemas.map(async (schema) => {
        const response = await fetchInputSchema(`${schema}`);
        schemas[`${schema}`] = response;
      });
      promises.push(...schemaPromises);
    }
    const selectAll = (node) => {
      let previousValue = [];
      let skip = false;
      if (node.props.type !== "checkbox")
        return;
      node.on("created", () => {
        const currentValue = node.value;
        if (Array.isArray(currentValue) && currentValue.length === 1 && currentValue[0] === "all") {
          node.input(
            node.props.options.map((option2) => {
              if (typeof option2 !== "string")
                return option2.value;
              return option2;
            })
          );
        }
        previousValue = Array.isArray(node.value) ? node.value : [];
      });
      node.on("commit", ({ payload }) => {
        if (skip) {
          skip = false;
          return;
        }
        if (!Array.isArray(payload))
          return;
        const previousValueHadAll = previousValue.includes("all");
        const currentValueHasAll = payload.includes("all");
        if (!previousValueHadAll && currentValueHasAll) {
          const computedOptions = node.props.options.map(
            (option2) => {
              if (typeof option2 !== "string")
                return option2.value;
              return option2;
            }
          );
          node.input(computedOptions);
          previousValue = computedOptions;
          return;
        }
        if (previousValueHadAll && !currentValueHasAll) {
          node.input([]);
          previousValue = [];
          return;
        }
        const valueMinusAll = payload.filter((value) => value !== "all");
        if (valueMinusAll.length < node.props.options.length - 1 && currentValueHasAll) {
          node.input(valueMinusAll);
          previousValue = valueMinusAll;
          skip = true;
          return;
        }
        if (valueMinusAll.length === node.props.options.length - 1 && !currentValueHasAll) {
          const computedOptions = node.props.options.map(
            (option2) => {
              if (typeof option2 !== "string")
                return option2.value;
              return option2;
            }
          );
          node.input(computedOptions);
          previousValue = Array.isArray(node.value) ? node.value : [];
          return;
        }
      });
    };
    const data = reactive({
      twClasses: classes,
      basicOptions: Array.from({ length: 15 }, (_, i) => `Option ${i + 1}`),
      asyncLoader: async () => {
        return await new Promise(() => {
        });
      },
      paginatedLoader: async ({
        page,
        hasNextPage
      }) => {
        const base = (page - 1) * 10;
        hasNextPage();
        return Array.from({ length: 10 }, (_, i) => `Option ${base + i + 1}`);
      },
      formSubmitHandler: async (data2) => {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        alert("Form submitted (fake) — check console for data object");
        console.log("Form data:", data2);
      },
      includes: (array, value) => {
        if (!Array.isArray(array))
          return false;
        return array.includes(value);
      },
      checkboxPlugins: [selectAll],
      filters: []
    });
    await Promise.all(promises);
    const inputKeys = Object.keys(schemas);
    const formNames = inputKeys.map((key) => {
      if (key.startsWith("form/")) {
        switch (key) {
          case "form/tshirt":
            return {
              id: key,
              name: "Order Form"
            };
          default:
            const name = key.replace("form/", "");
            return {
              id: key,
              name: name.charAt(0).toUpperCase() + name.slice(1) + " Form"
            };
        }
      }
      return {
        id: key,
        name: ""
      };
    });
    const filteredFormNames = formNames.filter((form3) => form3.name !== "");
    const forms = inputKeys.filter((schema) => {
      return schema.startsWith("form/");
    });
    const inputs2 = inputKeys.filter(
      (schema) => !schema.startsWith("form/")
    );
    const tabs = [];
    if (inputs2.length) {
      tabs.push({
        id: "kitchen-sink",
        name: "Kitchen Sink"
      });
    }
    if (forms.length) {
      tabs.push(...filteredFormNames.sort((a, b) => a.name > b.name ? 1 : -1));
    }
    if (tabs.length) {
      activeTab.value = tabs[0].id;
    }
    const kitchenSinkRenders = computed(() => {
      inputs2.sort();
      const schemaDefinitions = inputs2.reduce(
        (schemaDefinitions2, inputName) => {
          const schemaDefinition = schemas[inputName];
          schemaDefinitions2.push({
            $el: "div",
            if: '$includes($filters, "' + inputName + '")',
            attrs: {
              key: inputName,
              class: "$twClasses.inputSection",
              "data-type": inputName
            },
            children: [
              {
                $el: "h2",
                attrs: {
                  class: "$twClasses.inputType"
                },
                children: inputName
              },
              {
                $el: "div",
                attrs: {
                  class: "$twClasses.specimenGroup"
                },
                children: [
                  ...(Array.isArray(schemaDefinition) ? schemaDefinition : [schemaDefinition]).map((specimen) => {
                    return {
                      $el: "div",
                      attrs: {
                        class: "$twClasses.specimen"
                      },
                      children: [specimen]
                    };
                  })
                ]
              }
            ]
          });
          return schemaDefinitions2;
        },
        []
      );
      return h(
        KeepAlive,
        {},
        {
          default: () => {
            return activeTab.value === "kitchen-sink" ? h(FormKitSchema, { schema: schemaDefinitions, data }) : null;
          }
        }
      );
    });
    const formRenders = computed(() => {
      return filteredFormNames.map((form3) => {
        const schemaDefinition = schemas[form3.id];
        return h(
          "div",
          {
            key: form3.id
          },
          activeTab.value === form3.id ? [
            h(
              "div",
              {
                class: classes.formContainer
              },
              [
                h(FormKitSchema, {
                  schema: schemaDefinition[0],
                  data
                })
              ]
            )
          ] : ""
        );
      }).filter((form3) => form3.children);
    });
    const tabBar = computed(() => {
      return h(
        "div",
        {
          key: "tab-bar",
          class: classes.tabs
        },
        tabs.map((tab) => {
          return h(
            "span",
            {
              class: classes.tab,
              key: tab.id,
              "data-tab": tab.id,
              "data-active": activeTab.value === tab.id || void 0,
              onClick: () => {
                activeTab.value = tab.id;
              }
            },
            tab.name
          );
        })
      );
    });
    const filterCheckboxes = computed(() => {
      const createCheckboxSchema = (inputGroup) => {
        return {
          $el: "div",
          attrs: {
            class: "$twClasses.filterGroup"
          },
          children: [
            {
              $formkit: "checkbox",
              name: inputGroup.name,
              label: inputGroup.label,
              plugins: "$checkboxPlugins",
              value: ["all"],
              options: [
                {
                  label: "All",
                  value: "all"
                },
                ...Array.isArray(inputGroup.inputs) ? inputGroup.inputs : []
              ]
            }
          ]
        };
      };
      const filterSchema = h(FormKitSchema, {
        key: "filter-checkboxes",
        data,
        schema: {
          $formkit: "group",
          id: "filter-checkboxes",
          children: [
            {
              $el: "div",
              attrs: {
                class: "$twClasses.filterContainer"
              },
              children: Object.keys(inputCheckboxes.value).map((key) => {
                const inputGroup = inputCheckboxes.value[key];
                return createCheckboxSchema(inputGroup);
              })
            }
          ]
        }
      });
      return h(
        KeepAlive,
        {},
        {
          default: () => {
            if (!(tabs.find((tab) => tab.id === "kitchen-sink") && activeTab.value === "kitchen-sink")) {
              return null;
            }
            return filterSchema;
          }
        }
      );
    });
    return () => {
      return h(
        "div",
        {
          class: classes.container
        },
        [
          tabs.length > 1 ? tabBar.value : void 0,
          filterCheckboxes.value,
          ...formRenders.value,
          kitchenSinkRenders.value
        ]
      );
    };
  }
});
var messages2 = createSection("messages", () => ({
  $el: "ul",
  if: "$fns.length($messages)"
}));
var message2 = createSection("message", () => ({
  $el: "li",
  for: ["message", "$messages"],
  attrs: {
    key: "$message.key",
    id: `$id + '-' + $message.key`,
    "data-message-type": "$message.type"
  }
}));
var definition = messages2(message2("$message.value"));
var FormKitMessages = defineComponent({
  props: {
    node: {
      type: Object,
      required: false
    },
    sectionsSchema: {
      type: Object,
      default: {}
    },
    defaultPosition: {
      type: [String, Boolean],
      default: false
    },
    library: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, context) {
    const node = computed(() => {
      return props.node || inject(parentSymbol, void 0);
    });
    watch(
      node,
      () => {
        var _a;
        if (((_a = node.value) == null ? void 0 : _a.context) && !undefine(props.defaultPosition)) {
          node.value.context.defaultMessagePlacement = false;
        }
      },
      { immediate: true }
    );
    const schema = definition(props.sectionsSchema || {});
    const data = computed(() => {
      var _a, _b, _c, _d, _e, _f;
      return {
        messages: ((_b = (_a = node.value) == null ? void 0 : _a.context) == null ? void 0 : _b.messages) || {},
        fns: ((_d = (_c = node.value) == null ? void 0 : _c.context) == null ? void 0 : _d.fns) || {},
        classes: ((_f = (_e = node.value) == null ? void 0 : _e.context) == null ? void 0 : _f.classes) || {}
      };
    });
    return () => {
      var _a;
      return ((_a = node.value) == null ? void 0 : _a.context) ? h(
        FormKitSchema_default,
        { schema, data: data.value, library: props.library },
        { ...context.slots }
      ) : null;
    };
  }
});
function useConfig(config) {
  const options2 = Object.assign(
    {
      alias: "FormKit",
      schemaAlias: "FormKitSchema"
    },
    typeof config === "function" ? config() : config
  );
  const rootConfig = createConfig(options2.config || {});
  options2.config = { rootConfig };
  provide(optionsSymbol, options2);
  provide(configSymbol, rootConfig);
  if (typeof window !== "undefined") {
    globalThis.__FORMKIT_CONFIGS__ = (globalThis.__FORMKIT_CONFIGS__ || []).concat([rootConfig]);
  }
}
var FormKitProvider = defineComponent(
  function FormKitProvider2(props, { slots, attrs }) {
    const options2 = {};
    if (props.config) {
      useConfig(props.config);
    }
    return () => slots.default ? slots.default(options2).map((vnode) => {
      return h(vnode, {
        ...attrs,
        ...vnode.props
      });
    }) : null;
  },
  { props: ["config"], name: "FormKitProvider", inheritAttrs: false }
);
var FormKitConfigLoader = defineComponent(
  async function FormKitConfigLoader2(props, context) {
    let config = {};
    if (props.configFile) {
      const configFile = await import(
        /*@__formkit.config.ts__*/
        /* @vite-ignore */
        /* webpackIgnore: true */
        props.configFile
      );
      config = "default" in configFile ? configFile.default : configFile;
    }
    if (typeof config === "function") {
      config = config();
    }
    const useDefaultConfig = props.defaultConfig ?? true;
    if (useDefaultConfig) {
      const { defaultConfig: defaultConfig2 } = await Promise.resolve().then(() => (init_defaultConfig(), defaultConfig_exports));
      config = defaultConfig2(config);
    }
    return () => h(FormKitProvider, { ...context.attrs, config }, context.slots);
  },
  {
    props: ["defaultConfig", "configFile"],
    inheritAttrs: false
  }
);
var FormKitLazyProvider = defineComponent(
  function FormKitLazyProvider2(props, context) {
    const config = inject(optionsSymbol, null);
    const passthru = (vnode) => {
      return h(vnode, {
        ...context.attrs,
        ...vnode.props
      });
    };
    if (config) {
      return () => {
        var _a;
        return ((_a = context.slots) == null ? void 0 : _a.default) ? context.slots.default().map(passthru) : null;
      };
    }
    const instance = getCurrentInstance();
    if (instance.suspense) {
      return () => h(FormKitConfigLoader, props, {
        default: () => {
          var _a;
          return ((_a = context.slots) == null ? void 0 : _a.default) ? context.slots.default().map(passthru) : null;
        }
      });
    }
    return () => h(Suspense, null, {
      ...context.slots,
      default: () => h(FormKitConfigLoader, { ...context.attrs, ...props }, context.slots)
    });
  },
  {
    props: ["defaultConfig", "configFile"],
    inheritAttrs: false
  }
);
function useFormKitContext(addressOrEffect, optionalEffect) {
  var _a;
  const address = typeof addressOrEffect === "string" ? addressOrEffect : void 0;
  const effect = typeof addressOrEffect === "function" ? addressOrEffect : optionalEffect;
  const context = ref();
  const parentNode = inject(parentSymbol, null);
  if (!parentNode) {
    console.warn(
      "useFormKitContext must be used as a child of a FormKit component."
    );
  }
  if (parentNode) {
    if (address) {
      context.value = (_a = parentNode.at(address)) == null ? void 0 : _a.context;
      const root = parentNode.at("$root");
      if (root) {
        const receipt = root.on("child.deep", () => {
          const targetNode = parentNode.at(address);
          if (targetNode && targetNode.context !== context.value) {
            context.value = targetNode.context;
            if (effect)
              effect(context.value);
          }
        });
        onUnmounted(() => {
          root.off(receipt);
        });
      }
    } else {
      context.value = parentNode == null ? void 0 : parentNode.context;
    }
  }
  if (context.value && effect)
    effect(context.value);
  return context;
}
function useFormKitContextById(id, effect) {
  const context = ref();
  const targetNode = getNode(id);
  if (targetNode)
    context.value = targetNode.context;
  if (!targetNode) {
    const receipt = watchRegistry(id, ({ payload: node }) => {
      if (node) {
        context.value = node.context;
        stopWatch(receipt);
        if (effect)
          effect(context.value);
      }
    });
  }
  if (context.value && effect)
    effect(context.value);
  return context;
}
function useFormKitNodeById(id, effect) {
  const nodeRef = ref();
  const targetNode = getNode(id);
  if (targetNode)
    nodeRef.value = targetNode;
  if (!targetNode) {
    const receipt = watchRegistry(id, ({ payload: node }) => {
      if (node) {
        nodeRef.value = node;
        stopWatch(receipt);
        if (effect)
          effect(node);
      }
    });
  }
  if (nodeRef.value && effect)
    effect(nodeRef.value);
  return nodeRef;
}
var summary = createSection("summary", () => ({
  $el: "div",
  attrs: {
    "aria-live": "polite"
  }
}));
var summaryInner = createSection("summaryInner", () => ({
  $el: "div",
  if: "$summaries.length && $showSummaries"
}));
var messages22 = createSection("messages", () => ({
  $el: "ul",
  if: "$summaries.length && $showSummaries"
}));
var message22 = createSection("message", () => ({
  $el: "li",
  for: ["summary", "$summaries"],
  attrs: {
    key: "$summary.key",
    "data-message-type": "$summary.type"
  }
}));
var summaryHeader = createSection("summaryHeader", () => ({
  $el: "h2",
  attrs: {
    id: "$id"
  }
}));
var messageLink = createSection("messageLink", () => ({
  $el: "a",
  attrs: {
    id: "$summary.key",
    href: '$: "#" + $summary.id',
    onClick: "$jumpLink"
  }
}));
var definition2 = summary(
  summaryInner(
    summaryHeader("$summaryHeader"),
    messages22(message22(messageLink("$summary.message")))
  )
);
var FormKitSummary = defineComponent({
  props: {
    node: {
      type: Object,
      required: false
    },
    forceShow: {
      type: Boolean,
      default: false
    },
    sectionsSchema: {
      type: Object,
      default: {}
    }
  },
  emits: {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    show: (_summaries) => true
  },
  setup(props, context) {
    var _a, _b;
    const id = `summary-${token()}`;
    const node = computed(() => {
      return props.node || inject(parentSymbol, void 0);
    });
    if (!node)
      throw new Error(
        "FormKitSummary must have a FormKit parent or use the node prop."
      );
    const summaryContexts = ref([]);
    const showSummaries = ref(false);
    const summaries = computed(() => {
      const summarizedMessages = [];
      summaryContexts.value.forEach((context2) => {
        for (const idx in context2.messages) {
          const message3 = context2.messages[idx];
          if (typeof message3.value !== "string")
            continue;
          summarizedMessages.push({
            message: message3.value,
            id: context2.id,
            key: `${context2.id}-${message3.key}`,
            type: message3.type
          });
        }
      });
      return summarizedMessages;
    });
    const addContexts = () => {
      var _a2;
      summaryContexts.value = [];
      (_a2 = node.value) == null ? void 0 : _a2.walk(
        (child) => child.context && summaryContexts.value.push(child.context)
      );
    };
    (_a = node.value) == null ? void 0 : _a.on("submit-raw", async () => {
      var _a2, _b2;
      addContexts();
      if (summaries.value.length === 0)
        return;
      context.emit("show", summaries.value);
      showSummaries.value = true;
      await nextTick();
      if (typeof window !== "undefined") {
        (_a2 = document.getElementById(id)) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
        if (summaries.value[0]) {
          (_b2 = document.getElementById(summaries.value[0].key)) == null ? void 0 : _b2.focus();
        }
      }
    });
    (_b = node.value) == null ? void 0 : _b.on("child", addContexts);
    function jumpLink(e) {
      var _a2, _b2, _c;
      if (e.target instanceof HTMLAnchorElement) {
        e.preventDefault();
        const id2 = (_a2 = e.target.getAttribute("href")) == null ? void 0 : _a2.substring(1);
        if (id2) {
          (_b2 = document.getElementById(id2)) == null ? void 0 : _b2.scrollIntoView({ behavior: "smooth" });
          (_c = document.getElementById(id2)) == null ? void 0 : _c.focus();
        }
      }
    }
    localize("summaryHeader", "There were errors in your form.")(node.value);
    const schema = definition2(props.sectionsSchema || {});
    const data = computed(() => {
      var _a2, _b2, _c, _d, _e, _f, _g, _h;
      return {
        id,
        fns: ((_b2 = (_a2 = node.value) == null ? void 0 : _a2.context) == null ? void 0 : _b2.fns) || {},
        classes: ((_d = (_c = node.value) == null ? void 0 : _c.context) == null ? void 0 : _d.classes) || {},
        summaries: summaries.value,
        showSummaries: props.forceShow || showSummaries.value,
        summaryHeader: ((_h = (_g = (_f = (_e = node.value) == null ? void 0 : _e.context) == null ? void 0 : _f.ui) == null ? void 0 : _g.summaryHeader) == null ? void 0 : _h.value) || "",
        jumpLink
      };
    });
    return () => {
      var _a2;
      return ((_a2 = node.value) == null ? void 0 : _a2.context) ? h(FormKitSchema_default, { schema, data: data.value }, { ...context.slots }) : null;
    };
  }
});
init_defaultConfig();
init_bindings();
var FormKitIcon = defineComponent({
  name: "FormKitIcon",
  props: {
    icon: {
      type: String,
      default: ""
    },
    iconLoader: {
      type: Function,
      default: null
    },
    iconLoaderUrl: {
      type: Function,
      default: null
    }
  },
  setup(props) {
    var _a, _b;
    const icon2 = ref(void 0);
    const config = inject(optionsSymbol, {});
    const parent = inject(parentSymbol, null);
    let iconHandler = void 0;
    function loadIcon() {
      if (!iconHandler || typeof iconHandler !== "function")
        return;
      const iconOrPromise = iconHandler(props.icon);
      if (iconOrPromise instanceof Promise) {
        iconOrPromise.then((iconValue) => {
          icon2.value = iconValue;
        });
      } else {
        icon2.value = iconOrPromise;
      }
    }
    if (props.iconLoader && typeof props.iconLoader === "function") {
      iconHandler = createIconHandler(props.iconLoader);
    } else if (parent && ((_a = parent.props) == null ? void 0 : _a.iconLoader)) {
      iconHandler = createIconHandler(parent.props.iconLoader);
    } else if (props.iconLoaderUrl && typeof props.iconLoaderUrl === "function") {
      iconHandler = createIconHandler(iconHandler, props.iconLoaderUrl);
    } else {
      const iconPlugin = (_b = config == null ? void 0 : config.plugins) == null ? void 0 : _b.find((plugin2) => {
        return typeof plugin2.iconHandler === "function";
      });
      if (iconPlugin) {
        iconHandler = iconPlugin.iconHandler;
      }
    }
    watch(
      () => props.icon,
      () => {
        loadIcon();
      },
      { immediate: true }
    );
    return () => {
      if (props.icon && icon2.value) {
        return h("span", {
          class: "formkit-icon",
          innerHTML: icon2.value
        });
      }
      return null;
    };
  }
});
function resetCount2() {
  resetCounts();
  resetCount();
}
export {
  FormKit_default as FormKit,
  FormKitIcon,
  FormKitKitchenSink,
  FormKitLazyProvider,
  FormKitMessages,
  FormKitProvider,
  FormKitRoot,
  FormKitSchema,
  FormKitSummary,
  bindings_default as bindings,
  changeLocale,
  clearErrors2 as clearErrors,
  componentSymbol,
  configSymbol,
  createInput,
  defaultConfig,
  defineFormKitConfig,
  errorHandler,
  getCurrentSchemaNode,
  onSSRComplete,
  optionsSymbol,
  parentSymbol,
  plugin,
  reset,
  resetCount2 as resetCount,
  rootSymbol,
  setErrors2 as setErrors,
  ssrComplete,
  submitForm,
  useConfig,
  useFormKitContext,
  useFormKitContextById,
  useFormKitNodeById,
  useInput
};
//# sourceMappingURL=@formkit_vue.js.map
