export type NotebookCell = {
  cell_type: 'code' | 'markdown' | 'raw';
  source: string[];
  outputs?: any[];
  execution_count?: number | null;
  metadata?: any;
};

export type NotebookData = {
  cells: NotebookCell[];
  metadata?: {
    title?: string;
    summary?: string;
    [key: string]: any;
  };
};

