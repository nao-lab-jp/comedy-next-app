import DateEventsPage, { eventsOn } from '@/app/components/DateEventsPage';
import { formatMonthDay, weekendDates } from '@/utils/jst';

// 日付が変わったら中身が変わるので短めに作り直す(10分)。1ページだけなので軽い
export const revalidate = 600;

function weekendLabel(dates) {
  return dates.map(formatMonthDay).join('〜');
}

export async function generateMetadata() {
  const dates = weekendDates();
  const count = eventsOn(dates).length;
  return {
    title: `今週末 ${weekendLabel(dates)}の東京お笑いライブ一覧`,
    description: `今週末${weekendLabel(dates)}に東京で開催されるお笑いライブ${count}件の一覧。土日のお笑いライブを会場・出演者からまとめて探せます。`,
  };
}

export default function WeekendPage() {
  const dates = weekendDates();
  return (
    <DateEventsPage
      heading="今週末（土日）のお笑いライブ"
      lead={`今週末${weekendLabel(dates)}に`}
      dates={dates}
      current="/weekend"
    />
  );
}
