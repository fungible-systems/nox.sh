import { getRandomBytes } from 'micro-stacks/crypto';
import { BaseGaiaObject } from '../store/documents';

export function uuid() {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (getRandomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
  );
}

export function makeTimestamp() {
  return Date.now() * 1000;
}

export function makeNewEntity<T extends BaseGaiaObject>(
  params: Omit<T, 'createdAt' | 'updatedAt'>
) {
  return {
    createdAt: makeTimestamp(),
    updatedAt: makeTimestamp(),
    ...params,
  };
}

export function updateEntity<T extends BaseGaiaObject>(params: Omit<T, 'updatedAt'>) {
  return {
    ...params,
    updatedAt: makeTimestamp(),
  };
}
