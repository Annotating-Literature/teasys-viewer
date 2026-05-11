export interface PageMetadata {
    id: string; // The slug (e.g., 'about', 'meeting-times')
    title: string;
    menu?: boolean;
    parent?: string;
    sortOrder?: number;
    createdAt: string;
    updatedAt: string;
}
