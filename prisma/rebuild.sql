-- ⚠️ Drop existing tables first
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
