export interface NavItem {
    label: string;
    href?: string;
    children?: { label: string; href: string }[];
}

export const MAIN_NAV: NavItem[] = [
    {
        label: "The Texts",
        children: [
            { label: "Library Index", href: "/" },
            { label: "Poetry", href: "/poetry" },
            { label: "Drama", href: "/drama" },
            { label: "Prose", href: "/prose" }
        ]
    },
    {
        label: "Authors",
        href: "/authors"
    }
];
