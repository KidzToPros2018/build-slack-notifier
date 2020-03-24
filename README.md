# build-slack-notifier

Creates data for slack hook used to notify after deployment succeeded

## Works with:
* github actions
* codepush
* bitrise

## Only github supported

Because it assumes link structure as:
* `${GITHUB_REPOSITORY_URL}/pull/${PULL_REQUEST_ID}`
* `${GITHUB_REPOSITORY_URL}/commit/${COMMIT_HASH_ID}`

## How to use

1. Set up env variables including `SLACK_INCOMING_HOOK`

2. Run the hook with npx
```bash
curl -X POST -H 'Content-type: application/json' --data "$(npx github:KidzToPros2018/build-slack-notifier)" "$SLACK_INCOMING_HOOK"
```

### Github actions example

```yaml
name: CI

on:
  push:
    branches:
    - 'staging'
    - 'master'

jobs:
  notify-slack:
    name: Notify Slack
    runs-on: ubuntu-latest

    steps:
    - name: Notify Slack
      env:
        # used by build-slack-notifier
        GITHUB_REPOSITORY_ICON: ":desktop_computer:"
        GIT_CLONE_COMMIT_AUTHOR_NAME: ${{ github.event.pusher.name }}
        GIT_CLONE_COMMIT_MESSAGE: ${{ github.event.head_commit.message }}
        GITHUB_REPOSITORY_URL: https://github.com/KidzToPros2018/my-repo-name
        GITHUB_REPOSITORY: ${{ github.repository }}
        GIT_CLONE_COMMIT_HASH: ${{ github.sha }}
        GITHUB_GIT_REF: ${{ github.ref }}

        BUILD_URL: 'https://github.com/KidzToPros2018/my-repo-name/actions/runs/${{ github.run_id }}'
        TRIGGERED_WORKFLOW_ID: ${{ github.workflow }}

        SLACK_INCOMING_HOOK: ${{ secrets.SLACK_INCOMING_HOOK }}
      run: |
        curl -X POST -H 'Content-type: application/json' --data "$(npx github:KidzToPros2018/build-slack-notifier)" "$SLACK_INCOMING_HOOK"
```

