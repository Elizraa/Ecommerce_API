const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationService, cacheService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
    this._cacheService = cacheService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'insert into playlists values($1, $2, $3) returning id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    await this._cacheService.delete(`owner-${owner}`);
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    try {
      const result = await this._cacheService.get(`owner-${owner}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `select playlists.id, playlists.name, users.username from playlists
        LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
        LEFT JOIN users ON users.id = playlists.owner 
        WHERE playlists.owner = $1 OR collaborations.user_id = $1
        GROUP BY playlists.id, users.username;`,
        values: [owner],
      };
      const result = await this._pool.query(query);
      await this._cacheService.set(`owner-${owner}`, JSON.stringify(result.rows));
      return result.rows;
    }
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'delete from playlists where id = $1 returning id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
    await this._cacheService.delete(`owner-${id}`);
    await this._cacheService.delete(`playlistSongs-${id}`);
  }

  async postAddSongToPlaylistById(playlistId, songId) {
    const id = `playlistSong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlistsongs(id,playlist_id,song_id) VALUES($1, (select id from playlists where id = $2), (select id from songs where id = $3)) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    await this._cacheService.delete(`playlistSongs-${playlistId}`);
  }

  async getSongInPlaylistById(playlistId) {
    try {
      const result = await this._cacheService.get(`playlistSongs-${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `Select songs.id, songs.title, songs.performer from songs
        Left join playlistsongs p on p.song_id = songs.id
        where p.playlist_id = $1`,
        values: [playlistId],
      };
      const result = await this._pool.query(query);
      await this._cacheService.set(`playlistSongs-${playlistId}`, JSON.stringify(result.rows));
      return result.rows;
    }
  }

  async deleteSongInPlaylistById(playlistId, songId) {
    const query = {
      text: 'delete from playlistsongs where song_id = $1 AND playlist_id = $2 returning id',
      values: [songId, playlistId],
    };
    const result = await this._pool.query(query);

    await this._cacheService.delete(`playlistSongs-${playlistId}`);
    return result;
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlists tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async verifySongId(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new ClientError('Lagu tidak ditemukan');
    }
  }
}

module.exports = PlaylistsService;
