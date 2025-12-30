'use client';

import { ContentTree } from '@/components/content-tree';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { TreeNode } from '@/data/content-tree';
import { Menu } from 'lucide-react';

interface BlogContentTreeProps {
  tree: TreeNode[];
  className?: string;
}

export function BlogContentTreeDesktop({ tree, className }: BlogContentTreeProps) {
  return (
    <aside className={className}>
      <ContentTree tree={tree} />
    </aside>
  );
}

export function BlogContentTreeMobile({ tree }: BlogContentTreeProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="fixed top-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-2xl border backdrop-blur-md transition-colors hover:bg-white/20 supports-backdrop-blur:bg-white/10"
          aria-label="[버튼 접근성 레이블]"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle>[시트 제목]</SheetTitle>
          <SheetDescription>[시트 설명]</SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto p-4">
          <ContentTree tree={tree} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
