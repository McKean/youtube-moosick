import { $$ } from '../resources/utilities/objectScan.utility.js';
import { AlbumURL, ReleaseDate, Track } from '../resources/resultTypes/albumURL.js';
import { ConstantURLs } from '../enums.js';
import { ArtistExtended } from '../resources/generalTypes/artist.js';
import { Thumbnails } from '../resources/generalTypes/thumbnails.js';
import type { ThumbnailElement } from '../resources/etc/rawResultTypes/common.js';
import type {
	MusicAlbumRelease,
	MusicAlbumReleaseDetail,
	MusicArtist,
	MusicTrack,
	AlbumURLFullResult,
	ThumbnailDetails,
} from '../resources/etc/rawResultTypes/rawGetAlbumURL.js';

export class GetAlbumParser {
	public static parseAlbumURLPage(context: AlbumURLFullResult): AlbumURL {
		// Overview of the albums
		const albumOverview = ($$('.musicAlbumRelease')(context) as MusicAlbumRelease[])[0]!;
		// For description
		const { description } = ($$('.musicAlbumReleaseDetail')(context) as MusicAlbumReleaseDetail[])[0];
		// Gets the artist, if there is multiple
		const musicArtist = ($$('.musicArtist')(context) as MusicArtist[]);
		const artist: ArtistExtended[] = [];
		for (const eachArtist of musicArtist) {
			artist.push(ArtistExtended.from({
				name: eachArtist.name,
				browseId: eachArtist.externalChannelId,
				url: ConstantURLs.CHANNEL_URL + eachArtist.externalChannelId,
				thumbnails: this.thumbnailParser(eachArtist.thumbnailDetails),
			}));
		}

		// Gets the tracks
		const musicTracks = ($$('.musicTrack')(context) as MusicTrack[]);
		const tracks: Track[] = [];
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

	private static thumbnailParser(thumbnailDetails: ThumbnailDetails): Thumbnails[] {
		const thumbnails: ThumbnailElement[] = [];
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
