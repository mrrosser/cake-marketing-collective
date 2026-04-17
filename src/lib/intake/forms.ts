import { z } from 'zod';

export type IntakeBranchKey =
  | 'brand-strategy'
  | 'experiential-design'
  | 'creative-strategy'
  | 'social-media'
  | 'general';

export type IntakeFieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'tel'
  | 'url'
  | 'select'
  | 'radio'
  | 'multiselect'
  | 'date';

export interface IntakeOption {
  label: string;
  value: string;
}

export interface IntakeFieldDefinition {
  id: string;
  label: string;
  type: IntakeFieldType;
  required?: boolean;
  placeholder?: string;
  description?: string;
  options?: IntakeOption[];
}

export interface IntakeSectionDefinition {
  id: string;
  title: string;
  description?: string;
  fields: IntakeFieldDefinition[];
}

export interface IntakeBranchDefinition {
  key: IntakeBranchKey;
  label: string;
  heroTitle: string;
  heroDescription: string;
  serviceAliases: string[];
  sections: IntakeSectionDefinition[];
}

export const basicInformationSection: IntakeSectionDefinition = {
  id: 'basic-information',
  title: 'Basic Information',
  description: 'This appears at the top of every intake so the team can route and respond quickly.',
  fields: [
    { id: 'fullName', label: 'Full Name', type: 'text', required: true },
    { id: 'emailAddress', label: 'Email Address', type: 'email', required: true },
    { id: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Optional' },
    { id: 'businessName', label: 'Business Name', type: 'text', required: true },
    { id: 'website', label: 'Website', type: 'url', placeholder: 'If applicable' },
    {
      id: 'socialHandles',
      label: 'Instagram / Social Handles',
      type: 'text',
      required: true,
    },
    { id: 'location', label: 'Location (City, State)', type: 'text', required: true },
    {
      id: 'referralSource',
      label: 'How did you hear about us?',
      type: 'text',
      required: true,
    },
  ],
};

export const intakeBranches: IntakeBranchDefinition[] = [
  {
    key: 'brand-strategy',
    label: 'Brand Strategy',
    heroTitle: 'Build a brand that feels aligned before it scales.',
    heroDescription: 'This branch captures positioning, audience, emotional direction, and visual intent.',
    serviceAliases: ['brand strategy', 'branding'],
    sections: [
      {
        id: 'brand-foundation',
        title: 'Brand Foundation',
        fields: [
          {
            id: 'brandDescription',
            label: 'How would you describe your brand right now?',
            type: 'textarea',
            required: true,
          },
          {
            id: 'visionAlignment',
            label: 'Do you feel your brand currently reflects your vision? Why or why not?',
            type: 'textarea',
            required: true,
          },
          {
            id: 'businessStage',
            label: 'What stage are you in?',
            type: 'radio',
            required: true,
            options: [
              { label: 'Idea', value: 'idea' },
              { label: 'Early-stage', value: 'early-stage' },
              { label: 'Established but needs refinement', value: 'established-refinement' },
              { label: 'Rebranding', value: 'rebranding' },
            ],
          },
        ],
      },
      {
        id: 'business-clarity',
        title: 'Business Clarity',
        fields: [
          { id: 'offer', label: 'What do you offer?', type: 'textarea', required: true },
          {
            id: 'revenueDrivers',
            label: 'What are your top 3 revenue drivers?',
            type: 'textarea',
            required: true,
          },
          {
            id: 'differentiators',
            label: 'What makes your business different?',
            type: 'textarea',
            required: true,
          },
        ],
      },
      {
        id: 'audience',
        title: 'Audience',
        fields: [
          { id: 'idealCustomer', label: 'Who is your ideal customer?', type: 'textarea', required: true },
          { id: 'currentAudience', label: 'Who are you currently attracting?', type: 'textarea', required: true },
          {
            id: 'audienceProblems',
            label: 'What problems does your audience have that you solve?',
            type: 'textarea',
            required: true,
          },
        ],
      },
      {
        id: 'positioning',
        title: 'Positioning',
        fields: [
          {
            id: 'competitors',
            label: 'List 2–3 competitors or similar brands',
            type: 'textarea',
            required: true,
          },
          {
            id: 'competitorPreferences',
            label: 'What do you like or dislike about them?',
            type: 'textarea',
            required: true,
          },
          {
            id: 'marketStanding',
            label: 'Where do you feel you stand in comparison?',
            type: 'textarea',
            required: true,
          },
        ],
      },
      {
        id: 'brand-vision',
        title: 'Brand Vision',
        fields: [
          {
            id: 'brandGoals',
            label: 'Where do you want your brand to be in 6–12 months?',
            type: 'textarea',
            required: true,
          },
          {
            id: 'brandEmotion',
            label: 'What emotions should people feel when they interact with your brand?',
            type: 'textarea',
            required: true,
          },
          {
            id: 'brandPersonality',
            label: 'If your brand were a person, how would you describe them?',
            type: 'textarea',
            required: true,
          },
        ],
      },
      {
        id: 'visual-and-voice',
        title: 'Visual and Voice',
        fields: [
          {
            id: 'existingAssets',
            label: 'Do you have existing brand assets?',
            type: 'textarea',
          },
          {
            id: 'brandSupportType',
            label: 'Are you looking for:',
            type: 'radio',
            required: true,
            options: [
              { label: 'Full brand creation', value: 'full-brand-creation' },
              { label: 'Rebrand', value: 'rebrand' },
              { label: 'Brand refinement', value: 'brand-refinement' },
            ],
          },
          {
            id: 'idealAesthetic',
            label: 'Describe your ideal aesthetic or link references',
            type: 'textarea',
            required: true,
          },
        ],
      },
      {
        id: 'investment-and-timeline',
        title: 'Investment and Timeline',
        fields: [
          {
            id: 'budgetRange',
            label: 'Budget range',
            type: 'select',
            required: true,
            options: [
              { label: '$0-$400', value: '0-400' },
              { label: '$500-$1,000', value: '500-1000' },
              { label: '$1,000-$5,000', value: '1000-5000' },
              { label: '$5,000+', value: '5000-plus' },
            ],
          },
          { id: 'desiredStartDate', label: 'Desired start date', type: 'date' },
          { id: 'deadlines', label: 'Any deadlines?', type: 'textarea' },
        ],
      },
    ],
  },
  {
    key: 'experiential-design',
    label: 'Experiential Design',
    heroTitle: 'Design an experience people remember and act on.',
    heroDescription: 'This branch captures concept, audience feeling, logistics, and scope.',
    serviceAliases: ['experiential design', 'experiential'],
    sections: [
      {
        id: 'project-overview',
        title: 'Project Overview',
        fields: [
          {
            id: 'experienceType',
            label: 'What type of experience are you looking to create?',
            type: 'radio',
            required: true,
            options: [
              { label: 'Event', value: 'event' },
              { label: 'Pop-up', value: 'popup' },
              { label: 'Retail activation', value: 'retail-activation' },
              { label: 'Installation', value: 'installation' },
              { label: 'Other', value: 'other' },
            ],
          },
          {
            id: 'conceptDescription',
            label: 'Briefly describe the concept (if you have one)',
            type: 'textarea',
            required: true,
          },
        ],
      },
      {
        id: 'goals',
        title: 'Goals',
        fields: [
          {
            id: 'experienceGoal',
            label: 'What is the goal of this experience?',
            type: 'multiselect',
            required: true,
            options: [
              { label: 'Brand awareness', value: 'brand-awareness' },
              { label: 'Sales', value: 'sales' },
              { label: 'Community building', value: 'community-building' },
              { label: 'Press / social buzz', value: 'press-social-buzz' },
            ],
          },
          {
            id: 'successDefinition',
            label: 'What does success look like?',
            type: 'textarea',
            required: true,
          },
        ],
      },
      {
        id: 'audience-experience',
        title: 'Audience Experience',
        fields: [
          { id: 'audienceProfile', label: 'Who is attending or interacting?', type: 'textarea', required: true },
          { id: 'audienceFeeling', label: 'What should they feel during the experience?', type: 'textarea', required: true },
          { id: 'audienceAction', label: 'What should they do?', type: 'textarea', required: true },
        ],
      },
      {
        id: 'logistics',
        title: 'Logistics',
        fields: [
          { id: 'eventLocation', label: 'Location (if known)', type: 'text' },
          {
            id: 'indoorOutdoor',
            label: 'Indoor or Outdoor?',
            type: 'radio',
            options: [
              { label: 'Indoor', value: 'indoor' },
              { label: 'Outdoor', value: 'outdoor' },
              { label: 'Both / undecided', value: 'mixed' },
            ],
          },
          { id: 'estimatedAttendance', label: 'Estimated attendance', type: 'text' },
          { id: 'eventTimeframe', label: 'Date(s) or timeframe', type: 'text' },
        ],
      },
      {
        id: 'creative-direction',
        title: 'Creative Direction',
        fields: [
          {
            id: 'existingTheme',
            label: 'Do you have a theme or concept already?',
            type: 'textarea',
          },
          { id: 'references', label: 'Any inspiration or references?', type: 'textarea' },
          {
            id: 'conceptSupport',
            label: 'Are you looking for:',
            type: 'radio',
            required: true,
            options: [
              { label: 'Full concept creation', value: 'full-concept-creation' },
              { label: 'Design execution only', value: 'design-execution-only' },
              { label: 'Both', value: 'both' },
            ],
          },
        ],
      },
      {
        id: 'brand-integration',
        title: 'Brand Integration',
        fields: [
          {
            id: 'brandPresence',
            label: 'How should your brand show up in the experience?',
            type: 'textarea',
            required: true,
          },
          {
            id: 'highlightedOffers',
            label: 'Are there specific products or services to highlight?',
            type: 'textarea',
          },
        ],
      },
      {
        id: 'budget-scope',
        title: 'Budget and Scope',
        fields: [
          {
            id: 'budgetRange',
            label: 'Budget range',
            type: 'select',
            required: true,
            options: [
              { label: '$0-$400', value: '0-400' },
              { label: '$500-$1,000', value: '500-1000' },
              { label: '$1,000-$5,000', value: '1000-5000' },
              { label: '$5,000+', value: '5000-plus' },
            ],
          },
          {
            id: 'phasedBuilds',
            label: 'Are you open to phased builds or scaling?',
            type: 'radio',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
          },
          {
            id: 'vendorCoordination',
            label: 'Do you need vendor coordination?',
            type: 'radio',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
          },
        ],
      },
      {
        id: 'timeline',
        title: 'Timeline',
        fields: [
          { id: 'launchDate', label: 'Ideal launch or event date', type: 'date' },
          { id: 'milestones', label: 'Key milestones (if any)', type: 'textarea' },
        ],
      },
    ],
  },
  {
    key: 'creative-strategy',
    label: 'Creative Strategy',
    heroTitle: 'Clarify the message, concept, and campaign before production spins up.',
    heroDescription: 'This branch focuses on objectives, channels, messaging, and execution support.',
    serviceAliases: ['creative strategy', 'creative'],
    sections: [
      {
        id: 'current-state',
        title: 'Current State',
        fields: [
          { id: 'currentMarketing', label: 'What are you currently doing for marketing or creative?', type: 'textarea', required: true },
          { id: 'workingNow', label: 'What is working?', type: 'textarea', required: true },
          { id: 'notWorking', label: 'What is not working?', type: 'textarea', required: true },
        ],
      },
      {
        id: 'objectives',
        title: 'Objectives',
        fields: [
          { id: 'topGoals', label: 'What are your top 3 goals right now?', type: 'textarea', required: true },
          {
            id: 'goalFocus',
            label: 'Are you focused more on:',
            type: 'radio',
            required: true,
            options: [
              { label: 'Awareness', value: 'awareness' },
              { label: 'Engagement', value: 'engagement' },
              { label: 'Conversion', value: 'conversion' },
            ],
          },
        ],
      },
      {
        id: 'content-and-messaging',
        title: 'Content and Messaging',
        fields: [
          { id: 'currentMessaging', label: 'What is your current messaging?', type: 'textarea', required: true },
          { id: 'messageResonance', label: 'Do you feel it resonates with your audience?', type: 'textarea', required: true },
          {
            id: 'mainStruggle',
            label: 'What do you struggle with most?',
            type: 'radio',
            required: true,
            options: [
              { label: 'Content ideas', value: 'content-ideas' },
              { label: 'Consistency', value: 'consistency' },
              { label: 'Branding', value: 'branding' },
              { label: 'Conversion', value: 'conversion' },
            ],
          },
        ],
      },
      {
        id: 'channels',
        title: 'Channels',
        fields: [
          { id: 'activeChannels', label: 'Where are you currently active?', type: 'textarea', required: true },
          { id: 'growthChannels', label: 'Where do you want to grow?', type: 'textarea', required: true },
        ],
      },
      {
        id: 'brand-voice',
        title: 'Brand Voice',
        fields: [
          { id: 'currentVoice', label: 'How do you currently sound online?', type: 'textarea', required: true },
          { id: 'targetVoice', label: 'How do you want to sound?', type: 'textarea', required: true },
        ],
      },
      {
        id: 'creative-needs',
        title: 'Creative Needs',
        fields: [
          {
            id: 'creativeNeeds',
            label: 'What are you looking for?',
            type: 'multiselect',
            required: true,
            options: [
              { label: 'Campaign strategy', value: 'campaign-strategy' },
              { label: 'Content direction', value: 'content-direction' },
              { label: 'Messaging framework', value: 'messaging-framework' },
              { label: 'Launch strategy', value: 'launch-strategy' },
            ],
          },
        ],
      },
      {
        id: 'team-and-execution',
        title: 'Team and Execution',
        fields: [
          {
            id: 'teamExecution',
            label: 'Do you have a team executing content, or do you need full support?',
            type: 'textarea',
            required: true,
          },
        ],
      },
      {
        id: 'success-metrics',
        title: 'Success Metrics',
        fields: [
          { id: 'currentMetrics', label: 'How do you measure success right now?', type: 'textarea', required: true },
          { id: 'winDefinition', label: 'What would “this worked” look like?', type: 'textarea', required: true },
        ],
      },
      {
        id: 'budget-timeline',
        title: 'Budget and Timeline',
        fields: [
          {
            id: 'budgetRange',
            label: 'Budget range',
            type: 'select',
            required: true,
            options: [
              { label: '$0-$400', value: '0-400' },
              { label: '$500-$1,000', value: '500-1000' },
              { label: '$1,000-$5,000', value: '1000-5000' },
              { label: '$5,000+', value: '5000-plus' },
            ],
          },
          { id: 'startTimeline', label: 'Start timeline', type: 'text' },
        ],
      },
    ],
  },
  {
    key: 'social-media',
    label: 'Social Media Strategy / Services',
    heroTitle: 'Turn social presence into a managed growth system.',
    heroDescription: 'This branch captures channels, performance, goals, approvals, and content appetite.',
    serviceAliases: ['social media strategy', 'social media services', 'social media'],
    sections: [
      {
        id: 'current-social-presence',
        title: 'Current Social Presence',
        fields: [
          { id: 'activePlatforms', label: 'Platforms you’re active on', type: 'textarea', required: true },
          { id: 'handles', label: 'Username or handles', type: 'text', required: true },
          { id: 'postingFrequency', label: 'Posting frequency', type: 'text', required: true },
        ],
      },
      {
        id: 'performance',
        title: 'Performance',
        fields: [
          { id: 'workingWell', label: 'What is working well?', type: 'textarea', required: true },
          { id: 'notPerforming', label: 'What is not performing?', type: 'textarea', required: true },
          { id: 'pastCampaigns', label: 'Any past campaigns?', type: 'textarea' },
        ],
      },
      {
        id: 'goals',
        title: 'Goals',
        fields: [
          {
            id: 'primaryGoals',
            label: 'What are your primary goals?',
            type: 'multiselect',
            required: true,
            options: [
              { label: 'Sales', value: 'sales' },
              { label: 'Foot traffic', value: 'foot-traffic' },
              { label: 'Bookings', value: 'bookings' },
              { label: 'Brand awareness', value: 'brand-awareness' },
              { label: 'Community growth', value: 'community-growth' },
            ],
          },
        ],
      },
      {
        id: 'audience',
        title: 'Audience',
        fields: [
          { id: 'targetAudience', label: 'Who are you trying to reach?', type: 'textarea', required: true },
          { id: 'currentEngagers', label: 'Who is currently engaging?', type: 'textarea', required: true },
        ],
      },
      {
        id: 'content-direction',
        title: 'Content Direction',
        fields: [
          { id: 'currentContent', label: 'What type of content do you currently post?', type: 'textarea', required: true },
          { id: 'desiredContent', label: 'What do you want to post more of?', type: 'textarea', required: true },
          {
            id: 'contentOpenness',
            label: 'Are you open to:',
            type: 'multiselect',
            required: true,
            options: [
              { label: 'Video / Reels', value: 'video-reels' },
              { label: 'On-camera presence', value: 'on-camera' },
              { label: 'Trends', value: 'trends' },
            ],
          },
        ],
      },
      {
        id: 'brand-alignment',
        title: 'Brand Alignment',
        fields: [
          { id: 'brandGuidelines', label: 'Do you have brand guidelines?', type: 'textarea' },
          {
            id: 'contentRestrictions',
            label: 'Any content restrictions or sensitivities?',
            type: 'textarea',
          },
        ],
      },
      {
        id: 'services-needed',
        title: 'Services Needed',
        fields: [
          {
            id: 'serviceNeeds',
            label: 'What are you looking for?',
            type: 'multiselect',
            required: true,
            options: [
              { label: 'Strategy only', value: 'strategy-only' },
              { label: 'Content creation', value: 'content-creation' },
              { label: 'Full management', value: 'full-management' },
              { label: 'Ads', value: 'ads' },
              { label: 'Influencer partnerships', value: 'influencer-partnerships' },
            ],
          },
        ],
      },
      {
        id: 'logistics',
        title: 'Logistics',
        fields: [
          { id: 'contentApprover', label: 'Who will approve content?', type: 'text', required: true },
          { id: 'turnaround', label: 'Turnaround expectations?', type: 'text' },
        ],
      },
      {
        id: 'growth-and-investment',
        title: 'Growth and Investment',
        fields: [
          { id: 'monthlyBudget', label: 'Monthly budget', type: 'text', required: true },
          {
            id: 'paidAds',
            label: 'Open to paid ads?',
            type: 'radio',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
          },
        ],
      },
      {
        id: 'timeline',
        title: 'Timeline',
        fields: [
          { id: 'startDate', label: 'When do you want to start?', type: 'date' },
          { id: 'importantDates', label: 'Any launches or important dates?', type: 'textarea' },
        ],
      },
    ],
  },
  {
    key: 'general',
    label: 'General Inquiry',
    heroTitle: 'Tell us what you need and we will route it from there.',
    heroDescription: 'Use this when the service does not map cleanly to a dedicated branch yet.',
    serviceAliases: ['general', 'project management', 'visual production', 'digital marketing'],
    sections: [
      {
        id: 'general-overview',
        title: 'Overview',
        fields: [
          {
            id: 'requestedService',
            label: 'What service are you most interested in?',
            type: 'text',
            required: true,
          },
          {
            id: 'businessContext',
            label: 'What is going on in the business right now?',
            type: 'textarea',
            required: true,
          },
          {
            id: 'desiredOutcome',
            label: 'What outcome are you hoping to create?',
            type: 'textarea',
            required: true,
          },
          {
            id: 'timeline',
            label: 'What timeline matters right now?',
            type: 'text',
          },
          {
            id: 'budgetRange',
            label: 'Budget range',
            type: 'select',
            required: true,
            options: [
              { label: '$0-$400', value: '0-400' },
              { label: '$500-$1,000', value: '500-1000' },
              { label: '$1,000-$5,000', value: '1000-5000' },
              { label: '$5,000+', value: '5000-plus' },
            ],
          },
        ],
      },
    ],
  },
];

export const responseValueSchema = z.union([z.string(), z.array(z.string())]);

export const intakeSubmissionSchema = z.object({
  service: z.string().min(1),
  branchKey: z.enum([
    'brand-strategy',
    'experiential-design',
    'creative-strategy',
    'social-media',
    'general',
  ]),
  basicInfo: z.object({
    fullName: z.string().min(2),
    emailAddress: z.email(),
    phoneNumber: z.string().optional().default(''),
    businessName: z.string().min(2),
    website: z.string().optional().default(''),
    socialHandles: z.string().min(2),
    location: z.string().min(2),
    referralSource: z.string().min(2),
  }),
  answers: z.record(z.string(), responseValueSchema),
  finalNote: z.string().optional().default(''),
});

export type IntakeSubmission = z.infer<typeof intakeSubmissionSchema>;
