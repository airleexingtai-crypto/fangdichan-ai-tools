-- ============================================================
-- Content Translations — Chinese (zh)
-- Run in Supabase SQL Editor after full-setup.sql
-- Fallback: if no translation, English content is shown
-- ============================================================

DELETE FROM "ContentTranslation" WHERE locale = 'zh';

-- ======== BLOG POSTS (zh) ========

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, content) VALUES
('BlogPost', 'blog-001', 'zh',
 '2025年AI如何改变房地产行业',
 '从自动估值到虚拟展示，AI正在重塑房地产行业的每个角落。以下是经纪人、经纪公司和投资者需要了解的内容。',
 '<h2>AI革命已经到来</h2><p>2025年，人工智能在房地产领域已不再是未来概念——它已成为竞争必需品。根据美国全国房地产经纪人协会的数据，<strong>47%的经纪人现在在日常工作中使用AI工具</strong>，比2023年的28%大幅上升。</p><h2>关键变革领域</h2><h3>房产估值</h3><p>基于机器学习的自动估值模型（AVM）在标准住宅物业上的准确度已经可以媲美传统评估。Zillow Zestimate和Quantarium分析成千上万个数据点来生成实时估值。</p><h3>营销与虚拟展示</h3><p>像Styldod这样的AI虚拟展示工具可以在几分钟内以低于16美元的价格数字化布置空房，而传统展示每月需要1500-3000美元。使用AI展示照片的房源获得40%更多的在线浏览量。</p><h3>潜在客户生成</h3><p>像Revaluate这样的预测分析平台可以识别最有可能搬迁的房主，而像CINC这样的AI驱动CRM系统可以通过个性化沟通序列自动培育潜在客户。使用AI的顶尖团队报告称成交数量提高了3.2倍。</p><h2>结论</h2><p>现在拥抱AI的经纪人正在建立不可逾越的竞争优势。AI处理数据处理和潜在客户筛选，让你可以专注于关系、谈判和策略。</p>');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, content) VALUES
('BlogPost', 'blog-002', 'zh',
 '2025年房地产经纪人必备的10款AI工具',
 '房产估值、潜在客户生成、虚拟展示等领域的最佳AI平台——为房地产专业人士精心挑选。',
 '<h2>房产估值</h2><p><strong>1. Zillow AI (Zestimate)</strong> — 使用最广泛的AVM，覆盖1亿多套美国住宅，提供免费的实时估值。<strong>2. Quantarium</strong> — 企业级AVM，具备卫星图像分析能力，在Freddie Mac评估中名列前五。</p><h2>潜在客户生成</h2><p><strong>3. Revaluate</strong> — AI利用2000多个数据点预测潜在搬迁者。用户报告的转化率是购买线索的2-3倍。<strong>4. CINC</strong> — AI驱动的潜在客户评分和多渠道自动培育，支持双向短信对话。</p><h2>营销</h2><p><strong>5. Styldod</strong> — AI虚拟展示（16美元/张图片）、图像增强、平面图和房源描述。<strong>6. Matterport</strong> — 3D数字孪生与Cortex AI。带有虚拟导览的房源多获得49%的合格潜在客户。</p><h2>分析与搜索</h2><p><strong>7. HouseCanary</strong> — 机构级分析，3年价值预测。<strong>8. Plunk</strong> — 实时估值与装修ROI计算器。<strong>9. Restb.ai</strong> — 计算机视觉AI用于房产照片分析。<strong>10. Mosaik</strong> — AI驱动的社区匹配，根据生活方式偏好推荐。</p>');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, content) VALUES
('BlogPost', 'blog-003', 'zh',
 'AI房产估值：2025年AVM有多准确？',
 '深入分析AVM的准确性——什么时候可以信任AI估值，什么时候需要传统评估。',
 '<h2>2025年的AVM准确性</h2><p>顶级AVM在数据丰富的城市和郊区市场已实现<strong>2-3%的中位误差率</strong>。但准确性因数据可用性和物业类型而有显著差异。</p><h2>AVM如何工作</h2><p>现代AVM结合了可比销售分析、特征回归建模和机器学习。像Quantarium这样的高级模型还融合了卫星图像和计算机视觉。</p><h2>不同市场的准确性</h2><ul><li>城市/郊区，数据良好：2-3%中位误差——可可靠用于挂牌讨论</li><li>农村，数据有限：7-10%误差——仅作为起点参考</li><li>非披露州：5-8%误差——税务评估数据可能过时</li><li>独特/定制住宅：8-15%误差——缺乏可比销售</li></ul><h2>何时可以信任AVM</h2><p>AVM适用于挂牌价格指导、买家咨询、市场趋势分析和投资组合监控。但不应作为抵押贷款审批、遗产清算或无可比物业的豪华房产的唯一估值方法。</p>');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, content) VALUES
('BlogPost', 'blog-004', 'zh',
 'AI驱动潜在客户生成终极指南',
 '预测分析和自动化培育如何帮助经纪人发现并转化更多潜在客户，投入更少精力。',
 '<h2>为什么传统潜在客户生成失败了</h2><p>经纪人平均花费30-40%的时间在潜在客户生成上，但购买线索的转化率平均仅为0.5-2%。AI通过在正确的时间识别正确的人来改变这一现状。</p><h2>预测性卖家识别</h2><p>Revaluate分析每户家庭数千个数据点——房产净值、持有时间、生活事件——来预测哪些房主最有可能在6-12个月内搬迁。使用这种方法的经纪人报告转化率提高2-3倍。</p><h2>AI潜在客户评分</h2><p>像CINC这样的平台分析行为信号——邮件打开、房产浏览、短信回复——按转化可能性排序潜在客户。使用AI评分的团队看到预约转化率提高30-40%。</p><h2>自动化多渠道培育</h2><p>AI通过邮件、短信和自动电话进行规模化跟进。结果：通过改善原本会沉寂的潜在客户转化率，实现3-5倍的投资回报率。让AI处理日常沟通，你专注于成交。</p>');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, content) VALUES
('BlogPost', 'blog-005', 'zh',
 '虚拟展示 vs 传统展示：AI对比分析',
 '比较成本、速度、买家感知和投资回报率，决定哪种展示方式适合你的房源。',
 '<h2>展示行业的革命</h2><p>传统展示每月成本1500-3000美元，需要数周准备时间。AI虚拟展示每张图片仅需16美元，几分钟内即可完成——这对房地产营销来说是一个巨大的变革。</p><h2>成本对比</h2><ul><li>传统：每月1500-3000美元，另加家具租赁和布置费用</li><li>AI (Styldod)：16美元/张图片按需付费，或99-249美元/月订阅</li><li>每年上架12套房源的经纪人年度节省：15000-30000美元</li></ul><h2>买家感知与效果</h2><p>带有展示照片（虚拟或传统）的房源比无展示房源多获得40%的在线浏览量。在缩略图大小下，AI展示图片与传统照片几乎无法区分。大多数买家只想想象居住在这个空间里。</p><h2>何时使用每种方式</h2><p><strong>传统展示：</strong>豪宅（200万美元以上）、线下开放日、卖家有充足预算。<strong>AI展示：</strong>空置物业需要快速营销、预算有限、同一房间展示多种设计方案。</p>');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, content) VALUES
('BlogPost', 'blog-006', 'zh',
 '什么是NLP？房地产自然语言处理入门指南',
 'NLP如何驱动AI房产搜索、房源描述写作和智能聊天机器人在房地产行业的应用。',
 '<h2>NLP：理解语言的AI</h2><p>自然语言处理使计算机能够理解、解析和生成人类语言。在房地产领域，NLP驱动了自然语言搜索、自动房源描述、AI聊天机器人和情感分析等最引人注目的AI功能。</p><h2>自然语言房产搜索</h2><p>买家可以输入"奥斯汀附近好学区带大院子的3卧室工匠风格住宅，60万美元以下"这样的查询并获取相关结果。NLP解析查询提取物业类型、特征、价格限制、位置和品质偏好。</p><h2>自动房源描述</h2><p>NLP生成模型从物业特征中撰写引人入胜的MLS描述——既为SEO关键词优化，又对读者有吸引力。文案写手需要30-60分钟的工作，AI在几秒内完成。</p><h2>AI聊天机器人和虚拟助手</h2><p>NLP驱动的聊天机器人全天候处理买家咨询——回答物业问题、安排看房、根据预算和时间线筛选潜在客户。它们从每次对话中学习不断改进。</p><h2>NLP在房地产领域的未来</h2><p>期待AI能够谈判报价、审查合同中的不利条款、并通过综合多个数据源生成全面的物业报告。</p>');

-- ======== TUTORIALS (zh) ========

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, content) VALUES
('Tutorial', 'tut-001', 'zh',
 'Zillow AI市场分析入门指南',
 '学习如何使用Zillow的AI工具分析市场趋势、估算房产价值并做出数据驱动的决策。',
 '<h2>第一步：创建你的Zillow账户</h2><p>访问Zillow.com注册免费账户。免费账户可以使用基本房产搜索和Zestimate估值工具。</p><ul><li>点击右上角的<strong>注册</strong></li><li>输入邮箱并创建密码</li><li>通过确认链接验证邮箱</li><li>填写个人资料（如适用，包括你的房地产执照号码）</li></ul><h2>第二步：熟悉操作面板</h2><p>登录后进入Zillow仪表板，主要功能包括：</p><ul><li><strong>买房</strong> — 使用高级筛选搜索房源</li><li><strong>租房</strong> — 浏览出租房源</li><li><strong>卖房</strong> — Zestimate工具和房源资源</li><li><strong>住房贷款</strong> — 抵押贷款计算器</li><li><strong>经纪人查找</strong> — AI驱动的经纪人匹配</li></ul><h2>第三步：掌握Zestimate工具</h2><p>Zestimate是Zillow的AI驱动AVM，覆盖超过1亿套美国住宅。高效使用方法：</p><ul><li>按地址搜索任意房产</li><li>查看<strong>Zestimate历史</strong>图表（1年、5年和10年趋势）</li><li>检查<strong>Zestimate范围</strong>了解估值不确定性</li><li>与挂牌价格或税务评估对比</li></ul><h2>第四步：使用AI驱动的房产搜索</h2><p>Zillow的自然语言搜索允许你用日常语言描述需求：</p><ul><li>搜索"奥斯汀50万美元以下带游泳池的3卧室住宅"</li><li>应用筛选：价格、房屋类型、面积、建造年份</li><li>使用<strong>地图视图</strong>绘制自定义搜索范围</li><li>保存搜索并设置<strong>即时提醒</strong></li></ul><h2>第五步：利用市场分析功能</h2><ul><li><strong>市场报告</strong> — 按邮政编码查看价格、上市天数和库存的月度数据</li><li><strong>社区洞察</strong> — 学校评级、步行评分、交通评分</li><li><strong>可比销售</strong> — 查看最近出售的类似房产</li></ul><h2>第六步：融入你的工作流程</h2><ul><li>通过<strong>Zillow Tech Connect</strong>连接你的CRM</li><li>下载<strong>Zillow Premier Agent app</strong>随时随地访问</li><li>使用<strong>我的房源</strong>面板监控房源表现</li><li>查看<strong>联系人分析</strong>了解哪些潜在客户最活跃</li><li>导出市场报告为PDF用于客户演示</li></ul>');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, content) VALUES
('Tutorial', 'tut-002', 'zh',
 'AI虚拟展示完整指南 — Styldod使用教程',
 '一步一步教你使用AI为空置房产进行虚拟展示，从照片准备到最终营销物料。',
 '<h2>第一步：了解AI虚拟展示</h2><p>AI虚拟展示使用机器学习来数字化布置和装饰空房间。与传统展示每月1500-3000美元的成本相比，AI展示每张图片仅需16美元，几分钟即可完成。</p><ul><li>AI分析房间尺寸、光线和建筑特征</li><li>家具和装饰以正确的比例渲染</li><li>多种设计风格可选：现代、农舍、极简、斯堪的纳维亚</li></ul><h2>第二步：设置Styldod账户</h2><p>访问Styldod.com创建账户：</p><ul><li>选择套餐 — 按需付费（16美元/张）、Pro（99美元/月）或Team（249美元/月）</li><li>完善经纪公司信息</li><li>熟悉仪表板：上传、订单和作品集</li></ul><h2>第三步：准备照片</h2><p>AI展示输出的质量取决于输入照片的质量：</p><ul><li><strong>高分辨率图片</strong> — 长边至少2000像素</li><li><strong>良好光线</strong> — 自然光效果最好</li><li><strong>广角</strong> — 尽可能多地展示房间</li><li><strong>清除杂物</strong> — 拍摄前移除个人物品</li><li><strong>保持垂直线条笔直</strong> — 如有可能使用三脚架</li></ul><h2>第四步：上传并选择设计风格</h2><ul><li>点击<strong>新订单</strong>上传房产照片（每批最多20张）</li><li>选择房间类型：客厅、卧室、厨房、餐厅、家庭办公室</li><li>选择<strong>设计风格</strong> — 现代风格最受欢迎，适用性最广</li><li>为AI添加可选备注</li><li>检查订单摘要并提交</li></ul><h2>第五步：审核并优化结果</h2><ul><li>对比原图检查每张展示图片的真实性</li><li>检查AI瑕疵：家具变形、阴影不匹配</li><li>如需调整使用<strong>修改请求</strong>功能</li><li>下载网页优化版或印刷质量版</li></ul><h2>第六步：优化MLS房源</h2><ul><li>使用虚拟展示的房源获得<strong>40%更多的在线浏览量</strong></li><li>买家在展示房源页面上停留<strong>3倍更长时间</strong></li><li>务必在房源说明中<strong>披露虚拟展示</strong></li><li>附上一张原始空房间照片以保持透明度</li></ul><h2>第七步：探索更多工具</h2><ul><li><strong>图像增强</strong> — 自动校正光线和色彩平衡</li><li><strong>平面图生成</strong> — 将照片转换为2D平面图</li><li><strong>房源描述撰写器</strong> — AI生成MLS描述</li><li><strong>社交媒体生成器</strong> — 自动创建Instagram和Facebook营销帖子</li></ul>');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, content) VALUES
('Tutorial', 'tut-003', 'zh',
 '使用Matterport创建专业3D虚拟导览',
 '掌握Matterport平台，为房产创建沉浸式3D导览，吸引更多买家。',
 '<h2>第一步：选择你的Matterport相机</h2><p>Matterport支持多种拍摄设备：</p><ul><li><strong>Matterport Pro3</strong> — 旗舰3D相机，顶级精度</li><li><strong>Matterport Pro2</strong> — 上一代产品，价格更低但品质出色</li><li><strong>智能手机（iPhone/Android）</strong> — 免费Matterport Capture app</li><li><strong>理光Theta / Insta360</strong> — 通过集成的第三方360相机</li><li><strong>Leica BLK360</strong> — 适用于大型商业物业的激光扫描</li></ul><h2>第二步：规划扫描策略</h2><ul><li>扫描点<strong>相距1.5-2.5米</strong>以获得最佳对齐效果</li><li>每个扫描点必须能看到至少两个其他位置</li><li>扫描所有房间：浴室、壁橱、洗衣房、车库</li><li>包括室外空间：庭院、阳台、花园、房屋正面外观</li><li>避免相机直射阳光或反光表面</li><li>扫描前关闭所有室内门</li></ul><h2>第三步：拍摄物业</h2><ul><li>将相机放置在第一个扫描点</li><li>从app启动拍摄 — 相机自动旋转</li><li>按照规划的网格移动到每个点位</li><li>app实时显示对齐状态 — 绿色=已对齐</li><li>典型的2000平方英尺住宅：<strong>30-60个扫描点位，45-90分钟</strong></li></ul><h2>第四步：上传并处理</h2><ul><li>通过Wi-Fi上传扫描数据到Matterport云端</li><li>Cortex AI将扫描数据处理成3D网格、鸟瞰图和平面图</li><li>处理时间：住宅物业通常<strong>2-4小时</strong></li><li>准备就绪后你会收到邮件通知</li></ul><h2>第五步：自定义导览</h2><ul><li><strong>添加Mattertags</strong> — 带文字、照片、视频的交互式热点</li><li><strong>设置起始视角</strong> — 选择访客看到的第一个房间和角度</li><li><strong>创建精彩集锦</strong> — 自动导航的引导式视频导览</li><li><strong>生成平面图</strong> — Cortex AI自动生成2D平面图</li><li><strong>添加房间标签</strong> — 标记厨房、主卧等</li></ul><h2>第六步：发布和分享</h2><ul><li><strong>MLS集成</strong> — 一键同步到主流MLS平台</li><li><strong>嵌入网站</strong> — 复制iframe嵌入代码</li><li><strong>社交媒体</strong> — 分享导览链接到Facebook、Instagram、LinkedIn</li><li><strong>虚拟开放日</strong> — 使用Matterport Live举办实时导览和问答</li><li><strong>二维码</strong> — 生成二维码放在庭院的"For Sale"牌子上</li><li><strong>下载素材</strong> — 导出高清照片、GIF动图和鸟瞰图</li></ul>');

-- ======== COMPARISONS (zh) ========

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, content) VALUES
('Comparison', 'comp-001', 'zh',
 'Zillow AI vs Quantarium：哪个AVM更准确？',
 '详细对比覆盖准确性、覆盖范围、定价和使用场景。',
 '<h2>准确性对比</h2><p>Zillow Zestimate在挂牌房源上的<strong>中位误差率为2.4%</strong>，非挂牌房源约为7.5%。在人口密集的城市地区准确度最高（可低至1.5%），在农村市场最弱（10%以上）。Quantarium在Freddie Mac评估中被独立评为<strong>机构级准确度前五强</strong>，在传统数据稀缺的地区通过卫星图像获得优势。</p><h2>覆盖范围和数据源</h2><p>Zillow覆盖<strong>1亿套美国房产</strong>，使用公共税务记录、MLS数据和用户提交信息——24小时内更新。Quantarium覆盖<strong>1.5亿套房产</strong>，整合卫星图像、地理空间数据和计算机视觉——每周更新。</p><h2>定价和可获取性</h2><p>Zillow Zestimate对消费者和经纪人<strong>完全免费</strong>，通过Zillow网站和app提供。Quantarium采用<strong>企业定价模式</strong>，中型贷款机构通常每月2000-5000美元。</p><h2>推荐</h2><p><strong>选择Zillow AI：</strong>如果你是经纪人或投资者，需要在数据丰富的市场获得免费、即时的估值。<strong>选择Quantarium：</strong>如果你是贷款机构、保险公司或机构投资者，需要可审计、可靠的估值并包含卫星图像分析。</p>');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, content) VALUES
('Comparison', 'comp-002', 'zh',
 'Styldod vs Matterport：房产营销AI工具对决',
 '比较AI虚拟展示与3D数字孪生在房地产营销中的应用。',
 '<h2>核心功能</h2><p>Styldod是一个<strong>AI虚拟展示和图像增强平台</strong>——数字化布置空房间并生成营销内容。Matterport是一个<strong>3D空间数据平台</strong>——创建沉浸式数字孪生用于虚拟导航。许多成功团队两者都用：Matterport做沉浸式导览，Styldod增强从导览中提取的静态图片。</p><h2>成本分析</h2><p>Styldod：<strong>16美元/张图片</strong>按需付费，或99-249美元/月订阅。Matterport：需要兼容相机（智能手机=免费，Pro3约6000美元）加上9.99-309美元/月订阅。</p><h2>买家参与度</h2><p>Styldod在30-60分钟内生成逼真的静态图片。Matterport创建互动体验，买家可以按自己的节奏浏览——使用Matterport的房源多获得<strong>49%的合格潜在客户</strong>。权衡：Matterport现场拍摄需要45-90分钟，而Styldod拍照只需5分钟。</p><h2>最佳使用场景</h2><p><strong>Styldod</strong>：需要经济高效的MLS展示的空置物业、快速房源包装、投资物业。<strong>Matterport</strong>：豪宅房源、远程买家、商业地产、具有独特建筑特色的物业。</p>');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, content) VALUES
('Comparison', 'comp-003', 'zh',
 'Revaluate vs CINC：AI潜在客户生成对决',
 '头对头比较预测性潜在客户评分和自动化潜在客户培育平台。',
 '<h2>潜在客户生成方法</h2><p>Revaluate是一个<strong>预测性分析引擎</strong>——它通过分析2000多个数据点来识别最有可能在6-12个月内搬迁的房主。CINC是一个<strong>潜在客户培育和转化平台</strong>——它接收现有潜在客户并利用AI进行评分、优先级排序和自动多渠道跟进。</p><h2>准确性和表现</h2><p>Revaluate实现<strong>70-80%的搬迁预测准确率</strong>，识别出的潜在客户转化率是购买线索的2-3倍。CINC的AI评分通过实时行为评分实现<strong>预约转化率30-40%的提升</strong>。</p><h2>自动化能力</h2><p>Revaluate通过API与你的CRM集成，提供评分后的潜在客户列表——不包含内置的培育序列。CINC是一个完整的沟通平台，包含邮件、短信和自动电话提醒。其AI个人助手可自动处理双向短信对话。</p><h2>定价</h2><p>Revaluate起价<strong>99美元/月</strong>（500个联系人）。CINC Professional套餐起价<strong>400美元/月</strong>。</p><h2>最终判断</h2><p>Revaluate擅长<strong>发现其他人不知道的卖家</strong>。CINC擅长<strong>转化你已有的潜在客户</strong>。理想配置：两者并用——Revaluate识别可能搬迁的房主，将他们输入CINC进行自动化培育。</p>');

-- ======== STAT PAGES (zh) ========

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, content) VALUES
('StatPage', 'stat-001', 'zh',
 '房地产AI采用率：2025年统计数据',
 '<h2>关键发现</h2><p>2025年，人工智能在房地产行业的采用已达到临界点。<strong>47%的房地产经纪人现在在日常工作中使用AI工具</strong>，比2023年的28%上升了68%。</p><h2>按经纪人类型划分的采用率</h2><ul><li><strong>顶尖团队（年交易额1000万美元以上）</strong>：78%使用AI工具——通常集成多个平台</li><li><strong>独立经纪人</strong>：41%至少使用一个AI工具</li><li><strong>新经纪人（持牌不到2年）</strong>：53%——年轻专业人士更早采用AI</li><li><strong>商业房地产</strong>：35%——由于交易更复杂且专用工具较少，采用较慢</li></ul><h2>各AI工具采用率</h2><ul><li><strong>自动估值模型（AVM）</strong>：62%——使用最广泛的AI类别</li><li><strong>虚拟展示</strong>：48%——受数字化营销驱动快速增长</li><li><strong>潜在客户评分/CRM AI</strong>：39%</li><li><strong>AI内容生成</strong>：34%</li><li><strong>预测性潜在客户分析</strong>：28%——增长最快，从2023年的12%大幅上升</li></ul><h2>生产力影响</h2><p>使用AI的经纪人每周节省<strong>8-12小时</strong>的行政任务时间。顶尖采用者报告的成交数量是未使用AI同行的<strong>3.2倍</strong>。</p>');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, content) VALUES
('StatPage', 'stat-002', 'zh',
 '房地产AI市场规模与增长预测',
 '<h2>市场概览</h2><p>全球房地产AI市场预计从<strong>2024年的58亿美元增长到2027年的150亿美元</strong>，复合年增长率约为37%。</p><h2>细分市场</h2><ul><li><strong>房产估值与分析</strong>：21亿美元——最大细分市场</li><li><strong>潜在客户生成与CRM</strong>：15亿美元——AI评分和培育平台</li><li><strong>房产营销</strong>：12亿美元——虚拟展示、内容生成</li><li><strong>房产搜索</strong>：9亿美元——NLP搜索和推荐</li><li><strong>交易管理</strong>：7亿美元——合同审核和自动化</li></ul><h2>增长驱动因素</h2><ul><li>远程办公增加了对虚拟导览和数字交易的需求</li><li>来自MLS、卫星和物联网传感器的物业数据激增</li><li>消费者期待AI驱动的个性化体验</li><li>早期AI采用者正在获取可量化的市场份额</li><li>2024年房地产科技领域获得超过150亿美元风险投资</li></ul><h2>区域分析</h2><p>北美：<strong>45%市场份额</strong>。欧洲：25%。亚太：20%（增长最快，复合年增长率达42%）。</p>');

-- ======== GLOSSARY TERMS (zh) ========
-- Using extra_json for term, definition, long_definition

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, extra_json) VALUES
('GlossaryTerm', 'gloss-001', 'zh',
 'AVM（自动估值模型）',
 '一种利用AI技术分析公共记录、近期销售和市场趋势数据来估算房产价值的系统。',
 '{"term":"AVM（自动估值模型）","definition":"一种利用AI技术分析公共记录、近期销售和市场趋势数据来估算房产价值的系统。","long_definition":"AVM利用机器学习通过分析成千上万个数据点（包括可比销售、房产特征和市场趋势）来估算房产市值。主要的AVM包括Zillow Zestimate（覆盖1亿多套美国住宅，中位误差率2.4%）和Quantarium（覆盖1.5亿多套房产，结合卫星图像分析）。AVM广泛用于挂牌价格指导、贷款预审和投资组合监控。"}');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, extra_json) VALUES
('GlossaryTerm', 'gloss-002', 'zh', '预测性分析', '利用AI和统计算法基于历史数据识别未来结果的方法。', '{"term":"预测性分析","definition":"利用AI和统计算法基于历史数据识别未来结果的方法。","long_definition":"预测性分析结合历史交易数据、房产特征、人口变化和消费者行为来预测未来结果。常见应用包括识别潜在卖家、预测价格升值和按转化概率对潜在客户评分。Revaluate等平台每户分析2000多个数据点，实现70-80%的搬迁预测准确率。"}');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, extra_json) VALUES
('GlossaryTerm', 'gloss-003', 'zh', 'NLP（自然语言处理）', 'AI的一个分支，使计算机能够理解、解释和生成人类语言。', '{"term":"NLP（自然语言处理）","definition":"AI的一个分支，使计算机能够理解、解释和生成人类语言。","long_definition":"NLP驱动自然语言房产搜索、自动房源描述生成、买家咨询AI聊天机器人和潜在客户沟通情感分析。Zillow、Styldod和Mosaik等平台集成NLP以改进搜索和内容生成。"}');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, extra_json) VALUES
('GlossaryTerm', 'gloss-004', 'zh', '计算机视觉', '分析和解读图片与视频中视觉信息的AI技术。', '{"term":"计算机视觉","definition":"分析和解读图片与视频中视觉信息的AI技术。","long_definition":"房地产领域的计算机视觉可从照片中识别房间类型、建筑特征和物业状况。Restb.ai等平台可识别100多种物业特征，用于自动化MLS合规检查、视觉房产搜索和评估支持的物业状况评估。"}');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, extra_json) VALUES
('GlossaryTerm', 'gloss-005', 'zh', '数字孪生', '物理房产的虚拟3D复制品，支持远程导览和空间分析。', '{"term":"数字孪生","definition":"物理房产的虚拟3D复制品，支持远程导览和空间分析。","long_definition":"数字孪生是物业的交互式、尺寸精确的3D模型。Matterport以超过1000万个已拍摄空间领先市场。Cortex AI自动识别3D模型中的房间、物体和特征。数字孪生可实现沉浸式虚拟导览、自动平面图和远程物业检查。对豪宅房源和远程买家尤为重要。"}');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, extra_json) VALUES
('GlossaryTerm', 'gloss-006', 'zh', '潜在客户评分', '基于行为数据按转化可能性对销售线索进行排名的AI驱动方法。', '{"term":"潜在客户评分","definition":"基于行为数据按转化可能性对销售线索进行排名的AI驱动方法。","long_definition":"AI潜在客户评分分析邮件打开、房产浏览、搜索历史、短信回复和网站停留时间来分配实时转化概率分数。与传统静态规则不同，AI评分随行为变化持续更新。CINC报告称实时AI评分可将预约转化率提高30-40%。"}');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, extra_json) VALUES
('GlossaryTerm', 'gloss-007', 'zh', '自动化培育序列', 'AI驱动的多轮沟通（邮件、短信、电话），随时间自动跟进和筛选潜在客户。', '{"term":"自动化培育序列","definition":"AI驱动的多轮沟通（邮件、短信、电话），随时间自动跟进和筛选潜在客户。","long_definition":"自动化培育用AI编排的多渠道沟通流取代人工跟进。一个序列可能包括咨询后的即时短信确认、包含相关房源的个性化邮件和自动安排的回访电话。CINC AI个人助手可进行双向短信对话并自动安排预约。团队报告通过改善原本会沉寂的潜在客户转化实现3-5倍投资回报率。"}');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, extra_json) VALUES
('GlossaryTerm', 'gloss-008', 'zh', '投资回报率分析', '计算房地产决策的投资回报——AI增强后可考虑市场趋势和升值预测。', '{"term":"投资回报率分析","definition":"计算房地产决策的投资回报——AI增强后可考虑市场趋势和升值预测。","long_definition":"Plunk和HouseCanary等AI驱动的ROI工具可评估装修投资回报率、租金收入预测、多物业投资组合表现以及结合税务影响和升值预测的买vs租分析。这些工具分析远超手动电子表格模型的数据，提供更精细的投资指导。"}');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, extra_json) VALUES
('GlossaryTerm', 'gloss-009', 'zh', '虚拟展示', '利用AI在房产照片中数字化布置和装饰空房间的技术。', '{"term":"虚拟展示","definition":"利用AI在房产照片中数字化布置和装饰空房间的技术。","long_definition":"AI虚拟展示利用计算机视觉和生成式AI分析房间尺寸和光线，然后以正确的比例数字插入家具和装饰。Styldod提供的展示服务从16美元/张图片起，而传统展示每月需1500-3000美元。使用展示照片的房源获得40%更多的浏览量。同一房间可以应用多种设计风格。"}');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, extra_json) VALUES
('GlossaryTerm', 'gloss-010', 'zh', '地理空间分析', 'AI驱动的位置数据分析，结合卫星图像、地图和房产记录。', '{"term":"地理空间分析","definition":"AI驱动的位置数据分析，结合卫星图像、地图和房产记录。","long_definition":"地理空间分析整合卫星图像、GIS地图、房产记录和人口数据库进行规模化房地产分析。应用包括从航拍图像评估社区质量、洪水风险分析、土地利用模式识别和市场热力图。Quantarium将地理空间分析作为其企业级AVM的关键差异化优势。"}');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, extra_json) VALUES
('GlossaryTerm', 'gloss-011', 'zh', '3D渲染', '从3D模型创建逼真2D图像的过程，用于房产营销。', '{"term":"3D渲染","definition":"从3D模型创建逼真2D图像的过程，用于房产营销。","long_definition":"3D渲染将空间数据转换为逼真的视觉呈现。它驱动Matterport虚拟导览、新建房产的建筑可视化、虚拟翻新预览和商业物业的飞越动画。AI已将渲染时间从每帧数小时大幅缩短到几秒钟，使3D可视化对日常住宅房源也变得经济可行。"}');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, extra_json) VALUES
('GlossaryTerm', 'gloss-012', 'zh', '机器学习', 'AI核心技术，算法通过分析数据模式在经验中不断改进。', '{"term":"机器学习","definition":"AI核心技术，算法通过分析数据模式在经验中不断改进。","long_definition":"机器学习是大多数房地产AI应用的基础技术。它驱动估算物业价值的AVM、识别潜在卖家的预测模型、将买家匹配到房产的推荐引擎以及分析物业照片的计算机视觉系统。其关键优势在于能够识别跨数千个变量的复杂非线性关系。"}');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, extra_json) VALUES
('GlossaryTerm', 'gloss-013', 'zh', '深度学习', '使用多层神经网络的进阶机器学习，用于复杂AI应用。', '{"term":"深度学习","definition":"使用多层神经网络的进阶机器学习，用于复杂AI应用。","long_definition":"深度学习利用多层人工神经网络处理复杂数据。在房地产领域，它驱动能识别照片中100多种物业特征的计算机视觉、用于房源描述和聊天机器人的自然语言模型以及分析卫星图像的估值模型。它随数据增加而改进，使Zillow和Quantarium等大规模平台受益。"}');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, extra_json) VALUES
('GlossaryTerm', 'gloss-014', 'zh', 'CMA（比较市场分析）', '通过与最近出售的类似房产比较来估算物业价值的方法——日益被AI增强。', '{"term":"CMA（比较市场分析）","definition":"通过与最近出售的类似房产比较来估算物业价值的方法——日益被AI增强。","long_definition":"CMA将待评估物业与最近出售的具有相似特征的「可比物业」进行对比。AI增强的CMA可即时识别最相关的可比物业、调整特征差异、按时间和距离加权，并在几分钟内生成专业报告。结合算法分析和经纪人专业知识——是挂牌展示和买家咨询的首选方法。"}');

INSERT INTO "ContentTranslation" (content_type, content_id, locale, title, description, extra_json) VALUES
('GlossaryTerm', 'gloss-015', 'zh', 'PropTech（房地产科技）', '房地产技术——指利用技术创新房地产行业的软件、平台和工具的广泛类别。', '{"term":"PropTech（房地产科技）","definition":"房地产技术——指利用技术创新房地产行业的软件、平台和工具的广泛类别。","long_definition":"房地产科技涵盖应用于房地产的所有技术：AI估值、虚拟导览、数字交易、智能家居技术和物业管理软件。该行业在2024年吸引了超过150亿美元的风险投资。子类别包括住宅房地产科技、商业房地产科技、建筑科技和房地产金融科技。AI是房地产科技中增长最快的细分领域。"}');
