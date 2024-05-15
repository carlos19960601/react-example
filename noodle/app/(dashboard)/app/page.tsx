import { TypographyH2 } from "@/components/TypographyH2";
import { TypographyP } from "@/components/TypographyP";
import { formatDate } from "@/utils/formatDate";
import { NotebookTable } from "./_components/notebook-table";
import { WeatherData } from "./_components/weather";

type QuoteType = {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
  dateAdded: string;
  dateModified: string;
};

export default async function Page() {
  // const user = await currentUser();
  const user = { firstName: "Q" };

  const quote = await fetch(
    "https://api.quotable.io/random?minLength=100&maxLength=140",
    {
      next: {
        revalidate: 60 * 60 * 24,
      },
    }
  ).then((res) => res.json() as Promise<QuoteType>);

  let greeting = "Good evening";

  const greet = `${greeting}${user?.firstName ? `, ${user?.firstName}` : ""}!`;
  const message = `"${quote.content}" - ${quote.author}`;

  return (
    <div className="grid h-full grid-cols-[1fr_auto] gap-6 overflow-hidden pb-8">
      <div className="flex flex-col">
        <TypographyH2>{greet}</TypographyH2>
        <TypographyP className="max-w-prose opacity-75 [&:not(:first-child)]:mt-2">
          {message}
        </TypographyP>

        <h2 className="mb-2 mt-6 text-large font-semibold">Notebooks</h2>
        <div className="relative flex w-full flex-col overflow-y-auto">
          <div>
            <NotebookTable />
          </div>
        </div>
      </div>
      <div>
        <span>It&apos;s</span>
        <h3>{formatDate(new Date())}</h3>
        <WeatherData />
      </div>
    </div>
  );
}
