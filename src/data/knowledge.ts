import type { KnowledgeArticle } from '../types'

const baseUrl = '/images/knowledge'

export const knowledgeArticles: KnowledgeArticle[] = [
  // ──────────────── 技术百科 ────────────────
  {
    id: 'what-is-top-roll',
    title: '什么是 Top Roll — 腕力最核心的进攻技术',
    category: 'technique',
    coverImage: `${baseUrl}/what-is-top-roll.jpg`,
    readTime: 7,
    summary: 'Top Roll（翻腕/外旋）是腕力比赛中最核心的进攻技术之一。本文基于运动生物力学研究，系统讲解发力机制、肌群参与和技术要点。',
    tags: ['Top Roll', '进攻技术', '核心技术', '生物力学'],
    relatedCourses: ['aw-technique-toproll', 'aw-basic-stance'],
    relatedArticles: ['hook-technique', 'press-technique'],
    lastUpdated: '2026-07',
    disclaimer: '本内容仅供学习参考，训练前请评估自身身体状况。如有不适请立即停止并咨询专业人士。',
    references: [
      { title: 'Priorities of technical action "top roll" at the initial stage of sports specialization', source: 'Zhivoderov A.V., Scientific Notes of P.F. Lesgaft University, 2013', url: 'https://cyberleninka.ru/article/n/prioritety-tehnicheskogo-deystviya-top-roll-na-etape-nachalnoy-sportivnoy-spetsializatsii' },
      { title: 'Science for Armwrestling', source: 'Ryoo H.J., viXra, 2021', url: 'https://vixra.org/abs/2101.0006' },
      { title: 'Best Strength Training Program for Armwrestling', source: 'T Nation / Biotest' },
    ],
    content: `Top Roll（翻腕或外旋）是腕力比赛中的核心进攻技术。它的原理是通过前臂旋后（掌心朝向自己）和手腕尺偏的组合动作，改变对手的握持角度，从而获得机械优势。本质上是利用杠杆原理——用结构优势去对抗力量优势。

根据 Zhivoderov（2013）的生物力学研究，Top Roll 在使用时的肘关节角度约为 69.9° ± 0.7，腕关节角度约为 118.2° ± 1.3，是所有腕力技术中关节角度最小的。较小的关节角度意味着更短的力臂和更高的机械效率。同一研究的肌电图（EMG）数据显示，Top Roll 在所有测试技术中表现出最均衡的肌群激活模式——肱桡肌 2.35 mV·s，前臂屈肌 2.34 mV·s，肱二头肌 2.32 mV·s，说明它不像其他技术那样过度依赖单一肌群。

## 发力链解析

### 第一步：下肢驱动

力量从脚底开始。前脚踩实地面，腿部微屈蓄力。在发力的瞬间，腿部爆发性地蹬地，将力量通过髋部传导至上身。

### 第二步：核心稳定

在蹬地的同时，核心肌群（腹横肌、腹斜肌、竖脊肌）收紧，为力量传导提供一个刚性平台。如果核心松掉，下肢产生的力量在到达上半身之前就已经消散了大半。

### 第三步：肩背拉动

背阔肌和斜方肌在 Top Roll 中扮演关键角色。在开把瞬间，肩胛骨后收下压，背阔肌发力向身体方向拉动整个手臂。这是 Top Roll 和 Hook 最大的区别之一——Top Roll 需要强大的后拉力，而 Hook 更需要前推力。

### 第四步：旋后翻腕

在背部拉动的同时，前臂做旋后运动（掌心转向自己），手腕向尺侧偏转（小指方向）。这个组合动作就是"翻"的核心——你的手会从对手手的下方翻到上方。

### 第五步：手指锁定

从始至终，手指都必须保持最大力度的握持。Top Roll 一旦建立角度优势，最后通过身体侧压和持续的手指握力将对手的手压向桌面。

## 适用人群

手指握力出色、前臂旋后肌群发达、臂展偏短的选手通常更适合以 Top Roll 作为主力技术。根据 Zhivoderov 的研究，以 Top Roll 为主的训练方案在 6 个月后使运动员的力量增长达到 +48.1%，而对照组（只练 Hook 和"顶"技术）为 +26.9%。

## 实战应用场景

Top Roll 最适合：
- 面对 Hook 型选手——可以绕过对手的前臂屈肌优势，直接攻击其手指和手腕的防守薄弱环节
- 开把抢先手——在"GO"的瞬间抢先建立翻腕角度，占据主动
- 防守转换——当对手进攻不利时，快速从防守姿势转换到 Top Roll 反攻

## 推荐训练方法

- 哑铃旋后训练：前臂固定，掌心从向下翻转到向上
- 弹力带后拉：模拟 Top Roll 的后拉动作
- 宽距引体向上：强化背阔肌后拉力量
- 握力器渐进挤压：增强手指握持力`,
  },
  {
    id: 'hook-technique',
    title: 'Hook 技术详解 — 力量型选手的首选武器',
    category: 'technique',
    coverImage: `${baseUrl}/hook-technique.jpg`,
    readTime: 7,
    summary: 'Hook（勾手）是腕力中最具力量感的进攻技术。基于生物力学研究，本文系统讲解发力机制、肌群参与模式和训练方法。',
    tags: ['Hook', '勾手', '力量技术', '生物力学'],
    relatedCourses: ['aw-technique-hook', 'aw-strength-forearm'],
    relatedArticles: ['what-is-top-roll', 'press-technique'],
    lastUpdated: '2026-07',
    disclaimer: '本内容仅供学习参考，训练前请评估自身身体状况。如有不适请立即停止并咨询专业人士。',
    references: [
      { title: 'Technical and tactical characteristics of competitive activity in armwrestling', source: 'Maikovych O. et al., Scientific Journal of Dragomanov University, 2025' },
      { title: 'Priorities of technical action "top roll" at the initial stage of sports specialization', source: 'Zhivoderov A.V., Scientific Notes of P.F. Lesgaft University, 2013' },
      { title: 'Science for Armwrestling', source: 'Ryoo H.J., viXra, 2021', url: 'https://vixra.org/abs/2101.0006' },
    ],
    content: `Hook（勾手）是腕力中与 Top Roll 并列的核心技术。根据 Zhivoderov（2013）的 EMG 研究，Hook 在执行时前臂屈肌的激活水平最高（1.81 mV·s），其次是肱二头肌（1.49 mV·s），肱桡肌相对较低（1.0 mV·s）。这表明 Hook 是一种高度依赖前臂屈肌和二头肌的技术。

Hook 的力学本质是利用腕屈肌群和肱二头肌的力量，将对手的手腕"勾"向自己身体的方向，同时利用旋前（掌心转向对手）来锁定角度。

## 发力机制

### 屈腕角度

Hook 的第一步也是最关键的一步——在开把瞬间，手腕必须迅速屈曲（向掌心方向弯曲），将对手的手拉向你的身体一侧。屈腕的深度直接影响 Hook 的成功率。Maikovych 等人（2025）对高水平腕力比赛的技术分析表明，Hook 的成功使用高度依赖于预先建立的屈腕优势。

### 旋前角度

在屈腕的同时，前臂要略微旋前（掌心转向对手方向）。这个动作的作用是让你的桡骨更好地压在对手的手掌上，增加锁定效果。

### 内收角度

保持肘部贴近身体，大臂与躯干的夹角在合理范围内。这样可以最大化肱二头肌和背阔肌的发力效率。

## 肌群协调

Hook 的发力路径与 Top Roll 相反：
- 前臂屈肌群——主要动力来源，负责屈腕动作
- 肱二头肌——辅助屈肘和拉力
- 三角肌前束——在压腕阶段提供向前的推力
- 胸大肌——辅助肩关节内收

发力顺序依次为：屈腕 → 内旋 → 锁定 → 侧压。

## 常见失误

1. 屈腕不足——最致命的问题。屈腕角度不够，对手的手腕无法被锁定
2. 肘部过度张开——大臂远离身体，肱二头肌和背阔肌无法有效发力
3. 身体前倾过度——重心不稳，一旦对手脱离就会失去平衡

## 训练要点

- 腕弯举：强化腕屈肌群，重点在离心阶段
- 牧师凳弯举：孤立强化肱二头肌
- 静态 Hook 保持：与搭档保持锁定位置，训练锁定稳定性`,
  },
  {
    id: 'press-technique',
    title: 'Press 技术指南 — 长臂选手的必杀技',
    category: 'technique',
    coverImage: `${baseUrl}/press-technique.jpg`,
    readTime: 6,
    summary: 'Press（侧压）利用杠杆优势绕过对手正面力量，直接侧向攻击。本文讲解力学原理、风险控制和训练方法。',
    tags: ['Press', '侧压', '进阶技术', '生物力学'],
    relatedCourses: ['aw-technique-press', 'aw-strength-back-pull'],
    relatedArticles: ['what-is-top-roll', 'hook-technique'],
    lastUpdated: '2026-07',
    disclaimer: '本内容仅供学习参考，训练前请评估自身身体状况。如有不适请立即停止并咨询专业人士。',
    references: [
      { title: 'Science for Armwrestling', source: 'Ryoo H.J., viXra, 2021', url: 'https://vixra.org/abs/2101.0006' },
      { title: 'Humeral fracture in arm wrestling: bone morphology as a permanent risk factor', source: 'Marks M. et al., J Sports Med Phys Fitness, 2014', url: 'https://pubmed.ncbi.nlm.nih.gov/24445549/' },
      { title: 'Trunk rotation and hand-elbow-shoulder axis disruption increase the risk of humeral shaft fractures during arm wrestling', source: 'Yüce A. et al., BMC Sports Sci Med Rehabil, 2025', url: 'https://link.springer.com/article/10.1186/s13102-026-01763-0' },
    ],
    content: `Press（侧压）是腕力三大核心技术之一。与 Top Roll 和 Hook 不同，Press 不在正面与对手直接较力，而是通过改变力的作用方向——将正面对抗转变为侧向压制——从而绕过对手最强的发力方向。

Press 的核心是利用桡骨（前臂拇指侧的长骨）作为杠杆，直接侧向压迫对手的手腕。当你发起 Press 时，手臂不再与对手正面相对，而是偏转一定角度，将力量的方向从"向前推"变成"向侧面压"。由于腕关节在侧向受力时的稳定性和力量输出低于正面受力，这种角度变化可以产生明显的杠杆优势。

## 发力方式

Press 的发力与 Top Roll 和 Hook 有本质区别：
- 主要发力肌群：肱三头肌、三角肌前束、胸大肌
- 力线方向：侧向弧形 → 斜向下
- 关节特点：肘关节接近伸直，肩关节内收内旋
- 身体姿态：上半身向对手外侧倾斜

## 风险与安全

Press 是三大技术中对关节压力最大的一种。Marks 等人（2014）对腕力中肱骨骨折的研究指出，上肢在承受侧向外翻应力时，肱骨远端干骺端（肘关节上方约 115mm 处）是生物力学上的薄弱区域。Yüce 等人（2025）的视频分析研究进一步发现，躯干向攻击方向过度旋转以及手臂-肘-肩轴线的破坏，会显著增加肱骨骨折风险。

因此 Press 的使用应特别注意：
- 有肘部伤病史者谨慎使用
- 避免在疲劳状态下使用
- 佩戴适当的护具
- 不要为了追求角度而让肩关节过度内收

## 训练方法

### 基础力量
- 窄距卧推或肱三头肌屈伸：强化三头肌
- 哑铃侧平举（前束主导）：强化三角肌前束
- 弹力带侧向抗阻：模拟 Press 的侧向发力

### 技术训练
1. 角度模拟训练：与搭档只建立 Press 初始角度，不发力对抗
2. 慢速 Press 对练：30% 力量打磨动作细节
3. 变线训练：先做出 Top Roll 或 Hook 的假动作，再变线为 Press`,
  },
  // ──────────────── 新手指南 ────────────────
  {
    id: 'competition-rules',
    title: '腕力比赛规则入门 — WAF 规则全解析',
    category: 'guide',
    coverImage: `${baseUrl}/competition-rules.jpg`,
    readTime: 6,
    summary: '腕力比赛有严格的规则体系。本文基于 WAF（世界腕力联合会）2024 年官方规则，系统整理比赛流程、犯规判定和实用参赛建议。',
    tags: ['比赛规则', 'WAF', '判罚', '新手必读'],
    relatedCourses: ['aw-basic-rules'],
    relatedArticles: ['beginner-mistakes', 'injury-prevention'],
    lastUpdated: '2026-07',
    references: [
      { title: 'WAF Official Rules (2024 Revision)', source: 'World Armwrestling Federation', url: 'https://armwrestling.org.hk/wp-content/uploads/2025/01/2024-WAF-Rules.pdf' },
      { title: 'WAF 官方规则繁体中文本 (2023)', source: 'World Armwrestling Federation', url: 'https://armwrestling.org.hk/wp-content/uploads/2024/02/2023-WAF-Rules-%E7%B9%81%E9%AB%94%E4%B8%AD%E6%96%87%E7%89%88.pdf' },
      { title: 'WAF — Official Table Specifications', source: 'World Armwrestling Federation', url: 'https://www.waf-armwrestling.com/armwrestling-rules/armwrestling-table/' },
      { title: 'Arm Wrestling Fouls & Refereeing Explained', source: 'Toronto Arm Wrestling Federation (TAWF)', url: 'https://www.tawf.ca/league/learn/arm-wrestling-fouls-and-refereeing' },
    ],
    content: `腕力比赛看着简单——两个人把手放在桌上较劲。但实际比赛的规则体系相当复杂。以下内容依据 WAF（World Armwrestling Federation）2024 年官方规则整理。

## 比赛桌标准（WAF 规格）

WAF 规则对比赛桌的尺寸有明确要求：

- **坐式桌高**：71.1 cm（28 英寸）
- **站式桌高**：101.6 cm（40 英寸）
- **桌面尺寸**：91.4 cm × 66.0 cm（36 × 26 英寸）
- **肘垫**：17.8 cm × 17.8 cm，厚 5.1 cm，高密度泡沫材质
- **触垫（压腕判定）**：25.4 cm × 10.2 cm
- **握柱（Peg）**：直径 2.5 cm，高 15.2 cm，距桌边 2.54 cm
- **座椅**：45.7 cm × 45.7 cm，座高 45.7 cm

桌面必须标记从握柱到握柱的中心线。

## 体重分级

WAF 2024 规则的成年精英组体重分级：

**男子（11 个级别）：** -55 kg、60、65、70、75、80、85、90、100、110、+110 kg

**女子（8 个级别）：** -50 kg、55、60、65、70、80、90、+90 kg

此外还有大师组（40+）、青年组（23 岁以下）、少年组（16-18 岁）和青少年组（14-15 岁）的独立分级。左右手分开比赛。

## 赛制

- **双败淘汰**：输一场进入败者组，输两场淘汰
- **三局两胜**：先赢两局者获胜（决赛可能采用五局三胜）
- **60 秒规则**：选手接到通知后 60 秒内未就位视为弃权

## 开始流程（Ready Go）

1. **就位** — 选手将比赛手的肘部放在肘垫上
2. **握持定位** — 裁判引导双方握持，确保肘部在肘垫正中、肩膀未越过中线
3. **裁判检查** — 检查握姿正确，所有手指可见
4. **指令** — 裁判喊"Ready?"确认准备就绪
5. **开始** — 裁判喊"Ready… Go!"（"Go"之前严禁发力）

## 犯规与判罚

WAF 采用累计警告制：2 次警告 = 1 次犯规，2 次犯规 = 该局判负。

### 可能导致直接判负的违规行为

- **肘部离开肘垫** — 肘关节与肘垫之间出现可见空隙
- **肩膀越过中线** — 肩部完全越过桌面中线
- **身体触碰桌面** — 除比赛手前臂外，任何身体部位接触桌面
- **故意松手逃避** — 为了不被压在桌面上而故意松开握持
- **劣势位犯规** — 当手部已经处于距触垫 2/3 的劣势位置时犯规，直接判负

### 警告类违规（累计 2 次判负）

- **抢跳（False Start）** — "Ready… Go!"命令过程中提前发力
- **空手离开握柱** — 非比赛手脱离握柱（若因此获得优势则升级为犯规）
- **身体接触** — 比赛手触碰自己的头部、肩部或胸部
- **头部越过中线**
- **双脚离开地面**

### 危险位置规则（安全规则）

当选手的肩部过度内旋，导致手部-手臂的直线被破坏时，裁判会判定为"危险位置"（Shoulder），要求选手纠正。如在约 2 秒内未纠正，裁判将叫停并判犯规。

## 胜负判定

- **压腕触垫** — 对手手腕线至指尖的任何部分触及或低于触垫，即判定获胜
- **约 2/3 距离** — 手部到达距触垫约 2/3 位置时即可视为败势

## 实用建议

- 首次参赛前先以观众身份观察完整赛事
- 热身时充分活动手腕和肘部
- 尊重裁判和对手，有争议通过正规渠道申诉`,
  },
  {
    id: 'beginner-mistakes',
    title: '腕力新手最常见的 10 个错误',
    category: 'guide',
    coverImage: `${baseUrl}/beginner-mistakes.jpg`,
    readTime: 7,
    summary: '新手练腕力最常犯的错误。基于运动医学研究和生物力学分析，帮助新手避开常见误区，安全有效地提升水平。',
    tags: ['新手', '常见错误', '入门指南', '伤病预防'],
    relatedCourses: ['aw-basic-grip', 'aw-basic-stance'],
    relatedArticles: ['competition-rules', 'injury-prevention'],
    lastUpdated: '2026-07',
    disclaimer: '本内容仅供学习参考，训练前请评估自身身体状况。如有不适请立即停止并咨询专业人士。',
    references: [
      { title: 'Arm-wrestling injuries — A systematic review of the medical literature', source: 'Correia P. et al., Manual Therapy, Posturology & Rehabilitation Journal, 2018' },
      { title: 'Humeral fracture in arm wrestling: bone morphology as a permanent risk factor', source: 'Marks M. et al., J Sports Med Phys Fitness, 2014', url: 'https://pubmed.ncbi.nlm.nih.gov/24445549/' },
      { title: 'Humeral Shaft Fracture Sustained During Arm Wrestling with Review of Factors Contributing to its Causation', source: 'Pande S. et al., Malays Orthop J, 2021', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8667248/' },
      { title: 'Effects of the Wrestling+ injury prevention program', source: 'Bayati A. et al., J Orthop Surg Res, 2025', url: 'https://pubmed.ncbi.nlm.nih.gov/40390025/' },
      { title: 'Biomechanics and potential injury mechanisms of wrestling', source: 'PubMed — various studies' },
    ],
    content: `Correia 等人（2018）对腕力运动损伤的系统综述表明，腕力是一项伤病风险客观存在的运动，超过 70% 的活跃选手经历过不同程度的伤病。但绝大多数问题是可以预防的。以下是新手最常见的 10 个错误。

## 错误 1：只练握力，忽视前臂

前臂在从肘到腕的短距离内分布了超过 20 块肌肉。单纯练习握力器只能强化指屈肌，而腕屈肌、伸肌和旋前旋后肌群同样重要。Marks 等人（2014）的研究指出，前臂肌力不平衡是肘部损伤的重要诱因。握力训练应占总前臂训练的 30-40%，其余分配给腕屈伸和旋转训练。

## 错误 2：忽视前臂伸肌

多项研究证实，腕屈伸肌力比失衡（超过 3:1）会导致手腕在对抗中伸肌侧被压制，增加肘内侧副韧带受伤风险。保持屈伸肌力比在 2:1 到 3:1 之间。每次训练如果做了 3 组腕弯举，最少要做 1 组反握腕弯举。

## 错误 3：错误站姿

正确的站姿要求双脚与肩同宽，膝盖微屈，重心在双脚之间。错误的站姿会使下半身力量无法有效传导。

## 错误 4：只用手臂发力

腕力的发力链应该是：脚抓地 → 腿传导 → 核心稳定 → 肩传递 → 手臂终结。Bayati 等人（2025）的随机对照试验表明，包含全身激活的热身方案可以将腕力相关损伤降低 58%。

## 错误 5：盲目模仿职业选手

腕力高手的技术风格往往是基于其独特的身体条件（臂展、肌纤维类型、关节活动度）发展出来的。新手应先系统学习三大核心技术的基本原理，再根据自身条件选择主攻方向。

## 错误 6：训练频率过高

Pande 等人（2021）的研究表明，许多腕力损伤发生在疲劳状态下的对抗中。高强度腕力训练后，关节和韧带需要 48-72 小时恢复。大强度对抗每周不超过 2-3 次。

## 错误 7：忽略防守训练

防守是腕力中独立的技术体系。每次训练中至少安排 20% 的时间练习防守。

## 错误 8：训练前不热身

Correia 等人（2018）在系统综述中指出，充分的热身是预防腕力损伤的最有效措施之一。每次训练前至少花 10-15 分钟热身：手腕环绕 → 手指开合 → 肘部屈伸 → 轻阻力弹力带激活。

## 错误 9：追求重量忽略技术

技术的优先级应高于力量。建议每次力量训练后安排至少 15 分钟的技术对练。

## 错误 10：忽略恢复与营养

训练后充分拉伸前臂和肩部，补充蛋白质和水分。保证充足睡眠。每 4-6 周安排减量周。`,
  },
  {
    id: 'injury-prevention',
    title: '如何预防腕力受伤 — 从热身到康复的完整指南',
    category: 'rehab',
    coverImage: `${baseUrl}/injury-prevention.jpg`,
    readTime: 8,
    summary: '腕力的伤病风险主要集中在手腕、肘部和肩部。本文基于 PubMed 收录研究和运动医学指南，提供热身心得、预防训练和恢复建议。',
    tags: ['伤病预防', '康复', '热身', '关节保护'],
    relatedCourses: ['aw-rehab-wrist', 'aw-rehab-elbow', 'aw-rehab-shoulder'],
    relatedArticles: ['beginner-mistakes', 'wrist-anatomy'],
    lastUpdated: '2026-07',
    disclaimer: '本内容仅供学习参考，不替代专业医疗建议。如已受伤请及时就医，在专业人员指导下进行康复训练。',
    references: [
      { title: 'Arm-wrestling injuries — A systematic review of the medical literature', source: 'Correia P. et al., Manual Therapy, Posturology & Rehabilitation Journal, 2018' },
      { title: 'Humeral fracture in arm wrestling: bone morphology as a permanent risk factor', source: 'Marks M. et al., J Sports Med Phys Fitness, 2014', url: 'https://pubmed.ncbi.nlm.nih.gov/24445549/' },
      { title: 'Effects of the Wrestling+ injury prevention program in freestyle wrestlers: a two-arm randomized controlled trial', source: 'Bayati A. et al., J Orthop Surg Res, 2025', url: 'https://pubmed.ncbi.nlm.nih.gov/40390025/' },
      { title: 'Humeral Shaft Fracture Sustained During Arm Wrestling', source: 'Pande S. et al., Malays Orthop J, 2021', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8667248/' },
      { title: 'Trunk rotation and hand-elbow-shoulder axis disruption increase the risk of humeral shaft fractures during arm wrestling', source: 'Yüce A. et al., BMC Sports Sci Med Rehabil, 2025', url: 'https://link.springer.com/article/10.1186/s13102-026-01763-0' },
      { title: 'Anatomy, Shoulder and Upper Limb, Forearm Muscles', source: 'NCBI Bookshelf — StatPearls', url: 'https://www.ncbi.nlm.nih.gov/sites/books/NBK536975/' },
      { title: 'Conservative Management of a Distal Humerus Spiral Fracture Sustained During Arm Wrestling', source: 'Cureus, 2023', url: 'https://pulmonology.cureus.com/articles/162499' },
      { title: 'PRICE原则 — 急性损伤处理', source: 'Physiopedia' },
    ],
    content: `Correia 等人（2018）的腕力运动伤害系统综述指出，腕力的伤病风险主要集中在上肢的三个部位。以下基于该综述和其他相关研究，系统讲解预防方法。

## 腕力伤病的三大部位

### 1. 手腕损伤

三角纤维软骨复合体（TFCC）损伤在腕力选手中较为高发。TFCC 位于手腕尺侧（小指侧），在手腕承重旋转时起稳定作用。损伤机制为在 Top Roll 或防守 Hook 时，手腕处于尺偏加旋后的复合位置，承受过大负荷。预防方法包括训练前后充分活动腕关节全范围，以及避免在极限角度下承受大负荷。

### 2. 肘部损伤（最常见）

腕力选手最常受伤的部位，主要包括：
- **内侧副韧带损伤**：Hook 对抗中外翻应力过大
- **肱骨内上髁炎**（高尔夫球肘）：腕屈肌群过度使用
- **肱骨外上髁炎**（网球肘）：腕伸肌群过度使用

Marks 等人（2014）的研究指出，肱骨远端干骺端的解剖结构（从管状向三角形截面过渡）使其在扭转力下成为生物力学薄弱区，这正是肘部损伤高发的解剖学基础。

### 3. 肩部损伤

包括肩袖损伤、肩峰撞击综合症等。肩部损伤与 Press 技术中肩关节内旋内收的复合位置有关。

## 完整热身流程

Bayati 等人（2025）的随机对照试验证明，包含以下要素的热身方案可以显著降低损伤发生率。

### 阶段一：全身激活（2 分钟）
开合跳或快速原地踏步，提升心率和体温。

### 阶段二：关节活动（3 分钟）
- 腕关节环绕：向前 10 圈 + 向后 10 圈
- 手指开合：最大幅度开合 20 次
- 肘关节屈伸：20 次
- 肩关节环绕：各方向 10 圈

### 阶段三：针对性拉伸（3 分钟）
- 腕屈肌拉伸：手臂伸直掌心向下，辅助下压手背，保持 15 秒
- 腕伸肌拉伸：手臂伸直掌心向上，辅助下拉手指，保持 15 秒

### 阶段四：弹力带激活（3 分钟）
低阻力弹力带的屈腕、伸腕和旋转训练。

### 阶段五：渐进对抗（2-3 分钟）
从 10% 力量逐步递增到训练强度的 70%。

## 恢复原则

急性损伤请遵循 PRICE 原则：
- **P**rotection（保护）— 立即停止，不再受力
- **R**est（休息）— 受伤部位充分休息
- **I**ce（冰敷）— 每 2 小时冰敷 15-20 分钟
- **C**ompression（加压）— 弹力绷带适当加压
- **E**levation（抬高）— 抬高至心脏以上

## 需要就医的情况

- 听见"咔嚓"声响后剧痛
- 关节明显变形或异常肿胀
- 完全无法活动受伤关节
- 手指发麻或失去知觉

Pande 等人（2021）的研究指出，肱骨骨折后约 53% 需要手术固定，完全恢复约需 3 个月。`,
  },
  {
    id: 'wrist-anatomy',
    title: '腕力新手入门 — 认识你的前臂与手腕',
    category: 'guide',
    coverImage: `${baseUrl}/wrist-anatomy.jpg`,
    readTime: 6,
    summary: '了解前臂和手腕的解剖结构是科学训练的基础。本文基于运动解剖学教材和 Physiopedia 资源，讲解与腕力训练相关的关键肌群。',
    tags: ['解剖', '入门', '基础原理'],
    relatedCourses: ['aw-basic-grip', 'aw-strength-forearm'],
    relatedArticles: ['beginner-mistakes', 'injury-prevention'],
    lastUpdated: '2026-07',
    disclaimer: '本内容仅供学习参考，不替代专业医疗建议。',
    references: [
      { title: 'Anatomy, Shoulder and Upper Limb, Forearm Muscles', source: 'NCBI Bookshelf — StatPearls', url: 'https://www.ncbi.nlm.nih.gov/sites/books/NBK536975/' },
      { title: 'Exploring Wrist Anatomy', source: 'Physiopedia Plus' },
      { title: 'Manual Muscle Testing: Forearm Supination and Pronation', source: 'Physiopedia' },
      { title: 'ACSM\'s Guidelines for Exercise Testing and Prescription, 11th Edition', source: 'American College of Sports Medicine, 2021' },
    ],
    content: `了解手臂的基本解剖结构，能让训练更有针对性，同时降低受伤风险。以下内容基于运动解剖学教材和相关资料整理。

## 前臂的肌肉群

前臂是人体中肌肉密度最高的区域之一——在从肘到腕这么短的距离内，分布了超过 20 块肌肉（NCBI StatPearls）。从功能角度，可以划分为几个关键群组。

### 腕屈肌群

位于前臂内侧（掌心向上时），主要功能是弯曲手腕。

核心肌肉包括：
- **桡侧腕屈肌** — 屈腕 + 桡偏
- **尺侧腕屈肌** — 屈腕 + 尺偏
- **掌长肌** — 辅助屈腕
- **指深屈肌 / 指浅屈肌** — 控制手指屈曲

腕屈肌群是 Hook 技术的核心力量来源，也是维持握力的重要组成部分。根据 ACSM 的建议，屈肌训练应以中等负荷、较高重复次数为主，结合离心训练预防肌腱损伤。

### 腕伸肌群

位于前臂外侧（掌心向下时的上方），主要功能是伸展手腕。

核心肌肉包括：
- **桡侧腕长伸肌**
- **桡侧腕短伸肌**
- **尺侧腕伸肌**
- **指伸肌**

腕伸肌群在 Top Roll 的防守阶段中起关键作用——如果伸肌力量不足，对手的 Top Roll 可以轻易打开你的手腕。

### 旋前与旋后肌群

这两组肌肉在腕力中至关重要，因为它们控制着手腕的旋转角度。

- **旋前圆肌 + 旋前方肌** — 将掌心从向上翻转向下（旋前）
- **旋后肌** — 将掌心从向下翻转向上（旋后）

根据 Physiopedia 的资料，旋后肌和旋前圆肌在腕力的各个角度都处于活跃状态，这些肌肉虽然体积不大，但训练时应注意全范围运动。

## 训练基本原则

### 1. 平衡发展

屈伸肌力比应控制在 2:1 到 3:1 之间。每周至少安排一次伸肌专项训练。

### 2. 全范围运动

前臂肌肉在腕力的每个角度都需要发力，训练时要确保屈腕和伸腕都做到最大关节活动范围。

### 3. 动静结合

腕力既有动态发力也有静态对抗，训练应兼顾三种模式：
- 动态力量训练（弯举类）— 约 50%
- 静态保持训练 — 约 30%
- 离心控制训练 — 约 20%

## 自我评估

在开始高强度腕力训练前，简单评估自己的状况：
1. 能否在不痛的情况下完成完整腕关节环绕？
2. 左右前臂围度差是否超过 2cm？
3. 做握力挤压时手腕是否出现不自主偏斜？
4. 做屈腕动作时是否有异常牵拉感？

如果存在上述问题，建议先做基础强化再开始高强度对抗。`,
  },
]
