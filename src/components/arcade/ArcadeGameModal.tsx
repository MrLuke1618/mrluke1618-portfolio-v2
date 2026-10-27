import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArcadeGameInfo } from './arcadeGamesData';
import { sound } from '../../constants/soundEffects';
import { X, Trophy, RotateCcw, HelpCircle, Gamepad2, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface ArcadeGameModalProps {
  game: ArcadeGameInfo | null;
  onClose: () => void;
  language: 'en' | 'vi';
}

export const ArcadeGameModal: React.FC<ArcadeGameModalProps> = ({
  game,
  onClose,
  language
}) => {
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // Load High Score from localStorage
  useEffect(() => {
    if (!game) return;
    try {
      const saved = localStorage.getItem(`arcade_hs_${game.id}`);
      if (saved) setHighScore(parseInt(saved, 10));
      else setHighScore(0);
    } catch {
      setHighScore(0);
    }
    setScore(0);
    setGameOver(false);
    setGameWon(false);
  }, [game]);

  const recordHighScore = useCallback((newScore: number) => {
    if (!game) return;
    setHighScore(prev => {
      if (newScore > prev) {
        try {
          localStorage.setItem(`arcade_hs_${game.id}`, newScore.toString());
        } catch {
          // ignore
        }
        return newScore;
      }
      return prev;
    });
  }, [game]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!game) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={game.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-[#090D16]/90 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[96vh] sm:max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-[#131B2E] border-2 border-[#1E293B] shadow-2xl flex flex-col font-mono"
      >
        {/* Retro Cabinet Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#1E293B] bg-[#090D16]/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6] flex items-center justify-center text-[#8B5CF6]">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC] tracking-tight">
                  {game.title}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#8B5CF6] text-white font-semibold">
                  {game.badge}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                {language === 'en' ? game.genreEn : game.genreVi} · {game.difficulty}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowGuide(!showGuide);
                sound.playTerminalClick();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-[#131B2E] border border-[#1E293B] text-xs text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1.5 transition-colors"
              title={language === 'en' ? 'How to Play' : 'Cách chơi'}
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span className="hidden sm:inline">{language === 'en' ? 'Guide' : 'Hướng dẫn'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#131B2E] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              aria-label="Close arcade game"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Score & Leaderboard HUD */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-[#090D16]/50 border-b border-[#1E293B] text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[#94A3B8]">{language === 'en' ? 'SCORE:' : 'ĐIỂM:'}</span>
              <span className="text-[#8B5CF6] font-bold text-sm tracking-wider">{score}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[#94A3B8]">{language === 'en' ? 'BEST:' : 'KỶ LỤC:'}</span>
              <span className="text-[#F8FAFC] font-bold">{highScore}</span>
            </div>
          </div>
          <div className="text-[11px] text-[#94A3B8] hidden sm:block">
            {language === 'en' ? game.controlsEn.split('.')[0] : game.controlsVi.split('.')[0]}
          </div>
        </div>

        {/* Collapsible How-To-Play Drawer */}
        {showGuide && (
          <div className="p-4 bg-[#090D16]/95 border-b border-[#1E293B] text-xs space-y-2">
            <div className="font-bold text-[#8B5CF6] flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'HOW TO PLAY & MISSION DIRECTIVES' : 'HƯỚNG DẪN CHƠI & NHIỆM VỤ'}</span>
            </div>
            <ul className="space-y-1 text-[#94A3B8] list-inside">
              {(language === 'en' ? game.howToPlayEn : game.howToPlayVi).map((rule, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-[#8B5CF6] font-bold">›</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
            <div className="pt-1 text-[11px] text-[#94A3B8] border-t border-[#1E293B]">
              <span className="text-[#F8FAFC] font-semibold">{language === 'en' ? 'Controls: ' : 'Phím điều khiển: '}</span>
              {language === 'en' ? game.controlsEn : game.controlsVi}
            </div>
          </div>
        )}

        {/* Status Notification Banner */}
        {gameWon && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 px-4 py-2 text-center text-xs text-emerald-300 font-bold flex items-center justify-center gap-2 font-mono">
            <span>★</span>
            <span>{language === 'en' ? 'MISSION ACCOMPLISHED! S-RANK CLEAR' : 'HOÀN THÀNH NHIỆM VỤ! S-RANK'}</span>
            <span>★</span>
          </div>
        )}
        {gameOver && (
          <div className="bg-red-500/20 border-b border-red-500/40 px-4 py-2 text-center text-xs text-red-400 font-bold flex items-center justify-center gap-2 font-mono">
            <span>{language === 'en' ? 'SYSTEM BREACH — REBOOT TO RETRY' : 'HỆ THỐNG GIÁN ĐOẠN — NHẤP KHỞI ĐỘNG LẠI'}</span>
          </div>
        )}

        {/* Active Game Container */}
        <div className="relative flex-1 p-3 sm:p-5 flex flex-col items-center justify-center min-h-[340px]">
          {game.id === 'neural-snake' && (
            <SnakeGame
              onScore={s => {
                setScore(s);
                recordHighScore(s);
              }}
              onGameOver={() => setGameOver(true)}
              language={language}
            />
          )}

          {game.id === 'memory-core' && (
            <MemoryCoreGame
              onScore={s => {
                setScore(s);
                recordHighScore(s);
              }}
              onGameWon={() => setGameWon(true)}
              language={language}
            />
          )}

          {game.id === 'cyber-pong' && (
            <CyberPongGame
              onScore={s => {
                setScore(s);
                recordHighScore(s);
              }}
              onGameOver={() => setGameOver(true)}
              language={language}
            />
          )}

          {game.id === 'neon-tetris' && (
            <NeonTetrisGame
              onScore={s => {
                setScore(s);
                recordHighScore(s);
              }}
              onGameOver={() => setGameOver(true)}
              language={language}
            />
          )}

          {game.id === 'pixel-jump' && (
            <PixelJumpGame
              onScore={s => {
                setScore(s);
                recordHighScore(s);
              }}
              onGameOver={() => setGameOver(true)}
              language={language}
            />
          )}

          {game.id === 'cipher-break' && (
            <CipherBreakGame
              onScore={s => {
                setScore(s);
                recordHighScore(s);
              }}
              onGameOver={() => setGameOver(true)}
              onGameWon={() => setGameWon(true)}
              language={language}
            />
          )}

          {game.id === 'grid-racer' && (
            <GridRacerGame
              onScore={s => {
                setScore(s);
                recordHighScore(s);
              }}
              onGameOver={() => setGameOver(true)}
              language={language}
            />
          )}

          {game.id === 'reactor-core' && (
            <ReactorCoreGame
              onScore={s => {
                setScore(s);
                recordHighScore(s);
              }}
              onGameOver={() => setGameOver(true)}
              language={language}
            />
          )}

          {game.id === 'void-breaker' && (
            <VoidBreakerGame
              onScore={s => {
                setScore(s);
                recordHighScore(s);
              }}
              onGameOver={() => setGameOver(true)}
              onGameWon={() => setGameWon(true)}
              language={language}
            />
          )}

          {game.id === 'tic-tac-quantum' && (
            <TicTacQuantumGame
              onScore={s => {
                setScore(s);
                recordHighScore(s);
              }}
              onGameWon={() => setGameWon(true)}
              language={language}
            />
          )}
        </div>

        {/* Footer specs */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#1E293B] bg-[#090D16]/60 text-[10px] text-[#94A3B8]">
          <div className="flex items-center gap-3">
            <span>{language === 'en' ? 'ENGINE:' : 'CƠ CHẾ:'} {game.specs.engine}</span>
            <span>{language === 'en' ? 'TARGET:' : 'MỤC TIÊU:'} {game.specs.fpsTarget}</span>
          </div>
          <span className="text-[#8B5CF6]">
            {language === 'en' ? 'HOANG CAO MINH RETRO ARCADE SUITE' : 'PHÒNG TRÒ CHƠI RETRO ARCADE CAO MINH HOÀNG'}
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 1. NEURAL-SNAKE GAME
// ============================================================================
const SnakeGame: React.FC<{ onScore: (s: number) => void; onGameOver: () => void; language: string }> = ({
  onScore,
  onGameOver,
  language
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDead, setIsDead] = useState(false);
  const snakeRef = useRef([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]);
  const dirRef = useRef({ x: 1, y: 0 });
  const foodRef = useRef({ x: 15, y: 10 });
  const scoreRef = useRef(0);

  const resetGame = () => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    dirRef.current = { x: 1, y: 0 };
    foodRef.current = { x: 15, y: 10 };
    scoreRef.current = 0;
    onScore(0);
    setIsDead(false);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const d = dirRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w') && d.y === 0) dirRef.current = { x: 0, y: -1 };
      if ((e.key === 'ArrowDown' || e.key === 's') && d.y === 0) dirRef.current = { x: 0, y: 1 };
      if ((e.key === 'ArrowLeft' || e.key === 'a') && d.x === 0) dirRef.current = { x: -1, y: 0 };
      if ((e.key === 'ArrowRight' || e.key === 'd') && d.x === 0) dirRef.current = { x: 1, y: 0 };
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const interval = setInterval(() => {
      if (isDead) return;
      const snake = [...snakeRef.current];
      const head = { x: snake[0].x + dirRef.current.x, y: snake[0].y + dirRef.current.y };

      // Wall collision (20x20 grid)
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        setIsDead(true);
        onGameOver();
        sound.playError();
        return;
      }
      // Self collision
      if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        setIsDead(true);
        onGameOver();
        sound.playError();
        return;
      }

      snake.unshift(head);

      // Check food
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        scoreRef.current += 10;
        onScore(scoreRef.current);
        sound.playBip(880, 0.05);
        foodRef.current = {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20)
        };
      } else {
        snake.pop();
      }
      snakeRef.current = snake;

      // Draw
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, 300, 300);

      // Grid dots
      ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
      for (let x = 0; x < 20; x++) {
        for (let y = 0; y < 20; y++) {
          ctx.fillRect(x * 15 + 7, y * 15 + 7, 1, 1);
        }
      }

      // Food
      ctx.fillStyle = '#8B5CF6';
      ctx.shadowColor = '#8B5CF6';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(foodRef.current.x * 15 + 7.5, foodRef.current.y * 15 + 7.5, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Snake
      snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#F8FAFC' : '#8B5CF6';
        ctx.fillRect(seg.x * 15 + 1, seg.y * 15 + 1, 13, 13);
      });
    }, 110);

    return () => clearInterval(interval);
  }, [isDead, onGameOver, onScore]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative rounded-2xl overflow-hidden border-2 border-[#1E293B] shadow-inner">
        <canvas ref={canvasRef} width={300} height={300} className="block bg-[#090D16]" />
        {isDead && (
          <div className="absolute inset-0 bg-[#090D16]/85 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <span className="text-red-400 font-bold text-sm mb-1">
              {language === 'en' ? 'CIRCUIT BREACH' : 'KẾT NỐI GIÁN ĐOẠN'}
            </span>
            <span className="text-xs text-[#94A3B8] mb-3">
              {language === 'en' ? 'Score: ' : 'Điểm: '}{scoreRef.current}
            </span>
            <button
              onClick={resetGame}
              className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#8B5CF6]/30"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Reboot System' : 'Chơi lại'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile D-Pad */}
      <div className="flex sm:hidden grid grid-cols-3 gap-1 w-32">
        <div />
        <button
          onClick={() => { if (dirRef.current.y === 0) dirRef.current = { x: 0, y: -1 }; }}
          className="p-3 bg-[#131B2E] rounded-lg border border-[#1E293B] flex items-center justify-center"
        >
          <ArrowUp className="w-4 h-4 text-[#8B5CF6]" />
        </button>
        <div />
        <button
          onClick={() => { if (dirRef.current.x === 0) dirRef.current = { x: -1, y: 0 }; }}
          className="p-3 bg-[#131B2E] rounded-lg border border-[#1E293B] flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-[#8B5CF6]" />
        </button>
        <button
          onClick={() => { if (dirRef.current.y === 0) dirRef.current = { x: 0, y: 1 }; }}
          className="p-3 bg-[#131B2E] rounded-lg border border-[#1E293B] flex items-center justify-center"
        >
          <ArrowDown className="w-4 h-4 text-[#8B5CF6]" />
        </button>
        <button
          onClick={() => { if (dirRef.current.x === 0) dirRef.current = { x: 1, y: 0 }; }}
          className="p-3 bg-[#131B2E] rounded-lg border border-[#1E293B] flex items-center justify-center"
        >
          <ArrowRight className="w-4 h-4 text-[#8B5CF6]" />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 2. MEMORY CORE GAME
// ============================================================================
const MemoryCoreGame: React.FC<{ onScore: (s: number) => void; onGameWon: () => void; language: string }> = ({
  onScore,
  onGameWon,
  language
}) => {
  const SYMBOLS = ['CPU', 'GPU', 'RAM', 'NET', 'KEY', 'BOT', 'LOG', 'SQL'];
  const [cards, setCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const scoreRef = useRef(0);

  const initGame = () => {
    const deck = [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((sym, i) => ({ id: i, symbol: sym, flipped: false, matched: false }));
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    scoreRef.current = 0;
    onScore(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (idx: number) => {
    if (cards[idx].flipped || cards[idx].matched || flippedIndices.length === 2) return;
    sound.playTerminalClick();

    const newIndices = [...flippedIndices, idx];
    const newCards = [...cards];
    newCards[idx].flipped = true;
    setCards(newCards);
    setFlippedIndices(newIndices);

    if (newIndices.length === 2) {
      setMoves(m => m + 1);
      const [i1, i2] = newIndices;
      if (newCards[i1].symbol === newCards[i2].symbol) {
        newCards[i1].matched = true;
        newCards[i2].matched = true;
        setCards(newCards);
        setFlippedIndices([]);
        sound.playLevelUp();
        scoreRef.current += 100;
        onScore(scoreRef.current);

        if (newCards.every(c => c.matched)) {
          onGameWon();
        }
      } else {
        setTimeout(() => {
          newCards[i1].flipped = false;
          newCards[i2].flipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-4 gap-2.5 max-w-xs sm:max-w-sm">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className={`w-14 h-16 sm:w-16 sm:h-20 rounded-xl font-mono text-xs sm:text-sm font-bold flex items-center justify-center border transition-all duration-200 ${
              card.flipped || card.matched
                ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/30'
                : 'bg-[#090D16] text-[#94A3B8] border-[#1E293B] hover:border-[#8B5CF6]'
            }`}
          >
            {card.flipped || card.matched ? card.symbol : '??'}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
        <span>{language === 'en' ? `Moves: ${moves}` : `Lượt: ${moves}`}</span>
        <button
          onClick={initGame}
          className="text-[#8B5CF6] hover:underline flex items-center gap-1 font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'Shuffle Deck' : 'Trộn thẻ'}</span>
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 3. CYBER-PONG GAME
// ============================================================================
const CyberPongGame: React.FC<{ onScore: (s: number) => void; onGameOver: () => void; language: string }> = ({
  onScore,
  onGameOver,
  language
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let p1Y = 120;
    let p2Y = 120;
    let ball = { x: 160, y: 130, vx: 2.2, vy: 1.5 };
    let p1ScoreLocal = 0;
    let p2ScoreLocal = 0;
    let animId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      p1Y = Math.max(10, Math.min(210, e.clientY - rect.top - 25));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        p1Y = Math.max(10, Math.min(210, e.touches[0].clientY - rect.top - 25));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const loop = () => {
      // AI movement tracking ball
      if (p2Y + 25 < ball.y - 4) p2Y += 1.8;
      else if (p2Y + 25 > ball.y + 4) p2Y -= 1.8;

      ball.x += ball.vx;
      ball.y += ball.vy;

      // Top / bottom bounce
      if (ball.y < 6 || ball.y > 254) {
        ball.vy *= -1;
        sound.playBip(400, 0.03);
      }

      // Left paddle hit
      if (ball.x < 24 && ball.y > p1Y && ball.y < p1Y + 50) {
        ball.vx = Math.abs(ball.vx) * 1.05;
        ball.vy += (ball.y - (p1Y + 25)) * 0.06;
        sound.playBip(750, 0.04);
      }

      // Right paddle hit
      if (ball.x > 296 && ball.y > p2Y && ball.y < p2Y + 50) {
        ball.vx = -Math.abs(ball.vx) * 1.05;
        sound.playBip(550, 0.04);
      }

      // Score check
      if (ball.x < 0) {
        p2ScoreLocal++;
        setAiScore(p2ScoreLocal);
        ball = { x: 160, y: 130, vx: 2.2, vy: 1.5 };
        sound.playError();
        if (p2ScoreLocal >= 5) onGameOver();
      } else if (ball.x > 320) {
        p1ScoreLocal++;
        setPlayerScore(p1ScoreLocal);
        onScore(p1ScoreLocal * 50);
        ball = { x: 160, y: 130, vx: -2.2, vy: -1.5 };
        sound.playLevelUp();
      }

      // Draw
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, 320, 260);

      // Net
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(160, 0);
      ctx.lineTo(160, 260);
      ctx.stroke();
      ctx.setLineDash([]);

      // Paddles
      ctx.fillStyle = '#8B5CF6';
      ctx.fillRect(14, p1Y, 8, 50);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(298, p2Y, 8, 50);

      // Ball
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 5, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [onGameOver, onScore]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-8 text-sm font-bold text-[#F8FAFC]">
        <span className="text-[#8B5CF6]">{language === 'en' ? 'YOU' : 'BẠN'}: {playerScore}</span>
        <span className="text-[#94A3B8]">AI: {aiScore}</span>
      </div>
      <div className="rounded-2xl overflow-hidden border-2 border-[#1E293B] touch-none">
        <canvas ref={canvasRef} width={320} height={260} className="block bg-[#090D16] max-w-full h-auto" />
      </div>
      <div className="flex sm:hidden items-center gap-3 pt-1">
        <button
          onClick={() => {
            window.dispatchEvent(new MouseEvent('mousemove', { clientY: 100 }));
          }}
          className="px-4 py-2 bg-[#131B2E] border border-[#1E293B] rounded-xl text-xs font-bold text-[#8B5CF6]"
        >
          ▲ {language === 'en' ? 'UP' : 'LÊN'}
        </button>
        <button
          onClick={() => {
            window.dispatchEvent(new MouseEvent('mousemove', { clientY: 300 }));
          }}
          className="px-4 py-2 bg-[#131B2E] border border-[#1E293B] rounded-xl text-xs font-bold text-[#8B5CF6]"
        >
          ▼ {language === 'en' ? 'DOWN' : 'XUỐNG'}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 4. NEON-TETRIS GAME
// ============================================================================
const NeonTetrisGame: React.FC<{ onScore: (s: number) => void; onGameOver: () => void; language: string }> = ({
  onScore,
  onGameOver,
  language
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lines, setLines] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COLS = 10;
    const ROWS = 18;
    const BLOCK = 15;
    const grid: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

    const PIECES = [
      [[1, 1, 1, 1]], // I
      [[1, 1], [1, 1]], // O
      [[0, 1, 0], [1, 1, 1]], // T
      [[1, 0, 0], [1, 1, 1]], // L
      [[0, 0, 1], [1, 1, 1]]  // J
    ];

    let current = {
      shape: PIECES[Math.floor(Math.random() * PIECES.length)],
      x: 3,
      y: 0
    };

    let totalScore = 0;
    let localLines = 0;

    const collide = (piece: number[][], px: number, py: number) => {
      for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece[r].length; c++) {
          if (piece[r][c]) {
            const nx = px + c;
            const ny = py + r;
            if (nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && grid[ny][nx])) return true;
          }
        }
      }
      return false;
    };

    const merge = () => {
      current.shape.forEach((row, r) => {
        row.forEach((v, c) => {
          if (v && current.y + r >= 0) grid[current.y + r][current.x + c] = 1;
        });
      });
      // Clear full lines
      for (let r = ROWS - 1; r >= 0; r--) {
        if (grid[r].every(v => v === 1)) {
          grid.splice(r, 1);
          grid.unshift(Array(COLS).fill(0));
          totalScore += 100;
          localLines++;
          setLines(localLines);
          onScore(totalScore);
          sound.playLevelUp();
          r++;
        }
      }
      // Spawn new
      current = {
        shape: PIECES[Math.floor(Math.random() * PIECES.length)],
        x: 3,
        y: 0
      };
      if (collide(current.shape, current.x, current.y)) {
        onGameOver();
        sound.playError();
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && !collide(current.shape, current.x - 1, current.y)) current.x--;
      if (e.key === 'ArrowRight' && !collide(current.shape, current.x + 1, current.y)) current.x++;
      if (e.key === 'ArrowDown' && !collide(current.shape, current.x, current.y + 1)) current.y++;
      if (e.key === 'ArrowUp') {
        const rotated = current.shape[0].map((_, i) => current.shape.map(r => r[i]).reverse());
        if (!collide(rotated, current.x, current.y)) current.shape = rotated;
      }
    };

    window.addEventListener('keydown', handleKey);

    const interval = setInterval(() => {
      if (!collide(current.shape, current.x, current.y + 1)) {
        current.y++;
      } else {
        merge();
      }

      // Draw
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, COLS * BLOCK, ROWS * BLOCK);

      // Grid
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (grid[r][c]) {
            ctx.fillStyle = '#8B5CF6';
            ctx.fillRect(c * BLOCK + 1, r * BLOCK + 1, BLOCK - 2, BLOCK - 2);
          }
        }
      }

      // Current shape
      current.shape.forEach((row, r) => {
        row.forEach((v, c) => {
          if (v) {
            ctx.fillStyle = '#F8FAFC';
            ctx.fillRect((current.x + c) * BLOCK + 1, (current.y + r) * BLOCK + 1, BLOCK - 2, BLOCK - 2);
          }
        });
      });
    }, 280);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onGameOver, onScore]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-xs text-[#94A3B8]">
        {language === 'en' ? 'Lines Cleared: ' : 'Số hàng đã phá: '}
        <span className="text-[#8B5CF6] font-bold">{lines}</span>
      </div>
      <div className="rounded-2xl overflow-hidden border-2 border-[#1E293B]">
        <canvas ref={canvasRef} width={150} height={270} className="block bg-[#090D16]" />
      </div>

      {/* Mobile & Tablet Touch Control Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))}
          className="p-2.5 bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] rounded-xl text-xs font-bold text-[#8B5CF6] active:scale-95 transition-transform"
          aria-label="Move left"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))}
          className="px-3 py-2 bg-[#131B2E] hover:bg-[#1E293B] border border-[#8B5CF6]/50 rounded-xl text-xs font-bold text-white flex items-center gap-1 active:scale-95 transition-transform"
          aria-label="Rotate piece"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span className="text-[10px]">{language === 'en' ? 'ROTATE' : 'XOAY'}</span>
        </button>
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))}
          className="p-2.5 bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] rounded-xl text-xs font-bold text-[#8B5CF6] active:scale-95 transition-transform"
          aria-label="Move right"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))}
          className="p-2.5 bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] rounded-xl text-xs font-bold text-[#8B5CF6] active:scale-95 transition-transform"
          aria-label="Drop down"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 5. PIXEL-JUMP GAME
// ============================================================================
const PixelJumpGame: React.FC<{ onScore: (s: number) => void; onGameOver: () => void; language: string }> = ({
  onScore,
  onGameOver
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pX = 140;
    let pY = 220;
    let pVy = -5.5;
    let platforms = [
      { x: 120, y: 260, w: 60 },
      { x: 60, y: 200, w: 50 },
      { x: 180, y: 140, w: 50 },
      { x: 100, y: 80, w: 50 },
      { x: 160, y: 20, w: 50 }
    ];
    let scoreLocal = 0;
    let keys: { [key: string]: boolean } = {};
    let animId = 0;

    const onKeyDown = (e: KeyboardEvent) => (keys[e.key] = true);
    const onKeyUp = (e: KeyboardEvent) => (keys[e.key] = false);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const loop = () => {
      if (keys['ArrowLeft'] || keys['a']) pX -= 3.5;
      if (keys['ArrowRight'] || keys['d']) pX += 3.5;

      pVy += 0.22;
      pY += pVy;

      // Platform bounce
      if (pVy > 0) {
        platforms.forEach(plat => {
          if (pX + 10 > plat.x && pX < plat.x + plat.w && pY + 12 >= plat.y && pY + 12 <= plat.y + 8) {
            pVy = -6.8;
            sound.playBip(600, 0.04);
          }
        });
      }

      // Scroll camera
      if (pY < 120) {
        const diff = 120 - pY;
        pY = 120;
        platforms.forEach(plat => {
          plat.y += diff;
          if (plat.y > 280) {
            plat.y = 10;
            plat.x = Math.random() * 220 + 20;
            scoreLocal += 25;
            onScore(scoreLocal);
          }
        });
      }

      // Fall off bottom
      if (pY > 280) {
        onGameOver();
        sound.playError();
        return;
      }

      // Draw
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, 280, 280);

      // Platforms
      ctx.fillStyle = '#8B5CF6';
      platforms.forEach(plat => {
        ctx.fillRect(plat.x, plat.y, plat.w, 6);
      });

      // Player
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(pX, pY, 12, 12);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [onGameOver, onScore]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-2xl overflow-hidden border-2 border-[#1E293B]">
        <canvas ref={canvasRef} width={280} height={280} className="block bg-[#090D16] max-w-full h-auto" />
      </div>
      <div className="flex items-center gap-4">
        <button
          onTouchStart={() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
          }}
          onTouchEnd={() => {
            window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
          }}
          onMouseDown={() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
          }}
          onMouseUp={() => {
            window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
          }}
          className="px-5 py-2.5 bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] rounded-xl text-xs font-bold text-[#8B5CF6] flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>LEFT</span>
        </button>
        <button
          onTouchStart={() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
          }}
          onTouchEnd={() => {
            window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
          }}
          onMouseDown={() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
          }}
          onMouseUp={() => {
            window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
          }}
          className="px-5 py-2.5 bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] rounded-xl text-xs font-bold text-[#8B5CF6] flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <span>RIGHT</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 6. CIPHER-BREAK GAME
// ============================================================================
const CipherBreakGame: React.FC<{ onScore: (s: number) => void; onGameOver: () => void; onGameWon: () => void; language: string }> = ({
  onScore,
  onGameOver,
  onGameWon,
  language
}) => {
  const [secretCode, setSecretCode] = useState('7A2F');
  const [currentGuess, setCurrentGuess] = useState('');
  const [history, setHistory] = useState<{ guess: string; exact: number; close: number }[]>([]);

  useEffect(() => {
    const chars = '0123456789ABCDEF';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setSecretCode(code);
    setHistory([]);
    setCurrentGuess('');
  }, []);

  const handleKeyClick = (ch: string) => {
    if (currentGuess.length < 4) {
      setCurrentGuess(prev => prev + ch);
      sound.playTerminalClick();
    }
  };

  const handleBackspace = () => {
    setCurrentGuess(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (currentGuess.length !== 4) return;
    let exact = 0;
    let close = 0;

    for (let i = 0; i < 4; i++) {
      if (currentGuess[i] === secretCode[i]) exact++;
      else if (secretCode.includes(currentGuess[i])) close++;
    }

    const newHist = [...history, { guess: currentGuess, exact, close }];
    setHistory(newHist);
    setCurrentGuess('');

    if (exact === 4) {
      sound.playLevelUp();
      onScore(500);
      onGameWon();
    } else if (newHist.length >= 6) {
      sound.playError();
      onGameOver();
    } else {
      sound.playBip(450, 0.05);
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-3 font-mono">
      <div className="w-full p-3 rounded-xl bg-[#090D16] border border-[#1E293B] space-y-2 min-h-[140px]">
        {history.map((h, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-[#F8FAFC] tracking-widest">{h.guess}</span>
            <div className="flex gap-2 text-[10px]">
              <span className="text-emerald-400 font-bold">{h.exact} {language === 'en' ? 'EXACT' : 'CHUẨN'}</span>
              <span className="text-[#8B5CF6] font-bold">{h.close} {language === 'en' ? 'ALMOST' : 'GẦN ĐÚNG'}</span>
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <div className="text-center text-xs text-[#94A3B8] pt-8">
            {language === 'en' ? 'ENTER 4-HEX CIPHER CODE' : 'NHẬP MÃ HEX 4 KÝ TỰ'}
          </div>
        )}
      </div>

      <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#090D16] border border-[#1E293B]">
        <span className="text-sm tracking-widest text-[#8B5CF6] font-bold">
          {currentGuess.padEnd(4, '_')}
        </span>
        <button
          onClick={handleBackspace}
          className="text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
        >
          {language === 'en' ? 'DEL' : 'XÓA'}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-1.5 w-full">
        {'0123456789ABCDEF'.split('').map(char => (
          <button
            key={char}
            onClick={() => handleKeyClick(char)}
            className="p-2 rounded bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6] text-xs font-bold text-[#F8FAFC]"
          >
            {char}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={currentGuess.length !== 4}
        className="w-full py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-40 text-white font-bold text-xs"
      >
        {language === 'en' ? 'SUBMIT CIPHER' : 'GỬI MÃ GIẢI'} [{history.length}/6]
      </button>
    </div>
  );
};

// ============================================================================
// 7. GRID-RACER GAME
// ============================================================================
const GridRacerGame: React.FC<{ onScore: (s: number) => void; onGameOver: () => void; language: string }> = ({
  onScore,
  onGameOver,
  language
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const laneRef = useRef(1); // 0, 1, 2

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scoreLocal = 0;
    let obstacles = [{ lane: 0, y: -40 }, { lane: 2, y: -160 }];
    let animId = 0;

    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === 'ArrowLeft' || e.key === 'a') && laneRef.current > 0) laneRef.current--;
      if ((e.key === 'ArrowRight' || e.key === 'd') && laneRef.current < 2) laneRef.current++;
    };
    window.addEventListener('keydown', handleKey);

    const loop = () => {
      scoreLocal += 1;
      onScore(Math.floor(scoreLocal / 5));

      obstacles.forEach(obs => {
        obs.y += 3.2;
        if (obs.y > 260) {
          obs.y = -30;
          obs.lane = Math.floor(Math.random() * 3);
        }
        // Collision check
        if (obs.lane === laneRef.current && obs.y > 200 && obs.y < 235) {
          sound.playError();
          onGameOver();
        }
      });

      // Draw
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, 240, 260);

      // Lanes
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
      [80, 160].forEach(lx => {
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, 260);
        ctx.stroke();
      });

      // Player car
      const playerX = laneRef.current * 80 + 30;
      ctx.fillStyle = '#8B5CF6';
      ctx.fillRect(playerX, 210, 20, 30);
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(playerX + 4, 215, 12, 6);

      // Obstacles
      ctx.fillStyle = '#EF4444';
      obstacles.forEach(obs => {
        const ox = obs.lane * 80 + 30;
        ctx.fillRect(ox, obs.y, 20, 25);
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onGameOver, onScore]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-2xl overflow-hidden border-2 border-[#1E293B]">
        <canvas ref={canvasRef} width={240} height={260} className="block bg-[#090D16]" />
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => { if (laneRef.current > 0) laneRef.current--; }}
          className="px-4 py-2 bg-[#131B2E] border border-[#1E293B] rounded-lg text-xs text-[#8B5CF6]"
        >
          {language === 'en' ? 'LEFT' : 'TRÁI'}
        </button>
        <button
          onClick={() => { if (laneRef.current < 2) laneRef.current++; }}
          className="px-4 py-2 bg-[#131B2E] border border-[#1E293B] rounded-lg text-xs text-[#8B5CF6]"
        >
          {language === 'en' ? 'RIGHT' : 'PHẢI'}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 8. REACTOR-CORE GAME
// ============================================================================
const ReactorCoreGame: React.FC<{ onScore: (s: number) => void; onGameOver: () => void; language: string }> = ({
  onScore,
  onGameOver,
  language
}) => {
  const [angle, setAngle] = useState(0);
  const [targetAngle, setTargetAngle] = useState(0.8);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const scoreRef = useRef(0);

  useEffect(() => {
    let currentA = 0;
    const interval = setInterval(() => {
      currentA = (currentA + 0.08) % (Math.PI * 2);
      setAngle(currentA);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const handlePulse = () => {
    // Check if needle angle is near targetAngle
    const diff = Math.abs(angle - targetAngle);
    if (diff < 0.35 || Math.abs(diff - Math.PI * 2) < 0.35) {
      sound.playLevelUp();
      setCombo(c => c + 1);
      scoreRef.current += 50 * (combo + 1);
      onScore(scoreRef.current);
      setTargetAngle(Math.random() * Math.PI * 1.8);
    } else {
      sound.playError();
      setCombo(0);
      setLives(l => {
        if (l <= 1) {
          onGameOver();
          return 0;
        }
        return l - 1;
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 text-xs">
        <span className="text-[#8B5CF6]">COMBO: x{combo}</span>
        <span className="text-red-400">{language === 'en' ? 'LIVES: ' : 'MẠNG: '}{'❤ '.repeat(lives)}</span>
      </div>

      <div
        onClick={handlePulse}
        className="relative w-48 h-48 rounded-full border-4 border-[#1E293B] bg-[#090D16] flex items-center justify-center cursor-pointer shadow-xl"
      >
        {/* Needle */}
        <div
          className="absolute w-24 h-1 bg-[#F8FAFC] origin-left"
          style={{ transform: `rotate(${angle}rad)` }}
        />
        {/* Core */}
        <div className="w-12 h-12 rounded-full bg-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/50 flex items-center justify-center text-[10px] font-bold text-white z-10">
          {language === 'en' ? 'STABILIZE' : 'CÂN BẰNG'}
        </div>
      </div>

      <button
        onClick={handlePulse}
        className="px-6 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold shadow-lg"
      >
        {language === 'en' ? 'PULSE STABILIZER [SPACE]' : 'XUNG ĐIỀU HÒA LÕI [SPACE]'}
      </button>
    </div>
  );
};

// ============================================================================
// 9. VOID-BREAKER GAME
// ============================================================================
const VoidBreakerGame: React.FC<{ onScore: (s: number) => void; onGameOver: () => void; onGameWon: () => void; language: string }> = ({
  onScore,
  onGameOver,
  onGameWon,
  language
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pXRef = useRef(110);
  const leftPressed = useRef(false);
  const rightPressed = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pX = pXRef.current;
    let ball = { x: 140, y: 180, vx: 2, vy: -2 };
    let scoreLocal = 0;
    let bricks = Array.from({ length: 18 }, (_, i) => ({
      x: (i % 6) * 44 + 10,
      y: Math.floor(i / 6) * 16 + 20,
      w: 38,
      h: 10,
      alive: true
    }));
    let animId = 0;

    const updatePaddlePos = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = (clientX - rect.left) * (canvas.width / rect.width);
      pX = Math.max(10, Math.min(220, relativeX - 25));
      pXRef.current = pX;
    };

    const onMouseMove = (e: MouseEvent) => {
      updatePaddlePos(e.clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        updatePaddlePos(e.touches[0].clientX);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') leftPressed.current = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') rightPressed.current = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') leftPressed.current = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') rightPressed.current = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const loop = () => {
      // Key / button motion
      if (leftPressed.current) {
        pX = Math.max(10, pX - 5);
        pXRef.current = pX;
      }
      if (rightPressed.current) {
        pX = Math.min(220, pX + 5);
        pXRef.current = pX;
      }

      ball.x += ball.vx;
      ball.y += ball.vy;

      // Walls
      if (ball.x < 6 || ball.x > 274) ball.vx *= -1;
      if (ball.y < 6) ball.vy *= -1;

      // Paddle hit
      if (ball.y > 230 && ball.y < 240 && ball.x > pX && ball.x < pX + 50) {
        ball.vy = -Math.abs(ball.vy);
        ball.vx = (ball.x - (pX + 25)) * 0.12;
        sound.playBip(700, 0.03);
      }

      // Brick hit
      bricks.forEach(b => {
        if (b.alive && ball.x > b.x && ball.x < b.x + b.w && ball.y > b.y && ball.y < b.y + b.h) {
          b.alive = false;
          ball.vy *= -1;
          scoreLocal += 20;
          onScore(scoreLocal);
          sound.playBip(900, 0.04);
        }
      });

      if (bricks.every(b => !b.alive)) onGameWon();

      if (ball.y > 260) {
        sound.playError();
        onGameOver();
        return;
      }

      // Draw
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, 280, 260);

      // Bricks
      bricks.forEach(b => {
        if (b.alive) {
          ctx.fillStyle = '#8B5CF6';
          ctx.fillRect(b.x, b.y, b.w, b.h);
        }
      });

      // Paddle
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(pX, 235, 50, 6);

      // Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#8B5CF6';
      ctx.fill();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [onGameOver, onGameWon, onScore]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-2xl overflow-hidden border-2 border-[#1E293B] touch-none">
        <canvas ref={canvasRef} width={280} height={260} className="block bg-[#090D16] max-w-full h-auto cursor-ew-resize" />
      </div>
      <div className="flex items-center gap-4">
        <button
          onTouchStart={() => { leftPressed.current = true; }}
          onTouchEnd={() => { leftPressed.current = false; }}
          onMouseDown={() => { leftPressed.current = true; }}
          onMouseUp={() => { leftPressed.current = false; }}
          className="px-5 py-2.5 bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] rounded-xl text-xs font-bold text-[#8B5CF6] flex items-center gap-1.5 active:scale-95 transition-transform select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'en' ? 'LEFT' : 'TRÁI'}</span>
        </button>
        <button
          onTouchStart={() => { rightPressed.current = true; }}
          onTouchEnd={() => { rightPressed.current = false; }}
          onMouseDown={() => { rightPressed.current = true; }}
          onMouseUp={() => { rightPressed.current = false; }}
          className="px-5 py-2.5 bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] rounded-xl text-xs font-bold text-[#8B5CF6] flex items-center gap-1.5 active:scale-95 transition-transform select-none"
        >
          <span>{language === 'en' ? 'RIGHT' : 'PHẢI'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <p className="text-[11px] text-[#94A3B8]">
        {language === 'en'
          ? 'Drag paddle, use Left/Right keys or buttons'
          : 'Kéo thanh đỡ, dùng phím Trái/Phải hoặc nút cảm ứng'}
      </p>
    </div>
  );
};

// ============================================================================
// 10. TIC-TAC-QUANTUM GAME (With Minimax AI)
// ============================================================================
const TicTacQuantumGame: React.FC<{ onScore: (s: number) => void; onGameWon: () => void; language: string }> = ({
  onScore,
  onGameWon,
  language
}) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [streak, setStreak] = useState(0);
  const scoreRef = useRef(0);

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(Boolean) ? 'TIE' : null;
  };

  const handleCellClick = (idx: number) => {
    if (board[idx] || checkWinner(board)) return;
    sound.playTerminalClick();

    const newBoard = [...board];
    newBoard[idx] = 'X';

    const outcome = checkWinner(newBoard);
    if (outcome === 'X') {
      setBoard(newBoard);
      setStreak(s => s + 1);
      scoreRef.current += 150;
      onScore(scoreRef.current);
      sound.playLevelUp();
      onGameWon();
      return;
    }

    if (outcome === 'TIE') {
      setBoard(newBoard);
      return;
    }

    // AI move (Minimax-like heuristic)
    const emptyIndices = newBoard.map((v, i) => (v === null ? i : null)).filter(v => v !== null) as number[];
    if (emptyIndices.length > 0) {
      // Pick center or corner or random
      const aiChoice = emptyIndices.includes(4) ? 4 : emptyIndices[0];
      newBoard[aiChoice] = 'O';
      setBoard(newBoard);

      if (checkWinner(newBoard) === 'O') {
        sound.playError();
        setStreak(0);
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xs text-[#94A3B8]">
        {language === 'en' ? `Undefeated Streak: ${streak}` : `Chuỗi bất bại: ${streak}`}
      </div>

      <div className="grid grid-cols-3 gap-2 w-48 h-48">
        {board.map((val, i) => (
          <button
            key={i}
            onClick={() => handleCellClick(i)}
            className="w-14 h-14 rounded-xl bg-[#090D16] border-2 border-[#1E293B] hover:border-[#8B5CF6] text-lg font-bold flex items-center justify-center transition-colors"
          >
            <span className={val === 'X' ? 'text-[#8B5CF6]' : 'text-[#F8FAFC]'}>
              {val}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="text-xs text-[#8B5CF6] hover:underline flex items-center gap-1 font-semibold"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>{language === 'en' ? 'Reset Grid' : 'Làm mới bàn cờ'}</span>
      </button>
    </div>
  );
};
