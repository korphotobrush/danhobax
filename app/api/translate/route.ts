import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY })

const MODELS = [
  'llama-3.3-70b-versatile',
  'qwen/qwen3-32b',
  'llama-4-scout-17b-16e-instruct',
  'llama-3.1-8b-instant',
  'gemma2-9b-it',
]

const MAX_INPUT_LENGTH = 500
const MIN_INPUT_LENGTH = 2

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { text, target, level } = body

  // 서버 사이드 입력 검증
  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: '텍스트를 입력해주세요.' }, { status: 400 })
  }
  if (text.length < MIN_INPUT_LENGTH) {
    return NextResponse.json({ error: '너무 짧아요. 조금 더 입력해주세요.' }, { status: 400 })
  }
  if (text.length > MAX_INPUT_LENGTH) {
    return NextResponse.json({ error: `${MAX_INPUT_LENGTH}자 이하로 입력해주세요.` }, { status: 400 })
  }

    const levelGuide: Record<number, string> = {
    1: `직접적이지만 그나마 예의는 있음. 쿠션어만 제거. 불필요한 사과나 "혹시" "죄송" 같은 말 없애기. 예) "확인 부탁드립니다." / "내일까지 보내주세요."`,
    2: `단호하고 간결하게. 존댓말은 유지하되 군더더기 없이. 예) "내일까지 주세요." / "이건 어렵습니다."`,
    3: `확실하고 건조하게. 감정 없이 팩트만. 예) "안 됩니다." / "해주세요." / "이건 제 일이 아닙니다."`,
    4: `기분 나쁠 정도로 직설적. 존댓말 최소화. 상대가 좀 당황할 수 있음. 예) "그냥 해줘요." / "왜 제가 해야 하죠?" / "됩니다 안."`,
    5: `정뚝떨. 이미 정이 다 떨어진 사람한테 억지로 답장하는 톤. 질문형 금지. 짧게 끊어서 말함. 감정. 예) "알아서 해." / "됐어." / "그냥 해." / "몰라." / "끝내고 가." / "내 알 바 아님."`,
  }

  const prompt = `당신은 "쿠션어 → 단호박어" 번역기입니다.
쿠션어(부드럽게 포장한 말)를 실제로 속으로 하고 싶었던 진짜 말로 번역하세요.

강도 ${level}/5:
${levelGuide[level]}

상대방: ${target}
입력: "${text}"

규칙:
- 강도 차이가 결과에 명확히 드러나야 함
- 강도 5는 진짜로 정 떨어진 사람이 억지로 답장하는 느낌
- 한국어로만 응답
- 번역문은 1~2문장으로 짧게

JSON 형식으로만 (마크다운 없이):
{"translation": "번역된 단호박어", "tip": "한 줄 코멘트"}`

  let lastError: unknown
  for (const model of MODELS) {
    try {
      const completion = await getGroq().chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: level >= 4 ? 1.0 : 0.8,
        response_format: { type: 'json_object' },
        max_tokens: 300,
      })
      const result = JSON.parse(completion.choices[0].message.content || '{}')
      return NextResponse.json(result)
    } catch (e: any) {
      if (e?.status === 429 || e?.status === 503) {
        lastError = e
        continue
      }
      throw e
    }
  }

  return NextResponse.json({ error: '잠시 후 다시 시도해주세요. 🙏' }, { status: 429 })
}
