// ====== 設定 ======
const AREA_STEP_MIN = 600;    // 600分(10h)ごとにエリア
const KM_PER_MIN = 0.01;      // 1分 = 0.01km

// ====== Supabase Auth 設定 ======
// Supabaseの Project Settings → API から取得して貼り付けてください
const SUPABASE_URL = \"https://zitbkitympccjrcmnmxa.supabase.co";
const SUPABASE_ANON_KEY = \"sb_publishable_A8WOzqnOfTymxV9X7h60mw_063YdJAQ";

// ユーザーごとに保存キーを分ける（ログイン後に上書きします）
let KEY = \"studyAdventure.v2:guest\";
let supa = null;

// ストーリー解放条件（累計分）
// 例：300分(5h)で1話、以後+300分ごと
const STORIES = [
  {
    id: 1,
    title: "第1話：帳簿と焚き火",
    unlockMin: 300,
    canShift: false, // ★この回は数値が動かない（履歴だけ残る）
    body:
`風は冷たく、山の影は早い。あなたは小さな焚き火の前で、革の帳簿を開いた。
この旅では、歩いた距離ではなく「積み上げた時間」が道標になる。

隊の補給係は言う。「物資は有限。配分を誤れば、明日が消える」
あなたは今日の勉強時間を、ページの端に静かに記す。数字は嘘をつかない。

火の向こう側に、銀の外套を羽織った護衛が立っていた。
彼は必要以上に近づかず、必要以上に目を逸らさない。
「記録するのか」それだけ。声は低く、刺さらない。

あなたが頷くと、彼は一瞬だけ口元をゆるめた。
その表情は、夜の山より短い。
旅は今夜、ようやく始まる。`,
    choices: [
      { text: "「手伝って」と言う（近づく）" },
      { text: "「大丈夫」と言う（距離を保つ）" },
    ],
    diffs: [
      { when: (st)=> st.trust >= 3, text: "あなたが記す手つきに、彼は何も言わず頷いた。" },
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

あなたは帳簿の余白に条件を書き出す。
「対価」「期限」「不履行の罰」――短い線で、未来を縛るために。
護衛は黙ってそれを見ている。あなたが迷うと、指先で一箇所だけ示した。
「成功報酬にするなら、成功の定義を決めろ」

その助言は正しい。腹立たしいほど。
あなたは印章を押す。蝋が赤く固まって、運命みたいに見える。

外へ出ると、雨が止んでいた。
彼が外套を少しだけ傾ける。あなたの肩に雨粒が落ちない角度。
気づいたふりをするか、しないか。あなたは迷う。`,
    choices: [
      { text: "「…ありがとう」と小さく言う（気づいていると伝える）" },
      { text: "何も言わずに歩く（平静を装う）" },
    ],
    diffs: [
      { when: (st)=> st.trust >= 4, text: "あなたが印章をしまうと、彼は迷わず出口へ先導した。" },
      { when: (st)=> st.loyalty >= 2, text: "雨上がりの足場で、彼はあなたの歩幅に合わせて速度を落とした。" },
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
あなたは息を整え、今日の分を歩く。

隊は二手に分かれる。偵察と補給。
誰をどこへ回すか。配分は感情で決められない。
あなたは帳簿の数字を見て、必要な方へ人を置く。
護衛は不満を言わない。ただ、あなたの判断を「受け入れる」目をする。

昼、岩陰で休むとき、彼が水を差し出した。
指が触れそうで触れない距離。
あなたは受け取って、すぐ飲むべきか、少しだけからかうべきか迷う。`,
    choices: [
      { text: "すぐ受け取って飲む（信頼を示す）" },
      { text: "「毒じゃない？」と冗談めかす（距離を試す）" },
    ],
    diffs: [
      { when: (st)=> st.trust >= 5, text: "あなたが決める前に、彼は既に次の安全な足場を選んでいた。" },
      { when: (st)=> st.loyalty >= 3, text: "休憩のあいだ、彼は無言であなたの背後を守った。" },
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
あなたは帳簿を閉じ、村の人に聞く。
何が足りないか。誰が困っているか。今、何を優先するか。
護衛はあなたの後ろに立ち、剣の柄に手を添えるだけで脅しになる。

あなたは物資を配る。全員に満足はない。
それでも、最悪を避ける配分はできる。

戻り道、彼が言った。「怖くなかったか」
あなたは答える前に、少しだけ息を吸う。
強がるか、正直に言うか。`,
    choices: [
      { text: "「怖かった。でもやるしかなかった」と言う（正直）", shift: { trust: +1 } }, // ★ここだけ+1
      { text: "「平気」と言う（強く見せる）", shift: {} }, // +0
    ],
    diffs: [
      { when: (st)=> st.trust >= 2, text: "彼はあなたの返事を聞いてから、短く「…了解」と言った。" },
      { when: (st)=> st.loyalty >= 3, text: "風が強い場所で、彼は自然にあなたの風上へ回った。" },
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
あなたは焚き火の前で、今日の学びを帳簿に写す。
数行のメモでも、積み上げれば地図になる。

護衛が隣に座る。いつもより近い。
彼はあなたの帳簿を見ず、炎だけを見ていた。
「お前は、なぜそこまで記録する」
声は静かで、答えを急がせない。

あなたは少し考える。
本当の理由を言うか、うまく言い換えるか。`,
    choices: [
      { text: "「進んだ証拠がほしい。自分を信じたい」と言う" },
      { text: "「癖みたいなもの」と軽く流す" },
    ],
    diffs: [
      { when: (st)=> st.trust >= 3, text: "彼は返事をしない。ただ、火に薪を足す手つきが丁寧だった。" },
      { when: (st)=> st.loyalty >= 4, text: "あなたが帳簿を閉じるまで、彼は席を立たなかった。" },
    ],
  },
];


let KEY = "studyAdventure.v2:guest";
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


  // auth
  appRoot: $("app"),
  authGate: $("authGate"),
  authEmail: $("authEmail"),
  authPassword: $("authPassword"),
  loginBtn: $("loginBtn"),
  signupBtn: $("signupBtn"),
  authMsg: $("authMsg"),
  userEmail: $("userEmail"),
  logoutBtn: $("logoutBtn"),
};

function formatHM(totalMinutes, opts = { padMin:false, showZeroHour:false }) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  const mm = opts.padMin ? String(m).padStart(2, "0") : String(m);

  if (h === 0 && !opts.showZeroHour) return `${m}分`;
  if (m === 0) return `${h}時間`;
  return `${h}時間${mm}分`;
}

// 例: 1時間05分 みたいにしたいとき用
function formatHM2(totalMinutes){
  return formatHM(totalMinutes, { padMin:true, showZeroHour:true });
}

// 入力（時/分）→ 分
function hmToMinutes(h, m){
  const hh = Number(h) || 0;
  const mm = Number(m) || 0;
  return hh * 60 + mm;
}

function formatHM(totalMinutes){
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  if(h === 0) return `${m}分`;
  if(m === 0) return `${h}時間`;
  return `${h}時間${m}分`;
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
  const toNext = AREA_STEP_MIN - inThisArea;
  return { idx, ratio, toNext };
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

  // 本文（甘さ差分）
  let text = story.body;
  if(story.sweetText && story.sweetIfAffectionAtLeast != null){
    if(state.affection >= story.sweetIfAffectionAtLeast){
      text += "\n\n" + story.sweetText;
    }
  }

  els.storyTitle.textContent = story.title;
  els.storyMeta.textContent = `累計 ${formatHM(totalMin)} / T${state.trust} L${state.loyalty} A${state.awareness}`;
${state.awareness}`;
  els.storyBody.textContent = text;

  // 読了ボタン
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
        if(picked === idx){
          btn.textContent = "✓ " + btn.textContent;
        }
      }else{
        btn.addEventListener("click", () => {
          applyChoice(state, story, idx);
        });
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

  const { idx, ratio, toNext } = computeArea(totalMin);
  els.areaBadge.textContent = `Area ${idx}`;
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



// ===== Auth helpers =====
function setAuthMessage(msg){
  if(els.authMsg) els.authMsg.textContent = msg || "";
}

function showAuth(msg=""){
  if(els.appRoot) els.appRoot.classList.add("hidden");
  if(els.authGate) els.authGate.classList.remove("hidden");
  if(els.logoutBtn) els.logoutBtn.classList.add("hidden");
  if(els.userEmail) els.userEmail.textContent = "";
  setAuthMessage(msg);
}

function showApp(user){
  if(els.authGate) els.authGate.classList.add("hidden");
  if(els.appRoot) els.appRoot.classList.remove("hidden");
  if(els.logoutBtn) els.logoutBtn.classList.remove("hidden");
  if(els.userEmail) els.userEmail.textContent = (user && user.email) ? user.email : "";
}

async function onSignedIn(user){
  KEY = `studyAdventure.v2:${user.id}`;
  state = load();
  showApp(user);
  render(state);
}


async function initAuth(){
  // SDKが読み込めないときは、従来通りローカルだけで動かす（開発用）
  if(!window.supabase || !window.supabase.createClient){
    console.warn("Supabase SDK not found. Running without auth.");
    KEY = "studyAdventure.v2:local";
    state = load();
    if(els.authGate) els.authGate.classList.add("hidden");
    if(els.appRoot) els.appRoot.classList.remove("hidden");
    render(state);
    return;
  }

  const { createClient } = window.supabase;
  supa = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  els.loginBtn && els.loginBtn.addEventListener("click", async ()=>{
    const email = (els.authEmail && els.authEmail.value ? els.authEmail.value : "").trim();
    const password = (els.authPassword && els.authPassword.value) ? els.authPassword.value : "";
    if(!email || !password){
      setAuthMessage("メールとパスワードを入力してください");
      return;
    }
    setAuthMessage("ログイン中…");
    const { data, error } = await supa.auth.signInWithPassword({ email, password });
    if(error){
      setAuthMessage(error.message);
      return;
    }
    if(data && data.user) await onSignedIn(data.user);
  });

  els.signupBtn && els.signupBtn.addEventListener("click", async ()=>{
    const email = (els.authEmail && els.authEmail.value ? els.authEmail.value : "").trim();
    const password = (els.authPassword && els.authPassword.value) ? els.authPassword.value : "";
    if(!email || !password){
      setAuthMessage("メールとパスワードを入力してください");
      return;
    }
    setAuthMessage("登録中…");
    const { data, error } = await supa.auth.signUp({ email, password });
    if(error){
      setAuthMessage(error.message);
      return;
    }
    setAuthMessage("登録しました。メール確認が必要な場合は、確認後にログインしてください。");
    // すぐにログインできる設定の場合は、状態変化で自動で入れます
  });

  els.logoutBtn && els.logoutBtn.addEventListener("click", async ()=>{
    if(!supa) return;
    await supa.auth.signOut();
    showAuth("ログアウトしました");
  });

  const { data } = await supa.auth.getSession();
  const session = data ? data.session : null;
  if(session && session.user){
    await onSignedIn(session.user);
  }else{
    showAuth("");
  }

  supa.auth.onAuthStateChange((_event, session2)=>{
    if(session2 && session2.user) onSignedIn(session2.user);
    else showAuth("");
  });
}


// ===== 起動 =====
let state = defaultState();
renderTabs();
initAuth();

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
