// @ts-check
import { DomeGallery } from './components/dome-gallery/DomeGallery.js';
import { NavPill } from './components/nav-pill/NavPill.js';
import { SegmentedTabs } from './components/segmented-tabs/SegmentedTabs.js';
import { RoomBackdrop } from './components/room-backdrop/RoomBackdrop.js';
import { SceneShade } from './components/scene-shade/SceneShade.js';
import { ScreenVignette } from './components/screen-vignette/ScreenVignette.js';
import { Toast } from './components/toast/Toast.js';
import { VideoPlayer } from './components/video-player/VideoPlayer.js';
import { BANNERS } from './data/banners.js';
import { videoForCell } from './data/videos.js';
import { applyDisplayMode, currentDisplayMode, isImmersiveVrSupported, resolveDisplayMode } from './lib/environment.js';
import { startParallax } from './lib/parallax.js';

/** @type {{ id: import('./data/videos.js').FeedId, label: string }[]} */
const FEEDS = [
  { id: 'for-you', label: 'For You' },
  { id: 'new', label: 'New' },
  { id: 'trending', label: 'Trending' },
];

/** @type {import('./components/nav-pill/NavPill.js').NavItem[]} */
const NAV_ITEMS = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'search', icon: 'search', label: 'Search' },
  { id: 'categories', icon: 'categories', label: 'Categories' },
  { id: 'channels', icon: 'channels', label: 'Channels' },
  { id: 'premium', icon: 'premium', label: 'Premium' },
  { id: 'library', icon: 'library', label: 'My library' },
];

function main() {
  applyDisplayMode(resolveDisplayMode());

  const app = document.getElementById('app');
  if (!app) throw new Error('#app root is missing');

  const toast = Toast();
  let xrSupported = false;
  isImmersiveVrSupported().then((supported) => {
    xrSupported = supported;
  });

  /** @type {import('./data/videos.js').FeedId} */
  let currentFeed = 'for-you';
  /** @param {import('./data/videos.js').FeedId} feed */
  const feedCells = (feed) => (/** @type {number} */ row, /** @type {number} */ column) => videoForCell(row, column, feed);

  // While the page is idle, warm the HTTP cache with the other feeds' posters for the current view,
  // so a feed switch only decodes them.
  let prefetchHandle = 0;
  const schedulePrefetch = () => {
    const idle = window.requestIdleCallback ?? ((/** @type {() => void} */ run) => window.setTimeout(run, 200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    cancel(prefetchHandle);
    prefetchHandle = idle(() => {
      for (const { id } of FEEDS) if (id !== currentFeed) gallery.prefetch(feedCells(id));
    });
  };

  const feedTabs = SegmentedTabs({
    items: FEEDS,
    selectedId: currentFeed,
    label: 'Feed',
    onChange: (item) => {
      currentFeed = /** @type {import('./data/videos.js').FeedId} */ (item.id);
      gallery.switchFeed(feedCells(currentFeed));
      schedulePrefetch();
    },
  });

  const nav = NavPill({
    items: NAV_ITEMS,
    currentId: 'home',
    displayMode: currentDisplayMode(),
    onNavigate: (item) => {
      if (item.id !== 'home') toast.show(item.label, 'This section is outside the homepage prototype.');
    },
    onModeChange: (mode) => {
      applyDisplayMode(mode, { persist: true, animate: true });
      toast.show(mode === 'vr' ? 'VR mode on' : 'VR mode off');
    },
    onProfile: () => toast.show('Profile', 'Sign-in is outside the homepage prototype.'),
    onPremium: () => toast.show('Get Premium', 'Checkout is outside the homepage prototype.'),
    accessory: feedTabs.el,
  });

  const backdrop = RoomBackdrop({ src: '/assets/images/room.webp' });
  // Only the backdrop uses the parallax custom properties: set them there, not on the root, so a
  // pointer move does not restyle the whole document.
  const parallax = startParallax(backdrop);
  const gallery = DomeGallery({
    videoForCell,
    banners: BANNERS,
    parallax,
    getTopInset: () => nav.el.getBoundingClientRect().bottom,
    onSettle: schedulePrefetch,
    onPlay: (item, source) => {
      if (source && 'videoSrc' in item) {
        openVideo(item, source);
        return;
      }
      toast.show(
        `Play in VR: ${item.title}`,
        xrSupported ? 'Immersive playback would start here (simulated).' : 'Open this page in your headset, or send it to DeoVR on your device.',
      );
    },
  });

  // The player grows out of the poster; meanwhile the menu, tabs, joystick and card labels leave
  // (CSS keyed on `data-player`), and the rest of the page is inert under the dialog.
  const player = VideoPlayer({ onClose: closeVideo });
  /**
   * @param {import('./data/videos.js').Video} video
   * @param {import('./components/video-player/VideoPlayer.js').PlayerSource} source
   */
  function openVideo(video, source) {
    if (player.isOpen) return;
    document.documentElement.dataset.player = 'open';
    nav.el.inert = true;
    gallery.el.inert = true;
    gallery.setPaused(true);
    player.open({ title: video.title, videoSrc: video.videoSrc, poster: video.poster }, source);
  }
  function closeVideo() {
    if (!player.isOpen) return;
    // The chrome comes back while the video shrinks into its poster; the dome takes input again only
    // once it has landed (a click meanwhile would otherwise be dropped while the player still closes).
    delete document.documentElement.dataset.player;
    nav.el.inert = false;
    player.close().then(() => {
      gallery.el.inert = false;
      gallery.setPaused(false);
    });
  }

  app.append(
    backdrop,
    SceneShade(),
    gallery.el,
    ScreenVignette(),
    nav.el,
    player.el,
    toast.el,
  );
  gallery.mount();
}

main();
