// Participation state management using localStorage

const STORAGE_KEY = 'contesthub_participating_contests';

export function getParticipatingContests(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addParticipation(contestId: string): void {
  const current = getParticipatingContests();
  if (!current.includes(contestId)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, contestId]));
  }
}

export function removeParticipation(contestId: string): void {
  const current = getParticipatingContests();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(current.filter(id => id !== contestId))
  );
}

export function isParticipating(contestId: string): boolean {
  return getParticipatingContests().includes(contestId);
}
