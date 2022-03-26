import { DocumentMeta, useDocumentMeta } from '../../store/documents';
import { Box } from '@nelson-ui/react';
import { FormEvent, useCallback } from 'react';
import { makeTimestamp, updateEntity } from '../../common/utils';

export const TitleEditor = ({ docId }: { docId: string }) => {
  const [state, setState] = useDocumentMeta(docId);

  // this is our on-change handler
  // it will update the atomWithGaia for the document meta file
  // which contains things like
  const handleOnChange = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      if (!state) return;
      setState(
        // updateEntity is a helper function that just
        // automatically updates the updatedAt with
        // the current timestamp
        updateEntity<DocumentMeta>({
          ...state,
          title: e.currentTarget.value,
        })
      );
    },
    [state]
  );
  // return our component
  return (
    <Box
      // makes the dom element an input
      as={'input'}
      // style props
      p={0}
      border={0}
      fontSize={'$7'}
      outline={'none'}
      fontFamily={`'Space Grotesk', sans-serif`}
      // input props
      value={state?.title}
      autoFocus={!state?.title}
      onChange={handleOnChange}
      placeholder={'Untitled document'}
    />
  );
};
