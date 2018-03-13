// Type definitions for webpack-pwa-manifest 2.0.4
// Project: https://github.com/arthurbergmz/webpack-pwa-manifest
// Definitions by: Arthur A. Bergamaschi <https://www.github.com/arthurbergmz>

import { Plugin } from 'webpack';

export = WebpackPwaManifest

declare class WebpackPwaManifest extends Plugin {
    constructor(options: WebpackPwaManifest.Options);
}

declare namespace WebpackPwaManifest {
    type Category = 'books' | 'business' | 'education' | 'entertainment' | 'finance' | 'fitness' | 'food' | 'games' | 'government' | 'health' | 'kids' | 'lifestyle' | 'magazines' | 'medical' | 'music' | 'navigation' | 'news' | 'personalization' | 'photo' | 'politics' | 'productivity' | 'security' | 'shopping' | 'social' | 'sports' | 'travel' | 'utilities' | 'weather'
    type Direction = 'ltr' | 'rtl' | 'auto';
    type Display = 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
    type Orientation = 'any' | 'natural' | 'landscape' | 'landscape-primary' | 'landscape-secondary' | 'portrait' | 'portrait-primary' | 'portrait-secondary';
    interface ManifestOptions {
        background_color?: string;
        categories?: (WebpackPwaManifest.Category|string)[];
        description?: string;
        dir?: WebpackPwaManifest.Direction;
        display?: WebpackPwaManifest.Display;
        filename?: string;
        iarc_rating_id?: string;
        icons?: WebpackPwaManifest.ImageResource | WebpackPwaManifest.ImageResource[];
        lang?: string;
        name: string;
        orientation?: WebpackPwaManifest.Orientation;
        prefer_related_applications?: boolean;
        related_applications?: WebpackPwaManifest.RelatedApplications[];
        scope?: string;
        screenshots?: WebpackPwaManifest.ImageResource | WebpackPwaManifest.ImageResource[];
        short_name?: string;
        start_url?: string;
        theme_color?: string;
        serviceworker?: WebpackPwaManifest.ServiceWorker;
    }
    interface GenericOutputOptions {
        filename?: string;
        destination?: string;
    }
    interface OutputOptions {
        publicPath?: string;
        injectHtml?: boolean;
        includeDirectory?: boolean;
        manifest?: WebpackPwaManifest.GenericOutputOptions;
        icons?: WebpackPwaManifest.GenericOutputOptions;
    }
    interface Options {
        output: WebpackPwaManifest.OutputOptions;
        manifest?: WebpackPwaManifest.ManifestOptions
        favicons: WebpackPwaManifest.ImageResource[],
        safari: WebpackPwaManifest.SafariOptions
    }
    interface RelatedApplications {
        platform?: string;
        url: string;
        id?: string;
    }
    interface SafariOptions {
        webAppCapable?: 'yes' | 'no' | boolean;
        webAppTitle?: string;
        webAppStatusBarStyle?: 'default' | 'black' | 'black-translucent';
        startupImage?: WebpackPwaManifest.SafariStartupImageResource;
        maskIcon?: WebpackPwaManifest.SafariMaskIconImageResource;
        icons?: WebpackPwaManifest.SafariImageResource | WebpackPwaManifest.SafariImageResource[];
    }
    interface SafariStartupImageResource {
        src: string;
        filename?: string;
        sizes?: string | number | (string|number)[];
        destination?: string;
    }
    interface SafariMaskIconImageResource {
        src: string;
        color?: string;
        filename?: string;
        sizes?: string | number | (string|number)[];
        destination?: string;
    }
    interface SafariImageResource {
        src: string;
        filename?: string;
        sizes?: string | number | (string|number)[];
        destination?: string;
    }
    interface ImageResource {
        src: string;
        filename?: string;
        sizes?: string | number | (string|number)[];
        purpose?: 'badge' | 'any';
        platform?: 'play' | 'itunes' | 'windows' | string;
        destination?: string;
        density?: number;
    }
    interface ServiceWorker {
        src: string;
        scope?: string;
        type?: 'classic' | 'module';
        update_via_cache?: 'imports' | 'all' | 'none';
    }
}