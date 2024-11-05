import React, { useState, useEffect } from 'react';
import { Folder, File, Upload, Download, Plus, Trash2, Search, Edit2, Save, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface IntranetFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  parent: string;
  size?: number;
  modified: Date;
  mimeType?: string;
}

const Intranet: React.FC = () => {
  const [files, setFiles] = useState<IntranetFile[]>(() => {
    const saved = localStorage.getItem('intranet_files');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'modified') return new Date(value);
      return value;
    }) : [
      { id: 'root', name: 'Root', type: 'folder', parent: '', modified: new Date() }
    ];
  });
  
  const [currentPath, setCurrentPath] = useState<string>('root');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    localStorage.setItem('intranet_files', JSON.stringify(files));
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const newFiles = await Promise.all(acceptedFiles.map(async (file) => {
        const content = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result);
          reader.readAsDataURL(file);
        });

        return {
          id: `file-${Date.now()}-${file.name}`,
          name: file.name,
          type: 'file' as const,
          content: content as string,
          parent: currentPath,
          size: file.size,
          modified: new Date(),
          mimeType: file.type
        };
      }));

      setFiles(prev => [...prev, ...newFiles]);
    }
  });

  const getCurrentFiles = () => {
    return files.filter(file => {
      const matchesPath = file.parent === currentPath;
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPath && matchesSearch;
    });
  };

  const createFolder = () => {
    const name = prompt('Enter folder name:');
    if (!name) return;

    const folder: IntranetFile = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      parent: currentPath,
      modified: new Date()
    };

    setFiles(prev => [...prev, folder]);
  };

  const createTextFile = () => {
    const name = prompt('Enter file name:');
    if (!name) return;

    const file: IntranetFile = {
      id: `file-${Date.now()}`,
      name: name.endsWith('.txt') ? name : `${name}.txt`,
      type: 'file',
      content: '',
      parent: currentPath,
      modified: new Date(),
      mimeType: 'text/plain'
    };

    setFiles(prev => [...prev, file]);
    setEditingFile(file.id);
  };

  const deleteItem = (id: string) => {
    const itemToDelete = files.find(f => f.id === id);
    if (!itemToDelete) return;

    // If folder, delete all children
    const idsToDelete = [id];
    if (itemToDelete.type === 'folder') {
      const getChildIds = (parentId: string): string[] => {
        const children = files.filter(f => f.parent === parentId);
        return children.reduce((acc, child) => [
          ...acc,
          child.id,
          ...(child.type === 'folder' ? getChildIds(child.id) : [])
        ], [] as string[]);
      };
      idsToDelete.push(...getChildIds(id));
    }

    setFiles(prev => prev.filter(f => !idsToDelete.includes(f.id)));
  };

  const saveFile = () => {
    if (!editingFile) return;
    setFiles(prev => prev.map(f => 
      f.id === editingFile 
        ? { ...f, content: fileContent, modified: new Date() }
        : f
    ));
    setEditingFile(null);
  };

  const downloadFile = (file: IntranetFile) => {
    if (!file.content) return;

    const link = document.createElement('a');
    link.href = file.content;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const getBreadcrumbs = () => {
    const path: IntranetFile[] = [];
    let current = files.find(f => f.id === currentPath);
    while (current) {
      path.unshift(current);
      current = files.find(f => f.id === current?.parent);
    }
    return path;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50" {...getRootProps()}>
      <input {...getInputProps()} />

      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Intranet Storage</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={createFolder}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg"
            >
              <Folder className="w-4 h-4" />
              New Folder
            </button>
            <button
              onClick={createTextFile}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg"
            >
              <File className="w-4 h-4" />
              New File
            </button>
            <button
              onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {viewMode === 'grid' ? 'List' : 'Grid'}
            </button>
          </div>
        </div>

        {/* Search and Breadcrumbs */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-9 pr-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {getBreadcrumbs().map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && <span>/</span>}
                <button
                  onClick={() => setCurrentPath(item.id)}
                  className="hover:text-blue-500"
                >
                  {item.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 p-6 overflow-auto">
        {getCurrentFiles().length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            {searchTerm ? 'No files found' : 'Drop files here or use the buttons above to add content'}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-4 gap-4' : 'space-y-2'}>
            {getCurrentFiles().map(file => (
              <div
                key={file.id}
                className={`
                  ${viewMode === 'grid' 
                    ? 'p-4 bg-white rounded-lg border hover:shadow-md'
                    : 'flex items-center gap-4 p-3 bg-white rounded-lg border hover:shadow-md'
                  }
                `}
              >
                <div className={`flex items-center gap-3 ${viewMode === 'grid' ? 'mb-2' : ''}`}>
                  {file.type === 'folder' ? (
                    <Folder className="w-5 h-5 text-blue-500" />
                  ) : (
                    <File className="w-5 h-5 text-gray-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{file.name}</div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                      {file.modified && ` • ${file.modified.toLocaleDateString()}`}
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-2 ${viewMode === 'grid' ? 'mt-2' : ''}`}>
                  {file.type === 'folder' ? (
                    <button
                      onClick={() => setCurrentPath(file.id)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg"
                    >
                      Open
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingFile(file.id);
                          setFileContent(file.content || '');
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadFile(file)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteItem(file.id)}
                    className="p-1.5 hover:bg-red-100 text-red-500 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Editor Modal */}
      {editingFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                Edit: {files.find(f => f.id === editingFile)?.name}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={saveFile}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditingFile(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                className="w-full h-96 p-4 border rounded-lg font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Drop Overlay */}
      {isDragActive && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center">
          <div className="text-blue-500 text-lg font-medium">Drop files here to upload</div>
        </div>
      )}
    </div>
  );
};

export default Intranet;