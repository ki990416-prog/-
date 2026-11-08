---
name: ig-comment
description: >-
  Write comments on other people's Instagram posts and reels that read as a
  person with an opinion, not a bot. Use when the user pastes a post or a reel
  and wants a comment, says "comment on this", "engage with this", "what do I
  say here", or wants a batch for their daily engagement round.
---

# ig-comment

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

이 스킬에는 파이썬 채점 도구가 없다. 다른 스킬(`/ig-human` 등)을 거치라는
지침이 있으면 그 스킬의 한국어 규칙을 따른다.

Commenting is the highest-leverage twenty minutes on Instagram and the easiest
to do badly. A comment near the top of a reel with 40,000 views is seen by more
people than most accounts' own posts, and it is the one place where a stranger
can tap straight through to a profile.

A generic comment is worse than none. It costs a tap that goes nowhere and it
marks the account as an engagement-pod account to the one person whose opinion
mattered, which is the creator.

## Input

The user pastes the post or reel text, or a screenshot, with the account name.
If they give a URL you cannot open, ask them to paste it. Do not use a browser
tool to scrape the feed and do not post anything.

## The nine comment types

Pick by what the post actually is. Never default to type 1.

| # | type | when | shape |
| --- | --- | --- | --- |
| 1 | **Add a datum** | the post makes a claim you can support with a number | "Same for us: 40% of..." |
| 2 | **Add the missing case** | the post is right but incomplete | "This holds until {condition}." |
| 3 | **Respectful disagree** | you genuinely think it is wrong | name the agreement first, then the fork |
| 4 | **Extend one line** | one line in it is the good one | quote it, build on it |
| 5 | **Ask the real question** | the post skipped the hard part | one question, specific |
| 6 | **The receipt** | you have done the thing they described | what happened, two sentences |
| 7 | **The correction** | there is a factual error | be right, be brief, be kind, be sure |
| 8 | **The reframe** | right facts, wrong frame | "Another way to read this:" |
| 9 | **The one-liner** | the post needs nothing, you want presence | under 10 words, must be funny or true |

## Rules

- **One to three sentences.** Instagram comments are read in a narrow column
  under a video. A paragraph gets collapsed behind "more" and nobody taps it.
- **Never open with** "Great post", "Love this", "So true", "This 👏", "Needed
  this today", or the creator's first name with an exclamation mark. All of
  them are invisible.
- **No emoji-only comments** and no emoji as the first character.
- **Never restate the reel.** Everybody watching just watched it.
- **One idea.** A comment with two points reads as a hijack.
- **Say the specific thing.** If the comment could sit under any post on the
  topic, it is not a comment, it is noise.
- **No pitching, ever.** Not the offer, not the link, not "check out my page".
  That is the fastest way to be blocked by exactly the person you were trying
  to reach.
- **Early matters more here than anywhere.** A comment in the first hour on a
  reel that then travels gets carried with it.

## Output

Give **two options of different types**, labelled, plus one line on which you
would post and why. Run both through `/ig-human` first: comments are short, so
an em dash or a stock phrase is proportionally louder than it is in a caption.

```
COMMENT OPTIONS  (on @acct's reel about pricing)

[6 · Receipt]
We raised ours 40% last March and lost exactly one client, who was the one
taking up half the inbox. Took eight months to stop being scared of it.

[3 · Respectful disagree]
Agree on the anchoring. The part I would push back on is doing it mid-project.
We tried that and it cost us a renewal that was otherwise fine.

Post the first. It concedes something and it has a number in it.
```

## Batch mode

For an engagement round, ask for the 5 to 10 posts as pasted text in one
message, return one comment each in a single block, and keep a running note in
`~/.claude/instagram/log.md` of who has been commented on this week.
Commenting on the same three accounts every day is visible and it looks like
exactly what it is.

## Never

Do not auto-post, do not automate comments, and do not use a browser tool to
publish on the user's behalf. Automated engagement violates Instagram's Terms
of Use and gets accounts action-blocked. This skill writes the comment. The
user posts it.
