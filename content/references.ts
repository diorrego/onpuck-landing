// Single source for the references list, in-text citations, JSON-LD `citation[]`,
// the Markdown twin and llms.txt. Ids are stable anchors (#ref-N): never renumber.
// 1 to 34 follow business-vault/engineering/product-model.md; 35 and 36 back its
// "[research §6.2]" claims (titles and first authors checked on the arXiv API).

export type ReferenceGroup =
  | 'simulating-humans'
  | 'world-models'
  | 'limits'
  | 'simulator-methods'
  | 'agents-on-real-systems'
  | 'interviews-and-self-report';

export type Reference = {
  id: number;
  authors: string;
  title: string;
  venue: string;
  year: number;
  url: string;
  arxiv?: string;
  doi?: string;
  finding: string;
  group: ReferenceGroup;
};

export const referenceGroups: Record<ReferenceGroup, string> = {
  'simulating-humans': 'Simulating humans with LLMs',
  'world-models': 'World models',
  limits: 'Limits of simulated users',
  'simulator-methods': 'Methods used in the simulator',
  'agents-on-real-systems': 'Agents on real systems',
  'interviews-and-self-report': 'Interviews and self-report',
};

const arxiv = (id: string) => ({ arxiv: id, url: `https://arxiv.org/abs/${id}` });
const doi = (id: string) => ({ doi: id, url: `https://doi.org/${id}` });

export const references: Reference[] = [
  {
    id: 1,
    authors: 'Park et al.',
    title: 'Generative Agents: Interactive Simulacra of Human Behavior',
    venue: 'UIST',
    year: 2023,
    ...arxiv('2304.03442'),
    finding:
      'Twenty-five LLM agents with memory, reflection and planning produced believable individual and social behaviour in a sandbox town.',
    group: 'simulating-humans',
  },
  {
    id: 2,
    authors: 'Park et al.',
    title:
      'LLM Agents Grounded in Self-Reports Enable General-Purpose Simulation of Individuals',
    venue: 'arXiv preprint (first titled "Generative Agent Simulations of 1,000 People")',
    year: 2024,
    ...arxiv('2411.10109'),
    finding:
      'Agents grounded in interviews with real people predicted their answers better than agents built from demographics alone (83 to 86% vs 74%).',
    group: 'simulating-humans',
  },
  {
    id: 3,
    authors: 'Argyle et al.',
    title: 'Out of One, Many: Using Language Models to Simulate Human Samples',
    venue: 'Political Analysis',
    year: 2023,
    ...arxiv('2209.06899'),
    finding:
      'Conditioned on real demographic backstories, a language model reproduced the response patterns of human subgroups ("silicon samples").',
    group: 'simulating-humans',
  },
  {
    id: 4,
    authors: 'Aher, Arriaga, Kalai',
    title:
      'Using Large Language Models to Simulate Multiple Humans and Replicate Human Subject Studies',
    venue: 'ICML',
    year: 2023,
    ...arxiv('2208.10264'),
    finding:
      'LLMs replicated several classic studies but showed a "hyper-accuracy distortion": simulated people knew too much.',
    group: 'simulating-humans',
  },
  {
    id: 5,
    authors: 'Ashokkumar, Hewitt, Ghezae, Willer',
    title: 'Large language models can predict results of social science experiments',
    venue: 'Nature',
    year: 2026,
    url: 'https://www.gsb.stanford.edu/faculty-research/publications/large-language-models-can-predict-results-social-science-experiments',
    finding:
      'Across 70 preregistered experiments, LLM simulations predicted the direction of effects about as well as expert forecasters, but overestimated effect sizes.',
    group: 'simulating-humans',
  },
  {
    id: 6,
    authors: 'Lu et al.',
    title: 'AgentA/B: Automated and Scalable Web A/B Testing with Interactive LLM Agents',
    venue: 'arXiv preprint',
    year: 2025,
    ...arxiv('2504.09723'),
    finding:
      '1,000 LLM agents reproduced the direction of a large A/B test on Amazon, but took about 2.5 times fewer actions and 4.5 times fewer searches than humans.',
    group: 'simulating-humans',
  },
  {
    id: 7,
    authors: 'Lu et al.',
    title: 'UXAgent: An LLM Agent-Based Usability Testing Framework for Web Design',
    venue: 'CHI Extended Abstracts',
    year: 2025,
    ...arxiv('2502.12561'),
    finding:
      'Simulated users ran usability tests on web designs and surfaced problems before real participants were recruited.',
    group: 'simulating-humans',
  },
  {
    id: 8,
    authors: 'Ha, Schmidhuber',
    title: 'World Models',
    venue: 'arXiv preprint',
    year: 2018,
    ...arxiv('1803.10122'),
    finding:
      'An agent learned a compressed model of its environment and trained a policy inside that learned model.',
    group: 'world-models',
  },
  {
    id: 9,
    authors: 'Hafner et al.',
    title: 'Mastering Diverse Domains through World Models (DreamerV3)',
    venue: 'Nature',
    year: 2025,
    ...arxiv('2301.04104'),
    finding:
      'One world-model algorithm with fixed settings learned more than 150 diverse tasks, including collecting diamonds in Minecraft from scratch.',
    group: 'world-models',
  },
  {
    id: 10,
    authors: 'Chae et al.',
    title:
      'Web Agents with World Models: Learning and Leveraging Environment Dynamics in Web Navigation',
    venue: 'ICLR',
    year: 2025,
    ...arxiv('2410.13232'),
    finding:
      'LLM web agents struggle to predict the outcome of their own actions; a learned model of web transitions improved their choices.',
    group: 'world-models',
  },
  {
    id: 11,
    authors: 'Zheng et al.',
    title: 'Code2World: A GUI World Model via Renderable Code Generation',
    venue: 'arXiv preprint',
    year: 2026,
    ...arxiv('2602.09856'),
    finding: 'A GUI world model predicts the next screen of an app by generating code that renders it.',
    group: 'world-models',
  },
  {
    id: 12,
    authors: 'Binz et al.',
    title: 'Centaur: a foundation model of human cognition',
    venue: 'Nature',
    year: 2025,
    ...arxiv('2410.20268'),
    finding:
      'A model fine-tuned on 160 psychology experiments predicted human choices in held-out experiments better than classic cognitive models.',
    group: 'limits',
  },
  {
    id: 13,
    authors: 'Anthis et al.',
    title: 'LLM Social Simulations Are a Promising Research Method',
    venue: 'ICML',
    year: 2025,
    ...arxiv('2504.02234'),
    finding:
      'Simulation results shift with prompts and model versions; the paper lays out the challenges to solve before trusting them.',
    group: 'limits',
  },
  {
    id: 14,
    authors: 'Peng et al.',
    title: 'Digital Twins as Funhouse Mirrors: Five Key Distortions',
    venue: 'arXiv preprint',
    year: 2025,
    ...arxiv('2509.19088'),
    finding:
      'Digital twins of real respondents show systematic distortions and transfer poorly to new behaviour.',
    group: 'limits',
  },
  {
    id: 15,
    authors: 'Wang, Morgenstern, Dickerson',
    title:
      'Large language models that replace human participants can harmfully misportray and flatten identity groups',
    venue: 'Nature Machine Intelligence',
    year: 2025,
    ...arxiv('2402.01908'),
    finding: 'LLMs prompted with identity labels misportray demographic groups and flatten their diversity.',
    group: 'limits',
  },
  {
    id: 16,
    authors: 'Nielsen Norman Group',
    title: 'Synthetic Users',
    venue: 'nngroup.com',
    year: 2024,
    url: 'https://www.nngroup.com/articles/synthetic-users/',
    finding:
      'Synthetic users give vague, overly favourable answers to hypothetical questions and miss what real users do.',
    group: 'limits',
  },
  {
    id: 17,
    authors: 'Kirk et al.',
    title: 'Understanding the Effects of RLHF on LLM Generalisation and Diversity',
    venue: 'ICLR',
    year: 2024,
    ...arxiv('2310.06452'),
    finding: 'RLHF improves generalisation but sharply reduces the diversity of model outputs.',
    group: 'limits',
  },
  {
    id: 18,
    authors: 'Hu et al.',
    title:
      'SimBench: Benchmarking the Ability of Large Language Models to Simulate Human Behaviors',
    venue: 'ICLR',
    year: 2026,
    ...arxiv('2510.17516'),
    finding:
      'Instruction tuning helps models simulate questions people agree on and hurts on questions where people disagree.',
    group: 'limits',
  },
  {
    id: 19,
    authors: 'Zhang et al.',
    title: 'Verbalized Sampling: How to Mitigate Mode Collapse and Unlock LLM Diversity',
    venue: 'arXiv preprint',
    year: 2025,
    ...arxiv('2510.01171'),
    finding:
      'Asking a model to state several responses with their probabilities restores diversity lost to mode collapse.',
    group: 'simulator-methods',
  },
  {
    id: 20,
    authors: 'Card, Moran, Newell',
    title:
      'The Keystroke-Level Model for User Performance Time with Interactive Systems',
    venue: 'Communications of the ACM 23(7)',
    year: 1980,
    ...doi('10.1145/358886.358895'),
    finding:
      'Expert task time can be predicted as a sum of keystroke, pointing, homing and mental operators.',
    group: 'simulator-methods',
  },
  {
    id: 21,
    authors: 'Jimenez et al.',
    title: 'SWE-bench: Can Language Models Resolve Real-World GitHub Issues?',
    venue: 'ICLR',
    year: 2024,
    ...arxiv('2310.06770'),
    finding: 'Real GitHub issues from popular repositories need coordinated changes across files.',
    group: 'agents-on-real-systems',
  },
  {
    id: 22,
    authors: 'Yang et al.',
    title:
      'SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering',
    venue: 'NeurIPS',
    year: 2024,
    ...arxiv('2405.15793'),
    finding: 'The design of the agent-computer interface, not only the model, drives results on real repositories.',
    group: 'agents-on-real-systems',
  },
  {
    id: 23,
    authors: 'Lei et al.',
    title:
      'Spider 2.0: Evaluating Language Models on Real-World Enterprise Text-to-SQL Workflows',
    venue: 'ICLR',
    year: 2025,
    ...arxiv('2411.07763'),
    finding:
      'An agent solved 21.3% of enterprise text-to-SQL tasks vs 91.2% on Spider 1.0; success needed metadata and the project’s codebase.',
    group: 'agents-on-real-systems',
  },
  {
    id: 24,
    authors: 'Li et al.',
    title:
      'Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (BIRD)',
    venue: 'NeurIPS',
    year: 2023,
    ...arxiv('2305.03111'),
    finding: 'On dirty, real database values, model execution accuracy was 40% vs 93% for humans.',
    group: 'agents-on-real-systems',
  },
  {
    id: 25,
    authors: 'Chen et al.',
    title: 'Automatic Root Cause Analysis via Large Language Models for Cloud Incidents (RCACopilot)',
    venue: 'EuroSys',
    year: 2024,
    ...arxiv('2305.15778'),
    finding: 'On a year of incidents at Microsoft, LLM root-cause accuracy reached up to 0.766.',
    group: 'agents-on-real-systems',
  },
  {
    id: 26,
    authors: 'Wang et al.',
    title:
      'RCAgent: Cloud Root Cause Analysis by Autonomous Agents with Tool-Augmented Large Language Models',
    venue: 'arXiv preprint',
    year: 2023,
    ...arxiv('2310.16340'),
    finding: 'Tool-using autonomous agents performed root-cause analysis on a real cloud platform’s incidents.',
    group: 'agents-on-real-systems',
  },
  {
    id: 27,
    authors: 'Model Context Protocol',
    title: 'Model Context Protocol specification',
    venue: 'modelcontextprotocol.io',
    year: 2025,
    url: 'https://modelcontextprotocol.io',
    finding: 'An open protocol that connects models to tools and data through explicit, scoped capabilities.',
    group: 'agents-on-real-systems',
  },
  {
    id: 28,
    authors: 'Xiao et al.',
    title:
      'Tell Me About Yourself: Using an AI-Powered Chatbot to Conduct Conversational Surveys with Open-ended Questions',
    venue: 'ACM TOCHI',
    year: 2020,
    ...arxiv('1905.10700'),
    finding:
      'In a field study of about 600 people, a chatbot drew more informative, relevant, specific and clear answers than a Qualtrics survey.',
    group: 'interviews-and-self-report',
  },
  {
    id: 29,
    authors: 'Wuttke et al.',
    title: 'AI Conversational Interviewing: Transforming Surveys with LLMs as Adaptive Interviewers',
    venue: 'LaTeCH-CLfL',
    year: 2025,
    ...arxiv('2410.01824'),
    finding:
      'Randomised AI and human interviewers on the same guide reached comparable interview quality.',
    group: 'interviews-and-self-report',
  },
  {
    id: 30,
    authors: 'Geiecke, Jaravel',
    title: 'Conversations at Scale: Robust AI-led Interviews',
    venue: 'CEPR Discussion Paper 19705',
    year: 2024,
    url: 'https://papers.ssrn.com/abstract=4974382',
    finding: 'An open-source AI interviewer, validated against human interviewers, ran qualitative interviews at scale.',
    group: 'interviews-and-self-report',
  },
  {
    id: 31,
    authors: 'Flanagan',
    title: 'The critical incident technique',
    venue: 'Psychological Bulletin 51(4), 327–358',
    year: 1954,
    ...doi('10.1037/h0061470'),
    finding: 'Record specific behaviour in a concrete incident, not opinions or general estimates.',
    group: 'interviews-and-self-report',
  },
  {
    id: 32,
    authors: 'Parry et al.',
    title:
      'A systematic review and meta-analysis of discrepancies between logged and self-reported digital media use',
    venue: 'Nature Human Behaviour 5, 1535–1547',
    year: 2021,
    ...doi('10.1038/s41562-021-01117-5'),
    finding:
      'Across 106 comparisons and 52,007 people, self-reported digital media use correlated only moderately with logs and was rarely accurate.',
    group: 'interviews-and-self-report',
  },
  {
    id: 33,
    authors: 'Belli et al.',
    title:
      'Event History Calendars and Question List Surveys: A Direct Comparison of Interviewing Methods',
    venue: 'Public Opinion Quarterly 65(1), 45–74',
    year: 2001,
    ...doi('10.1086/320037'),
    finding: 'Event history calendars gave more accurate retrospective reports than question lists.',
    group: 'interviews-and-self-report',
  },
  {
    id: 34,
    authors: 'OpenAI',
    title: 'Introducing SWE-bench Verified',
    venue: 'openai.com',
    year: 2024,
    url: 'https://openai.com/index/introducing-swe-bench-verified/',
    finding:
      '93 developers screened 1,699 tasks and discarded those with underspecified issues or unfair tests; 500 were kept.',
    group: 'agents-on-real-systems',
  },
  {
    id: 35,
    authors: 'Wang et al.',
    title:
      'OPeRA: A Dataset of Observation, Persona, Rationale, and Action for Evaluating LLMs on Human Online Shopping Behavior Simulation',
    venue: 'arXiv preprint',
    year: 2025,
    ...arxiv('2506.05606'),
    finding:
      'The closest public dataset joining what people did with why: 51 users, 692 sessions; the best model predicted the next action 21.5% of the time.',
    group: 'limits',
  },
  {
    id: 36,
    authors: 'Lu et al.',
    title:
      'Can LLM Agents Simulate Multi-Turn Human Behavior? Evidence from Real Online Customer Behavior Data',
    venue: 'arXiv preprint',
    year: 2025,
    ...arxiv('2503.20749'),
    finding:
      'On 31,865 real shopping sessions, prompted LLMs predicted the next action about 12% of the time; fine-tuning reached 17.3%.',
    group: 'limits',
  },
];

export function referenceById(id: number): Reference {
  const ref = references.find((r) => r.id === id);
  if (!ref) throw new Error(`Unknown reference [${id}]`);
  return ref;
}
