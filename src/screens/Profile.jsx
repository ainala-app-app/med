import React, { useState } from "react";
import { Download, Edit3, Lock, Shield, Mail } from "lucide-react";
import { C } from "../theme/tokens";
import { ACTIVITY_LEVELS } from "../data/mockData";
import { formatDay } from "../utils/stats";
import { Card, ScreenTitle, BodyMap, Pill } from "../components/ui/SharedUI";
import { LegalModal } from "../components/ui/LegalModal";

function Row({ label, value }) {
  return (
    <div className="between" style={{ padding: "11px 0", borderBottom: `1px solid ${C.line}` }}>
      <span className="muted">{label}</span>
      <span style={{ fontSize: 13.5, fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );
}

export function ProfileScreen({ profile, onEdit, onExport }) {
  const [legalOpen, setLegalOpen] = useState(false);
  const imperial = profile.units === "imperial";
  const activity = ACTIVITY_LEVELS.find((a) => a.id === profile.activityLevel)?.label || "—";

  return (
    <div className="screen">
      <ScreenTitle>Профиль</ScreenTitle>
      <Card style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ background: C.tealSoft, borderRadius: 14, padding: "6px 10px" }}>
          <BodyMap part={profile.part} size={80} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="h1" style={{ fontSize: 21 }}>{profile.name}</div>
          <div className="row" style={{ gap: 6, marginTop: 6, flexWrap: "wrap" }}>
            <Pill tone="teal">{profile.part}</Pill>
            <Pill tone="coral">{profile.phase} фаза</Pill>
          </div>
        </div>
      </Card>

      <Card>
        {profile.injuryDate && <Row label="Дата травмы / операции" value={formatDay(profile.injuryDate, { day: "numeric", month: "long", year: "numeric" })} />}
        <Row label="Начало с Ainala" value={formatDay(profile.startDate, { day: "numeric", month: "long", year: "numeric" })} />
        <Row label="Боль при старте" value={`${profile.pain ?? "—"} / 10`} />
        <Row label="Активность" value={activity} />
        {profile.age && <Row label="Возраст" value={profile.age} />}
        {profile.weight && <Row label="Вес" value={`${profile.weight} ${imperial ? "фунт." : "кг"}`} />}
        {profile.height && <Row label="Рост" value={`${profile.height} ${imperial ? "дюйм." : "см"}`} />}
        {profile.allergies && <Row label="Аллергии" value={profile.allergies} />}
        {profile.description && (
          <div style={{ paddingTop: 11 }}>
            <div className="muted" style={{ marginBottom: 4 }}>Описание травмы</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>{profile.description}</div>
          </div>
        )}
      </Card>

      <button className="btn btn-soft block" onClick={onEdit}>
        <Edit3 size={15} /> Изменить травму, этап и данные
      </button>

      <button className="btn btn-secondary block" style={{ marginTop: 8 }} onClick={() => setLegalOpen(true)}>
        <Shield size={15} /> Условия использования и защита данных (152-ФЗ / GDPR)
      </button>

      <LegalModal open={legalOpen} onClose={() => setLegalOpen(false)} />

      <h2 className="h2">Ваши данные</h2>
      <div className="alert info">
        <Lock size={17} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>Всё хранится только в этом браузере и никуда не отправляется. При очистке данных браузера записи пропадут — сохраняйте резервную копию.</div>
      </div>
      <button className="btn btn-secondary block" onClick={onExport}>
        <Download size={15} /> Экспорт резервной копии (JSON)
      </button>
      <div className="small muted" style={{ marginTop: 10, textAlign: "center", lineHeight: 1.45 }}>
        Удаление аккаунта и данных — по обращению в поддержку: <a href="mailto:support@ainala.app" style={{ color: C.teal, fontWeight: 600 }}>support@ainala.app</a> или через очистку сайта в настройках браузера.
      </div>
    </div>
  );
}
