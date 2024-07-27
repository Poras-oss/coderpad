// components/ResizableMonacoEditor.js

import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const ResizableMonacoEditor = ({ language, defaultValue, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = monaco.editor.create(editorRef.current, {
      value: defaultValue,
      language,
      theme: 'vs-dark', // or 'vs-light' for light theme
      fontSize: 18,
      fontFamily: 'Roboto-Mono',
    });

    editor.layout();

    // Optional: Add onChange event handler
    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue());
    });

    return () => editor.dispose();
  }, [language, defaultValue, onChange]);

  const handleResize = () => {
    // Trigger layout adjustment on resize
    const editor = editorRef.current;
    if (editor) {
      editor.layout();
    }
  };

  return (
    <ResizableBox
      width={864} // Initial width
      height={400} // Initial height
      minConstraints={[200, 100]}
      maxConstraints={[800, 600]}
      onResize={handleResize}
  
      resizeHandles={['se']}
    >
      <div ref={editorRef} style={{ width: '100%', height: '100%' }} />
    </ResizableBox>
  );
};

export default ResizableMonacoEditor;
