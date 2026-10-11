import React, { useState } from "react";
import {
  Shield, Dumbbell, BookOpen, Users, Plus, Edit3, Trash2, CheckCircle2,
  EyeOff, Search, Video, FileText, Check, ShieldCheck, Stethoscope
} from "lucide-react";
import { C } from "../theme/tokens";
import { EXERCISES, BODY_PARTS, PHASES, COMMUNITY_POSTS, SHORT_ARTICLES, LONG_ARTICLES } from "../data/mockData";
import { Card, Pill, ScreenTitle, Segmented, Modal, InputRow } from "../components/ui/SharedUI";

export function AdminPanelScreen() {
  const [tab, setTab] = useState("exercises");
  const [exerciseList, setExerciseList] = useState(EXERCISES);
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [editingEx, setEditingEx] = useState(null);
  const [newExModal, setNewExModal] = useState(false);
  const [newEx, setNewEx] = useState({
    name: "",
    part: "Колено",
    phase: "Ранняя",
    difficulty: "Лёгкая",
    sets: 3,
    reps: 10,
    videoUrl: "",
    instructions: "",
  });

  const [articlesList, setArticlesList] = useState(SHORT_ARTICLES);
  const [newArticleModal, setNewArticleModal] = useState(false);
  const [newArticle, setNewArticle] = useState({ q: "", a: "", category: "Колено" });

  const togglePostStatus = (id) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const nextStatus = p.status === "approved" ? "hidden" : "approved";
        return { ...p, status: nextStatus };
      })
    );
  };

  const handleAddExercise = () => {
    if (!newEx.name.trim()) return;
    const created = {
      id: `ex_custom_${Date.now()}`,
      name: newEx.name.trim(),
      part: newEx.part,
      phase: newEx.phase,
      difficulty: newEx.difficulty,
      sets: Number(newEx.sets) || 3,
      reps: Number(newEx.reps) || 10,
      restSec: 20,
      workSec: 20,
      targetRom: "Индивидуальный контроль",
      instructions: newEx.instructions || "Выполняйте упражнение плавно под контролем врача.",
      caution: "Остановитесь при резкой боли.",
      videoUrl: newEx.videoUrl || "https://www.youtube.com",
    };
    setExerciseList([created, ...exerciseList]);
    setNewExModal(false);
    setNewEx({ name: "", part: "Колено", phase: "Ранняя", difficulty: "Лёгкая", sets: 3, reps: 10, videoUrl: "", instructions: "" });
  };

  return (
    <div className="screen">
      <div className="between" style={{ marginBottom: 14 }}>
        <ScreenTitle subtitle="Управление контентом, модерация и каталоги ЛФК">Панель администратора</ScreenTitle>
        <span className="pill-icon" style={{ background: C.tealSoft }}><ShieldCheck size={20} color={C.teal} /></span>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: "exercises", label: "Упражнения" },
            { value: "articles", label: "База знаний" },
            { value: "community", label: "Модерация" },
            { value: "users", label: "Врачи и юзеры" },
          ]}
        />
      </div>

      {/* ВКЛАДКА 1: УПРАВЛЕНИЕ УПРАЖНЕНИЯМИ */}
      {tab === "exercises" && (
        <>
          <div className="between" style={{ marginBottom: 12 }}>
            <div className="eyebrow">Каталог упражнений ({exerciseList.length})</div>
            <button className="btn btn-primary sm" onClick={() => setNewExModal(true)}>
              <Plus size={14} /> Добавить упражнение
            </button>
          </div>

          {exerciseList.map((ex) => (
            <Card key={ex.id} style={{ marginBottom: 10 }}>
              <div className="between" style={{ alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{ex.name}</div>
                  <div className="row" style={{ gap: 6, marginTop: 4 }}>
                    <Pill tone="teal">{ex.part}</Pill>
                    <Pill tone="sky">{ex.phase} фаза</Pill>
                    <span className="small">{ex.sets} × {ex.reps} повт.</span>
                  </div>
                </div>
                <button
                  className="icon-btn"
                  onClick={() => setExerciseList((prev) => prev.filter((item) => item.id !== ex.id))}
                  aria-label="Удалить"
                >
                  <Trash2 size={15} color={C.red} />
                </button>
              </div>
            </Card>
          ))}
        </>
      )}

      {/* ВКЛАДКА 2: СТАТЬИ И МАТЕРИАЛЫ */}
      {tab === "articles" && (
        <>
          <div className="between" style={{ marginBottom: 12 }}>
            <div className="eyebrow">Материалы библиотеки и помощника ({articlesList.length})</div>
            <button className="btn btn-primary sm" onClick={() => setNewArticleModal(true)}>
              <Plus size={14} /> Создать статью
            </button>
          </div>

          {articlesList.map((a) => (
            <Card key={a.id} style={{ marginBottom: 10 }}>
              <div className="between">
                <div>
                  <Pill tone="sky">{a.category}</Pill>
                  <div style={{ fontWeight: 700, fontSize: 14, marginTop: 6 }}>{a.q}</div>
                  <div className="muted" style={{ fontSize: 12.5, marginTop: 4, maxHeight: 42, overflow: "hidden" }}>{a.a}</div>
                </div>
                <button
                  className="icon-btn"
                  onClick={() => setArticlesList((prev) => prev.filter((item) => item.id !== a.id))}
                  aria-label="Удалить статью"
                >
                  <Trash2 size={15} color={C.red} />
                </button>
              </div>
            </Card>
          ))}
        </>
      )}

      {/* ВКЛАДКА 3: МОДЕРАЦИЯ СООБЩЕСТВА */}
      {tab === "community" && (
        <>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Посты сообщества на проверке ({posts.length})</div>
          {posts.map((p) => (
            <Card key={p.id} style={{ marginBottom: 10 }}>
              <div className="between" style={{ marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{p.author} · <span className="muted">{p.tag}</span></div>
                <Pill tone={p.status === "approved" ? "green" : "red"}>
                  {p.status === "approved" ? "Опубликован" : "Скрыт модератором"}
                </Pill>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>{p.text}</div>
              <div className="row" style={{ justifyContent: "flex-end", gap: 8 }}>
                <button className="btn btn-secondary sm" onClick={() => togglePostStatus(p.id)}>
                  {p.status === "approved" ? <><EyeOff size={13} /> Скрыть пост</> : <><Check size={13} /> Одобрить</>}
                </button>
                <button
                  className="icon-btn"
                  onClick={() => setPosts((prev) => prev.filter((item) => item.id !== p.id))}
                  aria-label="Удалить"
                >
                  <Trash2 size={15} color={C.red} />
                </button>
              </div>
            </Card>
          ))}
        </>
      )}

      {/* ВКЛАДКА 4: ВРАЧИ И ПОЛЬЗОВАТЕЛИ */}
      {tab === "users" && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Зарегистрированные врачи</div>
          <Card style={{ marginBottom: 12 }}>
            <div className="row" style={{ gap: 10 }}>
              <div className="icon-tile" style={{ background: C.skySoft }}><Stethoscope size={18} color={C.sky} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Иванова Анна Сергеевна</div>
                <div className="small">Травматолог-ортопед · Код: DOC-408 · 6 пациентов</div>
              </div>
              <Pill tone="green">Активен</Pill>
            </div>
          </Card>

          <div className="eyebrow" style={{ margin: "16px 0 10px" }}>Пользователи приложения</div>
          <Card>
            <div className="row" style={{ gap: 10 }}>
              <div className="icon-tile" style={{ background: C.tealSoft }}><Users size={18} color={C.teal} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Сэм (Пациент)</div>
                <div className="small">Колено, ранняя фаза · Выполнение плана 86%</div>
              </div>
              <Pill tone="teal">Пациент</Pill>
            </div>
          </Card>
        </>
      )}

      {/* Модалка создания нового упражнения */}
      <Modal open={newExModal} onClose={() => setNewExModal(false)} title="Новое упражнение">
        <div style={{ padding: "8px 0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 12px" }}>Добавить упражнение</h2>
          <InputRow label="Название упражнения" value={newEx.name} onChange={(v) => setNewEx({ ...newEx, name: v })} placeholder="Например: Планка на коленях" />
          <div className="grid-2" style={{ gap: 8 }}>
            <div>
              <span className="field-label">Область сустава</span>
              <select className="select" style={{ width: "100%", marginTop: 4 }} value={newEx.part} onChange={(e) => setNewEx({ ...newEx, part: e.target.value })}>
                {BODY_PARTS.map((bp) => <option key={bp} value={bp}>{bp}</option>)}
              </select>
            </div>
            <div>
              <span className="field-label">Фаза реабилитации</span>
              <select className="select" style={{ width: "100%", marginTop: 4 }} value={newEx.phase} onChange={(e) => setNewEx({ ...newEx, phase: e.target.value })}>
                {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid-2" style={{ gap: 8, marginTop: 10 }}>
            <InputRow label="Подходы" type="number" value={newEx.sets} onChange={(v) => setNewEx({ ...newEx, sets: v })} />
            <InputRow label="Повторения" type="number" value={newEx.reps} onChange={(v) => setNewEx({ ...newEx, reps: v })} />
          </div>
          <InputRow label="Ссылка на видео (YouTube / Supabase)" value={newEx.videoUrl} onChange={(v) => setNewEx({ ...newEx, videoUrl: v })} placeholder="https://..." />
          <div className="row" style={{ gap: 8, marginTop: 16 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddExercise} disabled={!newEx.name.trim()}>
              Создать и опубликовать
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setNewExModal(false)}>
              Отмена
            </button>
          </div>
        </div>
      </Modal>

      {/* Модалка создания новой статьи */}
      <Modal open={newArticleModal} onClose={() => setNewArticleModal(false)} title="Создать статью">
        <div style={{ padding: "8px 0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 12px" }}>Новый материал для базы</h2>
          <InputRow label="Вопрос / Заголовок" value={newArticle.q} onChange={(v) => setNewArticle({ ...newArticle, q: v })} placeholder="Например: Как снизить отёк?" />
          <div style={{ marginBottom: 12 }}>
            <span className="field-label">Ответ / Текст статьи</span>
            <textarea
              className="input"
              rows={4}
              value={newArticle.a}
              onChange={(e) => setNewArticle({ ...newArticle, a: e.target.value })}
              placeholder="Подробный клинический ответ с акцентом на безопасность..."
              style={{ marginTop: 4 }}
            />
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => {
                if (!newArticle.q.trim()) return;
                setArticlesList([{ id: `art_${Date.now()}`, ...newArticle }, ...articlesList]);
                setNewArticleModal(false);
                setNewArticle({ q: "", a: "", category: "Колено" });
              }}
              disabled={!newArticle.q.trim()}
            >
              Сохранить статью
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setNewArticleModal(false)}>
              Отмена
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
