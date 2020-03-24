#!/usr/bin/env node

const commitMessageSeparator = '\n\n';

// 1. get data
const {
  GITHUB_REPOSITORY_ICON,

  GIT_CLONE_COMMIT_AUTHOR_NAME = process.env.CI_COMMITTER_USERNAME,
  GIT_CLONE_COMMIT_MESSAGE = process.env.CI_MESSAGE,
  GIT_CLONE_COMMIT_HASH = process.env.CI_COMMIT_ID,
  GIT_CLONE_COMMIT_MESSAGE_SUBJECT: GIT_CLONE_COMMIT_MESSAGE_SUBJECT_ENV,
  GIT_CLONE_COMMIT_MESSAGE_BODY: GIT_CLONE_COMMIT_MESSAGE_BODY_ENV,

  // github specific
  GITHUB_REPOSITORY_URL,
  GITHUB_REPOSITORY,
  GITHUB_GIT_REF,

  // bitrise/codepush specific
  BITRISEIO_GIT_REPOSITORY_OWNER,
  BITRISEIO_GIT_REPOSITORY_SLUG,
  BITRISE_GIT_BRANCH,
  CI_BRANCH,
  CI_REPO_NAME,

  // with bitrise/codepush fallback
  BUILD_URL = process.env.BITRISE_BUILD_URL || process.env.CI_BUILD_URL,
  TRIGGERED_WORKFLOW_ID = process.env.BITRISE_TRIGGERED_WORKFLOW_ID ||
    'default',
} = process.env;

const GITHUB_REPO_NAME =
  CI_REPO_NAME ||
  GITHUB_REPOSITORY ||
  `${BITRISEIO_GIT_REPOSITORY_OWNER}/${BITRISEIO_GIT_REPOSITORY_SLUG}`;

const getCommitSubjectAndBody = () => {
  if (GIT_CLONE_COMMIT_MESSAGE) {
    const [
      GIT_CLONE_COMMIT_MESSAGE_SUBJECT,
      ...GIT_CLONE_COMMIT_MESSAGE_BODY_PARTS
    ] = GIT_CLONE_COMMIT_MESSAGE.split(commitMessageSeparator);
    const GIT_CLONE_COMMIT_MESSAGE_BODY = GIT_CLONE_COMMIT_MESSAGE_BODY_PARTS.join(
      commitMessageSeparator
    );

    return [GIT_CLONE_COMMIT_MESSAGE_SUBJECT, GIT_CLONE_COMMIT_MESSAGE_BODY];
  }

  return [
    GIT_CLONE_COMMIT_MESSAGE_SUBJECT_ENV,
    GIT_CLONE_COMMIT_MESSAGE_BODY_ENV,
  ];
};

const [
  GIT_CLONE_COMMIT_MESSAGE_SUBJECT,
  GIT_CLONE_COMMIT_MESSAGE_BODY,
] = getCommitSubjectAndBody();

const GIT_BRANCH =
  CI_BRANCH || BITRISE_GIT_BRANCH || GITHUB_GIT_REF.slice('refs/heads/'.length);

// 2. render
const GIT_CLONE_COMMIT_MESSAGE_SUBJECT_WITH_LINK = GIT_CLONE_COMMIT_MESSAGE_SUBJECT.replace(
  / #(\d+) /g,
  ` <${GITHUB_REPOSITORY_URL}/pull/$1|#$1> `
);

const branchIndicator =
  {
    master: ':rocket:',
    staging: 'β',
  }[GIT_BRANCH] || '';

const data = {
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:heavy_check_mark: *Build Succeeded!* ${GITHUB_REPOSITORY_ICON} ${branchIndicator}`,
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `*Author:* ${GIT_CLONE_COMMIT_AUTHOR_NAME}`,
        },
      ],
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${GIT_CLONE_COMMIT_MESSAGE_SUBJECT_WITH_LINK}${commitMessageSeparator}${GIT_CLONE_COMMIT_MESSAGE_BODY}`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `<${GITHUB_REPOSITORY_URL}/commit/${GIT_CLONE_COMMIT_HASH}|More Info>`,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*App*\n<${GITHUB_REPOSITORY_URL}|${GITHUB_REPO_NAME}>`,
        },
        {
          type: 'mrkdwn',
          text: `*Branch*\n${GIT_BRANCH}`,
        },
        {
          type: 'mrkdwn',
          text: `*Workflow*\n<${BUILD_URL}|${TRIGGERED_WORKFLOW_ID}>`,
        },
      ],
    },
  ],
};

process.stdout.write(JSON.stringify(data));
