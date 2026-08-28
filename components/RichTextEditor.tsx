'use client';

import { useEffect, useState, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  uploadImage?: (file: File) => Promise<string>;
}

export function RichTextEditor({ value, onChange, placeholder, uploadImage }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  const uploadImageRef = useRef(uploadImage);
  const isUpdatingFromExternalRef = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    uploadImageRef.current = uploadImage;
  }, [uploadImage]);

  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window !== 'undefined') {
      const linkId = 'quill-css';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = '/quill.snow.css';
        document.head.appendChild(link);
      }
    }
  }, []);

  useEffect(() => {
    if (!isMounted || !editorRef.current || quillInstanceRef.current) return;

    const modules: Record<string, unknown> = {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['blockquote', 'code-block'],
        ['clean']
      ],
    };

    import('quill').then((QuillModule) => {
      if (!editorRef.current || quillInstanceRef.current) return;
      
      const QuillClass = QuillModule.default;
      quillInstanceRef.current = new QuillClass(editorRef.current, {
        theme: 'snow',
        modules,
        placeholder: placeholder || 'Digite o conteúdo do artigo...',
      });

      if (uploadImageRef.current) {
        const toolbar = quillInstanceRef.current.getModule('toolbar');
        toolbar.addHandler('image', () => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/jpeg,image/png,image/webp');
          input.click();
          input.onchange = async () => {
            const file = input.files?.[0];
            const upload = uploadImageRef.current;
            if (!file || !upload || !quillInstanceRef.current) return;

            try {
              const url = await upload(file);
              const range = quillInstanceRef.current.getSelection(true);
              quillInstanceRef.current.insertEmbed(range.index, 'image', url, 'user');
              quillInstanceRef.current.setSelection(range.index + 1);
            } catch (error: any) {
              alert(error.message || 'Erro ao enviar imagem');
            }
          };
        });
      }

      if (value) {
        quillInstanceRef.current.root.innerHTML = value;
      }

      quillInstanceRef.current.on('text-change', () => {
        if (quillInstanceRef.current && !isUpdatingFromExternalRef.current) {
          const content = quillInstanceRef.current.root.innerHTML;
          onChangeRef.current(content);
        }
      });
    });

    return () => {
      if (quillInstanceRef.current) {
        quillInstanceRef.current = null;
      }
    };
  }, [isMounted, placeholder]);

  useEffect(() => {
    if (quillInstanceRef.current && value !== undefined) {
      const currentContent = quillInstanceRef.current.root.innerHTML;
      if (currentContent !== value) {
        isUpdatingFromExternalRef.current = true;
        quillInstanceRef.current.root.innerHTML = value;
        setTimeout(() => {
          isUpdatingFromExternalRef.current = false;
        }, 0);
      }
    }
  }, [value]);

  if (!isMounted) {
    return (
      <div className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 min-h-[400px] flex items-center justify-center">
        <p className="text-zinc-500">Carregando editor...</p>
      </div>
    );
  }

  return (
    <div className="quill-editor-wrapper">
      <div ref={editorRef} className="quill-editor-container" />
    </div>
  );
}
