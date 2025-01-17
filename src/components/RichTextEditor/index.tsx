import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import { lowlight } from 'lowlight';
import Link from '@tiptap/extension-link';
import Menu from './Menu';
import { Exts } from './Exts';
import classNames from 'classnames';

export type Extention = typeof Exts[number]['name'];

type Params = {
  value: string | null;
  onChange: (value: string) => void;
  height: 'h-32' | 'h-72' | 'h-auto';
  readOnly?: boolean;
  placeholder?: string;
  uploader: (file: File) => Promise<string>;
  allowedExtentions: Array<Extention>;
};

export function RichTextEditor({ value, onChange, height, readOnly = false, placeholder, uploader, allowedExtentions }: Params) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({ placeholder, emptyNodeClass: 'is-editor-empty text-gray' }),
      Underline,
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      Link.configure({ openOnClick: true, linkOnPaste: true }),
      CodeBlockLowlight.configure({ lowlight })
    ],
    editorProps: { attributes: { class: 'focus:outline-none' } },
    editable: !readOnly,
    onUpdate: v => onChange(v.editor.getHTML()),
    content: `${value === null ? '' : value}`
  });

  const [wasInit, setWasInit] = React.useState(false);

  React.useEffect(() => {
    if (!wasInit && editor) {
      editor.chain().focus('end').joinBackward().run();
      setWasInit(true);
    }
  });

  if (!editor) {
    return null;
  }

  // if (readOnly) {
  //   return (
  //     <div className='h-20 overflow-y-auto'>
  //       <EditorContent editor={editor} disabled={true} readOnly />
  //     </div>
  //   );
  // }

  return (
    <div className={classNames('w-full group', { 'pointer-events-none': readOnly })}>
      {!!allowedExtentions.length && <Menu editor={editor} uploader={uploader} allowedExtentions={allowedExtentions} />}

      <div
        className={`${height} overflow-y-hidden cursor-pointer`}
        onClick={() => {
          editor.chain().focus().run();
        }}
      >
        <EditorContent editor={editor} placeholder='Enter Text.....' />
      </div>
    </div>
  );
}
