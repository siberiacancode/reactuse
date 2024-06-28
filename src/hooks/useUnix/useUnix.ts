import { useMemo, useCallback } from 'react';

/** Типы временных единиц */
export type TimeUnit = 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y';

/** Форматы даты */
export type DateFormat = 'ISO' | 'RFC2822' | 'UTC' | string;

/** Опции для хука useUnix */
export interface UseUnixOptions {
  /** Формат даты по умолчанию */
  defaultFormat?: DateFormat;
  /** Часовой пояс по умолчанию */
  defaultTimezone?: string;
}

/** Интерфейс хука useUnix */
export interface UseUnixHook {
  /** Получить текущее Unix-время */
  getUnixTime: () => number;
  /** Форматировать Unix-время в строку */
  formatUnixTime: (unit: number, format?: DateFormat, timezone?: string) => string;
  /** Добавить время к Unix-времени */
  addTime: (unit: number, timeSet: TimeUnit, value: number) => number;
  /** Вычесть время из Unix-времени */
  subtractTime: (unit: number, timeSet: TimeUnit, value: number) => number;
  /** Сравнить два Unix-времени */
  compareUnixTimes: (unit1: number, unit2: number) => number;
  /** Проверить, является ли год високосным */
  isLeapYear: (year: number) => boolean;
  /** Получить количество дней в месяце */
  getDaysInMonth: (year: number, month: number) => number;
  /** Получить номер недели в году */
  getWeekNumber: (date: Date) => number;
  /** Преобразовать строку даты в Unix-время */
  parseToUnixTime: (dateString: string, format?: DateFormat) => number;
}

/**
 * Хук для работы с Unix-временем
 * @param {UseUnixOptions} [options] - Опции для настройки хука
 * @returns {UseUnixHook} - Объект с методами для работы с Unix-временем
 */
const useUnix = (options: UseUnixOptions = {}): UseUnixHook => {
  const { defaultFormat = 'ISO', defaultTimezone = 'UTC' } = options;

  /**
   * Получить текущее Unix-время
   * @returns Текущее Unix-время в секундах
   */
  const getUnixTime = useCallback((): number => {
    return Math.floor(Date.now() / 1000);
  }, []);

  /**
   * Форматировать Unix-время в строку
   * @param unit - Unix-время в секундах
   * @param format - Формат вывода
   * @param timezone - Часовой пояс
   * @returns Отформатированная строка даты и времени
   */
  const formatUnixTime = useCallback(
    (
      unit: number,
      format: DateFormat = defaultFormat,
      timezone: string = defaultTimezone
    ): string => {
      const date = new Date(unit * 1000);

      if (format === 'ISO') {
        return date.toISOString();
      } else if (format === 'RFC2822') {
        return date.toUTCString();
      } else if (format === 'UTC') {
        return date.toUTCString();
      } else {
        return formatCustom(date, format, timezone);
      }
    },
    [defaultFormat, defaultTimezone]
  );

  /**
   * Форматировать дату по пользовательскому шаблону
   * @param date - Объект Date
   * @param format - Пользовательский формат
   * @param timezone - Часовой пояс
   * @returns Отформатированная строка даты
   */
  const formatCustom = (date: Date, format: string, timezone: string): string => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const parts = formatter.formatToParts(date);
    const formatted = format.replace(/Y+|M+|D+|H+|m+|s+|S+/g, (match) => {
      const part = parts.find(
        (p) => p.type.charAt(0).toLowerCase() === match.charAt(0).toLowerCase()
      );
      return part ? part.value.padStart(match.length, '0') : match;
    });

    return formatted;
  };

  /**
   * Изменить Unix-время
   * @param unit - Исходное Unix-время
   * @param timeSet - Единица времени для изменения
   * @param value - Значение для изменения
   * @param isAdd - Флаг добавления/вычитания
   * @returns Измененное Unix-время
   */
  const modifyTime = useCallback(
    (unit: number, timeSet: TimeUnit, value: number, isAdd: boolean): number => {
      const date = new Date(unit * 1000);
      const modifier = isAdd ? 1 : -1;

      switch (timeSet) {
        case 's':
          date.setSeconds(date.getSeconds() + modifier * value);
          break;
        case 'm':
          date.setMinutes(date.getMinutes() + modifier * value);
          break;
        case 'h':
          date.setHours(date.getHours() + modifier * value);
          break;
        case 'd':
          date.setDate(date.getDate() + modifier * value);
          break;
        case 'w':
          date.setDate(date.getDate() + modifier * value * 7);
          break;
        case 'M':
          date.setMonth(date.getMonth() + modifier * value);
          break;
        case 'y':
          date.setFullYear(date.getFullYear() + modifier * value);
          break;
      }

      return Math.floor(date.getTime() / 1000);
    },
    []
  );

  /**
   * Добавить время к Unix-времени
   * @param unit - Исходное Unix-время
   * @param timeSet - Единица времени для добавления
   * @param value - Значение для добавления
   * @returns Новое Unix-время
   */
  const addTime = useCallback(
    (unit: number, timeSet: TimeUnit, value: number): number => {
      return modifyTime(unit, timeSet, value, true);
    },
    [modifyTime]
  );

  /**
   * Вычесть время из Unix-времени
   * @param unit - Исходное Unix-время
   * @param timeSet - Единица времени для вычитания
   * @param value - Значение для вычитания
   * @returns Новое Unix-время
   */
  const subtractTime = useCallback(
    (unit: number, timeSet: TimeUnit, value: number): number => {
      return modifyTime(unit, timeSet, value, false);
    },
    [modifyTime]
  );

  /**
   * Сравнить два Unix-времени
   * @param unit1 - Первое Unix-время
   * @param unit2 - Второе Unix-время
   * @returns Разница между временами
   */
  const compareUnixTimes = useCallback((unit1: number, unit2: number): number => {
    return unit1 - unit2;
  }, []);

  /**
   * Проверить, является ли год високосным
   * @param year - Год для проверки
   * @returns true, если год високосный
   */
  const isLeapYear = useCallback((year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }, []);

  /**
   * Получить количество дней в месяце
   * @param year - Год
   * @param month - Месяц (0-11)
   * @returns Количество дней в месяце
   */
  const getDaysInMonth = useCallback((year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  }, []);

  /**
   * Получить номер недели в году
   * @param date - Дата
   * @returns Номер недели
   */
  const getWeekNumber = useCallback((date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }, []);

  /**
   * Преобразовать строку даты в Unix-время
   * @param dateString - Строка даты
   * @param format - Формат даты
   * @returns Unix-время
   */
  const parseToUnixTime = useCallback(
    (dateString: string, format: DateFormat = defaultFormat): number => {
      if (format === 'ISO' || format === 'RFC2822' || format === 'UTC') {
        return Math.floor(new Date(dateString).getTime() / 1000);
      } else {
        const parsedDate = parseCustomFormat(dateString, format);
        return Math.floor(parsedDate.getTime() / 1000);
      }
    },
    [defaultFormat]
  );

  /**
   * Разобрать дату из пользовательского формата
   * @param dateString - Строка даты
   * @param format - Формат даты
   * @returns Объект Date
   */
  const parseCustomFormat = (dateString: string, format: string): Date => {
    const formatParts = format.match(/Y+|M+|D+|H+|m+|s+|S+/g) || [];
    const dateParts = dateString.match(/\d+/g) || [];

    const dateObj: { [key: string]: number } = {};
    formatParts.forEach((part, index) => {
      const value = parseInt(dateParts[index], 10);
      switch (part[0]) {
        case 'Y':
          dateObj.year = value;
          break;
        case 'M':
          dateObj.month = value - 1;
          break;
        case 'D':
          dateObj.day = value;
          break;
        case 'm':
          dateObj.minute = value;
          break;
        case 's':
          dateObj.second = value;
          break;
        case 'S':
          dateObj.millisecond = value;
          break;
        default:
          dateObj.hour = value;
          break;
      }
    });

    return new Date(
      dateObj.year || 0,
      dateObj.month || 0,
      dateObj.day || 1,
      dateObj.hour || 0,
      dateObj.minute || 0,
      dateObj.second || 0,
      dateObj.millisecond || 0
    );
  };

  return useMemo(
    () => ({
      getUnixTime,
      formatUnixTime,
      addTime,
      subtractTime,
      compareUnixTimes,
      isLeapYear,
      getDaysInMonth,
      getWeekNumber,
      parseToUnixTime
    }),
    [
      getUnixTime,
      formatUnixTime,
      addTime,
      subtractTime,
      compareUnixTimes,
      isLeapYear,
      getDaysInMonth,
      getWeekNumber,
      parseToUnixTime
    ]
  );
};
export default useUnix;
