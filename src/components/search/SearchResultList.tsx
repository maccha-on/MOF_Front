// SearchResultList.tsx

'use client';

import React from 'react';
import { SearchResult } from '../../types/file';
import { ResultCard } from './ResultCard'; 

type SummaryState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'done'; text: string }
  | { status: 'error'; error: string };

type SummariesById = Record<string, SummaryState>;

interface SearchResultListProps {
  results: SearchResult[];
  selectedFileId: string | null;
  onFileSelect: (file: SearchResult) => void;

  // ★追加：ファイル名クリック等で「uriを開く」ためのコールバック
  // 呼び出し元（page.tsx）で window.open などを実装して渡す
  onFileOpen?: (file: SearchResult) => void;

  summariesById?: SummariesById;
}

export const SearchResultList = ({ results, selectedFileId, onFileSelect, onFileOpen }: SearchResultListProps) => {
  if (results.length === 0) {
    return <p className="text-slate-500 py-4">該当するファイルが見つかりませんでした。</p>;
  }

  return (
    <div className="space-y-4">
      {results.map((file) => (
        // ここは ResultCard コンポーネントを使用
        <ResultCard 
          key={file.id}
          file={file}
          isSelected={selectedFileId === file.id}
          onClick={() => onFileSelect(file)}

          // ★追加：ResultCardに「開く」手段を渡す（ファイル名クリックで使う想定）
          // ResultCard側が未対応なら、このpropは一旦無視されるだけで壊れません
          onOpen={() => onFileOpen?.(file)}

          // 26-01-28追加 ：概要文を表示させるため
          // summaryText={computedSummaryTextForThisId}
        />
      ))}
    </div>
  );
};