// Type definitions for webapck-pwa-manifest 2.0.3
// Project: https://github.com/arthurbergmz/webpack-pwa-manifest
// Definitions by: Arthur A. Bergamaschi <www.arthurbergamaschi.com>

export as namespace webpackPwaManifest

export = WebpackPwaManifest

declare class WebpackPwaManifest {
    constructor(options: WebpackPwaManifest.ManifestOptions);
}

declare namespace WebpackPwaManifest {
    export type Direction = 'ltr' | 'rtl' | 'auto';
    export type Display = 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
    export type Orientation = 'any' | 'natural' | 'landscape' | 'landscape-primary' | 'landscape-secondary' | 'portrait' | 'portrait-primary' | 'portrait-secondary';
    export interface ManifestOptions {
        background_color?: string;
        description?: string;
        dir?: Direction;
        display?: Display;
        filename?: string;
        icons?: Icon | Icon[];
        lang?: string;
        name: string;
        orientation?: Orientation;
        prefer_related_applications?: boolean;
        related_applications?: RelatedApplications[];
        scope?: string;
        short_name?: string;
        start_url?: string;
        theme_color?: string;
    }
    export interface RelatedApplications {
        platform?: string;
        url: string;
        id?: string;
    }
    export interface Icon {
        src: string;
        size?: string | number;
        sizes?: number[];
        destination?: string;
    }
}