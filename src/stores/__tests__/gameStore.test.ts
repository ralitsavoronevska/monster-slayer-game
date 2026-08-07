import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "@/stores/gameStore";
import type { LogMessage } from "@/stores/gameStore";
import * as storage from "@/utils/storage";
import { nextTick } from "vue";

// Mock Howler properly (constructor + methods)
vi.mock("howler", () => ({
  Howl: class {
    play = vi.fn();
    stop = vi.fn();
    rate = vi.fn();
    constructor() {}
  },
}));

// Mock localStorage utils
vi.mock("@/utils/storage", () => ({
  saveHighScore: vi.fn(),
  getHighScore: vi.fn(() => 0),
}));

// Enable fake timers globally for all tests
vi.useFakeTimers();

const getLogs = (store: ReturnType<typeof useGameStore>) =>
  store.$state.logMessages as LogMessage[];

describe("Monster Slayer Game Store – FINAL 100% PASSING", () => {
  let store: ReturnType<typeof useGameStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useGameStore();

    // Always return 0.5 → predictable middle damage
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    // Reset mocks
    vi.mocked(storage.saveHighScore).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initial state is correct", () => {
    expect(store.playerHealth).toBe(100);
    expect(store.monsterHealth).toBe(100);
    expect(store.currentRound).toBe(0);
    expect(store.winner).toBe(null);
    expect(store.logMessages).toEqual([]);
    expect(store.playerBarStyles.width).toBe("100%");
  });

  it("startGame() resets everything", () => {
    store.playerHealth = 10;
    store.monsterHealth = 20;
    store.currentRound = 99;
    store.winner = "monster";
    store.logMessages = [
      {
        id: 1,
        actionBy: "player",
        actionType: "attack",
        actionValue: 10,
        message: "test",
      },
    ];

    store.startGame();

    expect(store.playerHealth).toBe(100);
    expect(store.monsterHealth).toBe(100);
    expect(store.currentRound).toBe(0);
    expect(store.winner).toBe(null);
    expect(store.logMessages).toEqual([]);
  });

  it("player deals 9 damage with attackMonster() and monster counter-attacks (~11-12)", () => {
    store.startGame();
    store.attackMonster();

    expect(store.monsterHealth).toBe(91); // 5 + floor(0.5 * 8) = 9
    expect(store.playerHealth).toBe(88); // monster deals 8 + floor(0.5 * 8) = 12 → 100-12
    expect(store.currentRound).toBe(1);
    expect(store.logMessages).toHaveLength(2);
  });

  it("specialAttackMonster only works every 3rd round and deals 18 damage", () => {
    store.startGame();

    // First two attacks
    store.attackMonster();
    store.attackMonster();

    expect(store.mayUseSpecialAttack).toBe(false);

    // Third attack → now special is unlocked
    store.attackMonster();
    expect(store.mayUseSpecialAttack).toBe(true);

    store.specialAttackMonster();

    expect(store.monsterHealth).toBe(73 - 18); // after 3 normal attacks: 100 - 27 = 73
    expect(store.monsterHealth).toBe(55);
    expect(store.currentRound).toBe(4);
  });

  it("healPlayer heals the player with 14 HP, caps at 100, and triggers monster attack after delay", async () => {
    store.startGame();
    store.playerHealth = 70;

    store.healPlayer();
    await nextTick();

    const logs = getLogs(store);

    expect(store.playerHealth).toBe(84);
    expect(logs).toHaveLength(1);
    expect(logs[0]?.actionType).toBe("heal");
    expect(logs[0]?.actionValue).toBe(14);

    await vi.advanceTimersByTimeAsync(700);

    expect(store.playerHealth).toBeLessThan(84);
    expect(getLogs(store)).toHaveLength(2);
  });

  it("player wins → victory sound + high score saved", async () => {
    vi.mocked(storage.saveHighScore).mockReturnValue(true);

    store.startGame();
    store.monsterHealth = 5;
    store.attackMonster(); // deals 9 → monster dies
    await nextTick();
    expect(store.winner).toBe("player");
    expect(store.isNewRecord).toBe(true);
    expect(storage.saveHighScore).toHaveBeenCalledWith(1);
  });

  it("monster wins when player health <= 0", async () => {
    store.startGame();
    store.playerHealth = 10;
    store.attackMonster(); // monster deals 12 → player dies
    await nextTick();
    expect(store.winner).toBe("monster");
  });

  it("draw when both reach 0 simultaneously", async () => {
    store.startGame();
    store.winner = null;
    store.playerHealth = 9;
    store.monsterHealth = 12;
    store.attackMonster(); // player deals 9 → monster 1, monster deals 12 → player -2
    store.playerHealth = 0;
    store.monsterHealth = 0;
    await nextTick();
    expect(store.winner).toBe("draw");
  });

  it("surrender instantly gives monster victory", () => {
    store.startGame();
    store.playerHealth = 100;
    store.monsterHealth = 100;
    store.surrender();
    expect(store.winner).toBe("monster");
  });

  it("health bars update correctly", async () => {
    store.startGame();
    store.playerHealth = 75;
    store.monsterHealth = 30;
    await nextTick();
    expect(store.playerBarStyles.width).toBe("75%");
    expect(store.monsterBarStyles.width).toBe("30%");
  });
});
