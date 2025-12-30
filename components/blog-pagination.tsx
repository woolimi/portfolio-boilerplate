import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath?: string; // e.g., '/blog' or '/blog/python'
};

export function BlogPagination({
  currentPage,
  totalPages,
  basePath = '/blog',
}: BlogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return basePath;
    }
    return `${basePath}/p/${page}`;
  };

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <Button variant="ghost" asChild>
          <Link href={getPageUrl(currentPage - 1)} className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            <span>이전</span>
          </Link>
        </Button>
      )}

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <Link
                key={page}
                href={getPageUrl(page)}
                className={`border-border flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors ${
                  page === currentPage
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-accent'
                }`}
              >
                {page}
              </Link>
            );
          } else if (page === currentPage - 2 || page === currentPage + 2) {
            return (
              <span key={page} className="text-muted-foreground px-2">
                ...
              </span>
            );
          }
          return null;
        })}
      </div>

      {currentPage < totalPages && (
        <Button variant="ghost" asChild>
          <Link href={getPageUrl(currentPage + 1)} className="flex items-center gap-1">
            <span>다음</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
