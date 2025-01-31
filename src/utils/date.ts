export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return 'gerade eben';
  }

  if (diffInMinutes < 60) {
    return `vor ${diffInMinutes}m`;
  }

  if (diffInHours < 24) {
    return `vor ${diffInHours}h`;
  }

  if (diffInDays === 1) {
    return 'gestern';
  }

  if (diffInDays < 7) {
    return `vor ${diffInDays}d`;
  }

  return date.toLocaleDateString();
}