const $ = s => document.querySelector(s);
let locale = 'en';
let theme = 'light';
try { if (localStorage.getItem('inhale-glass-theme') === 'dark') theme = 'dark'; } catch {}
function applyTheme() { $('html').setAttribute('data-theme', theme); }
applyTheme();
try { if (localStorage.getItem('inhale-language') === 'uk') locale = 'uk'; } catch {}
const ukrainian = {
 'Theme':'Тема','Light':'Світла','Dark':'Темна',
 'Calming':'Заспокоєння','Inhale':'Вдих','Hold':'Затримка','Exhale':'Видих','Rest':'Відпочинок',
 'Breathe':'Дихання','Sessions':'Журнал','Settings':'Налаштування','Journal':'Журнал',
 'Begin practice':'Почати практику','Begin a practice':'Почати практику','Breathe again':'Дихати знову',
 'No hurry':'Не поспішайте','Calming practice':'Практика дихання','remaining in your practice':'до завершення практики',
 'Start':'Почати','Starting':'Початок','Ready to begin':'Готові почати','Resume':'Продовжити','Pause':'Пауза','End practice':'Завершити практику','+1 min':'+1 хв',
 'Your practice':'Ваша практика','Find your rhythm.':'Знайдіть свій ритм.',
 'A familiar cycle, at your own pace.':'Знайомий цикл у власному темпі.',
 'Session length':'Тривалість практики','Minutes · 1–30':'Хвилини · 1–30',
 'Seconds per unit':'Секунд на одиницю','1 : 2 : 1 : 2 · half-second steps':'1 : 2 : 1 : 2 · крок пів секунди',
 'Preparation':'Підготовка','Seconds · 0–30':'Секунди · 0–30','Language':'Мова',
 'Cancel':'Скасувати','Save rhythm':'Зберегти ритм',
 'Session length rounds up to a complete cycle. Preparation time is separate.':'Тривалість округлюється до повного циклу. Час підготовки враховується окремо.',
 'A fresh start.':'Новий початок.','Your completed practices will appear here.':'Тут з’являться завершені практики.',
 'Take your first breath':'Почати першу практику','No session yet.':'Практик ще немає.',
 'Finish a practice to see your own details.':'Завершіть практику, щоб побачити її деталі.',
 'Practice complete':'Практику завершено','Practice ended':'Практику закінчено','A moment for you.':'Мить для себе.',
 'Time practiced':'Час практики','Complete cycles':'Повні цикли','Breaths / min · rhythm':'Дихань / хв · ритм','Cycle length':'Тривалість циклу',
 'Session saved in this browser.':'Практику збережено в цьому браузері.',
 'Session kept for this visit; browser storage is unavailable.':'Практика доступна до закриття сторінки; сховище браузера недоступне.',
 'Paused':'Пауза','Settle in':'Підготовка','Continue when you’re ready.':'Продовжуйте, коли будете готові.',
 'Example from screenshot 8 · not saved to your sessions.':'Приклад зі знімка 8 · не збережено у ваш журнал.',
 'Use the displayed ranges and half-second steps.':'Дотримуйтеся вказаних меж та кроку пів секунди.',
 'Four phase breathing guide':'Чотири фази дихання','Session progress':'Прогрес практики'
};
const t = text => locale === 'uk' ? ukrainian[text] || text : text;
function localizeText(text) {
 if (locale !== 'uk') return text;
 const trimmed = text.trim();
 if (ukrainian[trimmed]) return text.replace(trimmed, ukrainian[trimmed]);
 return text.replace(/Calming · /g,'Заспокоєння · ').replace(/(\d+) min requested · full cycles/g,'$1 хв запитано · повні цикли').replace(/(\d+) seconds/g,'$1 с').replace(/complete cycles/g,'повних циклів').replace(/practiced/g,'практики').replace(/(\d+) cycles/g,'$1 циклів').replace(/(\d+(?:\.\d+)?)s/g,'$1 с');
}
function localizeMarkup(html) {
 return html.replace(/>([^<>]+)</g, (_,text) => `>${localizeText(text)}<`).replace(/aria-label="([^"]+)"/g,(_,label)=>`aria-label="${t(label)}"`);
}
const names = ['Inhale', 'Hold', 'Exhale', 'Hold'];
const ratio = [1, 2, 1, 2];
let settings = {minutes: 5, unit: 3, prep: 5};
let sessions = [];
let storageAvailable = true;
try { const saved = JSON.parse(localStorage.getItem('inhale-sessions') || '[]'); sessions = Array.isArray(saved) ? saved.filter(s => s && typeof s.id === 'number' && Number.isFinite(s.seconds) && Number.isFinite(s.unit) && Number.isFinite(s.cycles) && typeof s.date === 'string') : []; } catch { storageAvailable = false; }
let view = 'ready', running = false, stage = 'prepare', elapsed = 0, stageElapsed = 0, target = 306, last = 0, current = null, returnTo = 'ready';
const meta = {
 settings: ['Set your rhythm', 'OBSERVED · 9–10', 'The references expose duration, preparation and a 1:2:1:2 ratio with an editable time unit. This mockup rounds the requested duration up to a full breathing cycle.'],
 ready: ['Ready when you are', 'OBSERVED · 1', 'A calming preset and a breathing-path preview invite you to start. Settings return here before a new practice.'],
 prepare: ['Starting', 'OBSERVED · 2', 'Preparation runs on the same breathing screen. The chart control pauses or resumes; the phase blocks stay visible.'],
 practice: ['Follow your breath', 'OBSERVED · 3–7', 'A moving marker follows inhale, hold, exhale and hold on the same chart. Pause/resume and add-minute behavior are inferred from the visible controls.'],
 paused: ['Take your time', 'INFERRED STATE', 'The screenshots show a pause control, but no paused screen. This state freezes both the phase and session clock.'],
 summary: ['A moment, completed', 'PARTLY OBSERVED · 8', 'Session metrics come from screenshot 8. A dedicated completion screen and the transition after stopping are inferred.'],
 history: ['Your past moments', 'INFERRED NAVIGATION', 'A session-details view is visible in screenshot 8. A list leading to those details is inferred; no history list is shown.' ]
};
const escapeHtml = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clock = n => `${Math.floor(Math.max(0,n)/60)}:${String(Math.ceil(Math.max(0,n)%60)).padStart(2,'0')}`;
const cycleLength = () => settings.unit * 6;
const roundedTarget = () => Math.ceil(settings.minutes * 60 / cycleLength()) * cycleLength();
const rhythm = (value = settings.unit) => `<div class="rhythm">${names.map((n,i) => `<div><b>${+(value*ratio[i]).toFixed(1)}s</b>${n}</div>`).join('')}</div>`;
function previewSettings() {
 const unit = Number($('#unit').value), minutes = Number($('#minutes').value);
 const validUnit = Number.isFinite(unit) && unit >= 1 && unit <= 10 && Number.isInteger(unit*2);
 const validMinutes = Number.isInteger(minutes) && minutes >= 1 && minutes <= 30;
 $('#error').textContent = validUnit && validMinutes ? '' : t('Use the displayed ranges and half-second steps.');
 if (!validUnit || !validMinutes) { $('#rhythmPreview').innerHTML=''; $('#cyclePreview').textContent=''; return; }
 $('#rhythmPreview').innerHTML = localizeMarkup(rhythm(unit));
 const length = unit*6, cycles = Math.ceil(minutes*60/length), duration = cycles*length;
 $('#cyclePreview').textContent = locale === 'uk' ? `Цикл ${length} с · ${cycles} циклів · ${clock(duration)} практики` : `${length}s cycle · ${cycles} cycles · ${clock(duration)} practice`;
}
function guide() { return `<svg class="guide" viewBox="0 0 340 210" role="img" aria-label="Four phase breathing guide"><defs><linearGradient id="grad"><stop stop-color="#d9b9ff"/><stop offset="1" stop-color="#8960bd"/></linearGradient></defs><path class="track" d="M15 185 L75 25 L175 25 L235 185 L325 185"/><path id="lit" class="lit" d="M15 185 L75 25 L175 25 L235 185 L325 185"/><circle id="marker" cx="15" cy="185" r="9" fill="#dbbdff" stroke="#202125" stroke-width="3"/></svg>`; }
function start() { current = null; elapsed = 0; stageElapsed = 0; stage = settings.prep > 0 ? 'prepare' : 0; target = roundedTarget(); running = true; last = performance.now(); show(stage === 'prepare' ? 'prepare' : 'practice'); }
const isBreathingView = value => ['ready','prepare','practice','paused'].includes(value);
let breathingMounted = false;
function show(next) {
 const preserveBreathing = breathingMounted && isBreathingView(view) && isBreathingView(next);
 view = next;
 const info = meta[next];
 $('#stateTitle').textContent = info[0]; $('#evidence').textContent = info[1]; $('#stateNote').textContent = info[2];
 const busy = ['prepare','practice','paused'].includes(next);
 document.querySelectorAll('[data-nav]').forEach(b => { b.disabled = busy; b.classList.toggle('active', b.dataset.nav === next || b.dataset.nav === 'ready' && busy); });
 $('#steps').innerHTML = [['settings','Set your rhythm'],['ready','Breathing practice'],['summary','Session details'],['history','Past sessions']].map(([v,label],i) => `<button class="step ${next === v || v === 'ready' && isBreathingView(next) ? 'active' : ''}" data-jump="${v}"><span class="number">${i+1}</span><span>${label}<small>${meta[v][1].startsWith('INFERRED')?'Inferred':'Screenshot-based'}</small></span></button>`).join('');
 const screen = $('#screen');
 screen.setAttribute('lang', locale);
 if (isBreathingView(next) && !preserveBreathing) screen.innerHTML = `<div class="center breathing-screen"><h2>Calming</h2><div class="phase-status"><div class="phase" id="phase" role="status"></div><div class="count" id="phaseTime" aria-live="off"></div></div><div class="chart-player">${guide()}<svg id="pausedIndicator" class="paused-indicator" viewBox="0 0 24 24" aria-hidden="true" focusable="false" hidden><path d="M7 5 H10 V19 H7 Z M14 5 H17 V19 H14 Z"/></svg></div><div class="timer" id="remaining"></div><p class="subtitle">remaining in your practice</p><div class="progress" role="progressbar" aria-label="Session progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i id="progress"></i></div><p class="subtitle session-cycles" id="cycles"></p>${rhythm()}<div class="actions session-actions" id="sessionActions"><button id="add">+1 min</button><button id="chartToggle" class="transport-control" type="button" aria-label="Start"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path id="controlIcon" d="M8 5 L19 12 L8 19 Z"/></svg></button><button id="end" class="transport-control" type="button" aria-label="End practice"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6 H18 V18 H6 Z"/></svg></button></div></div>`;
 if (next === 'settings') screen.innerHTML = `<div class="eyebrow">Your practice</div><div class="spacer"></div><h2>Find your rhythm.</h2><p class="subtitle">A familiar cycle, at your own pace.</p><div id="rhythmPreview" aria-live="polite">${rhythm()}</div><p class="subtitle" id="cyclePreview" aria-live="polite"></p><form id="settingsForm"><div class="field preference-field"><span id="languageLabel">Language</span><div class="segmented" role="group" aria-labelledby="languageLabel"><label><input type="radio" name="language" value="en" ${locale === 'en' ? 'checked' : ''}><span>English</span></label><label><input type="radio" name="language" value="uk" ${locale === 'uk' ? 'checked' : ''}><span>Українська</span></label></div></div><div class="field preference-field"><span id="themeLabel">Theme</span><div class="segmented" role="group" aria-labelledby="themeLabel"><label><input type="radio" name="theme" value="light" ${theme === 'light' ? 'checked' : ''}><span>Light</span></label><label><input type="radio" name="theme" value="dark" ${theme === 'dark' ? 'checked' : ''}><span>Dark</span></label></div></div><div class="field"><label for="minutes">Session length<small>Minutes · 1–30</small></label><input id="minutes" type="number" min="1" max="30" step="1" value="${settings.minutes}" required></div><div class="field"><label for="unit">Seconds per unit<small>1 : 2 : 1 : 2 · half-second steps</small></label><input id="unit" type="number" min="1" max="10" step="0.5" value="${settings.unit}" required></div><div class="field"><label for="prep">Preparation<small>Seconds · 0–30</small></label><input id="prep" type="number" min="0" max="30" step="1" value="${settings.prep}" required></div><div class="error" id="error" role="alert"></div><div class="actions"><button type="button" id="cancelSettings">Cancel</button><button class="primary" type="submit">Save rhythm</button></div></form><div class="callout">Session length rounds up to a complete cycle. Preparation time is separate.</div>`;
 if (next === 'summary') renderSummary(screen);
 if (next === 'history') screen.innerHTML = `<h2>Journal</h2>${sessions.length ? sessions.slice().reverse().map(s => `<button class="session" data-session="${s.id}">Calming · ${clock(s.seconds)}<small>${escapeHtml(new Date(s.date).toLocaleString(locale === 'uk' ? 'uk-UA' : 'en-US'))} · ${s.cycles} cycles</small></button>`).join('') : '<div class="empty"><h3>A fresh start.</h3><p class="subtitle">Your completed practices will appear here.</p><div class="spacer"></div><button class="primary" data-nav="ready">Take your first breath</button></div>'}`;
 if (!preserveBreathing) screen.innerHTML = localizeMarkup(screen.innerHTML);
 breathingMounted = isBreathingView(next);
 document.querySelectorAll('[data-nav]').forEach(b => { const key = b.dataset.nav; b.innerHTML = `<span>${{ready:'◌',history:'◷',settings:'☷'}[key]}</span>${t({ready:'Breathe',history:'Sessions',settings:'Settings'}[key])}`; });
 if (next === 'settings') previewSettings();
 if (isBreathingView(next)) update();
}
function renderSummary(screen) {
 if (!current) { screen.innerHTML = '<div class="empty"><h2>No session yet.</h2><p class="subtitle">Finish a practice to see your own details.</p><div class="spacer"></div><button class="primary" data-nav="ready">Begin a practice</button></div>'; return; }
 screen.innerHTML = `<div class="center"><div class="check">✓</div><div class="eyebrow">${current.reason === 'finished' ? 'Practice complete' : 'Practice ended'}</div><div class="spacer"></div><h2>A moment for you.</h2><p class="subtitle">${escapeHtml(new Date(current.date).toLocaleString(locale === 'uk' ? 'uk-UA' : 'en-US'))}</p></div><div class="statgrid"><div><b>${clock(current.seconds)}</b><small>Time practiced</small></div><div><b>${current.cycles}</b><small>Complete cycles</small></div><div><b>${+(60/(current.unit*6)).toFixed(2)}</b><small>Breaths / min · rhythm</small></div><div><b>${+(current.unit*6).toFixed(1)}s</b><small>Cycle length</small></div></div><div class="actions"><button class="primary" id="again">Breathe again</button></div><p class="subtitle" id="saveStatus" role="status">${storageAvailable ? 'Session saved in this browser.' : 'Session kept for this visit; browser storage is unavailable.'}</p>`;
}
function persist() { try { localStorage.setItem('inhale-sessions',JSON.stringify(sessions)); storageAvailable = true; } catch { storageAvailable = false; } }
function finish(reason) {
 running = false;
 if (elapsed > 0) { current = {id:Date.now(), date:new Date().toISOString(),seconds:Math.floor(elapsed), cycles:Math.floor((elapsed+0.00001)/cycleLength()),unit:settings.unit,reason}; sessions.push(current); persist(); }
 else current = null;
 if (reason === 'stopped') { elapsed=0;stageElapsed=0;stage='prepare';target=roundedTarget();show('ready'); }
 else show(current ? 'summary' : 'ready');
}
function update() {
 const ready = view === 'ready', paused = view === 'paused';
 $('#phase').textContent = t(ready ? 'Ready to begin' : paused ? 'Paused' : stage === 'prepare' ? 'Starting' : names[stage]);
 $('#phaseTime').textContent = ready ? '\u00a0' : localizeText(paused ? 'Continue when you’re ready.' : `${Math.ceil((stage === 'prepare' ? settings.prep : settings.unit*ratio[stage])-stageElapsed)} seconds`);
 $('#remaining').textContent = clock(ready ? roundedTarget() : Math.ceil(target-elapsed));
 $('#cycles').textContent = ready ? '\u00a0' : localizeText(`${Math.floor((elapsed+.00001)/cycleLength())} complete cycles · ${clock(Math.floor(elapsed))} practiced`);
 $('#sessionActions').style.visibility = 'visible';
 $('#pausedIndicator').hidden = !paused;
 $('#add').disabled = ready; $('#end').disabled = ready;
 const control = ready ? 'Start' : paused ? 'Resume' : 'Pause';
 $('#chartToggle').setAttribute('aria-label', t(control));
 $('#chartToggle').setAttribute('title', t(control));
 $('#controlIcon').setAttribute('d', running ? 'M7 5 H10 V19 H7 Z M14 5 H17 V19 H14 Z' : 'M8 5 L19 12 L8 19 Z');
 document.querySelectorAll('.breathing-screen .rhythm > div').forEach((block,index) => {
 const active = !ready && stage !== 'prepare' && index === stage;
 block.classList.toggle('current-phase', active);
 if(active) block.setAttribute('aria-current','step'); else block.removeAttribute('aria-current');
 });
 const percent = ready ? 0 : Math.min(100,elapsed/target*100); $('#progress').style.width = `${percent}%`; $('.progress').setAttribute('aria-valuenow', Math.round(percent));
 const coords = [[15,185],[75,25],[175,25],[235,185],[325,185]];
 const i = ready || stage === 'prepare' ? 0 : stage;
 const fraction = ready || stage === 'prepare' ? 0 : Math.min(1,stageElapsed/(settings.unit*ratio[i]));
 const x = coords[i][0]+(coords[i+1][0]-coords[i][0])*fraction, y = coords[i][1]+(coords[i+1][1]-coords[i][1])*fraction;
 $('#marker').setAttribute('cx',x); $('#marker').setAttribute('cy',y);
 $('#lit').setAttribute('d',ready || stage === 'prepare' ? 'M15 185' : `M${coords.slice(0,i+1).map(c=>c.join(' ')).join(' L')} L${x} ${y}`);
}
function tick(now) {
 if (running) {
 let dt = Math.max(0,(now-last)/1000);
 while (dt > .000001 && running) {
 const duration = stage === 'prepare' ? settings.prep : settings.unit*ratio[stage];
 const step = Math.min(dt,duration-stageElapsed,stage === 'prepare' ? Infinity : target-elapsed);
 stageElapsed += step; if (stage !== 'prepare') elapsed += step; dt -= step;
 if (elapsed >= target-.000001) { elapsed=target; finish('finished'); break; }
 if (stageElapsed >= duration-.000001) { stageElapsed=0; stage=stage === 'prepare' ? 0 : (stage+1)%4; if(view === 'prepare') show('practice'); }
 }
 if(running) update();
 }
 last=now; requestAnimationFrame(tick);
}
function jump(v) {
 running = false;
 if(v === 'prepare') { start(); return; }
 if(v === 'practice') { elapsed=0;stageElapsed=0;stage=0;target=roundedTarget();current=null;running=true;last=performance.now();show('practice');return; }
 if(v === 'summary') { current = {id:0,date:new Date().toISOString(),seconds:36,cycles:2,unit:3,reason:'example'};show(v);$('#saveStatus').textContent=t('Example from screenshot 8 · not saved to your sessions.');return; }
 if(v === 'settings') returnTo='ready';
 show(v);
}
document.addEventListener('click', e => {
 const b=e.target.closest('button');if(!b || b.disabled)return;
 if(b.dataset.jump) { jump(b.dataset.jump); return; }
 if(b.dataset.nav) { if(running || view === 'paused')return; if(b.dataset.nav === 'settings')returnTo=view;show(b.dataset.nav);return; }
 if(b.dataset.session) { current=sessions.find(s=>s.id === +b.dataset.session);show('summary');return; }
 switch(b.id) {
 case 'start':case 'again':start();break;
 case 'chartToggle':if(view === 'ready'){start();break;}if(running){running=false;show('paused');}else{running=true;last=performance.now();show(stage === 'prepare'?'prepare':'practice');}break;
 case 'end':finish('stopped');break;
 case 'add':if(view !== 'ready'){target+=Math.ceil(60/cycleLength())*cycleLength();update();}break;
 case 'cancelSettings':show(returnTo);break;
 }
});
document.addEventListener('input',e=>{if(view === 'settings' && ['unit','minutes'].includes(e.target.id))previewSettings();});
document.addEventListener('change',e=>{
 if(e.target.name === 'theme' || e.target.id === 'theme') {
  if(!['light','dark'].includes(e.target.value))return;
  theme=e.target.value;applyTheme();
  try { localStorage.setItem('inhale-glass-theme',theme); } catch {}
  return;
 }
 if((e.target.name !== 'language' && e.target.id !== 'language') || !['en','uk'].includes(e.target.value))return;
 const draft = ['minutes','unit','prep'].map(id=>[id,$('#'+id).value]);
 locale=e.target.value;
 try { localStorage.setItem('inhale-language',locale); } catch {}
 show('settings');
 draft.forEach(([id,value])=>{$('#'+id).value=value;});
 previewSettings();
});
document.addEventListener('submit',e=>{ if(e.target.id !== 'settingsForm')return;e.preventDefault();const v={minutes:Number($('#minutes').value),unit:Number($('#unit').value),prep:Number($('#prep').value)};if(!Number.isFinite(v.unit)||!Number.isInteger(v.unit*2)||!Number.isInteger(v.minutes)||!Number.isInteger(v.prep)||v.minutes<1||v.minutes>30||v.unit<1||v.unit>10||v.prep<0||v.prep>30){$('#error').textContent=t('Use the displayed ranges and half-second steps.');return;}settings=v;show('ready');});
// Preserve the current phase when a hidden tab becomes visible again.
document.addEventListener('visibilitychange',()=>{if(document.hidden && running){running=false;show('paused');}});
$('#references').innerHTML=Array.from({length:10},(_,i)=>`<a href="../screens/${i+1}.jpeg" target="_blank" rel="noopener"><img src="../screens/${i+1}.jpeg" alt="Reference screenshot ${i+1}">${String(i+1).padStart(2,'0')}</a>`).join('');
show('ready');requestAnimationFrame(tick);
