export interface PageMetadata {
    id: string; // The slug (e.g., 'about', 'meeting-times')
    title: string;
    menu?: boolean;
    parent?: string;
    createdAt: string;
    updatedAt: string;
}
