import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Category ──────────────────────────────────
  const categoryData = [
    { slug: "property-search", name: "Property Search", description: "AI-powered property discovery and matching tools", icon: "🏠" },
    { slug: "analytics", name: "Analytics & Data", description: "Predictive analytics, valuation models, and market intelligence", icon: "📊" },
    { slug: "automation", name: "Automation", description: "Workflow automation, document processing, and transaction management", icon: "🤖" },
    { slug: "crm", name: "CRM & Communication", description: "AI-enhanced customer relationship management and lead nurturing", icon: "💬" },
    { slug: "marketing", name: "Marketing & Media", description: "Content generation, virtual staging, and property marketing", icon: "📸" },
    { slug: "transaction", name: "Transaction Management", description: "Contract review, closing automation, and compliance", icon: "📋" },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoryData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    categories[c.slug] = cat.id;
    console.log(`  ✓ category: ${c.slug}`);
  }

  // ── Tools ─────────────────────────────────────
  const toolData = [
    {
      slug: "zillow-ai",
      name: "Zillow AI",
      tagline: "AI-powered property valuation and personalized home recommendations",
      logoUrl: null,
      websiteUrl: "https://www.zillow.com",
      affiliateUrl: null,
      description: "Zillow uses machine learning algorithms to power its Zestimate home valuation model, covering over 100 million homes. The platform provides personalized property recommendations based on user behavior, search patterns, and preferences.",
      longDescription: "Zillow's AI capabilities extend beyond valuation. The platform uses computer vision to analyze listing photos, natural language processing to understand listing descriptions, and recommendation engines to match buyers with properties. The Zestimate model incorporates hundreds of data points including tax assessments, sales history, and market trends, with a median error rate of approximately 2.4% for on-market homes.",
      pricingModel: "FREEMIUM",
      pricingJson: { free: "Basic listing access", premium: "$29.99/mo", enterprise: "Custom pricing" },
      featuresJson: ["Automated valuation model (AVM)", "AI-powered home recommendations", "Natural language search", "Computer vision photo analysis", "Market trend predictions", "Rental estimate (Rent Zestimate)"],
      prosJson: ["Most accurate AVM on the market", "Massive data coverage (100M+ homes)", "User-friendly interface", "Strong mobile experience"],
      consJson: ["Limited to US market", "Premium features require subscription", "Estimates can lag in fast-moving markets"],
      useCasesJson: ["Home valuation for buyers and sellers", "Market research for investors", "Rental price analysis", "Neighborhood comparison"],
      foundedYear: 2006,
      apiAvailable: true,
      avgRating: 4.5,
      reviewCount: 128,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlugs: ["property-search", "analytics"],
    },
    {
      slug: "revaluate",
      name: "Revaluate",
      tagline: "AI-driven predictive analytics to identify likely movers and sellers",
      logoUrl: null,
      websiteUrl: "https://www.revaluate.com",
      affiliateUrl: null,
      description: "Revaluate uses AI and machine learning to predict which homeowners are most likely to move in the next 6-12 months. The platform analyzes thousands of data points including property history, demographic shifts, and life events to generate high-quality seller leads.",
      longDescription: "Revaluate's predictive engine processes over 7,000 data signals per household, including property equity, length of ownership, family size changes, and neighborhood trends. Real estate agents and brokerages use Revaluate to focus marketing efforts on the most promising leads, resulting in 3-5x higher conversion rates compared to traditional lead sources.",
      pricingModel: "PAID",
      pricingJson: { starter: "$99/mo", professional: "$249/mo", enterprise: "Custom" },
      featuresJson: ["Move prediction scoring", "Life event tracking", "Automated lead lists", "CRM integration", "Market heat maps", "Equity analysis"],
      prosJson: ["High accuracy move predictions", "Seamless CRM integrations", "Saves agent marketing spend", "Weekly updated data"],
      consJson: ["Premium pricing", "Requires CRM to maximize value", "US-only coverage"],
      useCasesJson: ["Agent lead generation", "Brokerage marketing strategy", "Targeted direct mail campaigns", "Farm area optimization"],
      foundedYear: 2015,
      apiAvailable: true,
      avgRating: 4.7,
      reviewCount: 89,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlugs: ["analytics", "crm"],
    },
    {
      slug: "quantarium",
      name: "Quantarium",
      tagline: "Automated valuation models and property intelligence for enterprises",
      logoUrl: null,
      websiteUrl: "https://www.quantarium.com",
      affiliateUrl: null,
      description: "Quantarium provides enterprise-grade automated valuation models (AVMs) and property intelligence solutions. Its AI engine processes satellite imagery, property records, and market data to deliver highly accurate valuations used by lenders, investors, and insurance companies.",
      longDescription: "Quantarium's AVM leverages computer vision, deep learning, and geospatial analysis to evaluate properties at scale. The platform covers over 150 million US properties and delivers valuations with industry-leading accuracy. Beyond AVMs, Quantarium offers property condition assessment, market forecasting, and portfolio risk analysis tools for institutional clients.",
      pricingModel: "ENTERPRISE",
      pricingJson: { enterprise: "Custom pricing based on volume" },
      featuresJson: ["Automated Valuation Model (AVM)", "Computer vision property analysis", "Portfolio valuation", "Market forecasting", "Risk scoring", "Geospatial analytics"],
      prosJson: ["Industry-leading accuracy", "Satellite imagery analysis", "Enterprise-ready API", "Covers 150M+ properties"],
      consJson: ["Enterprise-only (no self-serve)", "Complex onboarding", "Expensive for small businesses"],
      useCasesJson: ["Mortgage underwriting", "Portfolio valuation", "Insurance risk assessment", "Real estate investment analysis"],
      foundedYear: 2017,
      apiAvailable: true,
      avgRating: 4.3,
      reviewCount: 56,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlugs: ["analytics"],
    },
    {
      slug: "restb-ai",
      name: "Restb.ai",
      tagline: "Computer vision AI for real estate image and video analysis",
      logoUrl: null,
      websiteUrl: "https://www.restb.ai",
      affiliateUrl: null,
      description: "Restb.ai specializes in computer vision technology for real estate. The platform automatically tags, categorizes, and analyzes property photos and videos, extracting valuable insights about property conditions, features, and amenities.",
      longDescription: "Restb.ai's computer vision models are trained on millions of real estate images and can detect over 100 property features including room types, architectural styles, materials, and conditions. The platform powers automated photo compliance for MLS listings, virtual property valuation enhancement, and personalized property search experiences for major real estate portals.",
      pricingModel: "PAID",
      pricingJson: { starter: "$499/mo", growth: "$1,499/mo", enterprise: "Custom" },
      featuresJson: ["Image recognition (100+ features)", "Automated photo tagging", "Property condition assessment", "Virtual staging detection", "MLS compliance checking", "Video analysis"],
      prosJson: ["Best-in-class real estate computer vision", "Rapid API response times", "Detailed documentation", "Used by major MLS platforms"],
      consJson: ["Requires technical integration", "Volume-based pricing can scale quickly", "Limited to visual analysis"],
      useCasesJson: ["MLS photo compliance", "Automated property descriptions", "Visual search", "Appraisal support"],
      foundedYear: 2015,
      apiAvailable: true,
      avgRating: 4.6,
      reviewCount: 72,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlugs: ["property-search", "analytics"],
    },
    {
      slug: "housecanary",
      name: "HouseCanary",
      tagline: "AI-powered residential real estate analytics and forecasting",
      logoUrl: null,
      websiteUrl: "https://www.housecanary.com",
      affiliateUrl: null,
      description: "HouseCanary provides residential real estate analytics and AI-driven property valuations. Their platform combines machine learning with comprehensive property data to deliver valuation forecasts, market analysis, and investment insights.",
      longDescription: "HouseCanary's platform covers over 100 million US residential properties and leverages over 40 years of historical data. Their models predict property values up to 36 months into the future with high accuracy. The platform serves institutional investors, lenders, and real estate professionals with API access, reporting tools, and portfolio management capabilities.",
      pricingModel: "ENTERPRISE",
      pricingJson: { enterprise: "Custom pricing" },
      featuresJson: ["3-year value forecasting", "Automated valuation model", "Market rent estimates", "Portfolio analytics", "Risk assessment", "Investment scoring"],
      prosJson: ["Long-horizon forecasts (36 months)", "Comprehensive historical data", "Institutional-grade accuracy", "Strong API documentation"],
      consJson: ["Enterprise pricing (no self-serve)", "US-focused", "Data updates can lag in fast markets"],
      useCasesJson: ["Investment property analysis", "Portfolio risk management", "Lending decisions", "Market research"],
      foundedYear: 2013,
      apiAvailable: true,
      avgRating: 4.4,
      reviewCount: 93,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlugs: ["analytics", "transaction"],
    },
    {
      slug: "mosaik",
      name: "Mosaik",
      tagline: "AI-driven neighborhood insights and home search platform",
      logoUrl: null,
      websiteUrl: "https://www.mosaik.com",
      affiliateUrl: null,
      description: "Mosaik combines AI with hyper-local data to help homebuyers find neighborhoods that match their lifestyle. The platform analyzes commute times, school ratings, amenities, crime data, and community vibes to generate personalized neighborhood recommendations.",
      longDescription: "Mosaik's AI engine aggregates and analyzes hundreds of data layers — from transit patterns and noise levels to demographic trends and local business density. Users input their priorities (budget, commute tolerance, school requirements, lifestyle preferences) and Mosaik surfaces matching neighborhoods with detailed report cards and comparison tools.",
      pricingModel: "FREEMIUM",
      pricingJson: { free: "Basic search", premium: "$19.99/mo", agent: "$49.99/mo" },
      featuresJson: ["Neighborhood matching engine", "Commute analysis", "School district ratings", "Lifestyle scoring", "Neighborhood comparison", "Saved search alerts"],
      prosJson: ["Unique neighborhood-focused approach", "Rich local data", "Great UI/UX", "Freemium model accessible to all"],
      consJson: ["Limited coverage in rural areas", "Newer platform (less data maturity)", "Agent-focused features extra"],
      useCasesJson: ["Homebuyer neighborhood research", "Relocation planning", "Rental market exploration", "Agent client matching"],
      foundedYear: 2020,
      apiAvailable: false,
      avgRating: 4.2,
      reviewCount: 41,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlugs: ["property-search"],
    },
    {
      slug: "cinc",
      name: "CINC",
      tagline: "AI-powered lead generation and nurturing for top real estate teams",
      logoUrl: null,
      websiteUrl: "https://www.cincpro.com",
      affiliateUrl: null,
      description: "CINC (Commissions Inc) uses AI to identify, score, and nurture real estate leads. The platform automates follow-up sequences, prioritizes high-intent prospects, and provides agents with actionable insights to close more deals.",
      longDescription: "CINC's AI engine analyzes lead behavior patterns — website visits, email opens, property views, search criteria changes — to calculate real-time lead scores. The platform automatically routes hot leads to agents and triggers personalized nurture campaigns. CINC also uses predictive analytics to forecast which leads are most likely to transact within 30, 60, or 90 days.",
      pricingModel: "PAID",
      pricingJson: { professional: "$400/mo", team: "$800/mo", brokerage: "Custom" },
      featuresJson: ["AI lead scoring", "Automated nurture sequences", "Behavior tracking", "Smart lead routing", "ROI analytics", "Multi-channel communication"],
      prosJson: ["Strong lead scoring accuracy", "Fully automated follow-ups", "Good team collaboration tools", "Integrates with major CRMs"],
      consJson: ["Expensive for solo agents", "Setup requires training", "Heavy on email (less SMS)"],
      useCasesJson: ["Agent lead conversion", "Team lead distribution", "Brokerage pipeline management", "Marketing ROI tracking"],
      foundedYear: 2012,
      apiAvailable: true,
      avgRating: 4.1,
      reviewCount: 107,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlugs: ["crm", "automation"],
    },
    {
      slug: "loft47",
      name: "Loft47",
      tagline: "AI transaction management and commission tracking platform",
      logoUrl: null,
      websiteUrl: "https://www.loft47.com",
      affiliateUrl: null,
      description: "Loft47 provides AI-enhanced transaction management for real estate brokerages. The platform automates document processing, commission calculations, and compliance workflows, reducing manual paperwork and errors.",
      longDescription: "Loft47 uses machine learning to extract key data from transaction documents, automatically populate commission structures, and flag compliance issues. The platform handles complex commission splits, agent caps, franchise fees, and referral payments. Real-time dashboards give brokerage leaders visibility into pipeline, revenue forecasts, and agent performance.",
      pricingModel: "PAID",
      pricingJson: { core: "$299/mo", growth: "$599/mo", enterprise: "Custom" },
      featuresJson: ["Automated commission calculation", "Document data extraction", "Compliance auditing", "Pipeline dashboard", "Agent performance analytics", "Accounting integration"],
      prosJson: ["Handles complex commission structures", "Significant time savings on paperwork", "Strong compliance features", "Good accounting integrations"],
      consJson: ["Niche focus (transaction management only)", "Setup requires configuration", "Canadian-centric (growing US)"],
      useCasesJson: ["Brokerage back-office automation", "Commission management", "Compliance tracking", "Financial reporting"],
      foundedYear: 2016,
      apiAvailable: true,
      avgRating: 4.4,
      reviewCount: 38,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlugs: ["transaction", "automation"],
    },
    {
      slug: "styldod",
      name: "Styldod",
      tagline: "AI virtual staging, image enhancement, and marketing content generation",
      logoUrl: null,
      websiteUrl: "https://www.styldod.com",
      affiliateUrl: null,
      description: "Styldod offers a suite of AI tools for real estate marketing including virtual staging, image enhancement, floor plan generation, and automated listing descriptions. The platform helps agents market properties faster and at lower cost than traditional methods.",
      longDescription: "Styldod's AI can virtually stage empty rooms with furniture and decor in various styles within minutes. The platform also provides AI-powered photo enhancement (sky replacement, twilight conversion, decluttering), automated floor plan creation from photos, and natural language generation for listing descriptions and social media content. Over 500,000 properties have been marketed using Styldod's platform.",
      pricingModel: "FREEMIUM",
      pricingJson: { pay_as_you_go: "$16/image", pro: "$99/mo", team: "$249/mo" },
      featuresJson: ["Virtual staging (AI)", "Image enhancement", "Floor plan generation", "Listing description writer", "Social media content generator", "Virtual renovation preview"],
      prosJson: ["Fast turnaround (minutes vs days)", "Cost-effective vs traditional staging", "Multiple design styles available", "Good for vacant property marketing"],
      consJson: ["Occasional AI artifacts in images", "Floor plans require good source photos", "Pay-as-you-go adds up for high volume"],
      useCasesJson: ["Vacant home marketing", "Listing presentation enhancement", "Renovation visualization", "Social media content creation"],
      foundedYear: 2018,
      apiAvailable: true,
      avgRating: 4.3,
      reviewCount: 155,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlugs: ["marketing"],
    },
    {
      slug: "realtor-com-marketreach",
      name: "MarketReach",
      tagline: "AI-optimized advertising platform for real estate professionals",
      logoUrl: null,
      websiteUrl: "https://www.realtor.com/marketreach",
      affiliateUrl: null,
      description: "MarketReach is Realtor.com's AI-powered advertising platform that helps agents and brokerages reach motivated buyers and sellers with targeted digital ads across web, social media, and email.",
      longDescription: "MarketReach leverages Realtor.com's vast user behavior data combined with AI optimization to deliver ads to the most likely transactors. The platform uses predictive targeting, automated bid optimization, and creative testing to maximize ad ROI. Agents can set up campaigns targeting specific ZIP codes, property types, or buyer/seller personas within minutes.",
      pricingModel: "PAID",
      pricingJson: { starter: "$250/mo", professional: "$500/mo", elite: "$1,000+/mo" },
      featuresJson: ["Predictive targeting", "Automated bid optimization", "Multi-channel delivery", "Creative A/B testing", "Lead capture forms", "Performance analytics"],
      prosJson: ["Access to Realtor.com user data", "Good targeting precision", "Managed service option available", "Transparent ROI reporting"],
      consJson: ["Minimum spend commitment", "Competitive for popular ZIP codes", "Limited to US market"],
      useCasesJson: ["Agent lead generation", "Listing promotion", "Brand awareness campaigns", "Open house promotion"],
      foundedYear: 2019,
      apiAvailable: false,
      avgRating: 4.0,
      reviewCount: 84,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlugs: ["marketing", "crm"],
    },
    {
      slug: "plunk",
      name: "Plunk",
      tagline: "Real-time AI home valuation and investment analytics",
      logoUrl: null,
      websiteUrl: "https://www.plunk.co",
      affiliateUrl: null,
      description: "Plunk uses deep learning models to provide real-time home valuation and renovation ROI analysis. The platform helps homeowners understand their property's current market value and which renovations will most increase it.",
      longDescription: "Plunk's AI analyzes daily market signals — recent sales, listing activity, price changes, and demand indicators — to generate dynamic home valuations that update in real-time, not monthly. The platform also features a renovation calculator that predicts the ROI of specific home improvements based on local market data, helping homeowners and investors make data-driven renovation decisions.",
      pricingModel: "FREEMIUM",
      pricingJson: { free: "Basic valuation", premium: "$14.99/mo", pro: "$39.99/mo" },
      featuresJson: ["Real-time home valuation", "Renovation ROI calculator", "Market trend alerts", "Neighborhood analytics", "Portfolio tracking", "Price change monitoring"],
      prosJson: ["Real-time updates (not monthly)", "Excellent renovation ROI tool", "Clean mobile experience", "Free tier available"],
      consJson: ["Newer entrant (less historical data)", "Limited to 30 major US metros", "Consumer-focused (less B2B)"],
      useCasesJson: ["Homeowner valuation tracking", "Renovation planning", "Investment property analysis", "Market timing decisions"],
      foundedYear: 2021,
      apiAvailable: false,
      avgRating: 4.5,
      reviewCount: 47,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlugs: ["analytics", "property-search"],
    },
    {
      slug: "kavayah",
      name: "Kavayah",
      tagline: "AI document processing for real estate contracts and compliance",
      logoUrl: null,
      websiteUrl: "https://www.kavayah.com",
      affiliateUrl: null,
      description: "Kavayah uses natural language processing (NLP) to extract, categorize, and validate data from real estate documents including purchase agreements, disclosures, title reports, and closing statements.",
      longDescription: "Kavayah's AI document engine is trained specifically on real estate documents and understands industry-specific terminology, forms, and regulations. The platform automates data entry from scanned documents, flags missing or inconsistent information, and integrates with leading transaction management systems. Processing time for a typical 30-page purchase agreement drops from 45 minutes to under 3 minutes.",
      pricingModel: "PAID",
      pricingJson: { per_doc: "$2-5/page", monthly: "Starting at $500/mo" },
      featuresJson: ["Contract data extraction", "Automated data entry", "Compliance flagging", "Document classification", "Disclosure review", "Closing statement reconciliation"],
      prosJson: ["Real-estate-specific NLP training", "Dramatic time savings", "Reduces data entry errors", "Integrates with transaction systems"],
      consJson: ["Per-page pricing model", "Requires good scan quality", "Limited to English documents"],
      useCasesJson: ["Contract review automation", "Compliance auditing", "Data entry elimination", "Closing preparation"],
      foundedYear: 2019,
      apiAvailable: true,
      avgRating: 4.3,
      reviewCount: 29,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlugs: ["transaction", "automation"],
    },
    {
      slug: "perspective",
      name: "Perspective",
      tagline: "AI-powered property showings and tour scheduling automation",
      logoUrl: null,
      websiteUrl: "https://www.perspective.com",
      affiliateUrl: null,
      description: "Perspective automates the entire property showing process using AI. From scheduling tours based on buyer and agent availability to generating personalized showing itineraries, the platform reduces the administrative overhead of property viewings.",
      longDescription: "Perspective's AI scheduling engine coordinates between buyer availability, agent calendars, property access rules, and tour logistics to automatically generate optimal showing schedules. The platform also provides AI-generated property briefings before each showing, automated follow-up messages, and analytics on showing-to-offer conversion rates.",
      pricingModel: "FREEMIUM",
      pricingJson: { free: "5 showings/month", pro: "$29.99/mo", team: "$79.99/mo" },
      featuresJson: ["AI scheduling engine", "Automated itinerary generation", "Showing briefings", "Follow-up automation", "Conversion analytics", "Buyer feedback collection"],
      prosJson: ["Significant time savings on scheduling", "Reduces no-shows", "Good mobile experience", "Free tier for casual use"],
      consJson: ["Requires agent and buyer adoption", "Limited to English markets", "Calendar integration can be finicky"],
      useCasesJson: ["Buyer agent tour scheduling", "Open house management", "New development sales", "Relocation tours"],
      foundedYear: 2020,
      apiAvailable: false,
      avgRating: 4.0,
      reviewCount: 63,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlugs: ["automation", "crm"],
    },
    {
      slug: "rentberry-ai",
      name: "Rentberry AI",
      tagline: "AI-driven rental pricing optimization and tenant screening",
      logoUrl: null,
      websiteUrl: "https://www.rentberry.com",
      affiliateUrl: null,
      description: "Rentberry uses AI to optimize rental pricing in real-time based on market demand, seasonality, and property features. The platform also provides AI-powered tenant screening using credit, background, and behavioral analysis.",
      longDescription: "Rentberry's pricing engine analyzes hundreds of market signals—comparable listings, days on market, seasonal trends, local employment data—to recommend optimal rental prices that maximize landlord revenue while minimizing vacancy periods. The tenant screening AI evaluates applicants across dozens of factors to predict tenant reliability and payment risk.",
      pricingModel: "FREEMIUM",
      pricingJson: { free: "Basic listing", premium: "$9.99/property/mo", portfolio: "Custom" },
      featuresJson: ["Dynamic pricing optimization", "Tenant risk scoring", "Rental application processing", "Market comparison analytics", "Vacancy prediction", "Automated rent collection"],
      prosJson: ["Dynamic pricing adapts to market", "Comprehensive tenant screening", "End-to-end rental management", "Transparent fee structure"],
      consJson: ["Focused on residential rentals", "Some markets have limited data", "Premium features behind paywall"],
      useCasesJson: ["Landlord rent optimization", "Property manager portfolio pricing", "Tenant screening", "Rental market analysis"],
      foundedYear: 2015,
      apiAvailable: true,
      avgRating: 4.2,
      reviewCount: 91,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlugs: ["analytics", "transaction"],
    },
    {
      slug: "matterport",
      name: "Matterport",
      tagline: "AI-powered 3D digital twins and virtual tours for properties",
      logoUrl: null,
      websiteUrl: "https://www.matterport.com",
      affiliateUrl: null,
      description: "Matterport creates AI-enhanced 3D digital twins of properties, enabling immersive virtual tours, automated measurements, and spatial data analysis. The platform processes billions of spatial data points to create accurate 3D models.",
      longDescription: "Matterport's AI automatically generates dimensionally accurate 3D models, floor plans, and virtual tours from camera captures. The platform's deep learning models (Cortex AI) can automatically detect rooms, label spaces, recognize objects, and generate property descriptions. Matterport digital twins are used by agents, appraisers, insurance adjusters, and property managers for remote property assessment.",
      pricingModel: "FREEMIUM",
      pricingJson: { free: "1 active space", starter: "$9.99/mo", professional: "$69/mo", business: "$309/mo" },
      featuresJson: ["3D digital twin creation", "AI-powered object recognition", "Automated floor plans", "Virtual tour hosting", "Measurement tools", "Cortex AI insights"],
      prosJson: ["Industry standard for 3D tours", "Excellent accuracy", "Powerful AI features", "Wide integration ecosystem"],
      consJson: ["Requires compatible camera hardware", "Larger properties need premium plan", "Processing time for large spaces"],
      useCasesJson: ["Virtual property tours", "Remote appraisal", "Insurance documentation", "Construction progress tracking"],
      foundedYear: 2011,
      apiAvailable: true,
      avgRating: 4.6,
      reviewCount: 210,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlugs: ["marketing", "property-search"],
    },
  ];

  const tools: Record<string, string> = {};
  for (const t of toolData) {
    const { categorySlugs, ...toolFields } = t;
    const tool = await prisma.tool.upsert({
      where: { slug: t.slug },
      update: toolFields as any,
      create: toolFields as any,
    });
    tools[t.slug] = tool.id;

    // Link categories
    for (const catSlug of t.categorySlugs) {
      await prisma.toolCategory.upsert({
        where: { toolId_categoryId: { toolId: tool.id, categoryId: categories[catSlug] } },
        update: { isPrimary: t.categorySlugs.indexOf(catSlug) === 0 },
        create: { toolId: tool.id, categoryId: categories[catSlug], isPrimary: t.categorySlugs.indexOf(catSlug) === 0 },
      });
    }
    console.log(`  ✓ tool: ${t.slug}`);
  }

  // ── Alternatives ─────────────────────────────
  const alternativePairs = [
    { tool: "zillow-ai", alternatives: ["quantarium", "housecanary", "plunk"] },
    { tool: "restb-ai", alternatives: ["matterport", "styldod"] },
    { tool: "cinc", alternatives: ["revaluate", "marketreach"] },
    { tool: "loft47", alternatives: ["kavayah"] },
    { tool: "styldod", alternatives: ["matterport"] },
  ];

  for (const pair of alternativePairs) {
    for (const altSlug of pair.alternatives) {
      if (tools[pair.tool] && tools[altSlug]) {
        await prisma.toolAlternative.upsert({
          where: { toolId_alternativeId: { toolId: tools[pair.tool], alternativeId: tools[altSlug] } },
          update: {},
          create: { toolId: tools[pair.tool], alternativeId: tools[altSlug] },
        });
      }
    }
  }
  console.log("  ✓ alternatives");

  // ── Comparisons ─────────────────────────────
  const comparisonData = [
    {
      slug: "zillow-ai-vs-quantarium",
      title: "Zillow AI vs Quantarium: Which AVM Is More Accurate?",
      description: "A detailed comparison of Zillow's Zestimate and Quantarium's enterprise AVM, covering accuracy, coverage, pricing, and use cases.",
      content: null,
      winnerJson: { winner: "quantarium", note: "Quantarium edges out for institutional accuracy, but Zillow wins for accessibility." },
      matrixJson: null,
      status: "PUBLISHED",
      publishedAt: new Date(),
      toolSlugs: ["zillow-ai", "quantarium"],
    },
    {
      slug: "styldod-vs-matterport",
      title: "Styldod vs Matterport: AI Tools for Property Marketing",
      description: "Comparing AI virtual staging (Styldod) with 3D digital twins (Matterport) for real estate marketing.",
      content: null,
      winnerJson: { winner: "tie", note: "Each serves a different purpose. Styldod for staging vacant homes, Matterport for immersive tours." },
      matrixJson: null,
      status: "PUBLISHED",
      publishedAt: new Date(),
      toolSlugs: ["styldod", "matterport"],
    },
    {
      slug: "revaluate-vs-cinc",
      title: "Revaluate vs CINC: AI Lead Generation Showdown",
      description: "Head-to-head comparison of predictive lead scoring (Revaluate) and automated lead nurturing (CINC) platforms.",
      content: null,
      winnerJson: { winner: "tie", note: "Revaluate excels at identifying sellers; CINC excels at nurturing and converting them. Many teams use both." },
      matrixJson: null,
      status: "PUBLISHED",
      publishedAt: new Date(),
      toolSlugs: ["revaluate", "cinc"],
    },
  ];

  for (const c of comparisonData) {
    const { toolSlugs, ...compFields } = c;
    const comparison = await prisma.comparison.upsert({
      where: { slug: c.slug },
      update: compFields as any,
      create: compFields as any,
    });
    for (const ts of toolSlugs) {
      if (tools[ts]) {
        await prisma.comparisonTool.upsert({
          where: { comparisonId_toolId: { comparisonId: comparison.id, toolId: tools[ts] } },
          update: {},
          create: { comparisonId: comparison.id, toolId: tools[ts] },
        });
      }
    }
    console.log(`  ✓ comparison: ${c.slug}`);
  }

  // ── Tutorials ───────────────────────────────
  const tutorialData = [
    {
      slug: "getting-started-zillow-ai",
      title: "Getting Started with Zillow AI for Market Analysis",
      description: "Learn how to use Zillow's AI tools to analyze market trends, estimate property values, and make data-driven decisions.",
      content: null,
      estimatedMinutes: 15,
      difficulty: "Beginner",
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlug: "analytics",
      toolSlugs: ["zillow-ai"],
    },
    {
      slug: "virtual-staging-guide",
      title: "Complete Guide to AI Virtual Staging with Styldod",
      description: "Step-by-step tutorial on staging vacant properties using AI, from photo preparation to final marketing materials.",
      content: null,
      estimatedMinutes: 20,
      difficulty: "Intermediate",
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlug: "marketing",
      toolSlugs: ["styldod"],
    },
    {
      slug: "3d-tours-matterport",
      title: "Creating Professional 3D Virtual Tours with Matterport",
      description: "Master Matterport's platform to create immersive 3D property tours that attract more buyers and close deals faster.",
      content: null,
      estimatedMinutes: 25,
      difficulty: "Intermediate",
      status: "PUBLISHED",
      publishedAt: new Date(),
      categorySlug: "marketing",
      toolSlugs: ["matterport"],
    },
  ];

  for (const t of tutorialData) {
    const { categorySlug, toolSlugs, ...tutFields } = t;
    const tutorial = await prisma.tutorial.upsert({
      where: { slug: t.slug },
      update: { ...tutFields, categoryId: categories[categorySlug] } as any,
      create: { ...tutFields, categoryId: categories[categorySlug] } as any,
    });
    for (const ts of toolSlugs) {
      if (tools[ts]) {
        await prisma.tutorialTool.upsert({
          where: { tutorialId_toolId: { tutorialId: tutorial.id, toolId: tools[ts] } },
          update: {},
          create: { tutorialId: tutorial.id, toolId: tools[ts] },
        });
      }
    }
    console.log(`  ✓ tutorial: ${t.slug}`);
  }

  // ── Stat Pages ──────────────────────────────
  const statData = [
    {
      slug: "ai-adoption-real-estate-2024",
      title: "AI Adoption in Real Estate: 2024 Statistics",
      heroStat: "47%",
      heroLabel: "of agents now use AI tools",
      content: null,
      chartJson: null,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categoryId: categories["analytics"],
      sources: [
        { title: "NAR Technology Survey 2024", url: "https://www.nar.realtor", publisher: "National Association of Realtors", year: 2024 },
        { title: "McKinsey Global Institute AI Report", url: "https://www.mckinsey.com", publisher: "McKinsey", year: 2024 },
      ],
    },
    {
      slug: "ai-real-estate-market-size",
      title: "AI in Real Estate: Market Size & Growth Projections",
      heroStat: "$15B",
      heroLabel: "projected market by 2027",
      content: null,
      chartJson: null,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categoryId: categories["analytics"],
      sources: [
        { title: "MarketsAndMarkets Research", url: "https://www.marketsandmarkets.com", publisher: "MarketsAndMarkets", year: 2024 },
      ],
    },
  ];

  for (const s of statData) {
    const { sources, ...statFields } = s;
    const stat = await prisma.statPage.upsert({
      where: { slug: s.slug },
      update: statFields as any,
      create: statFields as any,
    });
    for (const src of sources) {
      await prisma.statSource.create({
        data: { ...src, statPageId: stat.id },
      });
    }
    console.log(`  ✓ stat: ${s.slug}`);
  }

  // ── Reviews ──────────────────────────────────
  const reviewData = [
    { toolSlug: "zillow-ai", authorName: "Sarah Chen", rating: 5, title: "Essential for any real estate professional", body: "Zillow's AI tools have completely transformed how I do market analysis. The Zestimate accuracy is incredible in my market (Austin), and the recommendation engine helps me match clients to properties they actually want." },
    { toolSlug: "revaluate", authorName: "Mike Harrison", rating: 5, title: "Best lead gen investment I've made", body: "Revaluate has been a game-changer for our team. The move predictions are eerily accurate, and we've doubled our listing appointments since implementing it." },
    { toolSlug: "styldod", authorName: "Jessica Liu", rating: 4, title: "Great for vacant listings", body: "Styldod is our go-to for staging vacant properties. The AI staging looks natural in most cases (though occasionally furniture placement looks slightly off). Saves us thousands vs traditional staging." },
    { toolSlug: "matterport", authorName: "David Kim", rating: 5, title: "The gold standard for virtual tours", body: "Matterport tours are now expected by buyers in our market. The 3D accuracy is mind-blowing, and the AI features (auto-measuring, object detection) keep getting better." },
    { toolSlug: "plunk", authorName: "Rachel Martinez", rating: 5, title: "Love the renovation ROI calculator", body: "Plunk's renovation ROI tool is the best I've found. It helped a client decide which upgrades to make before listing, and they made an extra $45K on the sale." },
    { toolSlug: "cinc", authorName: "Tom Brooks", rating: 4, title: "Powerful but steep learning curve", body: "CINC's AI lead scoring is impressive, and the nurture sequences work. But it took our team a good month to fully set up and optimize. Worth it once configured though." },
  ];

  for (const r of reviewData) {
    const { toolSlug, ...revFields } = r;
    if (tools[toolSlug]) {
      await prisma.review.create({
        data: { ...revFields, toolId: tools[toolSlug] },
      });
    }
  }
  console.log("  ✓ reviews");

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
