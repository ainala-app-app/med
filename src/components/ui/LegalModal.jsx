import React from "react";
import { Shield, Lock, AlertTriangle, FileText, Check, Mail, Globe } from "lucide-react";
import { C } from "../../theme/tokens";
import { Modal, ModalHeader, Pill } from "./SharedUI";

export function LegalModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Условия и конфиденциальность">
      <ModalHeader icon={<Shield size={20} color={C.teal} />} title="Правовая информация" onClose={onClose} />
      
      <div style={{ maxHeight: "68vh", overflowY: "auto", paddingRight: 4, fontSize: 13, lineHeight: 1.6, color: C.ink }}>
        
        {/* РАЗДЕЛ 1: МЕДИЦИНСКИЙ ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ */}
        <div style={{ background: C.amberSoft, border: `1px solid ${C.amberBorder}`, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
          <div className="row" style={{ gap: 6, fontWeight: 700, color: "#8A5A00", marginBottom: 4 }}>
            <AlertTriangle size={16} /> 1. Медицинский отказ от ответственности
          </div>
          <p style={{ margin: 0, fontSize: 12.5, color: "#5F4000" }}>
            Приложение <strong>Ainala Rehab</strong> является цифровым справочным дневником и трекером двигательной активности. Сервис <strong>НЕ является медицинским изделием</strong>, не ставит медицинских диагнозов, не заменяет очного осмотра врача и не назначает фармакотерапию. Все упражнения ЛФК должны быть согласованы с вашим лечащим травматологом, хирургом или физиотерапевтом. При острой боли, температуре или отёке немедленно прекратите нагрузку и обратитесь к врачу или в экстренные службы (112).
          </p>
        </div>

        {/* РАЗДЕЛ 2: ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ И 152-ФЗ / GDPR */}
        <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: "14px 0 6px", color: C.ink }}>
          2. Конфиденциальность и безопасность данных (152-ФЗ / GDPR)
        </h3>
        <p style={{ margin: "0 0 8px" }}>
          Мы придерживаемся принципа <em>Privacy by Design</em> и максимальной защиты персональных медицинских данных:
        </p>
        <ul style={{ paddingLeft: 18, margin: "0 0 12px" }}>
          <li><strong>Локальное хранение:</strong> Все ваши записи (дневник боли, график тренировок, фото до/после, личные заметки) сохраняются исключительно в локальной памяти вашего браузера (localStorage) на вашем личном устройстве.</li>
          <li><strong>Отсутствие трекеров:</strong> Мы не используем рекламные шпионские пиксели, трекеры соцсетей и сторонние аналитические cookie.</li>
          <li><strong>Контроль передачи:</strong> Клинический отчёт или экспорт данных формируется только по вашей прямой команде и отправляется исключительно выбранному вами адресату.</li>
        </ul>

        {/* РАЗДЕЛ 3: ВОЗРАСТНЫЕ ОГРАНИЧЕНИЯ (18+) */}
        <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: "14px 0 6px", color: C.ink }}>
          3. Возрастное ограничение (18+)
        </h3>
        <p style={{ margin: "0 0 12px" }}>
          Используя сервис, вы подтверждаете, что вам исполнилось 18 лет, либо программа реабилитации и выполнение упражнений осуществляются под непосредственным контролем законных представителей и профильного лечащего врача.
        </p>

        {/* РАЗДЕЛ 4: ПРАВО НА ЗАБВЕНИЕ (УДАЛЕНИЕ ДАННЫХ) */}
        <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: "14px 0 6px", color: C.ink }}>
          4. Право на забвение и экспорт данных
        </h3>
        <p style={{ margin: "0 0 12px" }}>
          В соответствии со ст. 15 152-ФЗ РФ и ст. 17 GDPR, вы обладаете полным суверенитетом над своими данными. В разделе «Профиль» вам в любой момент доступны функции:
          <br />• <strong>Экспорт данных (JSON)</strong> — выгрузка полного архива ваших записей.
          <br />• <strong>Удалить все данные</strong> — безвозвратное стирание всей информации с устройства в 1 клик.
        </p>

        {/* РАЗДЕЛ 5: ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ И ЛИЦЕНЗИИ */}
        <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: "14px 0 6px", color: C.ink }}>
          5. Лицензии и открытый код
        </h3>
        <p style={{ margin: "0 0 12px" }}>
          Интерфейс использует свободные шрифты Manrope и IBM Plex Mono (SIL Open Font License) и векторные иконки Lucide (ISC License). Графические схемы являются оригинальной разработкой команды Ainala.
        </p>

        {/* РАЗДЕЛ 6: КОНТАКТЫ И РЕКВИЗИТЫ */}
        <div style={{ background: "var(--bg)", borderRadius: 12, padding: "12px 14px", marginTop: 14 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>6. Обратная связь и контакты</div>
          <div className="small">
            Команда разработки: Ainala Rehab Team<br />
            Email для правовых и клинических запросов: <a href="mailto:support@ainala.app" style={{ color: C.teal, fontWeight: 600 }}>support@ainala.app</a><br />
            Репозиторий проекта: <a href="https://github.com/ainala-app-app/med" target="_blank" rel="noopener noreferrer" style={{ color: C.teal }}>github.com/ainala-app-app/med</a>
          </div>
        </div>

      </div>

      <div style={{ marginTop: 16 }}>
        <button className="btn btn-primary block" onClick={onClose}>
          Понятно, принимаю
        </button>
      </div>
    </Modal>
  );
}
