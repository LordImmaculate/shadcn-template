type BreadcrumbPage = {
  url: string;
  title: string;
  isActive: boolean;
  items: BreadcrumbPage[];
};

export const pagesIndex: BreadcrumbPage[] = [
  {
    url: "/dash/account",
    title: "Account Management",
    isActive: true,
    items: []
  }
];
