import { $, $$ } from '../resources/utilities/objectScan.utility.js';
import { ParsersExtended } from './parsersExtended.js';
import { PlaylistHeader, PlaylistURL } from '../resources/resultTypes/playlistURL.js';
import { FlexColumnOffset } from '../enums.js';
/**
 * Used for getPlaylistURL function ONLY
 */
export class GetPlaylistParser {
    static parsePlaylistURL(context) {
        // Gets the entire flexColumn, and filter those with empty members
        const flexColumn = $$('.musicResponsiveListItemFlexColumnRenderer')(context)
            .filter((item) => item.text?.runs != null);
        const unprocessedHeader = $$('.musicDetailHeaderRenderer')(context);
        const allThumbnailRenderers = ($$('.musicThumbnailRenderer')(context));
        const continuation = ($('.nextContinuationData')(context));
        const playlistContents = [];
        for (let i = 0; i < flexColumn.length; i += 2) {
            const flexColumnFirstRow = flexColumn[i];
            playlistContents.push({
                trackTitle: $('.text')(flexColumnFirstRow),
                trackId: $('.videoId')(flexColumnFirstRow),
                artist: ParsersExtended.artistParser(flexColumn[i + 1].text.runs),
                thumbnail: allThumbnailRenderers[Math.floor(i / 2)].thumbnail.thumbnails,
            });
        }
        return PlaylistURL.from({
            headers: GetPlaylistParser.playlistURLHeaderParser(unprocessedHeader),
            playlistContents,
            continuation,
        });
    }
    static playlistURLHeaderParser(header) {
        return PlaylistHeader.from({
            playlistName: header[0].title.runs[FlexColumnOffset.ONLYRUN].text,
            owner: header[0].subtitle.runs[2].text,
            createdYear: parseInt(header[0].subtitle.runs[4].text, 10),
            thumbnail: header[0].thumbnail.croppedSquareThumbnailRenderer.thumbnail.thumbnails,
            songCount: parseInt(header[0].secondSubtitle.runs[FlexColumnOffset.ONLYRUN].text, 10),
            approxRunTime: header[0].secondSubtitle.runs[2].text,
        });
    }
}
//# sourceMappingURL=getPlaylistParser.js.map