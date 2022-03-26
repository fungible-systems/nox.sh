import { Box } from '@nelson-ui/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useDocumentContent } from '../../store/documents';
import { makeTimestamp } from '../../common/utils';
import './editor.css';

export function Editor({ docId }: { docId: string }) {
  const [state, setState] = useDocumentContent(docId);

  const editor = useEditor({
    extensions: [StarterKit],
    content: state!.contents ? JSON.parse(state!.contents) : '<p></p>',
    async onUpdate({ editor }) {
      const json = editor.getJSON();
      setState({
        createdAt: state!.createdAt,
        id: state!.id,
        updatedAt: makeTimestamp(),
        contents: JSON.stringify(json),
      });
    },
  });

  const text = editor?.getText();

  return (
    <Box
      flexGrow={1}
      display={'flex'}
      fontFamily={`'Montagu Slab', serif`}
      css={{
        // @ts-ignore
        '& > div': {
          display: 'flex',
          flexGrow: 1,
        },
      }}
      position={'relative'}
    >
      {!text || text === '' ? (
        <Box top={'$base'} opacity={0.5} position={'absolute'}>
          Start writing...
        </Box>
      ) : null}
      <EditorContent editor={editor} />
    </Box>
  );
}
