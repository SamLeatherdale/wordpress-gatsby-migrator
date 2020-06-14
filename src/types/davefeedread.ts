export interface Feed {
    head:  FeedHead;
    items: FeedItem[];
}

export interface FeedHead {
    title:       string;
    description?: string;
    pubDate:     Date;
    link:        string;
    language:    string;
    copyright:   null;
    generator:   null;
    cloud:       Cloud;
    image:       Cloud;
    categories:  any[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Cloud {
}

export interface FeedItem {
    title:                null | string;
    description:          null | string;
    summary:              null;
    date:                 Date;
    pubdate:              Date;
    pubDate:              Date;
    link:                 string;
    guid:                 string;
    author:               string | null;
    comments:             null;
    origlink:             null;
    image:                Cloud;
    source:               Cloud;
    categories:           any[];
    enclosures:           any[];
    'rss:@':              Cloud;
    'rss:link':           ContentEncoded;
    'rss:title':          ContentEncoded;
    'rss:pubdate':        ContentEncoded;
    'content:encoded':    ContentEncoded;
    'wp:post_name':       ContentEncoded;
    'wp:post_type':       ContentEncoded;
    'wp:post_id':         ContentEncoded;
    'wp:status':          ContentEncoded;
    meta:                 Meta;
    'wp:attachment_url'?: ContentEncoded;
    'wp:post_parent'?:    ContentEncoded;
    'excerpt:encoded'?:   ContentEncoded;
    'wp:post_date'?:      ContentEncoded;
    'wp:post_date_gmt'?:  ContentEncoded;
    'dc:creator'?:        ContentEncoded;
    'wp:comment_status'?: ContentEncoded;
    'wp:postmeta'?:       WpPostmetaElement[] | WpPostmetaElement;
}

export interface ContentEncoded {
    '@':  Cloud;
    '#'?: string;
}

export interface Meta {
    '#ns':             N[];
    '@':               N[];
    '#xml':            XML;
    '#type':           MetaType;
    title:             string;
    description:       null;
    date:              Date;
    pubdate:           Date;
    pubDate:           Date;
    link:              string;
    xmlurl:            null;
    xmlUrl:            null;
    author:            null;
    language:          string;
    favicon:           null;
    copyright:         null;
    generator:         null;
    cloud:             Cloud;
    image:             Cloud;
    categories:        any[];
    'rss:@':           Cloud;
    'rss:title':       ContentEncoded;
    'rss:link':        ContentEncoded;
    'rss:pubdate':     ContentEncoded;
    'rss:description': RSSDescription;
    'rss:language':    ContentEncoded;
    'wp:wxr_version':  ContentEncoded;
    'wp:author':       WpAuthor[];
    'wp:category':     WpCategory;
}

export interface N {
    'xmlns:excerpt'?: string;
    'xmlns:content'?: string;
    'xmlns:wfw'?:     string;
    'xmlns:dc'?:      string;
    'xmlns:wp'?:      string;
}

export enum MetaType {
    RSS = 'rss',
}

export interface XML {
    version:  string;
    encoding: XmlEncoding;
}

export enum XmlEncoding {
    UTF8 = 'UTF-8',
}

export interface RSSDescription {
    '@': Cloud;
}

export interface WpAuthor {
    '@':                      Cloud;
    'wp:author_id':           ContentEncoded;
    'wp:author_login':        ContentEncoded;
    'wp:author_email':        ContentEncoded;
    'wp:author_display_name': ContentEncoded;
    'wp:author_first_name':   ContentEncoded;
    'wp:author_last_name':    ContentEncoded;
}

export interface WpCategory {
    '@':                    Cloud;
    'wp:cat_name':          ContentEncoded;
    'wp:category_nicename': ContentEncoded;
    'wp:category_parent':   RSSDescription;
}

export interface WpPostmetaElement {
    '@':             Cloud;
    'wp:meta_key':   ContentEncoded;
    'wp:meta_value': ContentEncoded;
}
