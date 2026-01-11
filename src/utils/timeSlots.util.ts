export const generateTimeSlots = (
  date: string,
  opening: string,
  closing: string,
  duration: number,
  interval = 30
) => {
  const slots: string[] = [];
  let current = new Date(`${date}T${opening}:00`);
  const end = new Date(`${date}T${closing}:00`);

  while (current.getTime() + duration * 60000 <= end.getTime()) {
    slots.push(new Date(current).toISOString());
    current.setMinutes(current.getMinutes() + interval);
  }
  return slots;
};
