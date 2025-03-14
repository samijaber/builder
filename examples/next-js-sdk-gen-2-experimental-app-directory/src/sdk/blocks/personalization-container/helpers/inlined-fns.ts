/**
 * WARNING: This file contains functions that get stringified and inlined into the HTML at build-time.
 * They cannot import anything.
 */

import type { Query, UserAttributes } from '../helpers';
import { type PersonalizationContainerProps } from '../personalization-container.types';
export function filterWithCustomTargeting(
  userAttributes: UserAttributes,
  query: Query[],
  startDate?: string,
  endDate?: string
) {
  function isString(val: unknown): val is string {
    return typeof val === 'string';
  }
  function isNumber(val: unknown): val is number {
    return typeof val === 'number';
  }
  function objectMatchesQuery(userattr: UserAttributes, query: Query): boolean {
    const result = (() => {
      const property = query.property;
      const operator = query.operator;
      let testValue = query.value;
      if (
        query &&
        query.property === 'urlPath' &&
        query.value &&
        typeof query.value === 'string' &&
        query.value !== '/' &&
        query.value.endsWith('/')
      ) {
        testValue = query.value.slice(0, -1);
      }
      if (!(property && operator)) {
        return true;
      }
      if (Array.isArray(testValue)) {
        if (operator === 'isNot') {
          return testValue.every(val =>
            objectMatchesQuery(userattr, {
              property,
              operator,
              value: val,
            })
          );
        }
        return !!testValue.find(val =>
          objectMatchesQuery(userattr, {
            property,
            operator,
            value: val,
          })
        );
      }
      const value = userattr[property];
      if (Array.isArray(value)) {
        return value.includes(testValue);
      }
      switch (operator) {
        case 'is':
          return value === testValue;
        case 'isNot':
          return value !== testValue;
        case 'contains':
          return (isString(value) || Array.isArray(value)) && value.includes(String(testValue));
        case 'startsWith':
          return isString(value) && value.startsWith(String(testValue));
        case 'endsWith':
          return isString(value) && value.endsWith(String(testValue));
        case 'greaterThan':
          return isNumber(value) && isNumber(testValue) && value > testValue;
        case 'lessThan':
          return isNumber(value) && isNumber(testValue) && value < testValue;
        case 'greaterThanOrEqualTo':
          return isNumber(value) && isNumber(testValue) && value >= testValue;
        case 'lessThanOrEqualTo':
          return isNumber(value) && isNumber(testValue) && value <= testValue;
        default:
          return false;
      }
    })();
    return result;
  }
  const item = {
    query,
    startDate,
    endDate,
  };
  const now = (userAttributes.date && new Date(userAttributes.date)) || new Date();
  if (item.startDate && new Date(item.startDate) > now) {
    return false;
  } else if (item.endDate && new Date(item.endDate) < now) {
    return false;
  }
  if (!item.query || !item.query.length) {
    return true;
  }
  return item.query.every((filter: Query) => {
    return objectMatchesQuery(userAttributes, filter);
  });
}
export const PERSONALIZATION_SCRIPT =
  "function getPersonalizedVariant(variants, blockId, locale) {\n  if (!navigator.cookieEnabled) {\n    return;\n  }\n  function getCookie(name) {\n    const nameEQ = name + '=';\n    const ca = document.cookie.split(';');\n    for (let i = 0; i < ca.length; i++) {\n      let c = ca[i];\n      while (c.charAt(0) == ' ') c = c.substring(1, c.length);\n      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);\n    }\n    return null;\n  }\n  function removeVariants() {\n    variants?.forEach(function (_, index) {\n      document.querySelector('template[data-variant-id=\"' + blockId + '-' + index + '\"]')?.remove();\n    });\n    document.querySelector('script[data-id=\"variants-script-' + blockId + '\"]')?.remove();\n    document.querySelector('style[data-id=\"variants-styles-' + blockId + '\"]')?.remove();\n  }\n  const attributes = JSON.parse(getCookie('builder.userAttributes') || '{}');\n  if (locale) {\n    attributes.locale = locale;\n  }\n  const winningVariantIndex = variants?.findIndex(function (variant) {\n    return filterWithCustomTargeting(attributes, variant.query, variant.startDate, variant.endDate);\n  });\n  const isDebug = location.href.includes('builder.debug=true');\n  if (isDebug) {\n    console.debug('PersonalizationContainer', {\n      attributes,\n      variants,\n      winningVariantIndex\n    });\n  }\n  if (winningVariantIndex !== -1) {\n    const winningVariant = document.querySelector('template[data-variant-id=\"' + blockId + '-' + winningVariantIndex + '\"]');\n    if (winningVariant) {\n      const parentNode = winningVariant.parentNode;\n      if (parentNode) {\n        const newParent = parentNode.cloneNode(false);\n        newParent.appendChild(winningVariant.content.firstChild);\n        newParent.appendChild(winningVariant.content.lastChild);\n        parentNode.parentNode?.replaceChild(newParent, parentNode);\n      }\n      if (isDebug) {\n        console.debug('PersonalizationContainer', 'Winning variant Replaced:', winningVariant);\n      }\n    }\n  } else if (variants && variants.length > 0) {\n    removeVariants();\n  }\n}";
export const FILTER_WITH_CUSTOM_TARGETING_SCRIPT =
  "function filterWithCustomTargeting(userAttributes, query, startDate, endDate) {\n  function isString(val) {\n    return typeof val === 'string';\n  }\n  function isNumber(val) {\n    return typeof val === 'number';\n  }\n  function objectMatchesQuery(userattr, query) {\n    const result = (() => {\n      const property = query.property;\n      const operator = query.operator;\n      let testValue = query.value;\n      if (query && query.property === 'urlPath' && query.value && typeof query.value === 'string' && query.value !== '/' && query.value.endsWith('/')) {\n        testValue = query.value.slice(0, -1);\n      }\n      if (!(property && operator)) {\n        return true;\n      }\n      if (Array.isArray(testValue)) {\n        if (operator === 'isNot') {\n          return testValue.every(val => objectMatchesQuery(userattr, {\n            property,\n            operator,\n            value: val\n          }));\n        }\n        return !!testValue.find(val => objectMatchesQuery(userattr, {\n          property,\n          operator,\n          value: val\n        }));\n      }\n      const value = userattr[property];\n      if (Array.isArray(value)) {\n        return value.includes(testValue);\n      }\n      switch (operator) {\n        case 'is':\n          return value === testValue;\n        case 'isNot':\n          return value !== testValue;\n        case 'contains':\n          return (isString(value) || Array.isArray(value)) && value.includes(String(testValue));\n        case 'startsWith':\n          return isString(value) && value.startsWith(String(testValue));\n        case 'endsWith':\n          return isString(value) && value.endsWith(String(testValue));\n        case 'greaterThan':\n          return isNumber(value) && isNumber(testValue) && value > testValue;\n        case 'lessThan':\n          return isNumber(value) && isNumber(testValue) && value < testValue;\n        case 'greaterThanOrEqualTo':\n          return isNumber(value) && isNumber(testValue) && value >= testValue;\n        case 'lessThanOrEqualTo':\n          return isNumber(value) && isNumber(testValue) && value <= testValue;\n        default:\n          return false;\n      }\n    })();\n    return result;\n  }\n  const item = {\n    query,\n    startDate,\n    endDate\n  };\n  const now = userAttributes.date && new Date(userAttributes.date) || new Date();\n  if (item.startDate && new Date(item.startDate) > now) {\n    return false;\n  } else if (item.endDate && new Date(item.endDate) < now) {\n    return false;\n  }\n  if (!item.query || !item.query.length) {\n    return true;\n  }\n  return item.query.every(filter => {\n    return objectMatchesQuery(userAttributes, filter);\n  });\n}";
