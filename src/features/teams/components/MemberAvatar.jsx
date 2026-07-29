import styles from './MemberAvatar.module.css';

function getInitials(fullName) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// Deterministic color derived from the member's name, so the same person
// always gets the same placeholder color instead of a random one on every render.
function getHue(fullName) {
  return (fullName.charCodeAt(0) * 7) % 360;
}

export default function MemberAvatar({ member, size = 60 }) {
  if (member.avatarUrl) {
    return (
      <img
        className={styles.image}
        style={{ width: size, height: size }}
        src={member.avatarUrl}
        alt=""
        loading="lazy"
      />
    );
  }

  const hue = getHue(member.fullName);

  return (
    <div
      className={styles.fallback}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.32,
        background: `linear-gradient(135deg, hsl(${hue}, 60%, 30%), hsl(${(hue + 120) % 360}, 60%, 30%))`,
        borderColor: `hsl(${hue}, 70%, 50%)`,
        boxShadow: `0 0 12px hsla(${hue}, 70%, 50%, 0.4)`,
      }}
      aria-hidden="true"
    >
      {getInitials(member.fullName)}
    </div>
  );
}
