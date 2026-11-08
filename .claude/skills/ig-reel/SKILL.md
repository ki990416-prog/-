---
name: ig-reel
description: >-
  Write an Instagram Reel from a raw idea - hook options off 26 formulas, the
  spoken script, the on-screen text, and a timed beat sheet - in the user's own
  voice and scored before they shoot it. Use whenever the user wants a Reel, a
  short-form video script, a hook, a voiceover, "make a reel about X", "what
  should I say in this video", or is about to record and does not have the
  first line yet.
---

# ig-reel

## 한국어 규칙 (이 섹션이 아래 영어 지침보다 우선한다)

1. **결과는 전부 자연스러운 한국어 구어체로 쓴다.** 대본, 캡션, 댓글, 답글, DM,
   설명, 보고 블록까지 모두. 번역투("~하는 것은 중요합니다", "~에 대해 이야기해
   보겠습니다")가 아니라 사람이 실제로 말하듯이 쓴다. 아래 템플릿과 예시가
   영어여도 구조만 가져오고 문장은 한국어로 새로 쓴다.
2. **영어 기준 파이썬 채점 도구는 한국어에 쓰지 않는다.** `hookscore.py`,
   `beats.py`, `detect.py`, `caption.py`는 단어와 패턴을 영어로만 세기 때문에
   한국어에서는 결과가 틀린다. 대신 이 SKILL.md에 적힌 기준을 직접 읽고
   판단해서, 숫자 점수 대신 항목마다 **통과** 또는 **고칠 점 + 이유**로
   알려준다. 아래 지침이 "점수를 보여줘라", "50점 미만이면", "PASS가 나올 때까지
   다시 돌려라"라고 하면 이 방식으로 바꿔서 따른다.
3. **클로드가 기준표로 직접 매기는 점수는 그대로 보여준다.** 프로필 100점 채점처럼
   파이썬 도구가 아니라 기준표를 읽고 매기는 점수는 한국어에도 그대로 쓴다.

이 스킬에서는:
- `hookscore.py`와 `beats.py`를 돌리지 않는다.
- 훅 세 개는 각각 다음 기준으로 통과 / 고칠 점을 준다: 3초 안에 말할 수 있는
  길이인지, 숫자나 이름처럼 확인할 수 있는 게 들어 있는지, 걸려 있는 것(손해,
  실수, 반전)이 있는지, 핵심 단어가 앞쪽에 있는지, 보는 사람을 향해 말하는지,
  인사나 "이번 영상에서는" 같은 서론이 없는지. 그중 가장 나은 훅을 고르고 이유를
  말한다.
- 비트 시트는 직접 만든다. 시간은 한국어 구어 기준 대략 1초에 5~6음절로 어림해서
  "약 N초"로 적고, 어림이라고 밝힌다. 훅이 3초를 넘는지, 4초 넘는 비트, 구체적인
  게 없는 비트가 세 개 이상 이어지는지, 마지막 줄이 훅의 단어를 다시 쓰는지(루프)를
  통과 / 고칠 점으로 알려준다.
- `REEL READY` 블록의 hook 줄과 humanizer 줄은 점수 대신 `통과` 또는
  `고칠 점: ...`으로 쓴다.

Turns one raw idea into a Reel that somebody finishes.

Two tools live in this folder and they both actually run. Use them. Do not
eyeball the hook and do not guess at the length.

```bash
python3 hookscore.py hooks.txt              # rank your hook options
python3 hookscore.py --hook "one line"      # score a single one
python3 beats.py script.txt --target 30     # timed beat sheet before you shoot
```

## Before you write

1. Read `~/.claude/instagram/voice.md` if it exists. That is the user's voice
   profile: how they talk on camera, what they never say, who they are talking
   to. If it does not exist, ask for **three of their own reels**, transcribe or
   read them, infer the voice, and write the file. A script in the wrong voice
   is unusable, because they have to say it out loud.
2. Read `hooks.json` in this folder. 26 formulas, each with a template, a filled
   example, the on-screen version, what it is for, and how it gets ruined.
   Four of them are in there because they kept turning up in real hooks, not
   because they completed a pattern.
3. If the idea is thin, do not pad it. Ask one batched question: what happened,
   to whom, and what did it cost or return. A Reel needs one specific true
   thing. Get it before writing.
4. If `~/.claude/instagram/swipe.md` exists, read it. `/ig-viral` writes that
   file, and it is the user's own evidence about which formulas are working in
   their niche right now. It beats the defaults in this file.

## The shape

A Reel is decided in the first two seconds and kept by the next five.

```
0:00 - 0:02   HOOK        the claim. Spoken line and on-screen line, written
                          separately. Motion in the first frame, not a static face.
0:02 - 0:07   THE STAKE   why this matters to the person watching. One line.
0:07 - ...    THE BODY    one idea per beat, and the frame changes every beat.
LAST 3s       THE PAYOFF  deliver what the hook promised, then the single ask.
LAST LINE     THE LOOP    echo one word from the hook so the replay lands clean.
```

Length: 15 to 45 seconds is the working range. Reels run to 3 minutes and
almost nobody should use it. Under 7 seconds the loop counts inflate and
nothing else does.

## The loop

**1. Pick three hooks, not one.** Run the idea through `hooks.json`, choose
three formulas that genuinely fit it, and write the spoken line plus the
on-screen line for each. Different formulas, not three rewrites of one.

**2. Score them.** Put the three spoken lines in a file, one per line, and run
`hookscore.py`. Show the user the ranking. If the top one is under 50, you do
not have the hook yet and no amount of editing fixes that.

**3. Write the script** on the winning hook. Plain spoken language, the way the
user actually talks. Contractions. Short lines. No sentence they would have to
rehearse.

**4. Time it.** Run `beats.py script.txt --target {length}`. Fix every flag:
a hook past 3 seconds, any beat over 4 seconds, a run of beats with nothing
concrete in them, no loop. Re-run until it is clean.

**5. Humanize it.** Run the script through `/ig-human` before showing it. A
written-sounding line is obvious the moment someone says it out loud.

**6. Print the block.** The script in a fenced block, the on-screen text as a
separate list with timings, and then:

```
REEL READY
hook:       #3 Nobody Tells You, scored 86 STRONG
length:     28.4s across 9 beats at 165 wpm
on-screen:  6 cards
humanizer:  4 artefacts stripped, human score 81 PASS
caption:    run /ig-caption next

Reply "yes" to log it, or tell me what to change.
```

**7. Never publish.** This skill produces a script. The user shoots it and
posts it. On "yes", append to `~/.claude/instagram/log.md` with the date, the
hook formula used and the first line, so `/ig-audit` has a history later.

## On-screen text is a separate script

Write it separately, every time. It is read before it is heard.

- **Six words or fewer per card.** It is being read at arm's length by someone
  who is not listening yet.
- **The hook card is up at frame 1**, not after a beat of silence.
- **Keep it inside the safe zone.** On a 1080x1920 frame, nothing above y=230
  or below y=1440, and keep the right 230 pixels clear. The interface sits on
  top of everything outside that box: the caption, the action rail, the audio
  strip.
- **Never put the hook where the caption sits.** That is the bottom of the
  frame and it is covered.
- **Burn in captions for the body.** Most people watch muted first.

## Rules that make the difference

- **One idea per Reel.** If the script has two, you have two Reels. Say so.
- **Numbers over adjectives.** "$4,200" beats "a lot". If the user has not
  given a number, ask for one rather than writing around the hole.
- **Cut the intro.** No greeting, no "in this video", no name, no logo sting.
  The video starts at the sentence you would normally reach at second six.
- **Change the frame every beat.** A static shot for 8 seconds is where people
  leave, and `beats.py` will flag it.
- **One ask at the end.** Comment a keyword, save it, or follow. One.
- **Never fabricate.** No invented metrics, clients, revenue or outcomes under
  the user's name, even as a placeholder. If a number is needed and unknown,
  leave `{{your number}}` in the script and flag it.
- **Do not write a script around a trending audio the user cannot use.** If the
  idea needs the user's own voice, say so.

## Example

```
/ig-reel we cut proposal time from 5 hours to 20 minutes with one template
```

```
HOOKS  (scored)
  86  STRONG  #5  Time Collapse   "Proposals used to take me five hours. Twenty minutes now."
                                  on screen: 5 HOURS -> 20 MIN
  71  STRONG  #1  Cost Confession "I billed four hours a week for formatting. For two years."
                                  on screen: 2 YEARS WASTED
  54  OK      #9  The Steal       "Steal the proposal template that did it."
                                  on screen: STEAL THIS

Shooting #5: the ratio is believable, it reads in one glance on screen,
and the number is yours.
```
