'use client'; // ユーザーの操作（入力）を扱うために必要

import React, { useState } from 'react';
import { Search, Bell, User, Upload, FileText, Sparkles, LayoutGrid, File } from 'lucide-react';

export default function Home() {
  // 画面の状態を管理する変数
  const [searchQuery, setSearchQuery] = useState(''); // 検索ボックスの文字
  const [isSearched, setIsSearched] = useState(false); // 検索ボタンを押したかどうか

  // 検索実行時の処理
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // ページの再読み込みを防ぐ
    if (searchQuery.trim()) {
      setIsSearched(true); // 2ページ目（検索結果画面）に切り替え
    }
  };

  // 検索結果のダミーデータ（2ページ目で使用）
  const searchResults = [
    { 
      id: 1, 
      name: 'A社_業務委託契約書_2025.pdf', 
      summary: '2025年度の基本契約に関する条項。機密保持契約（NDA）を含む。',
      tags: ['契約書', 'A社案件', '2025年度'],
      author: '田中 太郎', lastUpdated: '2025/03/15', format: 'PDF'
    },
    { 
      id: 2, 
      name: '第1四半期_売上予測レポート.xlsx', 
      summary: '全部署のQ1売上見込み集計。前年比120%達成の見込み。',
      tags: ['A社案件', '2025年度'],
      author: '鈴木 一郎', lastUpdated: '2025/03/14', format: 'Excel'
    },
    { 
      id: 3, 
      name: '新規プロジェクト企画案_v2.docx', 
      summary: 'AI導入による業務効率化プロジェクトの予算とスケジュール案。',
      tags: ['2025年度', '社内企画'],
      author: '佐藤 花子', lastUpdated: '2025/03/10', format: 'Word'
    },
  ];

  // --- 共通パーツ：ヘッダー ---
  const Header = () => (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsSearched(false)}>
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">司書AIアプリ MOF</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </div>
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white cursor-pointer">
          <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );

  // --- ページ1：検索前の画面（シンプル） ---
  if (!isSearched) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <Header />
        <main className="max-w-5xl mx-auto px-6 py-20 flex flex-col items-center gap-16">
          
          {/* 保存エリア */}
          <section className="w-full max-w-3xl">
            <div className="border-2 border-dashed border-blue-500 bg-blue-50/20 rounded-xl p-10 flex flex-col items-center justify-center gap-6 text-center h-56">
              <p className="font-bold text-slate-700">ファイル保存</p>
              <button className="bg-slate-500 hover:bg-slate-600 text-white px-10 py-3 rounded-md shadow-md font-medium transition-colors w-64">
                ファイルを保存する
              </button>
            </div>
          </section>

          {/* 検索エリア */}
          <section className="w-full max-w-4xl flex flex-col items-center gap-3">
            <p className="text-slate-500 text-sm">自然な言葉で質問してください。AIが最適なファイルを見つけます。</p>
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-full group">
                <div className="flex items-center bg-gray-100 rounded-full px-6 h-[64px] border border-transparent focus-within:bg-white focus-within:border-blue-300 focus-within:shadow-lg transition-all">
                  <Search className="w-6 h-6 text-slate-400 mr-4" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="質問するか、ファイルを探す... （例：A社の最新契約書は？）" 
                    className="flex-1 text-lg outline-none bg-transparent placeholder:text-slate-400"
                  />
                  <Sparkles className="w-6 h-6 text-blue-500 ml-4" />
                </div>
              </div>
            </form>
          </section>
        </main>
      </div>
    );
  }

  // --- ページ2：検索結果の画面（3カラムレイアウト） ---
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        
        {/* 左サイドバー：フィルター */}
        <aside className="w-64 border-r border-gray-200 p-6 overflow-y-auto bg-white hidden md:block">
          <h2 className="font-bold text-lg mb-6">フィルター</h2>
          
          <div className="mb-8">
            <h3 className="flex items-center gap-2 font-bold text-sm text-slate-700 mb-3">
              <Sparkles className="w-4 h-4 text-blue-500" /> AI生成タグ
            </h3>
            <div className="space-y-3">
              {['契約書', '請求書', 'A社案件', '2025年度'].map((tag) => (
                <label key={tag} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900">{tag}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-2 font-bold text-sm text-slate-700 mb-3">
              <FileText className="w-4 h-4 text-blue-500" /> ファイル種類
            </h3>
            <div className="space-y-3">
              {['PDF', 'Excel', 'Word', 'PowerPoint'].map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* 中央カラム：検索と結果 */}
        <main className="flex-1 overflow-y-auto bg-white border-r border-gray-200">
          <div className="p-8 max-w-4xl mx-auto space-y-8">
            
            {/* 上部：保存と検索 */}
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-slate-800 mb-2">ファイルを保存する</h3>
                <button className="w-full bg-slate-500 hover:bg-slate-600 text-white py-3 rounded-md shadow-sm font-medium transition-colors">
                  保存するファイルを選択する
                </button>
              </div>

              <div>
                <h3 className="font-medium text-slate-800 mb-2">ファイルを探す</h3>
                <form onSubmit={handleSearch}>
                  <div className="flex items-center bg-gray-100 rounded-lg px-4 h-12 border border-transparent focus-within:bg-white focus-within:border-blue-300 focus-within:shadow-md transition-all">
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-slate-800"
                    />
                    <Sparkles className="w-5 h-5 text-blue-500" />
                  </div>
                </form>
              </div>
            </div>

            {/* 下部：検索結果リスト */}
            <div>
              <h2 className="text-lg font-bold mb-4">検索結果 : {searchResults.length} 件</h2>
              <div className="space-y-4">
                {searchResults.map((file) => (
                  <div key={file.id} className="bg-gray-100/50 p-5 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-start gap-4">
                      {/* ファイルの内容 */}
                      <div className="flex-1 space-y-3">
                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-700">{file.name}</h3>
                        <div className="bg-gray-200/50 p-3 rounded text-sm text-slate-600 border border-gray-200">
                          {file.summary}
                        </div>
                        
                        {/* タグエリア */}
                        <div className="flex gap-2 flex-wrap">
                          {file.tags.map((tag) => (
                            <span key={tag} className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                              タグ（{tag}）
                            </span>
                          ))}
                        </div>

                        {/* メタデータテーブル風 */}
                        <div className="grid grid-cols-3 gap-2 bg-gray-200 p-2 rounded text-xs text-slate-600 mt-2">
                          <div className="border-r border-gray-300 px-2">作成者: {file.author}</div>
                          <div className="border-r border-gray-300 px-2">最終更新: {file.lastUpdated}</div>
                          <div className="px-2">形式: {file.format}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* 右サイドバー：プレビュー */}
        <aside className="w-72 bg-white p-6 hidden lg:block">
          <h2 className="font-bold text-lg mb-6">プレビュー</h2>
          
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-xs text-slate-500 font-bold">作成者</p>
              <p className="text-sm">田中 太郎</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 font-bold">最終更新</p>
              <p className="text-sm">2025年3月15日</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 font-bold">ファイル形式</p>
              <p className="text-sm">PDF</p>
            </div>

            {/* プレビューの四角いグレーエリア */}
            <div className="w-full aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
               {/* 実際のプレビュー画像がここに入ります */}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}