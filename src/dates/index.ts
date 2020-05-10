export interface OffsetDateTime extends Date {};
export interface LocalDateTime extends Date { isFloating: true };
export interface LocalDate extends Date { isDate: true };
export interface LocalTime extends Date { isTime: true };

export const isOffsetDateTime = (date: Date): date is OffsetDateTime =>
  !(date as LocalDateTime).isFloating &&
  !(date as LocalDate).isDate &&
  !(date as LocalTime).isTime;

export const isLocalDateTime = (date: Date): date is LocalDateTime =>
  !!(date as LocalDateTime).isFloating;

export const isLocalDate = (date: Date): date is LocalDate =>
  !!(date as LocalDate).isDate;

export const isLocalTime = (date: Date): date is LocalTime =>
  !!(date as LocalTime).isTime;
