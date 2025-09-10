type Page = {
  url: string;
  title: string;
  isActive: boolean;
  hidden: boolean;
  items: Page[];
};

export const pagesIndex: Page[] = [
  {
    url: "/dash/account",
    title: "Account Management",
    isActive: true,
    hidden: true,
    items: []
  }
];
