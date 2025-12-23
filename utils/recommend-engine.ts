import supabase from './supabase'; 
import { OpenAI } from "openai";
import { unstable_cache } from 'next/cache'; // ★これが必須

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * AIによる厳選ロジックの本体
 */
export const getAIPickedShows = async (shows: any[]) => {
  if (!shows || shows.length === 0) return [];

  const showListForAI = shows.map(s => ({
    id: s.id,
    title: s.title,
    performers: s.performers
  }));

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "あなたはお笑いライブの専門家です。提供されたリストの中から、人気芸人が出ている注目のライブを最大6つ選び、そのIDをJSON形式 {'picked_ids': []} で返してください。"
      },
      {
        role: "user",
        content: JSON.stringify(showListForAI)
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return [];

  try {
    const pickedIds = JSON.parse(content).picked_ids;
    return shows.filter(s => pickedIds.includes(s.id));
  } catch (error) {
    console.error("JSONパースエラー:", error);
    return [];
  }
};

/**
 * ★今回のエラーの原因：この関数がファイル内に存在し、かつ "export" されている必要があります
 */
export const getCachedAIPickedShows = unstable_cache(
  async (candidates: any[]) => {
    console.log("AIレコメンドを更新中... (API実行)");
    return await getAIPickedShows(candidates);
  },
  ['ai-picked-shows-cache'],
  { 
    revalidate: 86400, 
    tags: ['recommendations'] 
  }
);