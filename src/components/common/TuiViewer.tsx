import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
// import React from 'react';

interface Props {
  content: string;
}
const TuiViewer = ({ content }: Props) => {
  return <Viewer initialValue={content} />;
};

export default TuiViewer;
