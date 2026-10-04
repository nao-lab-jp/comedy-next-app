import DateEventsPage, { eventsOn } from '@/app/components/DateEventsPage';
import { formatMonthDay, jstToday } from '@/utils/jst';

// 日付が変わったら中身が変わるので短めに作り直す(10分)。1ページだけなので軽い
export const revalidate = 600;

export async function generateMetadata() {
  const today = jstToday();
  const count = eventsOn([today]).length;
  return {
    title: `今日 ${formatMonthDay(today)}の東京お笑いライブ一覧`,
    description: `今日${formatMonthDay(today)}に東京で開催されるお笑いライブ${count}件の一覧。会場・出演者・チケット情報をまとめています。`,
  };
}

export default function TodayPage() {
  const today = jstToday();
  return (
    <DateEventsPage
      heading={`今日 ${formatMonthDay(today)}のお笑いライブ`}
      lead={`今日${formatMonthDay(today)}に`}
      dates={[today]}
      current="/today"
    />
  );
}
