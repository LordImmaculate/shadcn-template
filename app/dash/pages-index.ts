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
  },
  {
    url: "/dash/admin",
    title: "Admin",
    isActive: false,
    hidden: true,
    items: [
      {
        url: "/dash/admin/user",
        title: "Users",
        isActive: false,
        hidden: false,
        items: [
          {
            url: "/dash/admin/user/[user]",
            title: "User Details",
            isActive: false,
            hidden: false,
            items: []
          }
        ]
      }
    ]
  }
];
