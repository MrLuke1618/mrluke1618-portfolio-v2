export type ArcadeGameId =
  | 'neural-snake'
  | 'memory-core'
  | 'cyber-pong'
  | 'neon-tetris'
  | 'pixel-jump'
  | 'cipher-break'
  | 'grid-racer'
  | 'reactor-core'
  | 'void-breaker'
  | 'tic-tac-quantum';

export interface ArcadeGameInfo {
  id: ArcadeGameId;
  title: string;
  taglineEn: string;
  taglineVi: string;
  genreEn: string;
  genreVi: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Cyber-S';
  controlsEn: string;
  controlsVi: string;
  howToPlayEn: string[];
  howToPlayVi: string[];
  specs: {
    engine: string;
    fpsTarget: string;
    soundFx: string;
    genre: string;
  };
  accentColor: string;
  badge: string;
}

export const ARCADE_GAMES: ArcadeGameInfo[] = [
  {
    id: 'neural-snake',
    title: 'Neural-Snake',
    taglineEn: 'Autonomous cybernetic serpent data collector',
    taglineVi: 'Rắn mạng điều hướng thu thập gói dữ liệu thần kinh',
    genreEn: 'Classic Grid Arcade',
    genreVi: 'Arcade Lưới Cổ Điển',
    difficulty: 'Medium',
    controlsEn: 'Arrow Keys or WASD to navigate. On mobile, tap directional buttons.',
    controlsVi: 'Phím mũi tên hoặc WASD để di chuyển. Trên điện thoại chạm nút cảm ứng.',
    howToPlayEn: [
      'Navigate the cyber serpent around the 20x20 matrix.',
      'Consume glowing violet neural nodes to expand your chain and score +10 PTS.',
      'Avoid running into outer firewall boundaries or your own tail segment.',
      'Speed increases every 5 neural nodes consumed.'
    ],
    howToPlayVi: [
      'Điều khiển rắn mạng di chuyển trong lưới ma trận 20x20.',
      'Thu thập các nút dữ liệu màu tím để kéo dài chuỗi và ghi +10 điểm.',
      'Tránh va chạm vào tường lửa ngoài rìa hoặc tự đâm vào đuôi.',
      'Tốc độ sẽ tăng dần sau mỗi 5 điểm dữ liệu thu được.'
    ],
    specs: {
      engine: '2D Grid Buffer',
      fpsTarget: '60 FPS',
      soundFx: 'Frequency Chime',
      genre: 'Grid Strategy'
    },
    accentColor: '#8B5CF6',
    badge: 'CLASSIC 01'
  },
  {
    id: 'memory-core',
    title: 'Memory Core',
    taglineEn: 'Quantum tech card-matching neural puzzle',
    taglineVi: 'Giải đố ghép cặp ma trận bộ nhớ lượng tử',
    genreEn: 'Memory Matrix',
    genreVi: 'Trí Nhớ Ma Trận',
    difficulty: 'Easy',
    controlsEn: 'Click or tap any two cards to reveal and pair them.',
    controlsVi: 'Nhấp hoặc chạm hai thẻ bất kỳ để lật và tìm cặp trùng nhau.',
    howToPlayEn: [
      'A scrambled 4x4 matrix holds 8 pairs of cryptographic tech glyphs.',
      'Flip two cards at a time to uncover their hidden symbols.',
      'Match all 8 pairs in the fewest moves possible to achieve S-Rank.',
      'Track your best moves and clear time on the persistent leaderboard.'
    ],
    howToPlayVi: [
      'Ma trận 4x4 gồm 8 cặp biểu tượng công nghệ mật mã ngẫu nhiên.',
      'Lật 2 ô mỗi lượt để tìm các ký hiệu tương đồng.',
      'Ghép đủ 8 cặp với số lượt di chuyển ít nhất để đạt thứ hạng S-Rank.',
      'Ghi nhận kỷ lục số lượt và thời gian hoàn thành nhanh nhất.'
    ],
    specs: {
      engine: 'State Matcher',
      fpsTarget: '60 FPS',
      soundFx: 'Harmonic Beep',
      genre: 'Pattern Memory'
    },
    accentColor: '#8B5CF6',
    badge: 'PUZZLE 02'
  },
  {
    id: 'cyber-pong',
    title: 'Cyber-Pong',
    taglineEn: 'High-velocity photon reflex duel vs AI sub-routine',
    taglineVi: 'Đấu bóng phản xạ xung photon tốc độ cao với AI',
    genreEn: 'Reflex Sports',
    genreVi: 'Thể Thao Phản Xạ',
    difficulty: 'Medium',
    controlsEn: 'Mouse move or Up/Down arrows to control left paddle. Tap buttons on mobile.',
    controlsVi: 'Di chuột hoặc phím Lên/Xuống để điều khiển thanh chắn. Chạm nút trên mobile.',
    howToPlayEn: [
      'Control the left energy paddle against the adaptive AI opponent.',
      'Intercept the photon orb before it passes into your defensive goal.',
      'Ball speed increases by 8% on every successful paddle volley.',
      'First to reach 5 points claims total sector victory.'
    ],
    howToPlayVi: [
      'Điều khiển thanh chắn photon bên trái chống lại bot AI thông minh.',
      'Đỡ bóng trước khi nó lọt qua vạch khung thành phòng thủ của bạn.',
      'Tốc độ bóng tăng thêm 8% sau mỗi lần chạm vợt thành công.',
      'Bên nào ghi được 5 điểm trước sẽ giành chiến thắng tuyệt đối.'
    ],
    specs: {
      engine: 'Velocity Physics',
      fpsTarget: '60 FPS',
      soundFx: 'Sine Ping',
      genre: 'Reflex Duel'
    },
    accentColor: '#8B5CF6',
    badge: 'ARCADE 03'
  },
  {
    id: 'neon-tetris',
    title: 'Neon-Tetris',
    taglineEn: 'Cyber block stacking and quantum line demuxer',
    taglineVi: 'Xếp hình khối lượng tử và xóa hàng điểm số cao',
    genreEn: 'Falling Blocks',
    genreVi: 'Xếp Khối Kinh Điển',
    difficulty: 'Hard',
    controlsEn: 'Arrow Left/Right to move, Arrow Up to rotate, Arrow Down for soft drop, Space for hard drop.',
    controlsVi: 'Phím Trái/Phải để di chuyển, Lên để xoay, Xuống để thả nhanh, Phím Cách thả rơi tức thì.',
    howToPlayEn: [
      '7 distinct geometric tetromino polycubes fall into the 10x18 chamber.',
      'Rotate and translate shapes to fill complete horizontal lines without gaps.',
      'Full rows detonate in a burst of kinetic sparks, scoring massive combo points.',
      'Do not allow block towers to breach the top ceiling containment grid.'
    ],
    howToPlayVi: [
      '7 loại khối hình tetromino kinh điển rơi dần trong buồng 10x18.',
      'Xoay và dịch chuyển các khối để lấp đầy các hàng ngang không khoảng trống.',
      'Hàng kín sẽ phát nổ và xóa đi, nhân điểm thưởng combo cực lớn.',
      'Đừng để các khối xếp chồng chạm vào vạch trần trên cùng.'
    ],
    specs: {
      engine: 'Matrix Rotator',
      fpsTarget: '60 FPS',
      soundFx: 'Square Blast',
      genre: 'Spatial Stacker'
    },
    accentColor: '#8B5CF6',
    badge: 'STACKER 04'
  },
  {
    id: 'pixel-jump',
    title: 'Pixel-Jump',
    taglineEn: 'Vertical anti-gravity thruster ascension test',
    taglineVi: 'Nhảy bật bệ phản trọng lực leo tháp vô tận',
    genreEn: 'Endless Platformer',
    genreVi: 'Đi Văng Vô Tận',
    difficulty: 'Medium',
    controlsEn: 'Arrow Left/Right or A/D to steer horizontally. On mobile, tap left/right halves.',
    controlsVi: 'Phím Trái/Phải hoặc A/D để lái ngang. Trên di động chạm nửa màn hình.',
    howToPlayEn: [
      'Your cyber-bot bounces automatically on contact with solid platforms.',
      'Steer left and right to land on higher neon beams and ascending platforms.',
      'Falling off the bottom edge resets your run.',
      'Score is measured in total vertical light-meters climbed.'
    ],
    howToPlayVi: [
      'Robot mạng tự động bật nảy khi tiếp xúc với các bệ đỡ kiên cố.',
      'Lái sang trái/phải để tiếp đất lên các bệ neon cao hơn.',
      'Rơi xuống mép dưới màn hình sẽ kết thúc lượt chơi.',
      'Điểm số được tính theo độ cao mét ánh sáng bạn leo được.'
    ],
    specs: {
      engine: 'Impulse Gravity',
      fpsTarget: '60 FPS',
      soundFx: 'Spring Chirp',
      genre: 'Vertical Jump'
    },
    accentColor: '#8B5CF6',
    badge: 'JUMP 05'
  },
  {
    id: 'cipher-break',
    title: 'Cipher-Break',
    taglineEn: 'Cryptographic terminal brute-force puzzle',
    taglineVi: 'Giải mã mật mã hex máy chủ an ninh tối mật',
    genreEn: 'Hacking Mastermind',
    genreVi: 'Giải Mã Hacker',
    difficulty: 'Hard',
    controlsEn: 'Click keys 0-9 & A-F to assemble 4-character code, then press ENTER to verify.',
    controlsVi: 'Nhấp các ký tự 0-9 & A-F để tạo mã 4 ký tự, nhấn ENTER để phân tích.',
    howToPlayEn: [
      'The security firewall has masked a secret 4-character hexadecimal passcode.',
      'You have 6 attempts to analyze and penetrate the security layer.',
      'Green indicator = correct character in the exact position.',
      'Violet indicator = correct character but in the wrong slot.',
      'Gray indicator = character not present in the master cipher.'
    ],
    howToPlayVi: [
      'Hệ thống phòng thủ ẩn một mã khóa mật 4 ký tự hex ngẫu nhiên.',
      'Bạn có 6 lượt thử để phân tích và bẻ khóa thành công.',
      'Chấm Xanh lá = ký tự đúng và nằm chuẩn vị trí.',
      'Chấm Tím = ký tự có trong mã nhưng sai vị trí.',
      'Chấm Xám = ký tự không tồn tại trong mật mã.'
    ],
    specs: {
      engine: 'Entropy Solver',
      fpsTarget: '60 FPS',
      soundFx: 'Terminal Key',
      genre: 'Logic Hacker'
    },
    accentColor: '#8B5CF6',
    badge: 'LOGIC 06'
  },
  {
    id: 'grid-racer',
    title: 'Grid-Racer',
    taglineEn: 'High-speed 3-lane cyber freeway obstacle avoidance',
    taglineVi: 'Đua xe né chướng ngại vật cao tốc cyber 3 làn',
    genreEn: 'Lane Runner',
    genreVi: 'Đua Xe Phản Xạ',
    difficulty: 'Medium',
    controlsEn: 'Arrow Left/Right or A/D to switch lanes. Tap left/right buttons on mobile.',
    controlsVi: 'Phím Trái/Phải hoặc A/D để đổi làn. Chạm nút trái/phải trên mobile.',
    howToPlayEn: [
      'Pilot your hovercraft across an endless 3-lane synthwave cyber highway.',
      'Dodge incoming firewall patrol drones and stationary barrier spikes.',
      'Collect glowing energy cubes to replenish shields and boost score multiplier.',
      'Highway scroll speed accelerates dynamically as distance increases.'
    ],
    howToPlayVi: [
      'Điều khiển tàu lướt trên đường cao tốc không gian 3 làn chạy liên tục.',
      'Né tránh các drone tuần tra tường lửa và chướng ngại vật cản đường.',
      'Thu thập khối năng lượng tím để tăng điểm số và kích hoạt khiên.',
      'Tốc độ đường đua sẽ ngày một tăng nhanh theo quãng đường đã vượt qua.'
    ],
    specs: {
      engine: 'Parallax Horizon',
      fpsTarget: '60 FPS',
      soundFx: 'Engine Hum',
      genre: 'High-Speed Reflex'
    },
    accentColor: '#8B5CF6',
    badge: 'RACER 07'
  },
  {
    id: 'reactor-core',
    title: 'Reactor-Core',
    taglineEn: 'Timing synchronization & core stabilization clicker',
    taglineVi: 'Cân bằng lõi lò phản ứng hạt nhân theo nhịp chuẩn xác',
    genreEn: 'Timing Rhythm',
    genreVi: 'Bắt Nhịp Thời Gian',
    difficulty: 'Cyber-S',
    controlsEn: 'Press SPACEBAR or Click anywhere when the needle aligns with the violet sector.',
    controlsVi: 'Nhấn Phím Cách hoặc Nhấp chuột khi kim quay chạm vào vùng màu tím.',
    howToPlayEn: [
      'A radial needle sweeps continuously inside an unstable reactor ring.',
      'Click or hit Spacebar exactly when the needle aligns with the glowing target zone.',
      'Hitting the zone scores points and builds your overclock combo streak.',
      'Missing or mistiming penalizes core stability. 3 misses trigger containment breach!'
    ],
    howToPlayVi: [
      'Một kim quay liên tục quét quanh vòng tròn lõi lò phản ứng.',
      'Nhấp chuột hoặc bấm Phím Cách đúng khoảnh khắc kim chạm cung màu tím.',
      'Chuẩn xác sẽ tích điểm combo và tăng tốc độ thử thách.',
      'Bấm trượt 3 lần sẽ khiến lõi quá nhiệt và phát nổ kết thúc lượt chơi.'
    ],
    specs: {
      engine: 'Polar Trigonometry',
      fpsTarget: '60 FPS',
      soundFx: 'Electric Zap',
      genre: 'Precision Timing'
    },
    accentColor: '#8B5CF6',
    badge: 'TIMING 08'
  },
  {
    id: 'void-breaker',
    title: 'Void-Breaker',
    taglineEn: 'Neon photon prism brick pulverizer with deflection physics',
    taglineVi: 'Bắn phá khối gạch năng lượng phản xạ chùm photon',
    genreEn: 'Brick Breaker',
    genreVi: 'Bắn Gạch Cổ Điển',
    difficulty: 'Medium',
    controlsEn: 'Move mouse or Arrow Left/Right to slide bottom energy paddle.',
    controlsVi: 'Di chuột hoặc phím Trái/Phải để di chuyển thanh đỡ bóng bên dưới.',
    howToPlayEn: [
      'Deflect the energy ball upward into rows of quantum defense bricks.',
      'Each brick destroyed awards points and exposes deeper layers.',
      'Adjust deflection angle by hitting the ball with the outer edges of your paddle.',
      'Clear all 24 bricks to trigger the victory hyper-burst sequence.'
    ],
    howToPlayVi: [
      'Đỡ và phản xạ bóng năng lượng hướng lên các hàng gạch bảo vệ.',
      'Mỗi khối gạch vỡ sẽ cộng điểm và mở đường vào lớp lõi bên trong.',
      'Điều chỉnh góc nảy bóng bằng cách đón bóng ở mép ngoài thanh đỡ.',
      'Phá hủy toàn bộ 24 khối gạch để chiến thắng màn chơi.'
    ],
    specs: {
      engine: 'AABB Deflection',
      fpsTarget: '60 FPS',
      soundFx: 'Prism Clink',
      genre: 'Classic Breaker'
    },
    accentColor: '#8B5CF6',
    badge: 'BREAKOUT 09'
  },
  {
    id: 'tic-tac-quantum',
    title: 'Tic-Tac-Quantum',
    taglineEn: 'Heuristic Minimax cyber grid strategy matrix',
    taglineVi: 'Cờ ca-rô ma trận 3x3 đối đầu thuật toán Minimax AI',
    genreEn: 'Minimax Strategy',
    genreVi: 'Chiến Thuật Trí Tuệ',
    difficulty: 'Hard',
    controlsEn: 'Click any open cell to place your violet holographic node (X).',
    controlsVi: 'Nhấp vào ô trống để đặt ký hiệu lượng tử tím (X).',
    howToPlayEn: [
      'Play as (X) against the unbeatable Minimax AI neural core (O).',
      'Align 3 identical holographic nodes vertically, horizontally, or diagonally to win.',
      'The AI evaluates all minimax permutations to play optimal counter-tactics.',
      'Maintain an undefeated streak to prove your tactical supremacy.'
    ],
    howToPlayVi: [
      'Bạn cầm quân (X) đối đầu với trí tuệ nhân tạo Minimax (O).',
      'Xếp 3 ký hiệu thẳng hàng ngang, dọc hoặc chéo để giành chiến thắng.',
      'AI tính toán toàn bộ nhánh cây quyết định để đi những nước cờ tối ưu nhất.',
      'Giữ chuỗi trận bất bại để chứng minh khả năng chiến thuật của bạn.'
    ],
    specs: {
      engine: 'Minimax Heuristics',
      fpsTarget: '60 FPS',
      soundFx: 'Dual Tone',
      genre: 'Grid Strategy'
    },
    accentColor: '#8B5CF6',
    badge: 'QUANTUM 10'
  }
];
