export interface ProjectMetadata {
    slug: string;
    title: string;
    image: string;
    tags: string[];
    links: ProjectLink[];
    priority: number;
}

export interface ProjectLink {
    name: string;
    url: string;
}