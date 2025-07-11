import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableSkeleton({
  columns,
  rows = 5,
}: {
  columns: number;
  rows?: number;
}) {
  const safeRows = Math.max(0, rows || 0);
  const safeCols = Math.max(0, columns || 0);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {[...Array(safeCols)].map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-5 w-24" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(safeRows)].map((_, i) => (
          <TableRow key={i}>
            {[...Array(safeCols)].map((_, j) => (
              <TableCell key={j}>
                <Skeleton className="h-5 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
