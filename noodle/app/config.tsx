import {
  CalendarIcon,
  FilesIcon,
  HomeIcon,
  ListChecksIcon,
  ListTodoIcon,
  PuzzleIcon,
  WalletCardsIcon,
} from "lucide-react";

export const siteConfig = {
  name: "Noodle",
  tagline: "Rethinking Student Productivity",
  description:
    "Noodle is an open-source platform that combines various productivity tools into one, such as note taking and task management, providing insightful automations to enhance student productivity.",

  github: "https://github.com/noodle-run/noodle",
  twitter: "https://twitter.com/ixahmedxii",
  discord: "https://discord.gg/SERySfj8Eg",
  instagram: "https://instagram.com/noodle.run",

  url: "https://noodle.run",
};

export const dashboardLinks = [
  {
    href: "/app",
    label: "Home",
    icon: <HomeIcon size={18} />,
  },
  {
    href: "/app/modules",
    label: "Modules",
    icon: <PuzzleIcon size={18} />,
  },
  {
    href: "/app/notes",
    label: "Notebooks",
    icon: <FilesIcon size={18} />,
  },
  {
    href: "/app/flashcards",
    label: "Flashcards",
    icon: <WalletCardsIcon size={18} />,
  },
  {
    href: "/app/tasks",
    label: "Tasks",
    icon: <ListTodoIcon size={18} />,
  },
  {
    href: "/app/assignments",
    label: "Assignments",
    icon: <ListChecksIcon size={18} />,
  },
  {
    href: "/app/calendar",
    label: "Calendar",
    icon: <CalendarIcon size={18} />,
  },
];
