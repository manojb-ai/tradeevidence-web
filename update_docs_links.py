from pathlib import Path
import os

root = Path('docs')
files = {
    'README.md': ['00-PRD.md', '01-Product-Vision.md', '03-Architecture.md', '06-Roadmap.md', '11-TradeEvidence-Manifesto.md'],
    '00-PRD.md': ['01-Product-Vision.md', '03-Architecture.md', '05-Product-Decisions.md', '06-Roadmap.md', '07-Scoring-Engine.md'],
    '01-Product-Vision.md': ['00-PRD.md', '02-Principles.md', '06-Roadmap.md', '11-TradeEvidence-Manifesto.md'],
    '02-Principles.md': ['00-PRD.md', '01-Product-Vision.md', '08-AI-Strategy.md', '12-Engineering-Standards.md'],
    '03-Architecture.md': ['00-PRD.md', '04-Design-System.md', '05-Product-Decisions.md', '06-Roadmap.md', '09-Data-Model.md'],
    '04-Design-System.md': ['03-Architecture.md', '05-Product-Decisions.md', '10-Glossary.md'],
    '05-Product-Decisions.md': ['03-Architecture.md', '06-Roadmap.md', '00-PRD.md'],
    '06-Roadmap.md': ['00-PRD.md', '05-Product-Decisions.md', '03-Architecture.md', '07-Scoring-Engine.md'],
    '07-Scoring-Engine.md': ['03-Architecture.md', '08-AI-Strategy.md', '09-Data-Model.md', '06-Roadmap.md'],
    '08-AI-Strategy.md': ['02-Principles.md', '07-Scoring-Engine.md', '09-Data-Model.md', '11-TradeEvidence-Manifesto.md'],
    '09-Data-Model.md': ['03-Architecture.md', '07-Scoring-Engine.md', '08-AI-Strategy.md', '05-Product-Decisions.md'],
    '10-Glossary.md': ['01-Product-Vision.md', '02-Principles.md', '07-Scoring-Engine.md', '09-Data-Model.md'],
    '11-TradeEvidence-Manifesto.md': ['00-PRD.md', '01-Product-Vision.md', '02-Principles.md', '08-AI-Strategy.md'],
    '12-Engineering-Standards.md': ['02-Principles.md', '03-Architecture.md', '04-Design-System.md', '05-Product-Decisions.md'],
    '13-Competitive-Analysis.md': ['00-PRD.md', '01-Product-Vision.md', '06-Roadmap.md', '05-Product-Decisions.md'],
    'AI_CONTEXT.md': ['00-PRD.md', '02-Principles.md', '03-Architecture.md', '04-Design-System.md', '12-Engineering-Standards.md'],
    'architecture/Frontend.md': ['../03-Architecture.md', '../04-Design-System.md', '../README.md'],
    'architecture/Backend.md': ['../03-Architecture.md', '../09-Data-Model.md', '../05-Product-Decisions.md'],
    'architecture/Authentication.md': ['../03-Architecture.md', '../05-Product-Decisions.md', '../README.md'],
    'architecture/Database.md': ['../03-Architecture.md', '../09-Data-Model.md', '../README.md'],
    'architecture/Deployment.md': ['../03-Architecture.md', '../05-Product-Decisions.md', '../README.md'],
    'architecture/APIs.md': ['../03-Architecture.md', '../09-Data-Model.md', '../README.md'],
    'product/Dashboard.md': ['../03-Architecture.md', '../04-Design-System.md', '../06-Roadmap.md'],
    'product/Watchlists.md': ['../07-Scoring-Engine.md', '../09-Data-Model.md', '../06-Roadmap.md'],
    'product/MarketSummary.md': ['../03-Architecture.md', '../07-Scoring-Engine.md', '../06-Roadmap.md'],
    'product/Reports.md': ['../07-Scoring-Engine.md', '../08-AI-Strategy.md', '../06-Roadmap.md'],
    'product/Alerts.md': ['../03-Architecture.md', '../09-Data-Model.md', '../06-Roadmap.md'],
    'product/Journal.md': ['../08-AI-Strategy.md', '../09-Data-Model.md', '../06-Roadmap.md'],
    'product/Portfolio.md': ['../09-Data-Model.md', '../06-Roadmap.md', '../README.md'],
    'product/Scanners.md': ['../07-Scoring-Engine.md', '../09-Data-Model.md', '../06-Roadmap.md'],
    'ui/LandingPage.md': ['../00-PRD.md', '../04-Design-System.md', '../README.md'],
    'ui/Dashboard.md': ['../04-Design-System.md', '../03-Architecture.md', '../README.md'],
    'ui/Navigation.md': ['../04-Design-System.md', '../03-Architecture.md', '../README.md'],
    'ui/Components.md': ['../04-Design-System.md', '../03-Architecture.md', '../README.md'],
    'ui/DesignTokens.md': ['../04-Design-System.md', '../03-Architecture.md', '../README.md'],
    'research/OptionStrategies.md': ['../07-Scoring-Engine.md', '../09-Data-Model.md', '../README.md'],
    'research/IVRank.md': ['../07-Scoring-Engine.md', '../09-Data-Model.md', '../README.md'],
    'research/RelativeStrength.md': ['../07-Scoring-Engine.md', '../09-Data-Model.md', '../README.md'],
    'research/Breadth.md': ['../07-Scoring-Engine.md', '../09-Data-Model.md', '../README.md'],
    'research/MarketRegimes.md': ['../07-Scoring-Engine.md', '../09-Data-Model.md', '../README.md'],
    'decisions/ADR-0001.md': ['../05-Product-Decisions.md', '../03-Architecture.md', '../README.md'],
    'decisions/ADR-0002.md': ['../05-Product-Decisions.md', '../04-Design-System.md', '../README.md'],
    'decisions/ADR-0003.md': ['../05-Product-Decisions.md', '../07-Scoring-Engine.md', '../README.md'],
    'releases/v0.1.md': ['../06-Roadmap.md', '../README.md', '../05-Product-Decisions.md'],
    'releases/v0.2.md': ['../06-Roadmap.md', '../README.md', '../03-Architecture.md'],
    'releases/v0.3.md': ['../06-Roadmap.md', '../README.md', '../04-Design-System.md'],
}

for rel_path, targets in files.items():
    path = root / rel_path
    if not path.exists():
        continue
    text = path.read_text(encoding='utf-8')
    if '## Related Documents' in text:
        continue
    links = []
    for target in targets:
        target_path = (path.parent / target).resolve()
        rel_target = os.path.relpath(target_path, start=path.parent).replace('\\', '/')
        links.append(f'- [{target}]({rel_target})')
    section = '\n\n## Related Documents\n\n' + '\n'.join(links) + '\n'
    if '## TODO' in text:
        text = text.replace('## TODO', section + '## TODO', 1)
    else:
        text = text.rstrip() + section
    path.write_text(text, encoding='utf-8')

print('Updated documentation with Related Documents links.')
