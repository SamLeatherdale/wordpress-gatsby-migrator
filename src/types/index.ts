export { Feed, FeedHead, FeedItem } from './davefeedread';

export type Post = {
    title: string;
    date: Date;
    category: string;
    content: string;
    images: PostImage[];
    markdownContent: string;
    slug: string;
    path: string;
    passthroughUrl?: string;
    postType: string;
}

export type PostImage = {
    url: string;
    fileName: string;
}