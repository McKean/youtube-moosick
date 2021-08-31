import { Item } from '../../blocks/item.js';
import type { Artist } from '../generalTypes/artist.js';
import type { Thumbnails } from '../generalTypes/thumbnails.js';
export declare class PlaylistURL extends Item {
    headers: PlaylistHeader;
    playlistContents: PlaylistContent[];
    continuation: Continuation;
}
export declare class PlaylistContent extends Item {
    trackTitle: string;
    trackId?: string;
    artist: Artist[];
    thumbnail: Thumbnails[];
}
export declare class PlaylistHeader extends Item {
    playlistName: string;
    owner: string;
    createdYear: number;
    thumbnail: Thumbnails[];
    songCount: number;
    approxRunTime: string;
}
export interface Continuation {
    continuation: string;
    clickTrackingParams: string;
}
//# sourceMappingURL=playlistURL.d.ts.map