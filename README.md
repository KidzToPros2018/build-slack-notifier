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

2. Run the hook
```bash
curl -X POST -H 'Content-type: application/json' --data "$(./scripts/get_ktp_build_notifier_data.js)" "$SLACK_INCOMING_HOOK"
```