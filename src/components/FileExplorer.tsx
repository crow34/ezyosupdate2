import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  FolderOpen, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  Search,
  LayoutGrid,
  List,
  Plus,
  Folder,
  FileText,
  Cloud,
  Upload
} from 'lucide-react';

interface File {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  parent: string;
  size?: number;
  modified?: Date;
  isCloud?: boolean;
}

const FileExplorer: React.FC = () => {
  const [files, setFiles] = useState<File[]>([
    { id: 'docs', name: 'Documents', type: 'folder', parent: 'root' },
    { id: 'downloads', name: 'Downloads', type: 'folder', parent: 'root' },
    { id: 'pictures', name: 'Pictures', type: 'folder', parent: 'root' },
    { id: 'cloud', name: 'Google Drive', type: 'folder', parent: 'root', isCloud: true },
    { id: 'readme', name: 'README.txt', type: 'file', content: 'Welcome to Windows 11', parent: 'root' },
  ]);
  const [currentPath, setCurrentPath] = useState<string>('root');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploading(true);
    
    const newFiles = acceptedFiles.map(file => ({
      id: `file-${Date.now()}-${file.name}`,
      name: file.name,
      type: 'file' as const,
      parent: currentPath,
      size: file.size,
      modified: new Date(),
      content: URL.createObjectURL(file)
    }));

    setTimeout(() => {
      setFiles(prev => [...prev, ...newFiles]);
      setUploading(false);
    }, 1000);
  }, [currentPath]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const getCurrentFiles = () => {
    return files.filter(file => {
      const matchesPath = file.parent === currentPath;
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPath && matchesSearch;
    });
  };

  const createNewFolder = () => {
    const newFolder: File = {
      id: `folder-${Date.now()}`,
      name: 'New Folder',
      type: 'folder',
      parent: currentPath,
      modified: new Date()
    };
    setFiles([...files, newFolder]);
  };

  const navigateToFolder = (folderId: string) => {
    setCurrentPath(folderId);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="flex flex-col h-full" {...getRootProps()}>
      <input {...getInputProps()} />
      
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-gray-100 border-b">
        <button className="p-1.5 hover:bg-gray-200 rounded-md">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded-md">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded-md">
          <ChevronUp className="w-4 h-4" />
        </button>
        <div className="flex-1 flex items-center gap-2 px-4 py-1 bg-white border rounded-md">
          <FolderOpen className="w-4 h-4 text-blue-500" />
          <span className="text-sm">This PC</span>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            className="pl-8 pr-4 py-1 bg-white border rounded-md text-sm w-64"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between p-2 bg-white border-b">
        <div className="flex items-center gap-2">
          <button
            onClick={createNewFolder}
            className="flex items-center gap-1 px-3 py-1 text-sm hover:bg-gray-100 rounded-md"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
          <button className="flex items-center gap-1 px-3 py-1 text-sm hover:bg-gray-100 rounded-md">
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* File List */}
      <div className={`flex-1 p-4 overflow-auto ${
        viewMode === 'grid' ? 'grid grid-cols-6 gap-4' : 'flex flex-col gap-1'
      }`}>
        {getCurrentFiles().map((file) => (
          <button
            key={file.id}
            onClick={() => file.type === 'folder' && navigateToFolder(file.id)}
            className={`group ${
              viewMode === 'grid'
                ? 'flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-blue-50'
                : 'flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 w-full'
            }`}
          >
            {file.type === 'folder' ? (
              <div className="relative">
                <Folder className={`${viewMode === 'grid' ? 'w-12 h-12' : 'w-5 h-5'} text-blue-500`} />
                {file.isCloud && (
                  <Cloud className="absolute -right-1 -bottom-1 w-4 h-4 text-blue-500" />
                )}
              </div>
            ) : (
              <FileText className={`${viewMode === 'grid' ? 'w-12 h-12' : 'w-5 h-5'} text-gray-500`} />
            )}
            <div className={`flex flex-col ${viewMode === 'grid' ? 'items-center' : ''}`}>
              <span className="text-sm truncate">{file.name}</span>
              {viewMode === 'list' && file.size && (
                <span className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                  {file.modified && ` • ${file.modified.toLocaleDateString()}`}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="fixed bottom-16 right-4 bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-3">
            <Upload className="w-5 h-5 text-blue-500 animate-bounce" />
            <span className="text-sm">Uploading files...</span>
          </div>
        </div>
      )}

      {/* Drag Overlay */}
      {isDragActive && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center">
          <div className="text-blue-500 text-lg font-medium">Drop files here to upload</div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;