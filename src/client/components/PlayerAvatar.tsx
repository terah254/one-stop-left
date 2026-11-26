export const PlayerAvatar = () => (
  <svg
    className="player-avatar"
    viewBox="0 0 48 48"
    aria-hidden="true"
    focusable="false"
  >
    <circle className="avatar-backdrop" cx="24" cy="24" r="22" />
    <path className="avatar-shirt" d="M12 43c1-9 5-14 12-14s11 5 12 14H12Z" />
    <circle className="avatar-face" cx="24" cy="21" r="10" />
    <path className="avatar-cap" d="M13 18c1-8 5-12 11-12s10 4 11 12H13Z" />
    <path className="avatar-cap-band" d="M13 17h23l-3 5H14l-1-5Z" />
    <circle className="avatar-eye" cx="20" cy="21" r="1.2" />
    <circle className="avatar-eye" cx="28" cy="21" r="1.2" />
    <path className="avatar-smile" d="M20 25c2.5 2 5.5 2 8 0" />
    <path className="avatar-strap" d="m18 31 12 12" />
  </svg>
);
