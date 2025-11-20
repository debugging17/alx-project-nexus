export function timeSince(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m`;
    return `${Math.floor(seconds)}s`;
}

export function resolveAvatarLetter(entity) {
    if (!entity) return 'U';
    const source = typeof entity === 'string' ? entity : entity.avatar || entity.avatar_letter || entity.avatar_letter_override;
    if (typeof source === 'string' && source.trim()) {
        return source.trim().charAt(0).toUpperCase();
    }
    const first = typeof entity === 'string' ? entity : entity.first_name;
    if (typeof first === 'string' && first.trim()) {
        return first.trim().charAt(0).toUpperCase();
    }
    const last = typeof entity === 'string' ? undefined : entity.last_name;
    if (typeof last === 'string' && last.trim()) {
        return last.trim().charAt(0).toUpperCase();
    }
    const email = typeof entity === 'string' ? entity : entity.email;
    if (typeof email === 'string' && email.trim()) {
        return email.trim().charAt(0).toUpperCase();
    }
    return 'U';
}
