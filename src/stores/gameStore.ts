import { defineStore } from 'pinia'
import { ref, computed, watch, watchEffect } from 'vue'
import { saveHighScore, getHighScore } from '@/utils/storage'
import { Howl } from 'howler'

// IMPORT SOUND FROM ASSETS
import attackSoundFile from '@/assets/sounds/slash.mp3'
import healSoundFile from '@/assets/sounds/heal.mp3'
import victorySoundFile from '@/assets/sounds/victory.mp3'
import defeatSoundFile from '@/assets/sounds/defeat.mp3'
import drawSoundFile from '@/assets/sounds/draw.mp3'

const attackSound = new Howl({ src: [attackSoundFile], volume: 0.05 })
const healSound = new Howl({ src: [healSoundFile], volume: 0.45 })
const victorySound = new Howl({ src: [victorySoundFile], volume: 0.45 })
const defeatSound = new Howl({ src: [defeatSoundFile], volume: 0.45 })
const drawSound = new Howl({ src: [drawSoundFile], volume: 0.45 })

interface LogMessage {
  id: number
  actionBy: 'player' | 'monster'
  actionType: 'attack' | 'special-attack' | 'heal'
  actionValue: number
  message: string
}

export type { LogMessage }

type Winner = 'player' | 'monster' | 'draw' | null

const getRandomValue = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min

let logIdCounter = 0

export const useGameStore = defineStore('game', () => {
  // State
  const highScore = ref(0)
  const isNewRecord = ref(false)
  const playerHealth = ref(100)
  const monsterHealth = ref(100)
  const currentRound = ref(0)
  const winner = ref<Winner>(null)
  const logMessages = ref<LogMessage[]>([])
  const monsterBarStyles = ref({ width: '100%' })
  const playerBarStyles = ref({ width: '100%' })

  // Watch highScore from localStorage
  watchEffect(() => {
    highScore.value = getHighScore() as number
  })

  // Sync health bar width
  watch(monsterHealth, (health) => {
    monsterBarStyles.value.width = `${Math.max(health, 0)}%`
  }, { immediate: true })

  watch(playerHealth, (health) => {
    playerBarStyles.value.width = `${Math.max(health, 0)}%`
  }, { immediate: true })

  // Computed
  const mayUseSpecialAttack = computed(() =>
    currentRound.value % 3 === 0
  )
  const hasWinner = computed(() => winner.value !== null)

   // Watchers
  watch([playerHealth, monsterHealth], ([p, m]) => {
    if (p <= 0 && m <= 0) {
      winner.value = 'draw'
      drawSound.play()
    }
    else if (p <= 0) {
      winner.value = 'monster'
      defeatSound.play()
    }
    else if (m <= 0) {
      winner.value = 'player'
      const newRec = saveHighScore(currentRound.value)
      isNewRecord.value = newRec
      highScore.value = currentRound.value
      victorySound.play()
    }
  })

  // Actions
  const addLogMessage = (who: 'player' | 'monster', what: LogMessage['actionType'], value: number) => {
    let message = ''
    const actor = who === 'player' ? 'The hero' : 'The monster'

    switch (what) {
      case 'attack':
        message = `${actor} attacked for ${value} damage!`
        break
      case 'special-attack':
        message = `${actor} unleashed a SPECIAL ATTACK for ${value} damage!`
        break
      case 'heal':
        message = `${actor} healed ${value} HP!`
        break
    }

    logMessages.value.unshift({
      id: ++logIdCounter,
      actionBy: who,
      actionType: what,
      actionValue: value,
      message
    })
  }

  const startGame = () => {
    playerHealth.value = 100
    monsterHealth.value = 100
    currentRound.value = 0
    winner.value = null
    logMessages.value = []
    logIdCounter = 0
    monsterBarStyles.value.width = '100%'
    playerBarStyles.value.width = '100%'
    victorySound.stop()
    defeatSound.stop()
    drawSound.stop()
  }

  const attackMonster = () => {
    if (winner.value) return
    currentRound.value++
    const dmg = getRandomValue(5, 12)
    monsterHealth.value = Math.max(monsterHealth.value - dmg, 0)
    addLogMessage('player', 'attack', dmg)
    attackSound.rate(1.2)
    attackSound.play()
    attackPlayer()
  }

  const attackPlayer = () => {
    if (winner.value) return
    const dmg = getRandomValue(8, 15)
    playerHealth.value = Math.max(playerHealth.value - dmg, 0)
    addLogMessage('monster', 'attack', dmg)
    attackSound.rate(0.8)
    attackSound.play()
  }

  const specialAttackMonster = () => {
    if (winner.value || !mayUseSpecialAttack.value) return
    currentRound.value++
    const dmg = getRandomValue(10, 25)
    monsterHealth.value = Math.max(monsterHealth.value - dmg, 0)
    addLogMessage('player', 'special-attack', dmg)
    attackSound.rate(1.4)
    attackSound.play()
  }

  const healPlayer = () => {
    if (winner.value) return
    currentRound.value++
    const heal = getRandomValue(8, 20)
    const newHealth = Math.min(playerHealth.value + heal, 100)
    const healed = newHealth - playerHealth.value
    playerHealth.value = newHealth
    addLogMessage('player', 'heal', healed)
    healSound.play()
    setTimeout(() => {
      if (!winner.value) {
        attackPlayer()
      }
    }, 600)
  }

  const surrender = () => {
    if (!winner.value) {
      winner.value = 'monster'
      defeatSound.play()
    }
  }

  return {
    winner,
    logMessages,
    currentRound,
    highScore,
    isNewRecord,
    playerBarStyles,
    monsterBarStyles,
    mayUseSpecialAttack,
    hasWinner,
    startGame,
    attackMonster,
    specialAttackMonster,
    healPlayer,
    surrender,
    attackPlayer,
    playerHealth,
    monsterHealth,
  }
})