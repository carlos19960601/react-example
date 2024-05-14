import { formatDate } from "@/utils/formatDate";
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

  // const quote = await fetch(
  //   "https://api.quotable.io/random?minLength=100&maxLength=140",
  //   {
  //     next: {
  //       revalidate: 60 * 60 * 24,
  //     },
  //   }
  // ).then((res) => res.json() as Promise<QuoteType>);

  let greeting = "Good evening";

  // const greet = `${greeting}${user?.firstName ? `, ${user?.firstName}` : ""}!`;
  // const message = `"${quote.content}" - ${quote.author}`;

  return (
    <div>
      <div>
        <span>It&apos;s</span>
        <h3>{formatDate(new Date())}</h3>
        <WeatherData />
      </div>
    </div>
  );
}
