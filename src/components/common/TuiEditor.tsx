import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

interface Props {
  content: string;
  editorRef: React.MutableRefObject<any>;
}

const TuiEditor = ({ content = '', editorRef }: Props) => {
  const toolbarItems = [
    ['heading', 'bold', 'italic', 'strike'],
    ['hr'],
    ['ul', 'ol'],
  ];

  return (
    <>
      {editorRef && (
        <Editor
          ref={editorRef}
          initialValue={content || ' '} // 글 수정 시 사용
          initialEditType='wysiwyg' // wysiwyg & markdown
          previewStyle={window.innerWidth > 1000 ? 'vertical' : 'tab'} // tab, vertical
          hideModeSwitch={true}
          height='300px'
          theme={''} // '' & 'dark'
          usageStatistics={false}
          toolbarItems={toolbarItems}
          useCommandShortcut={true}
        />
      )}
    </>
  );
};

export default TuiEditor;
