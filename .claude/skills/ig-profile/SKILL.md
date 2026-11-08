---
name: ig-profile
description: >-
  Score an Instagram profile out of 100 against a 12-part rubric and rewrite
  the parts that lose points - name field, bio, link, highlights, pinned three,
  grid. Use when the user says "optimize my profile", "fix my bio", "score my
  Instagram", "why don't people follow me", or pastes their profile and asks how
  it reads.
---

# ig-profile

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
- 100점 채점은 기준표로 클로드가 직접 매기는 점수라서 숫자를 그대로 보여준다.

Almost everybody optimises the wrong thing here. The profile is not a
storefront people browse. It is a **decision screen**, arrived at from one
reel, and it gets about three seconds to answer one question: is there more of
that here, and is it for me.

## Input

Ask the user to paste or screenshot: the name field, the handle, the bio, what
the link points to, the highlight names, what is pinned, and the first nine
grid covers. A screenshot of the top of the profile plus the first two grid
rows is enough for a first pass.

Do not log into Instagram on their behalf.

## Score it

Read `rubric.json` in this folder. Twelve items, 100 points, each with what
full marks looks like and how it usually fails. Score every item, show the
table, give the total. Be honest. Most profiles land in the 30s and 40s on the
first pass and a generous score is useless.

```
PROFILE SCORE  38/100

  name field       2/12   name only, no words anyone searches
  bio first line   3/12   three nouns and a coffee emoji
  pinned three     0/10   nothing pinned
  highlights       2/8    "Random", "Life", "2023"
  grid legibility  4/8    six of nine covers are a face mid-sentence
  ...
```

## Then rewrite, in this order

Fix in descending order of points lost. Do not rewrite everything at once, the
user has to actually go and change each of these.

**1. The name field (30 characters).** The bold line under the photo, not the
handle. This is the field Instagram search matches against, and most accounts
put a name in it and nothing else. Format that works:
`{Name} | {what you do, in searched words}`. Give three options.

**2. Bio line one.** Who this is for and what changes. Not a job title, not
adjectives, not a pipe-separated list of identities. The rest of the 150
characters carries one piece of proof or one plain offer.

**3. The pinned three.** Three slots, three different jobs: the best proof, the
clearest explanation of the offer, the best introduction to the person. This is
the highest-leverage fix on the whole profile and it takes four taps. An
unpinned grid shows whatever was posted last, which is a coin flip.

**4. Highlights.** Four to six, named for the questions a buyer asks: Pricing,
Results, How it works, About. Not "Random". Delete the rest.

**5. The link.** One destination that matches what the bio just promised. Five
are allowed; two is already a menu and a menu converts worse than a door.

**6. Grid covers.** The first nine at thumbnail size. Reel covers get chosen,
not left as whatever frame one was. Four words of text on a cover makes a grid
readable in one glance.

## Output

Score table, then the rewrites as copy-ready blocks in fix-first order, each
run through `/ig-human`. Re-score at the end and show the delta honestly. If
the rewrite reaches 84 and not 98, say 84, and say what the rest needs, which
is usually a grid, a story habit and a pinned post that does not exist yet.
None of that is a rewrite.

Nothing is saved to Instagram by this skill. The user edits each field.
