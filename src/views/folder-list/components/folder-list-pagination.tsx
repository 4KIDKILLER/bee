import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "/@c/index";
import { cn } from "/@/library/utils";
import type { FolderListPaginationProps } from "../types";

function FolderListPagination({
  page,
  limit,
  total,
  onPageChange,
  className,
  contentClassName,
  itemClassName,
  activeItemClassName,
  controlClassName,
  ellipsisClassName,
}: FolderListPaginationProps) {
  const safeLimit = Math.max(limit, 1);
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const visiblePageItems: Array<number | "ellipsis-left" | "ellipsis-right"> =
    totalPages <= 7
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
      : (() => {
          const pages = new Set<number>([
            1,
            totalPages,
            currentPage - 1,
            currentPage,
            currentPage + 1,
          ]);

          const normalizedPages = Array.from(pages)
            .filter((item) => item >= 1 && item <= totalPages)
            .sort((a, b) => a - b);

          const items: Array<number | "ellipsis-left" | "ellipsis-right"> = [];

          normalizedPages.forEach((item, index) => {
            const previousPage = normalizedPages[index - 1];

            if (previousPage && item - previousPage > 1) {
              items.push(
                previousPage === 1 ? "ellipsis-left" : "ellipsis-right",
              );
            }

            items.push(item);
          });

          return items;
        })();

  const handlePageChange = (nextPage: number) => {
    onPageChange(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <Pagination
      className={cn(
        "mx-0 w-auto justify-end",
        className,
      )}
    >
      <PaginationContent className={cn("gap-1", contentClassName)}>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            text=""
            size="icon-sm"
            className={cn(
              "rounded-full pl-0! bg-transparent text-white/65 hover:border-(--theme-color) hover:bg-(--theme-color)/10 hover:text-(--theme-color)",
              controlClassName,
            )}
            onClick={(event) => {
              event.preventDefault();
              handlePageChange(currentPage - 1);
            }}
          />
        </PaginationItem>
        {visiblePageItems.map((item) =>
          typeof item === "number" ? (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                size="icon-sm"
                isActive={currentPage === item}
                className={cn(
                  "rounded-full",
                  currentPage === item
                    ? "border-(--theme-color)/40 hover:text-white bg-(--theme-color) text-white hover:bg-(--theme-color) shadow-[0_0_12px_rgba(255,255,255,0.08)]"
                    : "text-white/65 hover:border-(--theme-color)/30 hover:bg-(--theme-color)/10 hover:text-(--theme-color)",
                  currentPage === item ? activeItemClassName : itemClassName,
                )}
                onClick={(event) => {
                  event.preventDefault();
                  handlePageChange(item);
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationEllipsis
                className={cn("text-white/45", ellipsisClassName)}
              />
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            text=""
            size="icon-sm"
            className={cn(
              "rounded-full pr-0! bg-transparent text-white/65 hover:border-(--theme-color) hover:bg-(--theme-color)/10 hover:text-(--theme-color)",
              controlClassName,
            )}
            onClick={(event) => {
              event.preventDefault();
              handlePageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default FolderListPagination;
