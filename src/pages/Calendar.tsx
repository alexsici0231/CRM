import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Users,
  Clock,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  getDay,
  addWeeks,
  subWeeks,

} from 'date-fns';
import { ru } from 'date-fns/locale';
import type { CalendarEvent } from '@/types';
import type { AppUser } from '@/lib/auth';
import { rolePermissions } from '@/lib/auth';
import type { NewCalendarEvent, useCrmStore } from '@/services/crmStore';

type CalendarView = 'month' | 'week' | 'day';

const eventColors: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'rgba(59,130,246,0.2)', text: '#3B82F6' },
  green: { bg: 'rgba(34,197,94,0.2)', text: '#22C55E' },
  orange: { bg: 'rgba(249,115,22,0.2)', text: '#F97316' },
  purple: { bg: 'rgba(168,85,247,0.2)', text: '#A855F7' },
};

type CrmStore = ReturnType<typeof useCrmStore>;

function EventPopover({
  event,
  onClose,
  canManage,
  onEdit,
  onDelete,
}: {
  event: CalendarEvent;
  onClose: () => void;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute z-50 w-80 rounded-xl p-4 shadow-2xl"
      style={{
        backgroundColor: '#1E2A42',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        border: '1px solid rgba(148,163,184,0.1)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-base font-semibold" style={{ color: '#F1F5F9' }}>
          {event.title}
        </h4>
        <button onClick={onClose} className="p-1 rounded hover:bg-[rgba(30,42,66,0.5)] cursor-pointer">
          <X size={14} style={{ color: '#64748B' }} />
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm" style={{ color: '#94A3B8' }}>
          <Clock size={14} />
          {event.startTime} - {event.endTime}
        </div>
        {event.location && (
          <div className="flex items-center gap-2 text-sm" style={{ color: '#94A3B8' }}>
            <MapPin size={14} />
            {event.location}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm" style={{ color: '#94A3B8' }}>
          <Users size={14} />
          {event.attendees.join(', ')}
        </div>
        {event.description && (
          <p className="text-xs mt-2" style={{ color: '#64748B' }}>
            {event.description}
          </p>
        )}
      </div>
      <div className="flex gap-3 mt-4 pt-3 border-t" style={{ borderColor: 'rgba(148,163,184,0.1)' }}>
        <button
          disabled={!canManage}
          onClick={onEdit}
          className="text-xs font-medium hover:underline cursor-pointer disabled:opacity-40"
          style={{ color: '#D97706' }}
        >
          Изменить
        </button>
        <button
          disabled={!canManage}
          onClick={onDelete}
          className="text-xs font-medium hover:underline cursor-pointer disabled:opacity-40"
          style={{ color: '#EF4444' }}
        >
          Удалить
        </button>
      </div>
    </motion.div>
  );
}

export default function CalendarPage({ crm, user }: { crm: CrmStore; user: AppUser }) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 17));
  const [view, setView] = useState<CalendarView>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 });

  const today = new Date(2025, 2, 17);
  const events = crm.calendarEvents;
  const permissions = rolePermissions[user.role];

  const goToToday = () => setCurrentDate(today);
  const goPrev = () => {
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, -1));
  };
  const goNext = () => {
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPopoverPos({ x: rect.left, y: rect.bottom + 8 });
    setSelectedEvent(event);
  };

  const createEvent = () => {
    if (!permissions.canManage) return;
    const title = window.prompt('Название события');
    if (!title?.trim()) return;

    const event: NewCalendarEvent = {
      title: title.trim(),
      startTime: '10:00',
      endTime: '10:30',
      date: currentDate,
      color: 'blue',
      attendees: [user.name],
      location: 'Онлайн',
    };
    crm.addCalendarEvent(event);
  };

  const editSelectedEvent = () => {
    if (!selectedEvent || !permissions.canManage) return;
    const title = window.prompt('Новое название события', selectedEvent.title);
    if (!title?.trim()) return;
    crm.updateCalendarEvent(selectedEvent.id, { title: title.trim() });
    setSelectedEvent(null);
  };

  const deleteSelectedEvent = () => {
    if (!selectedEvent || !permissions.canManage) return;
    crm.deleteCalendarEvent(selectedEvent.id);
    setSelectedEvent(null);
  };

  // Month view
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days: Date[] = [];
    let day = calStart;
    while (day <= calEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentDate]);

  const getEventsForDay = (date: Date) =>
    events.filter((e) => isSameDay(e.date, date));

  // Week view
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [currentDate]);

  const timeSlots = Array.from({ length: 18 }, (_, i) => i + 7); // 7AM to 12AM

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div className="p-6 space-y-4 h-[calc(100vh-24px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold tracking-[-0.02em]" style={{ color: '#F1F5F9' }}>
          Календарь
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg overflow-hidden" style={{ backgroundColor: '#1E2A42' }}>
            {(['month', 'week', 'day'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs capitalize transition-colors cursor-pointer ${
                  view === v ? 'text-[#F1F5F9]' : 'text-[#64748B]'
                }`}
                style={{
                  backgroundColor: view === v ? '#1E2A42' : 'transparent',
                }}
              >
                  {v === 'month' ? 'месяц' : v === 'week' ? 'неделя' : 'день'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={goPrev}
              className="p-1.5 rounded-lg hover:bg-[#1E2A42] transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} style={{ color: '#94A3B8' }} />
            </button>
            <button
              onClick={goNext}
              className="p-1.5 rounded-lg hover:bg-[#1E2A42] transition-colors cursor-pointer"
            >
              <ChevronRight size={18} style={{ color: '#94A3B8' }} />
            </button>
          </div>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors hover:border-[#D97706]"
            style={{
              color: '#D97706',
              borderColor: 'rgba(217,119,6,0.3)',
            }}
          >
            Сегодня
          </button>
          <button
            onClick={createEvent}
            disabled={!permissions.canManage}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer disabled:opacity-40"
            style={{ backgroundColor: '#D97706' }}
          >
            <Plus size={16} />
            Новое событие
          </button>
        </div>
      </div>

      {/* Current month/year display */}
      <div className="text-sm font-medium" style={{ color: '#94A3B8' }}>
        {format(currentDate, 'LLLL yyyy', { locale: ru })}
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'month' && (
            <motion.div
              key={`month-${currentDate.toISOString()}`}
              className="h-full flex flex-col"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {dayNames.map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs font-medium py-2"
                    style={{ color: '#64748B' }}
                  >
                    {d}
                  </div>
                ))}
              </div>
              {/* Days grid */}
              <div className="grid grid-cols-7 flex-1">
                {monthDays.map((day) => {
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isTodayDate = isSameDay(day, today);
                  const dayEvents = getEventsForDay(day);
                  const isWeekend = getDay(day) === 0 || getDay(day) === 6;

                  return (
                    <motion.div
                      key={day.toISOString()}
                      className="border-t border-r p-2 flex flex-col gap-1 min-h-[80px] cursor-pointer transition-colors"
                      style={{
                        borderColor: 'rgba(148,163,184,0.1)',
                        backgroundColor: isTodayDate
                          ? 'rgba(217,119,6,0.08)'
                          : isWeekend
                          ? 'rgba(0,0,0,0.05)'
                          : 'transparent',
                      }}
                      whileHover={{ backgroundColor: 'rgba(30,42,66,0.3)' }}
                      onClick={() => setCurrentDate(day)}
                    >
                      <div className="flex justify-center">
                        <span
                          className={`w-7 h-7 flex items-center justify-center rounded-full text-sm ${
                            isTodayDate
                              ? 'font-bold'
                              : isCurrentMonth
                              ? 'font-medium'
                              : ''
                          }`}
                          style={{
                            color: isTodayDate
                              ? '#D97706'
                              : isCurrentMonth
                              ? '#F1F5F9'
                              : '#64748B',
                            backgroundColor: isTodayDate ? 'rgba(217,119,6,0.2)' : 'transparent',
                          }}
                        >
                          {format(day, 'd')}
                        </span>
                      </div>
                      <div className="space-y-0.5 mt-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <motion.div
                            key={event.id}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium truncate cursor-pointer"
                            style={{
                              backgroundColor: eventColors[event.color].bg,
                              color: eventColors[event.color].text,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event, e);
                            }}
                            whileHover={{ scale: 1.02 }}
                          >
                            {event.title}
                          </motion.div>
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[10px] px-1.5" style={{ color: '#64748B' }}>
                            +{dayEvents.length - 3} еще
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {view === 'week' && (
            <motion.div
              key={`week-${currentDate.toISOString()}`}
              className="h-full flex flex-col"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Week header */}
              <div className="grid grid-cols-8 border-b" style={{ borderColor: 'rgba(148,163,184,0.1)' }}>
                <div className="p-2" /> {/* Time label column */}
                {weekDays.map((day) => (
                  <div
                    key={day.toISOString()}
                    className="p-2 text-center"
                  >
                    <div
                      className={`text-xs ${isSameDay(day, today) ? 'font-bold' : ''}`}
                      style={{ color: isSameDay(day, today) ? '#D97706' : '#64748B' }}
                    >
                      {format(day, 'EEE', { locale: ru })}
                    </div>
                    <div
                      className={`text-sm mt-0.5 ${isSameDay(day, today) ? 'font-bold' : ''}`}
                      style={{ color: isSameDay(day, today) ? '#D97706' : '#F1F5F9' }}
                    >
                      {format(day, 'd')}
                    </div>
                  </div>
                ))}
              </div>
              {/* Time grid */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-8">
                  {/* Time labels */}
                  <div>
                    {timeSlots.map((hour) => (
                      <div
                        key={hour}
                        className="h-10 flex items-start justify-end pr-2 text-[10px]"
                        style={{ color: '#64748B' }}
                      >
                        {hour}:00
                      </div>
                    ))}
                  </div>
                  {/* Day columns */}
                  {weekDays.map((day) => (
                    <div
                      key={day.toISOString()}
                      className="relative border-l"
                      style={{ borderColor: 'rgba(148,163,184,0.1)' }}
                    >
                      {timeSlots.map((hour) => (
                        <div
                          key={hour}
                          className="h-10 border-b"
                          style={{ borderColor: 'rgba(148,163,184,0.05)' }}
                        />
                      ))}
                      {/* Events */}
                      {events
                        .filter((e) => isSameDay(e.date, day))
                        .map((event) => {
                          const startHour = parseInt(event.startTime.split(':')[0]);
                          const startMin = parseInt(event.startTime.split(':')[1]);
                          const endHour = parseInt(event.endTime.split(':')[0]);
                          const endMin = parseInt(event.endTime.split(':')[1]);
                          const top = (startHour - 7) * 40 + (startMin / 60) * 40;
                          const height = ((endHour - startHour) * 60 + (endMin - startMin)) / 60 * 40;

                          return (
                            <motion.div
                              key={event.id}
                              className="absolute left-0.5 right-0.5 rounded-md px-1.5 py-1 cursor-pointer overflow-hidden"
                              style={{
                                top: `${top}px`,
                                height: `${Math.max(height, 20)}px`,
                                backgroundColor: eventColors[event.color].bg,
                                borderLeft: `3px solid ${eventColors[event.color].text}`,
                              }}
                              onClick={(e) => handleEventClick(event, e)}
                              whileHover={{ scale: 1.02 }}
                            >
                              <span
                                className="text-[10px] font-medium truncate block"
                                style={{ color: eventColors[event.color].text }}
                              >
                                {event.title}
                              </span>
                            </motion.div>
                          );
                        })}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'day' && (
            <motion.div
              key={`day-${currentDate.toISOString()}`}
              className="h-full flex flex-col"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-4">
                <span className="text-lg font-semibold" style={{ color: '#F1F5F9' }}>
                  {format(currentDate, 'EEEE, d MMMM', { locale: ru })}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="relative">
                  {timeSlots.map((hour) => (
                    <div
                      key={hour}
                      className="h-10 border-b flex items-start"
                      style={{ borderColor: 'rgba(148,163,184,0.05)' }}
                    >
                      <span
                        className="text-[10px] w-12 pr-2 text-right flex-shrink-0"
                        style={{ color: '#64748B' }}
                      >
                        {hour}:00
                      </span>
                      <div className="flex-1 border-l" style={{ borderColor: 'rgba(148,163,184,0.05)' }} />
                    </div>
                  ))}
                  {/* Events */}
                  {events
                    .filter((e) => isSameDay(e.date, currentDate))
                    .map((event) => {
                      const startHour = parseInt(event.startTime.split(':')[0]);
                      const startMin = parseInt(event.startTime.split(':')[1]);
                      const endHour = parseInt(event.endTime.split(':')[0]);
                      const endMin = parseInt(event.endTime.split(':')[1]);
                      const top = (startHour - 7) * 40 + (startMin / 60) * 40;
                      const height = ((endHour - startHour) * 60 + (endMin - startMin)) / 60 * 40;

                      return (
                        <motion.div
                          key={event.id}
                          className="absolute left-14 right-4 rounded-lg px-3 py-2 cursor-pointer"
                          style={{
                            top: `${top}px`,
                            height: `${Math.max(height, 30)}px`,
                            backgroundColor: eventColors[event.color].bg,
                            borderLeft: `3px solid ${eventColors[event.color].text}`,
                          }}
                          onClick={(e) => handleEventClick(event, e)}
                          whileHover={{ scale: 1.01 }}
                        >
                          <span
                            className="text-sm font-medium"
                            style={{ color: eventColors[event.color].text }}
                          >
                            {event.title}
                          </span>
                          <span className="text-xs ml-2" style={{ color: '#64748B' }}>
                            {event.startTime} - {event.endTime}
                          </span>
                        </motion.div>
                      );
                    })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Event Popover */}
      <AnimatePresence>
        {selectedEvent && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="absolute"
              style={{ left: popoverPos.x, top: popoverPos.y }}
              onClick={(e) => e.stopPropagation()}
            >
              <EventPopover
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                canManage={permissions.canManage}
                onEdit={editSelectedEvent}
                onDelete={deleteSelectedEvent}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
