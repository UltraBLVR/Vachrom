const axios = require('axios');

const BASE_URL = 'http://ws.audioscrobbler.com/2.0/';
const API_KEY = process.env.LASTFM_API_KEY;

const lastfm = {
    async getNowPlaying(username) {
        try {
            const response = await axios.get(BASE_URL, {
                params: {
                    method: 'user.getrecenttracks',
                    user: username,
                    api_key: API_KEY,
                    limit: 1,
                    format: 'json'
                }
            });

            const tracks = response.data.recenttracks.track;
            if (!tracks) return null;

            const track = Array.isArray(tracks) ? tracks[0] : tracks;
            
            if (track['@attr']?.nowplaying !== 'true') {
                return null;
            }

            return {
                name: track.name,
                artist: track.artist.#text || track.artist,
                album: track.album['#text'] || track.album,
                url: track.url,
                image: track.image[track.image.length - 1]['#text'],
                playCount: null
            };
        } catch (error) {
            console.error('Last.fm error:', error.message);
            return null;
        }
    },

    async getUserStats(username) {
        try {
            const response = await axios.get(BASE_URL, {
                params: {
                    method: 'user.getinfo',
                    user: username,
                    api_key: API_KEY,
                    format: 'json'
                }
            });

            const user = response.data.user;
            return {
                username: user.name,
                realname: user.realname,
                playCount: parseInt(user.playcount),
                artistCount: parseInt(user.artist_count),
                trackCount: parseInt(user.track_count),
                albumCount: parseInt(user.album_count),
                registered: new Date(parseInt(user.registered.unixtime) * 1000),
                image: user.image[user.image.length - 1]['#text'],
                url: user.url
            };
        } catch (error) {
            console.error('Last.fm error:', error.message);
            return null;
        }
    },

    async getRecentTracks(username, limit = 10) {
        try {
            const response = await axios.get(BASE_URL, {
                params: {
                    method: 'user.getrecenttracks',
                    user: username,
                    api_key: API_KEY,
                    limit: limit,
                    format: 'json'
                }
            });

            const tracks = response.data.recenttracks.track;
            if (!tracks) return [];

            const trackArray = Array.isArray(tracks) ? tracks : [tracks];
            return trackArray.map(track => ({
                name: track.name,
                artist: track.artist['#text'] || track.artist,
                album: track.album['#text'] || track.album,
                url: track.url,
                date: track.date ? new Date(parseInt(track.date.uts) * 1000) : null,
                image: track.image[track.image.length - 1]['#text']
            }));
        } catch (error) {
            console.error('Last.fm error:', error.message);
            return [];
        }
    },

    async getTopTracks(username, period = 'overall', limit = 10) {
        try {
            const response = await axios.get(BASE_URL, {
                params: {
                    method: 'user.gettoptracks',
                    user: username,
                    api_key: API_KEY,
                    period: period,
                    limit: limit,
                    format: 'json'
                }
            });

            const tracks = response.data.toptracks.track;
            if (!tracks) return [];

            const trackArray = Array.isArray(tracks) ? tracks : [tracks];
            return trackArray.map(track => ({
                name: track.name,
                artist: track.artist.name || track.artist,
                playCount: parseInt(track.playcount),
                rank: parseInt(track['@attr'].rank),
                url: track.url,
                image: track.image[track.image.length - 1]['#text']
            }));
        } catch (error) {
            console.error('Last.fm error:', error.message);
            return [];
        }
    },

    async getTopArtists(username, period = 'overall', limit = 10) {
        try {
            const response = await axios.get(BASE_URL, {
                params: {
                    method: 'user.gettopartists',
                    user: username,
                    api_key: API_KEY,
                    period: period,
                    limit: limit,
                    format: 'json'
                }
            });

            const artists = response.data.topartists.artist;
            if (!artists) return [];

            const artistArray = Array.isArray(artists) ? artists : [artists];
            return artistArray.map(artist => ({
                name: artist.name,
                playCount: parseInt(artist.playcount),
                rank: parseInt(artist['@attr'].rank),
                url: artist.url,
                image: artist.image[artist.image.length - 1]['#text']
            }));
        } catch (error) {
            console.error('Last.fm error:', error.message);
            return [];
        }
    },

    async scrobbleTrack(username, trackName, artistName, timestamp = Math.floor(Date.now() / 1000)) {
        try {
            const response = await axios.get(BASE_URL, {
                params: {
                    method: 'track.scrobble',
                    artist: artistName,
                    track: trackName,
                    timestamp: timestamp,
                    api_key: API_KEY,
                    format: 'json'
                }
            });
            return response.data.scrobbles;
        } catch (error) {
            console.error('Last.fm scrobble error:', error.message);
            return null;
        }
    }
};

module.exports = lastfm;
