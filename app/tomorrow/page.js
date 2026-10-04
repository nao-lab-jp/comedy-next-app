import DateEventsPage, { eventsOn } from '@/app/components/DateEventsPage';
import { addDays, formatMonthDay, jstToday } from '@/utils/jst';

// 日付が変わったら中身が変わるので短めに作り直す(10分)。1ページだけなので軽い
export const revalidate = 600;

export async function generateMetadata() {
  const tomorrow = addDays(jstToday(), 1);
  const count = eventsOn([tomorrow]).length;
  return {
    title: `明日 ${formatMonthDay(tomorrow)}の東京お笑いライブ一覧`,
    description: `明日${formatMonthDay(tomorrow)}に東京で開催されるお笑いライブ${count}件の一覧。会場・出演者・チケット情報をまとめています。`,
  };
}

export default function TomorrowPage() {
  const tomorrow = addDays(jstToday(), 1);
  return (
    <DateEventsPage
      heading={`明日 ${formatMonthDay(tomorrow)}のお笑いライブ`}
      lead={`明日${formatMonthDay(tomorrow)}に`}
      dates={[tomorrow]}
      current="/tomorrow"
    />
  );
}
