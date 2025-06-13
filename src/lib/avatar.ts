export function generateRandomAvatar(seed: string) {
    return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0a3c9,ffdfbf`;
  }
  