import { Box, SpaceBetween, Stack } from '@nelson-ui/react';
import { MakeNewDocumentAction } from '../make-new-document-action';
import { ListComponent } from './list-component';
import { useDocuments } from '../../store/documents';

export const DocumentsList = () => {
  const [state] = useDocuments();

  return (
    <Stack>
      <SpaceBetween>
        <Box fontFamily={`'Space Grotesk', sans-serif`} fontSize={'$5'}>
          Documents
        </Box>
        {!state ? null : <MakeNewDocumentAction label={'New document'} />}
      </SpaceBetween>
      {!state ? (
        <Box>
          <MakeNewDocumentAction />
        </Box>
      ) : (
        <ListComponent />
      )}
    </Stack>
  );
};
