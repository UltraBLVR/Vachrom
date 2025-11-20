const SpotifyWebApi = require('spotify-web-api-node');
const fs = require('fs');
const path = require('path');

const userLinksPath = path.join(__dirname, '../data/spotify-links.json');

const ensureDataDir = () => {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
};

const loadUserLinks = () => {
    ensureDataDir();
    if (fs.existsSync(userLinksPath)) {
        return JSON.parse(fs.readFileSync(userLinksPath, 'utf-8'));
    }
    return {};
};

const saveUserLinks = (links) => {
    ensureDataDir();
    fs.writeFileSync(userLinksPath, JSON.stringify(links, null, 2));
};

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

const spotify = {
    getAuthorizationUrl(state) {
        return spotifyApi.getAuthorizeURL(
            ['user-read-currently-playing', 'user-read-playback-state', 'user-top-read', 'user-read-recently-played', 'user-read-private', 'user-read-email'],
            state
        );
    },

    async authorizeWithCode(code) {
        try {
            const data = await spotifyApi.authorizationCodeGrant(code);
            return {
                accessToken: data.body['access_token'],
                refreshToken: data.body['refresh_token'],
                expiresIn: data.body['expires_in']
            };
        } catch (error) {
            console.error('Spotify authorization error:', error.message);
            return null;
        }
    },

    async linkAccount(userId, accessToken, refreshToken) {
        const links = loadUserLinks();
        links[userId] = {
            accessToken,
            refreshToken,
            linkedAt: new Date().toISOString()
        };
        saveUserLinks(links);
        return true;
    },

    async unlinkAccount(userId) {
        const links = loadUserLinks();
        delete links[userId];
        saveUserLinks(links);
        return true;
    },

    isAccountLinked(userId) {
        const links = loadUserLinks();
        return !!links[userId];
    },

    getAccessToken(userId) {
        const links = loadUserLinks();
        return links[userId]?.accessToken || null;
    },

    getRefreshToken(userId) {
        const links = loadUserLinks();
        return links[userId]?.refreshToken || null;
    },

    async refreshAccessToken(userId) {
        const refreshToken = this.getRefreshToken(userId);
        if (!refreshToken) return null;

        try {
            spotifyApi.setRefreshToken(refreshToken);
            const data = await spotifyApi.refreshAccessToken();
            const newAccessToken = data.body['access_token'];
            
            const links = loadUserLinks();
            links[userId].accessToken = newAccessToken;
            saveUserLinks(links);
            
            return newAccessToken;
        } catch (error) {
            console.error('Token refresh error:', error.message);
            return null;
        }
    },

    async getCurrentlyPlaying(userId) {
        try {
            const accessToken = this.getAccessToken(userId);
            if (!accessToken) return null;

            spotifyApi.setAccessToken(accessToken);
            const data = await spotifyApi.getMyCurrentPlaybackState();

            if (!data.body?.item) return null;

            const item = data.body.item;
            const isPlaying = data.body.is_playing;

            return {
                name: item.name,
                artist: item.artists.map(a => a.name).join(', '),
                album: item.album.name,
                duration: item.duration_ms,
                progress: data.body.progress_ms,
                isPlaying,
                image: item.album.images[0]?.url,
                url: item.external_urls.spotify,
                explicit: item.explicit
            };
        } catch (error) {
            console.error('Spotify error:', error.message);
            return null;
        }
    },

    async getTopTracks(userId, timeRange = 'medium_term', limit = 10) {
        try {
            const accessToken = this.getAccessToken(userId);
            if (!accessToken) return [];

            spotifyApi.setAccessToken(accessToken);
            const data = await spotifyApi.getMyTopTracks({ time_range: timeRange, limit });

            return data.body.items.map((track, index) => ({
                rank: index + 1,
                name: track.name,
                artist: track.artists.map(a => a.name).join(', '),
                album: track.album.name,
                image: track.album.images[0]?.url,
                url: track.external_urls.spotify,
                explicit: track.explicit
            }));
        } catch (error) {
            console.error('Spotify error:', error.message);
            return [];
        }
    },

    async getTopArtists(userId, timeRange = 'medium_term', limit = 10) {
        try {
            const accessToken = this.getAccessToken(userId);
            if (!accessToken) return [];

            spotifyApi.setAccessToken(accessToken);
            const data = await spotifyApi.getMyTopArtists({ time_range: timeRange, limit });

            return data.body.items.map((artist, index) => ({
                rank: index + 1,
                name: artist.name,
                genres: artist.genres.slice(0, 2).join(', ') || 'Unknown',
                followers: artist.followers.total,
                image: artist.images[0]?.url,
                url: artist.external_urls.spotify
            }));
        } catch (error) {
            console.error('Spotify error:', error.message);
            return [];
        }
    },

    async getRecentlyPlayed(userId, limit = 10) {
        try {
            const accessToken = this.getAccessToken(userId);
            if (!accessToken) return [];

            spotifyApi.setAccessToken(accessToken);
            const data = await spotifyApi.getMyRecentlyPlayedTracks({ limit });

            return data.body.items.map((item, index) => ({
                rank: index + 1,
                name: item.track.name,
                artist: item.track.artists.map(a => a.name).join(', '),
                album: item.track.album.name,
                playedAt: new Date(item.played_at),
                image: item.track.album.images[0]?.url,
                url: item.track.external_urls.spotify
            }));
        } catch (error) {
            console.error('Spotify error:', error.message);
            return [];
        }
    },

    async getProfile(userId) {
        try {
            const accessToken = this.getAccessToken(userId);
            if (!accessToken) return null;

            spotifyApi.setAccessToken(accessToken);
            const data = await spotifyApi.getMe();

            return {
                displayName: data.body.display_name,
                email: data.body.email,
                followers: data.body.followers.total,
                image: data.body.images[0]?.url,
                url: data.body.external_urls.spotify,
                uri: data.body.uri
            };
        } catch (error) {
            console.error('Spotify error:', error.message);
            return null;
        }
    }
};

module.exports = spotify;
