const KEY = 'monster-slayer-highscore'

export const getHighScore = (): number => {
  const saved = localStorage.getItem(KEY)
  const parsed = saved ? parseInt(saved, 10) : 0
  return isNaN(parsed) ? 0 : parsed
}

export const saveHighScore = (score: number): boolean => {
  const current = getHighScore()
  if (score > current) {
    localStorage.setItem(KEY, score.toString())
    return true
  }
  return false
}