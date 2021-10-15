const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlists/{playlistId}',
    handler: handler.postExportNotesHandler,
    options: {
      auth: 'ecommerce_jwt',
    },
  },
];

module.exports = routes;
