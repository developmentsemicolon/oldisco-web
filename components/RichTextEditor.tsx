'use client';

import { useEffect, useState, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  const isUpdatingFromExternalRef = useRef(false);

  // Atualizar ref do onChange sempre que mudar
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setIsMounted(true);
    
    // Carregar CSS do Quill dinamicamente via link tag para evitar problemas de parsing do Next.js
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

    const modules = {
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

    // Importar Quill dinamicamente e inicializar
    import('quill').then((QuillModule) => {
      if (!editorRef.current || quillInstanceRef.current) return;
      
      const QuillClass = QuillModule.default;
      quillInstanceRef.current = new QuillClass(editorRef.current, {
        theme: 'snow',
        modules,
        placeholder: placeholder || 'Digite o conteúdo do artigo...',
      });

      // Definir conteúdo inicial
      if (value) {
        quillInstanceRef.current.root.innerHTML = value;
      }

      // Listener para mudanças no editor
      quillInstanceRef.current.on('text-change', () => {
        if (quillInstanceRef.current && !isUpdatingFromExternalRef.current) {
          const content = quillInstanceRef.current.root.innerHTML;
          onChangeRef.current(content);
        }
      });
    });

    // Cleanup
    return () => {
      if (quillInstanceRef.current) {
        quillInstanceRef.current = null;
      }
    };
  }, [isMounted, placeholder]);

  // Atualizar conteúdo quando value mudar externamente
  useEffect(() => {
    if (quillInstanceRef.current && value !== undefined) {
      const currentContent = quillInstanceRef.current.root.innerHTML;
      // Só atualizar se o conteúdo for diferente (evita loops)
      if (currentContent !== value) {
        isUpdatingFromExternalRef.current = true;
        quillInstanceRef.current.root.innerHTML = value;
        // Resetar flag após um pequeno delay
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
