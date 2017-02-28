import React, { PropTypes } from 'react'

/**
 * This component is a template for the HTML file. You can add webfonts, meta tags,
 * or analytics to this file.
 *
 * To begin the development, run `npm start`.
 * To create a static bundle, use `npm run build`.
 * To create a server bundle, use `npm run server`.
 *
 * IMPORTANT: This file is compiled and used differently from other modules.
 *
 * -   In development and in static builds, this code is run at build time. It
 *     only receives asset metadata as a prop. Nothing else.
 *
 *     Additionally, it runs in a simple NodeJS + Babel context. So while it can import
 *     other modules, it can't import anything that requires a webpack loader or other
 *     webpack features.
 *
 * -   In server builds, this code evaluates for every request. It may receive
 *     additional route specific props, e.g. a serialized store and meta tags.
 */

const Html = ({ app, assets }) => (
  // <!doctype html> is prepended externally.
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Tux App</title>

      <script src={assets['manifest.js']} defer />
      <script src={assets['index.js']} defer />
    </head>
    <body>
      <div id="root" dangerouslySetInnerHTML={{ __html: app }} />
    </body>
  </html>
)

Html.propTypes = {
  app: PropTypes.string,
  assets: PropTypes.objectOf(PropTypes.string).isRequired,
}

export default Html
