// ====== 設定 ======
const AREA_STEP_MIN = 600;    // 600分(10h)ごとにエリア
const KM_PER_MIN = 0.01;      // 1分 = 0.01km
const AREAS = [
  { id: 1,  name: "出航前夜" },
  { id: 2,  name: "霧の山麓" },
  { id: 3,  name: "帳簿の小径" },
  { id: 4,  name: "稜線の風" },
  { id: 5,  name: "印章の峠" },
  { id: 6,  name: "薄明の谷" },
  { id: 7,  name: "配分の幕営" },
  { id: 8,  name: "星図の高地" },
  { id: 9,  name: "外套の回廊" },
  { id: 10, name: "暁の旗影" },

  { id: 11, name: "古道の勘定" },
  { id: 12, name: "鐘楼の残高" },
  { id: 13, name: "監査の岩稜" },
  { id: 14, name: "約定の断崖" },
  { id: 15, name: "元帳の城門" },
  { id: 16, name: "仕訳の渡渉" },
  { id: 17, name: "黄昏の城塞" },
  { id: 18, name: "未収の雪前" },
  { id: 19, name: "月白の稜線" },
  { id: 20, name: "白い峠道" },

  { id: 21, name: "雪渓の勘定" },
  { id: 22, name: "静寂の監査路" },
  { id: 23, name: "星影の元帳" },
  { id: 24, name: "氷原の配分" },
  { id: 25, name: "黒曜の城壁" },
  { id: 26, name: "残高の祈り" },
  { id: 27, name: "断崖の印章" },
  { id: 28, name: "白夜の回廊" },
  { id: 29, name: "境界の鐘" },
  { id: 30, name: "暁へ続く稜線" },
];

const AREA_NAME_POOLS = [
  // Chapter 1（序盤：柔らかい/霧/焚き火）
  {
    light: ["薄明", "暁", "霧", "宵", "星影"],
    terrain: ["山麓", "小径", "谷", "幕営", "稜線", "峠"],
    acct: ["帳簿", "印章", "配分", "約定", "未収", "元帳"],
    flavor: ["焚き火", "外套", "古道", "旗影", "回廊", "星図"],
  },
  // Chapter 2（中盤：硬い/城塞/断崖/監査）
  {
    light: ["黄昏", "月白", "夜", "黒曜", "薄闇"],
    terrain: ["城門", "城塞", "断崖", "岩稜", "高地", "回廊"],
    acct: ["監査", "仕訳", "残高", "勘定", "契約", "見積"],
    flavor: ["鐘楼", "検問", "関所", "追手", "封印", "誓い"],
  },
  // Chapter 3（終盤：白い/雪/静寂）
  {
    light: ["白夜", "暁光", "星白", "月影", "静寂"],
    terrain: ["雪渓", "氷原", "白い峠", "雪前", "境界", "稜線"],
    acct: ["清算", "精算", "残差", "一致", "確証", "回収"],
    flavor: ["祈り", "終端", "古い星図", "帰路", "門", "誓約"],
  },
];


// ストーリー解放条件（累計分）
// 例：300分(5h)で1話、以後+300分ごと
const STORIES = [
  {
    id: 1,
    title: "第1話：帳簿と焚き火",
    unlockMin: 300,
    canShift: false, // ★この回は数値が動かない（履歴だけ残る）
    body:
`風は冷たく、山の影は早い。わたしは小さな焚き火の前で、革の帳簿を開いた。
この旅では、歩いた距離ではなく「積み上げた時間」が道標になる。

隊の補給係は言う。「物資は有限。配分を誤れば、明日が消える」
今日の勉強時間を、ページの端に静かに記す。数字は嘘をつかない。

火の向こう側に、銀の外套を羽織った護衛が立っていた。
彼は必要以上に近づかず、必要以上に目を逸らさない。
「記録するのか」それだけ。声は低く、刺さらない。

わたしが頷くと、彼は一瞬だけ口元をゆるめた。
その表情は、夜の山より短い。
旅は今夜、ようやく始まる。`,
    choices: [
      { text: "「手伝って」と言う（近づく）" },
      { text: "「大丈夫」と言う（距離を保つ）" },
    ],
    diffs: [
      { when: (st)=> st.trust >= 3, text: "わたしが記す手つきに、彼は何も言わず頷いた。" },
      { when: (st)=> st.loyalty >= 2, text: "気づくと彼は、焚き火の風上を塞ぐ位置に立っていた。" },
    ],
  },

  {
    id: 2,
    title: "第2話：契約の印章",
    unlockMin: 600,
    canShift: false,
    body:
`峠の交易所は石造りで、冷えた匂いがした。
宿代は前払い。食料は保証なし。ここでは言葉より契約が強い。

帳簿の余白に条件を書き出す。
「対価」「期限」「不履行の罰」――短い線で、未来を縛るために。
護衛は黙ってそれを見ている。わたしが迷うと、指先で一箇所だけ示した。
「成功報酬にするなら、成功の定義を決めろ」

その助言は正しい。腹立たしいほど。
印章を押す。蝋が赤く固まって、運命みたいに見える。

外へ出ると、雨が止んでいた。
彼が外套を少しだけ傾ける。わたしの肩に雨粒が落ちない角度。
気づいたふりをするか、しないか。あなたは迷う。`,
    choices: [
      { text: "「…ありがとう」と小さく言う（気づいていると伝える）" },
      { text: "何も言わずに歩く（平静を装う）" },
    ],
    diffs: [
      { when: (st)=> st.trust >= 4, text: "印章をしまうと、彼は迷わず出口へ先導した。" },
      { when: (st)=> st.loyalty >= 2, text: "雨上がりの足場で、彼はわたしの歩幅に合わせて速度を落とした。" },
    ],
  },

  {
    id: 3,
    title: "第3話：稜線の配分",
    unlockMin: 900,
    canShift: false,
    body:
`翌朝、稜線は薄い光で切り取られていた。
遠くに見えるのは荒れた城壁と、さらにその先の雪の峰。
息を整え、今日の分を歩く。

隊は二手に分かれる。偵察と補給。
誰をどこへ回すか。配分は感情で決められない。
帳簿の数字を見て、必要な方へ人を置く。
護衛は不満を言わない。ただ、主人の判断を「受け入れる」目をする。

昼、岩陰で休むとき、彼が水を差し出した。
指が触れそうで触れない距離。
わたしは受け取って、すぐ飲むべきか、少しだけからかうべきか迷う。`,
    choices: [
      { text: "すぐ受け取って飲む（信頼を示す）" },
      { text: "「毒じゃない？」と冗談めかす（距離を試す）" },
    ],
    diffs: [
      { when: (st)=> st.trust >= 5, text: "わたしが決める前に、彼は既に次の安全な足場を選んでいた。" },
      { when: (st)=> st.loyalty >= 3, text: "休憩のあいだ、彼は無言でわたしの背後を守った。" },
    ],
  },

  {
    id: 4,
    title: "第4話：暁の旗",
    unlockMin: 1200,
    canShift: true, // ★この回は動く可能性あり（超ゆっくり）
    body:
`夜明け前、空が青くほどける瞬間がある。
その色は「暁」と呼ぶには冷たくて、でも確かに希望だった。

谷の村は略奪で荒れていた。
わたしは帳簿を閉じ、村の人に聞く。
何が足りないか。誰が困っているか。今、何を優先するか。
護衛は後ろに立ち、剣の柄に手を添えるだけで脅しになる。

物資を配る。全員に満足はない。
それでも、最悪を避ける配分はできる。

戻り道、彼が言った。「怖くなかったか」
答える前に、少しだけ息を吸う。
強がるか、正直に言うか。`,
    choices: [
      { text: "「怖かった。でもやるしかなかった」と言う（正直）", shift: { trust: +1 } }, // ★ここだけ+1
      { text: "「平気」と言う（強く見せる）", shift: {} }, // +0
    ],
    diffs: [
      { when: (st)=> st.trust >= 2, text: "彼は返事を聞いてから、短く「…了解」と言った。" },
      { when: (st)=> st.loyalty >= 3, text: "風が強い場所で、彼は自然にわたしの風上へ回った。" },
    ],
  },

  {
    id: 5,
    title: "第5話：未収の言葉",
    unlockMin: 1500,
    canShift: false,
    body:
`雪の手前の山域で、風が音を変えた。
きしむ木、遠い狼、冷たい星。
焚き火の前で、今日の学びを帳簿に写す。
数行のメモでも、積み上げれば地図になる。

護衛が隣に座る。いつもより近い。
彼はわたしの帳簿を見ず、炎だけを見ていた。
「お前は、なぜそこまで記録する」
声は静かで、答えを急がせない。

少し考える。
本当の理由を言うか、うまく言い換えるか。`,
    choices: [
      { text: "「進んだ証拠がほしい。自分を信じたい」と言う" },
      { text: "「癖みたいなもの」と軽く流す" },
    ],
    diffs: [
      { when: (st)=> st.trust >= 3, text: "彼は返事をしない。ただ、火に薪を足す手つきが丁寧だった。" },
      { when: (st)=> st.loyalty >= 4, text: "わたしが帳簿を閉じるまで、彼は席を立たなかった。" },
    ],
  },
// ===== 第6話〜第10話 =====

{
  id: 6,
  title: "第6話：見張り交代",
  unlockMin: 1800,
  canShift: false,
  body:
`夜は深く、焚き火は小さかった。
風向きが変わり、煙が低く流れる。

見張りの交代時間が来る。
わたしは帳簿を閉じ、立ち上がろうとした。

「まだいい」

護衛の声は短い。
理由は言わないが、彼は立ったまま動かない。

わたしは一瞬だけ迷い、頷いた。
交代の順序を変えるのは、規則違反だ。
けれど、彼は規則を知らない男じゃない。

火の向こうで、彼は闇を見ている。
その背中を見ながら、今日の数字を思い返す。

間違っていない。
そう確認するみたいに、帳簿を指でなぞった。`,
  choices: [
    { text: "何も言わず、任せる" },
    { text: "理由を聞くが、深追いはしない" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 3, text: "彼は振り返らず、わたしの気配だけを確認するように立ち位置を変えた。" },
  ],
},

{
  id: 7,
  title: "第7話：渡渉点",
  unlockMin: 2100,
  canShift: false,
  body:
`川は思ったより冷たく、流れが速い。
渡れる場所は限られていた。

地図と数字を照らし合わせる。
ここで無理をすれば、後が崩れる。

「右だ」

彼が短く言う。
わたしは一瞬だけ顔を上げる。

右は遠回りだが、安全だ。
判断は同じだった。

何も言わず、右へ向かう。
彼は確認もせず、すぐ後ろにつく。

川を渡りきったとき、靴は濡れていなかった。
彼が一歩前に出て、流れを遮っていたからだ。

その事実に、あとで気づく。`,
  choices: [
    { text: "判断が同じだったことに触れない" },
    { text: "一言だけ「了解」と返す" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 4, text: "彼は次の進路を示さず、わたしの判断を待った。" },
  ],
},

{
  id: 8,
  title: "第8話：検問の前",
  unlockMin: 2400,
  canShift: false,
  body:
`城塞の影が長く伸びている。
検問は厳しく、通行証の条件も曖昧だった。

わたしは条件を書き出し、可能性を潰していく。
感情ではなく、整合性で通すしかない。

護衛はわたしの横ではなく、少し後ろに立った。
剣に手をかける位置でもない。

交渉は短く終わる。
帳簿の数字が、言葉の代わりをした。

通過したあと、彼は一度だけ振り返った。
検問の方を見る。

「問題は？」

聞くと、彼は首を振った。

「ない」

それ以上、何も言わなかった。`,
  choices: [
    { text: "そのまま進む" },
    { text: "一度だけ周囲を確認するよう頼む" },
  ],
  diffs: [
    { when: (st)=> st.loyalty >= 3, text: "彼は無言で一歩前に出て、進路を塞ぐ影を警戒した。" },
  ],
},

{
  id: 9,
  title: "第9話：雪の手前",
  unlockMin: 2700,
  canShift: false,
  body:
`風に、冷たさが混じり始める。
雪はまだ見えないが、近い。

補給を確認し、配分を見直す。
少しでも誤れば、戻れなくなる。

黙って修正を入れた。
無理をしない数値だ。

護衛は帳簿を見ない。
けれど、わたしが書き終えるまで待っていた。

歩き出すとき、彼は前に出た。
理由は分からない。

ただ、背中が近い。`,
  choices: [
    { text: "歩調を合わせる" },
    { text: "距離を保ったまま進む" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 5, text: "彼は振り返らず、わたしの位置だけを気にして進んだ。" },
  ],
},

{
  id: 10,
  title: "第10話：静かな稜線",
  unlockMin: 3000,
  canShift: false,
  body:
`稜線は風が強く、音が消える。
言葉は意味を持たなくなる。

足場を選び、進む。
数字の裏付けがある判断だ。

一度、足を滑らせかける。
すぐに、引き戻された。

掴まれたのは腕ではなく、外套の端だった。
距離を詰めすぎない、絶妙な掴み方。

何も言わず、体勢を立て直す。
彼も、何も言わない。

稜線の先に、次の道が見えた。

旅は続く。
静かに、確実に。`,
  choices: [
    { text: "礼を言わない" },
    { text: "短く頷く" },
  ],
  diffs: [
    { when: (st)=> st.loyalty >= 4, text: "彼はわたしの少し前を選び、風を受ける位置に立った。" },
  ],
},
// ===== 第11話〜第14話 =====

{
  id: 11,
  title: "第11話：追手の影",
  unlockMin: 3300,
  canShift: false,
  body:
`朝の空気は乾いていて、音がよく通る。
それが、嫌な予感に似ていた。

尾根を越えたところで、護衛が立ち止まった。
視線だけが、背後へ流れる。

地面の痕跡を見る。
足跡は新しい。数は多くない。だが、間隔が揃っている。
偶然の旅人じゃない。

「追手？」

わたしが言うと、彼は頷いた。
言葉はそれだけで十分だった。

帳簿を開く。
今日の距離、残りの補給、回り道のコスト。
時間の損失は大きい。だが、戦えばもっと大きい。

決めるのはわたしの役目だ。
彼は答えを急がせない。急がせないまま、周囲の危険を数えている。

風が変わった。
焚き火の煙みたいに、影がこちらへ流れてくる。`,
  choices: [
    { text: "急がず、迂回の可能性を計算する" },
    { text: "先に進みながら、退路だけ確保する" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼はわたしの計算を待たず、先に地形を確かめに行った。" },
  ],
},

{
  id: 12,
  title: "第12話：検問の裏口",
  unlockMin: 3600,
  canShift: false,
  body:
`正面の道は閉じていた。
関所の門は重く、兵の目は冷たい。

条件を聞き取り、矛盾を見つける。
通行証は必要。しかし、その通行証は「ここでは発行できない」。
つまり、ここを通る者は最初から想定されていない。

護衛は口を出さない。
代わりに、裏手の壁を一度見た。
「登れる」と言わない。ただ、見ただけ。

帳簿の余白に二つの選択肢を書く。
正面で争うか、裏で通るか。

争えば時間が減り、補給が減る。
裏へ回れば疲労が増え、リスクが増える。

数字は嘘をつかない。
けれど、数字が示すのはいつも「正しい」ではなく「まし」だ。

わたしは視線を上げ、門の影を見た。
追手は、もう遠くない。`,
  choices: [
    { text: "正面で通行を交渉する（時間を買う）" },
    { text: "裏手へ回る（静かに抜ける）" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は壁の継ぎ目を数えるように見て、わたしの選択を待った。" },
  ],
},

{
  id: 13,
  title: "第13話：凍えた計算",
  unlockMin: 3900,
  canShift: false,
  body:
`夜が冷えた。
雪はまだ落ちないのに、空気が白い。

火を小さくし、帳簿を開く。
焚き火を大きくすれば暖かい。だが、見つかりやすい。
小さくすれば安全。だが、疲労が溜まる。

配分の問題だ。
暖かさ、安全、睡眠、警戒。
全部は取れない。だから、どれを捨てるか決める。

護衛は火のそばに座らない。
風下の暗がりで、ずっと立っている。

顔を上げた瞬間だけ、彼の視線が戻る。
確認するみたいに、わたしが生きているかを見る。

「休め」

彼が言った。
命令じゃない。忠告でもない。事実の提示みたいな声。

わたしは頷き、帳簿を閉じる。
眠りに落ちる直前、外套が少しだけ重くなる。
彼が投げたのか、風が運んだのか、分からない。`,
  choices: [
    { text: "火を小さくして安全を優先する" },
    { text: "火を少し強めて回復を優先する" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は火の明るさに合わせて立ち位置を変え、影を増やした。" },
  ],
},

{
  id: 14,
  title: "第14話：判断の前提",
  unlockMin: 4200,
  canShift: true, // ★ここが最初に動く回
  body:
`夜明け前、風が止んだ。
止んだ風は、むしろ不自然で怖い。

稜線の向こうに、細い道がある。
早い。だが、危ない。落ちたら終わる。
谷へ下りる道もある。安全だが遠回りで、追手に追いつかれる。

護衛は地形を見ている。
わたしを見ない。判断を邪魔しない。

帳簿を開き、数字を並べる。
遠回りの時間、疲労、補給の減り。
追手の速度、視界、逃げ場。

結論は、最悪の形で一致していた。
安全を選べば、追いつかれる。
危険を選べば、生き残る可能性が残る。

息を吸う。
合理の選択は、いつも気持ちよくない。

護衛が一歩だけ動いた。
それは、わたしの答えを待っている動きじゃなかった。`,
  choices: [
    { text: "危険な細道を行く（理がある）", shift: { trust: +1 } }, // ★最初のtrust+1
    { text: "谷へ下りる（安全だが遅い）", shift: {} },              // +0
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は合図を待たず、わたしの判断を前提に先へ出た。風上を取る位置だった。" },
  ],
},

// ===== 第15話〜第20話 =====

{
  id: 15,
  title: "第15話：先行",
  unlockMin: 4500,
  canShift: false,
  body:
`細道を抜けた先は、風が巻いていた。
音が散り、距離感が狂う。

わたしが足場を選ぶ前に、護衛が一歩進む。
合図はない。確認もない。

わたしは止まり、地形を見る。
彼の位置は悪くない。むしろ、最適だ。

「そこは崩れる」

彼が短く言う。
わたしが同じ結論に辿り着くより、半拍早い。

判断は奪われていない。
ただ、前提にされている。

その違いに、わたしは気づく。`,
  choices: [
    { text: "彼の位置を基準に進路を決める" },
    { text: "自分の判断をなぞるように進む" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は振り返らず、わたしが来る速度を計算して歩いた。" },
  ],
},

{
  id: 16,
  title: "第16話：風上",
  unlockMin: 4800,
  canShift: false,
  body:
`尾根に出ると、風が強まった。
体温が奪われる速度が、目に見える。

外套を押さえ、進む。
護衛は何も言わず、位置を変えた。

気づくと、彼が風上に立っている。
意図は明確だが、主張はない。

わたしは歩調を変えない。
配慮に気づいたことも、伝えない。

風の音だけが続く。
それで十分だった。`,
  choices: [
    { text: "そのまま進む" },
    { text: "一瞬だけ視線を送る" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は風向きが変わるたび、無言で位置を調整した。" },
  ],
},

{
  id: 17,
  title: "第17話：無言の確認",
  unlockMin: 5100,
  canShift: false,
  body:
`雪が舞い始めた。
視界が白く、距離が測れない。

立ち止まり、数を数える。
歩幅、時間、残りの体力。

護衛が横に並ぶ。
初めてではないが、理由のない横並びだった。

顔を上げると、彼はもう前を向いている。
確認は終わったらしい。

進める。
その結論だけが、共有されていた。`,
  choices: [
    { text: "進むと決める" },
    { text: "一拍だけ待つ" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼はわたしの呼吸が整うのを待ってから、歩き出した。" },
  ],
},

{
  id: 18,
  title: "第18話：追いつかせない距離",
  unlockMin: 5400,
  canShift: false,
  body:
`追手の気配は消えない。
だが、近づいてもこない。

地形を見て、理解する。
速度を落とさず、痕跡を薄くしている。

それを考えたのは、わたしではない。
彼だ。

護衛は前を行く。
足跡は不規則で、読みづらい。

その後ろをなぞる。
判断はわたしのまま。
実行が、彼の役目になっただけだ。`,
  choices: [
    { text: "足跡を意識せず進む" },
    { text: "彼の歩き方を観察する" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は一度も振り返らなかった。必要がないからだ。" },
  ],
},

{
  id: 19,
  title: "第19話：休息の配分",
  unlockMin: 5700,
  canShift: false,
  body:
`休息を取るには短い時間しかない。
帳簿を開き、配分を決める。

十分、見張り、回復。
どれも足りない。

護衛は火を起こさない。
代わりに、雪を踏み固める音がする。

わたしが決めた時間より、少し早く彼は立った。
合図ではない。準備だ。

「いける」

そう言っているようで、言っていない。
帳簿を閉じ、立ち上がる。`,
  choices: [
    { text: "予定通りに出発する" },
    { text: "数分だけ延ばす" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼はわたしが立つ前に、既に外套を整えていた。" },
  ],
},

{
  id: 20,
  title: "第20話：前提としての判断",
  unlockMin: 6000,
  canShift: false,
  body:
`峠が近い。
空気が薄く、音が遠い。

わたしは道を選ぶ。
迷いはない。数字が示している。

護衛は確認しない。
質問もしない。

ただ、動く。
わたしの判断が、彼の前提になっている。

気づけば、それが当たり前になりつつあった。
怖さはない。

むしろ、少しだけ楽だ。

旅は、まだ続く。
関係は、名前を持たないまま。`,
  choices: [
    { text: "そのまま進む" },
    { text: "一度だけ立ち止まる" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼はわたしの選んだ道の、最初の一歩を迷わず踏み出した。" },
  ],
},

// ===== 境界樹林編：第21話〜第25話（書き直し確定版） =====

{
  id: 21,
  title: "第21話：境界に入る",
  unlockMin: 6300,
  canShift: false,
  body:
`境界樹林は、地図よりも広かった。
正確には、広く感じる。

霧のせいで距離が測れない。
近い木は遠く見え、遠い影はすぐそこにあるように思える。

ここは、昔は国境だったらしい。
線は消えたが、森だけが残った。

わたしたちは、知らないうちにその中へ入っていた。

「足跡、残りやすい」

彼が短く言う。
地面は湿っていて、柔らかい。

速く行けば、追われる。
慎重に行けば、時間を失う。

境界樹林は、最初から選択を迫ってくる。`,
  choices: [
    { text: "足跡を意識して進む" },
    { text: "速度を落とす" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼はわたしの歩幅に合わせ、先に踏み跡を崩した。" },
  ],
},

{
  id: 22,
  title: "第22話：足音の森",
  unlockMin: 6600,
  canShift: false,
  body:
`この森では、音が奇妙だ。
吸われる音と、やけに響く音がある。

わたしが一歩踏み出すと、
彼は同じ間隔で足を置いた。

足音が、ひとつになる。

「揃えると、追われにくい」

それだけ言って、彼は前を見る。

境界樹林では、
一人でいる方が目立つ。

二人分の音を、一つにする。
それが、ここでの進み方だった。`,
  choices: [
    { text: "歩調を揃える" },
    { text: "距離を少し取る" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は音が割れない距離を保ち続けた。" },
  ],
},

{
  id: 23,
  title: "第23話：境界の証言者",
  unlockMin: 6900,
  canShift: false,
  body:
`焚き火を見た。
この森で、火は目立つ。

近づくと、老人が一人座っていた。
逃げてきた人間の身なりじゃない。

「通るのか」

わたしは頷く。

「ここは、線が消えたあとも残った場所だ」
「国は去ったが、越える理由は残った」

わたしは一つだけ聞く。
「危険は、どこに」

老人は少し笑った。
「速さだ。急いだやつほど、何かを落とす」

それ以上、話さなかった。

少し歩いてから、わたしは彼にだけ言った。

「……落とさない判断を、したい」

彼は答えず、立つ位置を変えた。`,
  choices: [
    { text: "痕跡を消す進み方を選ぶ" },
    { text: "遠回りを選ぶ" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は先に動き、痕跡を踏み崩していった。" },
  ],
},

{
  id: 24,
  title: "第24話：判断を誤った人",
  unlockMin: 7200,
  canShift: false,
  body:
`足跡が乱れていた。
一直線だったものが、途中で崩れている。

倒木の陰に、人がいた。
外套は裂け、片足を引きずっている。

「速く行けば、助かると思った」

男は笑った。
「切り捨てた方が楽だと思った」

誰を、とは聞かなかった。

境界樹林では、
落としたものの名前は聞かない。

わたしは頷き、地図を畳んだ。

同じ判断は、しない。
それだけが、はっきりした。`,
  choices: [
    { text: "距離を取って進む" },
    { text: "足跡を消して進む" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は乱れた足跡を避け、静かに先導した。" },
  ],
},

{
  id: 25,
  title: "第25話：体温の境界",
  unlockMin: 7500,
  canShift: false,
  body:
`夜、風が強まった。
境界樹林は、夜になると温度を奪う。

外套を引き寄せても、寒さが残る。

気配が近づいた。
目を開ける前に分かる。

彼は何も言わず、風上に立った。
わたしの外套の端を、踏む。

引かれないように。
はだけないように。

それだけのこと。

「……ありがとう」

小さく言ったのは、わたしの方だった。

彼は答えない。
ただ、動かなかった。`,
  choices: [
    { text: "そのまま眠る" },
    { text: "体勢を整える" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼はわたしが眠るまで、その場を動かなかった。" },
  ],
},
// ===== 第26話：境界樹林・決断回 =====

{
  id: 26,
  title: "第26話：境界を越える",
  unlockMin: 7800,
  canShift: false,
  body:
`境界樹林の端が、見え始めていた。
木の密度が変わり、霧が薄くなる。

ここを抜ければ、森は終わる。
同時に、隠れる場所も減る。

追手の気配は、まだ消えない。
足音は遠いが、確実に続いている。

道は二つあった。
一つは、森を抜けてすぐに街道へ出る道。
視界が開ける代わりに、見つかりやすい。

もう一つは、森を離れる前に谷へ下りる道。
遠回りだが、姿は隠せる。
ただし、疲労は大きい。

どちらも、安全ではない。

わたしは地図を広げなかった。
帳簿も開かない。

境界樹林で学んだことは、
数字が出せない判断も、引き受けるということだ。

「こっちだ」

声は、思ったより静かだった。

彼は、確認しない。
頷きもしない。

ただ、わたしが指した方向へ、
最初の一歩を踏み出した。

森の外から、風が吹き込む。
匂いが変わる。

境界樹林は、そこで終わった。`,
  choices: [
    { text: "谷へ下りる道を選ぶ" },
    { text: "街道へ出る道を選ぶ" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は振り返らず、わたしの選んだ道を前提に速度を整えた。" },
  ],
},
// ===== 第27話：開けた場所 =====

{
  id: 27,
  title: "第27話：開けた場所",
  unlockMin: 8100,
  canShift: false,
  body:
`森を抜けたはずなのに、足が止まった。

視界が開けている。
空が広く、音がそのまま届く。
境界樹林とは、まるで違う。

木々の代わりに、低い草地が続いている。
隠れる場所はない。
見ようと思えば、どこまでも見える。

それが、怖かった。

彼は少し前に立ち、周囲を見ている。
森の中より、距離を取っている。

追手の気配は、分からなくなった。
消えたのか、ただ遠くなったのか。
判断がつかない。

境界樹林では、迷いは霧に紛れた。
ここでは、迷いはそのまま残る。

「街道は、近い」

彼が言う。
事実だけを置く声だった。

わたしは頷いたが、すぐには進まなかった。
足元の土は乾いている。
足跡が、はっきり残る。

森に戻るという選択は、もうない。
戻れないからじゃない。
戻る理由が、なくなったからだ。

少し風が吹いた。
外套が揺れる。

彼は何も言わず、風上に立った。
それだけで、境界樹林とは違うと分かる。

ここからは、隠れるより、
**選び続ける場所**だ。

わたしは一歩、踏み出した。`,
  choices: [
    { text: "そのまま街道へ向かう" },
    { text: "一度だけ振り返る" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は開けた視界に合わせ、距離を取りながら先行した。" },
  ],
},

// ===== 第28話：街道に足を置く =====

{
  id: 28,
  title: "第28話：街道に足を置く",
  unlockMin: 8400,
  canShift: false,
  body:
`石畳に、足を置いた。

境界樹林を抜けてから、初めての硬さだった。
土でも、苔でもない。
踏めば、同じ音が返ってくる。

古い街道跡だ。
かつては、人と荷と金が通った道。

石は欠け、ところどころ崩れている。
それでも、道の形だけは残っていた。
続いているようで、途中から途切れている。

視界が長く伸びる。
見通しがいい分、隠れる場所は少ない。

楽そうに見える。
それが、少しだけ不安だった。

彼は横に立ち、少し距離を取っている。
森の中のように、先へ出ない。

足音が、はっきり響く。
消そうと思っても、消えない。

街道は、嘘をつけない場所だ。

遠くに、車輪の跡が見えた。
途中で、途切れている。

使われなくなった理由が、足元に残っている。

わたしは立ち止まり、周囲を見た。
彼は何も言わない。
判断を、待っている。

正しい道は、分かりやすい。
だからこそ、選んだことが見える。

わたしは、もう一度石畳を踏んだ。
街道を、使う。

今は、まだ。`,
  choices: [
    { text: "街道を進む" },
    { text: "周囲を確認してから進む" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼はわたしの歩調に合わせ、街道の縁を選んで歩いた。" },
  ],
},
// ===== 第29話：里程標を直す人 =====

{
  id: 29,
  title: "第29話：里程標を直す人",
  unlockMin: 8700,
  canShift: false,
  body:
`石畳の脇で、金属音がした。

壊れた里程標の前に、人がしゃがんでいる。
石に刻まれた数字を、黙々と合わせていた。
通る人はいない。
それでも、作業は丁寧だった。

「まだ、直すんですね」

わたしが言うと、その人は顔を上げずに答えた。
「距離は、変わらないからな」

刻み直した数字を、指でなぞる。
擦り減った跡が、何度も直されたことを示している。

「この街道は、もう使われていない」

確認のつもりで言う。
その人は頷いた。

「契約が変わった」
「関税も、通行証もな」
「通る理由が、なくなっただけだ」

わたしは一瞬、言葉を探す。
見つからなかった。

「それでも、続けるんですか」

その人は首を振った。
「続けてるんじゃない」
「やめてないだけだ」

彼は少し離れた場所に立っている。
会話に入らない。
ただ、こちらと街道を同時に見ていた。

「道はな」
里程標を叩き、まっすぐに直す。
「正しいかどうかじゃない」
「残すか、残さないかだ」

それ以上、その人は話さなかった。
工具を片付け、石の前から立ち上がる。

わたしは礼を言わず、地図を畳んだ。
立ち去る合図だ。

少し歩いてから、足を止める。
彼にだけ、短く言った。

「……やめない、という判断もある」

彼は答えない。
ただ、半歩後ろに位置を移した。`,
  choices: [
    { text: "街道を使い続ける" },
    { text: "街道の外を探る" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は判断が出るまで動かず、わたしの位置を基準に周囲を見張った。" },
  ],
},
// ===== 第30話：街道を外れる =====

{
  id: 30,
  title: "第30話：街道を外れる",
  unlockMin: 9000,
  canShift: false,
  body:
`街道は、進みやすかった。
石畳は割れているが、足を迷わせない。

だからこそ、見つかりやすい。

遠くで、音がした。
風に紛れているが、規則がある。
人の歩幅だ。

追手かどうかは、分からない。
だが、街道に立っていれば、
いずれ追いつかれる。

道の脇は荒れている。
石の間から草が伸び、
人が踏んだ跡は、ほとんどない。

楽な道と、負担の大きい道。
正しい道と、正しくないかもしれない道。

わたしは立ち止まった。

彼は、動かない。
視線も向けない。
判断が来るのを、待っている。

街道は、続いている。
続いているように見えるだけで、
もう誰も、使っていない。

わたしは、石畳から足を下ろした。
一歩だけ。

踏みしめると、草が倒れ、
土が柔らかく沈んだ。

「こっち」

短く言う。
理由は、言わない。

彼は頷かない。
確認もしない。

ただ、わたしの横を通り、
先に草を踏み分けた。

街道から外れた瞬間、
背中が、少しだけ重くなる。

正解を外した重さじゃない。
選んだ責任の重さだ。

それでも、足は止まらなかった。`,
  choices: [
    { text: "街道から完全に離れる" },
    { text: "しばらく並行して進む" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は振り返らず、街道を背にして進路を固定した。" },
  ],
},
// ===== 第31話：見える判断 =====

{
  id: 31,
  title: "第31話：見える判断",
  unlockMin: 9300,
  canShift: false,
  body:
`街道を外れてしばらく歩くと、視界が開けた。

低い丘の上だ。
遮るものがなく、風がそのまま届く。

遠くに、海が見えた。
正確には、光の帯だ。
空と地平の境で、色だけが違っている。

あの向こうに、港がある。
人が集まり、金が回り、契約が生きている場所。

街道を行けば、いずれ辿り着けただろう。
正しい道を、正しく進めば。

わたしは足を止めた。
見える世界は、選ばなかった可能性も一緒に見せてくる。

彼は少し離れた場所に立っている。
前でも、後ろでもない。
視界の端に、確かにいる位置だ。

追手の姿はない。
だが、ここでは隠れられない。

見えるということは、
判断が誰かの目に触れるということだ。

それでも、視線は逸らさなかった。

海から風が吹く。
外套が揺れる。

彼は一瞬だけこちらを見て、
すぐに前を向いた。

問いは、もう外にない。
残っているのは、
わたしが何を引き受けるかだけだ。

わたしは丘を下りた。
見える世界から、逃げるようにではなく。`,
  choices: [
    { text: "視界の外へ進む" },
    { text: "高台を回り込む" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は距離を保ち、わたしの視界から外れない位置を選んだ。" },
  ],
},
// ===== 第32話：続けるという選択 =====

{
  id: 32,
  title: "第32話：続けるという選択",
  unlockMin: 9600,
  canShift: false,
  body:
`街道の石畳は、もう見えなくなっていた。

振り返れば、辿れないことはない。
だが、戻る理由もなかった。

足元は不揃いで、歩きにくい。
正しい道を外れるというのは、こういうことだ。
楽ではないし、保証もない。

それでも、不思議と迷いはなかった。

境界樹林では、落とさない判断を学んだ。
街道では、正しい道を外れる判断を選んだ。

ここでは、
続けるか、やめるか、でもない。

ただ、
**続けてしまう**という選択がある。

彼は半歩後ろにいる。
近づきすぎず、離れすぎず。

わたしが立ち止まれば、止まる。
進めば、同じ速度で歩く。

それだけで十分だった。

空は広く、風は強い。
隠れる場所は、もう少ない。

でも、選ぶ場所は、増えている。

わたしは歩く。
逃げているからでも、
正しさを求めているからでもない。

選び続けると、決めたからだ。`,
  choices: [
    { text: "進み続ける" },
    { text: "足元を確かめながら進む" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼はわたしの歩幅に合わせ、半歩後ろを保ち続けた。" },
  ],
},
// ===== 第33話：風の止まらない場所 =====

{
  id: 33,
  title: "第33話：風の止まらない場所",
  unlockMin: 9900,
  canShift: false,
  body:
`高地に出ると、風が止まらなかった。

吹き上げるというより、流れている。
一定で、逃げ場がない。

足元は岩と短い草。
隠れるには低く、立ち止まるには不安定だ。
境界樹林のように、霧は助けてくれない。

遠くに海がある。
光の面が、角度を変えるたびに揺れた。
港の灯りは、まだ夜のものだ。

ここは、見られる場所だ。
声は届かなくても、姿は届く。

わたしは歩きながら決める。
止まらない。
理由は言わない。
視線も避けない。

彼は視界の端にいる。
前でも後ろでもない。
同じ風を受ける位置だ。

高地には、人の痕跡が点在している。
踏み固められた草。
石に残る、短い待機の跡。
ここで誰かが、何かを待っていた。

追手の気配は、分からない。
消えたのか、見えにくくなったのか。
判断は、外に出た分だけ難しくなる。

それでも、足は止めなかった。

風が強まる。
外套が鳴る。

彼は一歩だけ距離を変えた。
風上だ。
言葉はない。

ここからは、
隠すより、見せて選ぶ。

わたしは高地を進む。`,
  choices: [
    { text: "風下を避けて進む" },
    { text: "視界を優先して進む" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は風向きに合わせて位置を調整し、視界の端を保った。" },
  ],
},
// ===== 第34話：風に触れる =====

{
  id: 34,
  title: "第34話：風に触れる",
  unlockMin: 10200,
  canShift: false,
  body:
`風は、一定だと思っていた。

高地では、それが一番の誤解だった。
流れているだけで、止まらないわけじゃない。
向きが変わる。

足元の岩が、鳴った。
乾いた音で、わずかに滑る。

突風が来る。
予告はない。

身体が傾いた、その瞬間、
手首に力がかかった。

引かれるというより、止められた。
強くも、長くもない。

すぐに離れる。
指の感触が残る前に。

何も言わない。
謝罪も、確認もない。

風が抜ける。
外套が落ち着く。

距離が、少しだけ変わっていた。
近づいたわけじゃない。
位置が、整理された。

彼は風上に立っている。
さっきと同じようで、同じじゃない。

わたしは歩き出す。
止まらない。

足音が、また二つになる。
重ならない。
でも、離れすぎない。

高地の風は、まだ続いている。`,
  choices: [
    { text: "風向きを読んで進む" },
    { text: "足場を優先して進む" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は距離を詰めず、風上の位置だけを維持した。" },
  ],
},
// ===== 第35話：人の気配 =====

{
  id: 35,
  title: "第35話：人の気配",
  unlockMin: 10500,
  canShift: false,
  body:
`風の向こうに、音が混じり始めた。

規則のない音だ。
足音でも、獣でもない。
人の動きが、風に削られて届いている。

高地には、誰もいないはずだった。
それでも、痕跡はある。

踏み固められた草。
同じ向きに並んだ石。
短時間だけ、誰かが留まった跡。

ここは、通過点だ。
集まる場所じゃない。
だから、信用も溜まらない。

わたしは歩調を落とさない。
止まれば、見られる。

彼は、さっきより少し近い。
触れない距離。
でも、風の流れは共有している。

遠くに、人影が一つ見えた。
こちらを見ているかどうかは、分からない。
分からない、ということが一番厄介だ。

高地では、
見られていなくても、
見られる前提で選ぶ。

わたしは進路を変えなかった。
避ける理由も、
寄る理由もない。

彼は一瞬、視線だけを送る。
確認じゃない。
共有だ。

人影は、やがて風に紛れた。
残ったのは、気配だけ。

それで十分だった。

ここから先は、
判断が、誰かの利害に触れ始める。

わたしは、そのまま高地を進んだ。`,
  choices: [
    { text: "距離を保ったまま進む" },
    { text: "視界を切る位置へ移動する" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は人影の消えた方向を一度だけ確認し、何事もなかったように歩いた。" },
  ],
},
// ===== 第36話：灯りの幅 =====

{
  id: 36,
  title: "第36話：灯りの幅",
  unlockMin: 10800,
  canShift: false,
  body:
`夜になると、高地は狭くなる。

昼は遠くまで見えた視界が、
暗さで切り取られる。
残るのは、灯りと影だけだ。

港の灯が、点で浮かんでいる。
近いようで、まだ遠い。
数が多いほど、近づいてはいけない場所だと分かる。

わたしは灯りを避ける幅を選ぶ。
広すぎると迷う。
狭すぎると、見られる。

歩幅を調整する。
止まらない。

風が弱まり、音が戻る。
足音が、はっきり二つ。

暗がりで、距離感が狂う。
同時に立ち止まり、同時に動く。
どちらも合図を出していない。

肩が、軽く触れた。

避けようと思えば、避けられた。
でも、避けなかった。

触れたのは一瞬だ。
押すでも、引くでもない。
位置を確かめるような近さ。

何も言わない。
理由も、確認もない。

灯りの配置が変わる。
進める幅が、少しだけ狭まった。

彼は半歩ずらし、風下に回る。
わたしの影が、そちらへ落ちる。

夜の高地では、
距離は測るものじゃない。
合わせるものだ。

わたしは進む。
灯りの外側を、選び続ける。`,
  choices: [
    { text: "灯りの外を保って進む" },
    { text: "影を使って進む" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は肩が触れない距離を保ちつつ、同じ幅で進んだ。" },
  ],
},
// ===== 第37話：値段のつかない情報 =====

{
  id: 37,
  title: "第37話：値段のつかない情報",
  unlockMin: 11100,
  canShift: false,
  body:
`風下で、人が待っていた。

一人だ。
岩に腰を下ろし、港の灯りを見ている。
こちらに気づいても、逃げない。

「通るのか」

先に声を出したのは、向こうだった。
わたしは頷く。

「この時間帯は、灯りが増える」
「港は静かだが、道は静かじゃない」

情報だ。
売るつもりでも、親切でもない。
ただ、置いているだけ。

わたしは一つだけ聞く。
「追われていますか」

その人は肩をすくめた。
「追う側が忙しいだけだ」
「今はな」

曖昧な答えだった。
でも、嘘ではない。

彼は少し離れた位置に立っている。
会話に入らない。
視線だけで、周囲を見ている。

「港へ行くなら、朝だ」
「夜は、見られる」

助言とも、警告ともつかない。
値段も、条件もつかない。

わたしは地図を出さない。
理由も言わない。

「ありがとう」

それだけ言って、歩き出す。
立ち止まらない。

後ろで、声がした。
「ここは、戻る場所じゃない」

振り返らない。
確認もしない。

彼が、半歩後ろに戻る。
距離は、夜のままだ。

高地では、
情報は拾うものだ。
信じるものじゃない。

わたしは進む。`,
  choices: [
    { text: "灯りの外を進む" },
    { text: "夜明けまで待たずに進む" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は会話が終わるまで距離を保ち、歩き出すと同時に位置を戻した。" },
  ],
},

// ===== 第38話：使われる情報 =====

{
  id: 38,
  title: "第38話：使われる情報",
  unlockMin: 11400,
  canShift: false,
  body:
`夜明け前、風の向きが変わった。

灯りはまだ残っているが、
数が減っている。
港が動き始める合図だ。

昨夜の言葉が、頭に残っている。
助言でも、忠告でもない。
置かれていただけの情報。

わたしは足を止めない。
進みながら、幅を変える。

灯りから距離を取る。
完全に外れない。
見えるが、目立たない位置。

彼は半歩後ろ。
夜の配置のままだ。

前方に、人影が二つ見えた。
こちらに気づいていない。
声も、足音もない。

わたしは進路を少しだけずらす。
避けすぎない。
寄りすぎない。

彼は何も言わず、
わたしの角度に合わせて位置を変えた。

人影は、そのまま灯りの方へ下りていく。
交差しない。
交差しないまま、離れる。

情報は、正解じゃない。
使い方で、結果が変わる。

高地では、
判断は目立たないほど、いい。

わたしは進む。
朝の幅を、選びながら。`,
  choices: [
    { text: "灯りと距離を保って進む" },
    { text: "風向きを優先して進む" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼はわたしの進路変更に合わせ、無音で位置を修正した。" },
  ],
},
// ===== 第39話：港町の縁 =====

{
  id: 39,
  title: "第39話：港町の縁",
  unlockMin: 11700,
  canShift: false,
  body:
`港町の縁は、思ったより騒がしくなかった。

人はいる。
でも、誰も立ち止まらない。
それぞれが、自分の用事だけを抱えている。

倉庫の壁に、作業灯が下がっている。
光は弱く、影が多い。
夜明け前の時間帯だ。

網の匂い、濡れた木材、油。
海の近さが、判断を急かす。

高地では、見られる前提だった。
ここでは、見られない方が不自然だ。

わたしは歩調を落としすぎない。
速くも、遅くもない。
周囲と同じ速度を選ぶ。

彼は横にいる。
視線は合わせない。
でも、距離は崩れない。

荷車が通る。
自然に、同時に道を譲る。

誰にも声をかけられない。
それでいい。

港町の縁では、
隠れる判断は、逆に浮く。

紛れるというのは、
消えることじゃない。
同じ動きを選ぶことだ。

わたしは倉庫の影に入り、
すぐに出た。
立ち止まらない。

彼も同じ動きをする。
確認はいらない。

ここからは、
人の生活の中を通る。

わたしは港町の縁を進む。`,
  choices: [
    { text: "人の流れに合わせて進む" },
    { text: "倉庫沿いを選んで進む" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は周囲の動きに同調し、わたしと同じ速度を保った。" },
  ],
},
// ===== 第40話：声をかけられる =====

{
  id: 40,
  title: "第40話：声をかけられる",
  unlockMin: 12000,
  canShift: false,
  body:
`倉庫の前で、声が飛んできた。

「手、空いてるか」

問いというより、確認だった。
断られる前提でも、期待でもない。

わたしは歩みを止めない。
立ち止まると、話が長くなる。

「今は、通るだけです」

理由は言わない。
事情も足さない。

声の主は、こちらを一度見て、すぐに視線を外した。
判断が早い。
ここでは、それが礼儀だ。

「そうか」

それだけで終わる。
仕事は流れ、言葉は残らない。

彼は横にいる。
視線も、歩幅も、同じまま。
会話に入らない。
入る必要がない。

荷車が近づく。
同時に道を譲る。
同時に戻る。

港町の縁では、
断ることも、目立たないようにやる。

受けない判断は、
拒否じゃない。
**生活に入らない選択**だ。

わたしは歩き続ける。
人の声が、また別の方向へ流れていく。`,
  choices: [
    { text: "人の流れを優先して進む" },
    { text: "倉庫の影を使って進む" },
  ],
  diffs: [
    { when: (st)=> st.trust >= 1, text: "彼は会話が終わるまで同じ速度を保ち、そのまま並んで歩いた。" },
  ],
},

];


const KEY = "studyAdventure.v2";
// ==================

const $ = (id) => document.getElementById(id);

const els = {
  todayMin: $("todayMin"),
  totalMin: $("totalMin"),
  streak: $("streak"),
  km: $("km"),
  toNext: $("toNext"),
  toNextStory: $("toNextStory"),
  bar: $("bar"),
  areaBadge: $("areaBadge"),
  logList: $("logList"),
  timerHint: $("timerHint"),

  storyBadge: $("storyBadge"),
  storyList: $("storyList"),

  startBtn: $("startBtn"),
  stopBtn: $("stopBtn"),
  addBtn: $("addBtn"),
  resetTodayBtn: $("resetTodayBtn"),
  resetAllBtn: $("resetAllBtn"),

  addDialog: $("addDialog"),
  addHours: $("addHours"),
  addMins: $("addMins"),
  addMemo: $("addMemo"),

  saveAddBtn: $("saveAddBtn"),

  unlockDialog: $("unlockDialog"),
  unlockText: $("unlockText"),
  closeUnlockBtn: $("closeUnlockBtn"),

  storyDialog: $("storyDialog"),
  storyTitle: $("storyTitle"),
  storyMeta: $("storyMeta"),
  storyBody: $("storyBody"),
  closeStoryBtn: $("closeStoryBtn"),
  markReadBtn: $("markReadBtn"),

  choiceBox: $("choiceBox"),
};

function makeAreaName(idx){
  // 1エリア=10時間想定。20エリアごとに章を切り替え（好みで変更OK）
  const chapterIndex = Math.floor((idx - 1) / 20) % AREA_NAME_POOLS.length;
  const pool = AREA_NAME_POOLS[chapterIndex];

  // 章の中での位置（繰り返しても偏りにくいように）
  const k = (idx - 1) % 20;

  // 3パターンをローテ（飽きにくい）
  const light = pool.light[(k) % pool.light.length];
  const terrain = pool.terrain[(k * 2) % pool.terrain.length];
  const acct = pool.acct[(k * 3) % pool.acct.length];
  const flavor = pool.flavor[(k * 5) % pool.flavor.length];

  // 表記ゆらぎを抑えるために型を固定
  const pattern = k % 3;
  if(pattern === 0) return `${light}の${terrain}`;
  if(pattern === 1) return `${acct}の${terrain}`;
  return `${flavor}の${terrain}`;
}

function formatHM(totalMinutes, opts = { padMin:true, showZeroHour:true }) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  const hh = String(h);
  const mm = String(m).padStart(2, "0");

  // showZeroHour=true なら 0時間05分 も出せる
  if (h === 0 && !opts.showZeroHour) return `${m}分`;
  return `${hh}時間${mm}分`;
}

// 入力（時/分）→ 分
function hmToMinutes(h, m){
  const hh = Number(h) || 0;
  const mm = Number(m) || 0;
  return hh * 60 + mm;
}

function todayKey(d = new Date()){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
function nowTimeStr(){
  const d = new Date();
  const hh = String(d.getHours()).padStart(2,"0");
  const mm = String(d.getMinutes()).padStart(2,"0");
  return `${hh}:${mm}`;
}

function defaultState(){
  return {
    sessions: [],
    timer: { running:false, startTs:null },
    lastStudyDate: null,
    streak: 0,
    readStories: {},
    // ★ここから新仕様
    trust: 0,
    loyalty: 0,
    awareness: 0,
    storyChoices: {}, // { [storyId]: choiceIndex }
  };
}

function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return defaultState();
    const data = JSON.parse(raw);
    return { ...defaultState(), ...data };
  }catch{
    return defaultState();
  }
}
function save(state){
  localStorage.setItem(KEY, JSON.stringify(state));
}

function sumMinutes(state, date=null){
  if(date){
    return state.sessions.filter(s => s.date === date).reduce((a,s)=>a+s.minutes,0);
  }
  return state.sessions.reduce((a,s)=>a+s.minutes,0);
}

function computeArea(totalMin){
  const idx = Math.floor(totalMin / AREA_STEP_MIN) + 1;
  const inThisArea = totalMin % AREA_STEP_MIN;
  const ratio = inThisArea / AREA_STEP_MIN;
  const toNext = (inThisArea === 0) ? 0 : (AREA_STEP_MIN - inThisArea);

  const area = AREAS[idx - 1] || { id: idx, name: makeAreaName(idx) };

  return { idx, ratio, toNext, area };
}

function updateStreak(state, studyDate){
  const prev = state.lastStudyDate;
  if(!prev){
    state.streak = 1;
    state.lastStudyDate = studyDate;
    return;
  }
  if(prev === studyDate) return;

  const prevD = new Date(prev + "T00:00:00");
  const curD  = new Date(studyDate + "T00:00:00");
  const diffDays = Math.round((curD - prevD) / (1000*60*60*24));

  if(diffDays === 1) state.streak += 1;
  else state.streak = 1;

  state.lastStudyDate = studyDate;
}

function unlockedStories(totalMin){
  return STORIES.filter(s => totalMin >= s.unlockMin);
}

function nextStoryInfo(totalMin){
  const next = STORIES.find(s => totalMin < s.unlockMin);
  if(!next) return { toNext: 0, nextId: null };
  return { toNext: next.unlockMin - totalMin, nextId: next.id };
}

function renderTabs(){
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const tab = btn.dataset.tab;
      document.querySelectorAll(".tabPanel").forEach(p => p.classList.add("hidden"));
      document.getElementById(`tab-${tab}`).classList.remove("hidden");
    });
  });
}

function renderLogs(state){
  const tKey = todayKey();
  const todaySessions = state.sessions.filter(s => s.date === tKey).slice().reverse();

  els.logList.innerHTML = "";
  if(todaySessions.length === 0){
    const empty = document.createElement("div");
    empty.className = "hint";
    empty.textContent = "今日のログはまだありません";
    els.logList.appendChild(empty);
    return;
  }

  for(const s of todaySessions){
    const item = document.createElement("div");
    item.className = "logItem";

    const left = document.createElement("div");
    left.className = "logLeft";

    const m = document.createElement("div");
    m.className = "logMin";
    m.textContent = formatHM(s.minutes);

    const memo = document.createElement("div");
    memo.className = "logMemo";
    memo.textContent = s.memo ? s.memo : "（メモなし）";

    left.appendChild(m);
    left.appendChild(memo);

    const time = document.createElement("div");
    time.className = "logTime";
    time.textContent = s.time;

    item.appendChild(left);
    item.appendChild(time);
    els.logList.appendChild(item);
  }
}

function renderStories(state, totalMin){
  const unlocked = unlockedStories(totalMin);
  const unlockedCount = unlocked.length;

  const readCount = unlocked.filter(s => state.readStories[String(s.id)]).length;
  els.storyBadge.textContent = `Unlocked ${unlockedCount} / Read ${readCount}`;

  els.storyList.innerHTML = "";

  for(const s of STORIES){
    const isUnlocked = totalMin >= s.unlockMin;
    const isRead = !!state.readStories[String(s.id)];

    const item = document.createElement("div");
    item.className = "storyItem";

    const left = document.createElement("div");
    left.className = "storyLeft";

    const name = document.createElement("div");
    name.className = "storyName";
    name.textContent = s.title;

    const req = document.createElement("div");
    req.className = "storyReq";
    req.textContent = `解放条件：累計 ${formatHM(s.unlockMin)}`;

    left.appendChild(name);
    left.appendChild(req);

    const pill = document.createElement("div");
    pill.className = "pill";

    if(!isUnlocked){
      pill.classList.add("lock");
      pill.textContent = "Locked";
    }else if(isRead){
      pill.classList.add("read");
      pill.textContent = "Read";
    }else{
      pill.classList.add("ok");
      pill.textContent = "Open";
    }

    item.appendChild(left);
    item.appendChild(pill);

    // クリックで開く（解放済みのみ）
    if(isUnlocked){
      item.style.cursor = "pointer";
      item.addEventListener("click", () => openStory(state, s, totalMin));
    }else{
      item.style.opacity = "0.75";
    }

    els.storyList.appendChild(item);
  }
}

let currentStoryId = null;

function openStory(state, story, totalMin){
  currentStoryId = story.id;

  let text = story.body;

  // ★1文差分（条件に当たったものを最大1つだけ足す）
  if(Array.isArray(story.diffs)){
    const hit = story.diffs.find(d => typeof d.when === "function" && d.when(state));
    if(hit && hit.text) text += "\n\n" + hit.text;
  }

  els.storyTitle.textContent = story.title;
  els.storyMeta.textContent = `累計 ${formatHM(totalMin)} / T${state.trust} L${state.loyalty} A${state.awareness}`;
  els.storyBody.textContent = text;

  const isRead = !!state.readStories[String(story.id)];
  els.markReadBtn.textContent = isRead ? "読了を解除" : "読了にする";

  // 選択肢
  els.choiceBox.innerHTML = "";
  if(Array.isArray(story.choices) && story.choices.length > 0){
    const picked = state.storyChoices[String(story.id)];
    const note = document.createElement("div");
    note.className = "choiceNote";
    note.textContent = (picked == null)
      ? "選択肢：ひとつ選ぶ（あとで変えられない）"
      : "選択済み（変更不可）";
    els.choiceBox.appendChild(note);

    story.choices.forEach((c, idx) => {
      const btn = document.createElement("button");
      btn.className = "choiceBtn";
      btn.type = "button";
      btn.textContent = c.text;

      if(picked != null){
        btn.disabled = true;
        if(picked === idx) btn.textContent = "✓ " + btn.textContent;
      }else{
        btn.addEventListener("click", () => applyChoice(state, story, idx));
      }
      els.choiceBox.appendChild(btn);
    });
  }

  els.storyDialog.showModal();
}

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function applyChoice(state, story, choiceIndex){
  const key = String(story.id);
  if(state.storyChoices[key] != null) return; // 変更不可

  state.storyChoices[key] = choiceIndex;

  // ===== 超ゆっくり仕様 =====
  // 1) その話が「成長する話」じゃないなら、数値は動かない
  //    story.canShift === true のときだけ、動く可能性がある
  const canShift = story.canShift === true;

  if(canShift){
    const choice = story.choices?.[choiceIndex];

    // 2) ほとんど+0。動くとしても+1だけ。
    //    choice.shift が {trust:+1} みたいに入ってるときだけ動く
    if(choice && choice.shift){
      if(choice.shift.trust)   state.trust   += choice.shift.trust;
      if(choice.shift.loyalty) state.loyalty += choice.shift.loyalty;
      if(choice.shift.awareness) state.awareness += choice.shift.awareness;
    }
  }

  // 3) 上限（暴走防止）
  state.trust = clamp(state.trust, 0, 999);
  state.loyalty = clamp(state.loyalty, 0, 999);
  state.awareness = clamp(state.awareness, 0, 999);

  save(state);

  // 表示更新
  const totalMin = sumMinutes(state);
  openStory(state, story, totalMin);
  render(state);
}

function render(state){
  const tKey = todayKey();
  const todayMin = sumMinutes(state, tKey);
  const totalMin = sumMinutes(state);

  els.todayMin.textContent = formatHM(todayMin);
  els.totalMin.textContent = formatHM(totalMin);
  els.streak.textContent = state.streak;

  const totalKm = totalMin * KM_PER_MIN;
  els.km.textContent = totalKm.toFixed(1);

  const { idx, ratio, toNext, area } = computeArea(totalMin);
  els.areaBadge.textContent = area.name;

  els.toNext.textContent = formatHM(toNext);

  const ns = nextStoryInfo(totalMin);
  els.toNextStory.textContent = formatHM(ns.toNext);

  els.bar.style.width = `${Math.max(0, Math.min(100, ratio*100))}%`;

  renderLogs(state);
  renderStories(state, totalMin);

  if(state.timer.running && state.timer.startTs){
    els.timerHint.textContent = "計測中…";
    els.startBtn.disabled = true;
    els.stopBtn.disabled = false;
  }else{
    els.timerHint.textContent = "未計測";
    els.startBtn.disabled = false;
    els.stopBtn.disabled = true;
  }
}

function addSession(state, minutes, memo){
  const date = todayKey();
  const time = nowTimeStr();

  const totalBefore = sumMinutes(state);
  const unlockedBefore = unlockedStories(totalBefore).length;

  state.sessions.push({ date, minutes, memo: memo || "", time });
  updateStreak(state, date);

  const totalAfter = sumMinutes(state);
  const unlockedAfter = unlockedStories(totalAfter).length;

  save(state);
  render(state);

  // エリア演出（任意）
  const beforeArea = computeArea(totalBefore).idx;
  const afterArea = computeArea(totalAfter).idx;
  if(afterArea > beforeArea){
    els.unlockText.textContent = `Area ${afterArea} が解放されました。`;
    els.unlockDialog.showModal();
  }

  // ストーリー解放演出（ここは軽めに）
  if(unlockedAfter > unlockedBefore){
    const newly = STORIES[unlockedAfter - 1]; // 末尾に追加される前提
    els.unlockText.textContent = `ストーリー解放：${newly.title}`;
    els.unlockDialog.showModal();
  }
}

function msToMinutes(ms){
  return Math.max(1, Math.round(ms / 60000));
}

// ===== 起動 =====
let state = load();
renderTabs();
render(state);

// Start
els.startBtn.addEventListener("click", () => {
  state.timer.running = true;
  state.timer.startTs = Date.now();
  save(state);
  render(state);
});

// Stop
els.stopBtn.addEventListener("click", () => {
  if(!state.timer.running || !state.timer.startTs) return;

  const elapsedMs = Date.now() - state.timer.startTs;
  const minutes = msToMinutes(elapsedMs);

  state.timer.running = false;
  state.timer.startTs = null;

  save(state);
  render(state);

  addSession(state, minutes, "（タイマー計測）");
});

// 手入力
els.addBtn.addEventListener("click", () => {
  els.addHours.value = "";
  els.addMins.value = "";
  els.addMemo.value = "";
  els.addDialog.showModal();
});
els.saveAddBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const h = Number(els.addHours.value);
const m = Number(els.addMins.value);
const minutes = hmToMinutes(h, m);

if(!Number.isFinite(minutes) || minutes <= 0){
  els.addHours.focus();
  return;
}
if(m > 59){
  els.addMins.focus();
  return;
}

  const memo = els.addMemo.value.trim();
  els.addDialog.close();
  addSession(state, minutes, memo);
});

// 解放ダイアログ
els.closeUnlockBtn.addEventListener("click", () => {
  els.unlockDialog.close();
});

// ストーリー閉じる
els.closeStoryBtn.addEventListener("click", () => {
  els.storyDialog.close();
});

// 読了トグル
els.markReadBtn.addEventListener("click", () => {
  if(currentStoryId == null) return;
  const key = String(currentStoryId);
  state.readStories[key] = !state.readStories[key];
  save(state);
  render(state);
  // ボタン文言更新
  els.markReadBtn.textContent = state.readStories[key] ? "読了を解除" : "読了にする";
});

// 今日リセット
els.resetTodayBtn.addEventListener("click", () => {
  const tKey = todayKey();
  state.sessions = state.sessions.filter(s => s.date !== tKey);
  save(state);
  render(state);
});

// 全部リセット
els.resetAllBtn.addEventListener("click", () => {
  localStorage.removeItem(KEY);
  state = defaultState();
  render(state);
});
