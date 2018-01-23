# Changelog

## 1.0.0
- Initial extraction from stencil-paper

## 2.0.0
- Change error handling to throw custom errors instead of swallowing the error
  and logging. This gives the caller the opportunity to take action based on
  the error condition.
- Remove logging interface since we don't use it anymore.
