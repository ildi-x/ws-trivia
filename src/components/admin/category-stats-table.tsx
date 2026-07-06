import Link from "next/link";
import {
  type CategoryStatsRow,
  sumCategoryStats,
} from "@/lib/admin/category-stats";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CategoryStatsTableProps = {
  rows: CategoryStatsRow[];
};

export function CategoryStatsTable({ rows }: CategoryStatsTableProps) {
  const totals = sumCategoryStats(rows);

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60 hover:bg-muted/60 border-b">
            <TableHead className="text-muted-foreground h-11 px-3 text-xs font-semibold tracking-wide uppercase">
              Category
            </TableHead>
            <TableHead className="text-muted-foreground h-11 px-3 text-right text-xs font-semibold tracking-wide uppercase">
              Total articles
            </TableHead>
            <TableHead className="text-muted-foreground h-11 px-3 text-right text-xs font-semibold tracking-wide uppercase">
              Articles published
            </TableHead>
            <TableHead className="text-muted-foreground h-11 px-3 text-right text-xs font-semibold tracking-wide uppercase">
              Facts
            </TableHead>
            <TableHead className="text-muted-foreground h-11 px-3 text-right text-xs font-semibold tracking-wide uppercase">
              Questions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.category} className="hover:bg-muted/30">
              <TableCell className="px-3 py-3">
                <Link
                  href={`/admin/articles?category=${encodeURIComponent(row.category)}`}
                  className="font-medium hover:underline"
                >
                  {row.category}
                </Link>
              </TableCell>
              <TableCell className="px-3 py-3 text-right tabular-nums">
                {row.articles.toLocaleString()}
              </TableCell>
              <TableCell className="px-3 py-3 text-right tabular-nums">
                {row.publishedArticles.toLocaleString()}
              </TableCell>
              <TableCell className="px-3 py-3 text-right tabular-nums">
                {row.facts.toLocaleString()}
              </TableCell>
              <TableCell className="px-3 py-3 text-right tabular-nums">
                {row.questions.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="bg-muted/40 hover:bg-muted/40 border-t">
            <TableCell className="px-3 py-3 font-semibold">Total</TableCell>
            <TableCell className="px-3 py-3 text-right font-semibold tabular-nums">
              {totals.articles.toLocaleString()}
            </TableCell>
            <TableCell className="px-3 py-3 text-right font-semibold tabular-nums">
              {totals.publishedArticles.toLocaleString()}
            </TableCell>
            <TableCell className="px-3 py-3 text-right font-semibold tabular-nums">
              {totals.facts.toLocaleString()}
            </TableCell>
            <TableCell className="px-3 py-3 text-right font-semibold tabular-nums">
              {totals.questions.toLocaleString()}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
