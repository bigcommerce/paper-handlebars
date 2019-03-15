# Changelog

## 4.0.6
- Bump handlebars-helpers.

## 4.0.5
- Fix regex performance to match precompiled templates.

## 4.0.4
- Added trimming of all '.' and '/' from begginig of cdn path (not full paths)

## 4.0.3
- Fix resourceHints to use https for font providers

## 4.0.2
- Fix region helper not rendering with an empty page content

## 4.0.1
- Fix cdnify to avoid double slash in the genrated url.

## 4.0.0
- Change render and renderString to return Promises instead of synchronous results.

## 3.0.3
- Add support for gtnum in if helper.

## 3.0.2
- Add getFontLoaderConfig and resourceHints helpers.

## 3.0.1
- Fix cdn and stylesheet helpers to pull latest siteSettings and themeSettings

## 3.0.0
- Change addContent() to setContent() for consistency with other setters.
- Add getter and setter for siteSettings and themeSettings, and change helper context
  to use a bound function for accessing these data to allow for deferred setting.
  Callers should no longer access siteSettings and themeSettings directly.

## 2.0.0
- Change error handling to throw custom errors instead of swallowing the error
  and logging. This gives the caller the opportunity to take action based on
  the error condition.
- Remove logging interface since we don't use it anymore.

## 1.0.0
- Initial extraction from stencil-paper
