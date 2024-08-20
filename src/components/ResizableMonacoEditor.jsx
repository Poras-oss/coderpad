import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';

const ResizableMonacoEditor = ({ language, value, onChange, theme = 'vs-dark', options = {} }) => {
  const containerRef = useRef(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const editorInstance = monaco.editor.create(containerRef.current, {
      value,
      language,
      theme,
      fontSize: 16,
      fontFamily: 'Roboto-Mono',
      automaticLayout: true,
      ...options,
    });

    setEditor(editorInstance);

    return () => editorInstance.dispose();
  }, [containerRef.current]); // Make sure the editor is only created once

  useEffect(() => {
    if (editor) {
      const disposable = editor.onDidChangeModelContent(() => {
        const editorValue = editor.getValue();
        if (editorValue !== value) {
          onChange(editorValue); // only call onChange if the value has actually changed
        }
      });

      return () => disposable.dispose();
    }
  }, [editor, value, onChange]);

  useEffect(() => {
    if (editor && editor.getValue() !== value) {
      editor.setValue(value);
    }
  }, [value, editor]);

  useEffect(() => {
    if (editor) {
      monaco.editor.setTheme(theme);
    }
  }, [theme, editor]);

  useEffect(() => {
    const handleResize = () => {
      if (editor) {
        editor.layout();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [editor]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />
  );
};

export default ResizableMonacoEditor;
