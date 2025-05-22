'use client';

import React, { useCallback } from 'react';
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  BlockTypeSelect,
  CodeToggle,
  CreateLink,
  DiffSourceToggleWrapper,
  diffSourcePlugin,
  imagePlugin,
  InsertImage,
  InsertThematicBreak,
  ListsToggle,
  Separator,
  linkDialogPlugin,
  linkPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  tablePlugin,
  InsertTable,
  frontmatterPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  InsertCodeBlock,
  MDXEditorMethods
} from '@mdxeditor/editor';

// Import the styles
import '@mdxeditor/editor/style.css';

interface MDXContentEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  editorRef?: React.RefObject<MDXEditorMethods | null>;
}

const MDXContentEditor: React.FC<MDXContentEditorProps> = ({ markdown, onChange, editorRef }) => {
  // Image upload handler
  const imageUploadHandler = useCallback(async (image: File) => {
    try {
      const formData = new FormData();
      formData.append('file', image);

      const response = await fetch('/api/upload-content-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return '';
    }
  }, []);

  return (
    <MDXEditor
      ref={editorRef}
      markdown={markdown}
      onChange={onChange}
      contentEditableClassName="prose max-w-full"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        tablePlugin(),
        frontmatterPlugin(),
        codeBlockPlugin(),
        codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', html: 'HTML', python: 'Python' } }),
        diffSourcePlugin(),
        markdownShortcutPlugin(),
        imagePlugin({
          imageUploadHandler: imageUploadHandler,
          imagePreviewHandler: async (url) => Promise.resolve(url),
        }),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <CodeToggle />
              <Separator />
              <ListsToggle />
              <Separator />
              <BlockTypeSelect />
              <Separator />
              <CreateLink />
              <InsertImage />
              <Separator />
              <InsertTable />
              <InsertThematicBreak />
              <Separator />
              <InsertCodeBlock />
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === 'codeblock',
                    contents: () => <ChangeCodeMirrorLanguage />
                  }
                ]}
              />
              <Separator />
              <DiffSourceToggleWrapper>
                Toggle Source
              </DiffSourceToggleWrapper>
            </>
          )
        })
      ]}
    />
  );
};

export default MDXContentEditor;
