import { $$ } from '../resources/utilities/objectScan.utility.js';
import { AlbumURL, ReleaseDate, Track } from '../resources/resultTypes/albumURL.js';
import { ConstantURLs } from '../enums.js';
import { ArtistExtended } from '../resources/generalTypes/artist.js';
import { Thumbnails } from '../resources/generalTypes/thumbnails.js';
/**
 * Parser to deal with the output generated by the Moosick#getAlbum
 *
 * @remarks
 * Do not use this class directly, unless for tests purposes
 * @internal
 */
export class GetAlbumParser {
    /**
     * Parses the object provided by Moosick#getAlbum
     * @param context - The return results from axios
     */
    static parseAlbumURLPage(context) {
        console.log(context);
        // Overview of the albums
        const albumOverview = $$('.musicAlbumRelease')(context)[0];
        // For description
        const { description } = $$('.musicAlbumReleaseDetail')(context)[0];
        // Gets the artist, if there is multiple
        const musicArtist = $$('.musicArtist')(context);
        const artist = [];
        for (const eachArtist of musicArtist) {
            artist.push(ArtistExtended.from({
                name: eachArtist.name,
                browseId: eachArtist.externalChannelId,
                url: ConstantURLs.CHANNEL_URL + eachArtist.externalChannelId,
                thumbnails: this.thumbnailParser(eachArtist.thumbnailDetails),
            }));
        }
        // Gets the tracks
        const musicTracks = $$('.musicTrack')(context);
        const tracks = [];
        for (const track of musicTracks) {
            tracks.push(Track.from({
                index: parseInt(track.albumTrackIndex, 10),
                lengthMs: parseInt(track.lengthMs, 10),
                title: track.title,
                videoId: track.videoId,
            }));
        }
        return AlbumURL.from({
            title: albumOverview.title,
            trackCount: parseInt(albumOverview.trackCount, 10),
            date: ReleaseDate.from({
                day: albumOverview.releaseDate.day,
                month: albumOverview.releaseDate.month,
                year: albumOverview.releaseDate.year,
            }),
            duration: parseInt(albumOverview.durationMs, 10),
            thumbnails: this.thumbnailParser(albumOverview.thumbnailDetails),
            description, artist, tracks,
        });
    }
    /**
     * Parses the thumbnail
     * @param thumbnailDetails - The thumbnail details, preparsed
     * @internal
     */
    static thumbnailParser(thumbnailDetails) {
        const thumbnails = [];
        thumbnailDetails.thumbnails.forEach((item) => {
            thumbnails.push(Thumbnails.from({
                width: item.width,
                height: item.height,
                url: item.url,
            }));
        });
        return thumbnails;
    }
}
//# sourceMappingURL=getAlbumParser.js.map