-- ⚠️ Drop existing tables first
DROP TABLE IF EXISTS "ContentTranslation" CASCADE;
DROP TABLE IF EXISTS "BlogPost" CASCADE;
DROP TABLE IF EXISTS "GlossaryTerm" CASCADE;
DROP TABLE IF EXISTS "AffiliateClick" CASCADE;
DROP TABLE IF EXISTS "Review" CASCADE;
DROP TABLE IF EXISTS "StatSource" CASCADE;
DROP TABLE IF EXISTS "StatPage" CASCADE;
DROP TABLE IF EXISTS "TutorialTool" CASCADE;
DROP TABLE IF EXISTS "Tutorial" CASCADE;
DROP TABLE IF EXISTS "ComparisonTool" CASCADE;
DROP TABLE IF EXISTS "Comparison" CASCADE;
DROP TABLE IF EXISTS "ToolAlternative" CASCADE;
DROP TABLE IF EXISTS "ToolCategory" CASCADE;
DROP TABLE IF EXISTS "ToolTranslation" CASCADE;
DROP TABLE IF EXISTS "LocaleContent" CASCADE;
DROP TABLE IF EXISTS "ContentVerification" CASCADE;
DROP TABLE IF EXISTS "Tool" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TYPE IF EXISTS "ContentStatus" CASCADE;
DROP TYPE IF EXISTS "PricingModel" CASCADE;

-- Enums
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'AI_GENERATED', 'HUMAN_VERIFIED', 'PUBLISHED', 'NEEDS_UPDATE', 'ARCHIVED');
CREATE TYPE "PricingModel" AS ENUM ('FREE', 'FREEMIUM', 'PAID', 'ENTERPRISE', 'FREE_TRIAL');

-- Tables with snake_case columns (matching JS code convention)
CREATE TABLE "Tool" (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT NOT NULL,
    affiliate_url TEXT,
    description TEXT NOT NULL,
    long_description TEXT,
    pricing_model "PricingModel" NOT NULL DEFAULT 'FREE',
    pricing_json JSONB,
    features_json JSONB,
    pros_json JSONB,
    cons_json JSONB,
    use_cases_json JSONB,
    founded_year INTEGER,
    api_available BOOLEAN NOT NULL DEFAULT false,
    avg_rating DECIMAL(2,1),
    review_count INTEGER NOT NULL DEFAULT 0,
    status "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    verified_at TIMESTAMP(3),
    next_review_at TIMESTAMP(3),
    published_at TIMESTAMP(3),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Tool_status_publishedAt_idx" ON "Tool"(status, published_at);

CREATE TABLE "Category" (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    parent_id TEXT REFERENCES "Category"(id),
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "ToolCategory" (
    tool_id TEXT NOT NULL REFERENCES "Tool"(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL REFERENCES "Category"(id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (tool_id, category_id)
);

CREATE TABLE "ToolAlternative" (
    tool_id TEXT NOT NULL REFERENCES "Tool"(id) ON DELETE CASCADE,
    alternative_id TEXT NOT NULL REFERENCES "Tool"(id) ON DELETE CASCADE,
    reason TEXT,
    PRIMARY KEY (tool_id, alternative_id)
);

CREATE TABLE "Comparison" (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    winner_json JSONB,
    matrix_json JSONB,
    status "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    published_at TIMESTAMP(3),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Comparison_status_publishedAt_idx" ON "Comparison"(status, published_at);

CREATE TABLE "ComparisonTool" (
    comparison_id TEXT NOT NULL REFERENCES "Comparison"(id) ON DELETE CASCADE,
    tool_id TEXT NOT NULL REFERENCES "Tool"(id) ON DELETE CASCADE,
    PRIMARY KEY (comparison_id, tool_id)
);

CREATE TABLE "Tutorial" (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    estimated_minutes INTEGER,
    difficulty TEXT,
    status "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    published_at TIMESTAMP(3),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL,
    category_id TEXT REFERENCES "Category"(id)
);
CREATE INDEX "Tutorial_status_publishedAt_idx" ON "Tutorial"(status, published_at);

CREATE TABLE "TutorialTool" (
    tutorial_id TEXT NOT NULL REFERENCES "Tutorial"(id) ON DELETE CASCADE,
    tool_id TEXT NOT NULL REFERENCES "Tool"(id) ON DELETE CASCADE,
    PRIMARY KEY (tutorial_id, tool_id)
);

CREATE TABLE "StatPage" (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    hero_stat TEXT,
    hero_label TEXT,
    content TEXT,
    chart_json JSONB,
    status "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    published_at TIMESTAMP(3),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL,
    category_id TEXT REFERENCES "Category"(id)
);
CREATE INDEX "StatPage_status_publishedAt_idx" ON "StatPage"(status, published_at);

CREATE TABLE "StatSource" (
    id TEXT PRIMARY KEY,
    stat_page_id TEXT NOT NULL REFERENCES "StatPage"(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    publisher TEXT,
    year INTEGER,
    quote_text TEXT
);
CREATE INDEX "StatSource_statPageId_idx" ON "StatSource"(stat_page_id);

CREATE TABLE "Review" (
    id TEXT PRIMARY KEY,
    tool_id TEXT NOT NULL REFERENCES "Tool"(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    title TEXT,
    body TEXT NOT NULL,
    source TEXT,
    source_url TEXT,
    verified_at TIMESTAMP(3),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Review_toolId_idx" ON "Review"(tool_id);

CREATE TABLE "AffiliateClick" (
    id TEXT PRIMARY KEY,
    tool_id TEXT NOT NULL REFERENCES "Tool"(id) ON DELETE CASCADE,
    page_slug TEXT,
    clicked_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_hash TEXT
);
CREATE INDEX "AffiliateClick_toolId_clickedAt_idx" ON "AffiliateClick"(tool_id, clicked_at);

CREATE TABLE "ToolTranslation" (
    id TEXT PRIMARY KEY,
    tool_id TEXT NOT NULL REFERENCES "Tool"(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,
    name TEXT,
    tagline TEXT,
    description TEXT,
    UNIQUE (tool_id, locale)
);
CREATE INDEX "ToolTranslation_locale_idx" ON "ToolTranslation"(locale);

CREATE TABLE "LocaleContent" (
    id TEXT PRIMARY KEY,
    key TEXT NOT NULL,
    locale TEXT NOT NULL,
    value TEXT NOT NULL,
    UNIQUE (key, locale)
);

CREATE TABLE "ContentVerification" (
    id TEXT PRIMARY KEY,
    content_type TEXT NOT NULL,
    content_id TEXT NOT NULL,
    verified_by TEXT NOT NULL,
    verified_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    changes_json JSONB
);

CREATE TABLE "ContentTranslation" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL,
    content_id TEXT NOT NULL,
    locale TEXT NOT NULL,
    title TEXT,
    description TEXT,
    content TEXT,
    extra_json JSONB,
    UNIQUE (content_type, content_id, locale)
);
CREATE INDEX "ContentTranslation_ct_idx" ON "ContentTranslation"(content_type, content_id);

CREATE TABLE "BlogPost" (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    author TEXT,
    featured_image TEXT,
    category TEXT,
    status "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    published_at TIMESTAMP(3),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL
);
CREATE INDEX "BlogPost_status_publishedAt_idx" ON "BlogPost"(status, published_at);

CREATE TABLE "GlossaryTerm" (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    term TEXT NOT NULL,
    definition TEXT NOT NULL,
    long_definition TEXT,
    category TEXT,
    related_slugs JSONB,
    status "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL
);
CREATE INDEX "GlossaryTerm_status_idx" ON "GlossaryTerm"(status);
CREATE INDEX "GlossaryTerm_category_idx" ON "GlossaryTerm"(category);

-- ======== SEED DATA ========

INSERT INTO "Category" (id, slug, name, description, icon, sort_order) VALUES
('cat-001', 'property-search', 'Property Search', 'AI-powered property discovery and matching tools', '🏠', 1),
('cat-002', 'analytics', 'Analytics & Data', 'Predictive analytics, valuation models, and market intelligence', '📊', 2),
('cat-003', 'automation', 'Automation', 'Workflow automation, document processing, and transaction management', '🤖', 3),
('cat-004', 'crm', 'CRM & Communication', 'AI-enhanced customer relationship management and lead nurturing', '💬', 4),
('cat-005', 'marketing', 'Marketing & Media', 'Content generation, virtual staging, and property marketing', '📸', 5),
('cat-006', 'transaction', 'Transaction Management', 'Contract review, closing automation, and compliance', '📋', 6);

INSERT INTO "Tool" (id, slug, name, tagline, website_url, description, pricing_model, pricing_json, features_json, pros_json, cons_json, use_cases_json, founded_year, api_available, avg_rating, review_count, status, published_at, created_at, updated_at) VALUES
('tool-001', 'zillow-ai', 'Zillow AI', 'AI-powered property valuation and personalized home recommendations', 'https://www.zillow.com', 'Zillow uses machine learning algorithms to power its Zestimate home valuation model, covering over 100 million homes. The platform provides personalized property recommendations based on user behavior, search patterns, and preferences.', 'FREEMIUM', '{"free":"Basic listing access","premium":"$29.99/mo","enterprise":"Custom pricing"}', '["Automated valuation model (AVM)","AI-powered home recommendations","Natural language search","Computer vision photo analysis","Market trend predictions","Rental estimate (Rent Zestimate)"]', '["Most accurate AVM on the market","Massive data coverage (100M+ homes)","User-friendly interface","Strong mobile experience"]', '["Limited to US market","Premium features require subscription","Estimates can lag in fast-moving markets"]', '["Home valuation for buyers and sellers","Market research for investors","Rental price analysis","Neighborhood comparison"]', 2006, true, 4.5, 128, 'PUBLISHED', NOW(), NOW(), NOW()),
('tool-002', 'revaluate', 'Revaluate', 'AI-driven predictive analytics to identify likely movers and sellers', 'https://www.revaluate.com', 'Revaluate uses AI and machine learning to predict which homeowners are most likely to move in the next 6-12 months.', 'PAID', '{"starter":"$99/mo","professional":"$249/mo","enterprise":"Custom"}', '["Move prediction scoring","Life event tracking","Automated lead lists","CRM integration","Market heat maps","Equity analysis"]', '["High accuracy move predictions","Seamless CRM integrations","Saves agent marketing spend"]', '["Premium pricing","Requires CRM to maximize value","US-only coverage"]', '["Agent lead generation","Brokerage marketing strategy","Targeted direct mail campaigns"]', 2015, true, 4.7, 89, 'PUBLISHED', NOW(), NOW(), NOW()),
('tool-003', 'quantarium', 'Quantarium', 'Automated valuation models and property intelligence for enterprises', 'https://www.quantarium.com', 'Quantarium provides enterprise-grade automated valuation models (AVMs) and property intelligence solutions.', 'ENTERPRISE', '{"enterprise":"Custom pricing based on volume"}', '["Automated Valuation Model (AVM)","Computer vision property analysis","Portfolio valuation","Market forecasting","Risk scoring"]', '["Industry-leading accuracy","Satellite imagery analysis","Enterprise-ready API","Covers 150M+ properties"]', '["Enterprise-only (no self-serve)","Complex onboarding","Expensive for small businesses"]', '["Mortgage underwriting","Portfolio valuation","Insurance risk assessment"]', 2017, true, 4.3, 56, 'PUBLISHED', NOW(), NOW(), NOW()),
('tool-004', 'restb-ai', 'Restb.ai', 'Computer vision AI for real estate image and video analysis', 'https://www.restb.ai', 'Restb.ai specializes in computer vision technology for real estate. The platform automatically tags, categorizes, and analyzes property photos and videos.', 'PAID', '{"starter":"$499/mo","growth":"$1,499/mo","enterprise":"Custom"}', '["Image recognition (100+ features)","Automated photo tagging","Property condition assessment","MLS compliance checking","Video analysis"]', '["Best-in-class real estate computer vision","Rapid API response times","Used by major MLS platforms"]', '["Requires technical integration","Volume-based pricing can scale quickly"]', '["MLS photo compliance","Automated property descriptions","Visual search","Appraisal support"]', 2015, true, 4.6, 72, 'PUBLISHED', NOW(), NOW(), NOW()),
('tool-005', 'housecanary', 'HouseCanary', 'AI-powered residential real estate analytics and forecasting', 'https://www.housecanary.com', 'HouseCanary provides residential real estate analytics and AI-driven property valuations with 3-year value forecasting.', 'ENTERPRISE', '{"enterprise":"Custom pricing"}', '["3-year value forecasting","Automated valuation model","Market rent estimates","Portfolio analytics","Risk assessment"]', '["Long-horizon forecasts (36 months)","Comprehensive historical data","Institutional-grade accuracy"]', '["Enterprise pricing (no self-serve)","US-focused","Data updates can lag in fast markets"]', '["Investment property analysis","Portfolio risk management","Lending decisions","Market research"]', 2013, true, 4.4, 93, 'PUBLISHED', NOW(), NOW(), NOW()),
('tool-006', 'mosaik', 'Mosaik', 'AI-driven neighborhood insights and home search platform', 'https://www.mosaik.com', 'Mosaik combines AI with hyper-local data to help homebuyers find neighborhoods that match their lifestyle.', 'FREEMIUM', '{"free":"Basic search","premium":"$19.99/mo","agent":"$49.99/mo"}', '["Neighborhood matching engine","Commute analysis","School district ratings","Lifestyle scoring","Neighborhood comparison"]', '["Unique neighborhood-focused approach","Rich local data","Great UI/UX","Freemium model"]', '["Limited coverage in rural areas","Newer platform (less data maturity)"]', '["Homebuyer neighborhood research","Relocation planning","Rental market exploration"]', 2020, false, 4.2, 41, 'PUBLISHED', NOW(), NOW(), NOW()),
('tool-007', 'cinc', 'CINC', 'AI-powered lead generation and nurturing for top real estate teams', 'https://www.cincpro.com', 'CINC uses AI to identify, score, and nurture real estate leads. The platform automates follow-up sequences and prioritizes high-intent prospects.', 'PAID', '{"professional":"$400/mo","team":"$800/mo","brokerage":"Custom"}', '["AI lead scoring","Automated nurture sequences","Behavior tracking","Smart lead routing","ROI analytics"]', '["Strong lead scoring accuracy","Fully automated follow-ups","Good team collaboration tools"]', '["Expensive for solo agents","Setup requires training","Heavy on email (less SMS)"]', '["Agent lead conversion","Team lead distribution","Brokerage pipeline management"]', 2012, true, 4.1, 107, 'PUBLISHED', NOW(), NOW(), NOW()),
('tool-008', 'matterport', 'Matterport', 'AI-powered 3D digital twins and virtual tours for properties', 'https://www.matterport.com', 'Matterport creates AI-enhanced 3D digital twins of properties, enabling immersive virtual tours, automated measurements, and spatial data analysis.', 'FREEMIUM', '{"free":"1 active space","starter":"$9.99/mo","professional":"$69/mo","business":"$309/mo"}', '["3D digital twin creation","AI-powered object recognition","Automated floor plans","Virtual tour hosting","Measurement tools"]', '["Industry standard for 3D tours","Excellent accuracy","Powerful AI features","Wide integration ecosystem"]', '["Requires compatible camera hardware","Larger properties need premium plan"]', '["Virtual property tours","Remote appraisal","Insurance documentation","Construction progress tracking"]', 2011, true, 4.6, 210, 'PUBLISHED', NOW(), NOW(), NOW()),
('tool-009', 'styldod', 'Styldod', 'AI virtual staging, image enhancement, and marketing content generation', 'https://www.styldod.com', 'Styldod offers a suite of AI tools for real estate marketing including virtual staging, image enhancement, floor plan generation, and automated listing descriptions.', 'FREEMIUM', '{"pay_as_you_go":"$16/image","pro":"$99/mo","team":"$249/mo"}', '["Virtual staging (AI)","Image enhancement","Floor plan generation","Listing description writer","Social media content generator"]', '["Fast turnaround (minutes vs days)","Cost-effective vs traditional staging","Multiple design styles available"]', '["Occasional AI artifacts in images","Floor plans require good source photos"]', '["Vacant home marketing","Listing presentation enhancement","Renovation visualization"]', 2018, true, 4.3, 155, 'PUBLISHED', NOW(), NOW(), NOW()),
('tool-010', 'plunk', 'Plunk', 'Real-time AI home valuation and investment analytics', 'https://www.plunk.co', 'Plunk uses deep learning models to provide real-time home valuation and renovation ROI analysis.', 'FREEMIUM', '{"free":"Basic valuation","premium":"$14.99/mo","pro":"$39.99/mo"}', '["Real-time home valuation","Renovation ROI calculator","Market trend alerts","Neighborhood analytics","Portfolio tracking"]', '["Real-time updates (not monthly)","Excellent renovation ROI tool","Clean mobile experience"]', '["Newer entrant (less historical data)","Limited to 30 major US metros"]', '["Homeowner valuation tracking","Renovation planning","Investment property analysis"]', 2021, false, 4.5, 47, 'PUBLISHED', NOW(), NOW(), NOW());

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

-- Comparisons
INSERT INTO "Comparison" (id, slug, title, description, winner_json, status, published_at, created_at, updated_at) VALUES
('comp-001', 'zillow-ai-vs-quantarium', 'Zillow AI vs Quantarium: Which AVM Is More Accurate?', 'A detailed comparison covering accuracy, coverage, pricing, and use cases.', '{"winner":"quantarium","note":"Quantarium edges out for institutional accuracy."}', 'PUBLISHED', NOW(), NOW(), NOW()),
('comp-002', 'styldod-vs-matterport', 'Styldod vs Matterport: AI Tools for Property Marketing', 'Comparing AI virtual staging with 3D digital twins for real estate marketing.', '{"winner":"tie","note":"Each serves a different purpose."}', 'PUBLISHED', NOW(), NOW(), NOW()),
('comp-003', 'revaluate-vs-cinc', 'Revaluate vs CINC: AI Lead Generation Showdown', 'Head-to-head comparison of predictive lead scoring and automated lead nurturing.', '{"winner":"tie","note":"Revaluate for sellers, CINC for nurturing."}', 'PUBLISHED', NOW(), NOW(), NOW());

INSERT INTO "ComparisonTool" (comparison_id, tool_id) VALUES
('comp-001', 'tool-001'), ('comp-001', 'tool-003'),
('comp-002', 'tool-009'), ('comp-002', 'tool-008'),
('comp-003', 'tool-002'), ('comp-003', 'tool-007');

-- Tutorials
INSERT INTO "Tutorial" (id, slug, title, description, estimated_minutes, difficulty, status, published_at, created_at, updated_at, category_id) VALUES
('tut-001', 'getting-started-zillow-ai', 'Getting Started with Zillow AI for Market Analysis', 'Learn how to use Zillow AI tools to analyze market trends and estimate property values.', 15, 'Beginner', 'PUBLISHED', NOW(), NOW(), NOW(), 'cat-002'),
('tut-002', 'virtual-staging-guide', 'Complete Guide to AI Virtual Staging with Styldod', 'Step-by-step tutorial on staging vacant properties using AI.', 20, 'Intermediate', 'PUBLISHED', NOW(), NOW(), NOW(), 'cat-005'),
('tut-003', '3d-tours-matterport', 'Creating Professional 3D Virtual Tours with Matterport', 'Master Matterport platform to create immersive 3D property tours.', 25, 'Intermediate', 'PUBLISHED', NOW(), NOW(), NOW(), 'cat-005');

INSERT INTO "TutorialTool" (tutorial_id, tool_id) VALUES
('tut-001', 'tool-001'), ('tut-002', 'tool-009'), ('tut-003', 'tool-008');

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
('rev-001', 'tool-001', 'Sarah Chen', 5, 'Essential for any real estate professional', 'Zillow AI tools have completely transformed how I do market analysis. The Zestimate accuracy is incredible in my market (Austin).', NOW()),
('rev-002', 'tool-002', 'Mike Harrison', 5, 'Best lead gen investment I have made', 'Revaluate has been a game-changer for our team. The move predictions are eerily accurate.', NOW()),
('rev-003', 'tool-009', 'Jessica Liu', 4, 'Great for vacant listings', 'Styldod is our go-to for staging vacant properties. Saves us thousands vs traditional staging.', NOW()),
('rev-004', 'tool-008', 'David Kim', 5, 'The gold standard for virtual tours', 'Matterport tours are now expected by buyers in our market. The 3D accuracy is mind-blowing.', NOW()),
('rev-005', 'tool-010', 'Rachel Martinez', 5, 'Love the renovation ROI calculator', 'Plunk renovation ROI tool helped a client decide which upgrades to make before listing.', NOW()),
('rev-006', 'tool-007', 'Tom Brooks', 4, 'Powerful but steep learning curve', 'CINC AI lead scoring is impressive. Took a month to set up but worth it once configured.', NOW());

-- Blog Posts
INSERT INTO "BlogPost" (id, slug, title, description, content, author, category, status, published_at, created_at, updated_at) VALUES
('blog-001', 'ai-transforming-real-estate-2025', 'How AI Is Transforming Real Estate in 2025', 'From automated valuations to virtual staging, AI is reshaping every corner of the real estate industry. Here is what agents, brokers, and investors need to know.', '<h2>The AI Revolution Has Arrived</h2><p>In 2025, artificial intelligence is no longer a futuristic concept in real estate — it is a competitive necessity. According to the National Association of Realtors, <strong>47% of agents now use AI tools</strong> in their daily workflow, up from just 28% in 2023. This rapid adoption reflects a fundamental shift in how properties are valued, marketed, and sold.</p><h2>Key Areas of Transformation</h2><h3>Property Valuation</h3><p>Automated Valuation Models (AVMs) powered by machine learning now rival traditional appraisals in accuracy for standard residential properties. Platforms like Zillow (Zestimate) and Quantarium analyze thousands of data points — from public records to satellite imagery — to generate real-time property valuations. The median error rate for top-tier AVMs has dropped below 3% in well-covered markets.</p><h3>Marketing and Virtual Staging</h3><p>AI virtual staging tools like Styldod can digitally furnish an empty room in minutes for under $16, compared to $1,500-$3,000 per month for traditional staging. Listings with AI-staged photos receive 40% more online views and help buyers visualize the potential of vacant spaces.</p><h3>Lead Generation and Nurturing</h3><p>Predictive analytics platforms like Revaluate identify homeowners most likely to move in the next 6-12 months, while AI-powered CRM systems like CINC automatically nurture leads through personalized, multi-channel communication sequences. The result: top-performing teams using AI lead tools report 3.2x more closed transactions.</p><h2>What This Means for Real Estate Professionals</h2><p>The agents and brokerages that embrace AI now are building an unassailable competitive advantage. The key is not to replace human expertise but to augment it — letting AI handle data processing, content generation, and lead qualification so professionals can focus on relationships, negotiation, and strategy. The question is no longer <em>if</em> AI will transform real estate, but how quickly you adapt to the new reality.</p>', 'AI Tools for Real Estate Team', 'Trends', 'PUBLISHED', NOW(), NOW(), NOW()),
('blog-002', 'top-ai-tools-real-estate-agents', 'Top 10 AI Tools Every Real Estate Agent Needs in 2025', 'The best AI-powered platforms for property valuation, lead generation, virtual staging, and more — curated for real estate professionals.', '<h2>Essential AI Tools for Modern Agents</h2><p>The real estate AI tool landscape is growing fast. With hundreds of options, choosing the right tools can be overwhelming. We have curated the top 10 AI tools across five essential categories to help you build a winning tech stack.</p><h2>Property Valuation</h2><h3>1. Zillow AI (Zestimate)</h3><p>The most widely used AVM, covering 100M+ U.S. homes. Free, real-time valuations with a median error rate of 2.4% for on-market homes. Best for: agents who need quick, client-friendly valuations.</p><h3>2. Quantarium</h3><p>Enterprise-grade AVM with satellite imagery analysis and 150M+ property coverage. Top-5 accuracy in Freddie Mac assessments. Best for: lenders, institutional investors, and portfolio managers.</p><h2>Lead Generation</h2><h3>3. Revaluate</h3><p>AI predicts which homeowners are most likely to move in 6-12 months using 2,000+ data points. Users report 2-3x higher conversion rates vs. purchased leads. Best for: agents looking for high-intent seller leads.</p><h3>4. CINC</h3><p>AI-powered lead scoring and automated multi-channel nurturing. The AI Personal Assistant handles two-way SMS conversations automatically. Best for: teams managing 50+ active leads who need automation.</p><h2>Marketing and Content</h2><h3>5. Styldod</h3><p>AI virtual staging ($16/image), image enhancement, floor plan generation, and listing description writing. Over 500,000 properties marketed. Best for: listing agents who want cost-effective marketing.</p><h3>6. Matterport</h3><p>3D digital twins and immersive virtual tours with Cortex AI spatial analysis. Listings with Matterport tours generate 49% more qualified leads. Best for: luxury listings and remote buyer engagement.</p><h2>Analytics and Research</h2><h3>7. HouseCanary</h3><p>Institutional-grade residential analytics with 3-year value forecasting. Comprehensive market data and portfolio risk assessment. Best for: investors and large brokerages.</p><h3>8. Plunk</h3><p>Real-time home valuation with renovation ROI calculator. Clean mobile experience with a free tier. Best for: agents and homeowners tracking property values.</p><h2>Visual Intelligence</h2><h3>9. Restb.ai</h3><p>Computer vision AI for automated property photo tagging, MLS compliance checking, and visual search. Used by major MLS platforms. Best for: large brokerages and MLS providers.</p><h2>Search and Discovery</h2><h3>10. Mosaik</h3><p>AI-driven neighborhood matching based on lifestyle preferences, commute analysis, and school ratings. Unique neighborhood-focused approach. Best for: buyer agents helping clients find the right area.</p>', 'AI Tools for Real Estate Team', 'Tools', 'PUBLISHED', NOW(), NOW(), NOW()),
('blog-003', 'ai-property-valuation-accuracy', 'AI Property Valuation: How Accurate Are Automated Valuation Models in 2025?', 'A deep dive into AVM accuracy, methodology, and when you can trust an AI valuation over a traditional appraisal.', '<h2>Understanding AVM Accuracy</h2><p>Automated Valuation Models have improved dramatically in recent years. The best AVMs now achieve <strong>median error rates of 2-3%</strong> in well-covered urban and suburban markets. However, accuracy varies significantly based on data availability, property type, and market conditions.</p><h2>How AVMs Work</h2><p>Modern AVMs combine three approaches: <strong>comparable sales analysis</strong> (finding similar recently sold properties), <strong>hedonic regression modeling</strong> (analyzing how individual property features contribute to value), and <strong>machine learning</strong> (identifying complex patterns across thousands of transactions). The most advanced models, like Quantarium, also incorporate satellite imagery and computer vision to assess property condition and neighborhood quality.</p><h2>Accuracy by Market Type</h2><ul><li><strong>Urban/suburban, good data</strong>: 2-3% median error — highly reliable for listing discussions and buyer consultations</li><li><strong>Rural, limited data</strong>: 7-10% median error — use as a starting point only; a traditional appraisal is still necessary</li><li><strong>Non-disclosure states</strong>: 5-8% median error — AVMs rely more heavily on tax assessment data, which may be stale</li><li><strong>Unique/custom homes</strong>: 8-15% error — AVMs struggle with properties that lack good comparable sales</li></ul><h2>When You Can Trust an AVM</h2><p>AVMs are sufficiently accurate for: listing price guidance, buyer consultations, market trend analysis, portfolio monitoring, and preliminary underwriting. They should NOT be the sole valuation method for: final mortgage approval, estate settlement, divorce proceedings, or luxury/custom properties with no comparable. In all cases, AVMs work best when combined with a real estate professional interpretation — the human element remains essential for understanding neighborhood nuances, property condition, and market dynamics that algorithms cannot fully capture.</p>', 'AI Tools for Real Estate Team', 'Technology', 'PUBLISHED', NOW(), NOW(), NOW()),
('blog-004', 'ai-lead-generation-real-estate', 'The Ultimate Guide to AI-Powered Lead Generation for Real Estate', 'How predictive analytics, behavioral scoring, and automated nurturing are helping agents find and convert more leads with less effort.', '<h2>Why Traditional Lead Gen Is Failing</h2><p>The average real estate agent spends <strong>30-40% of their time</strong> on lead generation activities — cold calling, door knocking, purchased lead lists, and generic email blasts. Yet conversion rates on purchased leads average just 0.5-2%, meaning 98% of the money and time spent is wasted on prospects who will never transact. AI changes this equation by identifying the right people at the right time with the right message.</p><h2>Predictive Seller Identification</h2><p>Platforms like Revaluate analyze thousands of data points per household — property equity, ownership duration, life events, demographic shifts, and consumer behavior — to predict which homeowners are most likely to move in the next 6-12 months. This transforms lead generation from reactive (waiting for someone to inquire) to <strong>proactive</strong> (reaching out to likely sellers before they list). Agents using predictive seller identification report 2-3x higher conversion rates than those relying on traditional lead sources.</p><h2>AI Lead Scoring and Prioritization</h2><p>Once leads enter your pipeline, AI scoring algorithms analyze behavioral signals — email opens, link clicks, property views, SMS responses, website visits — to rank leads by likelihood to transact. CINC platform continuously updates scores as lead behavior changes, ensuring agents always work the highest-priority leads first. The result: a <strong>30-40% improvement in lead-to-appointment conversion rates</strong> compared to manual qualification.</p><h2>Automated Multi-Channel Nurturing</h2><p>The biggest breakthrough in AI lead generation is automated nurturing. Instead of manually following up with each lead, AI systems handle multi-channel communication — personalized emails, SMS drip campaigns, and automated call reminders — at scale. CINC AI Personal Assistant can even engage leads in two-way SMS conversations, answering questions and scheduling appointments automatically. Teams using AI nurturing report <strong>3-5x ROI</strong> through improved conversion of leads that would have otherwise gone cold.</p><h2>Building Your AI Lead Stack</h2><p>For maximum results, combine a predictive seller identification tool (like Revaluate) with an AI-powered CRM and nurturing platform (like CINC). Feed identified leads into your nurturing system automatically via API integration. Let AI handle data processing, lead scoring, and initial follow-up — while you focus on high-value activities like listing presentations, negotiations, and closing deals.</p>', 'AI Tools for Real Estate Team', 'Guides', 'PUBLISHED', NOW(), NOW(), NOW()),
('blog-005', 'virtual-staging-vs-traditional-staging', 'Virtual Staging vs Traditional Staging: An AI-Powered Showdown', 'We compare cost, speed, buyer perception, and ROI to help you decide which staging approach is right for your listings.', '<h2>The Staging Revolution</h2><p>Home staging has long been a cornerstone of effective real estate marketing. Traditionally, this meant hiring a staging company to physically furnish and decorate a property — a process costing $1,500-$3,000 per month with multi-week lead times. AI virtual staging has disrupted this model, offering digital furnishing for as little as $16 per image with turnaround times measured in minutes. But is it as effective?</p><h2>Cost Comparison</h2><ul><li><strong>Traditional staging</strong>: $1,500-$3,000/month for an average home, plus furniture rental, setup/breakdown fees</li><li><strong>AI virtual staging (Styldod)</strong>: $16/image pay-as-you-go, or $99-$249/month subscription for unlimited images plus additional marketing tools</li><li><strong>Annual savings for an agent listing 12 homes/year</strong>: $15,000-$30,000 by switching to AI staging</li></ul><h2>Speed and Convenience</h2><p>Traditional staging requires: consultation → furniture selection → delivery → setup → breakdown → removal — a 2-4 week process. AI virtual staging requires: take a photo → upload → select style → receive staged image in 30-60 minutes. For agents in fast-moving markets where listings sell within days, AI is the only practical option.</p><h2>Buyer Perception</h2><p>Research shows that <strong>listings with staged photos (virtual or traditional) receive 40% more online views</strong> than unstaged listings. At thumbnail size — where most buyers first encounter a listing — AI-staged images are virtually indistinguishable from traditionally staged photos. Close inspection may reveal minor AI artifacts, but the marketing impact is comparable. Most buyers report that seeing a furnished room helps them visualize living in the space, regardless of whether the furniture is physical or digital.</p><h2>When to Use Each Approach</h2><p><strong>Choose traditional staging when:</strong> the property is luxury ($2M+), you are hosting in-person open houses, the market is slow and the home will sit vacant for months, or the seller has budget for a premium presentation.</p><p><strong>Choose AI virtual staging when:</strong> the property is vacant and you need fast, cost-effective marketing, the seller budget is limited, you want to show multiple design styles for the same room, or you need listing photos ready in hours rather than weeks.</p><h2>The Hybrid Approach</h2><p>Many top agents now use a hybrid strategy: traditional staging for the main living areas (where buyers spend the most time during showings) and AI virtual staging for secondary rooms, vacant investment properties, and listings at lower price points. This balances cost with maximum marketing impact.</p>', 'AI Tools for Real Estate Team', 'Marketing', 'PUBLISHED', NOW(), NOW(), NOW()),
('blog-006', 'nlp-real-estate-beginners-guide', 'What Is NLP in Real Estate? A Beginner''s Guide to Natural Language Processing', 'How natural language processing powers AI property search, automated listing descriptions, and intelligent chatbots in the real estate industry.', '<h2>NLP: The AI That Understands Language</h2><p>Natural Language Processing (NLP) is the branch of artificial intelligence that enables computers to understand, interpret, and generate human language. In real estate, NLP powers some of the most visible AI applications: natural language property search, automated listing description writing, chatbot customer service, and sentiment analysis of buyer communications.</p><h2>Natural Language Property Search</h2><p>The most visible NLP application in real estate is natural language search. Instead of selecting filters from dropdown menus, buyers can type queries like <em>"3-bedroom Craftsman-style home with a large backyard under $600,000 in Austin near good schools"</em> and receive relevant results. NLP parses the query to extract: property type (Craftsman), features (3 bedrooms, large backyard), price constraint ($600K max), location (Austin), and qualitative preference (good schools). Platforms like Zillow and Mosaik have invested heavily in NLP search to improve the buyer experience.</p><h2>Automated Listing Descriptions</h2><p>NLP generation models can write compelling MLS listing descriptions from a set of property features. Platforms like Styldod use NLP to generate descriptions that are both keyword-optimized for search and engaging for human readers. The AI analyzes room dimensions, features, and neighborhood data to create unique, non-repetitive descriptions that would take a human copywriter 30-60 minutes to produce.</p><h2>AI Chatbots and Virtual Assistants</h2><p>NLP-powered chatbots handle initial buyer inquiries 24/7 — answering questions about property features, scheduling showings, and qualifying leads based on budget and timeline. These chatbots understand context, handle follow-up questions, and can route complex inquiries to human agents when needed. The best systems learn from every conversation, continuously improving their ability to match buyer intent to relevant properties.</p><h2>Sentiment Analysis and Lead Intelligence</h2><p>Beyond search and content generation, NLP analyzes the emotional tone of buyer communications — emails, chat messages, and even voice calls — to gauge interest level and urgency. Sentiment analysis helps agents prioritize leads who express strong buying signals and tailor their communication style to each prospect personality and preferences.</p><h2>The Future of NLP in Real Estate</h2><p>As NLP models become more sophisticated, expect to see AI that can negotiate offers, review contracts for unfavorable terms, and generate comprehensive property reports by synthesizing data from multiple sources. The real estate professionals who understand and leverage NLP capabilities will deliver faster, more personalized service while spending less time on routine communication tasks.</p>', 'AI Tools for Real Estate Team', 'Education', 'PUBLISHED', NOW(), NOW(), NOW());

-- Glossary Terms
INSERT INTO "GlossaryTerm" (id, slug, term, definition, long_definition, category, related_slugs, status, created_at, updated_at) VALUES
('gloss-001', 'avm', 'AVM (Automated Valuation Model)', 'An AI-powered system that estimates property values by analyzing data from public records, recent sales, and market trends.', 'Automated Valuation Models use machine learning algorithms to estimate the market value of a property. They analyze thousands of data points — including comparable sales, property characteristics, tax assessments, and market trends — to generate valuations in seconds. Major AVMs include Zillow Zestimate (covering 100M+ U.S. homes with a median error rate of 2.4% for on-market homes) and Quantarium (enterprise-focused, covering 150M+ properties with satellite imagery analysis). AVMs are widely used by lenders for preliminary underwriting, by agents for listing price guidance, and by investors for portfolio monitoring. While highly accurate in well-covered markets, AVMs should be supplemented with professional judgment for unique or luxury properties.', 'Property Valuation', '["predictive-analytics","machine-learning","cma"]', 'PUBLISHED', NOW(), NOW()),
('gloss-002', 'predictive-analytics', 'Predictive Analytics', 'The use of AI and statistical algorithms to identify future outcomes based on historical data — such as predicting which homeowners are likely to sell.', 'In real estate, predictive analytics combines historical transaction data, property characteristics, demographic shifts, and consumer behavior signals to forecast future outcomes. Common applications include: identifying homeowners likely to list within 6-12 months (used by platforms like Revaluate), forecasting property value appreciation, predicting market trends, and scoring leads by likelihood to transact. Predictive models analyze over 2,000 data points per household, achieving prediction accuracy rates of 70-80% for move likelihood. For real estate professionals, predictive analytics transforms lead generation from reactive (waiting for inquiries) to proactive (targeting likely sellers before they list).', 'Data Science', '["machine-learning","lead-scoring","avm"]', 'PUBLISHED', NOW(), NOW()),
('gloss-003', 'nlp', 'NLP (Natural Language Processing)', 'A branch of AI that enables computers to understand, interpret, and generate human language — used in real estate for natural language search and listing descriptions.', 'Natural Language Processing powers many consumer-facing AI features in real estate. It enables natural language property search (e.g., "3-bedroom home near good schools under $500K"), automated listing description generation, AI chatbots for buyer inquiries, and sentiment analysis of lead communications. Modern NLP models can understand context, handle follow-up questions, and generate human-quality text that is both SEO-optimized and engaging. Platforms like Zillow, Styldod, and Mosaik integrate NLP for search and content generation.', 'AI Technology', '["machine-learning","deep-learning"]', 'PUBLISHED', NOW(), NOW()),
('gloss-004', 'computer-vision', 'Computer Vision', 'AI technology that analyzes and interprets visual information from images and videos — used in real estate for property photo tagging and analysis.', 'Computer vision in real estate automatically identifies and tags features in property photos: room types (kitchen, bathroom, bedroom), architectural features (hardwood floors, granite countertops, crown molding), property condition issues, and amenities (pools, fireplaces, solar panels). Platforms like Restb.ai specialize in real estate computer vision, achieving recognition accuracy for over 100 property features. Applications include automated MLS photo compliance checking, visual property search, virtual staging detection, and property condition assessment for appraisal support.', 'AI Technology', '["deep-learning","digital-twin","3d-rendering"]', 'PUBLISHED', NOW(), NOW()),
('gloss-005', 'digital-twin', 'Digital Twin', 'A virtual 3D replica of a physical property, created using AI and spatial data capture, enabling remote walkthroughs and spatial analysis.', 'Digital twins go beyond traditional photos and videos by creating an interactive, dimensionally accurate 3D model of a property. Matterport is the market leader, with over 10 million spaces captured. Digital twins enable: immersive virtual tours where buyers navigate at their own pace, automated floor plan generation with measurements, spatial analysis for construction and renovation planning, and remote property inspection. The Cortex AI platform automatically identifies rooms, objects, and features within the 3D model. Digital twins are particularly valuable for luxury listings, commercial real estate, and serving out-of-town buyers.', 'Virtual Reality', '["3d-rendering","computer-vision","matterport"]', 'PUBLISHED', NOW(), NOW()),
('gloss-006', 'lead-scoring', 'Lead Scoring', 'An AI-driven method of ranking sales leads by their likelihood to convert, based on behavioral data and engagement signals.', 'AI lead scoring analyzes behavioral data — email opens, link clicks, property views, search history, SMS responses, and website visit duration — to assign each lead a real-time conversion probability score. Unlike traditional lead scoring that uses static rules, AI scoring continuously updates as prospect behavior changes. Platforms like CINC report that real-time AI scoring improves lead-to-appointment conversion rates by 30-40%. Scores help agents prioritize their time: calling the highest-scoring leads first, while automated nurturing handles lower-scoring prospects until they show stronger buying signals.', 'CRM', '["predictive-analytics","automated-nurture"]', 'PUBLISHED', NOW(), NOW()),
('gloss-007', 'automated-nurture', 'Automated Nurture Sequence', 'A pre-configured series of AI-driven communications (email, SMS, calls) that automatically engages and qualifies leads over time.', 'Automated nurture sequences replace the manual follow-up process with AI-orchestrated, multi-channel communication flows. A typical sequence might include: immediate SMS acknowledgment after a lead inquiry, personalized email with relevant listings on day 2, property alert triggered by saved search criteria on day 5, and a check-in call scheduled automatically on day 10. CINC AI Personal Assistant represents the cutting edge — it can conduct two-way SMS conversations, answer property questions, and schedule appointments without human intervention. Teams using automated nurturing report 3-5x ROI through improved conversion of leads that would otherwise go cold.', 'CRM', '["lead-scoring","predictive-analytics"]', 'PUBLISHED', NOW(), NOW()),
('gloss-008', 'roi-analysis', 'ROI Analysis', 'The calculation of return on investment for real estate decisions — increasingly powered by AI to factor in market trends, renovation costs, and appreciation forecasts.', 'AI-powered ROI analysis tools like Plunk and HouseCanary help investors and homeowners evaluate the financial impact of real estate decisions. Functions include: renovation ROI calculators that estimate which improvements add the most value, rental income projections based on market comparables, portfolio performance tracking across multiple properties, and buy-vs-rent analysis incorporating tax implications and appreciation forecasts. These tools analyze far more variables than manual spreadsheet models, providing more nuanced and data-driven investment guidance.', 'Analytics', '["predictive-analytics","avm"]', 'PUBLISHED', NOW(), NOW()),
('gloss-009', 'virtual-staging', 'Virtual Staging', 'The use of AI to digitally furnish and decorate empty rooms in property photos, creating photorealistic marketing images at a fraction of traditional staging costs.', 'AI virtual staging uses computer vision and generative AI to analyze room dimensions, lighting conditions, and architectural features, then digitally insert furniture and decor at the correct scale and perspective. Platforms like Styldod offer virtual staging starting at approximately $16 per image, compared to $1,500-$3,000/month for traditional staging. Listings with AI-staged photos receive 40% more online views. Multiple design styles (Modern, Farmhouse, Scandinavian, etc.) can be applied to the same room, helping buyers visualize different possibilities.', 'Marketing', '["computer-vision","3d-rendering"]', 'PUBLISHED', NOW(), NOW()),
('gloss-010', 'geospatial-analytics', 'Geospatial Analytics', 'AI-powered analysis of location-based data, combining satellite imagery, mapping data, and property records to derive real estate insights.', 'Geospatial analytics integrates data from satellite imagery, GIS mapping, property records, and demographic databases to analyze real estate at scale. Applications include: assessing neighborhood quality and property conditions from aerial imagery, analyzing flood risk and environmental hazards for insurance underwriting, identifying development opportunities through land-use pattern analysis, and generating market heat maps showing price trends by geographic area. Quantarium leverages geospatial analytics as a key differentiator in its enterprise AVM platform, using satellite imagery to assess properties where traditional data is sparse.', 'Data Science', '["predictive-analytics","computer-vision","avm"]', 'PUBLISHED', NOW(), NOW()),
('gloss-011', '3d-rendering', '3D Rendering', 'The process of creating photorealistic 2D images from 3D models — used in real estate for virtual tours, architectural visualization, and property marketing.', '3D rendering in real estate converts spatial data into lifelike visual representations. It is the technology behind immersive Matterport virtual tours, architectural visualization for new construction, virtual renovation previews (showing how an outdated space could look after remodeling), and fly-through animations for commercial properties. AI has dramatically reduced rendering time — what once took hours per frame can now be generated in seconds — making 3D visualization accessible for everyday residential listings, not just high-end commercial projects.', 'Virtual Reality', '["digital-twin","virtual-staging","computer-vision"]', 'PUBLISHED', NOW(), NOW()),
('gloss-012', 'machine-learning', 'Machine Learning', 'A core AI technology where algorithms improve through experience — analyzing data patterns to make predictions and decisions without explicit programming.', 'Machine learning is the foundational technology behind most real estate AI applications. It powers AVMs that estimate property values, predictive models that identify likely sellers, recommendation engines that match buyers to properties, and computer vision systems that analyze property photos. Modern ML models used in real estate include gradient boosting (for tabular property data), convolutional neural networks (for image analysis), and transformer models (for natural language processing). The key advantage of ML over traditional statistical methods is its ability to identify complex, non-linear relationships across thousands of variables.', 'AI Technology', '["deep-learning","predictive-analytics","nlp"]', 'PUBLISHED', NOW(), NOW()),
('gloss-013', 'deep-learning', 'Deep Learning', 'An advanced form of machine learning using multi-layered neural networks — powering the most sophisticated AI applications in real estate.', 'Deep learning uses artificial neural networks with multiple layers (hence "deep") to process complex data. In real estate, deep learning powers: computer vision systems that recognize 100+ property features in photos, natural language models that generate listing descriptions and power chatbots, and valuation models that analyze satellite imagery for property condition assessment. Unlike traditional ML, deep learning models improve with more data — making them particularly valuable for large-scale platforms like Zillow and Quantarium that process millions of property records and images.', 'AI Technology', '["machine-learning","computer-vision","nlp"]', 'PUBLISHED', NOW(), NOW()),
('gloss-014', 'cma', 'Comparative Market Analysis (CMA)', 'A method of estimating a property value by comparing it to similar recently sold properties — increasingly AI-enhanced for speed and accuracy.', 'A Comparative Market Analysis evaluates a subject property against recently sold comparable (comps) — properties with similar size, location, age, and features. AI-enhanced CMAs automate the traditionally manual process by: instantly identifying the most relevant comps from MLS databases, adjusting for feature differences (extra bathroom, updated kitchen, pool), weighting comps by recency and proximity, and generating professional CMA reports in minutes rather than hours. While AVMs provide automated valuations, an AI-assisted CMA combines algorithmic analysis with agent expertise, making it the preferred method for listing presentations and buyer consultations.', 'Property Valuation', '["avm","predictive-analytics"]', 'PUBLISHED', NOW(), NOW()),
('gloss-015', 'proptech', 'PropTech', 'Property Technology — the broad category of software, platforms, and tools that use technology to innovate in the real estate industry.', 'PropTech encompasses all technology applied to real estate: AI valuation tools, virtual tour platforms, digital transaction management, smart home technology, property management software, and blockchain-based title transfer. The PropTech sector attracted over $15 billion in venture capital in 2024, reflecting the massive opportunity in digitizing the world largest asset class. Key PropTech subcategories include: Residential PropTech (tools for agents and homebuyers), Commercial PropTech (CRE leasing and management), ConTech (construction technology), and FinTech for real estate (mortgage and title tech). AI is currently the fastest-growing segment within PropTech.', 'Industry', '["avm","machine-learning","digital-twin"]', 'PUBLISHED', NOW(), NOW());