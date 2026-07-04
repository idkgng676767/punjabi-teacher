import React from 'react';
import { Link } from 'react-router-dom';
import {
  architectureLayers,
  audienceSegments,
  businessModel,
  curriculumLevels,
  designPrinciples,
  gamificationLayers,
  kpiTargets,
  learningModes,
  marketingPlan,
  productPillars,
  punjabiModules,
  quickStats,
  roadmap,
  risks,
} from '../data/blueprint';

const sectionLinks = [
  ['Audience', 'audience'],
  ['Curriculum', 'curriculum'],
  ['Modules', 'modules'],
  ['Gamification', 'gamification'],
  ['Business', 'business'],
  ['Roadmap', 'roadmap'],
  ['Architecture', 'architecture'],
  ['KPI', 'kpi'],
];

function Home() {
  return (
    <div className="page-shell blueprint-page">
      <section className="hero-panel hero-grid" id="overview">
        <div>
          <p className="eyebrow">PunjabiLingo product atlas</p>
          <h1>The entire product vision, shown as a living app preview.</h1>
          <p className="lead">
            This workspace now shows the full product vision from the plan files: learning flow, script mastery,
            cultural modules, gamification, monetization, marketing, and architecture.
          </p>
          <div className="hero-actions">
            <Link to="/lessons" className="btn-primary">Open lessons</Link>
            <Link to="/practice" className="btn-secondary">Try practice</Link>
            <Link to="/skill-tree" className="btn-secondary">View skill tree</Link>
          </div>
        </div>

        <div className="hero-panel-card">
          <div className="hero-chip-row">
            {sectionLinks.map(([label, anchor]) => (
              <a key={anchor} href={`#${anchor}`} className="chip-link">
                {label}
              </a>
            ))}
          </div>
          <div className="hero-stat-grid">
            {quickStats.map((stat) => (
              <article key={stat.label} className="stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SectionBlock id="audience" title="Who it serves" description="Four learner groups drive the product, each with different goals and habits.">
        <div className="card-grid four-up">
          {audienceSegments.map((segment) => (
            <article key={segment.title} className="info-card">
              <p className="card-kicker">{segment.label}</p>
              <h3>{segment.title}</h3>
              <p>{segment.summary}</p>
              <p className="muted">{segment.need}</p>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="curriculum" title="Curriculum shape" description="The path is layered from beginner script work to advanced expression.">
        <div className="timeline-grid four-up">
          {curriculumLevels.map((item) => (
            <article key={item.level} className="timeline-card">
              <h3>{item.level}</h3>
              <p>{item.goal}</p>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title="Core learning modes" description="Each lesson is intentionally short and mode-based.">
        <div className="card-grid three-up">
          {learningModes.map((mode) => (
            <article key={mode.title} className="feature-tile">
              <h3>{mode.title}</h3>
              <p>{mode.detail}</p>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="modules" title="Punjabi-specific modules" description="The app’s most distinctive content pillars are all represented.">
        <div className="card-grid three-up">
          {punjabiModules.map((module) => (
            <article key={module.title} className="feature-tile accent">
              <h3>{module.title}</h3>
              <p>{module.detail}</p>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="gamification" title="Gamification stack" description="Progress, streaks, currency, and village-building keep the app sticky.">
        <div className="card-grid three-up">
          {gamificationLayers.map((item) => (
            <article key={item.title} className="feature-tile">
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title="Product pillars" description="A compact summary of the product’s intended identity.">
        <ul className="pill-list">
          {productPillars.map((pillar) => (
            <li key={pillar}>{pillar}</li>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock id="business" title="Business model" description="The plan uses freemium and institutional pricing to support growth.">
        <div className="card-grid two-up">
          {businessModel.map((plan) => (
            <article key={plan.title} className="info-card">
              <h3>{plan.title}</h3>
              <p>{plan.detail}</p>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title="Marketing channels" description="The go-to-market plan is built around creators and communities.">
        <div className="stack-list">
          {marketingPlan.map((item) => (
            <div key={item} className="stack-item">{item}</div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="roadmap" title="Roadmap" description="A phased launch from validation to scale.">
        <div className="timeline-grid four-up">
          {roadmap.map((phase) => (
            <article key={phase.phase} className="timeline-card">
              <h3>{phase.phase}</h3>
              <p>{phase.detail}</p>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="architecture" title="Architecture snapshot" description="The product is designed as a web, mobile, API, and AI system.">
        <div className="card-grid three-up">
          {architectureLayers.map((layer) => (
            <article key={layer.layer} className="feature-tile">
              <h3>{layer.layer}</h3>
              <p>{layer.detail}</p>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title="Design principles" description="The interface should feel warm, respectful, readable, and calm.">
        <ul className="pill-list compact">
          {designPrinciples.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock id="kpi" title="KPIs and risks" description="Success needs a measurable outcome and an honest view of the blockers.">
        <div className="dual-panel">
          <div>
            <h3>Targets</h3>
            <div className="mini-grid">
              {kpiTargets.map((kpi) => (
                <div key={kpi.label} className="stat-card compact">
                  <strong>{kpi.value}</strong>
                  <span>{kpi.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3>Risks</h3>
            <ul className="risk-list">
              {risks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </div>
        </div>
      </SectionBlock>
    </div>
  );
}

function SectionBlock({ id, title, description, children }) {
  return (
    <section className="content-section" id={id}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Blueprint</p>
          <h2>{title}</h2>
        </div>
        <p className="lead section-lead">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default Home;