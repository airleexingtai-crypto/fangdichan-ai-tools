-- Seed data: Categories
INSERT INTO "Category" (id, slug, name, description, icon, sort_order) VALUES
('cat-001', 'property-search', 'Property Search', 'AI-powered property discovery and matching tools', '🏠', 1),
('cat-002', 'analytics', 'Analytics & Data', 'Predictive analytics, valuation models, and market intelligence', '📊', 2),
('cat-003', 'automation', 'Automation', 'Workflow automation, document processing, and transaction management', '🤖', 3),
('cat-004', 'crm', 'CRM & Communication', 'AI-enhanced customer relationship management and lead nurturing', '💬', 4),
('cat-005', 'marketing', 'Marketing & Media', 'Content generation, virtual staging, and property marketing', '📸', 5),
('cat-006', 'transaction', 'Transaction Management', 'Contract review, closing automation, and compliance', '📋', 6);

-- Seed data: Tools
INSERT INTO "Tool" (id, slug, name, tagline, website_url, description, pricing_model, pricing_json, features_json, pros_json, cons_json, use_cases_json, founded_year, api_available, avg_rating, review_count, status, published_at, created_at, updated_at) VALUES
('tool-001', 'zillow-ai', 'Zillow AI', 'AI-powered property valuation and personalized home recommendations', 'https://www.zillow.com', 'Zillow uses machine learning algorithms to power its Zestimate home valuation model, covering over 100 million homes. The platform provides personalized property recommendations based on user behavior, search patterns, and preferences.', 'FREEMIUM', '{"free":"Basic listing access","premium":"$29.99/mo","enterprise":"Custom pricing"}', '["Automated valuation model (AVM)","AI-powered home recommendations","Natural language search","Computer vision photo analysis","Market trend predictions","Rental estimate (Rent Zestimate)"]', '["Most accurate AVM on the market","Massive data coverage (100M+ homes)","User-friendly interface","Strong mobile experience"]', '["Limited to US market","Premium features require subscription","Estimates can lag in fast-moving markets"]', '["Home valuation for buyers and sellers","Market research for investors","Rental price analysis","Neighborhood comparison"]', 2006, true, 4.5, 128, 'PUBLISHED', NOW(), NOW(), NOW()),

('tool-002', 'revaluate', 'Revaluate', 'AI-driven predictive analytics to identify likely movers and sellers', 'https://www.revaluate.com', 'Revaluate uses AI and machine learning to predict which homeowners are most likely to move in the next 6-12 months. The platform analyzes thousands of data points including property history, demographic shifts, and life events to generate high-quality seller leads.', 'PAID', '{"starter":"$99/mo","professional":"$249/mo","enterprise":"Custom"}', '["Move prediction scoring","Life event tracking","Automated lead lists","CRM integration","Market heat maps","Equity analysis"]', '["High accuracy move predictions","Seamless CRM integrations","Saves agent marketing spend","Weekly updated data"]', '["Premium pricing","Requires CRM to maximize value","US-only coverage"]', '["Agent lead generation","Brokerage marketing strategy","Targeted direct mail campaigns","Farm area optimization"]', 2015, true, 4.7, 89, 'PUBLISHED', NOW(), NOW(), NOW()),

('tool-003', 'quantarium', 'Quantarium', 'Automated valuation models and property intelligence for enterprises', 'https://www.quantarium.com', 'Quantarium provides enterprise-grade automated valuation models (AVMs) and property intelligence solutions. Its AI engine processes satellite imagery, property records, and market data to deliver highly accurate valuations.', 'ENTERPRISE', '{"enterprise":"Custom pricing based on volume"}', '["Automated Valuation Model (AVM)","Computer vision property analysis","Portfolio valuation","Market forecasting","Risk scoring","Geospatial analytics"]', '["Industry-leading accuracy","Satellite imagery analysis","Enterprise-ready API","Covers 150M+ properties"]', '["Enterprise-only (no self-serve)","Complex onboarding","Expensive for small businesses"]', '["Mortgage underwriting","Portfolio valuation","Insurance risk assessment","Real estate investment analysis"]', 2017, true, 4.3, 56, 'PUBLISHED', NOW(), NOW(), NOW()),

('tool-004', 'restb-ai', 'Restb.ai', 'Computer vision AI for real estate image and video analysis', 'https://www.restb.ai', 'Restb.ai specializes in computer vision technology for real estate. The platform automatically tags, categorizes, and analyzes property photos and videos, extracting valuable insights about property conditions, features, and amenities.', 'PAID', '{"starter":"$499/mo","growth":"$1,499/mo","enterprise":"Custom"}', '["Image recognition (100+ features)","Automated photo tagging","Property condition assessment","Virtual staging detection","MLS compliance checking","Video analysis"]', '["Best-in-class real estate computer vision","Rapid API response times","Detailed documentation","Used by major MLS platforms"]', '["Requires technical integration","Volume-based pricing can scale quickly","Limited to visual analysis"]', '["MLS photo compliance","Automated property descriptions","Visual search","Appraisal support"]', 2015, true, 4.6, 72, 'PUBLISHED', NOW(), NOW(), NOW()),

('tool-005', 'housecanary', 'HouseCanary', 'AI-powered residential real estate analytics and forecasting', 'https://www.housecanary.com', 'HouseCanary provides residential real estate analytics and AI-driven property valuations. Their platform combines machine learning with comprehensive property data to deliver valuation forecasts, market analysis, and investment insights.', 'ENTERPRISE', '{"enterprise":"Custom pricing"}', '["3-year value forecasting","Automated valuation model","Market rent estimates","Portfolio analytics","Risk assessment","Investment scoring"]', '["Long-horizon forecasts (36 months)","Comprehensive historical data","Institutional-grade accuracy","Strong API documentation"]', '["Enterprise pricing (no self-serve)","US-focused","Data updates can lag in fast markets"]', '["Investment property analysis","Portfolio risk management","Lending decisions","Market research"]', 2013, true, 4.4, 93, 'PUBLISHED', NOW(), NOW(), NOW()),

('tool-006', 'mosaik', 'Mosaik', 'AI-driven neighborhood insights and home search platform', 'https://www.mosaik.com', 'Mosaik combines AI with hyper-local data to help homebuyers find neighborhoods that match their lifestyle. The platform analyzes commute times, school ratings, amenities, crime data, and community vibes to generate personalized recommendations.', 'FREEMIUM', '{"free":"Basic search","premium":"$19.99/mo","agent":"$49.99/mo"}', '["Neighborhood matching engine","Commute analysis","School district ratings","Lifestyle scoring","Neighborhood comparison","Saved search alerts"]', '["Unique neighborhood-focused approach","Rich local data","Great UI/UX","Freemium model accessible to all"]', '["Limited coverage in rural areas","Newer platform (less data maturity)","Agent-focused features extra"]', '["Homebuyer neighborhood research","Relocation planning","Rental market exploration","Agent client matching"]', 2020, false, 4.2, 41, 'PUBLISHED', NOW(), NOW(), NOW()),

('tool-007', 'cinc', 'CINC', 'AI-powered lead generation and nurturing for top real estate teams', 'https://www.cincpro.com', 'CINC (Commissions Inc) uses AI to identify, score, and nurture real estate leads. The platform automates follow-up sequences, prioritizes high-intent prospects, and provides agents with actionable insights.', 'PAID', '{"professional":"$400/mo","team":"$800/mo","brokerage":"Custom"}', '["AI lead scoring","Automated nurture sequences","Behavior tracking","Smart lead routing","ROI analytics","Multi-channel communication"]', '["Strong lead scoring accuracy","Fully automated follow-ups","Good team collaboration tools","Integrates with major CRMs"]', '["Expensive for solo agents","Setup requires training","Heavy on email (less SMS)"]', '["Agent lead conversion","Team lead distribution","Brokerage pipeline management","Marketing ROI tracking"]', 2012, true, 4.1, 107, 'PUBLISHED', NOW(), NOW(), NOW()),

('tool-008', 'matterport', 'Matterport', 'AI-powered 3D digital twins and virtual tours for properties', 'https://www.matterport.com', 'Matterport creates AI-enhanced 3D digital twins of properties, enabling immersive virtual tours, automated measurements, and spatial data analysis. The platform processes billions of spatial data points to create accurate 3D models.', 'FREEMIUM', '{"free":"1 active space","starter":"$9.99/mo","professional":"$69/mo","business":"$309/mo"}', '["3D digital twin creation","AI-powered object recognition","Automated floor plans","Virtual tour hosting","Measurement tools","Cortex AI insights"]', '["Industry standard for 3D tours","Excellent accuracy","Powerful AI features","Wide integration ecosystem"]', '["Requires compatible camera hardware","Larger properties need premium plan","Processing time for large spaces"]', '["Virtual property tours","Remote appraisal","Insurance documentation","Construction progress tracking"]', 2011, true, 4.6, 210, 'PUBLISHED', NOW(), NOW(), NOW()),

('tool-009', 'styldod', 'Styldod', 'AI virtual staging, image enhancement, and marketing content generation', 'https://www.styldod.com', 'Styldod offers a suite of AI tools for real estate marketing including virtual staging, image enhancement, floor plan generation, and automated listing descriptions. Over 500,000 properties have been marketed using the platform.', 'FREEMIUM', '{"pay_as_you_go":"$16/image","pro":"$99/mo","team":"$249/mo"}', '["Virtual staging (AI)","Image enhancement","Floor plan generation","Listing description writer","Social media content generator","Virtual renovation preview"]', '["Fast turnaround (minutes vs days)","Cost-effective vs traditional staging","Multiple design styles available","Good for vacant property marketing"]', '["Occasional AI artifacts in images","Floor plans require good source photos","Pay-as-you-go adds up for high volume"]', '["Vacant home marketing","Listing presentation enhancement","Renovation visualization","Social media content creation"]', 2018, true, 4.3, 155, 'PUBLISHED', NOW(), NOW(), NOW()),

('tool-010', 'plunk', 'Plunk', 'Real-time AI home valuation and investment analytics', 'https://www.plunk.co', 'Plunk uses deep learning models to provide real-time home valuation and renovation ROI analysis. The platform helps homeowners understand their property''s current market value and which renovations will most increase it.', 'FREEMIUM', '{"free":"Basic valuation","premium":"$14.99/mo","pro":"$39.99/mo"}', '["Real-time home valuation","Renovation ROI calculator","Market trend alerts","Neighborhood analytics","Portfolio tracking","Price change monitoring"]', '["Real-time updates (not monthly)","Excellent renovation ROI tool","Clean mobile experience","Free tier available"]', '["Newer entrant (less historical data)","Limited to 30 major US metros","Consumer-focused (less B2B)"]', '["Homeowner valuation tracking","Renovation planning","Investment property analysis","Market timing decisions"]', 2021, false, 4.5, 47, 'PUBLISHED', NOW(), NOW(), NOW());

-- Tool-Category links
INSERT INTO "ToolCategory" (tool_id, category_id, is_primary) VALUES
('tool-001', 'cat-001', true), ('tool-001', 'cat-002', false),
('tool-002', 'cat-002', true), ('tool-002', 'cat-004', false),
('tool-003', 'cat-002', true),
('tool-004', 'cat-001', true), ('tool-004', 'cat-002', false),
('tool-005', 'cat-002', true), ('tool-005', 'cat-006', false),
('tool-006', 'cat-001', true),
('tool-007', 'cat-004', true), ('tool-007', 'cat-003', false),
('tool-008', 'cat-005', true), ('tool-008', 'cat-001', false),
('tool-009', 'cat-005', true),
('tool-010', 'cat-002', true), ('tool-010', 'cat-001', false);

-- Tool Alternatives
INSERT INTO "ToolAlternative" (tool_id, alternative_id) VALUES
('tool-001', 'tool-003'), ('tool-001', 'tool-005'), ('tool-001', 'tool-010'),
('tool-004', 'tool-008'), ('tool-004', 'tool-009'),
('tool-007', 'tool-002');

-- Comparisons
INSERT INTO "Comparison" (id, slug, title, description, winner_json, status, published_at, created_at, updated_at) VALUES
('comp-001', 'zillow-ai-vs-quantarium', 'Zillow AI vs Quantarium: Which AVM Is More Accurate?', 'A detailed comparison of Zillow''s Zestimate and Quantarium''s enterprise AVM, covering accuracy, coverage, pricing, and use cases.', '{"winner":"quantarium","note":"Quantarium edges out for institutional accuracy, but Zillow wins for accessibility."}', 'PUBLISHED', NOW(), NOW(), NOW()),
('comp-002', 'styldod-vs-matterport', 'Styldod vs Matterport: AI Tools for Property Marketing', 'Comparing AI virtual staging (Styldod) with 3D digital twins (Matterport) for real estate marketing.', '{"winner":"tie","note":"Each serves a different purpose."}', 'PUBLISHED', NOW(), NOW(), NOW()),
('comp-003', 'revaluate-vs-cinc', 'Revaluate vs CINC: AI Lead Generation Showdown', 'Head-to-head comparison of predictive lead scoring (Revaluate) and automated lead nurturing (CINC) platforms.', '{"winner":"tie","note":"Revaluate excels at identifying sellers; CINC excels at nurturing and converting them."}', 'PUBLISHED', NOW(), NOW(), NOW());

INSERT INTO "ComparisonTool" (comparison_id, tool_id) VALUES
('comp-001', 'tool-001'), ('comp-001', 'tool-003'),
('comp-002', 'tool-009'), ('comp-002', 'tool-008'),
('comp-003', 'tool-002'), ('comp-003', 'tool-007');

-- Tutorials
INSERT INTO "Tutorial" (id, slug, title, description, estimated_minutes, difficulty, status, published_at, created_at, updated_at, category_id) VALUES
('tut-001', 'getting-started-zillow-ai', 'Getting Started with Zillow AI for Market Analysis', 'Learn how to use Zillow''s AI tools to analyze market trends, estimate property values, and make data-driven decisions.', 15, 'Beginner', 'PUBLISHED', NOW(), NOW(), NOW(), 'cat-002'),
('tut-002', 'virtual-staging-guide', 'Complete Guide to AI Virtual Staging with Styldod', 'Step-by-step tutorial on staging vacant properties using AI, from photo preparation to final marketing materials.', 20, 'Intermediate', 'PUBLISHED', NOW(), NOW(), NOW(), 'cat-005'),
('tut-003', '3d-tours-matterport', 'Creating Professional 3D Virtual Tours with Matterport', 'Master Matterport''s platform to create immersive 3D property tours that attract more buyers.', 25, 'Intermediate', 'PUBLISHED', NOW(), NOW(), NOW(), 'cat-005');

INSERT INTO "TutorialTool" (tutorial_id, tool_id) VALUES
('tut-001', 'tool-001'),
('tut-002', 'tool-009'),
('tut-003', 'tool-008');

-- Stat Pages
INSERT INTO "StatPage" (id, slug, title, hero_stat, hero_label, status, published_at, created_at, updated_at, category_id) VALUES
('stat-001', 'ai-adoption-real-estate-2025', 'AI Adoption in Real Estate: 2025 Statistics', '47%', 'of agents now use AI tools', 'PUBLISHED', NOW(), NOW(), NOW(), 'cat-002'),
('stat-002', 'ai-real-estate-market-size', 'AI in Real Estate: Market Size & Growth Projections', '$15B', 'projected market by 2027', 'PUBLISHED', NOW(), NOW(), NOW(), 'cat-002');

INSERT INTO "StatSource" (id, stat_page_id, title, url, publisher, year) VALUES
('src-001', 'stat-001', 'NAR Technology Survey 2025', 'https://www.nar.realtor', 'National Association of Realtors', 2025),
('src-002', 'stat-001', 'McKinsey Global Institute AI Report', 'https://www.mckinsey.com', 'McKinsey', 2025),
('src-003', 'stat-002', 'MarketsAndMarkets Research', 'https://www.marketsandmarkets.com', 'MarketsAndMarkets', 2025);

-- Reviews
INSERT INTO "Review" (id, tool_id, author_name, rating, title, body, created_at) VALUES
('rev-001', 'tool-001', 'Sarah Chen', 5, 'Essential for any real estate professional', 'Zillow''s AI tools have completely transformed how I do market analysis. The Zestimate accuracy is incredible in my market (Austin), and the recommendation engine helps me match clients to properties they actually want.', NOW()),
('rev-002', 'tool-002', 'Mike Harrison', 5, 'Best lead gen investment I''ve made', 'Revaluate has been a game-changer for our team. The move predictions are eerily accurate, and we''ve doubled our listing appointments since implementing it.', NOW()),
('rev-003', 'tool-009', 'Jessica Liu', 4, 'Great for vacant listings', 'Styldod is our go-to for staging vacant properties. The AI staging looks natural in most cases, and it saves us thousands vs traditional staging.', NOW()),
('rev-004', 'tool-008', 'David Kim', 5, 'The gold standard for virtual tours', 'Matterport tours are now expected by buyers in our market. The 3D accuracy is mind-blowing, and the AI features keep getting better.', NOW()),
('rev-005', 'tool-010', 'Rachel Martinez', 5, 'Love the renovation ROI calculator', 'Plunk''s renovation ROI tool is the best I''ve found. It helped a client decide which upgrades to make before listing, and they made an extra $45K on the sale.', NOW()),
('rev-006', 'tool-007', 'Tom Brooks', 4, 'Powerful but steep learning curve', 'CINC''s AI lead scoring is impressive, and the nurture sequences work. But it took our team a good month to fully set up and optimize. Worth it once configured though.', NOW());
