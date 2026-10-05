# Snapshot — deovr.com homepage structure

- URL: https://deovr.com/
- Retrieved: 2026-10-05 (HTML + CSS fetched with a desktop Chrome user agent, logged out)
- Method: structural description only; no third-party content is copied.

## Meta

- `<meta name="description">`: "Stream the world's largest library of VR videos in up to 8K 120FPS on DeoVR.
  180°, 360° and 3D experiences for every major VR headset."
- Header tagline: "Stream up to 8K 120FPS quality VR | 180, 360, 3D".
- Current site theme: light (white backgrounds, slate text). OG image uses a dark background.

## Header / navigation

- Logo (left).
- Primary nav: Videos, Photos, Premium Content, Channels, Passthrough, DriveAI, Categories, All Playlists.
- Personal nav (sidebar): My Subscriptions, Liked, Watch History, My Playlists.
- Right side: Sign In, Upload, prominent "Get DeoVR App" CTA.

## Homepage sections (in order)

1. Feed tabs: For You (default), New, Trending (with period filter: day / week / month / year / all time).
2. Featured banner carousel (promotions, e.g. "DeoVR Studio is here").
3. Video grid.
4. Top Picks (curated).
5. Categories grid with icon thumbnails: City, Guided Tour, Travel, Artistic, Nature, Music, Dance, Gameplay.
6. Trending This Month.
7. Footer: About (Help Center, Blog, Creator Handbook, Developer Documentation, Brand Assets),
   Legal (Privacy, Terms, Acceptable Use), Social (X, Discord, Reddit, Facebook, Instagram, LinkedIn).

## Video card anatomy

- Thumbnail, duration badge (e.g. 07:14).
- Title.
- Channel name + avatar.
- Upload age ("3 months ago"), view count, engagement.
- Actions: Add to Playlist, Play in VR, Hide video.
- Badges: Top Picks, Premium Content.

## Brand features with dedicated gradients (from CSS tokens)

- Interactive, Passthrough, Script, VR Cams — each has a start/end gradient token pair.
  See raw/brand/deovr-css-tokens-2026-10-05.txt.
