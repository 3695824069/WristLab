import type { Plan } from '../types'

export const plans: Plan[] = [
  {
    id: 'plan-21day',
    title: '21天腕力进阶计划',
    type: '21day',
    description: '为期21天的腕力专项训练计划，分基础期（第1-7天 · 握力与腕部基础）、强化期（第8-14天 · 力量与旋转）、实战期（第15-21天 · 专项技术与实战）。从握力、前臂到实战技术，系统打造腕力所需的关键力量。适合有一定基础的腕力爱好者。',
    days: [
      // ═══ 基础期：握力与腕部基础（第1-7天）═══
      {
        day: 1,
        title: '握力基础入门',
        exercises: [
        { exerciseId: 'ex-grip-crush', displayText: '握力器挤压 3组×12次' },
        { exerciseId: 'ex-grip-finger-curl', displayText: '手指卷曲训练 3组×10次' },
        { exerciseId: 'ex-grip-hang', displayText: '单杠悬吊 3组（每组尽力）' },
        { exerciseId: 'ex-wrist-mobility', displayText: '手腕环绕激活 2分钟' }
      ],
        notes: '第一天重点感受握力的发力模式。握力器挤压时注意全程控制，不要靠惯性弹压。单杠悬吊记录每次的时间，作为日后进步参照。组间休息60秒。',
      },
      {
        day: 2,
        title: '前臂激活',
        exercises: [
        { exerciseId: 'ex-forearm-wrist-curl', displayText: '手腕弯举 3组×12次' },
        { exerciseId: 'ex-forearm-reverse-curl', displayText: '反握腕弯举 3组×10次' },
        { exerciseId: 'ex-bicep-hammer', displayText: '锤式弯举 3组×10次' },
        { exerciseId: 'ex-wrist-mobility', displayText: '手腕环绕激活 2分钟' }
      ],
        notes: '手腕弯举和反握腕弯举互补训练前臂屈伸肌群。前臂必须贴紧支撑面，仅手腕发力。反握腕弯举使用手腕弯举一半的重量。组间休息60秒。',
      },
      {
        day: 3,
        title: '腕部稳定性',
        exercises: [
        { exerciseId: 'ex-wrist-fighter', displayText: '拳峰支撑训练 3组×20秒' },
        { exerciseId: 'ex-wrist-deviation', displayText: '手腕侧向训练 3组×10次/侧' },
        { exerciseId: 'ex-grip-pinch', displayText: '虎口捏力训练 3组×8次/侧' },
        { exerciseId: 'ex-grip-crush', displayText: '握力器挤压 3组×10次' }
      ],
        notes: '拳峰支撑是腕关节稳定性的黄金训练，从跪姿开始。手腕侧向训练注意桡偏和尺偏均衡发展，避免只做一侧。组间休息45秒。',
      },
      {
        day: 4,
        title: '主动恢复',
        exercises: [
        { exerciseId: 'ex-wrist-mobility', displayText: '手腕环绕激活 3分钟' },
        { displayText: '前臂泡沫轴放松 每侧2分钟' },
        { displayText: '手指交替屈伸 100次' },
        { displayText: '甩臂放松 1分钟' }
      ],
        notes: '恢复日同样重要。用泡沫轴或网球按压前臂屈伸肌群，每个痛点停留20秒以上。手指交替屈伸可以帮助放松指屈肌群。',
      },
      {
        day: 5,
        title: '握力进阶',
        exercises: [
        { exerciseId: 'ex-grip-crush', displayText: '握力器挤压 4组×10次' },
        { exerciseId: 'ex-back-farmer-walk', displayText: '农夫行走 3组×20步' },
        { exerciseId: 'ex-grip-hang', displayText: '单杠悬吊 3组（每组尽力）' },
        { exerciseId: 'ex-grip-finger-curl', displayText: '手指卷曲训练 3组×12次' }
      ],
        notes: '握力训练组数提高。农夫行走保持核心收紧、肩胛下沉，行走时躯干不要晃动。记录单杠悬吊最长时间，与第1天对比。组间休息45秒。',
      },
      {
        day: 6,
        title: '前臂耐力特训',
        exercises: [
        { exerciseId: 'ex-forearm-wrist-curl', displayText: '手腕弯举 4组×12次' },
        { exerciseId: 'ex-forearm-reverse-curl', displayText: '反握腕弯举 4组×10次' },
        { exerciseId: 'ex-grip-finger-curl', displayText: '手指卷曲训练 3组×12次' },
        { exerciseId: 'ex-bicep-hammer', displayText: '锤式弯举 3组×12次' }
      ],
        notes: '今天所有动作组数增加，考验前臂肌群的耐力。如果前臂出现灼烧感是正常现象，注意动作质量不要下降。组间休息45秒。',
      },
      {
        day: 7,
        title: '基础期测试',
        exercises: [
        { exerciseId: 'ex-grip-hang', displayText: '单杠悬吊（计时测试）' },
        { exerciseId: 'ex-grip-crush', displayText: '握力器挤压（最大次数测试）' },
        { exerciseId: 'ex-forearm-wrist-curl', displayText: '手腕弯举 3组×15次' },
        { exerciseId: 'ex-bicep-hammer', displayText: '锤式弯举 3组×12次' }
      ],
        notes: '基础期最后一天！做一次握力测试：单杠悬吊能坚持多久？握力器最大连续挤压多少次？记录数据，强化期结束时再对比。🎯',
      },
      // ═══ 强化期：力量与旋转（第8-14天）═══
      {
        day: 8,
        title: '旋前力量入门',
        exercises: [
        { exerciseId: 'ex-forearm-pronation', displayText: '旋前训练 3组×12次/侧' },
        { exerciseId: 'ex-forearm-supination', displayText: '旋后训练 3组×10次/侧' },
        { exerciseId: 'ex-grip-crush', displayText: '握力器挤压 3组×12次' },
        { exerciseId: 'ex-bicep-hammer', displayText: '锤式弯举 3组×10次' }
      ],
        notes: '旋前/旋后是腕力的核心技术动作。前臂必须固定，肘部不要离开身体。旋后训练使用比旋前更轻的重量。组间休息60秒。',
      },
      {
        day: 9,
        title: '二头辅助强化',
        exercises: [
        { exerciseId: 'ex-bicep-concentration', displayText: '集中弯举 3组×10次/侧' },
        { exerciseId: 'ex-bicep-hammer', displayText: '锤式弯举 4组×10次' },
        { exerciseId: 'ex-forearm-reverse-curl', displayText: '反握腕弯举 3组×12次' },
        { exerciseId: 'ex-grip-pinch', displayText: '虎口捏力训练 3组×8次/侧' }
      ],
        notes: '二头肌在 Hook 技术中承担重要角色。集中弯举注意顶点旋后，感受二头肌顶峰收缩。组间休息60秒。',
      },
      {
        day: 10,
        title: '旋转控制训练',
        exercises: [
        { exerciseId: 'ex-forearm-pronation', displayText: '旋前训练 4组×10次/侧' },
        { exerciseId: 'ex-forearm-supination', displayText: '旋后训练 4组×10次/侧' },
        { exerciseId: 'ex-wrist-deviation', displayText: '手腕侧向训练 3组×12次/侧' },
        { exerciseId: 'ex-grip-finger-curl', displayText: '手指卷曲训练 3组×12次' }
      ],
        notes: '旋转训练组数增加，动作控制比重量更重要。想象正在和对手较量的旋转对抗，在动作顶点做1秒的等长收缩。组间休息45秒。',
      },
      {
        day: 11,
        title: '主动恢复',
        exercises: [
        { exerciseId: 'ex-wrist-mobility', displayText: '手腕环绕激活 3分钟' },
        { displayText: '弹力带手指伸展 每侧2分钟' },
        { displayText: '小臂冰敷或冷水浸泡 10分钟' },
        { displayText: '肩部环绕拉伸 2分钟' }
      ],
        notes: '强化期过半，充分恢复才能迎接强度提升。弹力带手指伸展可以有效缓解指屈肌紧张。如果前臂有明显酸痛，额外多休息一天。',
      },
      {
        day: 12,
        title: '旋转爆发力',
        exercises: [
        { displayText: '旋前旋后超级组 4组×8次/侧' },
        { exerciseId: 'ex-back-farmer-walk', displayText: '农夫行走 3组×30步' },
        { exerciseId: 'ex-grip-crush', displayText: '握力器挤压 4组×10次' },
        { exerciseId: 'ex-bicep-hammer', displayText: '锤式弯举 3组×12次' }
      ],
        notes: '超级组：旋前和旋后连续做不休息，之间没有停顿，完成两侧为一组。这是模拟实战中攻防转换的发力模式。组间休息75秒。',
      },
      {
        day: 13,
        title: '前臂极限耐力',
        exercises: [
        { exerciseId: 'ex-forearm-wrist-curl', displayText: '手腕弯举 4组×15次' },
        { exerciseId: 'ex-forearm-reverse-curl', displayText: '反握腕弯举 4组×12次' },
        { exerciseId: 'ex-grip-finger-curl', displayText: '手指卷曲训练 4组×10次' },
        { exerciseId: 'ex-grip-hang', displayText: '单杠悬吊 2组（每组尽力）' }
      ],
        notes: '前臂耐力直接决定比赛后期能否维持力量和握力。今天所有动作追求次数而非重量，最后3次应该感到明显的灼烧感。组间休息45秒。',
      },
      {
        day: 14,
        title: '强化期测试',
        exercises: [
        { displayText: '旋后（单侧最大重量估测）' },
        { exerciseId: 'ex-grip-crush', displayText: '握力器挤压（最大次数测试）' },
        { exerciseId: 'ex-grip-hang', displayText: '单杠悬吊（计时测试比第7天）' },
        { exerciseId: 'ex-bicep-hammer', displayText: '锤式弯举 3组×12次' }
      ],
        notes: '强化期结束！测试数据并与第7天对比。握力器挤压次数和悬吊时间是否有提升？旋后力量是否有进步？记录数据为实战期做准备。💪',
      },
      // ═══ 实战期：专项技术与实战（第15-21天）═══
      {
        day: 15,
        title: 'Top Roll 技术准备',
        exercises: [
        { exerciseId: 'ex-forearm-supination', displayText: '旋后训练 4组×10次/侧（加重）' },
        { exerciseId: 'ex-grip-crush', displayText: '握力器挤压 4组×10次（加重）' },
        { exerciseId: 'ex-wrist-deviation', displayText: '手腕侧向训练（桡偏侧重）3组×12次/侧' },
        { exerciseId: 'ex-grip-finger-curl', displayText: '手指卷曲训练 3组×12次' }
      ],
        notes: 'Top Roll 需要强大的旋后能力和背侧手腕力量。今天加重旋后训练，动作速度要快——模拟实战中快速打开对手手腕的动作。组间休息60秒。',
      },
      {
        day: 16,
        title: 'Hook 技术准备',
        exercises: [
        { exerciseId: 'ex-bicep-hammer', displayText: '锤式弯举 4组×10次（加重）' },
        { exerciseId: 'ex-forearm-pronation', displayText: '旋前训练 4组×10次/侧（加重）' },
        { exerciseId: 'ex-bicep-preacher', displayText: '牧师凳弯举 3组×10次' },
        { exerciseId: 'ex-grip-pinch', displayText: '虎口捏力训练 4组×8次/侧' }
      ],
        notes: 'Hook 技术依赖二头肌和旋前力量的协同。牧师凳弯举孤立强化二头肌，注意全程手臂贴紧托板。虎口捏力模拟实际握持对抗。组间休息60秒。',
      },
      {
        day: 17,
        title: 'Press 技术准备',
        exercises: [
        { exerciseId: 'ex-wrist-fighter', displayText: '拳峰支撑训练 4组×30秒' },
        { exerciseId: 'ex-forearm-wrist-curl', displayText: '手腕弯举 4组×12次（慢速离心）' },
        { exerciseId: 'ex-grip-pinch', displayText: '虎口捏力训练 4组×8次/侧' },
        { displayText: '青蛙推（三头肌辅助）3组×10次' }
      ],
        notes: 'Press 技术需要强大的腕关节稳定性和三头肌辅助。拳峰支撑延时至30秒每组。手腕弯举离心阶段放慢到3秒，增强连接组织强度。组间休息60秒。',
      },
      {
        day: 18,
        title: '实战模拟超级组',
        exercises: [
        { displayText: '旋后→握力器挤压超级组 4组×8次' },
        { displayText: '旋前→锤式弯举超级组 4组×8次' },
        { exerciseId: 'ex-back-farmer-walk', displayText: '农夫行走 3组×40步（加重）' },
        { exerciseId: 'ex-wrist-mobility', displayText: '手腕环绕激活 2分钟' }
      ],
        notes: '超级组模拟实战中的连击发力模式。A组：旋后（模拟Top Roll打开）→ 握力器挤压（模拟锁定握死）。B组：旋前（模拟Hook内旋）→ 锤式弯举（模拟拉动对手）。组间休息75秒。',
      },
      {
        day: 19,
        title: '综合技术串联',
        exercises: [
        { exerciseId: 'ex-forearm-wrist-curl', displayText: '手腕弯举 3组×12次' },
        { exerciseId: 'ex-forearm-reverse-curl', displayText: '反握腕弯举 3组×12次' },
        { displayText: '旋前旋后超级组 3组×10次/侧' },
        { exerciseId: 'ex-wrist-fighter', displayText: '拳峰支撑训练 3组×30秒' },
        { exerciseId: 'ex-grip-crush', displayText: '握力器挤压 3组×15次' }
      ],
        notes: '今天不做新动作，把所有基础训练串联一遍。每个动作做标准，注意热身充分。如果时间充裕，做完后加10分钟拉伸。组间休息45秒。',
      },
      {
        day: 20,
        title: '巅峰冲刺',
        exercises: [
        { exerciseId: 'ex-forearm-supination', displayText: '旋后训练 4组×8次/侧（最大重量）' },
        { exerciseId: 'ex-grip-crush', displayText: '握力器挤压 5组×8次（最大阻力）' },
        { exerciseId: 'ex-bicep-preacher', displayText: '牧师凳弯举 4组×8次（加重）' },
        { exerciseId: 'ex-grip-hang', displayText: '单杠悬吊 2组×45秒挑战' }
      ],
        notes: '冲刺日！全部动作使用最大可承受重量/阻力。单杠悬吊争取达到45秒以上。这是计划中最具挑战性的一天——全力以赴！组间休息90秒。',
      },
      {
        day: 21,
        title: '终极挑战 · 毕业日',
        exercises: [
        { displayText: '全套体能测试：握力器最大次数 + 单杠悬吊计时 + 旋后力量评估 + 拳峰支撑最长计时' },
        { displayText: '综合循环：旋后10次→握力挤压15次→锤式弯举10次→拳峰支撑30秒 × 3轮' },
        { displayText: '对比第1天和第14天的测试数据' }
      ],
        notes: '🎉 21天腕力进阶计划完成！今天的终极循环将检验所有训练成果。完成3轮循环后，对比第1天和第14天的测试数据——你的握力、悬吊时间和旋后力量都提升了多少？恭喜你完成了系统化腕力训练的第一步！记录数据，休息2-3天后可以开始新一轮循环。',
      },
    ],
  },
  {
    id: 'plan-7day',
    title: '7天全身激活计划',
    type: '7day',
    description: '适合健身新手的7天入门计划，每天15-30分钟，循序渐进地激活全身主要肌群，帮助你建立良好的运动习惯。',
    days: [
      {
        day: 1,
        title: '全身自重基础',
        exercises: [
        { exerciseId: 'ex-legs-squat', displayText: '自重深蹲' },
        { exerciseId: 'ex-chest-pushup', displayText: '俯卧撑（跪姿）' },
        { exerciseId: 'ex-core-plank', displayText: '平板支撑' },
        { displayText: '开合跳' }
      ],
        notes: '今天是所有动作的基础版本，重点是学习正确姿势，不要追求次数。每个动作之间休息30-60秒。',
      },
      {
        day: 2,
        title: '有氧燃脂',
        exercises: [
        { displayText: '原地快走' },
        { displayText: '高抬腿' },
        { displayText: '侧步深蹲' },
        { exerciseId: 'ex-core-plank', displayText: '平板支撑' }
      ],
        notes: '今天以有氧为主，保持心率在最大心率的60-70%。如果感觉轻松，可以缩短休息时间。',
      },
      {
        day: 3,
        title: '休息 & 拉伸',
        exercises: [
        { displayText: '全身拉伸' },
        { displayText: '泡沫轴放松' }
      ],
        notes: '休息也是训练的一部分！用泡沫轴或网球放松大腿前侧、后侧和小腿。每个部位滚动30-60秒。',
      },
      {
        day: 4,
        title: '上肢强化',
        exercises: [
        { exerciseId: 'ex-chest-pushup', displayText: '俯卧撑' },
        { exerciseId: 'ex-back-row', displayText: '弹力带划船' },
        { exerciseId: 'ex-chest-incline-press', displayText: '哑铃卧推' },
        { exerciseId: 'ex-core-plank', displayText: '平板支撑' }
      ],
        notes: '今天重点在上肢。如果你没有哑铃，可以用水瓶代替。弹力带划船也可以用毛巾模拟。',
      },
      {
        day: 5,
        title: '下肢力量',
        exercises: [
        { exerciseId: 'ex-legs-squat', displayText: '自重深蹲' },
        { exerciseId: 'ex-legs-lunge', displayText: '弓步蹲' },
        { displayText: '臀桥' },
        { displayText: '侧卧抬腿' }
      ],
        notes: '下肢训练后可能会有延迟性肌肉酸痛（DOMS），这是正常的。多喝水，保证蛋白质摄入。',
      },
      {
        day: 6,
        title: '核心特训',
        exercises: [
        { exerciseId: 'ex-core-plank', displayText: '平板支撑' },
        { exerciseId: 'ex-core-crunch', displayText: '卷腹' },
        { exerciseId: 'ex-core-russian-twist', displayText: '俄罗斯转体' },
        { displayText: '死虫式' }
      ],
        notes: '核心训练不需要每天做，但每周2-3次可以显著改善体态和运动表现。每个动作做3组。',
      },
      {
        day: 7,
        title: '积极恢复',
        exercises: [
        { displayText: '散步30分钟' },
        { displayText: '全身拉伸' }
      ],
        notes: '一周完成！今天以低强度活动为主，让身体充分恢复，为下一周的训练做好准备。',
      },
    ],
  },
  {
    id: 'plan-30day',
    title: '30天蜕变挑战',
    type: '30day',
    description: '为期30天的全面健身挑战，分为基础期（第1-10天）、进阶期（第11-20天）和挑战期（第21-30天）。每天都有明确目标，坚持30天，你会看到明显变化。',
    days: [
      // ═══ 基础期：第1-10天 ═══
      {
        day: 1,
        title: '第1天 · 开始',
        exercises: [
        { displayText: '自重深蹲 10次x2组' },
        { displayText: '跪姿俯卧撑 8次x2组' },
        { exerciseId: 'ex-core-plank', displayText: '平板支撑 20秒x2组' }
      ],
        notes: '第一天不要用力过猛，目标是完成所有动作，感受肌肉发力。记得记录今天的体重和体脂（如果有条件）。',
      },
      {
        day: 2,
        title: '第2天 · 有氧激活',
        exercises: [
        { displayText: '开合跳 30秒x3组' },
        { displayText: '原地高抬腿 20次x3组' },
        { displayText: '深蹲跳 10次x2组' },
        { displayText: '全身拉伸 5分钟' }
      ],
        notes: '今天以低强度有氧为主，主要目的是提升心率、促进血液循环，帮助肌肉恢复。每个动作之间休息30秒。',
      },
      {
        day: 3,
        title: '第3天 · 上肢入门',
        exercises: [
        { displayText: '跪姿俯卧撑 10次x3组' },
        { displayText: '弹力带划船 12次x3组' },
        { displayText: '哑铃推举 10次x2组' },
        { exerciseId: 'ex-core-plank', displayText: '平板支撑 25秒x3组' }
      ],
        notes: '第一次上肢训练，重点是学习动作轨迹而不是重量。如果没有弹力带，可以用毛巾模拟划船动作。组间休息45秒。',
      },
      {
        day: 4,
        title: '第4天 · 下肢入门',
        exercises: [
        { displayText: '自重深蹲 12次x3组' },
        { exerciseId: 'ex-legs-lunge', displayText: '弓步蹲 10次每侧x2组' },
        { displayText: '臀桥 15次x3组' },
        { displayText: '侧卧抬腿 12次每侧x2组' }
      ],
        notes: '下肢训练日。深蹲时注意膝盖不要内扣，保持核心收紧。弓步蹲可以扶墙保持平衡。组间休息45秒。',
      },
      {
        day: 5,
        title: '第5天 · 习惯养成',
        exercises: [
        { displayText: '自重深蹲 15次x3组' },
        { exerciseId: 'ex-chest-pushup', displayText: '俯卧撑 10次x3组' },
        { exerciseId: 'ex-core-plank', displayText: '平板支撑 30秒x3组' },
        { displayText: '开合跳 30秒x3组' }
      ],
        notes: '第5天了！如果前4天都完成了，给自己一个小奖励（不是食物的那种😄）。今天适当增加了一点强度。',
      },
      {
        day: 6,
        title: '第6天 · 核心初训',
        exercises: [
        { exerciseId: 'ex-core-crunch', displayText: '卷腹 15次x3组' },
        { exerciseId: 'ex-core-russian-twist', displayText: '俄罗斯转体 12次x3组' },
        { displayText: '仰卧抬腿 10次x3组' },
        { displayText: '死虫式 12次每侧x2组' }
      ],
        notes: '核心训练日。所有动作放慢节奏，感受腹肌的收缩与伸展。卷腹时不要用手拉扯颈部。组间休息30秒。',
      },
      {
        day: 7,
        title: '第7天 · 积极恢复',
        exercises: [
        { displayText: '散步30分钟' },
        { displayText: '全身泡沫轴放松' },
        { displayText: '肩部环绕拉伸 3分钟' }
      ],
        notes: '一周完成！今天以低强度活动和拉伸为主。用泡沫轴重点放松大腿前侧、后侧和背部。为下一周的训练做好准备。',
      },
      {
        day: 8,
        title: '第8天 · 上肢强化',
        exercises: [
        { exerciseId: 'ex-chest-pushup', displayText: '俯卧撑 12次x3组' },
        { exerciseId: 'ex-back-row', displayText: '哑铃划船 12次x3组' },
        { displayText: '哑铃卧推 10次x3组' },
        { exerciseId: 'ex-core-plank', displayText: '平板支撑 35秒x3组' }
      ],
        notes: '上肢力量和耐力开始提升。俯卧撑如果标准姿势做不了，可以改用跪姿完成全部次数。组间休息45秒。',
      },
      {
        day: 9,
        title: '第9天 · HIIT 初体验',
        exercises: [
        { displayText: '开合跳 40秒' },
        { displayText: '高抬腿 40秒' },
        { displayText: '深蹲跳 30秒' },
        { displayText: '波比跳 20秒' },
        { displayText: '以上循环4轮，每轮间休息60秒' }
      ],
        notes: '第一次 HIIT 训练！每个动作尽全力完成，休息时间不要延长。如果某个动作太激烈，放慢速度但要保持动作不停。',
      },
      {
        day: 10,
        title: '第10天 · 基础期收官',
        exercises: [
        { displayText: '自重深蹲 20次x3组' },
        { exerciseId: 'ex-chest-pushup', displayText: '俯卧撑 12次x3组' },
        { exerciseId: 'ex-back-row', displayText: '哑铃划船 12次x3组' },
        { exerciseId: 'ex-core-plank', displayText: '平板支撑 45秒x3组' },
        { displayText: 'HIIT 10分钟' }
      ],
        notes: '基础期结束了！你应该已经能感受到肌肉的紧实度有所提升。今天做一个小测试：看看俯卧撑能不能比第1天多做5个？',
      },
      // ═══ 进阶期：第11-20天 ═══
      {
        day: 11,
        title: '第11天 · 进阶开始',
        exercises: [
        { exerciseId: 'ex-legs-squat', displayText: '杠铃深蹲 10次x4组' },
        { displayText: '哑铃卧推 10次x4组' },
        { exerciseId: 'ex-back-pullup', displayText: '引体向上（或助力）5次x4组' },
        { exerciseId: 'ex-core-crunch', displayText: '卷腹 20次x3组' }
      ],
        notes: '进入进阶期！今天开始使用杠铃进行深蹲，注意杠铃杆放置在肩胛骨上方，不要压在颈椎上。组间休息60秒。',
      },
      {
        day: 12,
        title: '第12天 · 有氧耐力',
        exercises: [
        { displayText: '跳绳 3分钟x3组' },
        { displayText: '高抬腿 30次x3组' },
        { displayText: '登山跑 20次每侧x3组' },
        { displayText: 'Burpee 10次x3组' }
      ],
        notes: '有氧耐力日。跳绳如果不会可以原地跑步替代。登山跑保持核心稳定，肩膀在手腕正上方。组间休息30秒。',
      },
      {
        day: 13,
        title: '第13天 · 背部聚焦',
        exercises: [
        { exerciseId: 'ex-legs-deadlift', displayText: '罗马尼亚硬拉 10次x4组' },
        { exerciseId: 'ex-back-lat-pulldown', displayText: '高位下拉 12次x4组' },
        { exerciseId: 'ex-back-row', displayText: '哑铃划船 12次每侧x3组' },
        { displayText: '超人式 15次x3组' }
      ],
        notes: '背部训练日。硬拉时保持背部挺直，髋部向后推，感受大腿后侧和臀部的拉伸感。组间休息60秒。',
      },
      {
        day: 14,
        title: '第14天 · 肩膀与手臂',
        exercises: [
        { displayText: '哑铃推举 10次x4组' },
        { displayText: '哑铃侧平举 12次x3组' },
        { exerciseId: 'ex-bicep-hammer', displayText: '锤式弯举 12次x3组' },
        { displayText: '三头臂屈伸 12次x3组' },
        { exerciseId: 'ex-core-plank', displayText: '平板支撑 45秒x3组' }
      ],
        notes: '肩臂专项日。推举时肘部不要完全锁定，保持肩胛骨下沉。侧平举用轻重量，感受三角肌中束的灼烧感。组间休息45秒。',
      },
      {
        day: 15,
        title: '第15天 · 进阶期中点',
        exercises: [
        { exerciseId: 'ex-legs-squat', displayText: '杠铃深蹲 15次x4组' },
        { displayText: '哑铃卧推 12次x4组' },
        { exerciseId: 'ex-back-pullup', displayText: '引体向上（或助力）8次x3组' },
        { exerciseId: 'ex-core-russian-twist', displayText: '俄罗斯转体 20次x3组' }
      ],
        notes: '进入进阶期已经5天了，重量或次数应该比基础期提高了。如果感觉轻松，下次训练可以适当加重。',
      },
      {
        day: 16,
        title: '第16天 · HIIT 进阶',
        exercises: [
        { displayText: '波比跳 30秒' },
        { displayText: '登山跑 40秒' },
        { displayText: '深蹲跳 30秒' },
        { displayText: '开合跳 40秒' },
        { exerciseId: 'ex-chest-pushup', displayText: '俯卧撑 20秒' },
        { displayText: '以上循环5轮，组间休息45秒' }
      ],
        notes: 'HIIT 进阶日！相比第9天，循环从4轮增加到5轮，动作时间更长。保持高心率，这是燃脂和心肺提升的关键。',
      },
      {
        day: 17,
        title: '第17天 · 腿部深度刺激',
        exercises: [
        { exerciseId: 'ex-legs-squat', displayText: '杠铃深蹲 12次x5组' },
        { exerciseId: 'ex-legs-deadlift', displayText: '罗马尼亚硬拉 12次x4组' },
        { displayText: '保加利亚分腿蹲 10次每侧x3组' },
        { displayText: '提踵 20次x4组' }
      ],
        notes: '高强度腿部训练。保加利亚分腿蹲对平衡要求较高，可以扶墙辅助。提踵训练小腿，注意在顶部做1秒停顿。组间休息60秒。',
      },
      {
        day: 18,
        title: '第18天 · 胸部强化',
        exercises: [
        { exerciseId: 'ex-chest-incline-press', displayText: '上斜哑铃卧推 12次x4组' },
        { exerciseId: 'ex-chest-dumbbell-fly', displayText: '哑铃飞鸟 12次x3组' },
        { exerciseId: 'ex-chest-pushup', displayText: '俯卧撑（宽距）15次x4组' },
        { exerciseId: 'ex-core-plank', displayText: '平板支撑 50秒x3组' }
      ],
        notes: '胸部专项日。上斜卧推刺激上胸，飞鸟拉伸胸肌。宽距俯卧撑更多刺激胸大肌外侧。组间休息60秒。',
      },
      {
        day: 19,
        title: '第19天 · 全身循环',
        exercises: [
        { exerciseId: 'ex-legs-squat', displayText: '杠铃深蹲 12次x3组' },
        { exerciseId: 'ex-chest-pushup', displayText: '俯卧撑 15次x3组' },
        { exerciseId: 'ex-back-pullup', displayText: '引体向上 6次x3组' },
        { exerciseId: 'ex-core-crunch', displayText: '卷腹 25次x3组' },
        { exerciseId: 'ex-core-plank', displayText: '平板支撑 45秒x3组' },
        { displayText: '开合跳 30秒x3组' }
      ],
        notes: '全身循环训练，每个动作之间不休息（或仅休息15秒），一轮结束后休息90秒，完成3轮。这是超级组模式的入门训练。',
      },
      {
        day: 20,
        title: '第20天 · 进阶期收官',
        exercises: [
        { exerciseId: 'ex-legs-deadlift', displayText: '罗马尼亚硬拉 12次x4组' },
        { exerciseId: 'ex-chest-incline-press', displayText: '上斜哑铃卧推 12次x4组' },
        { exerciseId: 'ex-back-lat-pulldown', displayText: '高位下拉 12次x4组' },
        { exerciseId: 'ex-legs-lunge', displayText: '弓步蹲 12次每侧x3组' },
        { displayText: 'HIIT 15分钟' }
      ],
        notes: '进阶期结束！这10天你应该感受到了明显的能力提升。最后10天会更有挑战性，做好准备！',
      },
      // ═══ 挑战期：第21-30天 ═══
      {
        day: 21,
        title: '第21天 · 挑战期开启',
        exercises: [
        { exerciseId: 'ex-legs-squat', displayText: '杠铃深蹲 15次x5组' },
        { displayText: '哑铃卧推 12次x5组' },
        { exerciseId: 'ex-back-pullup', displayText: '引体向上 尽力x4组' },
        { exerciseId: 'ex-core-russian-twist', displayText: '俄罗斯转体 25次x4组' },
        { displayText: 'HIIT 10分钟' }
      ],
        notes: '挑战期开始！今天所有动作组数都增加了，训练量达到新高度。注意热身要充分，避免受伤。组间休息75秒。',
      },
      {
        day: 22,
        title: '第22天 · 力量极限',
        exercises: [
        { displayText: '杠铃硬拉 8次x5组' },
        { displayText: '杠铃卧推 10次x5组' },
        { displayText: '杠铃划船 10次x4组' },
        { displayText: '俯身飞鸟 12次x3组' }
      ],
        notes: '力量极限日！今天用你能控制的最大重量做复合动作。硬拉前充分热身，不要弓背。每组之间休息90秒，保证力量恢复。',
      },
      {
        day: 23,
        title: '第23天 · 心肺冲刺',
        exercises: [
        { displayText: '30秒全力冲刺跑（或原地高抬腿）x6组' },
        { displayText: '波比跳 15次x4组' },
        { displayText: '战绳或开合跳 40秒x4组' },
        { exerciseId: 'ex-core-plank', displayText: '平板支撑 60秒x3组' }
      ],
        notes: '心肺冲刺日！30秒冲刺/30秒休息为一组，完成6组。波比跳次数增加到15次。这是一场心肺的硬仗——坚持住！',
      },
      {
        day: 24,
        title: '第24天 · 核心终结者',
        exercises: [
        { exerciseId: 'ex-core-crunch', displayText: '卷腹 30次x4组' },
        { displayText: '悬垂举腿（或仰卧抬腿）15次x4组' },
        { exerciseId: 'ex-core-russian-twist', displayText: '俄罗斯转体（负重）20次x4组' },
        { exerciseId: 'ex-core-plank', displayText: '平板支撑 75秒x3组' }
      ],
        notes: '核心终极训练。悬垂举腿是腹肌训练的王牌动作，如果做不了可以用仰卧抬腿代替。平板支撑挑战75秒！组间休息45秒。',
      },
      {
        day: 25,
        title: '第25天 · 挑战期中途',
        exercises: [
        { exerciseId: 'ex-legs-squat', displayText: '杠铃深蹲 20次x4组' },
        { exerciseId: 'ex-back-pullup', displayText: '引体向上 尽力x4组' },
        { exerciseId: 'ex-back-row', displayText: '哑铃划船 15次x4组' },
        { exerciseId: 'ex-core-plank', displayText: '平板支撑 60秒x3组' },
        { displayText: 'HIIT 20分钟' }
      ],
        notes: '只剩5天了！今天的训练强度很高，注意动作质量比重量更重要。如果感觉过度疲劳，可以额外休息一天。',
      },
      {
        day: 26,
        title: '第26天 · 复合超级组',
        exercises: [
        { displayText: '深蹲+推举超级组 12次x4轮' },
        { displayText: '硬拉+划船超级组 12次x4轮' },
        { displayText: '俯卧撑+划船超级组 15次x4轮' },
        { displayText: 'HIIT 15分钟' }
      ],
        notes: '超级组训练日！两个动作连续完成不休息为一个超级组。深蹲+推举组合考验全身协调发力和心肺。每组间休息90秒。',
      },
      {
        day: 27,
        title: '第27天 · 全身耐力',
        exercises: [
        { exerciseId: 'ex-legs-squat', displayText: '杠铃深蹲 15次x4组' },
        { exerciseId: 'ex-chest-pushup', displayText: '俯卧撑 20次x4组' },
        { exerciseId: 'ex-back-pullup', displayText: '引体向上 10次x4组' },
        { exerciseId: 'ex-core-crunch', displayText: '卷腹 30次x4组' },
        { displayText: '开合跳 50次x4组' }
      ],
        notes: '全身耐力训练。所有动作做4组，各动作之间不休息，一组结束后直接做下一个动作。一轮完成后休息2分钟，重覆4轮。',
      },
      {
        day: 28,
        title: '第28天 · 爆发力训练',
        exercises: [
        { displayText: '深蹲跳 12次x4组' },
        { displayText: '俯卧撑击掌 8次x4组' },
        { displayText: '弓步跳 10次每侧x4组' },
        { displayText: 'Burpee 15次x4组' },
        { displayText: '冲刺跑（原地）30秒x4组' }
      ],
        notes: '爆发力训练！所有动作以最快速度完成。如果俯卧撑击掌做不了，用快速俯卧撑代替。每个动作之间休息45秒。🔥',
      },
      {
        day: 29,
        title: '第29天 · 巅峰预演',
        exercises: [
        { exerciseId: 'ex-legs-squat', displayText: '杠铃深蹲 20次x4组' },
        { displayText: '杠铃卧推 15次x4组' },
        { exerciseId: 'ex-back-pullup', displayText: '引体向上 尽力x5组' },
        { exerciseId: 'ex-core-plank', displayText: '平板支撑 90秒x3组' },
        { displayText: 'HIIT 20分钟' }
      ],
        notes: '最后冲刺前的预演！今天模拟最终挑战的强度和节奏。平板支撑挑战90秒，尽全力突破自己的极限。组间休息60秒。',
      },
      {
        day: 30,
        title: '第30天 · 最终挑战',
        exercises: [
        { displayText: '体能测试：俯卧撑最大次数 + 深蹲最大次数 + 平板支撑最长时间' },
        { displayText: '挑战循环：深蹲20次→俯卧撑20次→引体向上尽力×跳过→卷腹30次→开合跳50次 × 3轮' },
        { displayText: '对比第1天和今天的数据（体重、围度、力量）' }
      ],
        notes: '🎉 恭喜完成30天挑战！今天做一个完整的体能测试，和第一天的数据对比——俯卧撑多了多少个？深蹲更稳了吗？平板支撑撑了多久？真正的胜利不是和别人比，而是今天的你比第1天的你更强。休息两天，然后制定下一个挑战目标吧！',
      },
    ],
  },
]
