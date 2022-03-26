import { atom } from 'jotai';
import { getFile, putFile } from 'micro-stacks/storage';
import {
  partialStacksSessionAtom,
  stacksSessionAtom,
  primaryGaiaHubConfigAtom,
} from '@micro-stacks/react';
import pDebounce from 'p-debounce';
import type { StacksSessionState } from 'micro-stacks/connect';
import type { SetStateAction, WritableAtom } from 'jotai';
import PQueue from 'p-queue';
import { atomFamily } from 'jotai/utils';
import pRetry from 'p-retry';

const queueAtom = atomFamily(path =>
  atom(() => {
    return new PQueue({ concurrency: 1 });
  })
);
export const ROOT_GAIA_PATH = 'app-data_test_asd';

export function makePath(file: string) {
  return `${ROOT_GAIA_PATH}/${file}.json`;
}

type WriteGetter = Parameters<WritableAtom<unknown, unknown>['write']>[0];

const stacksSession = atom(get => {
  const partialSession = get(partialStacksSessionAtom);
  const session = get(stacksSessionAtom);
  return !session && !partialSession
    ? null
    : ({
        ...(session || {}),
        ...(partialSession || {}),
      } as Partial<StacksSessionState>);
});

export function atomWithGaia<Value>(
  file: string,
  options?: {
    serialize?: (value: any) => string;
    deserialize?: (value: string) => any;
    encrypt?: boolean;
    debounce?: number;
  }
) {
  const serialize = options?.serialize ?? JSON.stringify;
  const deserialize = options?.deserialize ?? JSON.parse;
  const path = makePath(file);
  const storageAtom = atom(null as any);

  const getFileGetter = async (get: WriteGetter): Promise<Value | undefined> => {
    const session = get(stacksSession);
    const gaiaHubConfig = await get(primaryGaiaHubConfigAtom, { unstable_promise: true });
    if (!session || !gaiaHubConfig) throw Error('no params');
    try {
      const file = await getFile(path, {
        privateKey: session.appPrivateKey,
        decrypt: options?.encrypt ?? false,
        gaiaHubConfig,
      });
      return deserialize(file as any);
    } catch (e) {}
    return undefined;
  };

  const putFileAtom = atom(null, async (get, set, update) => {
    const queue = get(queueAtom(path));
    const session = get(stacksSession);
    const gaiaHubConfig = await get(primaryGaiaHubConfigAtom, { unstable_promise: true });
    if (!session || !gaiaHubConfig) throw Error('no params');

    await queue.add(() =>
      pRetry(async () => {
        await putFile(path, serialize(update), {
          privateKey: session.appPrivateKey,
          encrypt: options?.encrypt ?? false,
          gaiaHubConfig,
        });
      })
    );
  });

  const anAtom = atom(
    get => {
      return (get(storageAtom) as Value) ?? getFileGetter(get);
    },
    async (get, set, update: SetStateAction<Value>) => {
      const newValue =
        typeof update === 'function'
          ? (update as (prev: Value) => Value)((await getFileGetter(get)) as Value)
          : update;
      set(storageAtom, newValue);
      if (options?.debounce) {
        const debouncedSet = pDebounce(set, options.debounce);
        await debouncedSet(putFileAtom, newValue);
      } else {
        await set(putFileAtom, newValue);
      }
    }
  );

  return anAtom;
}
