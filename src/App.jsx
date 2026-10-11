import React, { useEffect, useMemo, useState } from "react";
import {
  Home, Dumbbell, TrendingUp, MessageCircle, LayoutGrid, ShieldAlert, HeartPulse, ChevronRight,
  Calculator, Calendar as CalendarIcon, User, BookOpen, Stethoscope, Users, LayoutDashboard, Settings,
} from "lucide-react";
import { C } from "./theme/tokens";
import { EXERCISES } from "./data/mockData";
import { loadPersistedState, savePersistedState, wipeAllPersistedData, exportDataSnapshot } from "./utils/security";
import { dateKey, buildPlan, computeStreak, computeBestStreak, computeAdherence } from "./utils/stats";
import { Modal, RedFlagsModal } from "./components/ui/SharedUI";
import { PhaseCard } from "./screens/Home";
import { OnboardingScreen } from "./screens/Onboarding";
import { HomeScreen } from "./screens/Home";
import { ExercisesScreen } from "./screens/Exercises";
import { GuidedSession } from "./screens/GuidedSession";
import { ProgressScreen } from "./screens/Progress";
import { AssistantScreen } from "./screens/Assistant";
import { CalendarScreen } from "./screens/Calendar";
import { ProfileScreen } from "./screens/Profile";
import { DoctorScreen } from "./screens/Doctor";
import { DoctorCabinetScreen } from "./screens/DoctorCabinet";
import { AdminPanelScreen } from "./screens/AdminPanel";
import { LibraryScreen, StoriesScreen } from "./screens/Library";
import { CalculatorsScreen } from "./screens/Calculators";

/** useState, который сохраняется в localStorage. */
function usePersisted(key, initial) {
  const [value, setValue] = useState(() => loadPersistedState(key, initial));
  useEffect(() => {
    savePersistedState(key, value);
  }, [key, value]);
  return [value, setValue];
}

const PRIMARY_TABS = [
  { key: "home", icon: Home, label: "Главная" },
  { key: "exercises", icon: Dumbbell, label: "Упражнения" },
  { key: "progress", icon: TrendingUp, label: "Прогресс" },
  { key: "assistant", icon: MessageCircle, label: "Помощник" },
];

const SIDEBAR = [
  {
    title: "Основное",
    items: [
      { key: "home", icon: LayoutDashboard, label: "Главная" },
      { key: "exercises", icon: Dumbbell, label: "Упражнения" },
      { key: "calendar", icon: CalendarIcon, label: "Календарь" },
      { key: "progress", icon: TrendingUp, label: "Прогресс" },
    ],
  },
  {
    title: "Инструменты",
    items: [
      { key: "assistant", icon: MessageCircle, label: "Помощник" },
      { key: "doctor", icon: Stethoscope, label: "Врач и отчёт" },
      { key: "calculators", icon: Calculator, label: "Калькуляторы" },
      { key: "library", icon: BookOpen, label: "Библиотека" },
      { key: "stories", icon: Users, label: "Истории" },
      { key: "profile", icon: Settings, label: "Профиль и данные" },
    ],
  },
];

const MORE_ITEMS = [
  { key: "doctor", icon: Stethoscope, label: "Врач и отчёт" },
  { key: "calendar", icon: CalendarIcon, label: "Календарь и напоминания" },
  { key: "calculators", icon: Calculator, label: "Калькуляторы" },
  { key: "library", icon: BookOpen, label: "Библиотека знаний" },
  { key: "stories", icon: Users, label: "Истории восстановления" },
  { key: "profile", icon: User, label: "Профиль и данные" },
];

export default function App() {
  const [profile, setProfile] = usePersisted("profile", null);
  const [done, setDone] = usePersisted("done", {}); // { "YYYY-MM-DD": { exerciseId | "ev:<id>": true } }
  const [sessions, setSessions] = usePersisted("sessions", []);
  const [painLog, setPainLog] = usePersisted("painLog", []);
  const [diary, setDiary] = usePersisted("diary", []);
  const [events, setEvents] = usePersisted("events", []);
  const [doctor, setDoctor] = usePersisted("doctor", { name: "", specialty: "", phone: "", email: "" });
  const [photos, setPhotos] = useState(() => loadPersistedState("photos", []));

  const [tab, setTab] = useState("home");
  const [moreOpen, setMoreOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [guidedId, setGuidedId] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [role, setRole] = usePersisted("userRole", "user");
  const [customPlan, setCustomPlan] = usePersisted("customPlan", null);
  const [storageNoticeDismissed, setStorageNoticeDismissed] = usePersisted("storageNoticeDismissed", false);

  const today = dateKey();
  const plan = useMemo(() => customPlan || buildPlan(profile), [profile, customPlan]);
  const todayDone = done[today] || {};
  const streak = computeStreak(done, today);
  const bestStreak = computeBestStreak(done);
  const adherence = computeAdherence(done, plan, profile?.startDate, today);
  const todayPain = painLog.find((p) => p.date === today) || null;
  const activeExercise = EXERCISES.find((e) => e.id === guidedId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tab, guidedId, editingProfile]);

  // «Жидкое стекло»: блик на карточке следует за курсором (только устройства с hover)
  useEffect(() => {
    if (!window.matchMedia?.("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    let frame = 0;
    const onMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = e.target.closest?.(".panel, .card, .item, .phase-card");
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  const sos = <RedFlagsModal open={sosOpen} onClose={() => setSosOpen(false)} />;

  // ─── Анкета (первый запуск или редактирование) ───
  if (!profile || editingProfile) {
    return (
      <>
        <OnboardingScreen
          initial={editingProfile ? profile : null}
          onShowSos={() => setSosOpen(true)}
          onCancel={editingProfile ? () => setEditingProfile(false) : null}
          onComplete={(p) => {
            setProfile(p);
            setEditingProfile(false);
            setTab("home");
          }}
        />
        {sos}
      </>
    );
  }

  // ─── Действия ───
  const toggleTask = (id) =>
    setDone((d) => ({ ...d, [today]: { ...(d[today] || {}), [id]: !(d[today] || {})[id] } }));

  const finishGuided = ({ painAfter }) => {
    setDone((d) => ({ ...d, [today]: { ...(d[today] || {}), [guidedId]: true } }));
    setSessions((s) => [...s, { id: Date.now(), exerciseId: guidedId, date: today, painAfter }]);
    setGuidedId(null);
    setTab("home");
  };

  const careStep = (id, value) =>
    setDone((d) => ({ ...d, [today]: { ...(d[today] || {}), [`care:${id}`]: value } }));

  const logPain = (pain) => setPainLog((log) => [...log.filter((p) => p.date !== today), { date: today, pain }]);

  const savePhoto = (entry) => {
    const next = [entry, ...photos];
    if (!savePersistedState("photos", next)) return false;
    setPhotos(next);
    return true;
  };
  const deletePhoto = (id) => {
    const next = photos.filter((p) => p.id !== id);
    savePersistedState("photos", next);
    setPhotos(next);
  };

  const exportAll = () => exportDataSnapshot({ profile, painLog, sessions, diary, events, doctor, done, photosCount: photos.length });
  const wipeAll = () => {
    wipeAllPersistedData();
    window.location.reload();
  };

  // ─── Тренировка ───
  if (guidedId && activeExercise) {
    return (
      <>
        <GuidedSession key={guidedId} exercise={activeExercise} onFinish={finishGuided} onExit={() => setGuidedId(null)} />
        {sos}
      </>
    );
  }

  const isMoreTab = !PRIMARY_TABS.some((t) => t.key === tab);
  const badges = {
    exercises: plan.filter((id) => !todayDone[id]).length,
    calendar: events.filter((e) => e.date === today).length,
  };

  return (
    <div className="shell">
      <aside className="sidebar" aria-label="Разделы">
        <button className="brand" style={{ background: "none", border: "none", padding: "4px 12px 6px" }} onClick={() => setTab("home")}>
          <span className="brand-mark"><HeartPulse size={17} /></span> Ainala
        </button>
        <div style={{ display: "flex", gap: 3, background: "rgba(0,0,0,0.05)", padding: 3, borderRadius: 10, margin: "4px 12px 12px" }}>
          {[
            { id: "user", label: "Пациент" },
            { id: "doctor", label: "Врач" },
            { id: "admin", label: "Админ" },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              style={{
                flex: 1,
                padding: "5px 6px",
                fontSize: 11,
                fontWeight: role === r.id ? 700 : 500,
                borderRadius: 8,
                border: "none",
                background: role === r.id ? "#fff" : "transparent",
                color: role === r.id ? C.teal : "var(--muted)",
                boxShadow: role === r.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                cursor: "pointer",
                transition: "all .15s ease",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
        {SIDEBAR.map((section) => (
          <React.Fragment key={section.title}>
            <div className="side-section">{section.title}</div>
            {section.items.map((it) => {
              const badge = badges[it.key];
              return (
                <button key={it.key} className={`side-link ${tab === it.key ? "active" : ""}`} onClick={() => { setRole("user"); setTab(it.key); }} aria-current={tab === it.key ? "page" : undefined}>
                  <it.icon size={20} strokeWidth={tab === it.key ? 2.4 : 2} />
                  {it.label}
                  {badge > 0 && <span className="side-badge">{badge}</span>}
                </button>
              );
            })}
          </React.Fragment>
        ))}
        <div style={{ flex: 1, minHeight: 20 }} />
        <PhaseCard profile={profile} onEdit={() => setEditingProfile(true)} />
        <button className="user-card" style={{ marginTop: 12 }} onClick={() => { setRole("user"); setTab("profile"); }}>
          <span className="avatar">{profile.name?.[0]?.toUpperCase()}</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontWeight: 700, fontSize: 15 }}>{profile.name}</span>
            <span className="small">{profile.part} · данные на устройстве</span>
          </span>
          <ChevronRight size={16} color={C.muted} />
        </button>
      </aside>

      <header className="app-header">
        <button className="brand" style={{ background: "none", border: "none", padding: 0 }} onClick={() => { setRole("user"); setTab("home"); }}>
          <span className="brand-mark"><HeartPulse size={17} /></span> Ainala
        </button>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 2, background: "rgba(0,0,0,0.05)", padding: 2, borderRadius: 8 }}>
            {[
              { id: "user", label: "Пациент" },
              { id: "doctor", label: "Врач" },
              { id: "admin", label: "Админ" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                style={{
                  padding: "4px 7px",
                  fontSize: 10.5,
                  fontWeight: role === r.id ? 700 : 500,
                  borderRadius: 6,
                  border: "none",
                  background: role === r.id ? "#fff" : "transparent",
                  color: role === r.id ? C.teal : "var(--muted)",
                  cursor: "pointer",
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button className="sos-btn" onClick={() => setSosOpen(true)}>
            <ShieldAlert size={14} /> SOS
          </button>
        </div>
      </header>

      <main className="content">
        {role === "doctor" ? (
          <div className="content-narrow" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <DoctorCabinetScreen
              profile={profile}
              plan={plan}
              onUpdatePlan={(newPlan) => setCustomPlan(newPlan)}
              painLog={painLog}
              sessions={sessions}
              diary={diary}
              adherence={adherence}
            />
          </div>
        ) : role === "admin" ? (
          <div className="content-narrow" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <AdminPanelScreen />
          </div>
        ) : (
          <div className="route" key={tab}>
          {tab === "home" && (
            <HomeScreen
            profile={profile}
            plan={plan}
            done={done}
            todayDone={todayDone}
            onToggle={toggleTask}
            onCareStep={careStep}
            onStart={setGuidedId}
            streak={streak}
            adherence={adherence}
            todayPain={todayPain}
            onLogPain={logPain}
            events={events}
            sessions={sessions}
            painLog={painLog}
            onNavigate={setTab}
            onShowSos={() => setSosOpen(true)}
            onEditProfile={() => setEditingProfile(true)}
          />
        )}
        {tab !== "home" && (
        <div className="content-narrow" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {tab === "exercises" && <ExercisesScreen profile={profile} plan={plan} onStart={setGuidedId} />}
        {tab === "progress" && (
          <ProgressScreen
            profile={profile}
            painLog={painLog}
            sessions={sessions}
            diary={diary}
            onAddDiary={(e) => setDiary((d) => [e, ...d])}
            onDeleteDiary={(id) => setDiary((d) => d.filter((x) => x.id !== id))}
            streak={streak}
            bestStreak={bestStreak}
            adherence={adherence}
            photos={photos}
            onSavePhoto={savePhoto}
            onDeletePhoto={deletePhoto}
            onShowSos={() => setSosOpen(true)}
          />
        )}
        {tab === "assistant" && <AssistantScreen profile={profile} />}
        {tab === "calculators" && <CalculatorsScreen profile={profile} />}
        {tab === "calendar" && (
          <CalendarScreen events={events} onAdd={(e) => setEvents((ev) => [...ev, e])} onDelete={(id) => setEvents((ev) => ev.filter((e) => e.id !== id))} />
        )}
        {tab === "doctor" && (
          <DoctorScreen profile={profile} doctor={doctor} onSaveDoctor={setDoctor} adherence={adherence} painLog={painLog} sessions={sessions} diary={diary} />
        )}
        {tab === "library" && <LibraryScreen />}
        {tab === "stories" && <StoriesScreen />}
        {tab === "profile" && <ProfileScreen profile={profile} onEdit={() => setEditingProfile(true)} onExport={exportAll} />}
        </div>
        )}
        </div>
        )}
      </main>

      <nav className="bottom-nav" aria-label="Основная навигация">
        {PRIMARY_TABS.map((t) => (
          <button key={t.key} className={`nav-btn ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)} aria-current={tab === t.key ? "page" : undefined}>
            <t.icon size={21} strokeWidth={tab === t.key ? 2.4 : 2} />
            {t.label}
          </button>
        ))}
        <button className={`nav-btn ${isMoreTab ? "active" : ""}`} onClick={() => setMoreOpen(true)}>
          <LayoutGrid size={21} strokeWidth={isMoreTab ? 2.4 : 2} />
          Ещё
        </button>
      </nav>

      <Modal open={moreOpen} onClose={() => setMoreOpen(false)} sheet title="Разделы">
        <div style={{ width: 38, height: 4, background: C.line, borderRadius: 999, margin: "0 auto 8px" }} />
        {MORE_ITEMS.map((it) => (
          <button key={it.key} className="list-btn" onClick={() => { setTab(it.key); setMoreOpen(false); }}>
            <span className="icon-tile" style={{ width: 36, height: 36, background: C.tealSoft }}>
              <it.icon size={18} color={C.teal} />
            </span>
            {it.label}
            <ChevronRight size={16} color={C.muted} style={{ marginLeft: "auto" }} />
          </button>
        ))}
      </Modal>

      {!storageNoticeDismissed && (
        <aside
          role="region"
          aria-label="Уведомление о хранении данных"
          style={{
            position: "fixed",
            bottom: "clamp(14px, 8vh, 76px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 24px)",
            maxWidth: 540,
            zIndex: 85,
            background: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${C.line}`,
            borderRadius: 14,
            padding: "10px 14px",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 12.5,
            lineHeight: 1.4,
            color: C.ink,
          }}
        >
          <div style={{ flex: 1 }}>
            <strong>Хранение данных (152-ФЗ / GDPR):</strong> Ainala хранит всё локально на устройстве (localStorage). Сторонние трекеры и cookie отсутствуют.
          </div>
          <button
            className="btn btn-secondary"
            style={{ padding: "6px 14px", fontSize: 12, flexShrink: 0, fontWeight: 700, background: C.tealSoft, color: C.teal }}
            onClick={() => setStorageNoticeDismissed(true)}
          >
            Понятно
          </button>
        </aside>
      )}

      {sos}
    </div>
  );
}
