import { atomWithGaia } from './atom-with-gaia';
import { atomFamily, useAtomCallback } from 'jotai/utils';
import { useAtom } from 'jotai';
import { makeNewEntity, uuid } from '../common/utils';
import { useSession } from '@micro-stacks/react';
import { getPublicKey } from 'micro-stacks/crypto';
import { bytesToHex } from 'micro-stacks/common';
import { useCallback, useState } from 'react';

const DEBOUNCE_TIME = 50;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
export interface BaseGaiaObject {
  createdAt: number;
  updatedAt: number;
}

export interface DocumentReference extends BaseGaiaObject {
  // uuid
  id: string;
  // public key used to encrypt this document
  publicKey: string;
}

export interface DocumentMeta extends BaseGaiaObject {
  // uuid
  id: string;
  // the author of the document (principal)
  author: string;
  // optional title of the document (max 170 chars)
  title?: string;
}

export interface DocumentContent extends BaseGaiaObject {
  // uuid
  id: string;
  contents: string | null;
}

export interface DocumentsIndex extends BaseGaiaObject {
  documents: Record<string, DocumentReference>;
}

enum GaiaFilenames {
  DocumentsIndex = 'documents_index',
  DocumentContent = 'document_content',
  DocumentMeta = 'document_meta',
}

/* -------------------------------------------------------------------------------------------------
 * helpers
 * -----------------------------------------------------------------------------------------------*/

// a smol helper to normalize how we make names with ids
const makeIdName = (file: GaiaFilenames, id: string) => `${file}__${id}`;

/* -------------------------------------------------------------------------------------------------
 * atoms
 * -----------------------------------------------------------------------------------------------*/

/**
 * This is our index state, this will help us keep track of all the files we save on
 * gaia, without it, it's very hard to know where everything is based on how gaia is architected
 */
export const documentsIndexState = atomWithGaia<DocumentsIndex>(GaiaFilenames.DocumentsIndex);

/**
 * This is the document content state
 */
export const documentContentState = atomFamily((id: string) =>
  atomWithGaia<DocumentContent>(makeIdName(GaiaFilenames.DocumentContent, id), {
    encrypt: true,
    debounce: DEBOUNCE_TIME,
  })
);
/**
 * This is the document meta state
 *
 * everything other than the contents of the document
 */
export const documentMetaState = atomFamily((id: string) =>
  atomWithGaia<DocumentMeta>(makeIdName(GaiaFilenames.DocumentMeta, id), {
    encrypt: true,
    debounce: DEBOUNCE_TIME,
  })
);

/* -------------------------------------------------------------------------------------------------
 * hooks
 * -----------------------------------------------------------------------------------------------*/

const getDefaultDocumentIndex: (documents?: DocumentsIndex['documents']) => DocumentsIndex = (
  documents = {}
) => {
  return makeNewEntity<DocumentsIndex>({
    documents,
  });
};
export const useDocumentsIndex = () => {
  return useAtom(documentsIndexState);
};

export const useDocumentContent = (id: string) => {
  return useAtom(documentContentState(id));
};
export const useDocumentMeta = (id: string) => {
  return useAtom(documentMetaState(id));
};

export const useDocumentContentCallback = () => {
  return useAtomCallback<DocumentContent, DocumentContent>(
    useCallback(async (get, set, arg) => {
      await set(documentContentState(arg.id), arg);
      return arg;
    }, [])
  );
};
export const useDocumentMetaCallback = () => {
  return useAtomCallback<DocumentMeta, DocumentMeta>(
    useCallback(async (get, set, arg) => {
      await set(documentMetaState(arg.id), arg);
      return arg;
    }, [])
  );
};

export const useDocuments = (): [
  DocumentsIndex | undefined,
  {
    isLoading: boolean;
    setState: any;
    makeNewDocument: () => Promise<void>;
  }
] => {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useAtom(documentsIndexState);
  const [data] = useSession();
  const handleSetDocumentContent = useDocumentContentCallback();
  const handleSetDocumentMeta = useDocumentMetaCallback();

  const makeNewDocument = useCallback(async () => {
    if (!data?.appPrivateKey) throw Error('no private key');
    if (!data?.addresses?.mainnet) throw Error('no address');
    setIsLoading(true);
    const id = uuid();
    const publicKey = bytesToHex(getPublicKey(data?.appPrivateKey));

    // make our reference
    const documentReference = makeNewEntity<DocumentReference>({
      id,
      publicKey,
    });

    // document meta
    const documentMeta = makeNewEntity<DocumentMeta>({
      id,
      author: data?.addresses?.mainnet,
    });

    // document content
    const documentContent = makeNewEntity<DocumentContent>({
      id,
      contents: null,
    });

    async function makeOrUpdateIndex() {
      // if we have no index, let's create one
      if (!state) {
        setState(
          getDefaultDocumentIndex({
            [id]: documentReference,
          })
        );
      } else {
        // we have an index, so we should just add the entry
        await setState(s => ({
          ...s,
          documents: {
            // add it to top, so we don't need to sort on the client
            [id]: documentReference,
            ...s.documents,
          },
        }));
      }
    }

    // save both the content and meta documents
    await Promise.all([
      handleSetDocumentContent(documentContent),
      handleSetDocumentMeta(documentMeta),
      makeOrUpdateIndex(),
    ]);

    setIsLoading(false);
  }, [state, data]);

  return [
    state,
    {
      isLoading,
      setState,
      makeNewDocument,
    },
  ];
};
