import React, { useState } from "react";
import {
  Stethoscope, Users, UserCheck, Calendar, Activity, TrendingUp, Plus, Edit3, Check,
  ChevronRight, Dumbbell, AlertTriangle, ArrowLeft, Search, Filter
} from "lucide-react";
import { C } from "../theme/tokens";
import { EXERCISES, PHASES, BODY_PARTS } from "../data/mockData";
import { Card, Pill, ScreenTitle, Modal, InputRow } from "../components/ui/SharedUI";
import { formatDay, dateKey } from "../utils/stats";

export function DoctorCabinetScreen({
  profile,
  plan,
  onUpdatePlan,
  painLog,
  sessions,
  diary,
  adherence,
}) {
  const [selectedPatientId, setSelectedPatientId] = useState(profile ? "self" : null);
  const [inviteCodeModal, setInviteCodeModal] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [addExModal, setAddExModal] = useState(false);
  const [editingEx, setEditingEx] = useState(null);
  const [editSets, setEditSets] = useState(3);
  const [editReps, setEditReps] = useState(10);

  // Список подключённых пациентов (текущий пользователь + демо-пациент для демонстрации функционала)
  const patients = [
    {
      id: "self",
      name: profile?.name || "Сэм",
      part: profile?.part || "Колено",
      phase: profile?.phase || "Ранняя",
      injuryDate: profile?.injuryDate || null,
      adherence: adherence || 86,
      currentPain: painLog?.slice(-1)[0]?.pain ?? 3,
      sessionsCount: sessions?.length || 4,
      lastDiary: diary?.[0]?.text || "Самочувствие стабильное, отёк спадает после прикладывания льда.",
      plan: plan || ["ex1", "ex2"],
    },
    {
      id: "p-2",
      name: "Екатерина В.",
      part: "Плечо",
      phase: "Средняя",
      injuryDate: "2026-09-15",
      adherence: 92,
      currentPain: 2,
      sessionsCount: 14,
      lastDiary: "Амплитуда отведения увеличилась, боли в покое нет.",
      plan: ["ex3", "ex3_mid"],
    },
  ];

  const currentPatient = patients.find((p) => p.id === selectedPatientId);
  const patientExercises = (currentPatient?.plan || []).map((id) => EXERCISES.find((e) => e.id === id)).filter(Boolean);

  const handleConnectPatient = () => {
    if (!inviteCode.trim()) return;
    setInviteCodeModal(false);
    setInviteCode("");
  };

  const handleSaveExParams = () => {
    if (!editingEx) return;
    setEditingEx(null);
  };

  return (
    <div className="screen">
      <div className="between" style={{ marginBottom: 14 }}>
        <div>
          <ScreenTitle subtitle="Кабинет врача-реабилитолога и травматолога">Кабинет врача</ScreenTitle>
        </div>
        <button className="btn btn-primary sm" onClick={() => setInviteCodeModal(true)}>
          <Plus size={14} /> Подключить пациента
        </button>
      </div>

      {/* Панель выбора пациента */}
      <div className="panel" style={{ padding: "14px 16px", marginBottom: 16 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Подключённые пациенты ({patients.length})</div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {patients.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPatientId(p.id)}
              className={`chip ${selectedPatientId === p.id ? "active" : ""}`}
              style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
            >
              <UserCheck size={14} />
              <span>{p.name} ({p.part})</span>
            </button>
          ))}
        </div>
      </div>

      {currentPatient ? (
        <>
          {/* Сводка по выбранному пациенту */}
          <Card style={{ marginBottom: 14 }}>
            <div className="between" style={{ alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: C.ink }}>{currentPatient.name}</div>
                <div className="small" style={{ marginTop: 2 }}>
                  Область: <strong>{currentPatient.part}</strong> · Фаза: <strong>{currentPatient.phase}</strong>
                </div>
              </div>
              <Pill tone={currentPatient.adherence >= 80 ? "teal" : "amber"}>
                Выполнение: {currentPatient.adherence}%
              </Pill>
            </div>

            <div className="grid-2" style={{ gap: 8, marginTop: 10 }}>
              <div className="stat" style={{ padding: "10px 12px" }}>
                <div className="stat-label">Текущая боль</div>
                <div className="stat-value" style={{ fontSize: 18, color: currentPatient.currentPain > 5 ? C.red : C.teal }}>
                  {currentPatient.currentPain} / 10
                </div>
              </div>
              <div className="stat" style={{ padding: "10px 12px" }}>
                <div className="stat-label">Всего тренировок</div>
                <div className="stat-value" style={{ fontSize: 18 }}>{currentPatient.sessionsCount}</div>
              </div>
            </div>

            {currentPatient.lastDiary && (
              <div style={{ marginTop: 12, padding: "10px 12px", background: "var(--bg)", borderRadius: 10, fontSize: 13, lineHeight: 1.45 }}>
                <div className="eyebrow" style={{ marginBottom: 4 }}>Последняя запись дневника:</div>
                "{currentPatient.lastDiary}"
              </div>
            )}
          </Card>

          {/* Управление планом ЛФК пациента */}
          <div className="between" style={{ margin: "20px 0 10px" }}>
            <h2 className="h2" style={{ margin: 0 }}>Назначенный план ЛФК</h2>
            <button className="btn btn-soft sm" onClick={() => setAddExModal(true)}>
              <Plus size={14} /> Добавить упражнение
            </button>
          </div>

          {patientExercises.length === 0 ? (
            <div className="empty">У пациента пока нет назначенных упражнений.</div>
          ) : (
            patientExercises.map((ex) => (
              <Card key={ex.id} style={{ marginBottom: 10 }}>
                <div className="between" style={{ alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="icon-tile" style={{ background: C.tealSoft }}>
                      <Dumbbell size={18} color={C.teal} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{ex.name}</div>
                      <div className="small" style={{ marginTop: 2 }}>
                        {ex.sets} подходов × {ex.reps} повторений · {ex.phase.toLowerCase()} фаза
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-secondary sm"
                    onClick={() => {
                      setEditingEx(ex);
                      setEditSets(ex.sets);
                      setEditReps(ex.reps);
                    }}
                  >
                    <Edit3 size={13} /> Дозировка
                  </button>
                </div>
              </Card>
            ))
          )}

          <div className="alert info" style={{ marginTop: 14 }}>
            💡 Все корректировки подходов и упражнений мгновенно отображаются в мобильном приложении пациента при следующей синхронизации.
          </div>
        </>
      ) : (
        <div className="empty" style={{ padding: "32px 16px", textAlign: "center" }}>
          <Stethoscope size={28} color={C.muted} style={{ marginBottom: 8 }} />
          <div>У вас пока нет подключённых пациентов.</div>
          <div className="small" style={{ marginTop: 4 }}>Передайте пациенту ваш персональный код врача для прикрепления.</div>
        </div>
      )}

      {/* Модалка подключения пациента по коду */}
      <Modal open={inviteCodeModal} onClose={() => setInviteCodeModal(false)} title="Подключить пациента">
        <div style={{ padding: "8px 0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>Подключение пациента</h2>
          <p className="muted" style={{ fontSize: 13, margin: "0 0 14px" }}>
            Введите 6-значный персональный код из профиля пациента для получения доступа к его дневнику и плану:
          </p>
          <InputRow
            label="Код пациента"
            value={inviteCode}
            onChange={setInviteCode}
            placeholder="Например: PT-9104"
          />
          <div className="row" style={{ gap: 8, marginTop: 14 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleConnectPatient} disabled={!inviteCode.trim()}>
              Подключить
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setInviteCodeModal(false)}>
              Отмена
            </button>
          </div>
        </div>
      </Modal>

      {/* Модалка изменения дозировки упражнения */}
      <Modal open={!!editingEx} onClose={() => setEditingEx(null)} title="Коррекция дозировки">
        {editingEx && (
          <div style={{ padding: "8px 0" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>{editingEx.name}</h2>
            <div className="small" style={{ marginBottom: 14 }}>Коррекция нагрузки для пациента {currentPatient?.name}</div>
            <InputRow
              label="Количество подходов"
              type="number"
              value={editSets}
              onChange={(v) => setEditSets(Number(v))}
              min="1"
              max="10"
            />
            <InputRow
              label="Количество повторений в подходе"
              type="number"
              value={editReps}
              onChange={(v) => setEditReps(Number(v))}
              min="1"
              max="50"
            />
            <div className="row" style={{ gap: 8, marginTop: 14 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSaveExParams}>
                Сохранить назначение
              </button>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditingEx(null)}>
                Отмена
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модалка добавления упражнения из базы */}
      <Modal open={addExModal} onClose={() => setAddExModal(false)} title="Добавить упражнение">
        <div style={{ padding: "8px 0", maxHeight: "65vh", overflowY: "auto" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 10px" }}>Каталог упражнений</h2>
          {EXERCISES.filter((e) => e.part === currentPatient?.part).map((ex) => (
            <div key={ex.id} className="card" style={{ marginBottom: 8, padding: 10 }}>
              <div className="between">
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{ex.name}</div>
                  <div className="small">{ex.phase} фаза · {ex.sets} × {ex.reps}</div>
                </div>
                <button
                  className="btn btn-soft sm"
                  onClick={() => {
                    if (onUpdatePlan && currentPatient?.id === "self") {
                      if (!plan.includes(ex.id)) onUpdatePlan([...plan, ex.id]);
                    }
                    setAddExModal(false);
                  }}
                >
                  <Plus size={13} /> Добавить
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
