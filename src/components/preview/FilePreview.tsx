// src/components/preview/FilePreview.tsx

'use client';

import React from 'react';
import { File, FileText, Image as ImageIcon } from 'lucide-react';
import { SearchResult } from '../../types/file';

interface FilePreviewProps {
  selectedFile: SearchResult | null;
}

export const FilePreview = ({ selectedFile }: FilePreviewProps) => {

  const handleOpenFile = () => {
    if (selectedFile?.uri) {
      window.open(selectedFile.uri, '_blank', 'noopener,noreferrer');
    }
  };

  // ファイル形式を判定するヘルパー
  const getFileType = (file: SearchResult) => {
    const uri = file.uri?.toLowerCase() || '';
    const format = file.format?.toUpperCase() || '';
    
    if (format === 'PDF' || uri.includes('.pdf')) return 'pdf';
    if (['JPG', 'JPEG', 'PNG', 'GIF'].includes(format) || uri.match(/\.(jpg|jpeg|png|gif)/)) return 'image';
    return 'other';
  };

  return (
    <aside className="hidden lg:block w-72 bg-white p-6 border-l border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <h2 className="font-bold text-lg mb-6">プレビュー</h2>
      
      {selectedFile ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
            <p className="text-xs text-slate-500 font-bold">ファイル名：</p>
            <p className="font-bold text-blue-900 text-sm break-words">{selectedFile.name}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">件名</p>
            <p className="text-sm">{selectedFile.documentTitle || "-"}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">文書カテゴリ</p>
            <p className="text-sm">{selectedFile.documentCategory}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">文書日付</p>
            <p className="text-sm">{selectedFile.documentDate}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">ファイル形式</p>
            <p className="text-sm uppercase">{selectedFile.format}</p>
          </div>

          {/* ▼▼▼ プレビュー表示エリア（クリックイベント削除版） ▼▼▼ */}
          <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border border-gray-300 relative">
            {getFileType(selectedFile) === 'pdf' ? (
              <iframe 
                src={`${selectedFile.uri}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full object-cover"
                title="PDF Preview"
              />
              
            ) : getFileType(selectedFile) === 'image' ? (
              <img 
                src={selectedFile.uri} 
                alt="Preview" 
                className="w-full h-full object-contain bg-white"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 gap-2">
                <File className="w-10 h-10 text-gray-300" />
                <span className="text-xs">プレビュー不可</span>
              </div>
            )}

          </div>
          {/* ▲▲▲ 修正ここまで ▲▲▲ */}

          <button 
            onClick={handleOpenFile}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-bold transition-colors shadow-sm"
          >
            ファイルを開く
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-2">
          <FileText className="w-10 h-10" />
          <p className="text-sm">リストからファイルを選択</p>
        </div>
      )}
    </aside>
  );
};