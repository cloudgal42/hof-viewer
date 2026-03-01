import {Helmet} from "@dr.pogodin/react-helmet";

export const DefaultHelmet = () => (
  <Helmet>
    <meta property="og:title" content="Hall of Fame Viewer" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={window.location.href} />
    <meta
      property="og:description"
      data-rh="true"
      content="View your and other creator's screenshots posted in Hall of Fame (Cities Skylines 2 Mod)."
    />
    <title>Hall of Fame Viewer</title>

    <script>window.prerenderReady = true;</script>
  </Helmet>
)